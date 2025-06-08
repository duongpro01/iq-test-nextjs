import { 
  SupportedLocale, 
  LocalizedQuestion, 
  CulturalBiasMetrics, 
  LocalePerformance, 
  BiasFlag 
} from '@/types/i18n';

interface ResponseData {
  questionId: string;
  locale: SupportedLocale;
  isCorrect: boolean;
  responseTime: number;
  difficulty: number;
  userId?: string;
  timestamp: Date;
  userAgent?: string;
  country?: string;
}

interface BiasAnalysisResult {
  overallBias: number; // 0-1, where 1 is highly biased
  flaggedQuestions: string[];
  recommendations: string[];
  culturalMetrics: CulturalBiasMetrics;
}

export class CulturalBiasEngine {
  private responses: ResponseData[] = [];
  private biasThresholds = {
    performance: 0.15, // 15% performance difference threshold
    responseTime: 0.25, // 25% response time difference threshold
    difficulty: 0.20, // 20% difficulty variance threshold
    sampleSize: 30, // Minimum sample size for analysis
  };

  constructor() {
    this.loadStoredData();
  }

  // Record a response for bias analysis
  recordResponse(data: ResponseData): void {
    this.responses.push({
      ...data,
      timestamp: new Date(),
    });
    
    // Store in localStorage for persistence
    this.saveData();
    
    // Trigger analysis if we have enough data
    if (this.responses.length % 100 === 0) {
      this.analyzeAllQuestions();
    }
  }

  // Analyze bias for a specific question
  analyzeQuestionBias(questionId: string): CulturalBiasMetrics | null {
    const questionResponses = this.responses.filter(r => r.questionId === questionId);
    
    if (questionResponses.length < this.biasThresholds.sampleSize) {
      return null;
    }

    const localePerformance: Record<SupportedLocale, LocalePerformance> = {} as any;
    const biasFlags: BiasFlag[] = [];

    // Calculate performance by locale
    const locales = [...new Set(questionResponses.map(r => r.locale))];
    
    for (const locale of locales) {
      const localeResponses = questionResponses.filter(r => r.locale === locale);
      
      if (localeResponses.length < 10) continue; // Skip locales with insufficient data
      
      const correctResponses = localeResponses.filter(r => r.isCorrect);
      const averageScore = correctResponses.length / localeResponses.length;
      const averageResponseTime = localeResponses.reduce((sum, r) => sum + r.responseTime, 0) / localeResponses.length;
      const difficultyVariance = this.calculateVariance(localeResponses.map(r => r.difficulty));
      
      localePerformance[locale] = {
        locale,
        averageScore,
        responseTime: averageResponseTime,
        sampleSize: localeResponses.length,
        difficultyVariance,
        flagged: false,
      };
    }

    // Detect bias patterns
    const performanceValues = Object.values(localePerformance).map(p => p.averageScore);
    const responseTimeValues = Object.values(localePerformance).map(p => p.responseTime);
    
    const performanceVariance = this.calculateVariance(performanceValues);
    const responseTimeVariance = this.calculateVariance(responseTimeValues);
    
    // Flag potential bias
    if (performanceVariance > this.biasThresholds.performance) {
      const affectedLocales = Object.entries(localePerformance)
        .filter(([_, perf]) => Math.abs(perf.averageScore - this.mean(performanceValues)) > this.biasThresholds.performance)
        .map(([locale, _]) => locale as SupportedLocale);
      
      biasFlags.push({
        type: 'cultural',
        severity: performanceVariance > 0.3 ? 'high' : 'medium',
        description: `Significant performance variance across locales (${(performanceVariance * 100).toFixed(1)}%)`,
        affectedLocales,
        detectedAt: new Date(),
        resolved: false,
      });
      
      // Mark affected locales as flagged
      affectedLocales.forEach(locale => {
        if (localePerformance[locale]) {
          localePerformance[locale].flagged = true;
        }
      });
    }

    if (responseTimeVariance > this.biasThresholds.responseTime) {
      const affectedLocales = Object.entries(localePerformance)
        .filter(([_, perf]) => Math.abs(perf.responseTime - this.mean(responseTimeValues)) > this.biasThresholds.responseTime * this.mean(responseTimeValues))
        .map(([locale, _]) => locale as SupportedLocale);
      
      biasFlags.push({
        type: 'linguistic',
        severity: responseTimeVariance > 0.4 ? 'high' : 'medium',
        description: `Significant response time variance across locales (${(responseTimeVariance * 100).toFixed(1)}%)`,
        affectedLocales,
        detectedAt: new Date(),
        resolved: false,
      });
    }

    // Check for educational bias (difficulty perception)
    const difficultyVariances = Object.values(localePerformance).map(p => p.difficultyVariance);
    const avgDifficultyVariance = this.mean(difficultyVariances);
    
    if (avgDifficultyVariance > this.biasThresholds.difficulty) {
      biasFlags.push({
        type: 'educational',
        severity: avgDifficultyVariance > 0.3 ? 'high' : 'medium',
        description: `High difficulty perception variance across locales`,
        affectedLocales: Object.keys(localePerformance) as SupportedLocale[],
        detectedAt: new Date(),
        resolved: false,
      });
    }

    return {
      localePerformance,
      biasFlags,
      lastAnalyzed: new Date(),
      confidenceLevel: Math.min(questionResponses.length / 100, 1), // Confidence based on sample size
    };
  }

  // Analyze all questions for bias
  analyzeAllQuestions(): BiasAnalysisResult {
    const questionIds = [...new Set(this.responses.map(r => r.questionId))];
    const flaggedQuestions: string[] = [];
    const allBiasFlags: BiasFlag[] = [];
    let totalBiasScore = 0;
    let analyzedQuestions = 0;

    for (const questionId of questionIds) {
      const metrics = this.analyzeQuestionBias(questionId);
      
      if (metrics) {
        analyzedQuestions++;
        
        if (metrics.biasFlags.length > 0) {
          flaggedQuestions.push(questionId);
          allBiasFlags.push(...metrics.biasFlags);
          
          // Calculate bias score for this question
          const questionBiasScore = metrics.biasFlags.reduce((sum, flag) => {
            const severityWeight = { low: 0.25, medium: 0.5, high: 0.75, critical: 1.0 };
            return sum + severityWeight[flag.severity];
          }, 0) / metrics.biasFlags.length;
          
          totalBiasScore += questionBiasScore;
        }
      }
    }

    const overallBias = analyzedQuestions > 0 ? totalBiasScore / analyzedQuestions : 0;
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(allBiasFlags, overallBias);
    
    // Create aggregate cultural metrics
    const culturalMetrics: CulturalBiasMetrics = {
      localePerformance: this.aggregateLocalePerformance(),
      biasFlags: allBiasFlags,
      lastAnalyzed: new Date(),
      confidenceLevel: Math.min(this.responses.length / 1000, 1),
    };

    return {
      overallBias,
      flaggedQuestions,
      recommendations,
      culturalMetrics,
    };
  }

  // Generate recommendations based on bias analysis
  private generateRecommendations(biasFlags: BiasFlag[], overallBias: number): string[] {
    const recommendations: string[] = [];
    
    if (overallBias > 0.3) {
      recommendations.push('Consider comprehensive review of question translations and cultural adaptations');
    }
    
    const culturalFlags = biasFlags.filter(f => f.type === 'cultural');
    if (culturalFlags.length > 0) {
      recommendations.push('Review questions for cultural references that may disadvantage certain groups');
      recommendations.push('Consider alternative question formats that are more culturally neutral');
    }
    
    const linguisticFlags = biasFlags.filter(f => f.type === 'linguistic');
    if (linguisticFlags.length > 0) {
      recommendations.push('Review translation quality and complexity across languages');
      recommendations.push('Consider adjusting time limits for languages with longer text');
    }
    
    const educationalFlags = biasFlags.filter(f => f.type === 'educational');
    if (educationalFlags.length > 0) {
      recommendations.push('Review questions for educational system bias');
      recommendations.push('Consider alternative approaches to testing the same cognitive skills');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring for bias patterns as more data becomes available');
    }
    
    return recommendations;
  }

  // Aggregate performance across all locales
  private aggregateLocalePerformance(): Record<SupportedLocale, LocalePerformance> {
    const localePerformance: Record<SupportedLocale, LocalePerformance> = {} as any;
    const locales = [...new Set(this.responses.map(r => r.locale))];
    
    for (const locale of locales) {
      const localeResponses = this.responses.filter(r => r.locale === locale);
      
      if (localeResponses.length < 10) continue;
      
      const correctResponses = localeResponses.filter(r => r.isCorrect);
      const averageScore = correctResponses.length / localeResponses.length;
      const averageResponseTime = localeResponses.reduce((sum, r) => sum + r.responseTime, 0) / localeResponses.length;
      const difficultyVariance = this.calculateVariance(localeResponses.map(r => r.difficulty));
      
      localePerformance[locale] = {
        locale,
        averageScore,
        responseTime: averageResponseTime,
        sampleSize: localeResponses.length,
        difficultyVariance,
        flagged: false,
      };
    }
    
    return localePerformance;
  }

  // Get bias report for a specific locale
  getLocaleReport(locale: SupportedLocale): {
    performance: LocalePerformance | null;
    comparisonToAverage: {
      scoreRatio: number;
      timeRatio: number;
      rank: number;
    };
    flaggedQuestions: string[];
  } {
    const allPerformance = this.aggregateLocalePerformance();
    const localePerformance = allPerformance[locale] || null;
    
    if (!localePerformance) {
      return {
        performance: null,
        comparisonToAverage: { scoreRatio: 1, timeRatio: 1, rank: 0 },
        flaggedQuestions: [],
      };
    }
    
    const allScores = Object.values(allPerformance).map(p => p.averageScore);
    const allTimes = Object.values(allPerformance).map(p => p.responseTime);
    
    const avgScore = this.mean(allScores);
    const avgTime = this.mean(allTimes);
    
    const scoreRatio = localePerformance.averageScore / avgScore;
    const timeRatio = localePerformance.responseTime / avgTime;
    
    // Calculate rank
    const sortedByScore = Object.values(allPerformance)
      .sort((a, b) => b.averageScore - a.averageScore);
    const rank = sortedByScore.findIndex(p => p.locale === locale) + 1;
    
    // Find flagged questions for this locale
    const flaggedQuestions = this.responses
      .filter(r => r.locale === locale)
      .map(r => r.questionId)
      .filter(questionId => {
        const metrics = this.analyzeQuestionBias(questionId);
        return metrics?.biasFlags.some(flag => 
          flag.affectedLocales.includes(locale)
        ) || false;
      });
    
    return {
      performance: localePerformance,
      comparisonToAverage: { scoreRatio, timeRatio, rank },
      flaggedQuestions: [...new Set(flaggedQuestions)],
    };
  }

  // Utility functions
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = this.mean(values);
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return this.mean(squaredDiffs);
  }

  private mean(values: number[]): number {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  // Data persistence
  private saveData(): void {
    try {
      const data = {
        responses: this.responses.slice(-1000), // Keep only last 1000 responses
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('cultural-bias-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cultural bias data:', error);
    }
  }

  private loadStoredData(): void {
    try {
      const stored = localStorage.getItem('cultural-bias-data');
      if (stored) {
        const data = JSON.parse(stored);
        this.responses = data.responses.map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Failed to load cultural bias data:', error);
      this.responses = [];
    }
  }

  // Export data for analysis
  exportData(): {
    responses: ResponseData[];
    analysis: BiasAnalysisResult;
    metadata: {
      totalResponses: number;
      locales: SupportedLocale[];
      dateRange: { start: Date; end: Date };
    };
  } {
    const analysis = this.analyzeAllQuestions();
    const locales = [...new Set(this.responses.map(r => r.locale))];
    const timestamps = this.responses.map(r => r.timestamp);
    
    return {
      responses: this.responses,
      analysis,
      metadata: {
        totalResponses: this.responses.length,
        locales,
        dateRange: {
          start: new Date(Math.min(...timestamps.map(t => t.getTime()))),
          end: new Date(Math.max(...timestamps.map(t => t.getTime()))),
        },
      },
    };
  }

  // Clear all data
  clearData(): void {
    this.responses = [];
    localStorage.removeItem('cultural-bias-data');
  }
}

// Singleton instance
export const culturalBiasEngine = new CulturalBiasEngine(); 
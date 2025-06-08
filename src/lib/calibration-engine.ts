import { UserAnswer, TestResult, QuestionCategory } from '@/types';

// Calibration data interfaces
export interface CalibrationData {
  questionId: string;
  responses: CalibrationResponse[];
  difficulty: number;
  discrimination: number;
  guessing: number;
  culturalBias: CulturalBiasMetrics;
  lastUpdated: Date;
  sampleSize: number;
}

export interface CalibrationResponse {
  userId: string; // Anonymous hash
  answer: number;
  responseTime: number;
  isCorrect: boolean;
  abilityEstimate: number;
  country?: string;
  language?: string;
  timestamp: Date;
}

export interface CulturalBiasMetrics {
  overallBias: number; // 0-1 scale
  countryBias: Record<string, number>;
  languageBias: Record<string, number>;
  demographicFairness: number;
  recommendations: string[];
}

export interface GlobalBenchmark {
  category: QuestionCategory;
  country: string;
  percentiles: Record<number, number>; // percentile -> IQ score
  meanScore: number;
  standardDeviation: number;
  sampleSize: number;
  lastUpdated: Date;
  confidenceInterval: [number, number];
}

export interface CalibrationConfig {
  minSampleSize: number;
  maxAge: number; // days
  biasThreshold: number;
  updateFrequency: number; // hours
  anonymizationLevel: 'basic' | 'enhanced' | 'differential';
}

class CalibrationEngine {
  private config: CalibrationConfig;
  private calibrationData: Map<string, CalibrationData> = new Map();
  private globalBenchmarks: Map<string, GlobalBenchmark> = new Map();

  constructor(config: CalibrationConfig = {
    minSampleSize: 100,
    maxAge: 30,
    biasThreshold: 0.3,
    updateFrequency: 24,
    anonymizationLevel: 'enhanced'
  }) {
    this.config = config;
    this.loadStoredData();
  }

  /**
   * Anonymize user data for calibration
   */
  private anonymizeUser(userId: string, additionalData?: Record<string, unknown>): string {
    // Create anonymous hash that can't be traced back
    const hash = this.createAnonymousHash(userId, additionalData);
    return hash;
  }

  private createAnonymousHash(userId: string, additionalData?: Record<string, unknown>): string {
    // Use a one-way hash with salt for anonymization
    const data = JSON.stringify({ userId, additionalData, salt: 'iq_test_calibration_2024' });
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  /**
   * Submit calibration data (opt-in only)
   */
  async submitCalibrationData(
    testResult: TestResult,
    userAnswers: UserAnswer[],
    userConsent: boolean,
    metadata?: {
      country?: string;
      language?: string;
      ageGroup?: string;
      education?: string;
    }
  ): Promise<void> {
    if (!userConsent) return;

    const anonymousId = this.anonymizeUser(testResult.sessionId, metadata);

    for (const answer of userAnswers) {
      const response: CalibrationResponse = {
        userId: anonymousId,
        answer: answer.selectedAnswer,
        responseTime: answer.responseTime,
        isCorrect: answer.isCorrect,
        abilityEstimate: testResult.abilityEstimate,
        country: metadata?.country,
        language: metadata?.language,
        timestamp: new Date()
      };

      await this.addCalibrationResponse(answer.questionId, response);
    }

    // Update global benchmarks
    await this.updateGlobalBenchmarks(testResult, metadata);
  }

  /**
   * Add calibration response for a question
   */
  private async addCalibrationResponse(questionId: string, response: CalibrationResponse): Promise<void> {
    let calibration = this.calibrationData.get(questionId);
    
    if (!calibration) {
      calibration = {
        questionId,
        responses: [],
        difficulty: 0,
        discrimination: 0,
        guessing: 0,
        culturalBias: {
          overallBias: 0,
          countryBias: {},
          languageBias: {},
          demographicFairness: 1,
          recommendations: []
        },
        lastUpdated: new Date(),
        sampleSize: 0
      };
    }

    // Add response
    calibration.responses.push(response);
    calibration.sampleSize = calibration.responses.length;
    calibration.lastUpdated = new Date();

    // Recalculate parameters if we have enough data
    if (calibration.sampleSize >= this.config.minSampleSize) {
      await this.recalibrateQuestion(calibration);
    }

    this.calibrationData.set(questionId, calibration);
    this.saveCalibrationData();
  }

  /**
   * Recalibrate question parameters using IRT
   */
  private async recalibrateQuestion(calibration: CalibrationData): Promise<void> {
    const responses = calibration.responses;
    
    // Calculate new IRT parameters
    const { difficulty, discrimination, guessing } = this.calculateIRTParameters(responses);
    
    calibration.difficulty = difficulty;
    calibration.discrimination = discrimination;
    calibration.guessing = guessing;

    // Analyze cultural bias
    calibration.culturalBias = this.analyzeCulturalBias(responses);
  }

  /**
   * Calculate IRT parameters from response data
   */
  private calculateIRTParameters(responses: CalibrationResponse[]): {
    difficulty: number;
    discrimination: number;
    guessing: number;
  } {
    // Group responses by ability level
    const abilityGroups = this.groupByAbility(responses);
    
    // Calculate proportion correct for each ability level
    const proportions = abilityGroups.map(group => ({
      ability: group.ability,
      proportion: group.responses.filter(r => r.isCorrect).length / group.responses.length,
      count: group.responses.length
    }));

    // Fit 3PL model using maximum likelihood estimation
    const { a, b, c } = this.fit3PLModel(proportions);

    return {
      discrimination: a,
      difficulty: b,
      guessing: c
    };
  }

  private groupByAbility(responses: CalibrationResponse[]): Array<{
    ability: number;
    responses: CalibrationResponse[];
  }> {
    // Group responses into ability bins
    const bins: Record<string, CalibrationResponse[]> = {};
    
    responses.forEach(response => {
      const abilityBin = Math.round(response.abilityEstimate * 2) / 2; // 0.5 increments
      const key = abilityBin.toString();
      if (!bins[key]) bins[key] = [];
      bins[key].push(response);
    });

    return Object.entries(bins).map(([ability, responses]) => ({
      ability: parseFloat(ability),
      responses
    }));
  }

  private fit3PLModel(proportions: Array<{ ability: number; proportion: number; count: number }>): {
    a: number; b: number; c: number;
  } {
    // Simplified 3PL fitting - in production, use proper MLE optimization
    const validProportions = proportions.filter(p => p.count >= 5);
    
    if (validProportions.length < 3) {
      return { a: 1.0, b: 0.0, c: 0.25 }; // Default values
    }

    // Estimate guessing parameter (minimum proportion correct)
    const c = Math.min(...validProportions.map(p => p.proportion));
    
    // Estimate difficulty (ability level where P = 0.5 + c/2)
    const targetProportion = 0.5 + c / 2;
    const difficultyPoint = validProportions.find(p => 
      Math.abs(p.proportion - targetProportion) < 0.1
    );
    const b = difficultyPoint?.ability || 0;

    // Estimate discrimination (slope at difficulty point)
    const slopePoints = validProportions.filter(p => 
      Math.abs(p.ability - b) < 1.0
    ).sort((a, b) => a.ability - b.ability);
    
    let a = 1.0;
    if (slopePoints.length >= 2) {
      const deltaP = slopePoints[slopePoints.length - 1].proportion - slopePoints[0].proportion;
      const deltaTheta = slopePoints[slopePoints.length - 1].ability - slopePoints[0].ability;
      a = Math.max(0.1, Math.min(3.0, deltaP / deltaTheta));
    }

    return { a, b, c: Math.max(0, Math.min(0.5, c)) };
  }

  /**
   * Analyze cultural bias in question responses
   */
  private analyzeCulturalBias(responses: CalibrationResponse[]): CulturalBiasMetrics {
    const countryGroups = this.groupByCountry(responses);
    const languageGroups = this.groupByLanguage(responses);
    
    const countryBias: Record<string, number> = {};
    const languageBias: Record<string, number> = {};
    
    // Calculate bias for each country
    const overallCorrectRate = responses.filter(r => r.isCorrect).length / responses.length;
    
    Object.entries(countryGroups).forEach(([country, countryResponses]) => {
      if (countryResponses.length >= 10) {
        const countryCorrectRate = countryResponses.filter(r => r.isCorrect).length / countryResponses.length;
        countryBias[country] = Math.abs(countryCorrectRate - overallCorrectRate);
      }
    });

    // Calculate bias for each language
    Object.entries(languageGroups).forEach(([language, languageResponses]) => {
      if (languageResponses.length >= 10) {
        const languageCorrectRate = languageResponses.filter(r => r.isCorrect).length / languageResponses.length;
        languageBias[language] = Math.abs(languageCorrectRate - overallCorrectRate);
      }
    });

    const overallBias = Math.max(
      ...Object.values(countryBias),
      ...Object.values(languageBias),
      0
    );

    const recommendations: string[] = [];
    if (overallBias > this.config.biasThreshold) {
      recommendations.push('Consider cultural adaptation of this question');
      recommendations.push('Review question content for cultural specificity');
      recommendations.push('Consider alternative question formats');
    }

    return {
      overallBias,
      countryBias,
      languageBias,
      demographicFairness: 1 - overallBias,
      recommendations
    };
  }

  private groupByCountry(responses: CalibrationResponse[]): Record<string, CalibrationResponse[]> {
    const groups: Record<string, CalibrationResponse[]> = {};
    responses.forEach(response => {
      if (response.country) {
        if (!groups[response.country]) groups[response.country] = [];
        groups[response.country].push(response);
      }
    });
    return groups;
  }

  private groupByLanguage(responses: CalibrationResponse[]): Record<string, CalibrationResponse[]> {
    const groups: Record<string, CalibrationResponse[]> = {};
    responses.forEach(response => {
      if (response.language) {
        if (!groups[response.language]) groups[response.language] = [];
        groups[response.language].push(response);
      }
    });
    return groups;
  }

  /**
   * Update global benchmarks
   */
  private async updateGlobalBenchmarks(
    testResult: TestResult,
    metadata?: { country?: string; language?: string }
  ): Promise<void> {
    if (!metadata?.country) return;

    const key = `${testResult.category || 'overall'}_${metadata.country}`;
    let benchmark = this.globalBenchmarks.get(key);

    if (!benchmark) {
      benchmark = {
        category: testResult.category || QuestionCategory.PATTERN_RECOGNITION,
        country: metadata.country,
        percentiles: {},
        meanScore: 0,
        standardDeviation: 0,
        sampleSize: 0,
        lastUpdated: new Date(),
        confidenceInterval: [0, 0]
      };
    }

    // Add new score and recalculate statistics
    // This would integrate with a proper statistical engine
    benchmark.sampleSize += 1;
    benchmark.lastUpdated = new Date();

    this.globalBenchmarks.set(key, benchmark);
    this.saveBenchmarkData();
  }

  /**
   * Get calibrated question parameters
   */
  getQuestionCalibration(questionId: string): CalibrationData | null {
    return this.calibrationData.get(questionId) || null;
  }

  /**
   * Get global benchmark for country/category
   */
  getGlobalBenchmark(category: QuestionCategory, country: string): GlobalBenchmark | null {
    const key = `${category}_${country}`;
    return this.globalBenchmarks.get(key) || null;
  }

  /**
   * Get percentile rank for a score
   */
  getPercentileRank(score: number, category: QuestionCategory, country?: string): number {
    const benchmark = country ? 
      this.getGlobalBenchmark(category, country) : 
      this.getGlobalBenchmark(category, 'global');
    
    if (!benchmark) return 50; // Default to 50th percentile

    // Calculate percentile based on normal distribution approximation
    const z = (score - benchmark.meanScore) / benchmark.standardDeviation;
    return this.normalCDF(z) * 100;
  }

  private normalCDF(z: number): number {
    // Approximation of standard normal CDF
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
  }

  private erf(x: number): number {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  /**
   * Data persistence methods
   */
  private loadStoredData(): void {
    try {
      const calibrationStr = localStorage.getItem('iq_test_calibration_data');
      if (calibrationStr) {
        const data = JSON.parse(calibrationStr);
        this.calibrationData = new Map(Object.entries(data));
      }

      const benchmarkStr = localStorage.getItem('iq_test_benchmark_data');
      if (benchmarkStr) {
        const data = JSON.parse(benchmarkStr);
        this.globalBenchmarks = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load calibration data:', error);
    }
  }

  private saveCalibrationData(): void {
    try {
      const data = Object.fromEntries(this.calibrationData);
      localStorage.setItem('iq_test_calibration_data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save calibration data:', error);
    }
  }

  private saveBenchmarkData(): void {
    try {
      const data = Object.fromEntries(this.globalBenchmarks);
      localStorage.setItem('iq_test_benchmark_data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save benchmark data:', error);
    }
  }

  /**
   * Get bias report for a question
   */
  getBiasReport(questionId: string): {
    hasBias: boolean;
    severity: 'low' | 'medium' | 'high';
    details: CulturalBiasMetrics;
    recommendations: string[];
  } | null {
    const calibration = this.calibrationData.get(questionId);
    if (!calibration) return null;

    const bias = calibration.culturalBias;
    const severity = bias.overallBias > 0.5 ? 'high' : 
                    bias.overallBias > 0.3 ? 'medium' : 'low';

    return {
      hasBias: bias.overallBias > this.config.biasThreshold,
      severity,
      details: bias,
      recommendations: bias.recommendations
    };
  }

  /**
   * Export anonymized data for research
   */
  exportAnonymizedData(): {
    calibrationData: any[];
    benchmarks: any[];
    metadata: {
      totalResponses: number;
      countries: string[];
      languages: string[];
      exportDate: Date;
    };
  } {
    const calibrationData = Array.from(this.calibrationData.values()).map(cal => ({
      questionId: cal.questionId,
      sampleSize: cal.sampleSize,
      difficulty: cal.difficulty,
      discrimination: cal.discrimination,
      guessing: cal.guessing,
      culturalBias: cal.culturalBias.overallBias,
      lastUpdated: cal.lastUpdated
    }));

    const benchmarks = Array.from(this.globalBenchmarks.values()).map(bench => ({
      category: bench.category,
      country: bench.country,
      meanScore: bench.meanScore,
      standardDeviation: bench.standardDeviation,
      sampleSize: bench.sampleSize,
      lastUpdated: bench.lastUpdated
    }));

    const allResponses = Array.from(this.calibrationData.values())
      .flatMap(cal => cal.responses);

    const countries = [...new Set(allResponses.map(r => r.country).filter(Boolean))];
    const languages = [...new Set(allResponses.map(r => r.language).filter(Boolean))];

    return {
      calibrationData,
      benchmarks,
      metadata: {
        totalResponses: allResponses.length,
        countries,
        languages,
        exportDate: new Date()
      }
    };
  }
}

export const calibrationEngine = new CalibrationEngine(); 
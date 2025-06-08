import { Question, BayesianEstimate, IRTParameters, UserAnswer } from '@/types';

/**
 * Item Response Theory (IRT) Engine
 * Implements 3-Parameter Logistic Model with Bayesian estimation
 * Based on scientific psychometric standards used in WAIS, Raven's, and Mensa tests
 */

export class IRTEngine {
  private priorMean: number;
  private priorVariance: number;
  private maxIterations: number;
  private convergenceCriterion: number;

  constructor(
    priorMean: number = 0.0,
    priorVariance: number = 1.0,
    maxIterations: number = 50,
    convergenceCriterion: number = 0.001
  ) {
    this.priorMean = priorMean;
    this.priorVariance = priorVariance;
    this.maxIterations = maxIterations;
    this.convergenceCriterion = convergenceCriterion;
  }

  /**
   * 3-Parameter Logistic Model
   * P(θ) = c + (1 - c) / (1 + exp(-a(θ - b)))
   */
  calculateProbability(ability: number, item: IRTParameters): number {
    const { discrimination: a, difficulty: b, guessing: c } = item;
    const exponent = -a * (ability - b);
    const probability = c + (1 - c) / (1 + Math.exp(exponent));
    return Math.max(0.001, Math.min(0.999, probability)); // Bound to prevent numerical issues
  }

  /**
   * Calculate Fisher Information for an item
   * I(θ) = a² * P'(θ)² / [P(θ) * (1 - P(θ))]
   */
  calculateInformation(ability: number, item: IRTParameters): number {
    const { discrimination: a, difficulty: b, guessing: c } = item;
    const prob = this.calculateProbability(ability, item);
    
    // First derivative of probability function
    const exponent = -a * (ability - b);
    const expTerm = Math.exp(exponent);
    const denominator = 1 + expTerm;
    const pDerivative = a * (1 - c) * expTerm / (denominator * denominator);
    
    // Fisher Information
    const information = (pDerivative * pDerivative) / (prob * (1 - prob));
    return Math.max(0.001, information); // Prevent division by zero
  }

  /**
   * Calculate test information (sum of item informations)
   */
  calculateTestInformation(ability: number, items: IRTParameters[]): number {
    return items.reduce((sum, item) => sum + this.calculateInformation(ability, item), 0);
  }

  /**
   * Calculate standard error of measurement
   * SE(θ) = 1 / √I(θ)
   */
  calculateStandardError(ability: number, items: IRTParameters[]): number {
    const information = this.calculateTestInformation(ability, items);
    return 1 / Math.sqrt(Math.max(0.001, information));
  }

  /**
   * Maximum Likelihood Estimation (MLE) of ability
   */
  estimateAbilityMLE(responses: { item: IRTParameters; correct: boolean }[]): BayesianEstimate {
    let ability = 0.0; // Starting estimate
    let previousAbility = ability;
    
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      let firstDerivative = 0;
      let secondDerivative = 0;
      
      for (const response of responses) {
        const prob = this.calculateProbability(ability, response.item);
        const { discrimination: a, difficulty: b, guessing: c } = response.item;
        
        // Calculate derivatives for Newton-Raphson
        const exponent = -a * (ability - b);
        const expTerm = Math.exp(exponent);
        const denominator = 1 + expTerm;
        
        const pDerivative = a * (1 - c) * expTerm / (denominator * denominator);
        const pSecondDerivative = -a * a * (1 - c) * expTerm * (expTerm - 1) / (denominator * denominator * denominator);
        
        const residual = response.correct ? 1 - prob : -prob;
        
        firstDerivative += residual * pDerivative / (prob * (1 - prob));
        secondDerivative += (pSecondDerivative * residual - pDerivative * pDerivative * (1 - 2 * prob)) / (prob * (1 - prob));
      }
      
      // Newton-Raphson update
      if (Math.abs(secondDerivative) > 0.001) {
        ability = ability - firstDerivative / secondDerivative;
      }
      
      // Check convergence
      if (Math.abs(ability - previousAbility) < this.convergenceCriterion) {
        break;
      }
      
      previousAbility = ability;
      
      // Bound ability estimate
      ability = Math.max(-4, Math.min(4, ability));
    }
    
    const items = responses.map(r => r.item);
    const standardError = this.calculateStandardError(ability, items);
    const information = this.calculateTestInformation(ability, items);
    
    return {
      ability,
      standardError,
      posteriorVariance: 1 / information,
      informationGained: information
    };
  }

  /**
   * Bayesian Estimation (EAP - Expected A Posteriori)
   */
  estimateAbilityBayesian(responses: { item: IRTParameters; correct: boolean }[]): BayesianEstimate {
    const quadraturePoints = this.generateQuadraturePoints(-4, 4, 41);
    let numerator = 0;
    let denominator = 0;
    let secondMoment = 0;
    
    for (const point of quadraturePoints) {
      const { theta, weight } = point;
      
      // Calculate likelihood
      let likelihood = 1;
      for (const response of responses) {
        const prob = this.calculateProbability(theta, response.item);
        likelihood *= response.correct ? prob : (1 - prob);
      }
      
      // Prior density (normal distribution)
      const priorDensity = this.normalPDF(theta, this.priorMean, Math.sqrt(this.priorVariance));
      
      // Posterior weight
      const posteriorWeight = likelihood * priorDensity * weight;
      
      numerator += theta * posteriorWeight;
      secondMoment += theta * theta * posteriorWeight;
      denominator += posteriorWeight;
    }
    
    const ability = numerator / denominator;
    const posteriorVariance = (secondMoment / denominator) - (ability * ability);
    const standardError = Math.sqrt(posteriorVariance);
    
    const items = responses.map(r => r.item);
    const information = this.calculateTestInformation(ability, items);
    
    return {
      ability,
      standardError,
      posteriorVariance,
      informationGained: information
    };
  }

  /**
   * Select next best question using Maximum Information criterion
   */
  selectNextQuestion(
    currentAbility: number,
    availableQuestions: Question[],
    answeredQuestions: Set<string>,
    domainConstraints?: Record<string, number>
  ): Question | null {
    const candidates = availableQuestions.filter(q => !answeredQuestions.has(q.id));
    
    if (candidates.length === 0) return null;
    
    let bestQuestion: Question | null = null;
    let maxInformation = -1;
    
    for (const question of candidates) {
      // Check domain constraints if provided
      if (domainConstraints && domainConstraints[question.category] <= 0) {
        continue;
      }
      
      const irtParams: IRTParameters = {
        discrimination: question.a,
        difficulty: question.b,
        guessing: question.c
      };
      
      const information = this.calculateInformation(currentAbility, irtParams);
      
      if (information > maxInformation) {
        maxInformation = information;
        bestQuestion = question;
      }
    }
    
    return bestQuestion;
  }

  /**
   * Convert ability estimate (θ) to IQ score
   * IQ = 100 + 15 * θ
   */
  abilityToIQ(ability: number): number {
    return Math.round(100 + 15 * ability);
  }

  /**
   * Convert IQ score to ability estimate (θ)
   * θ = (IQ - 100) / 15
   */
  iqToAbility(iq: number): number {
    return (iq - 100) / 15;
  }

  /**
   * Calculate percentile rank from ability estimate
   */
  abilityToPercentile(ability: number): number {
    return Math.round(this.normalCDF(ability, 0, 1) * 100);
  }

  /**
   * Calculate confidence interval for ability estimate
   */
  calculateConfidenceInterval(ability: number, standardError: number, confidence: number = 0.95): [number, number] {
    const zScore = this.getZScore(confidence);
    const margin = zScore * standardError;
    return [ability - margin, ability + margin];
  }

  /**
   * Calculate Cronbach's Alpha for internal consistency
   */
  calculateCronbachAlpha(responses: UserAnswer[]): number {
    const n = responses.length;
    if (n < 2) return 0;
    
    // Calculate item variances
    const itemVariances = responses.map(response => {
      const correct = response.isCorrect ? 1 : 0;
      return correct * (1 - correct); // Variance for binary items
    });
    
    const sumItemVariances = itemVariances.reduce((sum, variance) => sum + variance, 0);
    
    // Calculate total score variance
    const totalScores = [responses.reduce((sum, r) => sum + (r.isCorrect ? 1 : 0), 0)];
    const totalVariance = this.calculateVariance(totalScores);
    
    if (totalVariance === 0) return 0;
    
    const alpha = (n / (n - 1)) * (1 - sumItemVariances / totalVariance);
    return Math.max(0, Math.min(1, alpha));
  }

  /**
   * Detect potential cheating patterns
   */
  detectCheatingPatterns(responses: UserAnswer[]): string[] {
    const patterns: string[] = [];
    
    // Check for suspiciously fast responses
    const fastResponses = responses.filter(r => r.responseTime < 2000).length;
    if (fastResponses > responses.length * 0.3) {
      patterns.push('Unusually fast response times');
    }
    
    // Check for perfect accuracy on difficult questions
    const difficultCorrect = responses.filter(r => r.difficulty > 7 && r.isCorrect).length;
    const difficultTotal = responses.filter(r => r.difficulty > 7).length;
    if (difficultTotal > 0 && difficultCorrect / difficultTotal > 0.9) {
      patterns.push('Perfect accuracy on difficult questions');
    }
    
    // Check for response time consistency (too consistent might indicate automation)
    const responseTimes = responses.map(r => r.responseTime);
    const timeVariance = this.calculateVariance(responseTimes);
    const meanTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const coefficientOfVariation = Math.sqrt(timeVariance) / meanTime;
    
    if (coefficientOfVariation < 0.1) {
      patterns.push('Suspiciously consistent response times');
    }
    
    return patterns;
  }

  // Helper methods
  private generateQuadraturePoints(min: number, max: number, numPoints: number): { theta: number; weight: number }[] {
    const points: { theta: number; weight: number }[] = [];
    const step = (max - min) / (numPoints - 1);
    
    for (let i = 0; i < numPoints; i++) {
      const theta = min + i * step;
      const weight = step; // Simple rectangular rule
      points.push({ theta, weight });
    }
    
    return points;
  }

  private normalPDF(x: number, mean: number, sd: number): number {
    const variance = sd * sd;
    const coefficient = 1 / Math.sqrt(2 * Math.PI * variance);
    const exponent = -((x - mean) * (x - mean)) / (2 * variance);
    return coefficient * Math.exp(exponent);
  }

  private normalCDF(x: number, mean: number = 0, sd: number = 1): number {
    const z = (x - mean) / sd;
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
  }

  private erf(x: number): number {
    // Approximation of error function
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  private getZScore(confidence: number): number {
    // Z-scores for common confidence levels
    const zScores: Record<number, number> = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    return zScores[confidence] || 1.96;
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => (val - mean) * (val - mean));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
}

// Singleton instance
export const irtEngine = new IRTEngine(); 
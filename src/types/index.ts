export interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: number; // 1-10 scale (maps to IRT b parameter)
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  image?: string; // SVG or base64 image data
  timeLimit: number; // seconds
  explanation?: string;
  // IRT 3-Parameter Logistic Model parameters
  a: number; // discrimination parameter (0.5-3.0)
  b: number; // difficulty parameter (-3 to +3 logits)
  c: number; // guessing parameter (0.0-0.5, typically 0.25 for 4-option MCQ)
  // Calibration metadata
  timesAnswered: number;
  timesCorrect: number;
  averageResponseTime: number;
  lastCalibrated: Date;
}

export enum QuestionCategory {
  PATTERN_RECOGNITION = 'Pattern Recognition',
  SPATIAL_REASONING = 'Spatial Reasoning',
  LOGICAL_DEDUCTION = 'Logical Deduction',
  SHORT_TERM_MEMORY = 'Short-Term Memory',
  NUMERICAL_REASONING = 'Numerical Reasoning'
}

export interface TestSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  questions: Question[];
  answers: UserAnswer[];
  globalTimeRemaining: number; // seconds
  // IRT-based ability estimation
  abilityEstimate: number; // θ (theta) - current ability estimate
  abilityHistory: number[]; // track θ progression
  standardError: number; // measurement precision
  isCompleted: boolean;
  isPaused: boolean;
  // Domain balancing
  domainCoverage: Record<QuestionCategory, number>;
  targetDomainBalance: Record<QuestionCategory, number>;
  // Configuration
  config: AdaptiveTestConfig;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  responseTime: number; // milliseconds
  timestamp: Date;
  difficulty: number;
  // IRT-specific data
  abilityBeforeAnswer: number; // θ before this question
  abilityAfterAnswer: number; // θ after this question
  probabilityCorrect: number; // P(θ) from IRT model
  informationValue: number; // Fisher information
  standardErrorBefore: number;
  standardErrorAfter: number;
}

export interface TestResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage
  averageResponseTime: number;
  categoryScores: CategoryScore[];
  // Enhanced IQ scoring
  estimatedIQ: number; // converted from final θ
  finalAbilityEstimate: number; // final θ value
  standardError: number; // measurement precision
  confidenceInterval: [number, number]; // 95% CI for IQ
  percentileRank: number;
  classification: IQClassification;
  // Advanced analytics
  difficultyProgression: number[];
  abilityProgression: number[];
  responseTimeProgression: number[];
  informationCurve: number[];
  domainMastery: Record<QuestionCategory, DomainAnalysis>;
  completionTime: number; // total time in seconds
  // Reliability metrics
  cronbachAlpha: number; // internal consistency
  measurementPrecision: number; // 1 / standardError
  testReliability: number; // overall test reliability
}

export interface CategoryScore {
  category: QuestionCategory;
  correct: number;
  total: number;
  accuracy: number;
  averageResponseTime: number;
  averageDifficulty: number;
  abilityEstimate: number; // domain-specific θ
  standardError: number;
  informationGained: number;
}

export interface DomainAnalysis {
  abilityEstimate: number;
  standardError: number;
  questionsAnswered: number;
  averageInformation: number;
  masteryLevel: 'Novice' | 'Developing' | 'Proficient' | 'Advanced' | 'Expert';
  strengthAreas: string[];
  improvementAreas: string[];
}

export enum IQClassification {
  EXTREMELY_GIFTED = 'Extremely Gifted (160+)',
  HIGHLY_GIFTED = 'Highly Gifted (145-159)',
  MODERATELY_GIFTED = 'Moderately Gifted (130-144)',
  SUPERIOR = 'Superior (120-129)',
  HIGH_AVERAGE = 'High Average (110-119)',
  AVERAGE = 'Average (90-109)',
  LOW_AVERAGE = 'Low Average (80-89)',
  BORDERLINE = 'Borderline (70-79)',
  EXTREMELY_LOW = 'Extremely Low (<70)'
}

export interface AdaptiveTestConfig {
  totalQuestions: number;
  globalTimeLimit: number; // seconds
  questionTimeLimit: number; // seconds
  // IRT-based adaptive parameters
  startingAbility: number; // initial θ estimate (0.0 = average)
  minAbility: number; // minimum θ (-3.0)
  maxAbility: number; // maximum θ (+3.0)
  targetStandardError: number; // stop when SE < this (0.3)
  maxStandardError: number; // maximum allowed SE (1.0)
  // Question selection strategy
  selectionMethod: 'MaxInfo' | 'Bayesian' | 'Hybrid';
  exposureControl: boolean; // prevent overuse of items
  contentBalancing: boolean; // ensure domain coverage
  // Scoring parameters
  priorMean: number; // Bayesian prior mean (0.0)
  priorVariance: number; // Bayesian prior variance (1.0)
  // Time-based adjustments
  penalizeSlowAnswers: boolean;
  penalizeFastAnswers: boolean;
  timeWeightFactor: number; // 0.0-1.0
}

export interface TestStatistics {
  totalTestsTaken: number;
  averageIQ: number;
  averageAbility: number;
  averageCompletionTime: number;
  categoryDistribution: Record<QuestionCategory, number>;
  difficultyDistribution: Record<number, number>;
  abilityDistribution: number[];
  reliabilityMetrics: {
    averageCronbachAlpha: number;
    averageStandardError: number;
    averageMeasurementPrecision: number;
  };
}

export interface ThemeConfig {
  isDarkMode: boolean;
}

export interface QuestionPool {
  [key: string]: Question[]; // keyed by difficulty level
}

// IRT Model interfaces
export interface IRTParameters {
  discrimination: number; // a parameter (0.5-3.0)
  difficulty: number; // b parameter (-3 to +3)
  guessing: number; // c parameter (0.0-0.5)
}

export interface BayesianEstimate {
  ability: number; // θ estimate
  standardError: number; // measurement precision
  posteriorVariance: number; // Bayesian posterior variance
  informationGained: number; // Fisher information
}

export interface QuestionSelectionCriteria {
  targetInformation: number; // desired information level
  domainConstraints: Record<QuestionCategory, number>; // domain balance
  exposureLimits: Record<string, number>; // question usage limits
  difficultyRange: [number, number]; // allowable difficulty range
}

// Analytics interfaces
export interface PerformanceMetrics {
  accuracy: number;
  speed: number; // questions per minute
  consistency: number; // response time variance
  efficiency: number; // information gained per question
  domainBalance: number; // how well balanced across domains
}

export interface ComparisonData {
  populationMean: number;
  populationSD: number;
  ageNorms: Record<string, { mean: number; sd: number }>;
  percentileRanks: number[];
}

// Security and anti-cheating
export interface SecurityMetrics {
  suspiciousPatterns: string[];
  responseTimeAnomalies: number[];
  accuracyAnomalies: number[];
  possibleCheatingIndicators: {
    tooFastResponses: number;
    perfectAccuracyStreak: number;
    unusualPatterns: string[];
  };
}

// Question calibration
export interface CalibrationData {
  questionId: string;
  responses: number;
  correctResponses: number;
  averageAbility: number;
  discriminationEstimate: number;
  difficultyEstimate: number;
  guessingEstimate: number;
  fitStatistics: {
    chiSquare: number;
    pValue: number;
    rmse: number;
  };
}

// Gamification interfaces
export interface IQChallenge {
  id: string;
  type: 'daily' | 'weekly' | 'special';
  title: string;
  description: string;
  difficulty: number;
  timeLimit: number;
  questions: Question[];
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participants: number;
}

export interface ChallengeReward {
  type: 'badge' | 'points' | 'streak' | 'title';
  value: string | number;
  description: string;
  icon?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  level: number;
  totalPoints: number;
  streakDays: number;
  maxStreak: number;
  badges: Badge[];
  achievements: Achievement[];
  domainLevels: Record<QuestionCategory, number>;
  createdAt: Date;
  lastActive: Date;
  preferences: UserPreferences;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  category: QuestionCategory | 'general';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  completedAt?: Date;
  type: 'accuracy' | 'speed' | 'streak' | 'domain' | 'challenge';
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  timeCompleted: number;
  country?: string;
  isCurrentUser?: boolean;
}

export interface Leaderboard {
  type: 'daily' | 'weekly' | 'monthly' | 'allTime';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
  totalParticipants: number;
}

export interface UserPreferences {
  animations: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  showHints: boolean;
  difficultyPreference: 'adaptive' | 'fixed';
  accessibilityMode: AccessibilityMode;
  language: string;
  timezone: string;
}

export interface AccessibilityMode {
  dyslexiaFriendly: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  colorBlindSupport: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
}

// Animation and transition types
export interface QuestionTransition {
  type: 'slide' | 'fade' | 'puzzle' | 'matrix' | 'flip';
  duration: number;
  easing: string;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface ProgressionSystem {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  levelBenefits: LevelBenefit[];
}

export interface LevelBenefit {
  level: number;
  benefit: string;
  unlocked: boolean;
}

// Smart hints and AI assistance
export interface SmartHint {
  id: string;
  questionId: string;
  hintText: string;
  hintType: 'socratic' | 'conceptual' | 'strategic' | 'elimination';
  difficulty: number;
  usageCount: number;
  effectiveness: number;
}

export interface CognitiveWeakness {
  domain: QuestionCategory;
  severity: 'mild' | 'moderate' | 'significant';
  patterns: string[];
  recommendations: TrainingRecommendation[];
}

export interface TrainingRecommendation {
  type: 'mini-game' | 'practice' | 'tutorial' | 'exercise';
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: number;
  targetSkills: string[];
} 
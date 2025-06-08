export interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: number; // 1-10 scale
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  image?: string; // SVG or base64 image data
  timeLimit: number; // seconds
  explanation?: string;
}

export enum QuestionCategory {
  PATTERN_RECOGNITION = 'Pattern Recognition',
  SPATIAL_REASONING = 'Spatial Reasoning',
  LOGIC = 'Logic',
  SHORT_TERM_MEMORY = 'Short-Term Memory',
  MATH_PUZZLES = 'Math Puzzles'
}

export interface TestSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  questions: Question[];
  answers: UserAnswer[];
  globalTimeRemaining: number; // seconds
  difficultyLevel: number; // current adaptive difficulty
  isCompleted: boolean;
  isPaused: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  responseTime: number; // milliseconds
  timestamp: Date;
  difficulty: number;
}

export interface TestResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage
  averageResponseTime: number;
  categoryScores: CategoryScore[];
  estimatedIQ: number;
  percentileRank: number;
  classification: IQClassification;
  difficultyProgression: number[];
  completionTime: number; // total time in seconds
}

export interface CategoryScore {
  category: QuestionCategory;
  correct: number;
  total: number;
  accuracy: number;
  averageResponseTime: number;
  averageDifficulty: number;
}

export enum IQClassification {
  VERY_SUPERIOR = 'Very Superior (130+)',
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
  startingDifficulty: number;
  minDifficulty: number;
  maxDifficulty: number;
  penalizeSlowAnswers: boolean;
  penalizeFastAnswers: boolean;
}

export interface TestStatistics {
  totalTestsTaken: number;
  averageIQ: number;
  averageCompletionTime: number;
  categoryDistribution: Record<QuestionCategory, number>;
  difficultyDistribution: Record<number, number>;
}

export interface ThemeConfig {
  isDarkMode: boolean;
}

export interface QuestionPool {
  [key: string]: Question[]; // keyed by difficulty level
}

export interface IRTParameters {
  discrimination: number; // a parameter
  difficulty: number; // b parameter
  guessing: number; // c parameter (pseudo-guessing)
} 
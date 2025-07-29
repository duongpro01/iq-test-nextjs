# Hướng Dẫn Hệ Thống IQ Test

## 📋 Tổng Quan

Hệ thống IQ Test là một ứng dụng Next.js với tính năng adaptive testing, sử dụng Item Response Theory (IRT) để đánh giá trí thông minh một cách chính xác và động.

## 🏗️ Kiến Trúc Hệ Thống

### Cấu Trúc Thư Mục
```
src/
├── app/                    # Next.js App Router
├── components/             # React Components
│   ├── ui/                # UI Components (shadcn/ui)
│   └── tasks/             # Interactive Task Components
├── data/                  # Question Database
├── lib/                   # Core Logic Engines
├── store/                 # State Management (Zustand)
├── services/              # Business Logic Services
├── hooks/                 # Custom React Hooks
└── types/                 # TypeScript Type Definitions
```

## 🧠 Logic Chính

### 1. Adaptive Testing Algorithm

#### Item Response Theory (IRT)
```typescript
// IRT Parameters cho mỗi câu hỏi
interface IRTParameters {
  a: number;  // Discrimination (độ phân biệt)
  b: number;  // Difficulty (độ khó)
  c: number;  // Guessing (xác suất đoán đúng)
}
```

#### Công Thức Tính Xác Suất Trả Lời Đúng
```typescript
P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))
```
Trong đó:
- `θ`: Ability estimate của người dùng
- `a`: Discrimination parameter
- `b`: Difficulty parameter  
- `c`: Guessing parameter

### 2. Ability Estimation

#### Bayesian Estimation
```typescript
// Cập nhật ability estimate sau mỗi câu trả lời
const bayesianEstimate = irtEngine.estimateAbilityBayesian(responses);
```

#### Information Function
```typescript
// Tính thông tin của câu hỏi
I(θ) = a² * P(θ) * (1-P(θ))
```

### 3. Question Selection Logic

#### Maximum Information Method
```typescript
// Chọn câu hỏi có thông tin cao nhất
const nextQuestion = questions.find(q => 
  irtEngine.calculateInformation(currentAbility, q) === maxInfo
);
```

#### Content Balancing
```typescript
// Đảm bảo cân bằng các domain
const questionsPerDomain = Math.floor(totalQuestions / 5);
const targetDomainBalance = {
  [QuestionCategory.PATTERN_RECOGNITION]: questionsPerDomain,
  [QuestionCategory.SPATIAL_REASONING]: questionsPerDomain,
  // ...
};
```

## 📊 Cách Tính Điểm

### 1. IQ Score Calculation

#### Raw Score to IQ Conversion
```typescript
// Chuyển đổi ability estimate thành IQ score
const calculateFinalIQ = (abilityEstimate: number): number => {
  const mean = 100;
  const stdDev = 15;
  return Math.round(mean + (abilityEstimate * stdDev));
};
```

#### IQ Classification
```typescript
const getIQClassification = (iq: number): IQClassification => {
  if (iq >= 160) return IQClassification.EXTREMELY_GIFTED;
  if (iq >= 145) return IQClassification.HIGHLY_GIFTED;
  if (iq >= 130) return IQClassification.MODERATELY_GIFTED;
  if (iq >= 115) return IQClassification.ABOVE_AVERAGE;
  if (iq >= 85) return IQClassification.AVERAGE;
  if (iq >= 70) return IQClassification.BELOW_AVERAGE;
  return IQClassification.INTELLECTUAL_DISABILITY;
};
```

### 2. Time Penalty System

#### Slow Answer Penalty
```typescript
// Giảm điểm cho câu trả lời quá chậm
const timePenalty = (responseTime: number, expectedTime: number) => {
  if (responseTime > expectedTime * 2) {
    return 0.1; // Giảm 10% điểm
  }
  return 0;
};
```

#### Fast Answer Penalty
```typescript
// Phát hiện và phạt câu trả lời quá nhanh
const fastPenalty = (responseTime: number, expectedTime: number) => {
  if (responseTime < expectedTime * 0.3) {
    return 0.2; // Giảm 20% điểm
  }
  return 0;
};
```

### 3. Final Score Calculation
```typescript
const calculateFinalScore = (answers: UserAnswer[]): number => {
  let totalScore = 0;
  let totalWeight = 0;
  
  answers.forEach(answer => {
    const timeWeight = calculateTimeWeight(answer.responseTime);
    const difficultyWeight = answer.difficulty;
    const weight = timeWeight * difficultyWeight;
    
    totalScore += (answer.isCorrect ? 1 : 0) * weight;
    totalWeight += weight;
  });
  
  return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
};
```

## 🎯 Question Types & Categories

### 1. Traditional Questions
```typescript
interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: number;        // 1-10
  question: string;
  options: string[];         // 4 lựa chọn
  correctAnswer: number;     // Index của đáp án đúng
  timeLimit: number;         // Giây
  explanation: string;
  // IRT Parameters
  a: number;  // Discrimination
  b: number;  // Difficulty
  c: number;  // Guessing
}
```

### 2. Interactive Tasks
```typescript
interface InteractiveQuestion extends Question {
  taskType: TaskType;
  taskData: TaskData;
}
```

#### Task Types
- **MATRIX_COMPLETION**: Hoàn thành ma trận
- **BLOCK_ASSEMBLY**: Lắp ghép khối
- **VISUAL_PUZZLE**: Ghép hình
- **DIGIT_SPAN**: Ghi nhớ chuỗi số
- **SYMBOL_CODING**: Mã hóa ký hiệu
- **WORKING_MEMORY_NBACK**: N-back task
- **PROCESSING_SPEED_SCAN**: Tìm kiếm nhanh
- **SPATIAL_ROTATION**: Xoay 3D
- **FIGURE_BALANCE**: Cân bằng hình

### 3. Question Categories
```typescript
enum QuestionCategory {
  PATTERN_RECOGNITION = 'pattern_recognition',
  SPATIAL_REASONING = 'spatial_reasoning',
  LOGICAL_DEDUCTION = 'logical_deduction',
  WORKING_MEMORY = 'working_memory',
  NUMERICAL_REASONING = 'numerical_reasoning',
  VERBAL_COMPREHENSION = 'verbal_comprehension',
  PROCESSING_SPEED = 'processing_speed',
  CODING_TASK = 'coding_task',
  FIGURE_WEIGHTS = 'figure_weights',
  MATRIX_REASONING = 'matrix_reasoning',
  BLOCK_DESIGN = 'block_design',
  VISUAL_PUZZLES = 'visual_puzzles'
}
```

## ⚙️ Configuration System

### 1. Adaptive Test Config
```typescript
interface AdaptiveTestConfig {
  totalQuestions: number;        // 20-50
  globalTimeLimit: number;       // Giây
  questionTimeLimit: number;     // Giây
  startingAbility: number;       // -2 to +2
  targetStandardError: number;   // 0.1-0.5
  selectionMethod: 'MaxInfo' | 'Bayesian' | 'Hybrid';
  contentBalancing: boolean;
  exposureControl: boolean;
  penalizeSlowAnswers: boolean;
  penalizeFastAnswers: boolean;
  timeWeightFactor: number;      // 0-0.3
}
```

### 2. Quick Presets
```typescript
const presets = {
  "Quick Test": {
    totalQuestions: 20,
    globalTimeLimit: 1200,      // 20 phút
    questionTimeLimit: 60,
    startingAbility: 0.0,
    targetStandardError: 0.3
  },
  "Standard Test": {
    totalQuestions: 35,
    globalTimeLimit: 2400,      // 40 phút
    questionTimeLimit: 70,
    startingAbility: 0.0,
    targetStandardError: 0.3
  },
  "Comprehensive Test": {
    totalQuestions: 50,
    globalTimeLimit: 3600,      // 60 phút
    questionTimeLimit: 72,
    startingAbility: 0.0,
    targetStandardError: 0.2
  }
};
```

## 🔄 State Management

### 1. Test Session
```typescript
interface TestSession {
  id: string;
  startTime: Date;
  currentQuestionIndex: number;
  questions: Question[];
  answers: UserAnswer[];
  globalTimeRemaining: number;
  abilityEstimate: number;
  abilityHistory: number[];
  standardError: number;
  isCompleted: boolean;
  isPaused: boolean;
  domainCoverage: Record<QuestionCategory, number>;
  targetDomainBalance: Record<QuestionCategory, number>;
  config: AdaptiveTestConfig;
}
```

### 2. User Answer
```typescript
interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  responseTime: number;
  timestamp: Date;
  difficulty: number;
  abilityBeforeAnswer: number;
  abilityAfterAnswer: number;
  probabilityCorrect: number;
  informationValue: number;
  standardErrorBefore: number;
  standardErrorAfter: number;
}
```

## 🛡️ Security & Anti-Cheating

### 1. Security Metrics
```typescript
interface SecurityMetrics {
  suspiciousPatterns: string[];
  responseTimeAnomalies: ResponseTimeAnomaly[];
  accuracyAnomalies: AccuracyAnomaly[];
  possibleCheatingIndicators: {
    tooFastResponses: number;
    perfectAccuracyStreak: number;
    unusualPatterns: string[];
  };
}
```

### 2. Cheating Detection
```typescript
// Phát hiện câu trả lời quá nhanh
const detectFastResponses = (responseTime: number, expectedTime: number) => {
  return responseTime < expectedTime * 0.3;
};

// Phát hiện độ chính xác bất thường
const detectPerfectAccuracy = (accuracy: number) => {
  return accuracy > 0.95; // >95% đúng
};

// Phát hiện pattern bất thường
const detectUnusualPatterns = (answers: UserAnswer[]) => {
  // Logic phát hiện pattern
};
```

## 📈 Analytics & Reporting

### 1. Domain Analysis
```typescript
interface DomainAnalysis {
  category: QuestionCategory;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  difficultyLevel: number;
  strength: 'strong' | 'average' | 'weak';
}
```

### 2. Performance Metrics
```typescript
interface PerformanceMetrics {
  overallAccuracy: number;
  averageResponseTime: number;
  timeEfficiency: number;
  consistencyScore: number;
  speedAccuracyTradeoff: number;
}
```

## 🌐 Internationalization

### 1. Localization System
```typescript
// Hỗ trợ đa ngôn ngữ
const supportedLanguages = ['en', 'vi'];

// Localized questions
const getLocalizedQuestions = (locale: string, totalQuestions: number) => {
  // Load questions based on language
};
```

### 2. Translation Structure
```
public/locales/
├── en/
│   ├── common.json
│   ├── test.json
│   ├── questions.json
│   ├── results.json
│   └── gamification.json
└── vi/
    └── [same structure]
```

## 🎮 Gamification Features

### 1. Achievement System
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: AchievementCriteria;
  reward: Reward;
}
```

### 2. Progress Tracking
```typescript
interface Progress {
  level: number;
  experience: number;
  achievements: Achievement[];
  badges: Badge[];
  streaks: StreakInfo;
}
```

## 🔧 Development & Deployment

### 1. Build Configuration
```typescript
// next.config.ts
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};
```

### 2. Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
DATABASE_URL=your-database-url
```

### 3. Deployment Checklist
- [ ] ESLint errors fixed
- [ ] TypeScript compilation successful
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] CDN assets optimized
- [ ] Security headers configured

## 📝 API Endpoints

### 1. Test Management
```typescript
// Start test session
POST /api/test/start
{
  config: AdaptiveTestConfig
}

// Submit answer
POST /api/test/answer
{
  sessionId: string,
  questionId: string,
  answer: number,
  responseTime: number
}

// End test
POST /api/test/end
{
  sessionId: string
}
```

### 2. Results & Analytics
```typescript
// Get test results
GET /api/results/:sessionId

// Get user analytics
GET /api/analytics/user/:userId

// Get leaderboard
GET /api/leaderboard
```

## 🚀 Performance Optimization

### 1. Code Splitting
```typescript
// Lazy load components
const TestComponent = lazy(() => import('./TestComponent'));
const ResultsComponent = lazy(() => import('./ResultsComponent'));
```

### 2. Caching Strategy
```typescript
// Cache questions
const questionCache = new Map<string, Question[]>();

// Cache user sessions
const sessionCache = new Map<string, TestSession>();
```

### 3. Bundle Optimization
```typescript
// Tree shaking
import { specificFunction } from 'large-library';

// Dynamic imports
const heavyComponent = await import('./HeavyComponent');
```

## 🔍 Testing Strategy

### 1. Unit Tests
```typescript
// Test IRT calculations
describe('IRT Engine', () => {
  test('calculateProbability returns correct values', () => {
    // Test implementation
  });
});
```

### 2. Integration Tests
```typescript
// Test complete test flow
describe('Test Flow', () => {
  test('complete test session', async () => {
    // Test implementation
  });
});
```

### 3. E2E Tests
```typescript
// Test user interactions
describe('User Experience', () => {
  test('user can complete test', async () => {
    // Test implementation
  });
});
```

## 📊 Monitoring & Logging

### 1. Error Tracking
```typescript
// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
  }
}
```

### 2. Performance Monitoring
```typescript
// Track test performance
const trackTestPerformance = (metrics: TestMetrics) => {
  // Send to analytics service
};
```

## 🔐 Security Best Practices

### 1. Input Validation
```typescript
// Validate user inputs
const validateAnswer = (answer: number): boolean => {
  return Number.isInteger(answer) && answer >= 0 && answer <= 3;
};
```

### 2. Rate Limiting
```typescript
// Prevent abuse
const rateLimiter = new Map<string, number[]>();
```

### 3. Data Encryption
```typescript
// Encrypt sensitive data
const encryptTestData = (data: TestData): string => {
  // Encryption implementation
};
```

---

## 📚 Tài Liệu Tham Khảo

- [Item Response Theory](https://en.wikipedia.org/wiki/Item_response_theory)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

---

*Documentation last updated: 2024*
*Version: 1.0.0* 
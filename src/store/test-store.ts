import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  TestSession, 
  Question, 
  UserAnswer, 
  TestResult, 
  AdaptiveTestConfig,
  QuestionCategory,
  IQClassification 
} from '@/types';
import { generateId, clamp, calculatePercentile } from '@/lib/utils';

interface TestStore {
  // Current test session
  currentSession: TestSession | null;
  
  // Test configuration
  config: AdaptiveTestConfig;
  
  // Question pools organized by difficulty
  questionPools: Record<number, Question[]>;
  
  // Test results history
  testHistory: TestResult[];
  
  // UI state
  isTestActive: boolean;
  isPaused: boolean;
  showResults: boolean;
  
  // Actions
  startTest: () => void;
  pauseTest: () => void;
  resumeTest: () => void;
  submitAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  endTest: () => void;
  resetTest: () => void;
  updateTimer: (globalTime: number) => void;
  
  // Adaptive difficulty management
  adjustDifficulty: (isCorrect: boolean) => void;
  getNextQuestion: () => Question | null;
  
  // Results calculation
  calculateResults: () => TestResult;
  
  // Configuration
  updateConfig: (config: Partial<AdaptiveTestConfig>) => void;
}

const defaultConfig: AdaptiveTestConfig = {
  totalQuestions: 30,
  globalTimeLimit: 1800, // 30 minutes
  questionTimeLimit: 60, // 60 seconds per question
  startingDifficulty: 5,
  minDifficulty: 1,
  maxDifficulty: 10,
  penalizeSlowAnswers: true,
  penalizeFastAnswers: false,
};

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      config: defaultConfig,
      questionPools: {},
      testHistory: [],
      isTestActive: false,
      isPaused: false,
      showResults: false,

      startTest: () => {
        const { config } = get();
        const sessionId = generateId();
        
        const newSession: TestSession = {
          id: sessionId,
          startTime: new Date(),
          currentQuestionIndex: 0,
          questions: [],
          answers: [],
          globalTimeRemaining: config.globalTimeLimit,
          difficultyLevel: config.startingDifficulty,
          isCompleted: false,
          isPaused: false,
        };

        // Get first question
        const firstQuestion = get().getNextQuestion();
        if (firstQuestion) {
          newSession.questions = [firstQuestion];
        }

        set({
          currentSession: newSession,
          isTestActive: true,
          isPaused: false,
          showResults: false,
        });
      },

      pauseTest: () => {
        set((state) => ({
          isPaused: true,
          currentSession: state.currentSession ? {
            ...state.currentSession,
            isPaused: true,
          } : null,
        }));
      },

      resumeTest: () => {
        set((state) => ({
          isPaused: false,
          currentSession: state.currentSession ? {
            ...state.currentSession,
            isPaused: false,
          } : null,
        }));
      },

      submitAnswer: (answerIndex: number) => {
        const { currentSession } = get();
        if (!currentSession || currentSession.isPaused) return;

        const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
        if (!currentQuestion) return;

        const isCorrect = answerIndex === currentQuestion.correctAnswer;
        const responseTime = Date.now() - currentSession.startTime.getTime();

        const answer: UserAnswer = {
          questionId: currentQuestion.id,
          selectedAnswer: answerIndex,
          isCorrect,
          responseTime,
          timestamp: new Date(),
          difficulty: currentQuestion.difficulty,
        };

        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            answers: [...state.currentSession.answers, answer],
          } : null,
        }));

        // Adjust difficulty based on answer
        get().adjustDifficulty(isCorrect);
      },

      nextQuestion: () => {
        const { currentSession, config } = get();
        if (!currentSession) return;

        const nextIndex = currentSession.currentQuestionIndex + 1;
        
        if (nextIndex >= config.totalQuestions) {
          get().endTest();
          return;
        }

        const nextQuestion = get().getNextQuestion();
        if (!nextQuestion) {
          get().endTest();
          return;
        }

        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            currentQuestionIndex: nextIndex,
            questions: [...state.currentSession.questions, nextQuestion],
          } : null,
        }));
      },

      endTest: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const endTime = new Date();
        const results = get().calculateResults();

        set((state) => ({
          currentSession: {
            ...currentSession,
            endTime,
            isCompleted: true,
          },
          isTestActive: false,
          showResults: true,
          testHistory: [...state.testHistory, results],
        }));
      },

      resetTest: () => {
        set({
          currentSession: null,
          isTestActive: false,
          isPaused: false,
          showResults: false,
        });
      },

      updateTimer: (globalTime: number) => {
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            globalTimeRemaining: globalTime,
          } : null,
        }));

        if (globalTime <= 0) {
          get().endTest();
        }
      },

      adjustDifficulty: (isCorrect: boolean) => {
        const { config } = get();
        
        set((state) => {
          if (!state.currentSession) return state;

          const currentDifficulty = state.currentSession.difficultyLevel;
          let newDifficulty = currentDifficulty;

          if (isCorrect) {
            // Increase difficulty if answer is correct
            newDifficulty = Math.min(currentDifficulty + 1, config.maxDifficulty);
          } else {
            // Decrease difficulty if answer is wrong
            newDifficulty = Math.max(currentDifficulty - 1, config.minDifficulty);
          }

          return {
            currentSession: {
              ...state.currentSession,
              difficultyLevel: newDifficulty,
            },
          };
        });
      },

      getNextQuestion: () => {
        const { currentSession, questionPools } = get();
        if (!currentSession) return null;

        const difficulty = currentSession.difficultyLevel;
        const availableQuestions = questionPools[difficulty] || [];
        
        // Filter out already asked questions
        const askedQuestionIds = new Set(currentSession.questions.map(q => q.id));
        const unaskedQuestions = availableQuestions.filter(q => !askedQuestionIds.has(q.id));

        if (unaskedQuestions.length === 0) {
          // If no questions available at current difficulty, try adjacent levels
          for (let offset = 1; offset <= 3; offset++) {
            const lowerDiff = difficulty - offset;
            const higherDiff = difficulty + offset;
            
            const lowerQuestions = (questionPools[lowerDiff] || [])
              .filter(q => !askedQuestionIds.has(q.id));
            const higherQuestions = (questionPools[higherDiff] || [])
              .filter(q => !askedQuestionIds.has(q.id));

            if (lowerQuestions.length > 0) {
              return lowerQuestions[Math.floor(Math.random() * lowerQuestions.length)];
            }
            if (higherQuestions.length > 0) {
              return higherQuestions[Math.floor(Math.random() * higherQuestions.length)];
            }
          }
          return null;
        }

        // Return random question from available pool
        return unaskedQuestions[Math.floor(Math.random() * unaskedQuestions.length)];
      },

      calculateResults: () => {
        const { currentSession } = get();
        if (!currentSession) {
          throw new Error('No active session to calculate results');
        }

        const { answers, startTime, endTime } = currentSession;
        const totalQuestions = answers.length;
        const correctAnswers = answers.filter(a => a.isCorrect).length;
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        const totalResponseTime = answers.reduce((sum, a) => sum + a.responseTime, 0);
        const averageResponseTime = totalQuestions > 0 ? totalResponseTime / totalQuestions : 0;

        // Calculate category scores
        const categoryScores = Object.values(QuestionCategory).map(category => {
          const categoryAnswers = answers.filter(a => {
            const question = currentSession.questions.find(q => q.id === a.questionId);
            return question?.category === category;
          });

          const categoryCorrect = categoryAnswers.filter(a => a.isCorrect).length;
          const categoryTotal = categoryAnswers.length;
          const categoryAccuracy = categoryTotal > 0 ? (categoryCorrect / categoryTotal) * 100 : 0;
          const categoryAvgTime = categoryTotal > 0 
            ? categoryAnswers.reduce((sum, a) => sum + a.responseTime, 0) / categoryTotal 
            : 0;
          const categoryAvgDiff = categoryTotal > 0
            ? categoryAnswers.reduce((sum, a) => sum + a.difficulty, 0) / categoryTotal
            : 0;

          return {
            category,
            correct: categoryCorrect,
            total: categoryTotal,
            accuracy: categoryAccuracy,
            averageResponseTime: categoryAvgTime,
            averageDifficulty: categoryAvgDiff,
          };
        });

        // Calculate estimated IQ using simplified IRT model
        const averageDifficulty = answers.reduce((sum, a) => sum + a.difficulty, 0) / totalQuestions;
        const difficultyWeight = (averageDifficulty - 5.5) * 2; // Normalize around difficulty 5.5
        const accuracyWeight = (accuracy - 50) * 0.3; // Normalize around 50% accuracy
        const timeBonus = averageResponseTime < 30000 ? 5 : 0; // Bonus for quick responses
        
        const estimatedIQ = clamp(100 + difficultyWeight + accuracyWeight + timeBonus, 70, 160);
        const percentileRank = calculatePercentile(estimatedIQ);

        // Classify IQ score
        let classification: IQClassification;
        if (estimatedIQ >= 130) classification = IQClassification.VERY_SUPERIOR;
        else if (estimatedIQ >= 120) classification = IQClassification.SUPERIOR;
        else if (estimatedIQ >= 110) classification = IQClassification.HIGH_AVERAGE;
        else if (estimatedIQ >= 90) classification = IQClassification.AVERAGE;
        else if (estimatedIQ >= 80) classification = IQClassification.LOW_AVERAGE;
        else if (estimatedIQ >= 70) classification = IQClassification.BORDERLINE;
        else classification = IQClassification.EXTREMELY_LOW;

        const completionTime = endTime 
          ? (endTime.getTime() - startTime.getTime()) / 1000 
          : 0;

        const difficultyProgression = answers.map(a => a.difficulty);

        return {
          sessionId: currentSession.id,
          totalQuestions,
          correctAnswers,
          accuracy,
          averageResponseTime,
          categoryScores,
          estimatedIQ,
          percentileRank,
          classification,
          difficultyProgression,
          completionTime,
        };
      },

      updateConfig: (newConfig: Partial<AdaptiveTestConfig>) => {
        set((state) => ({
          config: { ...state.config, ...newConfig },
        }));
      },
    }),
    {
      name: 'iq-test-storage',
      partialize: (state) => ({
        testHistory: state.testHistory,
        config: state.config,
      }),
    }
  )
); 
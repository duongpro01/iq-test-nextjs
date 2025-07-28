"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedQuestionCard } from '@/components/animated-question-card';
import { LoadingQuestion } from '@/components/loading-question';
import { ErrorBoundary } from '@/components/error-boundary';
import { QuestionNavigator } from '@/components/question-navigator';
import { useTestStore } from '@/store/test-store';
import { useToast } from '@/components/ui/use-toast';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function TestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    currentSession,
    submitAnswer,
    updateTimer,
    endTest,
    goToNextQuestion,
    goToPreviousQuestion
  } = useTestStore();

  // Redirect to home if no active session
  useEffect(() => {
    if (!currentSession) {
      router.replace('/');
      return;
    }

    if (currentSession.isCompleted) {
      router.replace('/ket-qua');
      return;
    }
  }, [currentSession, router]);

  // Update timer every second
  useEffect(() => {
    if (!currentSession || currentSession.isCompleted) return;

    const timer = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession, updateTimer]);

  // Handle test completion
  useEffect(() => {
    if (currentSession?.isCompleted) {
      endTest();
      router.push('/ket-qua');
    }
  }, [currentSession?.isCompleted, endTest, router]);

  // Handle time's up
  useEffect(() => {
    if (currentSession && currentSession.globalTimeRemaining <= 0) {
      toast({
        title: "Time's up!",
        description: "Your test will be submitted automatically.",
        duration: 5000,
      });
      endTest();
      router.push('/ket-qua');
    }
  }, [currentSession?.globalTimeRemaining, endTest, router, toast]);

  // Handle offline/online status
  useEffect(() => {
    const handleOnline = () => {
      toast({
        title: "Back online",
        description: "Your progress has been saved",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      toast({
        title: "You're offline",
        description: "Don't worry, your progress will be saved locally",
        duration: null,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (!currentSession) {
    return null;
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const direction = currentSession.currentQuestionIndex;

  const handleAnswer = (answer: number) => {
    submitAnswer(answer);
    
    // Auto-navigate to next question if not the last one
    const isLastQuestion = currentSession.currentQuestionIndex === currentSession.questions.length - 1;
    if (!isLastQuestion) {
      goToNextQuestion();
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      goToNextQuestion();
    } else if (swipe > swipeConfidenceThreshold) {
      goToPreviousQuestion();
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6 md:space-y-8">
        {/* Question Card */}
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSession.currentQuestionIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="w-full"
            >
              <AnimatedQuestionCard
                question={currentQuestion}
                questionNumber={currentSession.currentQuestionIndex + 1}
                totalQuestions={currentSession.questions.length}
                transition={{
                  type: 'slide',
                  duration: 0.5,
                  easing: 'easeInOut',
                  direction: direction > (currentSession.currentQuestionIndex - 1) ? 'right' : 'left'
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Question Navigator */}
        <div className="bg-card rounded-lg shadow-lg p-4 md:p-6">
          <QuestionNavigator />
        </div>
      </div>
    </ErrorBoundary>
  );
} 
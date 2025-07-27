"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTestStore } from '@/store/test-store';
import { useRouter } from 'next/navigation';

export function TestNavigation() {
  const router = useRouter();
  const { 
    currentSession,
    goToPreviousQuestion,
    goToNextQuestion,
    endTest
  } = useTestStore();

  if (!currentSession) return null;

  const currentIndex = currentSession.currentQuestionIndex;
  const totalQuestions = currentSession.questions.length;
  const hasAnswered = currentSession.answers.length > currentIndex;
  const allQuestionsAnswered = currentSession.answers.length === totalQuestions;

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      goToPreviousQuestion();
    }
  };

  const handleNext = () => {
    if (hasAnswered) {
      if (isLastQuestion && allQuestionsAnswered) {
        endTest();
        router.push('/ket-qua');
      } else {
        goToNextQuestion();
      }
    }
  };

  return (
    <div className="flex items-center justify-between h-full px-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevious}
        disabled={isFirstQuestion}
        className="w-[100px]"
        aria-label="Go to previous question"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>

      <div className="flex flex-col items-center">
        <div className="text-sm font-medium" role="status" aria-live="polite">
          Question {currentIndex + 1} of {totalQuestions}
        </div>
        {!hasAnswered && (
          <div className="text-xs text-muted-foreground mt-1">
            Select an answer to continue
          </div>
        )}
      </div>

      <Button
        variant={hasAnswered ? "default" : "ghost"}
        size="sm"
        onClick={handleNext}
        disabled={!hasAnswered}
        className="w-[100px]"
        aria-label={isLastQuestion && allQuestionsAnswered ? "Finish test" : "Go to next question"}
      >
        {isLastQuestion && allQuestionsAnswered ? "Finish" : "Next"}
        {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );
} 
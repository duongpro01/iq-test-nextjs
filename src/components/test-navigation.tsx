"use client"

import { ChevronLeft, ChevronRight, Check, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTestStore } from '@/store/test-store';
import { useRouter } from 'next/navigation';
import { formatTime } from '@/lib/utils';

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
  const answeredQuestions = currentSession.answers.length;
  const hasAnswered = currentSession.answers.length > currentIndex;
  const allQuestionsAnswered = currentSession.answers.length === totalQuestions;
  const remainingQuestions = totalQuestions - answeredQuestions;
  const timeRemaining = currentSession.globalTimeRemaining;

  // Format time remaining
  const formattedTime = formatTime(timeRemaining);
  const isLowTime = timeRemaining < 300; // less than 5 minutes
  const isCriticalTime = timeRemaining < 60; // less than 1 minute

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

  const handleSubmitTest = () => {
    if (answeredQuestions < totalQuestions) {
      // Show warning if not all questions are answered
      alert('Please answer all questions before submitting.');
      return;
    }

    // End test and navigate to results
    endTest();
    router.push('/ket-qua');
  };

  return (
    <div className="flex items-center justify-between h-full px-4">
      <div className="flex items-center gap-4">
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

        {/* Timer */}
        <div className={`flex items-center gap-2 ${
          isCriticalTime ? 'text-destructive animate-pulse' : 
          isLowTime ? 'text-destructive' : ''
        }`}>
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium font-mono">
            {formattedTime}
          </span>
        </div>
      </div>

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

      <div className="flex items-center gap-2">
        {/* Submit Test Button */}
        <Button
          onClick={handleSubmitTest}
          variant={allQuestionsAnswered ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          {allQuestionsAnswered ? (
            <>
              <Check className="w-4 h-4" />
              Submit Test
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              {remainingQuestions} left
            </>
          )}
        </Button>

        {/* Next/Finish Button */}
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
    </div>
  );
} 
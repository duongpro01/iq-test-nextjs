"use client"

import { useTestStore } from '@/store/test-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function QuestionNavigator() {
  const { currentSession, goToQuestion } = useTestStore();

  if (!currentSession) return null;

  const totalQuestions = currentSession.questions.length;
  const currentIndex = currentSession.currentQuestionIndex;
  const answeredQuestions = new Set(currentSession.answers.map((_, index) => index));

  const handleQuestionClick = (index: number) => {
    // Only allow navigation to answered questions or the next unanswered question
    if (answeredQuestions.has(index) || index === answeredQuestions.size) {
      goToQuestion(index);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-4">
        Click to navigate between questions
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <Button
            key={i}
            variant={i === currentIndex ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 sm:h-10 w-full p-0 text-xs sm:text-sm",
              answeredQuestions.has(i) && "bg-muted",
              !answeredQuestions.has(i) && i !== answeredQuestions.size && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleQuestionClick(i)}
            disabled={!answeredQuestions.has(i) && i !== answeredQuestions.size}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mt-6">
        <Button
          variant="outline"
          className="w-full sm:w-[200px]"
          onClick={() => handleQuestionClick(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-[200px]"
          onClick={() => handleQuestionClick(currentIndex + 1)}
          disabled={currentIndex === totalQuestions - 1 || !answeredQuestions.has(currentIndex)}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 
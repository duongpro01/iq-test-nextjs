"use client"

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useTestStore } from '@/store/test-store';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle } from 'lucide-react';

export function TestProgress() {
  const router = useRouter();
  const { currentSession, endTest } = useTestStore();

  if (!currentSession) return null;

  const totalQuestions = currentSession.questions.length;
  const answeredQuestions = currentSession.answers.length;
  const remainingQuestions = totalQuestions - answeredQuestions;
  const progress = (answeredQuestions / totalQuestions) * 100;

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
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          {answeredQuestions}/{totalQuestions} completed
        </div>
        <Button
          onClick={handleSubmitTest}
          variant={answeredQuestions === totalQuestions ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          {answeredQuestions === totalQuestions ? (
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
      </div>
      
      <Progress 
        value={progress} 
        className="h-2"
        aria-label="Test progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`${Math.round(progress)}% complete`}
      />
    </div>
  );
} 
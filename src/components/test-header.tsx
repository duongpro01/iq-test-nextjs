"use client"

import { Clock } from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { Progress } from '@/components/ui/progress';
import { formatTime } from '@/lib/utils';

export function TestHeader() {
  const { currentSession } = useTestStore();

  if (!currentSession) return null;

  const totalQuestions = currentSession.questions.length;
  const answeredQuestions = currentSession.answers.length;
  const timeRemaining = currentSession.globalTimeRemaining;

  // Format time remaining
  const formattedTime = formatTime(timeRemaining);
  const isLowTime = timeRemaining < 300; // less than 5 minutes
  const isCriticalTime = timeRemaining < 60; // less than 1 minute

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto">
        <div className="p-4 space-y-2">
          {/* Time Remaining */}
          <div className="flex items-center justify-end">
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

          {/* Progress Bar */}
          <Progress 
            value={(answeredQuestions / totalQuestions) * 100} 
            className="h-1"
          />
        </div>
      </div>
    </div>
  );
} 
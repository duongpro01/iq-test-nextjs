"use client"

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTestStore } from '@/store/test-store';
import { WelcomeScreen } from '@/components/welcome-screen';
import { QuestionCard } from '@/components/question-card';
import { ResultsDashboard } from '@/components/results-dashboard';

export default function Home() {
  const { 
    isTestActive, 
    showResults, 
    currentSession, 
    calculateResults 
  } = useTestStore();

  // Disable right-click and keyboard shortcuts for test security
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (isTestActive) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTestActive) {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.key === 's') ||
          (e.ctrlKey && e.key === 'a') ||
          (e.ctrlKey && e.key === 'p')
        ) {
          e.preventDefault();
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isTestActive) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTestActive]);

  // Show results screen
  if (showResults && currentSession) {
    const result = calculateResults();
    return <ResultsDashboard result={result} />;
  }

  // Show question screen
  if (isTestActive && currentSession) {
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    
    if (!currentQuestion) {
      // This shouldn't happen, but handle gracefully
      return <WelcomeScreen />;
    }

    return (
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentSession.currentQuestionIndex + 1}
          totalQuestions={currentSession.questions.length}
        />
      </AnimatePresence>
    );
  }

  // Show welcome screen (default)
  return <WelcomeScreen />;
}

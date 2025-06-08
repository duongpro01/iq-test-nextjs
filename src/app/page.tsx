"use client"

import { useEffect } from 'react';
import { useTestStore } from '@/store/test-store';
import { WelcomeScreen } from '@/components/welcome-screen';
import { QuestionCard } from '@/components/question-card';
import { ResultsDashboard } from '@/components/results-dashboard';

export default function Home() {
  const { 
    currentSession, 
    testResult, 
    updateTimer,
    resetTest
  } = useTestStore();

  // Global timer effect
  useEffect(() => {
    if (!currentSession || currentSession.isPaused || currentSession.isCompleted) {
      return;
    }

    const timer = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession, updateTimer]);

  // Security measures - disable right-click and common shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentSession && !currentSession.isCompleted) {
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
  }, [currentSession]);

  // Disable text selection during test
  useEffect(() => {
    if (currentSession && !currentSession.isCompleted) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    } else {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [currentSession]);

  // Show results if test is completed
  if (testResult) {
    return <ResultsDashboard result={testResult} onRestart={resetTest} />;
  }

  // Show question if test is active
  if (currentSession && !currentSession.isCompleted) {
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    
    if (!currentQuestion) {
      return <div>Loading next question...</div>;
    }

          return (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentSession.currentQuestionIndex + 1}
          totalQuestions={currentSession.questions.length}
        />
      );
  }

  // Show welcome screen by default
  return <WelcomeScreen />;
}

"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedResultsDashboard } from '@/components/enhanced-results-dashboard';
import { useTestStore } from '@/store/test-store';

export default function ResultsPage() {
  const router = useRouter();
  const { currentSession, testResult, resetTest } = useTestStore();

  useEffect(() => {
    // Redirect to home if no test result
    if (!testResult || !currentSession?.isCompleted) {
      router.push('/');
    }
  }, [testResult, currentSession, router]);

  if (!testResult || !currentSession) {
    return null;
  }

  const handleRestart = () => {
    resetTest();
    router.push('/');
  };

  const handleChallengeMode = () => {
    // TODO: Implement challenge mode
    console.log('Challenge mode not implemented yet');
  };

  return (
    <EnhancedResultsDashboard
      result={testResult}
      onRestart={handleRestart}
      onChallengeMode={handleChallengeMode}
    />
  );
} 
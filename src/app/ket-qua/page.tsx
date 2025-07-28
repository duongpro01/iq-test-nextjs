"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedResultsDashboard } from '@/components/enhanced-results-dashboard';
import { useTestStore } from '@/store/test-store';
import { enhanceTestResultWithMockProgression } from '@/lib/mock-data-generator';
import { TestResult } from '@/types';

export default function ResultsPage() {
  const router = useRouter();
  const { testResult } = useTestStore();
  const [enhancedResult, setEnhancedResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (!testResult) {
      router.push('/');
      return;
    }

    // Enhance result with mock progression data if not available
    const enhanced = enhanceTestResultWithMockProgression(testResult);
    setEnhancedResult(enhanced);
  }, [testResult, router]);

  if (!enhancedResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const handleRestart = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <EnhancedResultsDashboard 
        result={enhancedResult} 
        onRestart={handleRestart}
      />
    </div>
  );
} 
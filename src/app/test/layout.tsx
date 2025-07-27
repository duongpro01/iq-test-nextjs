"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheatDetectionOverlay } from '@/components/cheat-detection-overlay';
import { TestProgress } from '@/components/test-progress';
import { TestTimer } from '@/components/test-timer';
import { TestNavigation } from '@/components/test-navigation';
import { useTestStore } from '@/store/test-store';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentSession, testResult } = useTestStore();

  // Redirect if no active session or test is already completed
  useEffect(() => {
    if (!currentSession) {
      router.replace('/');
      return;
    }

    if (testResult) {
      router.replace('/ket-qua');
      return;
    }
  }, [currentSession, testResult, router]);

  // Prevent leaving page accidentally
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentSession && !testResult) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentSession, testResult]);

  if (!currentSession) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-14 items-center gap-4">
          <TestProgress />
          <TestTimer />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6">
        {children}
      </main>

      {/* Navigation bar */}
      <nav className="sticky bottom-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="container h-16">
          <TestNavigation />
        </div>
      </nav>

      {/* Cheat detection overlay */}
      <CheatDetectionOverlay />
    </div>
  );
} 
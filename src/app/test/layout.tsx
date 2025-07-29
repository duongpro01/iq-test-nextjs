"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen">
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 
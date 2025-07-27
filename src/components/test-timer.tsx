"use client"

import { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { useTestStore } from '@/store/test-store';

export function TestTimer() {
  const { currentSession } = useTestStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for time warnings
    audioRef.current = new Audio('/sounds/timer-warning.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!currentSession) return null;

  const timeRemaining = currentSession.globalTimeRemaining;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLowTime = timeRemaining < 300; // Less than 5 minutes
  const isCriticalTime = timeRemaining < 60; // Less than 1 minute

  // Play sound when entering critical time
  useEffect(() => {
    if (isCriticalTime && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore errors - some browsers block autoplay
      });
    }
  }, [isCriticalTime]);

  return (
    <div 
      className={`flex items-center gap-2 px-4 font-mono text-lg ${
        isCriticalTime ? 'text-red-500 animate-pulse' : 
        isLowTime ? 'text-red-500' : ''
      }`}
      role="timer"
      aria-label={`Time remaining: ${minutes} minutes and ${seconds} seconds`}
      aria-live={isLowTime ? "assertive" : "off"}
    >
      <Clock className="w-4 h-4" aria-hidden="true" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      {isLowTime && (
        <span className="sr-only">
          Warning: {minutes} minutes {seconds} seconds remaining
        </span>
      )}
    </div>
  );
} 
"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Zap } from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { formatTime } from '@/lib/utils';

interface TestTimerProps {
  className?: string;
}

export function TestTimer({ className = "" }: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLowTime, setIsLowTime] = useState(false);
  const [isCriticalTime, setIsCriticalTime] = useState(false);

  const { currentSession } = useTestStore();

  // Update timer state
  useEffect(() => {
    if (!currentSession) return;

    const updateTimer = () => {
      const remaining = currentSession.globalTimeRemaining;
      setTimeRemaining(remaining);
      setIsLowTime(remaining < 300); // Less than 5 minutes
      setIsCriticalTime(remaining < 60); // Less than 1 minute
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  if (!currentSession) {
    return null;
  }

  const progressPercentage = ((timeRemaining / currentSession.globalTimeLimit) * 100);
  const formattedTime = formatTime(timeRemaining);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Test Timer</CardTitle>
          <Badge 
            variant={isCriticalTime ? "destructive" : isLowTime ? "secondary" : "default"}
            className="flex items-center space-x-1"
          >
            <Clock className="w-3 h-3" />
            <span>Live</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <motion.div
            className={`text-4xl font-mono font-bold ${
              isCriticalTime ? 'text-destructive' : 
              isLowTime ? 'text-orange-500' : 'text-primary'
            }`}
            animate={isCriticalTime ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: isCriticalTime ? Infinity : 0, duration: 1 }}
          >
            {formattedTime}
          </motion.div>
          
          {isCriticalTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-2 mt-2 text-destructive"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Time is running out!</span>
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Time Remaining</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${
              isCriticalTime ? 'bg-destructive' : 
              isLowTime ? 'bg-orange-500' : ''
            }`}
          />
        </div>

        {/* Time Status */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">
              {Math.floor(timeRemaining / 60)}
            </div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">
              {timeRemaining % 60}
            </div>
            <div className="text-xs text-muted-foreground">Seconds</div>
          </div>
        </div>

        {/* Warning Messages */}
        {isLowTime && !isCriticalTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
          >
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-700 dark:text-orange-300">
              Less than 5 minutes remaining. Please complete your test soon.
            </span>
          </motion.div>
        )}

        {isCriticalTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 p-3 bg-destructive/10 rounded-lg"
          >
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">
              Critical time remaining! Submit your test immediately.
            </span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
} 
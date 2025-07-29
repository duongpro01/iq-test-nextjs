"use client"

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Star,
  Trophy,
  Target
} from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { useGamificationStore } from '@/store/gamification-store';
import { Question, QuestionTransition } from '@/types';
import { formatTime } from '@/lib/utils';

interface AnimatedQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  transition?: QuestionTransition;
}

export function AnimatedQuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions,
  transition = { type: 'slide', duration: 0.5, easing: 'easeInOut', direction: 'right' }
}: AnimatedQuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(question?.timeLimit || 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streakBonus, setStreakBonus] = useState(0);

  const { 
    submitAnswer, 
    currentSession, 
    updateTimer
  } = useTestStore();

  const {
    userProfile,
    addXP,
    updateStreak,
    trackEngagement
  } = useGamificationStore();

  // Reset timer and selected answer when question changes
  useEffect(() => {
    if (!question) return;
    setTimeRemaining(question.timeLimit);
    setSelectedAnswer(null);
    setIsSubmitting(false);
    setShowHint(false);
  }, [question?.id, question?.timeLimit, question]);

  const handleSubmit = useCallback(async (answerIndex: number) => {
    if (isSubmitting || !question) return;
    
    setIsSubmitting(true);
    trackEngagement('question_answered', { 
      questionId: question.id, 
      answerIndex, 
      timeSpent: question.timeLimit - timeRemaining 
    });
    
    // Calculate bonus XP for speed and accuracy
    const speedBonus = timeRemaining > question.timeLimit * 0.5 ? 10 : 0;
    const baseXP = 20;
    
    // Submit answer (this automatically moves to next question)
    submitAnswer(answerIndex);
    
    // Award XP and update streak
    addXP(baseXP + speedBonus + streakBonus, 'question_completion');
    updateStreak();
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
  }, [isSubmitting, submitAnswer, question, timeRemaining, streakBonus, addXP, updateStreak, trackEngagement]);

  // Question timer
  useEffect(() => {
    if (!question) return;

    let timeoutId: NodeJS.Timeout;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Clear the interval first
          clearInterval(timer);
          
          // Schedule auto-submit with a small delay
          timeoutId = setTimeout(() => {
            handleSubmit(selectedAnswer ?? -1);
          }, 100);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedAnswer, handleSubmit, question]);

  // Global timer
  useEffect(() => {
    const globalTimer = setInterval(() => {
      if (currentSession) {
        updateTimer();
      }
    }, 1000);

    return () => clearInterval(globalTimer);
  }, [currentSession, updateTimer]);

  // Calculate streak bonus
  useEffect(() => {
    if (userProfile) {
      const bonus = Math.min(userProfile.streakDays * 2, 20);
      setStreakBonus(bonus);
    }
  }, [userProfile]);

  // Return early if no question
  if (!question) return null;

  const progressPercentage = ((questionNumber - 1) / totalQuestions) * 100;
  const timeProgressPercentage = (timeRemaining / question.timeLimit) * 100;
  const globalTimeRemaining = currentSession?.globalTimeRemaining || 0;
  
  const isTimeWarning = timeRemaining <= 10;
  const isTimeCritical = timeRemaining <= 5;
  const isGlobalTimeWarning = globalTimeRemaining <= 300; // 5 minutes

  // Animation variants
  const cardVariants = {
    enter: {
      x: transition.direction === 'right' ? 300 : transition.direction === 'left' ? -300 : 0,
      y: transition.direction === 'up' ? -300 : transition.direction === 'down' ? 300 : 0,
      opacity: 0,
      scale: 0.8,
      rotateY: transition.type === 'flip' ? 90 : 0
    },
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: transition.duration,
        ease: transition.easing
      }
    },
    exit: {
      x: transition.direction === 'right' ? -300 : transition.direction === 'left' ? 300 : 0,
      y: transition.direction === 'up' ? 300 : transition.direction === 'down' ? -300 : 0,
      opacity: 0,
      scale: 0.8,
      rotateY: transition.type === 'flip' ? -90 : 0,
      transition: {
        duration: transition.duration * 0.7,
        ease: transition.easing
      }
    }
  };

  const optionVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="w-full">
      <motion.div
        key={question.id}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full"
      >
        {/* Gamification Header - Hidden on mobile */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-3 sm:mb-4 hidden sm:flex justify-between items-center"
        >
          <div className="flex items-center space-x-4">
            {userProfile && (
              <>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Level {userProfile.level}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>{userProfile.totalPoints} XP</span>
                </Badge>
                {userProfile.streakDays > 0 && (
                  <Badge variant="default" className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3" />
                    <span>{userProfile.streakDays} day streak</span>
                  </Badge>
                )}
              </>
            )}
          </div>
          {streakBonus > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 text-green-600"
            >
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">+{streakBonus} Streak Bonus</span>
            </motion.div>
          )}
        </motion.div>

        {/* Header with progress and timers */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-3 sm:mb-4 space-y-2 sm:space-y-3"
        >
          {/* Progress Bar */}
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Question {questionNumber} of {totalQuestions}</span>
              <span className="text-muted-foreground hidden sm:inline">
                Ability Level: {currentSession?.abilityEstimate?.toFixed(1) || '0.0'}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Timers */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.div 
                className={`flex items-center space-x-2 ${isTimeWarning ? 'timer-warning' : ''} ${isTimeCritical ? 'timer-critical' : ''}`}
                animate={isTimeCritical ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: isTimeCritical ? Infinity : 0, duration: 1 }}
              >
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">
                  {formatTime(timeRemaining)}
                </span>
              </motion.div>
              <div className={`flex items-center space-x-2 ${isGlobalTimeWarning ? 'timer-warning' : ''}`}>
                <Brain className="w-4 h-4" />
                <span className="font-mono text-sm">
                  {formatTime(globalTimeRemaining)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Adaptive Mode</span>
            </div>
          </div>

          {/* Question timer progress */}
          <Progress 
            value={timeProgressPercentage} 
            className={`h-1 ${isTimeWarning ? 'progress-warning' : ''}`}
          />
        </motion.div>

        {/* Question Card */}
        <Card className="shadow-sm sm:shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-4 md:pb-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {question.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Level {question.difficulty}
                  </Badge>
                  {userProfile?.preferences.showHints && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs"
                    >
                      💡 Hint
                    </Button>
                  )}
                </div>
                <CardTitle className="text-base sm:text-lg md:text-xl leading-relaxed break-words">
                  {question.question}
                </CardTitle>
                {showHint && question.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm"
                  >
                    💡 <strong>Hint:</strong> Think about the underlying pattern or rule...
                  </motion.div>
                )}
              </div>
              {isTimeWarning && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex-shrink-0 ml-2 sm:ml-4"
                >
                  <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 ${isTimeCritical ? 'text-destructive' : 'text-yellow-500'}`} />
                </motion.div>
              )}
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-3 sm:space-y-4">
            {/* Question Image (if any) */}
            {question.image && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mb-4 sm:mb-6"
              >
                <div className="max-w-full sm:max-w-md">
                  <Image 
                    src={question.image} 
                    alt="Question diagram" 
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
              </motion.div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <AnimatePresence>
                {question.options.map((option, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full p-3 sm:p-4 h-auto text-left justify-start transition-all duration-200 ${
                        selectedAnswer === index 
                          ? 'ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedAnswer(index)}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <motion.div 
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            selectedAnswer === index 
                              ? 'bg-primary-foreground text-primary border-primary-foreground' 
                              : 'border-muted-foreground'
                          }`}
                          animate={selectedAnswer === index ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {String.fromCharCode(65 + index)}
                        </motion.div>
                        <span className="text-sm break-words">{option}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center pt-3 sm:pt-4 md:pt-6"
            >
              <Button
                onClick={() => handleSubmit(selectedAnswer ?? -1)}
                disabled={isSubmitting}
                size="lg"
                className="w-full sm:min-w-[200px]"
              >
                {isSubmitting ? (
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Submitting...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedAnswer !== null ? 'Submit Answer' : 'Skip Question'}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {/* Help Text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-xs text-muted-foreground pt-2 sm:pt-4"
            >
              {selectedAnswer === null ? (
                <p>Select an answer or click &quot;Skip Question&quot; to continue</p>
              ) : (
                <p>Click &quot;Submit Answer&quot; to proceed to the next question</p>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 
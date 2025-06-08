"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { formatTime } from '@/lib/utils';
import { Question } from '@/types';
import { useTranslation } from 'react-i18next';
import { getLocalizedQuestion } from '@/lib/localized-questions';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(question.timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { i18n } = useTranslation();
  const { 
    submitAnswer, 
    currentSession, 
    updateTimer
  } = useTestStore();

  // Force re-render when language changes
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Get localized question based on current language
  const getLocalizedQuestionForRender = () => {
    const currentLocale = i18n.language.split('-')[0]; // Convert en-US to en
    console.log('Current locale:', currentLocale, 'Question ID:', question.id);
    const localized = getLocalizedQuestion(question.id, currentLocale);
    console.log('Localized question:', localized ? 'Found' : 'Not found');
    if (localized) {
      console.log('Localized question text:', localized.question);
    }
    return localized || question; // Fallback to original if no translation
  };
  
  const localizedQuestion = getLocalizedQuestionForRender();

  // Reset timer and selected answer when question changes
  useEffect(() => {
    setTimeRemaining(localizedQuestion.timeLimit);
    setSelectedAnswer(null);
    setIsSubmitting(false);
  }, [localizedQuestion.id, localizedQuestion.timeLimit]);

  const handleSubmit = useCallback(async (answerIndex: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Submit answer (this automatically moves to next question)
    submitAnswer(answerIndex);
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
  }, [isSubmitting, submitAnswer]);

  // Question timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit(selectedAnswer ?? -1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedAnswer, handleSubmit]);

  // Global timer
  useEffect(() => {
    const globalTimer = setInterval(() => {
      if (currentSession) {
        updateTimer();
      }
    }, 1000);

    return () => clearInterval(globalTimer);
  }, [currentSession, updateTimer]);

  const progressPercentage = ((questionNumber - 1) / totalQuestions) * 100;
  const timeProgressPercentage = (timeRemaining / localizedQuestion.timeLimit) * 100;
  const globalTimeRemaining = currentSession?.globalTimeRemaining || 0;
  
  const isTimeWarning = timeRemaining <= 10;
  const isTimeCritical = timeRemaining <= 5;
  const isGlobalTimeWarning = globalTimeRemaining <= 300; // 5 minutes

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4 test-secure">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        {/* Header with progress and timers */}
        <div className="mb-6 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Question {questionNumber} of {totalQuestions}</span>
              <span className="text-muted-foreground">
                Ability Level: {currentSession?.abilityEstimate?.toFixed(1) || '0.0'} | Lang: {i18n.language}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Timers */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${isTimeWarning ? 'timer-warning' : ''} ${isTimeCritical ? 'timer-critical' : ''}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">
                  Question: {formatTime(timeRemaining)}
                </span>
              </div>
              <div className={`flex items-center space-x-2 ${isGlobalTimeWarning ? 'timer-warning' : ''}`}>
                <Brain className="w-4 h-4" />
                <span className="font-mono text-sm">
                  Total: {formatTime(globalTimeRemaining)}
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
        </div>

        {/* Question Card */}
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                    {localizedQuestion.category}
                  </span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    Level {localizedQuestion.difficulty}
                  </span>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  <div className="text-xs text-muted-foreground mb-2">
                    [DEBUG: Lang={i18n.language}, ID={question.id}, Localized={localizedQuestion.question !== question.question ? 'YES' : 'NO'}]
                  </div>
                  {localizedQuestion.question}
                </CardTitle>
              </div>
              {isTimeWarning && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex-shrink-0 ml-4"
                >
                  <AlertTriangle className={`w-6 h-6 ${isTimeCritical ? 'text-destructive' : 'text-yellow-500'}`} />
                </motion.div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Question Image (if any) */}
            {localizedQuestion.image && (
              <div className="flex justify-center mb-6">
                <div className="max-w-md">
                  <img 
                    src={localizedQuestion.image} 
                    alt="Question diagram" 
                    className="w-full h-auto rounded-lg border"
                  />
                </div>
              </div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence>
                {localizedQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full p-4 h-auto text-left justify-start transition-all duration-200 ${
                        selectedAnswer === index 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedAnswer(index)}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          selectedAnswer === index 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'border-muted-foreground'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={() => handleSubmit(selectedAnswer ?? -1)}
                disabled={isSubmitting}
                size="lg"
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <span>
                    {selectedAnswer !== null ? 'Submit Answer' : 'Skip Question'}
                  </span>
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center text-xs text-muted-foreground pt-4">
              {selectedAnswer === null ? (
                <p>Select an answer or click &quot;Skip Question&quot; to continue</p>
              ) : (
                <p>Click &quot;Submit Answer&quot; to proceed to the next question</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 
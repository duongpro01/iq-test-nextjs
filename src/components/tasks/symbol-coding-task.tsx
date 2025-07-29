"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskData, SymbolPair } from '@/types';

interface SymbolCodingTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

export function SymbolCodingTask({ taskData, onAnswer, isActive, timeRemaining }: SymbolCodingTaskProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const symbolPairs = taskData.symbolPairs || [];
  const testSymbols = ['◆', '◇', '▲', '▼', '●', '○', '■', '□']; // Test symbols to encode

  useEffect(() => {
    if (isActive && startTime === null) {
      setStartTime(Date.now());
    }
  }, [isActive, startTime]);

  useEffect(() => {
    if (userAnswers.length === testSymbols.length) {
      calculateScore();
      setIsComplete(true);
    }
  }, [userAnswers, testSymbols.length]);

  useEffect(() => {
    if (isComplete) {
      onAnswer(score);
    }
  }, [isComplete, score, onAnswer]);

  const calculateScore = () => {
    let correct = 0;
    testSymbols.forEach((symbol, index) => {
      const correctCode = symbolPairs.find(pair => pair.symbol === symbol)?.code;
      if (userAnswers[index] === correctCode?.toString()) {
        correct++;
      }
    });
    setScore(correct);
  };

  const handleCodeInput = (code: string) => {
    if (!isActive || isComplete) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = code;
    setUserAnswers(newAnswers);
    
    if (currentIndex < testSymbols.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const renderSymbolKey = () => (
    <Card className="bg-white/10 border-white/20 p-4 mb-6">
      <CardContent className="p-0">
        <h4 className="text-white/90 font-medium mb-4 text-center">Symbol-Number Key</h4>
        <div className="grid grid-cols-4 gap-4">
          {symbolPairs.map((pair, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="text-2xl mb-2">{pair.symbol}</div>
              <div className="text-lg font-bold text-purple-300">{pair.code}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderTestArea = () => (
    <Card className="bg-white/5 border-white/10 p-6">
      <CardContent className="p-0 space-y-6">
        <div className="text-center">
          <h4 className="text-white/90 font-medium mb-2">
            Enter the number for each symbol
          </h4>
          <p className="text-white/60 text-sm">
            Symbol {currentIndex + 1} of {testSymbols.length}
          </p>
        </div>

        {/* Current symbol */}
        <div className="text-center">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-8 bg-white/10 rounded-lg border border-white/20 mb-4"
          >
            <div className="text-6xl">{testSymbols[currentIndex]}</div>
          </motion.div>
        </div>

        {/* Number input buttons */}
        <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
            <motion.div
              key={number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="aspect-square text-lg font-bold bg-white/10 border-white/20 hover:bg-purple-500/30 text-white"
                onClick={() => handleCodeInput(number.toString())}
                disabled={!isActive || isComplete}
              >
                {number}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            {testSymbols.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index < userAnswers.length
                    ? 'bg-green-500'
                    : index === currentIndex
                    ? 'bg-purple-500 animate-pulse'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-white/60 text-sm">
            Progress: {userAnswers.length}/{testSymbols.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    const accuracy = (score / testSymbols.length) * 100;
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const speed = testSymbols.length / (timeElapsed / 60); // symbols per minute

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <Card className="bg-white/10 border-white/20 p-6">
          <CardContent className="p-0 space-y-4">
            <h3 className="text-2xl font-bold text-white">Task Complete!</h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-400">{score}</div>
                <div className="text-sm text-white/70">Correct</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">{accuracy.toFixed(0)}%</div>
                <div className="text-sm text-white/70">Accuracy</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-400">{speed.toFixed(1)}</div>
                <div className="text-sm text-white/70">SPM</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show answers */}
        <div className="space-y-3">
          <h4 className="text-white/90 font-medium">Your Answers:</h4>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {testSymbols.map((symbol, index) => {
              const userAnswer = userAnswers[index];
              const correctAnswer = symbolPairs.find(pair => pair.symbol === symbol)?.code;
              const isCorrect = userAnswer === correctAnswer?.toString();

              return (
                <div
                  key={index}
                  className={`p-2 rounded-lg border text-center ${
                    isCorrect
                      ? 'bg-green-500/20 border-green-500/30'
                      : 'bg-red-500/20 border-red-500/30'
                  }`}
                >
                  <div className="text-lg mb-1">{symbol}</div>
                  <div className="text-sm">
                    <span className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                      {userAnswer || '?'}
                    </span>
                    {!isCorrect && (
                      <span className="text-white/50 ml-1">({correctAnswer})</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-2">Symbol Coding</h3>
        <p className="text-white/70 text-sm">
          Use the key to match symbols with their corresponding numbers
        </p>
      </motion.div>

      {/* Symbol key - always visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {renderSymbolKey()}
      </motion.div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div key="test">
            {renderTestArea()}
          </motion.div>
        ) : (
          <motion.div key="results">
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
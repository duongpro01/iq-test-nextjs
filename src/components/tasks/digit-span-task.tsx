"use client"

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';
import { TaskData } from '@/types';

interface DigitSpanTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

type TaskPhase = 'instructions' | 'presentation' | 'recall' | 'complete';

export function DigitSpanTask({ taskData, onAnswer, isActive, timeRemaining }: DigitSpanTaskProps) {
  const [phase, setPhase] = useState<TaskPhase>('instructions');
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const digitSequence = taskData.digitSequence || [];

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined' && audioEnabled) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioEnabled]);

  useEffect(() => {
    if (phase === 'presentation' && isActive) {
      presentNextDigit();
    }
  }, [phase, currentDigitIndex, isActive]);

  useEffect(() => {
    if (phase === 'complete' && isCorrect !== null) {
      onAnswer(isCorrect ? 1 : 0);
    }
  }, [phase, isCorrect, onAnswer]);

  const playTone = (frequency: number, duration: number = 0.2) => {
    if (!audioContextRef.current || !audioEnabled) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const presentNextDigit = () => {
    if (currentDigitIndex < digitSequence.length) {
      const digit = digitSequence[currentDigitIndex];
      
      // Play tone for the digit (different frequencies for different digits)
      const baseFrequency = 200;
      const frequency = baseFrequency + (digit * 50);
      playTone(frequency);
      
      setTimeout(() => {
        setCurrentDigitIndex(prev => prev + 1);
      }, 1000); // 1 second per digit
    } else {
      // Presentation complete, move to recall phase
      setTimeout(() => {
        setPhase('recall');
      }, 500);
    }
  };

  const handleDigitClick = (digit: number) => {
    if (phase !== 'recall') return;
    
    const newInput = [...userInput, digit];
    setUserInput(newInput);
    
    // Auto-complete when sequence is full
    if (newInput.length === digitSequence.length) {
      checkAnswer(newInput);
    }
  };

  const checkAnswer = (input: number[]) => {
    const correct = input.length === digitSequence.length && 
                   input.every((digit, index) => digit === digitSequence[index]);
    
    setIsCorrect(correct);
    setPhase('complete');
  };

  const removeLastDigit = () => {
    setUserInput(prev => prev.slice(0, -1));
  };

  const startTask = () => {
    setPhase('presentation');
    setCurrentDigitIndex(0);
  };

  const restartTask = () => {
    setPhase('instructions');
    setCurrentDigitIndex(0);
    setUserInput([]);
    setIsCorrect(null);
  };

  const renderInstructions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <h3 className="text-xl font-semibold text-white">Digit Span Test</h3>
      <div className="space-y-2 text-white/70">
        <p>You will see a sequence of {digitSequence.length} digits.</p>
        <p>Memorize them in the exact order they appear.</p>
        <p>Then click the digits in the same order.</p>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="ml-2">{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
        </Button>
      </div>
      
      <Button
        onClick={startTask}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Start Sequence
      </Button>
    </motion.div>
  );

  const renderPresentation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-6"
    >
      <h3 className="text-xl font-semibold text-white">Watch the sequence</h3>
      
      <div className="relative">
        <Card className="bg-white/10 border-white/20 p-8 mx-auto max-w-xs">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {currentDigitIndex < digitSequence.length ? (
                <motion.div
                  key={currentDigitIndex}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="text-6xl font-bold text-white"
                >
                  {digitSequence[currentDigitIndex]}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl text-white/70"
                >
                  Get ready...
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        
        {/* Progress indicator */}
        <div className="mt-4 flex justify-center gap-2">
          {digitSequence.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index < currentDigitIndex 
                  ? 'bg-green-500' 
                  : index === currentDigitIndex 
                  ? 'bg-purple-500 animate-pulse' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderRecall = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Enter the sequence</h3>
        <p className="text-white/70">Click the digits in the order you saw them</p>
      </div>
      
      {/* User input display */}
      <Card className="bg-white/10 border-white/20 p-4 mx-auto max-w-md">
        <CardContent className="p-0">
          <div className="flex justify-center gap-2 min-h-[3rem] items-center">
            {userInput.length === 0 ? (
              <span className="text-white/50 text-lg">Enter digits...</span>
            ) : (
              userInput.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                >
                  {digit}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Number pad */}
      <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <motion.div
            key={digit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="aspect-square text-xl font-bold bg-white/10 border-white/20 hover:bg-white/20 text-white"
              onClick={() => handleDigitClick(digit)}
              disabled={userInput.length >= digitSequence.length}
            >
              {digit}
            </Button>
          </motion.div>
        ))}
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={removeLastDigit}
          disabled={userInput.length === 0}
          className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Remove Last
        </Button>
      </div>
    </motion.div>
  );

  const renderComplete = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
        <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>
        <p className="text-white/70">
          Sequence: {digitSequence.join(' → ')}
        </p>
        <p className="text-white/70">
          Your answer: {userInput.join(' → ')}
        </p>
      </div>
      
      <Button
        variant="outline"
        onClick={restartTask}
        className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
      >
        Try Again
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === 'instructions' && renderInstructions()}
        {phase === 'presentation' && renderPresentation()}
        {phase === 'recall' && renderRecall()}
        {phase === 'complete' && renderComplete()}
      </AnimatePresence>
    </div>
  );
} 
"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Target, Zap } from 'lucide-react';
import { TaskData, SearchItem } from '@/types';

interface ProcessingSpeedTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

type TaskPhase = 'instructions' | 'running' | 'complete';

export function ProcessingSpeedTask({ taskData, onAnswer, isActive, timeRemaining }: ProcessingSpeedTaskProps) {
  const [phase, setPhase] = useState<TaskPhase>('instructions');
  const [currentRound, setCurrentRound] = useState(0);
  const [foundTargets, setFoundTargets] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const targetSymbols = taskData.targetSymbols || ['★', '♦'];
  const searchArray = taskData.searchArray || generateSearchArray();
  const rounds = 5;

  useEffect(() => {
    if (phase === 'running' && startTime === null) {
      setStartTime(Date.now());
    }
  }, [phase, startTime]);

  useEffect(() => {
    if (currentRound >= rounds) {
      calculateFinalScore();
      setPhase('complete');
    }
  }, [currentRound, rounds]);

  useEffect(() => {
    if (phase === 'complete') {
      onAnswer(score);
    }
  }, [phase, score, onAnswer]);

  function generateSearchArray(): SearchItem[] {
    const symbols = ['★', '♦', '○', '□', '△', '◇', '●', '■', '▲', '◆', '☆', '♠', '♣', '♥'];
    const targets = ['★', '♦'];
    const array: SearchItem[] = [];
    
    // Generate 12x8 grid (96 items)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 12; col++) {
        const isTarget = Math.random() < 0.15; // 15% chance of target
        const symbol = isTarget 
          ? targets[Math.floor(Math.random() * targets.length)]
          : symbols[Math.floor(Math.random() * symbols.length)];
        
        array.push({
          symbol,
          isTarget: targets.includes(symbol),
          position: [row, col]
        });
      }
    }
    
    return array;
  }

  const calculateFinalScore = () => {
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 1;
    const targetCount = searchArray.filter(item => item.isTarget).length;
    const accuracy = foundTargets.length > 0 ? (foundTargets.length / targetCount) * 100 : 0;
    const itemsPerSecond = foundTargets.length / timeElapsed;
    
    setScore(Math.round(accuracy));
    setSpeed(Math.round(itemsPerSecond * 60)); // items per minute
  };

  const handleItemClick = (index: number) => {
    if (phase !== 'running' || !isActive) return;

    const item = searchArray[index];
    if (item && item.isTarget && !foundTargets.includes(index)) {
      setFoundTargets(prev => [...prev, index]);
    }
  };

  const nextRound = () => {
    setCurrentRound(prev => prev + 1);
  };

  const renderInstructions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <h3 className="text-xl font-semibold text-white">Processing Speed Test</h3>
      
      <div className="space-y-4 text-white/70">
        <p>
          You will see a grid filled with various symbols.
        </p>
        <p>
          Find and click on the <strong>target symbols</strong> as quickly as possible.
        </p>
        
        <Card className="bg-white/10 border-white/20 p-4 mx-auto max-w-sm">
          <CardContent className="p-0">
            <h4 className="text-white font-medium mb-3">Target Symbols:</h4>
            <div className="flex justify-center gap-8">
              {targetSymbols.map((symbol, index) => (
                <div key={index} className="text-4xl text-yellow-400">
                  {symbol}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <p className="text-white/60 text-sm">
          Work as fast as you can while maintaining accuracy.
        </p>
      </div>
      
      <Button
        onClick={() => setPhase('running')}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Start Test
      </Button>
    </motion.div>
  );

  const renderTask = () => {
    const targetCount = searchArray.filter(item => item.isTarget).length;
    const progress = (foundTargets.length / targetCount) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Find the targets!</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-green-300">
              <Target className="w-4 h-4" />
              <span>{foundTargets.length}/{targetCount}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Zap className="w-4 h-4" />
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Target reminder */}
        <Card className="bg-white/5 border-white/10 p-2">
          <CardContent className="p-0 flex items-center justify-center gap-4">
            <span className="text-white/70 text-sm">Targets:</span>
            {targetSymbols.map((symbol, index) => (
              <span key={index} className="text-2xl text-yellow-400">
                {symbol}
              </span>
            ))}
          </CardContent>
        </Card>

        {/* Search grid */}
        <Card className="bg-white/5 border-white/10 p-4">
          <CardContent className="p-0">
            <div className="grid grid-cols-12 gap-1 max-w-4xl mx-auto">
              {searchArray.map((item, index) => {
                const isFound = foundTargets.includes(index);
                const isTarget = item.isTarget;
                
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleItemClick(index)}
                    className={`
                      aspect-square rounded text-lg font-bold transition-all duration-200
                      ${isFound 
                        ? 'bg-green-500/30 border-2 border-green-400 text-green-300' 
                        : isTarget
                        ? 'bg-white/5 hover:bg-yellow-500/20 border border-white/20 text-white hover:text-yellow-300'
                        : 'bg-white/5 hover:bg-white/10 border border-white/20 text-white/70'
                      }
                    `}
                    disabled={isFound || !isActive}
                  >
                    {item.symbol}
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-white/60 text-sm">
            Progress: {foundTargets.length} of {targetCount} targets found
          </p>
        </div>

        {/* Complete button */}
        {foundTargets.length >= targetCount * 0.8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              onClick={() => setPhase('complete')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Complete Task
            </Button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <Card className="bg-white/10 border-white/20 p-6">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-2xl font-bold text-white">Task Complete!</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-400">{score}%</div>
              <div className="text-white/70 text-sm">Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-400">{speed}</div>
              <div className="text-white/70 text-sm">Items/Min</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-white/90 font-medium">Found</div>
              <div className="text-white/70">{foundTargets.length}</div>
            </div>
            <div className="space-y-1">
              <div className="text-white/90 font-medium">Total</div>
              <div className="text-white/70">{searchArray.filter(item => item.isTarget).length}</div>
            </div>
            <div className="space-y-1">
              <div className="text-white/90 font-medium">Time</div>
              <div className="text-white/70">
                {startTime ? Math.round((Date.now() - startTime) / 1000) : 0}s
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-white/60 text-sm">
        <p>
          Processing Speed: {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs improvement'}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === 'instructions' && (
          <motion.div key="instructions">
            {renderInstructions()}
          </motion.div>
        )}
        
        {phase === 'running' && (
          <motion.div key="task">
            {renderTask()}
          </motion.div>
        )}
        
        {phase === 'complete' && (
          <motion.div key="results">
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
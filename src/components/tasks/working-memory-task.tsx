"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Square, CheckCircle, XCircle } from 'lucide-react';
import { TaskData, MemoryItem } from '@/types';

interface WorkingMemoryTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

type TaskPhase = 'instructions' | 'running' | 'complete';

export function WorkingMemoryTask({ taskData, onAnswer, isActive, timeRemaining }: WorkingMemoryTaskProps) {
  const [phase, setPhase] = useState<TaskPhase>('instructions');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [showStimulus, setShowStimulus] = useState(false);
  const [sequence, setSequence] = useState<MemoryItem[]>([]);

  const nBackLevel = taskData.nBackLevel || 2;
  const memoryItems = taskData.memoryItems || [];

  useEffect(() => {
    if (memoryItems.length > 0) {
      setSequence(memoryItems);
    } else {
      // Generate a random sequence if none provided
      generateRandomSequence();
    }
  }, [memoryItems]);

  useEffect(() => {
    if (phase === 'running' && isActive) {
      startStimulus();
    }
  }, [phase, currentIndex, isActive]);

  useEffect(() => {
    if (userResponses.length === sequence.length && phase === 'running') {
      calculateScore();
      setPhase('complete');
    }
  }, [userResponses, sequence.length, phase]);

  useEffect(() => {
    if (phase === 'complete') {
      onAnswer(score);
    }
  }, [phase, score, onAnswer]);

  const generateRandomSequence = () => {
    const positions = [
      { position: [0, 0], content: '🔵' },
      { position: [0, 1], content: '🔴' },
      { position: [1, 0], content: '🟢' },
      { position: [1, 1], content: '🟡' },
    ];

    const newSequence: MemoryItem[] = [];
    
    for (let i = 0; i < 20; i++) {
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      newSequence.push({
        id: `item-${i}`,
        content: randomPos.content,
        position: randomPos.position as [number, number]
      });
    }
    
    setSequence(newSequence);
  };

  const startStimulus = () => {
    if (currentIndex >= sequence.length) return;

    setShowStimulus(true);
    
    // Show stimulus for 500ms
    setTimeout(() => {
      setShowStimulus(false);
      
      // Wait 1.5s for response
      setTimeout(() => {
        if (currentIndex < sequence.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1500);
    }, 500);
  };

  const handleResponse = (isMatch: boolean) => {
    if (phase !== 'running' || !isActive) return;

    const newResponses = [...userResponses, isMatch];
    setUserResponses(newResponses);
  };

  const calculateScore = () => {
    let correct = 0;
    
          sequence.forEach((item, index) => {
        if (index >= nBackLevel && item.position && sequence[index - nBackLevel]?.position) {
          const currentPos = item.position;
          const nBackPos = sequence[index - nBackLevel].position;
          if (nBackPos && currentPos) {
            const isActualMatch = currentPos[0] === nBackPos[0] && currentPos[1] === nBackPos[1];
            const userResponse = userResponses[index];
            
            if (userResponse === isActualMatch) {
              correct++;
            }
          }
        }
      });
    
    const maxPossible = sequence.length - nBackLevel;
    setScore(Math.round((correct / maxPossible) * 100));
  };

  const isTargetTrial = (index: number): boolean => {
    if (index < nBackLevel) return false;
    
    const currentPos = sequence[index]?.position;
    const nBackPos = sequence[index - nBackLevel]?.position;
    
    if (!currentPos || !nBackPos) return false;
    
    return currentPos[0] === nBackPos[0] && currentPos[1] === nBackPos[1];
  };

  const renderInstructions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <h3 className="text-xl font-semibold text-white">{nBackLevel}-Back Task</h3>
      
      <div className="space-y-4 text-white/70">
        <p>
          You will see colored circles appear in different positions on a 2x2 grid.
        </p>
        <p>
          Your task is to identify when the current position matches the position from {nBackLevel} trials ago.
        </p>
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <p className="font-medium text-white mb-2">Response Keys:</p>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300">
                <CheckCircle className="w-4 h-4 mr-2" />
                Match
              </Button>
              <Button variant="outline" className="bg-red-500/20 border-red-500/30 text-red-300">
                <XCircle className="w-4 h-4 mr-2" />
                No Match
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Button
        onClick={() => setPhase('running')}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Start Task
      </Button>
    </motion.div>
  );

  const renderTask = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">{nBackLevel}-Back Task</h3>
        <p className="text-white/70 text-sm">
          Trial {currentIndex + 1} of {sequence.length}
        </p>
      </div>

      {/* Grid */}
      <div className="flex justify-center">
        <Card className="bg-white/10 border-white/20 p-8">
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-4 w-48 h-48">
              {Array.from({ length: 4 }, (_, index) => {
                const row = Math.floor(index / 2);
                const col = index % 2;
                const currentItem = sequence[currentIndex];
                                 const isCurrentPosition = showStimulus && 
                   currentItem && 
                   currentItem.position &&
                   currentItem.position[0] === row && 
                   currentItem.position[1] === col;

                return (
                  <motion.div
                    key={index}
                    className={`
                      aspect-square rounded-lg border-2 flex items-center justify-center
                      ${isCurrentPosition 
                        ? 'border-purple-400 bg-purple-500/30' 
                        : 'border-white/30 bg-white/5'
                      }
                    `}
                  >
                    <AnimatePresence>
                      {isCurrentPosition && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="text-4xl"
                        >
                          {currentItem.content}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response buttons */}
      {!showStimulus && currentIndex >= nBackLevel && userResponses.length <= currentIndex && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-6"
        >
          <Button
            onClick={() => handleResponse(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Match
          </Button>
          <Button
            onClick={() => handleResponse(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
          >
            <XCircle className="w-5 h-5 mr-2" />
            No Match
          </Button>
        </motion.div>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-center gap-1">
          {sequence.slice(0, 10).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index < userResponses.length
                  ? 'bg-green-500'
                  : index === currentIndex
                  ? 'bg-purple-500 animate-pulse'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-white/60 text-sm">
          Responses: {userResponses.length}/{sequence.length - nBackLevel}
        </p>
      </div>
    </motion.div>
  );

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <Card className="bg-white/10 border-white/20 p-6">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-2xl font-bold text-white">Task Complete!</h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">{score}%</div>
              <div className="text-white/70">Accuracy Score</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-white/90 font-medium">Task Level</div>
                <div className="text-white/70">{nBackLevel}-Back</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/90 font-medium">Trials</div>
                <div className="text-white/70">{sequence.length}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-white/60 text-sm">
        <p>Working memory performance: {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs improvement'}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[500px] flex items-center justify-center">
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
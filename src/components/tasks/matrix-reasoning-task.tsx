"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MatrixPattern, TaskData } from '@/types';

interface MatrixReasoningTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

export function MatrixReasoningTask({ taskData, onAnswer, isActive, timeRemaining }: MatrixReasoningTaskProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  
  const matrixPattern = taskData.matrixPattern;

  useEffect(() => {
    if (isActive) {
      setShowGrid(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
    }
  }, [selectedOption, onAnswer]);
  
  if (!matrixPattern) return null;

  const renderMatrixCell = (content: string | null, row: number, col: number) => {
    const isTarget = row === matrixPattern.missingIndex[0] && col === matrixPattern.missingIndex[1];
    
    return (
      <motion.div
        key={`${row}-${col}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: (row * 3 + col) * 0.1 }}
        className={`
          relative aspect-square rounded-lg border-2 flex items-center justify-center
          ${isTarget 
            ? 'border-purple-400 bg-purple-500/20 border-dashed' 
            : 'border-white/20 bg-white/5'
          }
        `}
      >
        {isTarget ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl font-bold text-purple-300"
          >
            ?
          </motion.div>
        ) : content ? (
          <div className="text-2xl">{content}</div>
        ) : null}
      </motion.div>
    );
  };

  const renderOption = (option: string, index: number) => {
    const isSelected = selectedOption === index;
    
    return (
      <motion.div
        key={index}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={isSelected ? "default" : "outline"}
          className={`
            aspect-square h-16 w-16 text-xl font-bold transition-all duration-200
            ${isSelected 
              ? 'bg-purple-600 hover:bg-purple-700 border-purple-500 shadow-lg shadow-purple-500/30' 
              : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
            }
          `}
          onClick={() => setSelectedOption(index)}
          disabled={!isActive}
        >
          {option}
        </Button>
      </motion.div>
    );
  };

  const getPatternDescription = () => {
    switch (matrixPattern.pattern) {
      case 'sequence':
        return 'Look for a numerical or alphabetical sequence';
      case 'rotation':
        return 'Look for rotating or changing orientations';
      case 'addition':
        return 'Look for addition patterns across rows or columns';
      case 'subtraction':
        return 'Look for subtraction patterns across rows or columns';
      case 'progression':
        return 'Look for mathematical progressions';
      default:
        return 'Find the pattern and complete the matrix';
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-2">Matrix Reasoning</h3>
        <p className="text-white/70 text-sm">{getPatternDescription()}</p>
      </motion.div>

      {/* Matrix Grid */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex justify-center"
          >
            <Card className="bg-white/5 border-white/10 p-6">
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  {matrixPattern.grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) =>
                      renderMatrixCell(cell, rowIndex, colIndex)
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer Options */}
      <div className="space-y-4">
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/90 font-medium"
        >
          Choose the missing piece:
        </motion.h4>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-4"
        >
          {matrixPattern.options.map((option, index) => renderOption(option, index))}
        </motion.div>
      </div>

      {/* Progress indicator */}
      {selectedOption !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Answer selected</span>
          </div>
        </motion.div>
      )}
    </div>
  );
} 
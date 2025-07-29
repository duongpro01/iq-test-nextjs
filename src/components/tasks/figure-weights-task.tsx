"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scale, Weight } from 'lucide-react';
import { TaskData, ScaleData, WeightItem } from '@/types';

interface FigureWeightsTaskProps {
  taskData: TaskData;
  onAnswer: (answer: number) => void;
  isActive: boolean;
  timeRemaining: number;
}

export function FigureWeightsTask({ taskData, onAnswer, isActive, timeRemaining }: FigureWeightsTaskProps) {
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const scaleData = taskData.scaleData;

  useEffect(() => {
    if (selectedWeight !== null) {
      setIsComplete(true);
      // Check if correct (simplified for demo)
      const isCorrect = selectedWeight === scaleData?.correctWeight;
      onAnswer(isCorrect ? 1 : 0);
    }
  }, [selectedWeight, scaleData?.correctWeight, onAnswer]);

  if (!scaleData) return null;

  const calculateTilt = () => {
    const leftTotal = scaleData.leftSide.reduce((sum, item) => sum + item.value, 0);
    const rightTotal = scaleData.rightSide.reduce((sum, item) => sum + item.value, 0);
    
    if (selectedWeight && scaleData.missingWeight === 'right') {
      const selectedValue = parseInt(selectedWeight);
      const newRightTotal = rightTotal + selectedValue;
      return leftTotal - newRightTotal;
    } else if (selectedWeight && scaleData.missingWeight === 'left') {
      const selectedValue = parseInt(selectedWeight);
      const newLeftTotal = leftTotal + selectedValue;
      return newLeftTotal - rightTotal;
    }
    
    return leftTotal - rightTotal;
  };

  const renderWeight = (weight: WeightItem, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClasses = {
      small: 'w-8 h-8 text-xs',
      medium: 'w-12 h-12 text-sm',
      large: 'w-16 h-16 text-base'
    };

    const shapeStyles = {
      circle: 'rounded-full',
      square: 'rounded-lg',
      triangle: 'rounded-lg', // Approximation for triangle
      diamond: 'rounded-lg rotate-45'
    };

    return (
      <div
        className={`
          ${sizeClasses[size]} 
          ${shapeStyles[weight.shape as keyof typeof shapeStyles] || 'rounded-lg'}
          flex items-center justify-center font-bold text-white border-2 border-white/30
          transition-all duration-300
        `}
        style={{ backgroundColor: weight.color || '#8B5CF6' }}
      >
        {weight.value}
      </div>
    );
  };

  const renderScale = () => {
    const tilt = calculateTilt();
    const leftRotation = Math.max(-15, Math.min(15, tilt * 3));
    const rightRotation = -leftRotation;

    return (
      <Card className="bg-white/10 border-white/20 p-8 mx-auto max-w-2xl">
        <CardContent className="p-0">
          <div className="relative flex items-center justify-center h-64">
            {/* Scale base */}
            <div className="absolute bottom-0 w-4 h-32 bg-gray-600 rounded-t-lg" />
            <div className="absolute bottom-32 w-32 h-2 bg-gray-600 rounded-full transform origin-center transition-transform duration-500"
                 style={{ transform: `rotate(${tilt * 2}deg)` }} />
            
            {/* Left side */}
            <div 
              className="absolute left-8 transform transition-transform duration-500 origin-bottom"
              style={{ transform: `rotate(${leftRotation}deg)` }}
            >
              <div className="w-32 h-2 bg-gray-500 mb-2" />
              <Card className="bg-white/20 border-white/30 p-3">
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 justify-center min-h-[4rem] items-center">
                    {scaleData.leftSide.map((weight, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {renderWeight(weight)}
                      </motion.div>
                    ))}
                    {scaleData.missingWeight === 'left' && selectedWeight && (
                      <motion.div
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="border-2 border-dashed border-yellow-400"
                      >
                        {renderWeight({ 
                          id: 'selected', 
                          value: parseInt(selectedWeight), 
                          shape: 'circle',
                          color: '#FBBF24'
                        })}
                      </motion.div>
                    )}
                    {scaleData.missingWeight === 'left' && !selectedWeight && (
                      <div className="w-12 h-12 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center text-white/50 text-xs">
                        ?
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side */}
            <div 
              className="absolute right-8 transform transition-transform duration-500 origin-bottom"
              style={{ transform: `rotate(${rightRotation}deg)` }}
            >
              <div className="w-32 h-2 bg-gray-500 mb-2" />
              <Card className="bg-white/20 border-white/30 p-3">
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 justify-center min-h-[4rem] items-center">
                    {scaleData.rightSide.map((weight, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {renderWeight(weight)}
                      </motion.div>
                    ))}
                    {scaleData.missingWeight === 'right' && selectedWeight && (
                      <motion.div
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="border-2 border-dashed border-yellow-400"
                      >
                        {renderWeight({ 
                          id: 'selected', 
                          value: parseInt(selectedWeight), 
                          shape: 'circle',
                          color: '#FBBF24'
                        })}
                      </motion.div>
                    )}
                    {scaleData.missingWeight === 'right' && !selectedWeight && (
                      <div className="w-12 h-12 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center text-white/50 text-xs">
                        ?
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Balance indicator */}
            <div className="absolute top-4 flex items-center gap-2 text-white/70 text-sm">
              <Scale className="w-4 h-4" />
              <span>
                {Math.abs(tilt) < 0.5 ? 'Balanced' : tilt > 0 ? 'Left heavy' : 'Right heavy'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWeightOptions = () => (
    <div className="space-y-4">
      <h4 className="text-center text-white/90 font-medium">
        Choose the weight to balance the scale:
      </h4>
      
      <div className="flex justify-center gap-4">
        {scaleData.availableWeights.map((weight) => (
          <motion.div
            key={weight.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedWeight === weight.value.toString() ? "default" : "outline"}
              className={`
                p-4 h-auto transition-all duration-200
                ${selectedWeight === weight.value.toString()
                  ? 'bg-purple-600 hover:bg-purple-700 border-purple-500 shadow-lg shadow-purple-500/30'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                }
              `}
              onClick={() => setSelectedWeight(weight.value.toString())}
              disabled={!isActive || isComplete}
            >
              <div className="flex flex-col items-center gap-2">
                {renderWeight(weight, 'large')}
                <span className="text-sm font-medium">{weight.value}</span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCompletion = () => {
    const isCorrect = selectedWeight === scaleData.correctWeight;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <Card className={`p-6 ${isCorrect ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
          <CardContent className="p-0 space-y-4">
            <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>
            
            <p className="text-white/70">
              {isCorrect 
                ? 'You successfully balanced the scale!'
                : `The correct weight was ${scaleData.correctWeight}. You selected ${selectedWeight}.`
              }
            </p>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-white/90 font-medium">Your Answer</div>
                <div className="text-white/70">{selectedWeight}</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/90 font-medium">Correct Answer</div>
                <div className="text-white/70">{scaleData.correctWeight}</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/90 font-medium">Result</div>
                <div className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                  {isCorrect ? 'Success' : 'Incorrect'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <h3 className="text-xl font-semibold text-white mb-2">Figure Weights</h3>
        <p className="text-white/70 text-sm">
          Balance the scale by selecting the correct weight for the {scaleData.missingWeight} side
        </p>
      </motion.div>

      {/* Scale display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {renderScale()}
      </motion.div>

      {/* Weight options or completion */}
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {renderWeightOptions()}
          </motion.div>
        ) : (
          <motion.div key="complete">
            {renderCompletion()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {selectedWeight && !isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
            <Weight className="w-4 h-4" />
            <span className="text-sm font-medium">Weight selected: {selectedWeight}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
} 
"use client"

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain, Target, Zap } from 'lucide-react';

interface ProgressionPoint {
  questionIndex: number;
  abilityEstimate: number;
  responseTime: number;
  accuracy: number;
  difficulty: number;
}

interface AdaptiveProgressionChartProps {
  progressionData: ProgressionPoint[];
  currentAbility: number;
  targetAbility: number;
  className?: string;
}

export function AdaptiveProgressionChart({ 
  progressionData, 
  currentAbility, 
  targetAbility,
  className = "" 
}: AdaptiveProgressionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || progressionData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Chart dimensions
    const padding = 40;
    const width = rect.width - padding * 2;
    const height = rect.height - padding * 2;

    // Find data bounds
    const abilities = progressionData.map(p => p.abilityEstimate);
    const minAbility = Math.min(...abilities, targetAbility);
    const maxAbility = Math.max(...abilities, targetAbility);
    const abilityRange = maxAbility - minAbility;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + width, y);
      ctx.stroke();
    }

    // Draw ability progression line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    progressionData.forEach((point, index) => {
      const x = padding + (width / (progressionData.length - 1)) * index;
      const y = padding + height - ((point.abilityEstimate - minAbility) / abilityRange) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw target line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const targetY = padding + height - ((targetAbility - minAbility) / abilityRange) * height;
    ctx.beginPath();
    ctx.moveTo(padding, targetY);
    ctx.lineTo(padding + width, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw current ability indicator
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    const currentX = padding + width;
    const currentY = padding + height - ((currentAbility - minAbility) / abilityRange) * height;
    ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      const ability = maxAbility - (abilityRange / 5) * i;
      ctx.fillText(ability.toFixed(1), padding - 10, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    progressionData.forEach((_, index) => {
      const x = padding + (width / (progressionData.length - 1)) * index;
      ctx.fillText(`${index + 1}`, x, padding + height + 20);
    });

  }, [progressionData, currentAbility, targetAbility]);

  const progressPercentage = ((currentAbility + 3) / 6) * 100; // Assuming range from -3 to +3

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Adaptive Progression</CardTitle>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Live</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart Canvas */}
        <div className="relative h-64 bg-muted/20 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: 'block' }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Current Ability</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {currentAbility.toFixed(1)}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Target</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {targetAbility.toFixed(1)}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {progressPercentage.toFixed(0)}%
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Questions</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {progressionData.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Target</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
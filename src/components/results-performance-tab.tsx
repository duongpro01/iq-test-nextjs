"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  Shield,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { TestResult } from '@/types';
import { AdaptiveProgressionChart } from '@/components/adaptive-progression-chart';

interface ResultsPerformanceTabProps {
  result: TestResult;
  responseTimeData: any[];
  securityReport: any;
}

export function ResultsPerformanceTab({ 
  result, 
  responseTimeData,
  securityReport 
}: ResultsPerformanceTabProps) {
  // Create progression data from result
  const progressionData = result.abilityProgression?.map((ability, index) => ({
    questionIndex: index + 1,
    abilityEstimate: ability,
    responseTime: result.responseTimeProgression?.[index] || 0,
    accuracy: result.accuracyProgression?.[index] || 0,
    difficulty: result.difficultyProgression?.[index] || 0
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Response Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Response Time Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {responseTimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" name="Question" />
                <YAxis dataKey="time" name="Time (s)" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Response Time" dataKey="time" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Response time data not available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{(result.averageResponseTime / 1000)?.toFixed(1) || 'N/A'}s</div>
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{result.accuracy?.toFixed(1) || 'N/A'}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{result.standardError?.toFixed(3) || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">Standard Error</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{(securityReport?.confidenceScore * 100)?.toFixed(0) || 'N/A'}%</div>
            <div className="text-sm text-muted-foreground">Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Performance Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Test Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Questions:</span>
                  <span className="font-semibold">{result.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Correct Answers:</span>
                  <span className="font-semibold">{result.correctAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completion Time:</span>
                  <span className="font-semibold">{Math.round(result.completionTime / 60)}m {Math.round(result.completionTime % 60)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Questions per Minute:</span>
                  <span className="font-semibold">{(result.totalQuestions / (result.completionTime / 60)).toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Quality Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cronbach's Alpha:</span>
                  <span className="font-semibold">{result.cronbachAlpha?.toFixed(3) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Test Reliability:</span>
                  <span className="font-semibold">{result.testReliability?.toFixed(3) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Measurement Precision:</span>
                  <span className="font-semibold">{result.measurementPrecision?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Final θ (Theta):</span>
                  <span className="font-semibold">{result.finalAbilityEstimate?.toFixed(3) || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Test Progression Chart */}
      {progressionData.length > 0 && (
        <AdaptiveProgressionChart 
          progressionData={progressionData}
          currentAbility={result.finalAbilityEstimate || 0}
          targetAbility={result.finalAbilityEstimate || 0}
        />
      )}
    </motion.div>
  );
} 
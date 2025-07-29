"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Star,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { TestResult } from '@/types';

interface ResultsOverviewTabProps {
  result: TestResult;
  cognitiveProfile: any;
  abilityProgression: any;
}

export function ResultsOverviewTab({ 
  result, 
  cognitiveProfile,
  abilityProgression 
}: ResultsOverviewTabProps) {
  const domains = [
    {
      domain: 'Pattern Recognition',
      score: cognitiveProfile?.patternRecognition || 0,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      domain: 'Spatial Reasoning',
      score: cognitiveProfile?.spatialReasoning || 0,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      domain: 'Logical Deduction',
      score: cognitiveProfile?.logicalDeduction || 0,
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      domain: 'Numerical Reasoning',
      score: cognitiveProfile?.numericalReasoning || 0,
      icon: BarChart3,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      domain: 'Short-term Memory',
      score: cognitiveProfile?.shortTermMemory || 0,
      icon: Activity,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Overall Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {result.accuracy?.toFixed(1) || 'N/A'}%
            </div>
            <p className="text-muted-foreground mb-4">
              Overall accuracy across all cognitive domains
            </p>
            <div className="w-full bg-muted rounded-full h-3 mb-4">
              <motion.div
                className="bg-primary h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${result.accuracy || 0}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Cognitive Domain Scores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.domain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${domain.bgColor}`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <domain.icon className={`w-5 h-5 ${domain.color}`} />
                  <h3 className="font-semibold">{domain.domain}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Score:</span>
                    <span className="font-bold">{domain.score?.toFixed(1) || 'N/A'}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${domain.color.replace('text-', 'bg-')}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${domain.score || 0}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Test Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Questions:</span>
                <span className="font-semibold">{result.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Correct Answers:</span>
                <span className="font-semibold">{result.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion Time:</span>
                <span className="font-semibold">{Math.round(result.completionTime / 60)}m {Math.round(result.completionTime % 60)}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Questions per Minute:</span>
                <span className="font-semibold">{(result.totalQuestions / (result.completionTime / 60)).toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Quality Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cronbach's Alpha:</span>
                <span className="font-semibold">{result.cronbachAlpha?.toFixed(3) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Test Reliability:</span>
                <span className="font-semibold">{result.testReliability?.toFixed(3) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Measurement Precision:</span>
                <span className="font-semibold">{result.measurementPrecision?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Final θ (Theta):</span>
                <span className="font-semibold">{result.finalAbilityEstimate?.toFixed(3) || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IRT Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>IRT Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {result.finalAbilityEstimate?.toFixed(3) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Final θ (Theta)</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {result.standardError?.toFixed(3) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Standard Error</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(1 / (result.standardError || 1))?.toFixed(2) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Precision</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 
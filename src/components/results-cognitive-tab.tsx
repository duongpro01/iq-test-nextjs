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
  Activity
} from 'lucide-react';
import { TestResult } from '@/types';

interface ResultsCognitiveTabProps {
  result: TestResult;
  cognitiveProfile: any;
  abilityProgression: any;
}

export function ResultsCognitiveTab({ 
  result, 
  cognitiveProfile,
  abilityProgression 
}: ResultsCognitiveTabProps) {
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
      {/* Cognitive Domain Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Cognitive Domain Analysis</span>
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

      {/* Detailed Domain Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Domain */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Performance Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {domains.map((domain, index) => (
                <motion.div
                  key={domain.domain}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <domain.icon className={`w-4 h-4 ${domain.color}`} />
                    <span className="font-medium">{domain.domain}</span>
                  </div>
                  <div className="text-xl font-bold">{domain.score?.toFixed(1) || 'N/A'}%</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cognitive Strengths & Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Cognitive Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Strengths */}
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                <div className="space-y-2">
                  {domains
                    .filter(domain => domain.score >= 70)
                    .map(domain => (
                      <div key={domain.domain} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{domain.domain}: {domain.score?.toFixed(1) || 'N/A'}%</span>
                      </div>
                    ))}
                  {domains.filter(domain => domain.score >= 70).length === 0 && (
                    <p className="text-sm text-muted-foreground">No significant strengths identified</p>
                  )}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">Areas for Improvement</h4>
                <div className="space-y-2">
                  {domains
                    .filter(domain => domain.score < 70)
                    .map(domain => (
                      <div key={domain.domain} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">{domain.domain}: {domain.score?.toFixed(1) || 'N/A'}%</span>
                      </div>
                    ))}
                  {domains.filter(domain => domain.score < 70).length === 0 && (
                    <p className="text-sm text-muted-foreground">All domains show good performance</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IRT Parameters */}
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
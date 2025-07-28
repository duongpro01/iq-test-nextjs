"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star,
  AlertTriangle
} from 'lucide-react';
import { TestResult } from '@/types';
import { useGamificationStore } from '@/store/gamification-store';
import { ResultsOverviewTab } from './results-overview-tab';
import { ResultsCognitiveTab } from './results-cognitive-tab';
import { ResultsPerformanceTab } from './results-performance-tab';
import { ResultsComparisonTab } from './results-comparison-tab';
import { ResultsExportTab } from './results-export-tab';

interface EnhancedResultsDashboardProps {
  result: TestResult;
  onRestart: () => void;
  onChallengeMode?: () => void;
}

export function EnhancedResultsDashboard({ 
  result, 
  onRestart, 
  onChallengeMode 
}: EnhancedResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    addXP, 
    unlockAchievement, 
    awardBadge,
    trackEngagement 
  } = useGamificationStore();

  useEffect(() => {
    // Award completion XP and check for achievements
    addXP(100, 'test_completion');
    
    if (result.accuracy >= 90) {
      unlockAchievement('perfect_score');
      awardBadge('accuracy_master');
    }
    
    if (result.estimatedIQ >= 140) {
      awardBadge('genius_level');
    }
    
    trackEngagement('results_viewed', { 
      iq: result.estimatedIQ, 
      accuracy: result.accuracy 
    });
  }, [result, addXP, unlockAchievement, awardBadge, trackEngagement]);

  // Generate cognitive profile data
  const cognitiveProfile = [
    {
      domain: 'Pattern Recognition',
      score: result.domainMastery?.['Pattern Recognition']?.abilityEstimate * 20 + 50 || 50,
      percentile: Math.min(99, Math.max(1, (result.domainMastery?.['Pattern Recognition']?.abilityEstimate || 0) * 15 + 50)),
      fullMark: 100
    },
    {
      domain: 'Spatial Reasoning',
      score: result.domainMastery?.['Spatial Reasoning']?.abilityEstimate * 20 + 50 || 50,
      percentile: Math.min(99, Math.max(1, (result.domainMastery?.['Spatial Reasoning']?.abilityEstimate || 0) * 15 + 50)),
      fullMark: 100
    },
    {
      domain: 'Logical Deduction',
      score: result.domainMastery?.['Logical Deduction']?.abilityEstimate * 20 + 50 || 50,
      percentile: Math.min(99, Math.max(1, (result.domainMastery?.['Logical Deduction']?.abilityEstimate || 0) * 15 + 50)),
      fullMark: 100
    },
    {
      domain: 'Memory',
      score: result.domainMastery?.['Short-Term Memory']?.abilityEstimate * 20 + 50 || 50,
      percentile: Math.min(99, Math.max(1, (result.domainMastery?.['Short-Term Memory']?.abilityEstimate || 0) * 15 + 50)),
      fullMark: 100
    },
    {
      domain: 'Numerical',
      score: result.domainMastery?.['Numerical Reasoning']?.abilityEstimate * 20 + 50 || 50,
      percentile: Math.min(99, Math.max(1, (result.domainMastery?.['Numerical Reasoning']?.abilityEstimate || 0) * 15 + 50)),
      fullMark: 100
    }
  ];

  // Generate ability progression data
  const abilityProgression = result.abilityProgression?.map((point, index) => ({
    question: index + 1,
    ability: point,
    confidence: Math.max(0.5, 1 - (index * 0.02)) // Decreasing confidence over time
  })) || [];

  // Generate response time analysis with fallback data
  const responseTimeData = result.responseTimeProgression?.map((time, index) => ({
    question: index + 1,
    time: time / 1000, // Convert to seconds
    difficulty: Math.random() * 5 + 1 // Fallback difficulty
  })) || [];

  // Mock security report since security engine is disabled
  const securityReport = {
    confidenceScore: 0.95,
    riskLevel: 'low' as const,
    summary: 'Test completed successfully',
    totalEvents: 0,
    sessionDuration: result.completionTime / 1000
  };

  const getIQClassification = (iq: number) => {
    if (iq >= 160) return { label: 'Exceptional Genius', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (iq >= 145) return { label: 'Genius', color: 'text-indigo-600', bg: 'bg-indigo-100' };
    if (iq >= 130) return { label: 'Highly Gifted', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (iq >= 120) return { label: 'Superior', color: 'text-green-600', bg: 'bg-green-100' };
    if (iq >= 110) return { label: 'High Average', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (iq >= 90) return { label: 'Average', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (iq >= 80) return { label: 'Low Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Below Average', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const classification = getIQClassification(result.estimatedIQ);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <div>
              <h1 className="text-4xl font-bold">Your IQ Test Results</h1>
              <p className="text-muted-foreground">Comprehensive cognitive assessment</p>
            </div>
          </div>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardContent className="p-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-8xl font-bold text-primary mb-4"
                >
                  {result.estimatedIQ}
                </motion.div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${classification.bg} ${classification.color} text-lg font-semibold mb-4`}>
                  <Star className="w-5 h-5 mr-2" />
                  {classification.label}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(result.percentileRank)}th
                    </div>
                    <div className="text-sm text-muted-foreground">Percentile</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(result.completionTime / 60)}m
                    </div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Status */}
        {securityReport.riskLevel !== 'low' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className={`border-${securityReport.riskLevel === 'critical' ? 'red' : 'yellow'}-500/50`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 text-${securityReport.riskLevel === 'critical' ? 'red' : 'yellow'}-500`} />
                  <div>
                    <div className="font-semibold">Security Notice</div>
                    <div className="text-sm text-muted-foreground">{securityReport.summary}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
              className="min-w-[120px]"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'cognitive' ? 'default' : 'outline'}
              onClick={() => setActiveTab('cognitive')}
              className="min-w-[120px]"
            >
              Cognitive
            </Button>
            <Button
              variant={activeTab === 'performance' ? 'default' : 'outline'}
              onClick={() => setActiveTab('performance')}
              className="min-w-[120px]"
            >
              Performance
            </Button>
            <Button
              variant={activeTab === 'comparison' ? 'default' : 'outline'}
              onClick={() => setActiveTab('comparison')}
              className="min-w-[120px]"
            >
              Comparison
            </Button>
            <Button
              variant={activeTab === 'export' ? 'default' : 'outline'}
              onClick={() => setActiveTab('export')}
              className="min-w-[120px]"
            >
              Export & Share
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <ResultsOverviewTab 
              key="overview"
              result={result}
              cognitiveProfile={cognitiveProfile}
              abilityProgression={abilityProgression}
              securityReport={securityReport}
            />
          )}

          {activeTab === 'cognitive' && (
            <ResultsCognitiveTab 
              key="cognitive"
              result={result}
              cognitiveProfile={cognitiveProfile}
              abilityProgression={abilityProgression}
            />
          )}

          {activeTab === 'performance' && (
            <ResultsPerformanceTab 
              key="performance"
              result={result}
              responseTimeData={responseTimeData}
              securityReport={securityReport}
            />
          )}

          {activeTab === 'comparison' && (
            <ResultsComparisonTab 
              key="comparison"
              result={result}
            />
          )}

          {activeTab === 'export' && (
            <ResultsExportTab 
              key="export"
              result={result}
              cognitiveProfile={cognitiveProfile}
              securityReport={securityReport}
            />
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Button onClick={onRestart} size="lg" className="min-w-[200px]">
            Take Another Test
          </Button>
          {onChallengeMode && (
            <Button variant="outline" onClick={onChallengeMode} size="lg" className="min-w-[200px]">
              Try Challenge Mode
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
} 
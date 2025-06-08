'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Settings, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our Tier 1 systems
import { EnhancedLeaderboard } from './enhanced-leaderboard';
import { CheatDetectionOverlay, useCheatDetection } from './cheat-detection-overlay';
import { EnhancedResultsExport } from './enhanced-results-export';
import { leaderboardEngine } from '@/lib/leaderboard-engine';
import { gamificationEngine } from '@/lib/gamification-engine';
import { featureToggleEngine } from '@/lib/feature-toggle-engine';
import { TestResult, QuestionCategory, IQClassification } from '@/types';

interface Tier1IntegrationProps {
  testResult?: TestResult;
  userId: string;
  sessionId: string;
}

export function Tier1IntegrationExample({ testResult, userId, sessionId }: Tier1IntegrationProps) {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [userProfile, setUserProfile] = useState({
    username: `User_${userId.substring(0, 6)}`,
    level: 15,
    totalXP: 12500
  });

  // Feature flags
  const [featuresEnabled, setFeaturesEnabled] = useState({
    leaderboard: true,
    gamification: true,
    cheatDetection: true,
    enhancedResults: true,
    socialSharing: true
  });

  // Security monitoring
  const { securityMetrics, isSecure } = useCheatDetection(featuresEnabled.cheatDetection);

  // Initialize feature toggle engine with user context
  useEffect(() => {
    featureToggleEngine.setUserContext({
      userId,
      userType: 'returning',
      country: 'US',
      device: 'desktop',
      browser: 'chrome',
      level: userProfile.level,
      sessionId
    });

    // Check which features are enabled
    setFeaturesEnabled({
      leaderboard: featureToggleEngine.isFeatureEnabled('global_leaderboard'),
      gamification: featureToggleEngine.isFeatureEnabled('gamification_system'),
      cheatDetection: featureToggleEngine.isFeatureEnabled('cheat_detection'),
      enhancedResults: featureToggleEngine.isFeatureEnabled('enhanced_results'),
      socialSharing: featureToggleEngine.isFeatureEnabled('social_sharing')
    });
  }, [userId, sessionId, userProfile.level]);

  // Mock test result for demonstration
  const mockTestResult: TestResult = testResult || {
    sessionId,
    totalQuestions: 30,
    correctAnswers: 24,
    accuracy: 80,
    averageResponseTime: 15000,
    categoryScores: [
      {
        category: QuestionCategory.PATTERN_RECOGNITION,
        correct: 5,
        total: 6,
        accuracy: 83.3,
        averageResponseTime: 14000,
        averageDifficulty: 0.6,
        abilityEstimate: 1.2,
        standardError: 0.3,
        informationGained: 2.1
      },
      {
        category: QuestionCategory.SPATIAL_REASONING,
        correct: 4,
        total: 6,
        accuracy: 66.7,
        averageResponseTime: 18000,
        averageDifficulty: 0.8,
        abilityEstimate: 0.8,
        standardError: 0.4,
        informationGained: 1.8
      },
      {
        category: QuestionCategory.LOGICAL_DEDUCTION,
        correct: 5,
        total: 6,
        accuracy: 83.3,
        averageResponseTime: 12000,
        averageDifficulty: 0.7,
        abilityEstimate: 1.1,
        standardError: 0.3,
        informationGained: 2.0
      },
      {
        category: QuestionCategory.SHORT_TERM_MEMORY,
        correct: 5,
        total: 6,
        accuracy: 83.3,
        averageResponseTime: 16000,
        averageDifficulty: 0.5,
        abilityEstimate: 1.0,
        standardError: 0.3,
        informationGained: 1.9
      },
      {
        category: QuestionCategory.NUMERICAL_REASONING,
        correct: 5,
        total: 6,
        accuracy: 83.3,
        averageResponseTime: 13000,
        averageDifficulty: 0.6,
        abilityEstimate: 1.3,
        standardError: 0.3,
        informationGained: 2.2
      }
    ],
    estimatedIQ: 125,
    finalAbilityEstimate: 1.1,
    standardError: 0.3,
    confidenceInterval: [118, 132],
    percentileRank: 85,
    classification: 'Superior (120-129)' as const,
    difficultyProgression: [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.1, 0.9, 1.3, 1.5],
    abilityProgression: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.1, 1.0, 1.2, 1.1],
    responseTimeProgression: [20000, 18000, 15000, 12000, 14000, 16000, 13000, 11000, 17000, 15000],
    informationCurve: [0.5, 1.0, 1.5, 2.0, 2.2, 2.1, 2.3, 2.0, 2.4, 2.2],
    domainMastery: {
      [QuestionCategory.PATTERN_RECOGNITION]: {
        abilityEstimate: 1.2,
        standardError: 0.3,
        questionsAnswered: 6,
        averageInformation: 2.1,
        masteryLevel: 'Proficient',
        strengthAreas: ['Visual patterns', 'Sequence recognition'],
        improvementAreas: ['Complex matrices']
      },
      [QuestionCategory.SPATIAL_REASONING]: {
        abilityEstimate: 0.8,
        standardError: 0.4,
        questionsAnswered: 6,
        averageInformation: 1.8,
        masteryLevel: 'Developing',
        strengthAreas: ['2D rotation'],
        improvementAreas: ['3D visualization', 'Mental folding']
      },
      [QuestionCategory.LOGICAL_DEDUCTION]: {
        abilityEstimate: 1.1,
        standardError: 0.3,
        questionsAnswered: 6,
        averageInformation: 2.0,
        masteryLevel: 'Proficient',
        strengthAreas: ['Syllogistic reasoning'],
        improvementAreas: ['Complex logical chains']
      },
      [QuestionCategory.SHORT_TERM_MEMORY]: {
        abilityEstimate: 1.0,
        standardError: 0.3,
        questionsAnswered: 6,
        averageInformation: 1.9,
        masteryLevel: 'Proficient',
        strengthAreas: ['Digit span'],
        improvementAreas: ['Working memory']
      },
      [QuestionCategory.NUMERICAL_REASONING]: {
        abilityEstimate: 1.3,
        standardError: 0.3,
        questionsAnswered: 6,
        averageInformation: 2.2,
        masteryLevel: 'Advanced',
        strengthAreas: ['Number series', 'Mathematical operations'],
        improvementAreas: ['Complex calculations']
      }
    },
    completionTime: 450,
    cronbachAlpha: 0.89,
    measurementPrecision: 3.33,
    testReliability: 0.91
  };

  // Handle test completion and integration
  const handleTestCompletion = async () => {
    if (!testResult) return;

    try {
      // 1. Submit to leaderboard (if enabled)
      if (featuresEnabled.leaderboard) {
        await leaderboardEngine.submitScore(testResult, sessionId, {
          userAgent: navigator.userAgent,
          country: 'US'
        });
      }

      // 2. Calculate gamification rewards (if enabled)
      if (featuresEnabled.gamification) {
        const streakData = {
          currentStreak: 5,
          longestStreak: 12,
          streakType: 'daily' as const,
          lastActivity: new Date(),
          streakMultiplier: 1.5,
          streakBonusXP: 250
        };

        const xpCalculation = gamificationEngine.calculateXP(testResult, userProfile.level, streakData);
        console.log('XP Earned:', xpCalculation);

        // Update user profile
        setUserProfile(prev => ({
          ...prev,
          totalXP: prev.totalXP + xpCalculation.totalXP
        }));
      }

      console.log('Test completion processed successfully');
    } catch (error) {
      console.error('Error processing test completion:', error);
    }
  };

  // Feature toggle admin panel
  const FeatureTogglePanel = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Feature Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(featuresEnabled).map(([feature, enabled]) => (
          <div key={feature} className="flex items-center justify-between">
            <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
            <Button
              variant={enabled ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newState = { ...featuresEnabled, [feature]: !enabled };
                setFeaturesEnabled(newState);
                
                // Update feature toggle engine
                featureToggleEngine.toggleFeature(
                  feature === 'leaderboard' ? 'global_leaderboard' :
                  feature === 'gamification' ? 'gamification_system' :
                  feature === 'cheatDetection' ? 'cheat_detection' :
                  feature === 'enhancedResults' ? 'enhanced_results' :
                  'social_sharing',
                  !enabled
                );
              }}
            >
              {enabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Security Overlay */}
      {featuresEnabled.cheatDetection && (
        <CheatDetectionOverlay
          isActive={true}
          showDetailedMetrics={true}
          position="top-right"
        />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">
            🧠 Tier 1 Features Integration Demo
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Production-ready adaptive IQ testing platform with world-class features
          </p>
          
          {/* Security Status */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isSecure ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                Security: {isSecure ? 'Secure' : 'At Risk'} 
                ({Math.round(securityMetrics.confidenceScore * 100)}%)
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">
                Level {userProfile.level} • {userProfile.totalXP.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleTestCompletion} className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Process Test Results
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('admin')}>
              <Settings className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="leaderboard" disabled={!featuresEnabled.leaderboard}>
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!featuresEnabled.enhancedResults}>
              Results & Export
            </TabsTrigger>
            <TabsTrigger value="gamification" disabled={!featuresEnabled.gamification}>
              Gamification
            </TabsTrigger>
            <TabsTrigger value="security">
              Security
            </TabsTrigger>
            <TabsTrigger value="admin">
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="mt-6">
            {featuresEnabled.leaderboard ? (
              <EnhancedLeaderboard
                currentUserId={userId}
                showCountryFilter={true}
                showStats={true}
                maxEntries={50}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Leaderboard feature is disabled</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {featuresEnabled.enhancedResults ? (
              <EnhancedResultsExport
                result={mockTestResult}
                userProfile={userProfile}
                onShare={(platform, url) => {
                  console.log(`Shared on ${platform}: ${url}`);
                }}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Enhanced results feature is disabled</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="gamification" className="mt-6">
            {featuresEnabled.gamification ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>XP & Leveling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Level {userProfile.level}</span>
                          <span>{userProfile.totalXP.toLocaleString()} XP</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          2,500 XP to next level
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <p className="font-medium">Speed Demon</p>
                          <p className="text-sm text-muted-foreground">Complete test under 10s avg</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <span className="text-2xl">🧩</span>
                        <div>
                          <p className="font-medium">Pattern Master</p>
                          <p className="text-sm text-muted-foreground">Excel in pattern recognition</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Gamification feature is disabled</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Confidence Score</span>
                      <span className="font-bold">{Math.round(securityMetrics.confidenceScore * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Focus Events</span>
                      <span>{securityMetrics.focusEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tab Switches</span>
                      <span>{securityMetrics.tabSwitches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session Duration</span>
                      <span>{Math.round(securityMetrics.sessionDuration / 60)}m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${
                    isSecure ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">
                        {isSecure ? 'Test Environment Secure' : 'Security Concerns Detected'}
                      </span>
                    </div>
                    <p className="text-sm">
                      {isSecure 
                        ? 'No suspicious activity detected. Test results are reliable.'
                        : 'Some suspicious patterns detected. Results may be flagged for review.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FeatureTogglePanel />
              
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Features Active</span>
                      <span>{Object.values(featuresEnabled).filter(Boolean).length}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Level</span>
                      <span className={isSecure ? 'text-green-600' : 'text-red-600'}>
                        {isSecure ? 'High' : 'Medium'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance</span>
                      <span className="text-green-600">Optimal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 
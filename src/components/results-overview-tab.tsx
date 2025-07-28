"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Star,
  Trophy,
  Award,
  Zap,
  Clock,
  Shield,
  BarChart3
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';
import { TestResult, QuestionCategory } from '@/types';

interface ResultsOverviewTabProps {
  result: TestResult;
  cognitiveProfile: any[];
  abilityProgression: any[];
  securityReport: any;
}

export function ResultsOverviewTab({ 
  result, 
  cognitiveProfile, 
  abilityProgression,
  securityReport 
}: ResultsOverviewTabProps) {
  const getIQClassification = (iq: number) => {
    if (iq >= 160) return { label: 'Exceptional Genius', color: 'text-purple-600', bg: 'bg-purple-100', icon: Trophy };
    if (iq >= 145) return { label: 'Genius', color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Award };
    if (iq >= 130) return { label: 'Highly Gifted', color: 'text-blue-600', bg: 'bg-blue-100', icon: Star };
    if (iq >= 120) return { label: 'Superior', color: 'text-green-600', bg: 'bg-green-100', icon: TrendingUp };
    if (iq >= 110) return { label: 'High Average', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: BarChart3 };
    if (iq >= 90) return { label: 'Average', color: 'text-gray-600', bg: 'bg-gray-100', icon: Target };
    if (iq >= 80) return { label: 'Low Average', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
    return { label: 'Below Average', color: 'text-red-600', bg: 'bg-red-100', icon: Shield };
  };

  const classification = getIQClassification(result.estimatedIQ);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* IQ Score Summary */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span>IQ Score Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {result.estimatedIQ}
              </div>
              <div className="text-sm text-muted-foreground">Estimated IQ</div>
              <div className="text-xs text-muted-foreground mt-1">
                CI: {Math.round(result.confidenceInterval[0])} - {Math.round(result.confidenceInterval[1])}
              </div>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${classification.bg} ${classification.color} text-sm font-semibold mb-2`}>
                <classification.icon className="w-4 h-4 mr-1" />
                {classification.label}
              </div>
              <div className="text-sm text-muted-foreground">Classification</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {result.percentileRank}th
              </div>
              <div className="text-sm text-muted-foreground">Percentile Rank</div>
              <div className="text-xs text-muted-foreground mt-1">
                Top {100 - Math.round(result.percentileRank)}% of population
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {result.accuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <div className="text-xs text-muted-foreground mt-1">
                {result.correctAnswers}/{result.totalQuestions} correct
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cognitive Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Cognitive Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={cognitiveProfile}>
                <PolarGrid />
                <PolarAngleAxis dataKey="domain" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Key Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {cognitiveProfile
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((domain, index) => (
                  <div key={`overview-insight-${domain.domain}-${index}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Strongest" : index === 1 ? "Strong" : "Good"}
                      </Badge>
                      <span className="text-sm">{domain.domain}</span>
                    </div>
                    <span className="font-semibold">{domain.score.toFixed(1)}%</span>
                  </div>
                ))}
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Continue practicing pattern recognition exercises</li>
                <li>• Focus on spatial visualization techniques</li>
                <li>• Develop logical reasoning skills through puzzles</li>
                <li>• Enhance working memory with memory games</li>
                <li>• Practice numerical problem-solving strategies</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ability Progression Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Ability Progression During Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={abilityProgression}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="ability"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Final ability estimate (θ): {result.finalAbilityEstimate.toFixed(3)}</p>
            <p>• Standard error: {result.standardError.toFixed(3)}</p>
            <p>• Measurement precision: {(1 / result.standardError).toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Reliability & Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Test Quality & Reliability</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {result.cronbachAlpha?.toFixed(3) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Cronbach's Alpha</div>
              <div className="text-xs text-muted-foreground mt-1">
                Internal consistency
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {result.testReliability?.toFixed(3) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Test Reliability</div>
              <div className="text-xs text-muted-foreground mt-1">
                Overall measurement quality
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {result.measurementPrecision?.toFixed(2) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Measurement Precision</div>
              <div className="text-xs text-muted-foreground mt-1">
                1 / Standard Error
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 
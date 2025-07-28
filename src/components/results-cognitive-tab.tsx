"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target,
  Zap,
  Clock,
  BarChart3,
  Award,
  Star,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { 
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

interface ResultsCognitiveTabProps {
  result: TestResult;
  cognitiveProfile: any[];
  abilityProgression: any[];
}

export function ResultsCognitiveTab({ 
  result, 
  cognitiveProfile, 
  abilityProgression 
}: ResultsCognitiveTabProps) {
  const getMasteryLevel = (score: number) => {
    if (score >= 90) return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-100', icon: Award };
    if (score >= 80) return { level: 'Advanced', color: 'text-blue-600', bg: 'bg-blue-100', icon: Star };
    if (score >= 70) return { level: 'Proficient', color: 'text-green-600', bg: 'bg-green-100', icon: Target };
    if (score >= 60) return { level: 'Developing', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: TrendingUp };
    return { level: 'Novice', color: 'text-red-600', bg: 'bg-red-100', icon: BookOpen };
  };

  const getDomainInsights = (domain: string): {
    description: string;
    strengths: string[];
    improvements: string[];
  } => {
    const insights = {
      'Pattern Recognition': {
        description: 'Ability to identify patterns, sequences, and mathematical relationships',
        strengths: ['Mathematical reasoning', 'Sequence completion', 'Rule discovery'],
        improvements: ['Practice number sequences', 'Study geometric patterns', 'Work on series completion']
      },
      'Spatial Reasoning': {
        description: 'Capacity to visualize and manipulate objects in three-dimensional space',
        strengths: ['3D visualization', 'Mental rotation', 'Spatial relationships'],
        improvements: ['Practice mental rotation', 'Work with 3D puzzles', 'Study geometric transformations']
      },
      'Logical Deduction': {
        description: 'Ability to draw valid conclusions from given premises using logical reasoning',
        strengths: ['Syllogistic reasoning', 'Conditional logic', 'Set theory'],
        improvements: ['Practice syllogisms', 'Study logical fallacies', 'Work on Venn diagrams']
      },
      'Short-Term Memory': {
        description: 'Capacity to hold and manipulate information in working memory',
        strengths: ['Information retention', 'Sequence recall', 'Working memory'],
        improvements: ['Memory games', 'Sequence repetition', 'Chunking strategies']
      },
      'Numerical Reasoning': {
        description: 'Ability to solve mathematical problems and understand numerical relationships',
        strengths: ['Algebraic thinking', 'Percentage calculations', 'Mathematical word problems'],
        improvements: ['Practice algebra', 'Work on word problems', 'Study mathematical concepts']
      }
    };
    return insights[domain as keyof typeof insights] || insights['Pattern Recognition'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Domain Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cognitiveProfile.map((domain, index) => {
          const mastery = getMasteryLevel(domain.score);
          const insights = getDomainInsights(domain.domain);
          
          return (
            <Card key={`cognitive-domain-${domain.domain}-${index}`}>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="font-semibold mb-2">{domain.domain}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {domain.score.toFixed(1)}%
                  </div>
                  <Badge variant="outline" className="mb-2">
                    {Math.round(domain.percentile)}th percentile
                  </Badge>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full ${mastery.bg} ${mastery.color} text-xs font-semibold`}>
                    <mastery.icon className="w-3 h-3 mr-1" />
                    {mastery.level}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${domain.score}%` }}
                  />
                </div>

                <div className="text-sm text-muted-foreground mb-4">
                  <p>{insights.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-green-600">Strengths:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {insights.strengths.map((strength, idx) => (
                      <li key={`strength-${domain.domain}-${idx}`}>• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 mt-3">
                  <div className="text-xs font-semibold text-blue-600">Improvements:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {insights.improvements.map((improvement, idx) => (
                      <li key={`improvement-${domain.domain}-${idx}`}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Domain Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Domain Performance Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cognitiveProfile
              .sort((a, b) => b.score - a.score)
              .map((domain, index) => (
                <div key={`comparison-${domain.domain}-${index}`} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold text-primary w-8">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{domain.domain}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(domain.percentile)}th percentile
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{domain.score.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">
                      {getMasteryLevel(domain.score).level}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Development Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Cognitive Development Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Strongest Areas</h4>
              <div className="space-y-2">
                {cognitiveProfile
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 2)
                  .map((domain, index) => (
                    <div key={`strongest-${domain.domain}-${index}`} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">{domain.domain}</span>
                      <Badge variant="secondary" className="text-green-700">
                        {domain.score.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Areas for Growth</h4>
              <div className="space-y-2">
                {cognitiveProfile
                  .sort((a, b) => a.score - b.score)
                  .slice(0, 2)
                  .map((domain, index) => (
                    <div key={`growth-${domain.domain}-${index}`} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">{domain.domain}</span>
                      <Badge variant="secondary" className="text-blue-700">
                        {domain.score.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IRT Parameters Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>IRT Analysis Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {result.finalAbilityEstimate.toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">Final θ (Theta)</div>
              <div className="text-xs text-muted-foreground mt-1">
                Ability estimate in logits
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {result.standardError.toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">Standard Error</div>
              <div className="text-xs text-muted-foreground mt-1">
                Measurement precision
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {(1 / result.standardError).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Information</div>
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
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  BarChart3,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { TestResult, IQClassification } from '@/types';
import { formatTime } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ScatterChart,
  Scatter,
  Area,
  AreaChart
} from 'recharts';

interface ResultsDashboardProps {
  result: TestResult;
  onRestart: () => void;
}

export function ResultsDashboard({ result, onRestart }: ResultsDashboardProps) {
  const getIQColor = (iq: number) => {
    if (iq >= 145) return 'text-purple-600 dark:text-purple-400';
    if (iq >= 130) return 'text-blue-600 dark:text-blue-400';
    if (iq >= 120) return 'text-green-600 dark:text-green-400';
    if (iq >= 110) return 'text-emerald-600 dark:text-emerald-400';
    if (iq >= 90) return 'text-gray-600 dark:text-gray-400';
    if (iq >= 80) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getClassificationColor = (classification: IQClassification) => {
    switch (classification) {
      case IQClassification.EXTREMELY_GIFTED:
      case IQClassification.HIGHLY_GIFTED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case IQClassification.MODERATELY_GIFTED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case IQClassification.SUPERIOR:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case IQClassification.HIGH_AVERAGE:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case IQClassification.AVERAGE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case IQClassification.LOW_AVERAGE:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Advanced': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Proficient': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Developing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Prepare chart data
  const categoryData = result.categoryScores.map(score => ({
    category: score.category.replace(/([A-Z])/g, ' $1').trim(),
    accuracy: score.accuracy,
    abilityEstimate: ((score.abilityEstimate + 3) / 6) * 100, // Normalize to 0-100
    informationGained: score.informationGained,
    responseTime: score.averageResponseTime / 1000 // Convert to seconds
  }));

  const difficultyProgressionData = result.difficultyProgression.map((difficulty, index) => ({
    question: index + 1,
    difficulty,
    ability: result.abilityProgression[index] ? ((result.abilityProgression[index] + 3) / 6) * 100 : 50,
    responseTime: result.responseTimeProgression[index] ? result.responseTimeProgression[index] / 1000 : 0,
    information: result.informationCurve[index] || 0
  }));

  const iqDistributionData = [
    { range: '70-79', count: 2.3, label: 'Borderline' },
    { range: '80-89', count: 13.6, label: 'Low Average' },
    { range: '90-109', count: 68.2, label: 'Average' },
    { range: '110-119', count: 13.6, label: 'High Average' },
    { range: '120-129', count: 2.1, label: 'Superior' },
    { range: '130-144', count: 0.2, label: 'Gifted' },
    { range: '145+', count: 0.1, label: 'Highly Gifted' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IQ Test Results
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive cognitive assessment based on Item Response Theory
          </p>
        </div>

        {/* Main IQ Score Card */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Your IQ Score</CardTitle>
            <CardDescription>
              Based on {result.totalQuestions} questions with {result.accuracy.toFixed(1)}% accuracy
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <div className={`text-6xl font-bold ${getIQColor(result.estimatedIQ)}`}>
                {result.estimatedIQ}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                95% Confidence Interval: {result.confidenceInterval[0]} - {result.confidenceInterval[1]}
              </div>
              <Badge className={getClassificationColor(result.classification)} variant="secondary">
                {result.classification}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">{result.percentileRank}th</div>
                <div className="text-sm text-gray-500">Percentile</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">
                  {(result.measurementPrecision).toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">Precision</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-purple-600">
                  {(result.testReliability * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Reliability</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                {result.correctAnswers} correct answers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.accuracy.toFixed(1)}%</div>
              <Progress value={result.accuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(Math.round(result.averageResponseTime / 1000))}
              </div>
              <p className="text-xs text-muted-foreground">
                Per question
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(Math.round(result.completionTime))}
              </div>
              <p className="text-xs text-muted-foreground">
                Test duration
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cognitive Domain Analysis
            </CardTitle>
            <CardDescription>
              Performance across different cognitive abilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={categoryData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Accuracy %"
                    dataKey="accuracy"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Ability Level"
                    dataKey="abilityEstimate"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Adaptive Difficulty Progression */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Adaptive Test Progression
            </CardTitle>
            <CardDescription>
              How your ability estimate and question difficulty evolved during the test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={difficultyProgressionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      typeof value === 'number' ? value.toFixed(2) : value,
                      name === 'difficulty' ? 'Question Difficulty' :
                      name === 'ability' ? 'Ability Level' :
                      name === 'information' ? 'Information Gained' : name
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="difficulty" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Question Difficulty"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ability" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Ability Estimate"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="information" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Information Gained"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Domain Mastery Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Domain Mastery Analysis
            </CardTitle>
            <CardDescription>
              Detailed analysis of your performance in each cognitive domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(result.domainMastery).map(([category, analysis]) => (
                <div key={category} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{category}</h3>
                    <Badge className={getMasteryColor(analysis.masteryLevel)}>
                      {analysis.masteryLevel}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Questions Answered:</span>
                      <span className="ml-2 font-medium">{analysis.questionsAnswered}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ability Estimate:</span>
                      <span className="ml-2 font-medium">{analysis.abilityEstimate.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Standard Error:</span>
                      <span className="ml-2 font-medium">{analysis.standardError.toFixed(2)}</span>
                    </div>
                  </div>

                  {analysis.strengthAreas.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.strengthAreas.map((strength, index) => (
                          <Badge key={index} variant="outline" className="text-green-600 border-green-600">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.improvementAreas.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-600 flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        Areas for Improvement
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.improvementAreas.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-orange-600 border-orange-600">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Time vs Accuracy Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Time Analysis
            </CardTitle>
            <CardDescription>
              Relationship between response time and accuracy across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="responseTime" 
                    name="Response Time (s)"
                    label={{ value: 'Average Response Time (seconds)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="accuracy" 
                    name="Accuracy %"
                    label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      typeof value === 'number' ? value.toFixed(1) : value,
                      name === 'responseTime' ? 'Response Time (s)' : 'Accuracy (%)'
                    ]}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Scatter dataKey="accuracy" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Population Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Population Comparison
            </CardTitle>
            <CardDescription>
              How your score compares to the general population
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={iqDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Population %']}
                    labelFormatter={(label) => `IQ Range: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Your Score:</strong> {result.estimatedIQ} IQ places you in the {result.percentileRank}th percentile, 
                meaning you scored higher than {result.percentileRank}% of the population.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Psychometric Quality Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Test Quality & Reliability
            </CardTitle>
            <CardDescription>
              Psychometric indicators of test validity and reliability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(result.cronbachAlpha * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">Internal Consistency</div>
                <div className="text-xs text-gray-400 mt-2">
                  Cronbach&apos;s Alpha (&gt;70% is good)
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ±{(result.standardError * 15).toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Measurement Error</div>
                <div className="text-xs text-gray-400 mt-2">
                  Standard Error (IQ points)
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {(result.testReliability * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">Test Reliability</div>
                <div className="text-xs text-gray-400 mt-2">
                  Overall measurement quality
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Understanding Your Results
              </h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Your IQ score is based on Item Response Theory (IRT), the same method used in professional assessments</li>
                 <li>• The confidence interval shows the range where your true score likely falls</li>
                 <li>• Higher reliability indicates more precise measurement</li>
                 <li>• Domain analysis helps identify cognitive strengths and areas for development</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Take Another Test
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Print Results
          </button>
        </div>

        {/* Disclaimer */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium text-orange-700 dark:text-orange-400 mb-2">Important Disclaimer</p>
                <p>
                  This test is for educational and entertainment purposes only. While it uses scientifically-based 
                  psychometric methods, it should not be considered a substitute for professional psychological 
                  assessment. For official IQ testing or cognitive evaluation, please consult a qualified psychologist.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
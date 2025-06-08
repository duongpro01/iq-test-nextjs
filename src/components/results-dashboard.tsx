"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  BarChart3,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { TestResult, IQClassification } from '@/types';
import { formatTimeDetailed } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface ResultsDashboardProps {
  result: TestResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { resetTest } = useTestStore();

  const getIQColor = (iq: number) => {
    if (iq >= 130) return 'text-green-600';
    if (iq >= 120) return 'text-blue-600';
    if (iq >= 110) return 'text-indigo-600';
    if (iq >= 90) return 'text-gray-600';
    if (iq >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getClassificationColor = (classification: IQClassification) => {
    switch (classification) {
      case IQClassification.VERY_SUPERIOR:
        return 'bg-green-100 text-green-800 border-green-200';
      case IQClassification.SUPERIOR:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case IQClassification.HIGH_AVERAGE:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case IQClassification.AVERAGE:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case IQClassification.LOW_AVERAGE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  // Prepare chart data
  const difficultyData = result.difficultyProgression.map((difficulty, index) => ({
    question: index + 1,
    difficulty,
    correct: result.categoryScores.reduce((acc, cat) => acc + cat.correct, 0) > index
  }));

  const categoryData = result.categoryScores.map(score => ({
    category: score.category.replace(' ', '\n'),
    accuracy: score.accuracy,
    avgTime: score.averageResponseTime / 1000,
    avgDifficulty: score.averageDifficulty
  }));



  const iqDistributionData = [
    { range: '70-79', percentage: 2.5, current: result.estimatedIQ >= 70 && result.estimatedIQ < 80 },
    { range: '80-89', percentage: 13.5, current: result.estimatedIQ >= 80 && result.estimatedIQ < 90 },
    { range: '90-109', percentage: 68, current: result.estimatedIQ >= 90 && result.estimatedIQ < 110 },
    { range: '110-119', percentage: 13.5, current: result.estimatedIQ >= 110 && result.estimatedIQ < 120 },
    { range: '120-129', percentage: 2.5, current: result.estimatedIQ >= 120 && result.estimatedIQ < 130 },
    { range: '130+', percentage: 2, current: result.estimatedIQ >= 130 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center"
          >
            <Award className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl font-bold">Test Results</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive IQ assessment is complete. Review your performance across different cognitive domains.
          </p>
        </div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Your IQ Score</CardTitle>
              <CardDescription>Based on adaptive testing and Item Response Theory</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <div className={`text-6xl font-bold ${getIQColor(result.estimatedIQ)}`}>
                  {result.estimatedIQ}
                </div>
                <div className={`inline-block px-4 py-2 rounded-full border text-sm font-medium ${getClassificationColor(result.classification)}`}>
                  {result.classification}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.percentileRank}th</div>
                  <div className="text-sm text-muted-foreground">Percentile</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatTimeDetailed(result.completionTime * 1000)}
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{result.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{result.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {formatTimeDetailed(result.averageResponseTime)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {(result.difficultyProgression.reduce((a, b) => a + b, 0) / result.difficultyProgression.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Difficulty</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Difficulty Progression */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Difficulty Progression</span>
                </CardTitle>
                <CardDescription>
                  How the test adapted to your performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={difficultyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="question" />
                    <YAxis domain={[1, 10]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="difficulty" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Category Performance</span>
                </CardTitle>
                <CardDescription>
                  Accuracy by cognitive domain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance by Category</CardTitle>
              <CardDescription>
                Comprehensive breakdown of your cognitive abilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.categoryScores.map((score) => (
                  <div key={score.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{score.category}</h4>
                      <span className="text-sm text-muted-foreground">
                        {score.correct}/{score.total} correct
                      </span>
                    </div>
                    <Progress value={score.accuracy} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <span>Accuracy: {score.accuracy.toFixed(1)}%</span>
                      <span>Avg Time: {formatTimeDetailed(score.averageResponseTime)}</span>
                      <span>Avg Difficulty: {score.averageDifficulty.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* IQ Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Population Distribution</CardTitle>
              <CardDescription>
                How your score compares to the general population
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {iqDistributionData.map((item) => (
                  <div key={item.range} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium">{item.range}</div>
                    <div className="flex-1">
                      <Progress 
                        value={item.percentage} 
                        className={`h-6 ${item.current ? 'bg-primary/20' : ''}`}
                      />
                    </div>
                    <div className="w-12 text-sm text-muted-foreground">
                      {item.percentage}%
                    </div>
                    {item.current && (
                      <div className="text-sm font-medium text-primary">You</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button onClick={resetTest} size="lg" className="min-w-[150px]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake Test
          </Button>
          <Button variant="outline" size="lg" className="min-w-[150px]">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" size="lg" className="min-w-[150px]">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground pt-8 border-t"
        >
          <p>
            Results are based on adaptive testing algorithms and Item Response Theory. 
            This assessment is for educational purposes and should not replace professional evaluation.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 
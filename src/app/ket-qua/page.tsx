"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTestStore } from '@/store/test-store';
import { formatTime } from '@/lib/utils';
import { QuestionCategory } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function ResultsPage() {
  const router = useRouter();
  const { currentSession, testResult } = useTestStore();

  useEffect(() => {
    // Redirect to home if no test result
    if (!testResult || !currentSession?.isCompleted) {
      router.push('/');
    }
  }, [testResult, currentSession, router]);

  if (!testResult || !currentSession) {
    return null;
  }

  const categoryColors: Record<QuestionCategory, string> = {
    [QuestionCategory.PATTERN_RECOGNITION]: 'bg-blue-500',
    [QuestionCategory.SPATIAL_REASONING]: 'bg-green-500',
    [QuestionCategory.LOGICAL_DEDUCTION]: 'bg-purple-500',
    [QuestionCategory.SHORT_TERM_MEMORY]: 'bg-yellow-500',
    [QuestionCategory.NUMERICAL_REASONING]: 'bg-red-500',
  };

  // Prepare data for ability progression chart
  const abilityData = testResult.abilityProgression.map((ability, index) => ({
    question: index + 1,
    ability: parseFloat(ability.toFixed(2))
  }));

  // Prepare data for response time chart
  const responseTimeData = testResult.responseTimeProgression.map((time, index) => ({
    question: index + 1,
    time: time / 1000 // Convert to seconds
  }));

  // Prepare data for information curve
  const informationData = testResult.informationCurve.map((info, index) => ({
    question: index + 1,
    information: parseFloat(info.toFixed(3))
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main IQ Score Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Your IQ Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-6xl font-bold text-primary">
              {Math.round(testResult.estimatedIQ)}
            </div>
            <Badge variant="secondary" className="text-lg">
              {testResult.classification}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Confidence Interval: {Math.round(testResult.confidenceInterval[0])} - {Math.round(testResult.confidenceInterval[1])}
            </div>
            <div className="text-sm text-muted-foreground">
              Percentile Rank: {Math.round(testResult.percentileRank)}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Accuracy</h3>
              <Progress value={testResult.accuracy} className="mb-1" />
              <div className="text-sm text-muted-foreground">
                {testResult.correctAnswers} correct out of {testResult.totalQuestions} questions
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Completion Time</h3>
              <div className="text-lg">{formatTime(testResult.completionTime)}</div>
              <div className="text-sm text-muted-foreground">
                Average response time: {Math.round(testResult.averageResponseTime / 1000)}s per question
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ability Progression Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ability Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={abilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" label={{ value: 'Question Number', position: 'bottom' }} />
                <YAxis label={{ value: 'Ability Estimate', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ability" stroke="#8884d8" name="Ability" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Response Time Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Response Time Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" label={{ value: 'Question Number', position: 'bottom' }} />
                <YAxis label={{ value: 'Response Time (s)', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="time" stroke="#82ca9d" name="Response Time" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Information Curve */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Information Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={informationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" label={{ value: 'Question Number', position: 'bottom' }} />
                <YAxis label={{ value: 'Information Value', angle: -90, position: 'left' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="information" fill="#8884d8" stroke="#8884d8" name="Information" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {testResult.categoryScores.map((score) => (
              <div key={score.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{score.category}</span>
                  <span className="text-sm">
                    {score.correct}/{score.total} correct
                  </span>
                </div>
                <Progress 
                  value={score.accuracy} 
                  className={`h-2 ${categoryColors[score.category]}`}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Mastery Level: {testResult.domainMastery[score.category].masteryLevel}</span>
                  <span>Accuracy: {Math.round(score.accuracy)}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Average Response Time: {Math.round(score.averageResponseTime / 1000)}s</div>
                  <div>Average Difficulty: {score.averageDifficulty.toFixed(1)}</div>
                  <div>Information Gained: {score.informationGained.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentSession.answers.map((answer, index) => {
              const question = currentSession.questions[index];
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={answer.isCorrect ? "secondary" : "destructive"}>
                      {answer.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                    <Badge variant="outline">{question.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Response time: {Math.round(answer.responseTime / 1000)}s
                    </span>
                  </div>
                  <p className="font-medium mb-2">{question.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded ${
                          optionIndex === question.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : optionIndex === answer.selectedAnswer
                            ? 'bg-red-100 dark:bg-red-900/20'
                            : 'bg-gray-50 dark:bg-gray-800/20'
                        }`}
                      >
                        <span className="font-mono mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div>Difficulty: {answer.difficulty.toFixed(1)}</div>
                    <div>Ability Change: {answer.abilityBeforeAnswer.toFixed(2)} → {answer.abilityAfterAnswer.toFixed(2)}</div>
                    <div>Information Value: {answer.informationValue.toFixed(3)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
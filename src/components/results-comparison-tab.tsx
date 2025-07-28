"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Target
} from 'lucide-react';
import { 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { TestResult } from '@/types';

interface ResultsComparisonTabProps {
  result: TestResult;
}

export function ResultsComparisonTab({ result }: ResultsComparisonTabProps) {
  // IQ distribution data for comparison
  const iqDistribution = [
    { range: '70-79', count: 2.2, color: '#ef4444' },
    { range: '80-89', count: 13.6, color: '#f97316' },
    { range: '90-109', count: 68.2, color: '#22c55e' },
    { range: '110-119', count: 13.6, color: '#3b82f6' },
    { range: '120-129', count: 2.2, color: '#8b5cf6' },
    { range: '130+', count: 0.2, color: '#f59e0b' }
  ];

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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Population Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Population Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={iqDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ range, count }) => `${range}: ${count}%`}
              >
                {iqDistribution.map((entry, index) => (
                  <Cell key={`comparison-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <Badge variant="default" className="text-lg px-4 py-2">
              You scored higher than {Math.round(result.percentileRank)}% of the population
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Your Position */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Your Position</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {result.estimatedIQ}
              </div>
              <div className="text-sm text-muted-foreground">Your IQ Score</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${classification.bg} ${classification.color} text-sm font-semibold mt-2`}>
                {classification.label}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {Math.round(result.percentileRank)}th
              </div>
              <div className="text-sm text-muted-foreground">Percentile Rank</div>
              <div className="text-xs text-muted-foreground mt-2">
                Top {100 - Math.round(result.percentileRank)}% of population
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistical Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Statistical Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">100</div>
                <div className="text-sm text-muted-foreground">Population Average</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{result.estimatedIQ}</div>
                <div className="text-sm text-muted-foreground">Your Score</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-muted-foreground">Standard Deviation</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Confidence Interval</div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(result.confidenceInterval[0])} - {Math.round(result.confidenceInterval[1])}
              </div>
              <div className="text-sm text-muted-foreground">95% confidence range</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance vs Population */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Performance vs Population</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-semibold">Accuracy</span>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold">{result.accuracy.toFixed(1)}%</div>
                <Badge variant="secondary">Above Average</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-semibold">Speed</span>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold">{Math.round(result.completionTime / 60)}m</div>
                <Badge variant="secondary">Efficient</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-semibold">Consistency</span>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold">{result.standardError?.toFixed(3) || 'N/A'}</div>
                <Badge variant="secondary">Reliable</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 
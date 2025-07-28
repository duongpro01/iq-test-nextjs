"use client"

import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestResult } from '@/types';

interface AdaptiveProgressionChartProps {
  result: TestResult;
}

interface ProgressionDataPoint {
  questionNumber: number;
  abilityEstimate: number;
  questionDifficulty: number;
  informationGained: number;
}

export function AdaptiveProgressionChart({ result }: AdaptiveProgressionChartProps) {
  const progressionData = useMemo(() => {
    const data: ProgressionDataPoint[] = [];
    
    // Use the progression arrays from TestResult
    const maxLength = Math.max(
      result.abilityProgression?.length || 0,
      result.difficultyProgression?.length || 0,
      result.informationCurve?.length || 0
    );

    for (let i = 0; i < maxLength; i++) {
      data.push({
        questionNumber: i + 1,
        abilityEstimate: result.abilityProgression?.[i] || 0,
        questionDifficulty: result.difficultyProgression?.[i] || 0,
        informationGained: result.informationCurve?.[i] || 0
      });
    }

    return data;
  }, [result]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center space-x-6 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!progressionData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Adaptive Test Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Progression data not available for this test session.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adaptive Test Progression</CardTitle>
        <p className="text-sm text-muted-foreground">
          How your ability estimate and question difficulty evolved during the test
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={progressionData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="questionNumber" 
              label={{ value: 'Question Number', position: 'insideBottom', offset: -10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Score/Difficulty', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            
            {/* Ability Estimate Line */}
            <Line
              type="monotone"
              dataKey="abilityEstimate"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="Ability Estimate"
            />
            
            {/* Question Difficulty Line */}
            <Line
              type="monotone"
              dataKey="questionDifficulty"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
              name="Question Difficulty"
            />
            
            {/* Information Gained Line */}
            <Line
              type="monotone"
              dataKey="informationGained"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              name="Information Gained"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Chart Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {progressionData.length > 0 ? progressionData[progressionData.length - 1].abilityEstimate.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-blue-600">Final Ability Estimate</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {progressionData.length > 0 ? progressionData[progressionData.length - 1].questionDifficulty.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-orange-600">Final Question Difficulty</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {progressionData.length > 0 ? progressionData[progressionData.length - 1].informationGained.toFixed(2) : 'N/A'}
            </div>
            <div className="text-sm text-green-600">Final Information Gained</div>
          </div>
        </div>

        {/* Progression Analysis */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Progression Analysis</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              • <strong>Ability Estimate:</strong> Started at {progressionData[0]?.abilityEstimate.toFixed(1) || 'N/A'} 
              and ended at {progressionData[progressionData.length - 1]?.abilityEstimate.toFixed(1) || 'N/A'}
            </p>
            <p>
              • <strong>Question Difficulty:</strong> Ranged from {Math.min(...progressionData.map(d => d.questionDifficulty)).toFixed(1)} 
              to {Math.max(...progressionData.map(d => d.questionDifficulty)).toFixed(1)}
            </p>
            <p>
              • <strong>Information Gained:</strong> Total information accumulated: {
                progressionData.reduce((sum, d) => sum + d.informationGained, 0).toFixed(2)
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
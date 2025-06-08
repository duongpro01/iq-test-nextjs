"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Download, 
  Share2, 
  Trophy, 
  TrendingUp, 
  Target, 
  Clock, 
  Zap,
  Star,
  FileText,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import { TestResult, QuestionCategory } from '@/types';
import { useGamificationStore } from '@/store/gamification-store';
import { securityEngine } from '@/lib/security-engine';

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
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { 
    userProfile, 
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

  // Generate response time analysis
  const responseTimeData = result.responseTimeProgression || [];

  // Security analysis
  const securityMetrics = securityEngine.getCurrentMetrics();
  const securityReport = securityEngine.generateSecurityReport();

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

  const exportResults = async (format: 'pdf' | 'html' | 'json') => {
    setIsExporting(true);
    
    try {
      const exportData = {
        result,
        userProfile,
        cognitiveProfile,
        securityReport,
        timestamp: new Date().toISOString()
      };

      switch (format) {
        case 'json':
          const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
          });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = `iq-test-results-${Date.now()}.json`;
          jsonLink.click();
          break;
          
        case 'html':
          const htmlContent = generateHTMLReport(exportData);
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          const htmlUrl = URL.createObjectURL(htmlBlob);
          const htmlLink = document.createElement('a');
          htmlLink.href = htmlUrl;
          htmlLink.download = `iq-test-results-${Date.now()}.html`;
          htmlLink.click();
          break;
          
        case 'pdf':
          // This would integrate with a PDF generation library
          alert('PDF export coming soon!');
          break;
      }
      
      trackEngagement('results_exported', { format });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateHTMLReport = (data: { result: TestResult; cognitiveProfile: any; securityReport: any }): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>IQ Test Results</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .score { font-size: 48px; font-weight: bold; color: #3b82f6; }
          .classification { font-size: 24px; margin: 10px 0; }
          .section { margin: 30px 0; }
          .domain { margin: 15px 0; padding: 10px; border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Adaptive IQ Test Results</h1>
          <div class="score">${data.result.estimatedIQ}</div>
          <div class="classification">${classification.label}</div>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h2>Overall Performance</h2>
          <p>Accuracy: ${data.result.accuracy.toFixed(1)}%</p>
          <p>Questions Answered: ${data.result.totalQuestions}</p>
          <p>Test Duration: ${Math.round(data.result.completionTime / 60)} minutes</p>
        </div>
        
        <div class="section">
          <h2>Cognitive Domain Analysis</h2>
          ${data.cognitiveProfile.map((domain: any) => `
            <div class="domain">
              <strong>${domain.domain}:</strong> ${domain.score.toFixed(1)}% 
              (${domain.percentile}th percentile)
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Security Analysis</h2>
          <p>Confidence Score: ${(data.securityReport.confidenceScore * 100).toFixed(1)}%</p>
          <p>Risk Level: ${data.securityReport.riskLevel}</p>
          <p>${data.securityReport.summary}</p>
        </div>
      </body>
      </html>
    `;
  };

  const generateShareUrl = () => {
    const shareData = {
      iq: result.estimatedIQ,
      classification: classification.label,
      accuracy: result.accuracy
    };
    
    const encoded = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}/share/${encoded}`;
    setShareUrl(url);
    return url;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToSocial = (platform: string) => {
    const url = generateShareUrl();
    const text = `I just scored ${result.estimatedIQ} on this adaptive IQ test! 🧠`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    trackEngagement('results_shared', { platform });
  };

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
                      {result.percentileRank}th
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
                  <Badge variant={securityReport.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                    {securityReport.confidenceScore * 100}% Confidence
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Detailed Analysis Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cognitive">Cognitive Profile</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="export">Export & Share</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
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
                            <div key={domain.domain} className="flex items-center justify-between">
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
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="cognitive">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Domain Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cognitiveProfile.map((domain) => (
                      <Card key={domain.domain}>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h3 className="font-semibold mb-2">{domain.domain}</h3>
                            <div className="text-3xl font-bold text-primary mb-2">
                              {domain.score.toFixed(1)}%
                            </div>
                            <Badge variant="outline">
                              {domain.percentile}th percentile
                            </Badge>
                            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${domain.score}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Ability Progression */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span>Ability Progression</span>
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
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="performance">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Response Time Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>Response Time Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart data={responseTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="difficulty" name="Difficulty" />
                          <YAxis dataKey="time" name="Time (s)" />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Scatter name="Response Time" dataKey="time" fill="#3b82f6" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold">{result.averageResponseTime?.toFixed(1)}s</div>
                        <div className="text-sm text-muted-foreground">Avg Response Time</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">{result.consistency?.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Consistency</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{result.improvement?.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Improvement</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold">{(securityReport.confidenceScore * 100).toFixed(0)}%</div>
                        <div className="text-sm text-muted-foreground">Confidence</div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="comparison">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Population Comparison */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Population Distribution</CardTitle>
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
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      <div className="text-center mt-4">
                        <Badge variant="default" className="text-lg px-4 py-2">
                          You scored higher than {result.percentileRank}% of the population
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="export">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Export Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>Export Results</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          onClick={() => exportResults('pdf')}
                          disabled={isExporting}
                          className="h-20 flex flex-col items-center space-y-2"
                        >
                          <FileText className="w-6 h-6" />
                          <span>PDF Report</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => exportResults('html')}
                          disabled={isExporting}
                          className="h-20 flex flex-col items-center space-y-2"
                        >
                          <FileText className="w-6 h-6" />
                          <span>HTML Report</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => exportResults('json')}
                          disabled={isExporting}
                          className="h-20 flex flex-col items-center space-y-2"
                        >
                          <FileText className="w-6 h-6" />
                          <span>Raw Data</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Share Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Share2 className="w-5 h-5" />
                        <span>Share Results</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Share URL */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Shareable Link</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={shareUrl || generateShareUrl()}
                            readOnly
                            className="flex-1 px-3 py-2 border rounded-md bg-muted"
                          />
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(shareUrl || generateShareUrl())}
                          >
                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* Social Media */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Social Media</label>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => shareToSocial('twitter')}
                          >
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => shareToSocial('facebook')}
                          >
                            <Facebook className="w-4 h-4 mr-2" />
                            Facebook
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => shareToSocial('linkedin')}
                          >
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>

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
'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  FileText, 
  Image as ImageIcon, 
  Link2, 
  Twitter, 
  Facebook, 
  Linkedin,
  Copy,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestResult, QuestionCategory } from '@/types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

interface EnhancedResultsExportProps {
  result: TestResult;
  userProfile?: {
    username?: string;
    level: number;
    totalXP: number;
  };
  onShare?: (platform: string, url: string) => void;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  format: 'pdf' | 'png' | 'json' | 'html';
  size?: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'pdf_detailed',
    name: 'Detailed PDF Report',
    description: 'Complete analysis with charts and recommendations',
    icon: <FileText className="w-4 h-4" />,
    format: 'pdf',
    size: '2-3 MB'
  },
  {
    id: 'png_summary',
    name: 'Summary Image',
    description: 'Perfect for social media sharing',
    icon: <ImageIcon className="w-4 h-4" />,
    format: 'png',
    size: '500 KB'
  },
  {
    id: 'json_data',
    name: 'Raw Data (JSON)',
    description: 'Machine-readable format for analysis',
    icon: <Download className="w-4 h-4" />,
    format: 'json',
    size: '50 KB'
  },
  {
    id: 'html_interactive',
    name: 'Interactive HTML',
    description: 'Self-contained web page with animations',
    icon: <Link2 className="w-4 h-4" />,
    format: 'html',
    size: '1 MB'
  }
];

const SOCIAL_PLATFORMS = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter className="w-4 h-4" />,
    color: 'bg-blue-500',
    shareUrl: (text: string, url: string) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="w-4 h-4" />,
    color: 'bg-blue-600',
    shareUrl: (text: string, url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="w-4 h-4" />,
    color: 'bg-blue-700',
    shareUrl: (text: string, url: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`
  }
];

export function EnhancedResultsExport({ result, userProfile, onShare }: EnhancedResultsExportProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const chartRef = useRef<HTMLDivElement>(null);

  // Prepare radar chart data
  const radarData = result.categoryScores.map(score => ({
    category: score.category.replace('_', ' '),
    ability: Math.round((score.abilityEstimate + 3) * 16.67), // Convert to 0-100 scale
    accuracy: score.accuracy,
    speed: Math.max(0, 100 - (score.averageResponseTime / 1000) * 2) // Convert response time to speed score
  }));

  // Prepare progression data
  const progressionData = result.abilityProgression.map((ability, index) => ({
    question: index + 1,
    ability: Math.round((ability + 3) * 16.67),
    difficulty: Math.round((result.difficultyProgression[index] + 3) * 16.67),
    responseTime: result.responseTimeProgression[index] / 1000
  }));

  // Generate share text
  const generateShareText = (): string => {
    const iqScore = Math.round(result.estimatedIQ);
    const percentile = result.percentileRank;
    const classification = result.classification;
    
    return `🧠 Just completed an IQ test! Scored ${iqScore} (${percentile}th percentile) - ${classification}. Test your cognitive abilities too!`;
  };

  // Generate dynamic share URL
  const generateShareUrl = async (): Promise<string> => {
    // In a real implementation, this would create a unique URL with embedded results
    const baseUrl = window.location.origin;
    const resultId = btoa(JSON.stringify({
      score: Math.round(result.estimatedIQ),
      percentile: result.percentileRank,
      classification: result.classification,
      timestamp: Date.now()
    })).substring(0, 16);
    
    return `${baseUrl}/share/${resultId}`;
  };

  // Export functions
  const exportToPDF = async (): Promise<void> => {
    setIsExporting('pdf_detailed');
    
    try {
      // Create PDF content
      const pdfContent = await generatePDFContent();
      
      // In a real implementation, use a library like jsPDF or Puppeteer
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `IQ-Test-Results-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const exportToPNG = async (): Promise<void> => {
    setIsExporting('png_summary');
    
    try {
      if (!chartRef.current) return;
      
      // Use html2canvas or similar library to capture the results
      const canvas = await captureResultsAsImage(chartRef.current);
      
      const link = document.createElement('a');
      link.download = `IQ-Test-Summary-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const exportToJSON = (): void => {
    setIsExporting('json_data');
    
    try {
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0',
          platform: 'IQ Test Platform'
        },
        results: {
          ...result,
          userProfile: userProfile ? {
            level: userProfile.level,
            totalXP: userProfile.totalXP
          } : undefined
        }
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `IQ-Test-Data-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('JSON export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const exportToHTML = async (): Promise<void> => {
    setIsExporting('html_interactive');
    
    try {
      const htmlContent = await generateInteractiveHTML();
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `IQ-Test-Interactive-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('HTML export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExport = async (format: ExportFormat): Promise<void> => {
    switch (format.format) {
      case 'pdf':
        await exportToPDF();
        break;
      case 'png':
        await exportToPNG();
        break;
      case 'json':
        exportToJSON();
        break;
      case 'html':
        await exportToHTML();
        break;
    }
  };

  const handleSocialShare = async (platform: typeof SOCIAL_PLATFORMS[0]): Promise<void> => {
    const text = generateShareText();
    let url = shareUrl;
    
    if (!url) {
      url = await generateShareUrl();
      setShareUrl(url);
    }
    
    const shareLink = platform.shareUrl(text, url);
    window.open(shareLink, '_blank', 'width=600,height=400');
    
    onShare?.(platform.id, url);
  };

  const copyShareUrl = async (): Promise<void> => {
    let url = shareUrl;
    
    if (!url) {
      url = await generateShareUrl();
      setShareUrl(url);
    }
    
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  // Helper functions (simplified implementations)
  const generatePDFContent = async (): Promise<string> => {
    // In a real implementation, generate actual PDF content
    return `PDF Report for IQ Test Results - Score: ${result.estimatedIQ}`;
  };

  const captureResultsAsImage = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    // In a real implementation, use html2canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#000000';
      ctx.font = '24px Arial';
      ctx.fillText(`IQ Score: ${Math.round(result.estimatedIQ)}`, 50, 100);
      ctx.fillText(`Percentile: ${result.percentileRank}th`, 50, 150);
    }
    return canvas;
  };

  const generateInteractiveHTML = async (): Promise<string> => {
    // In a real implementation, generate a complete HTML page with embedded data
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>IQ Test Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .score { font-size: 48px; color: #2563eb; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>IQ Test Results</h1>
          <div class="score">${Math.round(result.estimatedIQ)}</div>
          <p>Percentile: ${result.percentileRank}th</p>
          <p>Classification: ${result.classification}</p>
        </body>
      </html>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Results Visualization */}
      <div ref={chartRef} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Cognitive Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="h-80">
                <h3 className="text-lg font-semibold mb-4">Domain Abilities</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Ability"
                      dataKey="ability"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Progression Chart */}
              <div className="h-80">
                <h3 className="text-lg font-semibold mb-4">Ability Progression</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="question" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="ability"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{Math.round(result.estimatedIQ)}</div>
              <div className="text-sm text-muted-foreground">IQ Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{result.percentileRank}th</div>
              <div className="text-sm text-muted-foreground">Percentile</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{Math.round(result.accuracy)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{Math.round(result.completionTime / 60)}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export and Share Options */}
      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">Export Results</TabsTrigger>
          <TabsTrigger value="share">Share & Social</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EXPORT_FORMATS.map(format => (
                  <motion.div
                    key={format.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {format.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{format.name}</h3>
                              <p className="text-sm text-muted-foreground">{format.description}</p>
                              {format.size && (
                                <Badge variant="secondary" className="mt-2">
                                  {format.size}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleExport(format)}
                            disabled={isExporting === format.id}
                            size="sm"
                          >
                            {isExporting === format.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Share URL */}
              <div>
                <label className="text-sm font-medium">Share Link</label>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 p-2 bg-muted rounded-md text-sm">
                    {shareUrl || 'Click "Copy Link" to generate share URL'}
                  </div>
                  <Button onClick={copyShareUrl} variant="outline" size="sm">
                    {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedUrl ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>

              {/* Social Media Buttons */}
              <div>
                <label className="text-sm font-medium">Share on Social Media</label>
                <div className="flex gap-3 mt-2">
                  {SOCIAL_PLATFORMS.map(platform => (
                    <Button
                      key={platform.id}
                      onClick={() => handleSocialShare(platform)}
                      className={`${platform.color} hover:opacity-90`}
                      size="sm"
                    >
                      {platform.icon}
                      {platform.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Share Preview */}
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Share Preview</h4>
                <p className="text-sm text-muted-foreground">{generateShareText()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
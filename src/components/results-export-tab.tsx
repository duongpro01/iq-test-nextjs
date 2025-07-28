"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share2, 
  FileText,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  CheckCircle
} from 'lucide-react';
import { TestResult } from '@/types';
import { useGamificationStore } from '@/store/gamification-store';

interface ResultsExportTabProps {
  result: TestResult;
  cognitiveProfile: any[];
  securityReport: any;
}

export function ResultsExportTab({ 
  result, 
  cognitiveProfile,
  securityReport 
}: ResultsExportTabProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { trackEngagement } = useGamificationStore();

  const exportResults = async (format: 'pdf' | 'html' | 'json') => {
    setIsExporting(true);
    
    try {
      const exportData = {
        result,
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
          URL.revokeObjectURL(jsonUrl);
          break;
          
        case 'html':
          const htmlContent = generateHTMLReport(exportData);
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          const htmlUrl = URL.createObjectURL(htmlBlob);
          const htmlLink = document.createElement('a');
          htmlLink.href = htmlUrl;
          htmlLink.download = `iq-test-results-${Date.now()}.html`;
          htmlLink.click();
          URL.revokeObjectURL(htmlUrl);
          break;
          
        case 'pdf':
          // PDF export would require additional libraries
          alert('PDF export coming soon!');
          break;
      }
      
      trackEngagement('results_exported', { format });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
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
            .header { text-align: center; margin-bottom: 30px; }
            .score { font-size: 48px; font-weight: bold; color: #3b82f6; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .metric { display: inline-block; margin: 10px; padding: 10px; background: #f3f4f6; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>IQ Test Results</h1>
            <div class="score">${data.result.estimatedIQ}</div>
            <p>Accuracy: ${data.result.accuracy.toFixed(1)}% | Time: ${Math.round(data.result.completionTime / 60)}m</p>
          </div>
          <div class="section">
            <h2>Cognitive Profile</h2>
            ${data.cognitiveProfile.map(domain => `
              <div class="metric">
                <strong>${domain.domain}:</strong> ${domain.score.toFixed(1)}%
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  };

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/ket-qua?score=${result.estimatedIQ}&accuracy=${result.accuracy.toFixed(1)}`;
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

      {/* Quick Stats for Sharing */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{result.estimatedIQ}</div>
              <div className="text-sm text-muted-foreground">IQ Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.accuracy.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(result.percentileRank)}th</div>
              <div className="text-sm text-muted-foreground">Percentile</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(result.completionTime / 60)}m</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 
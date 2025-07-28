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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
          await exportToPDF();
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

  const exportToPDF = async () => {
    try {
      // Create a temporary div for PDF content
      const pdfContent = document.createElement('div');
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.top = '0';
      pdfContent.style.width = '800px';
      pdfContent.style.padding = '40px';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      pdfContent.style.fontSize = '12px';
      pdfContent.style.lineHeight = '1.4';
      
      // Generate PDF content
      pdfContent.innerHTML = generatePDFContent();
      document.body.appendChild(pdfContent);

      // Convert to canvas
      const canvas = await html2canvas(pdfContent, {
        width: 800,
        height: pdfContent.scrollHeight,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary element
      document.body.removeChild(pdfContent);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin

      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      // Save PDF
      pdf.save(`IQ-Test-Results-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    }
  };

  const generatePDFContent = (): string => {
    const getIQClassification = (iq: number) => {
      if (iq >= 160) return 'Exceptional Genius';
      if (iq >= 145) return 'Genius';
      if (iq >= 130) return 'Highly Gifted';
      if (iq >= 120) return 'Superior';
      if (iq >= 110) return 'High Average';
      if (iq >= 90) return 'Average';
      if (iq >= 80) return 'Low Average';
      return 'Below Average';
    };

    const classification = getIQClassification(result.estimatedIQ);
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    return `
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px;">
          <h1 style="color: #3b82f6; font-size: 32px; margin: 0 0 10px 0;">IQ Test Results Report</h1>
          <p style="color: #666; margin: 0;">Generated on ${date} at ${time}</p>
        </div>

        <!-- Main Score -->
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 10px;">
          <div style="font-size: 72px; font-weight: bold; color: #3b82f6; margin-bottom: 10px;">${result.estimatedIQ}</div>
          <div style="font-size: 24px; color: #1e40af; margin-bottom: 20px;">${classification}</div>
          <div style="display: flex; justify-content: center; gap: 40px; margin-top: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #059669;">${result.accuracy.toFixed(1)}%</div>
              <div style="font-size: 14px; color: #666;">Accuracy</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #3b82f6;">${Math.round(result.percentileRank)}th</div>
              <div style="font-size: 14px; color: #666;">Percentile</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #7c3aed;">${Math.round(result.completionTime / 60)}m</div>
              <div style="font-size: 14px; color: #666;">Duration</div>
            </div>
          </div>
        </div>

        <!-- Test Statistics -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Test Statistics</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #374151;">Questions Answered</div>
              <div style="font-size: 18px; color: #3b82f6;">${result.totalQuestions}</div>
            </div>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #374151;">Correct Answers</div>
              <div style="font-size: 18px; color: #059669;">${result.correctAnswers}</div>
            </div>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #374151;">Average Response Time</div>
              <div style="font-size: 18px; color: #7c3aed;">${(result.averageResponseTime / 1000).toFixed(1)}s</div>
            </div>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
              <div style="font-weight: bold; color: #374151;">Confidence Interval</div>
              <div style="font-size: 18px; color: #dc2626;">${Math.round(result.confidenceInterval[0])} - ${Math.round(result.confidenceInterval[1])}</div>
            </div>
          </div>
        </div>

        <!-- Cognitive Profile -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Cognitive Profile</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
            ${cognitiveProfile.map((domain: any) => `
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">${domain.domain}</div>
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 5px;">${domain.score.toFixed(1)}%</div>
                <div style="font-size: 12px; color: #666;">${Math.round(domain.percentile)}th percentile</div>
                <div style="background: #e5e7eb; height: 6px; border-radius: 3px; margin-top: 8px;">
                  <div style="background: #3b82f6; height: 100%; width: ${domain.score}%; border-radius: 3px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Reliability Metrics -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Reliability Metrics</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 20px;">
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #059669;">${result.cronbachAlpha?.toFixed(3) || 'N/A'}</div>
              <div style="font-size: 12px; color: #666;">Cronbach's Alpha</div>
            </div>
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${result.standardError?.toFixed(3) || 'N/A'}</div>
              <div style="font-size: 12px; color: #666;">Standard Error</div>
            </div>
            <div style="background: #faf5ff; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #7c3aed;">${result.testReliability?.toFixed(3) || 'N/A'}</div>
              <div style="font-size: 12px; color: #666;">Test Reliability</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px;">
          <p>This report was generated by the Adaptive IQ Testing System</p>
          <p>For educational and research purposes only. Not a substitute for professional assessment.</p>
        </div>
      </div>
    `;
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
            ${data.cognitiveProfile.map((domain: any) => `
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
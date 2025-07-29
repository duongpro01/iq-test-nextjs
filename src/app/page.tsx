"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, TrendingUp, Users, Zap, Settings } from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { startTest, config } = useTestStore();
  const { t } = useTranslation('common');

  const handleStartTest = async () => {
    setIsLoading(true);
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start test and navigate
    startTest();
    router.push('/test');
  };

  const features = [
    {
      icon: Brain,
      title: 'Adaptive Testing',
      description: 'Questions adjust in real-time based on your performance'
    },
    {
      icon: Clock,
      title: 'Timed Assessment',
      description: 'Complete the test within a specified time limit'
    },
    {
      icon: Target,
      title: 'Multiple Categories',
      description: 'Test various aspects of cognitive ability'
    },
    {
      icon: TrendingUp,
      title: 'Accurate Scoring',
      description: 'Advanced IRT-based scoring system'
    },
    {
      icon: Users,
      title: 'Standardized Results',
      description: 'Compare your results with global statistics'
    },
    {
      icon: Zap,
      title: 'Detailed Analytics',
      description: 'Get comprehensive insights into your performance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 relative px-4 sm:px-6">
            {/* Language Selector - Mobile: Top, Desktop: Top Left */}
            <div className="absolute top-4 left-4">
              <LanguageSelector />
            </div>
            
            {/* Settings Button - Mobile: Hidden, Desktop: Top Right */}
            <div className="absolute top-4 right-4 hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/settings')}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </div>
            
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              IQ Test System
            </CardTitle>
            <CardDescription className="text-base sm:text-lg mt-2 max-w-2xl mx-auto">
              Test your intelligence with our advanced adaptive IQ test system
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6">
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Test Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-muted/30 rounded-lg p-4 sm:p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold">Test Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span><strong>Duration:</strong> {Math.floor(config.globalTimeLimit / 60)} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary flex-shrink-0" />
                  <span><strong>Questions:</strong> {config.totalQuestions} (Adaptive)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                  <span><strong>Difficulty:</strong> Auto-adjusting</span>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Instructions</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Find a quiet environment without distractions</p>
                <p>• Make sure you have stable internet connection</p>
                <p>• Answer all questions within the time limit</p>
                <p>• Read each question carefully before answering</p>
                <p>• Don't use external help or calculators</p>
                <p>• Submit your answers even if you're unsure</p>
              </div>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex justify-center pt-4"
            >
              <Button
                onClick={handleStartTest}
                disabled={isLoading}
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold min-w-[200px]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Preparing Test...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>Start Test</span>
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Mobile Settings Button */}
            <div className="sm:hidden flex justify-center">
              <Button
                variant="outline"
                onClick={() => router.push('/settings')}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Test Settings</span>
              </Button>
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="text-xs text-muted-foreground text-center pt-4 border-t space-y-2"
            >
              <p>
                This test is designed for educational and entertainment purposes only.
                Results should not be considered as a definitive measure of intelligence.
              </p>
              <p>
                Developed by{' '}
                <a 
                  href="https://github.com/VeinDevTtv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  VeinDev
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, TrendingUp, Users, Zap, Settings } from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { LanguageSelector } from '@/components/language-selector';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { startTest, config } = useTestStore();

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

  const testInfo = [
    {
      label: 'Duration',
      value: `${config.globalTimeLimit / 60} minutes`,
      icon: Clock
    },
    {
      label: 'Questions',
      value: `${config.totalQuestions} questions`,
      icon: Target
    },
    {
      label: 'Difficulty',
      value: 'Adaptive',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 relative px-4 sm:px-6">
            <div className="absolute top-4 right-4 hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/settings')}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Test Settings
              </Button>
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              IQ Test System
            </CardTitle>
            <CardDescription className="text-base sm:text-lg mt-2 max-w-2xl mx-auto">
              Test your intelligence with our advanced adaptive assessment system. 
              Get accurate results in just 30 minutes.
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
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Test Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
              {testInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <info.icon className="w-4 h-4 text-primary" />
                  <div className="text-center">
                    <div className="font-medium">{info.value}</div>
                    <div className="text-xs text-muted-foreground">{info.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex justify-center">
              <LanguageSelector />
            </div>

            {/* Start Test Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center"
            >
              <Button 
                onClick={handleStartTest} 
                disabled={isLoading} 
                size="lg" 
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold min-w-[200px]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                    <span>Starting Test...</span>
                  </div>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Start IQ Test
                  </>
                )}
              </Button>
            </motion.div>

            {/* Mobile Settings Button */}
            <div className="sm:hidden flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/settings')}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Test Settings
              </Button>
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-xs text-muted-foreground pt-4"
            >
              <p>
                This test is for educational and entertainment purposes. Results should not be used for clinical or professional assessment.
              </p>
              <p className="mt-1">
                Made with ❤️ by IQ Test System
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

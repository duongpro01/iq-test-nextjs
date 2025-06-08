"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslation } from 'react-i18next';

export function WelcomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { startTest, config } = useTestStore();
  const { t, i18n } = useTranslation('common');

  const handleStartTest = async () => {
    setIsLoading(true);
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    startTest();
    setIsLoading(false);
  };

  const features = [
    {
      icon: Brain,
      title: t('welcome.features.adaptive.title'),
      description: t('welcome.features.adaptive.description')
    },
    {
      icon: Clock,
      title: t('welcome.features.timed.title'),
      description: t('welcome.features.timed.description')
    },
    {
      icon: Target,
      title: t('welcome.features.categories.title'),
      description: t('welcome.features.categories.description')
    },
    {
      icon: TrendingUp,
      title: t('welcome.features.scoring.title'),
      description: t('welcome.features.scoring.description')
    },
    {
      icon: Users,
      title: t('welcome.features.standardized.title'),
      description: t('welcome.features.standardized.description')
    },
    {
      icon: Zap,
      title: t('welcome.features.analytics.title'),
      description: t('welcome.features.analytics.description')
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
          <CardHeader className="text-center pb-8 relative">
            {/* Language Selector - Card Header */}
            <div className="absolute top-4 left-4">
              <LanguageSelector variant="compact" />
            </div>
            
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('welcome.title')}
            </CardTitle>
            <CardDescription className="text-lg mt-2 max-w-2xl mx-auto">
              {t('welcome.description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Test Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-muted/30 rounded-lg p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold">{t('welcome.testInfo.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span><strong>{t('welcome.testInfo.duration')}:</strong> {Math.floor(config.globalTimeLimit / 60)} {t('common.minutes')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span><strong>{t('welcome.testInfo.questions')}:</strong> {config.totalQuestions} {t('welcome.testInfo.adaptive')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span><strong>{t('welcome.testInfo.difficulty')}:</strong> {t('welcome.testInfo.difficultyScale')}</span>
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
              <h3 className="text-lg font-semibold">{t('welcome.instructions.title')}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• {t('welcome.instructions.item1')}</p>
                <p>• {t('welcome.instructions.item2')}</p>
                <p>• {t('welcome.instructions.item3')}</p>
                <p>• {t('welcome.instructions.item4')}</p>
                <p>• {t('welcome.instructions.item5')}</p>
                <p>• {t('welcome.instructions.item6')}</p>
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
                className="px-8 py-3 text-lg font-semibold min-w-[200px]"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>{t('welcome.button.preparing')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>{t('welcome.button.start')}</span>
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="text-xs text-muted-foreground text-center pt-4 border-t space-y-2"
            >
              <p>
                {t('welcome.disclaimer')}
              </p>
              <p>
                {t('welcome.credits.text')}{' '}
                <a 
                  href="https://github.com/VeinDevTtv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {t('welcome.credits.author')}
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 
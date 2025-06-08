"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { organizeQuestionPools } from '@/data/questions';

export function WelcomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { startTest, config } = useTestStore();

  const handleStartTest = async () => {
    setIsLoading(true);
    
    // Initialize question pools
    const questionPools = organizeQuestionPools();
    useTestStore.setState({ questionPools });
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    startTest();
    setIsLoading(false);
  };

  const features = [
    {
      icon: Brain,
      title: "Adaptive Difficulty",
      description: "Questions adjust to your skill level in real-time using advanced algorithms"
    },
    {
      icon: Clock,
      title: "Timed Assessment",
      description: "30-minute comprehensive test with per-question time limits"
    },
    {
      icon: Target,
      title: "Multiple Categories",
      description: "Pattern recognition, spatial reasoning, logic, memory, and math puzzles"
    },
    {
      icon: TrendingUp,
      title: "Real-time Scoring",
      description: "Advanced IRT-based scoring with percentile rankings"
    },
    {
      icon: Users,
      title: "Standardized Results",
      description: "Results comparable to professional IQ assessments"
    },
    {
      icon: Zap,
      title: "Instant Analytics",
      description: "Detailed performance breakdown and improvement insights"
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
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Adaptive IQ Test System
            </CardTitle>
            <CardDescription className="text-lg mt-2 max-w-2xl mx-auto">
              Take a comprehensive intelligence assessment with adaptive difficulty and real-time analytics. 
              Get professional-grade results in just 30 minutes.
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
              <h3 className="text-lg font-semibold">Test Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span><strong>Duration:</strong> {Math.floor(config.globalTimeLimit / 60)} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span><strong>Questions:</strong> {config.totalQuestions} adaptive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span><strong>Difficulty:</strong> 1-10 scale</span>
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
                <p>• Answer each question to the best of your ability</p>
                <p>• Questions will adapt to your performance level</p>
                <p>• You cannot go back to previous questions</p>
                <p>• Take your time but be mindful of the timer</p>
                <p>• Ensure you have a stable internet connection</p>
                <p>• Find a quiet environment free from distractions</p>
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
                    <span>Preparing Test...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>Start IQ Test</span>
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="text-xs text-muted-foreground text-center pt-4 border-t"
            >
              <p>
                This test is for educational and entertainment purposes. 
                Results should not be used for clinical or professional assessment.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 
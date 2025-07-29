"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, TrendingUp, Users, Zap, Puzzle, RotateCw, Gamepad2, Sparkles } from 'lucide-react';
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    startTest();
    setIsLoading(false);
  };

  const interactiveFeatures = [
    {
      icon: Puzzle,
      title: 'Matrix Reasoning',
      description: 'Interactive pattern completion with visual matrices'
    },
    {
      icon: RotateCw,
      title: '3D Spatial Tasks',
      description: 'Rotate and manipulate 3D objects in real-time'
    },
    {
      icon: Gamepad2,
      title: 'Block Design',
      description: 'Assemble colored blocks to match target patterns'
    },
    {
      icon: Target,
      title: 'Visual Puzzles',
      description: 'Drag-and-drop puzzle assembly challenges'
    },
    {
      icon: Zap,
      title: 'Processing Speed',
      description: 'Rapid symbol scanning and coding tasks'
    },
    {
      icon: Brain,
      title: 'Working Memory',
      description: 'N-back tasks and digit span challenges'
    }
  ];

  const coreFeatures = [
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
      icon: TrendingUp,
      title: t('welcome.features.scoring.title'),
      description: t('welcome.features.scoring.description')
    },
    {
      icon: Users,
      title: t('welcome.features.standardized.title'),
      description: t('welcome.features.standardized.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-lg text-white">
          <CardHeader className="text-center pb-8 relative">
            {/* Language Selector */}
            <div className="absolute top-4 left-4">
              <LanguageSelector variant="compact" />
            </div>
            
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                {t('welcome.title')}
              </CardTitle>
              <CardDescription className="text-xl text-white/80 max-w-2xl mx-auto">
                Experience the most advanced interactive IQ assessment with authentic cognitive tasks
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-12">
            {/* New Interactive Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-bold text-white">Interactive Cognitive Tasks</h3>
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-white/70">
                  Authentic IQ test components with modern interactive interfaces
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interactiveFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative group"
                  >
                    <Card className="h-full bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-purple-400/50 transition-all duration-300">
                      <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                        <p className="text-xs text-white/60 leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Core Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white text-center">Advanced Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {coreFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white">{feature.title}</h4>
                      <p className="text-xs text-white/60 mt-1">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Test Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold text-white mb-4 text-center">{t('welcome.testInfo.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{Math.floor(config.globalTimeLimit / 60)}</div>
                  <div className="text-sm text-white/70">Minutes Duration</div>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{config.totalQuestions}</div>
                  <div className="text-sm text-white/70">Adaptive Questions</div>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1-10</div>
                  <div className="text-sm text-white/70">Difficulty Scale</div>
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white text-center">{t('welcome.instructions.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">1</span>
                    </div>
                    <p>Find a quiet environment free from distractions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">2</span>
                    </div>
                    <p>Ensure stable internet connection for interactive tasks</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">3</span>
                    </div>
                    <p>Use headphones for audio-based memory tasks (optional)</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">4</span>
                    </div>
                    <p>Work quickly but carefully - accuracy matters most</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">5</span>
                    </div>
                    <p>Follow task-specific instructions for interactive challenges</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-xs font-bold">6</span>
                    </div>
                    <p>Test adapts to your ability level automatically</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="flex justify-center pt-6"
            >
              <Button
                onClick={handleStartTest}
                disabled={isLoading}
                size="lg"
                className="px-12 py-4 text-lg font-semibold min-w-[280px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-2xl shadow-purple-500/25 border-0 relative overflow-hidden group"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Initializing Advanced IQ Test...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 relative z-10">
                    <Brain className="w-6 h-6" />
                    <span>Begin Interactive IQ Assessment</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.div>
                  </div>
                )}
                
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="text-xs text-white/60 text-center pt-6 border-t border-white/10 space-y-2"
            >
              <p>
                This assessment uses advanced psychometric principles and IRT-based adaptive testing for accurate cognitive measurement.
              </p>
              <p>
                Results are for educational and personal development purposes. For professional psychological assessment, consult a licensed practitioner.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 
"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Ear, 
  Brain, 
  Type, 
  MousePointer,
  Volume2,
  Accessibility,
  Zap,
  Focus,
  Minimize2
} from 'lucide-react';
import { useGamificationStore } from '@/store/gamification-store';
import { AccessibilityMode } from '@/types';

interface AccessibilityControlsProps {
  onClose?: () => void;
}

export function AccessibilityControls({ onClose }: AccessibilityControlsProps) {
  const [activeTab, setActiveTab] = useState('visual');
  const { userProfile, updateAccessibilityMode, updatePreferences } = useGamificationStore();
  
  const accessibilityMode = userProfile?.preferences.accessibilityMode || {
    dyslexiaFriendly: false,
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    colorBlindSupport: false,
    fontSize: 'medium' as const
  };

  const preferences = userProfile?.preferences || {
    animations: true,
    soundEffects: true,
    hapticFeedback: true,
    showHints: false,
    difficultyPreference: 'adaptive' as const,
    accessibilityMode,
    language: 'en',
    timezone: 'UTC'
  };

  const handleAccessibilityChange = (key: keyof AccessibilityMode, value: boolean | string) => {
    updateAccessibilityMode({ [key]: value });
  };

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    updatePreferences({ [key]: value });
  };

  const presets = {
    dyslexia: {
      name: 'Dyslexia Support',
      description: 'Optimized for users with dyslexia',
      icon: <Type className="w-5 h-5" />,
      settings: {
        dyslexiaFriendly: true,
        fontSize: 'large',
        reducedMotion: true,
        animations: false
      }
    },
    adhd: {
      name: 'ADHD Support',
      description: 'Reduced distractions and enhanced focus',
      icon: <Focus className="w-5 h-5" />,
      settings: {
        reducedMotion: true,
        animations: false,
        soundEffects: false,
        highContrast: true
      }
    },
    autism: {
      name: 'Autism Support',
      description: 'Sensory-friendly interface',
      icon: <Brain className="w-5 h-5" />,
      settings: {
        reducedMotion: true,
        animations: false,
        soundEffects: false,
        hapticFeedback: false,
        highContrast: false
      }
    },
    lowVision: {
      name: 'Low Vision',
      description: 'Enhanced visibility and contrast',
      icon: <Eye className="w-5 h-5" />,
      settings: {
        highContrast: true,
        fontSize: 'xlarge',
        colorBlindSupport: true
      }
    },
    screenReader: {
      name: 'Screen Reader',
      description: 'Optimized for screen reader users',
      icon: <Ear className="w-5 h-5" />,
      settings: {
        screenReaderOptimized: true,
        reducedMotion: true,
        animations: false,
        soundEffects: false
      }
    }
  };

  const applyPreset = (presetKey: string) => {
    const preset = presets[presetKey as keyof typeof presets];
    if (preset) {
      Object.entries(preset.settings).forEach(([key, value]) => {
        if (key in accessibilityMode) {
          handleAccessibilityChange(key as keyof AccessibilityMode, value as boolean | string);
        } else {
          handlePreferenceChange(key, value as boolean | string);
        }
      });
    }
  };

  const fontSizeOptions = [
    { value: 'small', label: 'Small', size: '14px' },
    { value: 'medium', label: 'Medium', size: '16px' },
    { value: 'large', label: 'Large', size: '18px' },
    { value: 'xlarge', label: 'Extra Large', size: '22px' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Accessibility className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold">Accessibility Settings</h1>
                <p className="text-muted-foreground">Customize your testing experience</p>
              </div>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Back to Test
              </Button>
            )}
          </div>
        </motion.div>

        {/* Quick Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Quick Presets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(presets).map(([key, preset]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-start space-y-2"
                      onClick={() => applyPreset(key)}
                    >
                      <div className="flex items-center space-x-2 w-full">
                        {preset.icon}
                        <span className="font-semibold">{preset.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        {preset.description}
                      </p>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="visual" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Visual</span>
              </TabsTrigger>
              <TabsTrigger value="motor" className="flex items-center space-x-2">
                <MousePointer className="w-4 h-4" />
                <span>Motor</span>
              </TabsTrigger>
              <TabsTrigger value="cognitive" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Cognitive</span>
              </TabsTrigger>
              <TabsTrigger value="sensory" className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <span>Sensory</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="visual">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="w-5 h-5" />
                        <span>Visual Accessibility</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Font Size */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Font Size</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {fontSizeOptions.map((option) => (
                            <Button
                              key={option.value}
                              variant={accessibilityMode.fontSize === option.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleAccessibilityChange('fontSize', option.value)}
                              style={{ fontSize: option.size }}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* High Contrast */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">High Contrast Mode</label>
                          <p className="text-xs text-muted-foreground">
                            Increases contrast for better visibility
                          </p>
                        </div>
                        <Switch
                          checked={accessibilityMode.highContrast}
                          onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
                        />
                      </div>

                      {/* Color Blind Support */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Color Blind Support</label>
                          <p className="text-xs text-muted-foreground">
                            Uses patterns and shapes in addition to colors
                          </p>
                        </div>
                        <Switch
                          checked={accessibilityMode.colorBlindSupport}
                          onCheckedChange={(checked) => handleAccessibilityChange('colorBlindSupport', checked)}
                        />
                      </div>

                      {/* Dyslexia Friendly */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Dyslexia-Friendly Font</label>
                          <p className="text-xs text-muted-foreground">
                            Uses OpenDyslexic font for better readability
                          </p>
                        </div>
                        <Switch
                          checked={accessibilityMode.dyslexiaFriendly}
                          onCheckedChange={(checked) => handleAccessibilityChange('dyslexiaFriendly', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="motor">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MousePointer className="w-5 h-5" />
                        <span>Motor Accessibility</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Reduced Motion */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Reduced Motion</label>
                          <p className="text-xs text-muted-foreground">
                            Minimizes animations and transitions
                          </p>
                        </div>
                        <Switch
                          checked={accessibilityMode.reducedMotion}
                          onCheckedChange={(checked) => handleAccessibilityChange('reducedMotion', checked)}
                        />
                      </div>

                      {/* Haptic Feedback */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Haptic Feedback</label>
                          <p className="text-xs text-muted-foreground">
                            Vibration feedback for interactions
                          </p>
                        </div>
                        <Switch
                          checked={preferences.hapticFeedback}
                          onCheckedChange={(checked) => handlePreferenceChange('hapticFeedback', checked)}
                        />
                      </div>

                      {/* Large Click Targets */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Button Size</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Small', 'Medium', 'Large'].map((size) => (
                            <Button
                              key={size}
                              variant="outline"
                              size={size.toLowerCase() as any}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
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
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5" />
                        <span>Cognitive Support</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Smart Hints */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Smart Hints</label>
                          <p className="text-xs text-muted-foreground">
                            AI-powered hints to guide your thinking
                          </p>
                        </div>
                        <Switch
                          checked={preferences.showHints}
                          onCheckedChange={(checked) => handlePreferenceChange('showHints', checked)}
                        />
                      </div>

                      {/* Distraction Reduction */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Distraction Reduction</label>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              handleAccessibilityChange('reducedMotion', true);
                              handlePreferenceChange('animations', false);
                              handlePreferenceChange('soundEffects', false);
                            }}
                          >
                            <Minimize2 className="w-4 h-4 mr-2" />
                            Enable Focus Mode
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Removes animations, sounds, and visual distractions
                          </p>
                        </div>
                      </div>

                      {/* Reading Speed */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Reading Time Extension</label>
                        <div className="space-y-2">
                          <Slider
                            value={[100]}
                            max={200}
                            min={50}
                            step={25}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>50% (Faster)</span>
                            <span>100% (Normal)</span>
                            <span>200% (Slower)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="sensory">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Volume2 className="w-5 h-5" />
                        <span>Sensory Preferences</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Sound Effects */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Sound Effects</label>
                          <p className="text-xs text-muted-foreground">
                            Audio feedback for interactions
                          </p>
                        </div>
                        <Switch
                          checked={preferences.soundEffects}
                          onCheckedChange={(checked) => handlePreferenceChange('soundEffects', checked)}
                        />
                      </div>

                      {/* Screen Reader Optimization */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Screen Reader Optimization</label>
                          <p className="text-xs text-muted-foreground">
                            Enhanced ARIA labels and descriptions
                          </p>
                        </div>
                        <Switch
                          checked={accessibilityMode.screenReaderOptimized}
                          onCheckedChange={(checked) => handleAccessibilityChange('screenReaderOptimized', checked)}
                        />
                      </div>

                      {/* Animations */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Animations</label>
                          <p className="text-xs text-muted-foreground">
                            Visual transitions and effects
                          </p>
                        </div>
                        <Switch
                          checked={preferences.animations}
                          onCheckedChange={(checked) => handlePreferenceChange('animations', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Current Settings Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Active Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {accessibilityMode.dyslexiaFriendly && (
                  <Badge variant="secondary">Dyslexia-Friendly Font</Badge>
                )}
                {accessibilityMode.highContrast && (
                  <Badge variant="secondary">High Contrast</Badge>
                )}
                {accessibilityMode.reducedMotion && (
                  <Badge variant="secondary">Reduced Motion</Badge>
                )}
                {accessibilityMode.screenReaderOptimized && (
                  <Badge variant="secondary">Screen Reader Optimized</Badge>
                )}
                {accessibilityMode.colorBlindSupport && (
                  <Badge variant="secondary">Color Blind Support</Badge>
                )}
                {preferences.showHints && (
                  <Badge variant="secondary">Smart Hints Enabled</Badge>
                )}
                {!preferences.soundEffects && (
                  <Badge variant="secondary">Sound Disabled</Badge>
                )}
                {!preferences.animations && (
                  <Badge variant="secondary">Animations Disabled</Badge>
                )}
                <Badge variant="outline">Font: {accessibilityMode.fontSize}</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 
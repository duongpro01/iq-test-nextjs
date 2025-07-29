"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Clock, 
  Target, 
  Brain,
  Zap,
  Save,
  RotateCcw
} from 'lucide-react';
import { useTestStore } from '@/store/test-store';
import { AdaptiveTestConfig } from '@/types';
import { useToast } from "@/components/ui/use-toast";

interface TestSettingsProps {
  onClose?: () => void;
}

export function TestSettings({ onClose }: TestSettingsProps) {
  const router = useRouter();
  const { config, updateConfig } = useTestStore();
  const [settings, setSettings] = useState<AdaptiveTestConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const [activePreset, setActivePreset] = useState<string>("");

  useEffect(() => {
    console.log('TestSettings mounted with config:', config);
    setSettings(config);
  }, [config]);

  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(config);
    console.log('hasChanges updated:', hasChanges, 'settings:', settings, 'config:', config);
    console.log('settings JSON:', JSON.stringify(settings));
    console.log('config JSON:', JSON.stringify(config));
    console.log('JSON comparison result:', JSON.stringify(settings) === JSON.stringify(config));
    setHasChanges(hasChanges);
  }, [settings, config]);

  const handleSave = () => {
    console.log('handleSave called with settings:', settings);
    updateConfig(settings);
    setHasChanges(false);
    console.log('hasChanges set to false');
    if (onClose) {
      onClose();
    }
    // Remove automatic navigation to /test
    // User should click "Start Test" button instead
  };

  const handleReset = () => {
    setSettings(config);
    setHasChanges(false);
  };

  const updateSetting = <K extends keyof AdaptiveTestConfig>(
    key: K, 
    value: AdaptiveTestConfig[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeString: string) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return (minutes * 60) + (seconds || 0);
  };

  const applyPreset = (presetName: string, presetConfig: Partial<AdaptiveTestConfig>) => {
    setSettings({
      ...config,
      ...presetConfig
    });
    setActivePreset(presetName);
    setHasChanges(true);
    toast({
      title: "Preset Applied",
      description: `${presetName} settings have been applied. Don't forget to save your changes!`,
      duration: 3000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Test Settings</h1>
            <p className="text-muted-foreground">Configure your IQ test parameters</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          <Button 
            variant="default" 
            onClick={() => {
              console.log('Start Test button clicked, hasChanges:', hasChanges);
              const { startTest } = useTestStore.getState();
              console.log('Calling startTest...');
              startTest();
              console.log('startTest called, navigating to /test');
              router.push('/test');
            }}
            // disabled={hasChanges} // Temporarily removed for testing
          >
            <Target className="w-4 h-4 mr-2" />
            Start Test {hasChanges ? '(Disabled)' : '(Enabled)'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Basic Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalQuestions">Number of Questions</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="totalQuestions"
                  min={20}
                  max={50}
                  step={5}
                  value={[settings.totalQuestions]}
                  onValueChange={([value]) => updateSetting('totalQuestions', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={20}
                  max={50}
                  value={settings.totalQuestions}
                  onChange={(e) => updateSetting('totalQuestions', parseInt(e.target.value) || 30)}
                  className="w-20"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                More questions = more accurate results (20-50 recommended)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="globalTimeLimit">Total Time Limit</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="globalTimeLimit"
                  min={900}
                  max={3600}
                  step={300}
                  value={[settings.globalTimeLimit]}
                  onValueChange={([value]) => updateSetting('globalTimeLimit', value)}
                  className="flex-1"
                />
                <Input
                  type="text"
                  value={formatTime(settings.globalTimeLimit)}
                  onChange={(e) => updateSetting('globalTimeLimit', parseTime(e.target.value))}
                  className="w-20"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Total time allowed for the entire test
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionTimeLimit">Time per Question</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="questionTimeLimit"
                  min={30}
                  max={120}
                  step={15}
                  value={[settings.questionTimeLimit]}
                  onValueChange={([value]) => updateSetting('questionTimeLimit', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={30}
                  max={120}
                  value={settings.questionTimeLimit}
                  onChange={(e) => updateSetting('questionTimeLimit', parseInt(e.target.value) || 60)}
                  className="w-20"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Maximum time allowed per individual question
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Adaptive Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Adaptive Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startingAbility">Starting Ability Level</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="startingAbility"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={[settings.startingAbility]}
                  onValueChange={([value]) => updateSetting('startingAbility', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={settings.startingAbility}
                  onChange={(e) => updateSetting('startingAbility', parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Initial ability estimate (-2 = below average, 0 = average, +2 = above average)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="selectionMethod">Question Selection Method</Label>
              <Select
                value={settings.selectionMethod}
                onValueChange={(value: 'MaxInfo' | 'Bayesian' | 'Hybrid') => 
                  updateSetting('selectionMethod', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MaxInfo">Maximum Information</SelectItem>
                  <SelectItem value="Bayesian">Bayesian</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Algorithm for selecting the next question
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetStandardError">Target Precision</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="targetStandardError"
                  min={0.1}
                  max={0.5}
                  step={0.05}
                  value={[settings.targetStandardError]}
                  onValueChange={([value]) => updateSetting('targetStandardError', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0.1}
                  max={0.5}
                  step={0.05}
                  value={settings.targetStandardError}
                  onChange={(e) => updateSetting('targetStandardError', parseFloat(e.target.value) || 0.3)}
                  className="w-20"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Lower values = higher precision (test stops when reached)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Advanced Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Content Balancing</Label>
                <p className="text-sm text-muted-foreground">
                  Ensure equal coverage across cognitive domains
                </p>
              </div>
              <Switch
                checked={settings.contentBalancing}
                onCheckedChange={(checked) => updateSetting('contentBalancing', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exposure Control</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent overuse of specific questions
                </p>
              </div>
              <Switch
                checked={settings.exposureControl}
                onCheckedChange={(checked) => updateSetting('exposureControl', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Penalize Slow Answers</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce score for very slow responses
                </p>
              </div>
              <Switch
                checked={settings.penalizeSlowAnswers}
                onCheckedChange={(checked) => updateSetting('penalizeSlowAnswers', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Penalize Fast Answers</Label>
                <p className="text-sm text-muted-foreground">
                  Detect and penalize rushed responses
                </p>
              </div>
              <Switch
                checked={settings.penalizeFastAnswers}
                onCheckedChange={(checked) => updateSetting('penalizeFastAnswers', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeWeightFactor">Time Weight Factor</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="timeWeightFactor"
                  min={0}
                  max={0.3}
                  step={0.05}
                  value={[settings.timeWeightFactor]}
                  onValueChange={([value]) => updateSetting('timeWeightFactor', value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={0.3}
                  step={0.05}
                  value={settings.timeWeightFactor}
                  onChange={(e) => updateSetting('timeWeightFactor', parseFloat(e.target.value) || 0.1)}
                  className="w-20"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                How much time affects the final score (0 = no effect)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preset Configurations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Quick Presets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant={activePreset === "Quick Test" ? "default" : "outline"}
              className={`w-full justify-start ${
                activePreset === "Quick Test" ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => applyPreset("Quick Test", {
                totalQuestions: 20,
                globalTimeLimit: 1200,
                questionTimeLimit: 60,
                startingAbility: 0.0,
                targetStandardError: 0.3,
                selectionMethod: 'MaxInfo' as const,
                exposureControl: true,
                contentBalancing: true,
                penalizeSlowAnswers: true,
                penalizeFastAnswers: true,
                timeWeightFactor: 0.1
              })}
            >
              <Target className="w-4 h-4 mr-2" />
              Quick Test (20 questions, 20 min)
            </Button>

            <Button
              variant={activePreset === "Standard Test" ? "default" : "outline"}
              className={`w-full justify-start ${
                activePreset === "Standard Test" ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => applyPreset("Standard Test", {
                totalQuestions: 35,
                globalTimeLimit: 2400,
                questionTimeLimit: 70,
                startingAbility: 0.0,
                targetStandardError: 0.3,
                selectionMethod: 'MaxInfo' as const,
                exposureControl: true,
                contentBalancing: true,
                penalizeSlowAnswers: true,
                penalizeFastAnswers: true,
                timeWeightFactor: 0.1
              })}
            >
              <Brain className="w-4 h-4 mr-2" />
              Standard Test (35 questions, 40 min)
            </Button>

            <Button
              variant={activePreset === "Comprehensive Test" ? "default" : "outline"}
              className={`w-full justify-start ${
                activePreset === "Comprehensive Test" ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => applyPreset("Comprehensive Test", {
                totalQuestions: 50,
                globalTimeLimit: 3600,
                questionTimeLimit: 72,
                startingAbility: 0.0,
                targetStandardError: 0.2,
                selectionMethod: 'Hybrid' as const,
                exposureControl: true,
                contentBalancing: true,
                penalizeSlowAnswers: true,
                penalizeFastAnswers: true,
                timeWeightFactor: 0.15
              })}
            >
              <Zap className="w-4 h-4 mr-2" />
              Comprehensive Test (50 questions, 60 min)
            </Button>

            <Button
              variant={activePreset === "Advanced Level" ? "default" : "outline"}
              className={`w-full justify-start ${
                activePreset === "Advanced Level" ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => applyPreset("Advanced Level", {
                totalQuestions: 30,
                globalTimeLimit: 1800,
                questionTimeLimit: 60,
                startingAbility: 1.0,
                targetStandardError: 0.25,
                selectionMethod: 'Bayesian' as const,
                exposureControl: true,
                contentBalancing: true,
                penalizeSlowAnswers: true,
                penalizeFastAnswers: true,
                timeWeightFactor: 0.2
              })}
            >
              <Target className="w-4 h-4 mr-2" />
              Advanced Level (30 questions, 30 min)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold text-primary">{settings.totalQuestions}</div>
              <div className="text-muted-foreground">Questions</div>
            </div>
            <div>
              <div className="font-semibold text-blue-600">{formatTime(settings.globalTimeLimit)}</div>
              <div className="text-muted-foreground">Time Limit</div>
            </div>
            <div>
              <div className="font-semibold text-green-600">{settings.questionTimeLimit}s</div>
              <div className="text-muted-foreground">Per Question</div>
            </div>
            <div>
              <div className="font-semibold text-purple-600">{settings.selectionMethod}</div>
              <div className="text-muted-foreground">Selection</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 
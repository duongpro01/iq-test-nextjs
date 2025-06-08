import React from 'react';

// Feature toggle system for modular rollout and A/B testing
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0-100
  targetAudience?: TargetAudience;
  dependencies?: string[]; // other feature IDs this depends on
  variants?: FeatureVariant[];
  metadata: FeatureMetadata;
}

export interface TargetAudience {
  userTypes?: ('new' | 'returning' | 'premium')[];
  countries?: string[];
  devices?: ('mobile' | 'tablet' | 'desktop')[];
  browsers?: string[];
  minLevel?: number;
  maxLevel?: number;
}

export interface FeatureVariant {
  id: string;
  name: string;
  weight: number; // percentage allocation
  config: Record<string, any>;
}

export interface FeatureMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  category: 'ui' | 'functionality' | 'experiment' | 'performance' | 'security';
  stage: 'development' | 'testing' | 'beta' | 'production' | 'deprecated';
  expiresAt?: Date;
}

export interface UserContext {
  userId: string;
  userType: 'new' | 'returning' | 'premium';
  country: string;
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  level: number;
  sessionId: string;
}

export interface FeatureConfig {
  features: Record<string, FeatureFlag>;
  version: string;
  lastUpdated: Date;
  environment: 'development' | 'staging' | 'production';
}

class FeatureToggleEngine {
  private config: FeatureConfig;
  private userContext: UserContext | null = null;
  private evaluationCache: Map<string, { result: boolean; variant?: string; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.config = this.loadDefaultConfig();
    this.loadStoredConfig();
  }

  /**
   * Set user context for feature evaluation
   */
  setUserContext(context: UserContext): void {
    this.userContext = context;
    this.clearCache(); // Clear cache when user context changes
  }

  /**
   * Check if a feature is enabled for the current user
   */
  isFeatureEnabled(featureId: string): boolean {
    const evaluation = this.evaluateFeature(featureId);
    return evaluation.enabled;
  }

  /**
   * Get feature variant for A/B testing
   */
  getFeatureVariant(featureId: string): string | null {
    const evaluation = this.evaluateFeature(featureId);
    return evaluation.variant || null;
  }

  /**
   * Get feature configuration with variant-specific settings
   */
  getFeatureConfig(featureId: string): Record<string, any> {
    const feature = this.config.features[featureId];
    if (!feature || !this.isFeatureEnabled(featureId)) {
      return {};
    }

    const variant = this.getFeatureVariant(featureId);
    if (variant && feature.variants) {
      const variantConfig = feature.variants.find(v => v.id === variant);
      return variantConfig?.config || {};
    }

    return {};
  }

  /**
   * Evaluate feature with caching
   */
  private evaluateFeature(featureId: string): { enabled: boolean; variant?: string } {
    // Check cache first
    const cached = this.evaluationCache.get(featureId);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return { enabled: cached.result, variant: cached.variant };
    }

    const result = this.performFeatureEvaluation(featureId);
    
    // Cache the result
    this.evaluationCache.set(featureId, {
      result: result.enabled,
      variant: result.variant,
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * Core feature evaluation logic
   */
  private performFeatureEvaluation(featureId: string): { enabled: boolean; variant?: string } {
    const feature = this.config.features[featureId];
    
    if (!feature) {
      console.warn(`Feature ${featureId} not found`);
      return { enabled: false };
    }

    // Check if feature is globally disabled
    if (!feature.enabled) {
      return { enabled: false };
    }

    // Check expiration
    if (feature.metadata.expiresAt && new Date() > feature.metadata.expiresAt) {
      return { enabled: false };
    }

    // Check dependencies
    if (feature.dependencies) {
      for (const depId of feature.dependencies) {
        if (!this.isFeatureEnabled(depId)) {
          return { enabled: false };
        }
      }
    }

    // Check user context requirements
    if (!this.userContext) {
      return { enabled: feature.rolloutPercentage >= 100 };
    }

    // Target audience filtering
    if (feature.targetAudience && !this.matchesTargetAudience(feature.targetAudience)) {
      return { enabled: false };
    }

    // Rollout percentage check
    const userHash = this.hashUser(this.userContext.userId, featureId);
    const isInRollout = userHash < feature.rolloutPercentage;

    if (!isInRollout) {
      return { enabled: false };
    }

    // Variant selection for A/B testing
    let selectedVariant: string | undefined;
    if (feature.variants && feature.variants.length > 0) {
      selectedVariant = this.selectVariant(feature.variants, this.userContext.userId, featureId);
    }

    return { enabled: true, variant: selectedVariant };
  }

  /**
   * Check if user matches target audience criteria
   */
  private matchesTargetAudience(audience: TargetAudience): boolean {
    if (!this.userContext) return false;

    // User type check
    if (audience.userTypes && !audience.userTypes.includes(this.userContext.userType)) {
      return false;
    }

    // Country check
    if (audience.countries && !audience.countries.includes(this.userContext.country)) {
      return false;
    }

    // Device check
    if (audience.devices && !audience.devices.includes(this.userContext.device)) {
      return false;
    }

    // Browser check
    if (audience.browsers && !audience.browsers.includes(this.userContext.browser)) {
      return false;
    }

    // Level range check
    if (audience.minLevel && this.userContext.level < audience.minLevel) {
      return false;
    }

    if (audience.maxLevel && this.userContext.level > audience.maxLevel) {
      return false;
    }

    return true;
  }

  /**
   * Select variant for A/B testing
   */
  private selectVariant(variants: FeatureVariant[], userId: string, featureId: string): string {
    const hash = this.hashUser(userId, `${featureId}_variant`);
    let cumulativeWeight = 0;

    for (const variant of variants) {
      cumulativeWeight += variant.weight;
      if (hash < cumulativeWeight) {
        return variant.id;
      }
    }

    // Fallback to first variant
    return variants[0].id;
  }

  /**
   * Hash user ID for consistent feature assignment
   */
  private hashUser(userId: string, salt: string): number {
    const str = `${userId}_${salt}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }

  /**
   * Clear evaluation cache
   */
  private clearCache(): void {
    this.evaluationCache.clear();
  }

  /**
   * Load default feature configuration
   */
  private loadDefaultConfig(): FeatureConfig {
    return {
      features: {
        // Tier 1 Features
        global_leaderboard: {
          id: 'global_leaderboard',
          name: 'Global Leaderboard',
          description: 'Show global leaderboards with country rankings',
          enabled: true,
          rolloutPercentage: 100,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'functionality',
            stage: 'production'
          }
        },
        
        gamification_system: {
          id: 'gamification_system',
          name: 'Gamification System',
          description: 'XP, levels, badges, and achievements',
          enabled: true,
          rolloutPercentage: 100,
          variants: [
            {
              id: 'standard',
              name: 'Standard Gamification',
              weight: 70,
              config: { xpMultiplier: 1.0, badgeRarity: 'normal' }
            },
            {
              id: 'enhanced',
              name: 'Enhanced Gamification',
              weight: 30,
              config: { xpMultiplier: 1.5, badgeRarity: 'rare' }
            }
          ],
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'functionality',
            stage: 'production'
          }
        },

        enhanced_results: {
          id: 'enhanced_results',
          name: 'Enhanced Results Dashboard',
          description: 'Advanced analytics and export features',
          enabled: true,
          rolloutPercentage: 100,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'ui',
            stage: 'production'
          }
        },

        cheat_detection: {
          id: 'cheat_detection',
          name: 'Real-time Cheat Detection',
          description: 'Monitor user behavior for cheating patterns',
          enabled: true,
          rolloutPercentage: 100,
          targetAudience: {
            userTypes: ['returning', 'premium']
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'security',
            stage: 'production'
          }
        },

        smart_hints: {
          id: 'smart_hints',
          name: 'AI-Powered Smart Hints',
          description: 'Contextual hints and guidance system',
          enabled: false, // Disabled by default for gradual rollout
          rolloutPercentage: 25,
          targetAudience: {
            userTypes: ['new'],
            minLevel: 1,
            maxLevel: 10
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'functionality',
            stage: 'beta'
          }
        },

        social_sharing: {
          id: 'social_sharing',
          name: 'Social Media Sharing',
          description: 'Share results on social platforms',
          enabled: true,
          rolloutPercentage: 80,
          variants: [
            {
              id: 'basic',
              name: 'Basic Sharing',
              weight: 60,
              config: { platforms: ['twitter', 'facebook'] }
            },
            {
              id: 'advanced',
              name: 'Advanced Sharing',
              weight: 40,
              config: { platforms: ['twitter', 'facebook', 'linkedin', 'reddit'] }
            }
          ],
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'functionality',
            stage: 'production'
          }
        },

        accessibility_mode: {
          id: 'accessibility_mode',
          name: 'Enhanced Accessibility',
          description: 'Advanced accessibility features',
          enabled: true,
          rolloutPercentage: 100,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'ui',
            stage: 'production'
          }
        },

        // Experimental Features
        voice_commands: {
          id: 'voice_commands',
          name: 'Voice Commands',
          description: 'Voice-controlled test navigation',
          enabled: false,
          rolloutPercentage: 5,
          targetAudience: {
            devices: ['desktop'],
            browsers: ['chrome', 'firefox']
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'experiment',
            stage: 'development',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        },

        ai_proctoring: {
          id: 'ai_proctoring',
          name: 'AI Proctoring',
          description: 'Advanced AI-based test monitoring',
          enabled: false,
          rolloutPercentage: 10,
          dependencies: ['cheat_detection'],
          targetAudience: {
            userTypes: ['premium'],
            devices: ['desktop']
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            category: 'security',
            stage: 'testing'
          }
        }
      },
      version: '1.0.0',
      lastUpdated: new Date(),
      environment: 'production'
    };
  }

  /**
   * Load configuration from storage
   */
  private loadStoredConfig(): void {
    try {
      const stored = localStorage.getItem('feature_config');
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        // Merge with default config, allowing overrides
        this.config = { ...this.config, ...parsedConfig };
      }
    } catch (error) {
      console.warn('Failed to load stored feature config:', error);
    }
  }

  /**
   * Save configuration to storage
   */
  saveConfig(): void {
    try {
      localStorage.setItem('feature_config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save feature config:', error);
    }
  }

  /**
   * Update feature configuration
   */
  updateFeature(featureId: string, updates: Partial<FeatureFlag>): void {
    if (this.config.features[featureId]) {
      this.config.features[featureId] = {
        ...this.config.features[featureId],
        ...updates,
        metadata: {
          ...this.config.features[featureId].metadata,
          updatedAt: new Date()
        }
      };
      this.clearCache();
      this.saveConfig();
    }
  }

  /**
   * Get all features with their current status
   */
  getAllFeatures(): Array<FeatureFlag & { currentStatus: boolean; currentVariant?: string }> {
    return Object.values(this.config.features).map(feature => ({
      ...feature,
      currentStatus: this.isFeatureEnabled(feature.id),
      currentVariant: this.getFeatureVariant(feature.id) || undefined
    }));
  }

  /**
   * Get features by category
   */
  getFeaturesByCategory(category: FeatureMetadata['category']): FeatureFlag[] {
    return Object.values(this.config.features).filter(
      feature => feature.metadata.category === category
    );
  }

  /**
   * Get features by stage
   */
  getFeaturesByStage(stage: FeatureMetadata['stage']): FeatureFlag[] {
    return Object.values(this.config.features).filter(
      feature => feature.metadata.stage === stage
    );
  }

  /**
   * Enable/disable feature
   */
  toggleFeature(featureId: string, enabled: boolean): void {
    this.updateFeature(featureId, { enabled });
  }

  /**
   * Update rollout percentage
   */
  updateRollout(featureId: string, percentage: number): void {
    this.updateFeature(featureId, { rolloutPercentage: Math.max(0, Math.min(100, percentage)) });
  }

  /**
   * Get feature evaluation metrics
   */
  getEvaluationMetrics(): {
    totalFeatures: number;
    enabledFeatures: number;
    experimentsRunning: number;
    cacheHitRate: number;
  } {
    const total = Object.keys(this.config.features).length;
    const enabled = Object.values(this.config.features).filter(f => this.isFeatureEnabled(f.id)).length;
    const experiments = Object.values(this.config.features).filter(f => f.variants && f.variants.length > 0).length;
    
    return {
      totalFeatures: total,
      enabledFeatures: enabled,
      experimentsRunning: experiments,
      cacheHitRate: this.evaluationCache.size > 0 ? 0.85 : 0 // Simulated cache hit rate
    };
  }
}

// Global instance
export const featureToggleEngine = new FeatureToggleEngine();

// React hook for easy feature flag usage
export const useFeatureFlag = (featureId: string) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [variant, setVariant] = React.useState<string | null>(null);
  const [config, setConfig] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const enabled = featureToggleEngine.isFeatureEnabled(featureId);
    const currentVariant = featureToggleEngine.getFeatureVariant(featureId);
    const featureConfig = featureToggleEngine.getFeatureConfig(featureId);

    setIsEnabled(enabled);
    setVariant(currentVariant);
    setConfig(featureConfig);
  }, [featureId]);

  return { isEnabled, variant, config };
};

// React component wrapper for feature flags
export const FeatureFlag = ({ 
  feature, 
  children, 
  fallback = null 
}: {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { isEnabled } = useFeatureFlag(feature);
  return isEnabled ? children : fallback;
}; 
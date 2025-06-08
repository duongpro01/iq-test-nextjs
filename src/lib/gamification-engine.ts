import { QuestionCategory, TestResult } from '@/types';

// Enhanced gamification interfaces
export interface XPCalculation {
  baseXP: number;
  accuracyBonus: number;
  speedBonus: number;
  difficultyBonus: number;
  streakBonus: number;
  domainBonus: number;
  totalXP: number;
}

export interface LevelSystem {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  levelProgress: number; // 0-1
  prestigeLevel: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: QuestionCategory | 'general' | 'achievement' | 'streak' | 'speed';
  requirements: BadgeRequirement[];
  xpReward: number;
  isSecret: boolean;
}

export interface BadgeRequirement {
  type: 'accuracy' | 'speed' | 'streak' | 'domain_mastery' | 'total_tests' | 'perfect_score' | 'time_limit';
  value: number;
  domain?: QuestionCategory;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'allTime';
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'progressive' | 'milestone' | 'challenge';
  category: QuestionCategory | 'general';
  tiers: AchievementTier[];
  isRepeatable: boolean;
}

export interface AchievementTier {
  level: number;
  name: string;
  requirement: number;
  xpReward: number;
  badgeReward?: string;
}

export interface DomainMastery {
  domain: QuestionCategory;
  level: number;
  xp: number;
  xpToNextLevel: number;
  masteryPercentage: number;
  strengths: string[];
  weaknesses: string[];
  recentPerformance: number[];
  averageAccuracy: number;
  averageSpeed: number;
  totalQuestions: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakType: 'daily' | 'perfect' | 'speed' | 'accuracy';
  lastActivity: Date;
  streakMultiplier: number;
  streakBonusXP: number;
}

export interface GamificationStats {
  totalXP: number;
  level: number;
  badgesEarned: number;
  achievementsCompleted: number;
  averageAccuracy: number;
  testsCompleted: number;
  timeSpent: number; // minutes
  favoriteCategory: QuestionCategory;
  strongestDomain: QuestionCategory;
  improvementRate: number;
}

class GamificationEngine {
  private badgeDefinitions: Map<string, BadgeDefinition> = new Map();
  private achievementDefinitions: Map<string, AchievementDefinition> = new Map();
  private userStats: Map<string, GamificationStats> = new Map();

  constructor() {
    this.initializeBadges();
    this.initializeAchievements();
    this.loadStoredData();
  }

  /**
   * Calculate XP earned from a test result
   */
  calculateXP(result: TestResult, userLevel: number, streakData: StreakData): XPCalculation {
    // Base XP calculation
    const baseXP = Math.floor(result.totalQuestions * 10);
    
    // Accuracy bonus (0-100% extra)
    const accuracyBonus = Math.floor(baseXP * (result.accuracy / 100));
    
    // Speed bonus based on average response time
    const avgResponseTime = result.averageResponseTime / 1000; // convert to seconds
    const speedMultiplier = Math.max(0, Math.min(1, (30 - avgResponseTime) / 30)); // 30s baseline
    const speedBonus = Math.floor(baseXP * speedMultiplier * 0.5);
    
    // Difficulty bonus based on final ability estimate
    const difficultyMultiplier = Math.max(0, (result.finalAbilityEstimate + 3) / 6); // normalize -3 to +3 range
    const difficultyBonus = Math.floor(baseXP * difficultyMultiplier * 0.3);
    
    // Streak bonus
    const streakMultiplier = Math.min(2.0, 1 + (streakData.currentStreak * 0.1));
    const streakBonus = Math.floor(baseXP * (streakMultiplier - 1));
    
    // Domain mastery bonus
    const domainBonus = this.calculateDomainBonus(result, userLevel);
    
    const totalXP = baseXP + accuracyBonus + speedBonus + difficultyBonus + streakBonus + domainBonus;
    
    return {
      baseXP,
      accuracyBonus,
      speedBonus,
      difficultyBonus,
      streakBonus,
      domainBonus,
      totalXP
    };
  }

  /**
   * Calculate domain-specific bonus XP
   */
  private calculateDomainBonus(result: TestResult, userLevel: number): number {
    let domainBonus = 0;
    
         Object.entries(result.domainMastery).forEach(([, analysis]) => {
       if (analysis.abilityEstimate > 0) {
         // Bonus for performing well in challenging domains
         domainBonus += Math.floor(analysis.abilityEstimate * 5);
       }
     });
    
    return Math.min(domainBonus, userLevel * 10); // Cap based on user level
  }

  /**
   * Calculate level from total XP
   */
  calculateLevel(totalXP: number): LevelSystem {
    // Exponential level curve: XP needed = 100 * (level^1.5)
    let level = 1;
    let xpForCurrentLevel = 0;
    let xpForNextLevel = 100;
    
    while (totalXP >= xpForNextLevel) {
      level++;
      xpForCurrentLevel = xpForNextLevel;
      xpForNextLevel = Math.floor(100 * Math.pow(level, 1.5));
    }
    
    const currentXP = totalXP - xpForCurrentLevel;
    const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
    const levelProgress = currentXP / xpToNextLevel;
    
    // Prestige system (every 100 levels)
    const prestigeLevel = Math.floor((level - 1) / 100);
    
    return {
      currentLevel: level,
      currentXP,
      xpToNextLevel,
      totalXP,
      levelProgress,
      prestigeLevel
    };
  }

  /**
   * Update domain mastery based on test performance
   */
  updateDomainMastery(
    userId: string,
    result: TestResult,
    previousMastery: Record<QuestionCategory, DomainMastery>
  ): Record<QuestionCategory, DomainMastery> {
    const updatedMastery: Record<QuestionCategory, DomainMastery> = { ...previousMastery };
    
    Object.entries(result.domainMastery).forEach(([domainKey, analysis]) => {
      const domain = domainKey as QuestionCategory;
      const current = updatedMastery[domain] || this.createInitialDomainMastery(domain);
      
      // Calculate XP gain for this domain
      const domainXP = Math.floor(analysis.abilityEstimate * 20 + analysis.questionsAnswered * 5);
      current.xp += domainXP;
      
      // Update level
      const newLevel = Math.floor(current.xp / 1000) + 1;
      if (newLevel > current.level) {
        current.level = newLevel;
        // Unlock new content or abilities
        this.onDomainLevelUp(userId, domain, newLevel);
      }
      
      // Update performance metrics
      current.recentPerformance.push(analysis.abilityEstimate);
      if (current.recentPerformance.length > 10) {
        current.recentPerformance.shift();
      }
      
      current.averageAccuracy = this.calculateDomainAccuracy(result, domain);
      current.averageSpeed = this.calculateDomainSpeed(result, domain);
      current.totalQuestions += analysis.questionsAnswered;
      
      // Update mastery percentage
      current.masteryPercentage = Math.min(100, (current.xp / (current.level * 1000)) * 100);
      
      // Update strengths and weaknesses
      current.strengths = analysis.strengthAreas;
      current.weaknesses = analysis.improvementAreas;
      
      updatedMastery[domain] = current;
    });
    
    return updatedMastery;
  }

  /**
   * Check and award badges based on performance
   */
  checkBadgeEligibility(
    userId: string,
    result: TestResult,
    userStats: GamificationStats,
    streakData: StreakData
  ): string[] {
    const earnedBadges: string[] = [];
    
    this.badgeDefinitions.forEach((badge, badgeId) => {
      if (this.isBadgeEarned(badge, result, userStats, streakData)) {
        earnedBadges.push(badgeId);
      }
    });
    
    return earnedBadges;
  }

  /**
   * Check if a specific badge is earned
   */
  private isBadgeEarned(
    badge: BadgeDefinition,
    result: TestResult,
    userStats: GamificationStats,
    streakData: StreakData
  ): boolean {
    return badge.requirements.every(req => {
      switch (req.type) {
        case 'accuracy':
          return result.accuracy >= req.value;
        case 'speed':
          return result.averageResponseTime <= req.value * 1000;
        case 'streak':
          return streakData.currentStreak >= req.value;
        case 'domain_mastery':
          if (req.domain) {
            const domainAnalysis = result.domainMastery[req.domain];
            return domainAnalysis && domainAnalysis.abilityEstimate >= req.value;
          }
          return false;
        case 'total_tests':
          return userStats.testsCompleted >= req.value;
        case 'perfect_score':
          return result.accuracy === 100;
        case 'time_limit':
          return result.completionTime <= req.value;
        default:
          return false;
      }
    });
  }

  /**
   * Update achievement progress
   */
  updateAchievementProgress(
    userId: string,
    result: TestResult,
    userStats: GamificationStats
  ): Array<{ achievementId: string; tierCompleted: number; xpEarned: number }> {
    const completedAchievements: Array<{ achievementId: string; tierCompleted: number; xpEarned: number }> = [];
    
    this.achievementDefinitions.forEach((achievement, achievementId) => {
      const progress = this.calculateAchievementProgress(achievement, result, userStats);
      
      achievement.tiers.forEach(tier => {
        if (progress >= tier.requirement) {
          completedAchievements.push({
            achievementId,
            tierCompleted: tier.level,
            xpEarned: tier.xpReward
          });
        }
      });
    });
    
    return completedAchievements;
  }

  /**
   * Calculate progress for a specific achievement
   */
  private calculateAchievementProgress(
    achievement: AchievementDefinition,
    result: TestResult,
    userStats: GamificationStats
  ): number {
    switch (achievement.type) {
      case 'progressive':
        return userStats.testsCompleted;
      case 'milestone':
        return userStats.totalXP;
      case 'challenge':
        if (achievement.category !== 'general') {
          const domainAnalysis = result.domainMastery[achievement.category as QuestionCategory];
          return domainAnalysis?.abilityEstimate || 0;
        }
        return result.estimatedIQ;
      default:
        return 0;
    }
  }

  /**
   * Initialize default badges
   */
  private initializeBadges(): void {
    const badges: BadgeDefinition[] = [
      {
        id: 'first_test',
        name: 'First Steps',
        description: 'Complete your first IQ test',
        icon: '🎯',
        rarity: 'common',
        category: 'general',
        requirements: [{ type: 'total_tests', value: 1 }],
        xpReward: 100,
        isSecret: false
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 100% accuracy on a test',
        icon: '💯',
        rarity: 'rare',
        category: 'achievement',
        requirements: [{ type: 'perfect_score', value: 1 }],
        xpReward: 500,
        isSecret: false
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a test with average response time under 10 seconds',
        icon: '⚡',
        rarity: 'epic',
        category: 'speed',
        requirements: [{ type: 'speed', value: 10 }],
        xpReward: 750,
        isSecret: false
      },
      {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintain a 7-day testing streak',
        icon: '🔥',
        rarity: 'epic',
        category: 'streak',
        requirements: [{ type: 'streak', value: 7 }],
        xpReward: 1000,
        isSecret: false
      },
      {
        id: 'pattern_genius',
        name: 'Pattern Genius',
        description: 'Master Pattern Recognition domain',
        icon: '🧩',
        rarity: 'legendary',
        category: QuestionCategory.PATTERN_RECOGNITION,
        requirements: [{ type: 'domain_mastery', value: 2.0, domain: QuestionCategory.PATTERN_RECOGNITION }],
        xpReward: 1500,
        isSecret: false
      },
      {
        id: 'einstein',
        name: 'Einstein',
        description: 'Achieve an IQ score of 160 or higher',
        icon: '🧠',
        rarity: 'mythic',
        category: 'achievement',
        requirements: [{ type: 'accuracy', value: 95 }],
        xpReward: 5000,
        isSecret: true
      }
    ];

    badges.forEach(badge => {
      this.badgeDefinitions.set(badge.id, badge);
    });
  }

  /**
   * Initialize default achievements
   */
  private initializeAchievements(): void {
    const achievements: AchievementDefinition[] = [
      {
        id: 'test_taker',
        name: 'Test Taker',
        description: 'Complete multiple IQ tests',
        icon: '📊',
        type: 'progressive',
        category: 'general',
        tiers: [
          { level: 1, name: 'Novice', requirement: 5, xpReward: 200 },
          { level: 2, name: 'Regular', requirement: 25, xpReward: 500 },
          { level: 3, name: 'Veteran', requirement: 100, xpReward: 1000 },
          { level: 4, name: 'Master', requirement: 500, xpReward: 2500 }
        ],
        isRepeatable: false
      },
      {
        id: 'xp_collector',
        name: 'XP Collector',
        description: 'Accumulate experience points',
        icon: '⭐',
        type: 'milestone',
        category: 'general',
        tiers: [
          { level: 1, name: 'Starter', requirement: 1000, xpReward: 100 },
          { level: 2, name: 'Intermediate', requirement: 10000, xpReward: 500 },
          { level: 3, name: 'Advanced', requirement: 50000, xpReward: 1000 },
          { level: 4, name: 'Expert', requirement: 100000, xpReward: 2000 }
        ],
        isRepeatable: false
      }
    ];

    achievements.forEach(achievement => {
      this.achievementDefinitions.set(achievement.id, achievement);
    });
  }

  /**
   * Helper methods
   */
  private createInitialDomainMastery(domain: QuestionCategory): DomainMastery {
    return {
      domain,
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      masteryPercentage: 0,
      strengths: [],
      weaknesses: [],
      recentPerformance: [],
      averageAccuracy: 0,
      averageSpeed: 0,
      totalQuestions: 0
    };
  }

  private calculateDomainAccuracy(result: TestResult, domain: QuestionCategory): number {
    const domainScore = result.categoryScores.find(score => score.category === domain);
    return domainScore?.accuracy || 0;
  }

  private calculateDomainSpeed(result: TestResult, domain: QuestionCategory): number {
    const domainScore = result.categoryScores.find(score => score.category === domain);
    return domainScore?.averageResponseTime || 0;
  }

  private onDomainLevelUp(userId: string, domain: QuestionCategory, newLevel: number): void {
    // Trigger level up events, notifications, etc.
    console.log(`User ${userId} leveled up in ${domain} to level ${newLevel}`);
  }

  /**
   * Data persistence
   */
  private loadStoredData(): void {
    try {
      const badgesData = localStorage.getItem('gamification_badges');
      if (badgesData) {
        const parsed = JSON.parse(badgesData);
        Object.entries(parsed).forEach(([key, value]) => {
          this.badgeDefinitions.set(key, value as BadgeDefinition);
        });
      }
    } catch (error) {
      console.warn('Failed to load gamification data:', error);
    }
  }

  private saveData(): void {
    try {
      const badgesData = Object.fromEntries(this.badgeDefinitions);
      localStorage.setItem('gamification_badges', JSON.stringify(badgesData));
    } catch (error) {
      console.warn('Failed to save gamification data:', error);
    }
  }

  /**
   * Public API methods
   */
  getBadgeDefinitions(): BadgeDefinition[] {
    return Array.from(this.badgeDefinitions.values());
  }

  getAchievementDefinitions(): AchievementDefinition[] {
    return Array.from(this.achievementDefinitions.values());
  }

  getBadgeById(badgeId: string): BadgeDefinition | undefined {
    return this.badgeDefinitions.get(badgeId);
  }

  getAchievementById(achievementId: string): AchievementDefinition | undefined {
    return this.achievementDefinitions.get(achievementId);
  }
}

export const gamificationEngine = new GamificationEngine(); 
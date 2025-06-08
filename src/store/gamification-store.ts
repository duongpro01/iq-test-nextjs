import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  UserProfile, 
  Badge, 
  Achievement, 
  IQChallenge, 
  Leaderboard, 
  LeaderboardEntry,
  ProgressionSystem,
  CognitiveWeakness,
  TrainingRecommendation,
  UserPreferences,
  AccessibilityMode,
  UserAnswer,
  QuestionCategory
} from '@/types';

interface GamificationStore {
  // User profile and progression
  userProfile: UserProfile | null;
  progressionSystem: ProgressionSystem | null;
  
  // Challenges and leaderboards
  activeChallenges: IQChallenge[];
  leaderboards: Record<string, Leaderboard>;
  
  // Achievements and badges
  availableAchievements: Achievement[];
  availableBadges: Badge[];
  
  // AI insights
  cognitiveWeaknesses: CognitiveWeakness[];
  trainingRecommendations: TrainingRecommendation[];
  
  // Actions
  initializeProfile: (username?: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number, source: string) => void;
  unlockAchievement: (achievementId: string) => void;
  awardBadge: (badgeId: string) => void;
  updateStreak: () => void;
  
  // Challenge actions
  joinChallenge: (challengeId: string) => void;
  completeChallenge: (challengeId: string, score: number) => void;
  
  // Leaderboard actions
  updateLeaderboard: (type: string, entry: LeaderboardEntry) => void;
  getLeaderboardRank: (type: string, score: number) => number;
  
  // Preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateAccessibilityMode: (mode: Partial<AccessibilityMode>) => void;
  
  // Analytics
  trackEngagement: (action: string, metadata?: Record<string, unknown>) => void;
  analyzeCognitiveWeaknesses: (testResults: UserAnswer[]) => void;
  generateRecommendations: () => void;
}

const defaultAccessibilityMode: AccessibilityMode = {
  dyslexiaFriendly: false,
  highContrast: false,
  reducedMotion: false,
  screenReaderOptimized: false,
  colorBlindSupport: false,
  fontSize: 'medium'
};

const defaultPreferences: UserPreferences = {
  animations: true,
  soundEffects: true,
  hapticFeedback: true,
  showHints: false,
  difficultyPreference: 'adaptive',
  accessibilityMode: defaultAccessibilityMode,
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const calculateLevel = (totalXP: number): number => {
  // Level formula: level = floor(sqrt(totalXP / 100))
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

const calculateXPForNextLevel = (currentLevel: number): number => {
  // XP needed for next level: (level^2) * 100
  return (currentLevel * currentLevel) * 100;
};

const defaultAchievements: Achievement[] = [
  {
    id: 'first_test',
    name: 'First Steps',
    description: 'Complete your first IQ test',
    progress: 0,
    target: 1,
    isCompleted: false,
    type: 'accuracy'
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Achieve 100% accuracy on any test',
    progress: 0,
    target: 1,
    isCompleted: false,
    type: 'accuracy'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a test in under 15 minutes',
    progress: 0,
    target: 1,
    isCompleted: false,
    type: 'speed'
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 7-day testing streak',
    progress: 0,
    target: 7,
    isCompleted: false,
    type: 'streak'
  },
  {
    id: 'domain_expert',
    name: 'Domain Expert',
    description: 'Achieve mastery in all cognitive domains',
    progress: 0,
    target: 5,
    isCompleted: false,
    type: 'domain'
  }
];

const defaultBadges: Badge[] = [
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'Welcome to the IQ testing community!',
    icon: '🌟',
    rarity: 'common',
    unlockedAt: new Date(),
    category: 'general'
  },
  {
    id: 'pattern_master',
    name: 'Pattern Master',
    description: 'Excel in pattern recognition',
    icon: '🧩',
    rarity: 'rare',
    unlockedAt: new Date(),
    category: QuestionCategory.PATTERN_RECOGNITION
  },
  {
    id: 'spatial_genius',
    name: 'Spatial Genius',
    description: 'Master of spatial reasoning',
    icon: '🎯',
    rarity: 'epic',
    unlockedAt: new Date(),
    category: QuestionCategory.SPATIAL_REASONING
  }
];

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      userProfile: null,
      progressionSystem: null,
      activeChallenges: [],
      leaderboards: {},
      availableAchievements: defaultAchievements,
      availableBadges: defaultBadges,
      cognitiveWeaknesses: [],
      trainingRecommendations: [],

      initializeProfile: (username?: string) => {
        const userId = generateUserId();
        const now = new Date();
        
        const newProfile: UserProfile = {
          id: userId,
          username,
          level: 1,
          totalPoints: 0,
          streakDays: 0,
          maxStreak: 0,
          badges: [defaultBadges[0]], // Award newcomer badge
          achievements: [],
          domainLevels: {
            [QuestionCategory.PATTERN_RECOGNITION]: 1,
            [QuestionCategory.SPATIAL_REASONING]: 1,
            [QuestionCategory.LOGICAL_DEDUCTION]: 1,
            [QuestionCategory.SHORT_TERM_MEMORY]: 1,
            [QuestionCategory.NUMERICAL_REASONING]: 1
          },
          createdAt: now,
          lastActive: now,
          preferences: defaultPreferences
        };

        const progressionSystem: ProgressionSystem = {
          currentLevel: 1,
          currentXP: 0,
          xpToNextLevel: 100,
          totalXP: 0,
          levelBenefits: [
            { level: 1, benefit: 'Basic testing access', unlocked: true },
            { level: 5, benefit: 'Advanced analytics', unlocked: false },
            { level: 10, benefit: 'Custom challenges', unlocked: false },
            { level: 20, benefit: 'Mentor status', unlocked: false }
          ]
        };

        set({ 
          userProfile: newProfile, 
          progressionSystem,
          availableAchievements: defaultAchievements.map(a => ({ ...a }))
        });
      },

      updateProfile: (updates) => {
        set(state => ({
          userProfile: state.userProfile ? {
            ...state.userProfile,
            ...updates,
            lastActive: new Date()
          } : null
        }));
      },

      addXP: (amount, source) => {
        set(state => {
          if (!state.userProfile || !state.progressionSystem) return state;

          const newTotalXP = state.progressionSystem.totalXP + amount;
          const newLevel = calculateLevel(newTotalXP);
          const leveledUp = newLevel > state.progressionSystem.currentLevel;
          
          const updatedProgression: ProgressionSystem = {
            ...state.progressionSystem,
            totalXP: newTotalXP,
            currentXP: newTotalXP - ((newLevel - 1) * (newLevel - 1) * 100),
            currentLevel: newLevel,
            xpToNextLevel: calculateXPForNextLevel(newLevel),
            levelBenefits: state.progressionSystem.levelBenefits.map(benefit => ({
              ...benefit,
              unlocked: benefit.level <= newLevel
            }))
          };

          const updatedProfile: UserProfile = {
            ...state.userProfile,
            level: newLevel,
            totalPoints: state.userProfile.totalPoints + amount,
            lastActive: new Date()
          };

          // Track engagement
          get().trackEngagement('xp_gained', { amount, source, leveledUp });

          return {
            userProfile: updatedProfile,
            progressionSystem: updatedProgression
          };
        });
      },

      unlockAchievement: (achievementId) => {
        set(state => {
          if (!state.userProfile) return state;

          const achievement = state.availableAchievements.find(a => a.id === achievementId);
          if (!achievement || achievement.isCompleted) return state;

          const updatedAchievement = {
            ...achievement,
            isCompleted: true,
            completedAt: new Date()
          };

          const updatedAchievements = state.availableAchievements.map(a =>
            a.id === achievementId ? updatedAchievement : a
          );

          const updatedProfile = {
            ...state.userProfile,
            achievements: [...state.userProfile.achievements, updatedAchievement]
          };

          // Award XP for achievement
          get().addXP(50, `achievement_${achievementId}`);

          return {
            userProfile: updatedProfile,
            availableAchievements: updatedAchievements
          };
        });
      },

      awardBadge: (badgeId) => {
        set(state => {
          if (!state.userProfile) return state;

          const badge = state.availableBadges.find(b => b.id === badgeId);
          if (!badge) return state;

          const alreadyHasBadge = state.userProfile.badges.some(b => b.id === badgeId);
          if (alreadyHasBadge) return state;

          const awardedBadge = {
            ...badge,
            unlockedAt: new Date()
          };

          const updatedProfile = {
            ...state.userProfile,
            badges: [...state.userProfile.badges, awardedBadge]
          };

          // Award XP based on badge rarity
          const xpReward = {
            common: 25,
            rare: 50,
            epic: 100,
            legendary: 200
          }[badge.rarity];

          get().addXP(xpReward, `badge_${badgeId}`);

          return { userProfile: updatedProfile };
        });
      },

      updateStreak: () => {
        set(state => {
          if (!state.userProfile) return state;

          const today = new Date().toDateString();
          const lastActive = state.userProfile.lastActive.toDateString();
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

          let newStreakDays = state.userProfile.streakDays;

          if (lastActive === yesterday) {
            // Continuing streak
            newStreakDays += 1;
          } else if (lastActive !== today) {
            // Streak broken
            newStreakDays = 1;
          }

          const updatedProfile = {
            ...state.userProfile,
            streakDays: newStreakDays,
            maxStreak: Math.max(state.userProfile.maxStreak, newStreakDays),
            lastActive: new Date()
          };

          // Check streak achievements
          if (newStreakDays >= 7) {
            get().unlockAchievement('streak_master');
          }

          return { userProfile: updatedProfile };
        });
      },

      joinChallenge: (challengeId) => {
        // Implementation for joining challenges
        get().trackEngagement('challenge_joined', { challengeId });
      },

      completeChallenge: (challengeId, score) => {
        // Implementation for completing challenges
        get().addXP(100, `challenge_${challengeId}`);
        get().trackEngagement('challenge_completed', { challengeId, score });
      },

      updateLeaderboard: (type, entry) => {
        set(state => ({
          leaderboards: {
            ...state.leaderboards,
            [type]: {
              ...state.leaderboards[type],
              entries: [...(state.leaderboards[type]?.entries || []), entry]
                .sort((a, b) => b.score - a.score)
                .slice(0, 100) // Keep top 100
            }
          }
        }));
      },

      getLeaderboardRank: (type, score) => {
        const leaderboard = get().leaderboards[type];
        if (!leaderboard) return 1;
        
        const rank = leaderboard.entries.filter(entry => entry.score > score).length + 1;
        return rank;
      },

      updatePreferences: (preferences) => {
        set(state => ({
          userProfile: state.userProfile ? {
            ...state.userProfile,
            preferences: {
              ...state.userProfile.preferences,
              ...preferences
            }
          } : null
        }));
      },

      updateAccessibilityMode: (mode) => {
        set(state => ({
          userProfile: state.userProfile ? {
            ...state.userProfile,
            preferences: {
              ...state.userProfile.preferences,
              accessibilityMode: {
                ...state.userProfile.preferences.accessibilityMode,
                ...mode
              }
            }
          } : null
        }));
      },

      trackEngagement: (action, metadata = {}) => {
        // Analytics tracking implementation
        const event = {
          action,
          timestamp: new Date(),
          userId: get().userProfile?.id,
          metadata
        };
        
        // Store in local analytics or send to analytics service
        console.log('Engagement tracked:', event);
      },

      analyzeCognitiveWeaknesses: (_testResults: UserAnswer[]) => {
        // AI-powered analysis of cognitive weaknesses
        // This would integrate with your IRT engine
        const weaknesses: CognitiveWeakness[] = [];
        
        // Analyze patterns in wrong answers by domain
        // Generate severity scores and recommendations
        
        set({ cognitiveWeaknesses: weaknesses });
      },

      generateRecommendations: () => {
        const { cognitiveWeaknesses } = get();
        const recommendations: TrainingRecommendation[] = [];

        cognitiveWeaknesses.forEach(weakness => {
          switch (weakness.domain) {
            case QuestionCategory.PATTERN_RECOGNITION:
              recommendations.push({
                type: 'mini-game',
                title: 'Pattern Puzzle Challenge',
                description: 'Interactive pattern completion exercises',
                estimatedTime: 10,
                difficulty: 3,
                targetSkills: ['sequence recognition', 'pattern completion']
              });
              break;
            // Add more domain-specific recommendations
          }
        });

        set({ trainingRecommendations: recommendations });
      }
    }),
    {
      name: 'gamification-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        progressionSystem: state.progressionSystem,
        leaderboards: state.leaderboards
      })
    }
  )
); 
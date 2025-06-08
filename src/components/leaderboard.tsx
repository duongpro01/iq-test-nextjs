"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Globe, 
  Calendar,
  Clock,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { useGamificationStore } from '@/store/gamification-store';
import { Leaderboard as LeaderboardType, LeaderboardEntry } from '@/types';

interface LeaderboardProps {
  onClose?: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [selectedTab, setSelectedTab] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    leaderboards, 
    userProfile,
    updateLeaderboard,
    getLeaderboardRank,
    trackEngagement
  } = useGamificationStore();

  useEffect(() => {
    trackEngagement('leaderboard_viewed', { tab: selectedTab });
  }, [selectedTab, trackEngagement]);

  // Mock data for demonstration - in real app, this would come from API
  const mockLeaderboards: Record<string, LeaderboardType> = {
    daily: {
      type: 'daily',
      entries: [
        { rank: 1, username: 'CognitiveAce', score: 156, timeCompleted: 847, country: 'US' },
        { rank: 2, username: 'BrainMaster', score: 152, timeCompleted: 923, country: 'CA' },
        { rank: 3, username: 'LogicLord', score: 148, timeCompleted: 756, country: 'UK' },
        { rank: 4, username: 'PatternPro', score: 145, timeCompleted: 1034, country: 'DE' },
        { rank: 5, username: 'SpatialSage', score: 142, timeCompleted: 892, country: 'AU' },
        { rank: 6, username: 'QuickThinker', score: 140, timeCompleted: 678, country: 'JP' },
        { rank: 7, username: 'MindBender', score: 138, timeCompleted: 945, country: 'FR' },
        { rank: 8, username: 'IQChampion', score: 135, timeCompleted: 1123, country: 'BR' },
        { rank: 9, username: 'ThoughtLeader', score: 133, timeCompleted: 867, country: 'IN' },
        { rank: 10, username: 'BrainStorm', score: 130, timeCompleted: 1245, country: 'KR' }
      ],
      lastUpdated: new Date(),
      totalParticipants: 1247
    },
    weekly: {
      type: 'weekly',
      entries: [
        { rank: 1, username: 'WeeklyWinner', score: 159, timeCompleted: 723, country: 'US' },
        { rank: 2, username: 'ConsistentGenius', score: 157, timeCompleted: 834, country: 'UK' },
        { rank: 3, username: 'SteadyMind', score: 154, timeCompleted: 912, country: 'CA' }
      ],
      lastUpdated: new Date(),
      totalParticipants: 5432
    },
    monthly: {
      type: 'monthly',
      entries: [
        { rank: 1, username: 'MonthlyMaster', score: 162, timeCompleted: 645, country: 'DE' },
        { rank: 2, username: 'TopPerformer', score: 160, timeCompleted: 789, country: 'JP' },
        { rank: 3, username: 'EliteThink', score: 158, timeCompleted: 856, country: 'AU' }
      ],
      lastUpdated: new Date(),
      totalParticipants: 12847
    },
    allTime: {
      type: 'allTime',
      entries: [
        { rank: 1, username: 'LegendaryMind', score: 165, timeCompleted: 567, country: 'US' },
        { rank: 2, username: 'IQGrandmaster', score: 163, timeCompleted: 623, country: 'UK' },
        { rank: 3, username: 'CognitiveLegend', score: 161, timeCompleted: 698, country: 'CA' }
      ],
      lastUpdated: new Date(),
      totalParticipants: 45623
    }
  };

  const currentLeaderboard = leaderboards[selectedTab] || mockLeaderboards[selectedTab];
  const userRank = userProfile ? getLeaderboardRank(selectedTab, userProfile.totalPoints) : null;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸', 'UK': '🇬🇧', 'CA': '🇨🇦', 'DE': '🇩🇪', 'AU': '🇦🇺',
      'JP': '🇯🇵', 'FR': '🇫🇷', 'BR': '🇧🇷', 'IN': '🇮🇳', 'KR': '🇰🇷'
    };
    return flags[country] || '🌍';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const tabIcons = {
    daily: <Calendar className="w-4 h-4" />,
    weekly: <TrendingUp className="w-4 h-4" />,
    monthly: <Clock className="w-4 h-4" />,
    allTime: <Globe className="w-4 h-4" />
  };

  const entryVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.02,
      x: 5,
      transition: { duration: 0.2 }
    }
  };

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
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold">Global Leaderboard</h1>
                <p className="text-muted-foreground">Compete with the world's brightest minds</p>
              </div>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Back to Test
              </Button>
            )}
          </div>

          {/* User Stats */}
          {userProfile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{userProfile.username || 'Anonymous'}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Level {userProfile.level}</span>
                          <span>{userProfile.totalPoints} XP</span>
                          {userRank && <span>Rank #{userRank}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{userProfile.streakDays} day streak</span>
                      </div>
                      <Badge variant="secondary">
                        {userProfile.badges.length} badges earned
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Leaderboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="daily" className="flex items-center space-x-2">
                {tabIcons.daily}
                <span>Daily</span>
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center space-x-2">
                {tabIcons.weekly}
                <span>Weekly</span>
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center space-x-2">
                {tabIcons.monthly}
                <span>Monthly</span>
              </TabsTrigger>
              <TabsTrigger value="allTime" className="flex items-center space-x-2">
                {tabIcons.allTime}
                <span>All Time</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {['daily', 'weekly', 'monthly', 'allTime'].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            {tabIcons[tab as keyof typeof tabIcons]}
                            <span>
                              {tab === 'allTime' ? 'All Time' : tab.charAt(0).toUpperCase() + tab.slice(1)} Rankings
                            </span>
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{currentLeaderboard?.totalParticipants.toLocaleString()} participants</span>
                            </div>
                            <span>Updated {currentLeaderboard?.lastUpdated.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <AnimatePresence>
                            {currentLeaderboard?.entries.map((entry, index) => (
                              <motion.div
                                key={`${entry.username}-${entry.rank}`}
                                custom={index}
                                variants={entryVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                className={`p-4 rounded-lg border transition-all duration-200 ${
                                  entry.isCurrentUser 
                                    ? 'bg-primary/10 border-primary/30' 
                                    : 'bg-card hover:bg-muted/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                      {getRankIcon(entry.rank)}
                                      <Badge variant={getRankBadgeVariant(entry.rank)}>
                                        #{entry.rank}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <span className="text-lg">{getCountryFlag(entry.country || 'US')}</span>
                                      <div>
                                        <div className="font-semibold flex items-center space-x-2">
                                          <span>{entry.username}</span>
                                          {entry.isCurrentUser && (
                                            <Badge variant="secondary" className="text-xs">You</Badge>
                                          )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          Completed in {formatTime(entry.timeCompleted)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">
                                      {entry.score}
                                    </div>
                                    <div className="text-xs text-muted-foreground">IQ Score</div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        {/* Load More Button */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center mt-6"
                        >
                          <Button 
                            variant="outline" 
                            onClick={() => setIsLoading(true)}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Loading...' : 'Load More Rankings'}
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Challenge Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Daily Challenge</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete today's special challenge to earn bonus XP and climb the rankings!
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <Badge variant="secondary">+100 XP Bonus</Badge>
                    <Badge variant="outline">Limited Time</Badge>
                    <span className="text-muted-foreground">Ends in 14:32:18</span>
                  </div>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Globe, Clock, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { leaderboardEngine, LeaderboardEntry, LeaderboardStats } from '@/lib/leaderboard-engine';

interface EnhancedLeaderboardProps {
  currentUserId?: string;
  showCountryFilter?: boolean;
  showStats?: boolean;
  maxEntries?: number;
}

const RANK_ICONS = {
  1: Trophy,
  2: Medal,
  3: Award
};

const RANK_COLORS = {
  1: 'text-yellow-500',
  2: 'text-gray-400',
  3: 'text-amber-600'
};

const TIME_PERIODS = [
  { value: 'daily', label: 'Today', icon: Clock },
  { value: 'weekly', label: 'This Week', icon: TrendingUp },
  { value: 'monthly', label: 'This Month', icon: Users },
  { value: 'allTime', label: 'All Time', icon: Globe }
] as const;

const COUNTRIES = [
  { code: 'all', name: 'All Countries', flag: '🌍' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' }
];

export function EnhancedLeaderboard({
  currentUserId,
  showCountryFilter = true,
  showStats = true,
  maxEntries = 50
}: EnhancedLeaderboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'allTime'>('daily');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<{
    entries: LeaderboardEntry[];
    stats: LeaderboardStats;
    userRank?: number;
    totalPages: number;
  } | null>(null);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = leaderboardEngine.getLeaderboard(selectedPeriod, {
        page: currentPage,
        limit: maxEntries,
        country: selectedCountry === 'all' ? undefined : selectedCountry,
        includeUser: currentUserId
      });
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedPeriod, selectedCountry, currentPage]);

  // Auto-refresh every 30 seconds for daily leaderboard
  useEffect(() => {
    if (selectedPeriod === 'daily') {
      const interval = setInterval(fetchLeaderboard, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedPeriod]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatScore = (score: number): string => {
    return Math.round(score).toString();
  };

  const getCountryFlag = (countryCode: string): string => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    return country?.flag || '🌍';
  };

  const getRankIcon = (rank: number) => {
    const IconComponent = RANK_ICONS[rank as keyof typeof RANK_ICONS];
    if (IconComponent) {
      const colorClass = RANK_COLORS[rank as keyof typeof RANK_COLORS];
      return <IconComponent className={`w-5 h-5 ${colorClass}`} />;
    }
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const currentPeriod = TIME_PERIODS.find(p => p.value === selectedPeriod);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {currentPeriod && <currentPeriod.icon className="w-6 h-6 text-primary" />}
          <h2 className="text-2xl font-bold">Global Leaderboard</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {showCountryFilter && (
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-[180px] px-3 py-2 border rounded-md"
            >
              {COUNTRIES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          )}
          
          <Button
            onClick={fetchLeaderboard}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Time Period Tabs */}
      <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as typeof selectedPeriod)}>
        <TabsList className="grid w-full grid-cols-4">
          {TIME_PERIODS.map(period => (
            <TabsTrigger key={period.value} value={period.value} className="flex items-center gap-2">
              <period.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{period.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TIME_PERIODS.map(period => (
          <TabsContent key={period.value} value={period.value} className="space-y-4">
            {/* Stats Cards */}
            {showStats && leaderboardData?.stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Participants</span>
                    </div>
                    <p className="text-2xl font-bold">{leaderboardData.stats.totalEntries.toLocaleString()}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Average Score</span>
                    </div>
                    <p className="text-2xl font-bold">{formatScore(leaderboardData.stats.averageScore)}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Top Score</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {leaderboardData.entries[0] ? formatScore(leaderboardData.entries[0].score) : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Countries</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {Object.keys(leaderboardData.stats.countryDistribution).length}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* User Rank Card */}
            {currentUserId && leaderboardData?.userRank && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getRankIcon(leaderboardData.userRank)}
                          <span className="font-semibold">Your Rank</span>
                        </div>
                        <Badge variant="secondary">#{leaderboardData.userRank}</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.ceil((leaderboardData.userRank || 1) / maxEntries))}>
                        View My Position
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Leaderboard Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {period.label} Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading rankings...</p>
                  </div>
                ) : leaderboardData?.entries.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No entries found for this period.</p>
                    <p className="text-sm">Be the first to take the test!</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    <AnimatePresence mode="popLayout">
                      {leaderboardData?.entries.map((entry, index) => {
                        const rank = (currentPage - 1) * maxEntries + index + 1;
                        const isCurrentUser = entry.anonymousId === currentUserId;
                        
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 hover:bg-muted/50 transition-colors ${
                              isCurrentUser ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 min-w-[60px]">
                                  {getRankIcon(rank)}
                                  {rank > 3 && <span className="text-sm font-medium">#{rank}</span>}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                    <span className="text-xs font-bold">
                                      {entry.anonymousId.substring(0, 2).toUpperCase()}
                                    </span>
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {isCurrentUser ? 'You' : `User ${entry.anonymousId.substring(0, 6)}`}
                                      </span>
                                      {entry.isVerified && (
                                        <Badge variant="secondary" className="text-xs">
                                          Verified
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{getCountryFlag(entry.country)} {entry.country}</span>
                                      <span>•</span>
                                      <span>{formatTime(entry.timeCompleted)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-xl font-bold">{formatScore(entry.score)}</div>
                                <div className="text-sm text-muted-foreground">
                                  {entry.percentile}th percentile
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {leaderboardData && leaderboardData.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, leaderboardData.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(leaderboardData.totalPages, currentPage + 1))}
                  disabled={currentPage === leaderboardData.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 
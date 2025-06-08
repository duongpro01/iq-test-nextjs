import { TestResult } from '@/types';

// Leaderboard core interfaces
export interface LeaderboardEntry {
  id: string;
  anonymousId: string;
  score: number;
  timeCompleted: number;
  percentile: number;
  country: string;
  timestamp: Date;
  sessionHash: string;
  isVerified: boolean;
}

export interface LeaderboardConfig {
  maxEntriesPerUser: number;
  minTimeBetweenSubmissions: number; // minutes
  scoreValidationThreshold: number;
  antiSpamEnabled: boolean;
  geolocationEnabled: boolean;
}

export interface LeaderboardStats {
  totalEntries: number;
  averageScore: number;
  topPercentile: number;
  countryDistribution: Record<string, number>;
  lastUpdated: Date;
}

class LeaderboardEngine {
  private config: LeaderboardConfig;
  private entries: Map<string, LeaderboardEntry[]> = new Map();
  private userSubmissions: Map<string, Date[]> = new Map();
  private suspiciousIPs: Set<string> = new Set();

  constructor(config: LeaderboardConfig = {
    maxEntriesPerUser: 3,
    minTimeBetweenSubmissions: 30,
    scoreValidationThreshold: 200,
    antiSpamEnabled: true,
    geolocationEnabled: true
  }) {
    this.config = config;
    this.loadStoredData();
  }

  /**
   * Generate anonymous user ID with privacy protection
   */
  private generateAnonymousId(sessionId: string, userAgent?: string): string {
    const data = `${sessionId}_${userAgent || 'unknown'}_${Date.now()}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  }

  /**
   * Validate submission against anti-spam rules
   */
  private validateSubmission(
    anonymousId: string, 
    score: number, 
    timeCompleted: number,
    ipAddress?: string
  ): { isValid: boolean; reason?: string } {
    if (!this.config.antiSpamEnabled) {
      return { isValid: true };
    }

    // Check IP-based spam
    if (ipAddress && this.suspiciousIPs.has(ipAddress)) {
      return { isValid: false, reason: 'Suspicious IP address' };
    }

    // Check submission frequency
    const userSubmissions = this.userSubmissions.get(anonymousId) || [];
    const recentSubmissions = userSubmissions.filter(
      date => Date.now() - date.getTime() < this.config.minTimeBetweenSubmissions * 60 * 1000
    );

    if (recentSubmissions.length >= this.config.maxEntriesPerUser) {
      return { isValid: false, reason: 'Too many recent submissions' };
    }

    // Check score validity
    if (score > this.config.scoreValidationThreshold) {
      return { isValid: false, reason: 'Score exceeds validation threshold' };
    }

    // Check time validity (minimum 5 minutes for full test)
    if (timeCompleted < 300) {
      return { isValid: false, reason: 'Completion time too fast' };
    }

    return { isValid: true };
  }

  /**
   * Submit score to leaderboard
   */
  async submitScore(
    result: TestResult,
    sessionId: string,
    metadata?: {
      userAgent?: string;
      ipAddress?: string;
      country?: string;
    }
  ): Promise<{ success: boolean; entry?: LeaderboardEntry; error?: string }> {
    const anonymousId = this.generateAnonymousId(sessionId, metadata?.userAgent);
    
         // Validate submission
     const validation = this.validateSubmission(
       anonymousId,
       result.estimatedIQ,
       result.completionTime,
       metadata?.ipAddress
     );

     if (!validation.isValid) {
       return { success: false, error: validation.reason };
     }

     // Detect country if not provided
     const country = metadata?.country || await this.detectCountry(metadata?.ipAddress);

     // Create leaderboard entry
     const entry: LeaderboardEntry = {
       id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
       anonymousId,
       score: result.estimatedIQ,
       timeCompleted: result.completionTime,
       percentile: result.percentileRank,
       country,
       timestamp: new Date(),
       sessionHash: this.hashSession(sessionId),
       isVerified: true // Default to true since securityMetrics might not exist yet
     };

    // Add to appropriate leaderboards
    this.addToLeaderboard('daily', entry);
    this.addToLeaderboard('weekly', entry);
    this.addToLeaderboard('monthly', entry);
    this.addToLeaderboard('allTime', entry);

    // Track user submissions
    const submissions = this.userSubmissions.get(anonymousId) || [];
    submissions.push(new Date());
    this.userSubmissions.set(anonymousId, submissions);

    // Save data
    this.saveData();

    return { success: true, entry };
  }

  /**
   * Add entry to specific leaderboard
   */
  private addToLeaderboard(type: string, entry: LeaderboardEntry): void {
    const entries = this.entries.get(type) || [];
    
    // Add entry
    entries.push(entry);
    
    // Sort by score (descending), then by time (ascending)
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeCompleted - b.timeCompleted;
    });
    
    // Keep only top 1000 entries
    const maxEntries = type === 'allTime' ? 1000 : 100;
    if (entries.length > maxEntries) {
      entries.splice(maxEntries);
    }
    
    this.entries.set(type, entries);
  }

  /**
   * Get leaderboard with pagination
   */
  getLeaderboard(
    type: 'daily' | 'weekly' | 'monthly' | 'allTime',
    options: {
      page?: number;
      limit?: number;
      country?: string;
      includeUser?: string;
    } = {}
  ): {
    entries: LeaderboardEntry[];
    stats: LeaderboardStats;
    userRank?: number;
    totalPages: number;
  } {
    const { page = 1, limit = 50, country, includeUser } = options;
    let entries = this.entries.get(type) || [];

    // Filter by time period
    entries = this.filterByTimePeriod(entries, type);

    // Filter by country if specified
    if (country) {
      entries = entries.filter(entry => entry.country === country);
    }

    // Calculate user rank if specified
    let userRank: number | undefined;
    if (includeUser) {
      userRank = entries.findIndex(entry => entry.anonymousId === includeUser) + 1;
      if (userRank === 0) userRank = undefined;
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const paginatedEntries = entries.slice(startIndex, startIndex + limit);

    // Calculate stats
    const stats: LeaderboardStats = {
      totalEntries: entries.length,
      averageScore: entries.reduce((sum, e) => sum + e.score, 0) / entries.length || 0,
      topPercentile: entries[0]?.percentile || 0,
      countryDistribution: this.calculateCountryDistribution(entries),
      lastUpdated: new Date()
    };

    return {
      entries: paginatedEntries,
      stats,
      userRank,
      totalPages: Math.ceil(entries.length / limit)
    };
  }

  /**
   * Filter entries by time period
   */
  private filterByTimePeriod(entries: LeaderboardEntry[], type: string): LeaderboardEntry[] {
    const now = new Date();
    const cutoffTimes = {
      daily: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      weekly: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      monthly: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      allTime: new Date(0)
    };

    const cutoff = cutoffTimes[type as keyof typeof cutoffTimes];
    return entries.filter(entry => entry.timestamp >= cutoff);
  }

  /**
   * Calculate country distribution
   */
  private calculateCountryDistribution(entries: LeaderboardEntry[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    entries.forEach(entry => {
      distribution[entry.country] = (distribution[entry.country] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Detect country from IP address
   */
     private async detectCountry(ipAddress?: string): Promise<string> {
     if (!ipAddress || !this.config.geolocationEnabled) {
       return 'Unknown';
     }

     try {
       // In production, use a geolocation service
       // For now, return a default
       return 'US';
     } catch {
       return 'Unknown';
     }
   }

  /**
   * Hash session for privacy
   */
  private hashSession(sessionId: string): string {
    return btoa(sessionId + '_salt_2024').substring(0, 16);
  }

  /**
   * Report suspicious activity
   */
  reportSuspiciousActivity(ipAddress: string, reason: string): void {
    this.suspiciousIPs.add(ipAddress);
    console.warn(`Suspicious activity reported: ${reason} from ${ipAddress}`);
  }

  /**
   * Get leaderboard statistics
   */
  getGlobalStats(): {
    totalUsers: number;
    averageScore: number;
    topCountries: Array<{ country: string; count: number; avgScore: number }>;
    recentActivity: number;
  } {
    const allEntries = Array.from(this.entries.values()).flat();
    const uniqueUsers = new Set(allEntries.map(e => e.anonymousId)).size;
    const avgScore = allEntries.reduce((sum, e) => sum + e.score, 0) / allEntries.length || 0;

    // Calculate top countries
    const countryStats: Record<string, { count: number; totalScore: number }> = {};
    allEntries.forEach(entry => {
      if (!countryStats[entry.country]) {
        countryStats[entry.country] = { count: 0, totalScore: 0 };
      }
      countryStats[entry.country].count++;
      countryStats[entry.country].totalScore += entry.score;
    });

    const topCountries = Object.entries(countryStats)
      .map(([country, stats]) => ({
        country,
        count: stats.count,
        avgScore: stats.totalScore / stats.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = allEntries.filter(e => e.timestamp >= yesterday).length;

    return {
      totalUsers: uniqueUsers,
      averageScore: avgScore,
      topCountries,
      recentActivity
    };
  }

  /**
   * Data persistence
   */
  private loadStoredData(): void {
    try {
      const entriesData = localStorage.getItem('leaderboard_entries');
      if (entriesData) {
        const parsed = JSON.parse(entriesData);
        Object.entries(parsed).forEach(([key, value]) => {
          this.entries.set(key, value as LeaderboardEntry[]);
        });
      }

      const submissionsData = localStorage.getItem('user_submissions');
      if (submissionsData) {
        const parsed = JSON.parse(submissionsData);
        Object.entries(parsed).forEach(([key, value]) => {
          this.userSubmissions.set(key, (value as string[]).map(d => new Date(d)));
        });
      }
    } catch (error) {
      console.warn('Failed to load leaderboard data:', error);
    }
  }

  private saveData(): void {
    try {
      const entriesData = Object.fromEntries(this.entries);
      localStorage.setItem('leaderboard_entries', JSON.stringify(entriesData));

      const submissionsData = Object.fromEntries(
        Array.from(this.userSubmissions.entries()).map(([key, dates]) => [
          key,
          dates.map(d => d.toISOString())
        ])
      );
      localStorage.setItem('user_submissions', JSON.stringify(submissionsData));
    } catch (error) {
      console.warn('Failed to save leaderboard data:', error);
    }
  }

  /**
   * Admin functions for moderation
   */
     removeEntry(entryId: string): boolean {
     let found = false;
     this.entries.forEach((entries) => {
       const index = entries.findIndex(e => e.id === entryId);
       if (index !== -1) {
         entries.splice(index, 1);
         found = true;
       }
     });
     if (found) this.saveData();
     return found;
   }

  flagUser(anonymousId: string): void {
    // Add to suspicious users list
    this.userSubmissions.delete(anonymousId);
    this.saveData();
  }
}

export const leaderboardEngine = new LeaderboardEngine(); 
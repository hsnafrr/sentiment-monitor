import { 
  type User, type InsertUser,
  type Mention, type InsertMention,
  type Alert, type InsertAlert,
  type TrendData, type InsertTrendData
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mention operations
  getMentions(limit?: number): Promise<Mention[]>;
  createMention(mention: InsertMention): Promise<Mention>;
  getMentionsByPlatform(platform: string): Promise<Mention[]>;
  getMentionsByRegion(region: string): Promise<Mention[]>;
  
  // Alert operations
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, alert: Partial<Alert>): Promise<Alert | undefined>;
  getActiveAlerts(): Promise<Alert[]>;
  
  // Trend data operations
  getTrendData(hours?: number): Promise<TrendData[]>;
  createTrendData(trendData: InsertTrendData): Promise<TrendData>;
  getTrendsByPlatform(platform: string, hours?: number): Promise<TrendData[]>;
  
  // Analytics operations
  getSentimentSummary(): Promise<{
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  }>;
  getTopKeywords(limit?: number): Promise<{ keyword: string; count: number; sentiment: string }[]>;
  getRegionalSentiment(): Promise<{ region: string; sentiment: number; count: number }[]>;
}

class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private mentions: Map<string, Mention> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private trendData: Map<string, TrendData> = new Map();

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private initializeSampleData(): void {
    // Sample users
    const sampleUser: User = {
      id: this.generateId(),
      email: "analyst@example.com",
      name: "Social Media Analyst",
      role: "analyst",
      createdAt: new Date()
    };
    this.users.set(sampleUser.id, sampleUser);

    // Sample mentions
    const now = new Date();
    const sampleMentions: Mention[] = [
      {
        id: this.generateId(),
        platform: "twitter",
        postId: "tweet-1",
        author: "@user1",
        content: "Great product! Really enjoying the new features.",
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        language: "en",
        sentimentLabel: "positive",
        sentimentScore: 0.8,
        topic: "product feedback",
        region: "North America",
        metadata: { engagement: 120 }
      },
      {
        id: this.generateId(),
        platform: "instagram",
        postId: "post-2",
        author: "@user2",
        content: "Could be better, having some issues with the app.",
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        language: "en",
        sentimentLabel: "negative",
        sentimentScore: -0.6,
        topic: "app issues",
        region: "Europe",
        metadata: { engagement: 45 }
      },
      {
        id: this.generateId(),
        platform: "facebook",
        postId: "post-3",
        author: "user3",
        content: "Just tried the new update. It's okay, nothing special.",
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        language: "en",
        sentimentLabel: "neutral",
        sentimentScore: 0.1,
        topic: "update",
        region: "Asia",
        metadata: { engagement: 78 }
      }
    ];

    sampleMentions.forEach(mention => this.mentions.set(mention.id, mention));

    // Sample alerts
    const sampleAlert: Alert = {
      id: this.generateId(),
      name: "Negative Sentiment Spike",
      query: "sentiment:negative",
      threshold: 0.7,
      isActive: "true",
      lastTriggered: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000)
    };
    this.alerts.set(sampleAlert.id, sampleAlert);

    // Sample trend data
    const sampleTrend: TrendData = {
      id: this.generateId(),
      timestamp: new Date(),
      positiveCount: 12,
      negativeCount: 3,
      neutralCount: 8,
      averageScore: 0.3,
      platform: "twitter",
      region: "North America"
    };
    this.trendData.set(sampleTrend.id, sampleTrend);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.generateId(),
      role: "analyst",
      ...userData,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async getMentions(limit = 100): Promise<Mention[]> {
    return Array.from(this.mentions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createMention(mentionData: InsertMention): Promise<Mention> {
    const mention: Mention = {
      id: this.generateId(),
      language: "en",
      topic: null,
      region: null,
      metadata: null,
      ...mentionData,
      createdAt: new Date()
    };
    this.mentions.set(mention.id, mention);
    return mention;
  }

  async getMentionsByPlatform(platform: string): Promise<Mention[]> {
    return Array.from(this.mentions.values())
      .filter(mention => mention.platform === platform)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getMentionsByRegion(region: string): Promise<Mention[]> {
    return Array.from(this.mentions.values())
      .filter(mention => mention.region === region)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const alert: Alert = {
      id: this.generateId(),
      isActive: "true",
      ...alertData,
      lastTriggered: null,
      createdAt: new Date()
    };
    this.alerts.set(alert.id, alert);
    return alert;
  }

  async updateAlert(id: string, alertUpdate: Partial<Alert>): Promise<Alert | undefined> {
    const existing = this.alerts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...alertUpdate };
    this.alerts.set(id, updated);
    return updated;
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.isActive === "true")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTrendData(hours = 24): Promise<TrendData[]> {
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.trendData.values())
      .filter(trend => trend.timestamp >= hoursAgo)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createTrendData(trendDataInput: InsertTrendData): Promise<TrendData> {
    const trend: TrendData = {
      id: this.generateId(),
      timestamp: new Date(),
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      averageScore: 0,
      region: null,
      ...trendDataInput
    };
    this.trendData.set(trend.id, trend);
    return trend;
  }

  async getTrendsByPlatform(platform: string, hours = 24): Promise<TrendData[]> {
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.trendData.values())
      .filter(trend => trend.platform === platform && trend.timestamp >= hoursAgo)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getSentimentSummary(): Promise<{
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  }> {
    const mentions = Array.from(this.mentions.values());
    const positive = mentions.filter(m => m.sentimentLabel === 'positive').length;
    const negative = mentions.filter(m => m.sentimentLabel === 'negative').length;
    const neutral = mentions.filter(m => m.sentimentLabel === 'neutral').length;
    
    return {
      positive,
      negative,
      neutral,
      total: mentions.length
    };
  }

  async getTopKeywords(limit = 10): Promise<{ keyword: string; count: number; sentiment: string }[]> {
    const mentions = Array.from(this.mentions.values()).filter(m => m.topic);
    const keywordCounts = new Map<string, { count: number; sentiment: string }>();
    
    mentions.forEach(mention => {
      if (mention.topic) {
        const existing = keywordCounts.get(mention.topic);
        if (existing) {
          existing.count++;
        } else {
          keywordCounts.set(mention.topic, { count: 1, sentiment: mention.sentimentLabel });
        }
      }
    });
    
    return Array.from(keywordCounts.entries())
      .map(([keyword, data]) => ({ keyword, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async getRegionalSentiment(): Promise<{ region: string; sentiment: number; count: number }[]> {
    const mentions = Array.from(this.mentions.values()).filter(m => m.region);
    const regionData = new Map<string, { scores: number[]; count: number }>();
    
    mentions.forEach(mention => {
      if (mention.region) {
        const existing = regionData.get(mention.region);
        if (existing) {
          existing.scores.push(mention.sentimentScore);
          existing.count++;
        } else {
          regionData.set(mention.region, { scores: [mention.sentimentScore], count: 1 });
        }
      }
    });
    
    return Array.from(regionData.entries()).map(([region, data]) => ({
      region,
      sentiment: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
      count: data.count
    }));
  }
}

export const storage = new MemoryStorage();

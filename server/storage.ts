import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, mentions, alerts, trendData,
  type User, type InsertUser,
  type Mention, type InsertMention,
  type Alert, type InsertAlert,
  type TrendData, type InsertTrendData
} from "@shared/schema";
import { desc, eq, gte, sql } from "drizzle-orm";

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

class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    const client = postgres(process.env.DATABASE_URL);
    this.db = drizzle(client);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async getMentions(limit = 100): Promise<Mention[]> {
    return await this.db.select().from(mentions)
      .orderBy(desc(mentions.createdAt))
      .limit(limit);
  }

  async createMention(mention: InsertMention): Promise<Mention> {
    const result = await this.db.insert(mentions).values(mention).returning();
    return result[0];
  }

  async getMentionsByPlatform(platform: string): Promise<Mention[]> {
    return await this.db.select().from(mentions)
      .where(eq(mentions.platform, platform))
      .orderBy(desc(mentions.createdAt));
  }

  async getMentionsByRegion(region: string): Promise<Mention[]> {
    return await this.db.select().from(mentions)
      .where(eq(mentions.region, region))
      .orderBy(desc(mentions.createdAt));
  }

  async getAlerts(): Promise<Alert[]> {
    return await this.db.select().from(alerts)
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const result = await this.db.insert(alerts).values(alert).returning();
    return result[0];
  }

  async updateAlert(id: string, alertUpdate: Partial<Alert>): Promise<Alert | undefined> {
    const result = await this.db.update(alerts)
      .set(alertUpdate)
      .where(eq(alerts.id, id))
      .returning();
    return result[0];
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return await this.db.select().from(alerts)
      .where(eq(alerts.isActive, "true"))
      .orderBy(desc(alerts.createdAt));
  }

  async getTrendData(hours = 24): Promise<TrendData[]> {
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await this.db.select().from(trendData)
      .where(gte(trendData.timestamp, hoursAgo))
      .orderBy(desc(trendData.timestamp));
  }

  async createTrendData(trend: InsertTrendData): Promise<TrendData> {
    const result = await this.db.insert(trendData).values(trend).returning();
    return result[0];
  }

  async getTrendsByPlatform(platform: string, hours = 24): Promise<TrendData[]> {
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await this.db.select().from(trendData)
      .where(eq(trendData.platform, platform))
      .where(gte(trendData.timestamp, hoursAgo))
      .orderBy(desc(trendData.timestamp));
  }

  async getSentimentSummary(): Promise<{
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  }> {
    const result = await this.db
      .select({
        positive: sql<number>`count(*) filter (where sentiment_label = 'positive')`,
        negative: sql<number>`count(*) filter (where sentiment_label = 'negative')`,
        neutral: sql<number>`count(*) filter (where sentiment_label = 'neutral')`,
        total: sql<number>`count(*)`
      })
      .from(mentions);
    
    return result[0] || { positive: 0, negative: 0, neutral: 0, total: 0 };
  }

  async getTopKeywords(limit = 10): Promise<{ keyword: string; count: number; sentiment: string }[]> {
    // This is a simplified implementation - in practice, you'd want proper keyword extraction
    const result = await this.db
      .select({
        keyword: mentions.topic,
        count: sql<number>`count(*)`,
        sentiment: mentions.sentimentLabel
      })
      .from(mentions)
      .where(sql`topic is not null`)
      .groupBy(mentions.topic, mentions.sentimentLabel)
      .orderBy(sql`count(*) desc`)
      .limit(limit);
    
    return result;
  }

  async getRegionalSentiment(): Promise<{ region: string; sentiment: number; count: number }[]> {
    const result = await this.db
      .select({
        region: mentions.region,
        sentiment: sql<number>`avg(sentiment_score)`,
        count: sql<number>`count(*)`
      })
      .from(mentions)
      .where(sql`region is not null`)
      .groupBy(mentions.region);
    
    return result;
  }
}

export const storage = new DatabaseStorage();

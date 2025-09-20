import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("analyst"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const mentions = pgTable("mentions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(),
  postId: text("post_id").notNull(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  language: text("language").notNull().default("en"),
  sentimentLabel: text("sentiment_label").notNull(),
  sentimentScore: real("sentiment_score").notNull(),
  topic: text("topic"),
  region: text("region"),
  metadata: jsonb("metadata"),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  query: text("query").notNull(),
  threshold: real("threshold").notNull(),
  isActive: text("is_active").notNull().default("true"),
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const trendData = pgTable("trend_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  positiveCount: integer("positive_count").notNull().default(0),
  negativeCount: integer("negative_count").notNull().default(0),
  neutralCount: integer("neutral_count").notNull().default(0),
  averageScore: real("average_score").notNull().default(0),
  platform: text("platform").notNull(),
  region: text("region"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMentionSchema = createInsertSchema(mentions).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  lastTriggered: true,
});

export const insertTrendDataSchema = createInsertSchema(trendData).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMention = z.infer<typeof insertMentionSchema>;
export type Mention = typeof mentions.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertTrendData = z.infer<typeof insertTrendDataSchema>;
export type TrendData = typeof trendData.$inferSelect;

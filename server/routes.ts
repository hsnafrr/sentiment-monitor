import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSentiment, analyzeBatchSentiment } from "./services/sentiment";
import { insertMentionSchema, insertAlertSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Simple health check
      res.json({ 
        status: "operational", 
        timestamp: new Date().toISOString(),
        services: {
          database: "connected",
          ai: process.env.OPENAI_API_KEY ? "configured" : "fallback"
        }
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: (error as Error).message 
      });
    }
  });

  // Sentiment analysis endpoint
  app.post("/api/sentiment/analyze", async (req, res) => {
    try {
      const { texts } = req.body;
      
      if (!texts || !Array.isArray(texts)) {
        return res.status(400).json({ 
          error: "Missing or invalid 'texts' array in request body" 
        });
      }

      const results = await analyzeBatchSentiment(texts);
      res.json({ results });
    } catch (error) {
      res.status(500).json({ 
        error: "Sentiment analysis failed", 
        message: (error as Error).message 
      });
    }
  });

  // Get sentiment trends
  app.get("/api/sentiment/trends", async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const platform = req.query.platform as string;
      
      let trends;
      if (platform) {
        trends = await storage.getTrendsByPlatform(platform, hours);
      } else {
        trends = await storage.getTrendData(hours);
      }
      
      res.json({ trends });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch trends", 
        message: (error as Error).message 
      });
    }
  });

  // Get dashboard summary
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const [sentimentSummary, topKeywords, regionalSentiment, recentMentions] = await Promise.all([
        storage.getSentimentSummary(),
        storage.getTopKeywords(10),
        storage.getRegionalSentiment(),
        storage.getMentions(50)
      ]);

      res.json({
        sentiment: sentimentSummary,
        keywords: topKeywords,
        regional: regionalSentiment,
        recentMentions
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch dashboard summary", 
        message: (error as Error).message 
      });
    }
  });

  // Get alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json({ alerts });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch alerts", 
        message: (error as Error).message 
      });
    }
  });

  // Create alert
  app.post("/api/alerts", async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.json({ alert });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid alert data", 
          details: error.errors 
        });
      }
      res.status(500).json({ 
        error: "Failed to create alert", 
        message: (error as Error).message 
      });
    }
  });

  // Add mention (for testing/demo purposes)
  app.post("/api/mentions", async (req, res) => {
    try {
      const mentionData = insertMentionSchema.parse(req.body);
      
      // Analyze sentiment if not provided
      if (!mentionData.sentimentLabel || !mentionData.sentimentScore) {
        const sentiment = await analyzeSentiment(mentionData.content);
        mentionData.sentimentLabel = sentiment.label;
        mentionData.sentimentScore = sentiment.score;
      }
      
      const mention = await storage.createMention(mentionData);
      res.json({ mention });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid mention data", 
          details: error.errors 
        });
      }
      res.status(500).json({ 
        error: "Failed to create mention", 
        message: (error as Error).message 
      });
    }
  });

  // Get mentions
  app.get("/api/mentions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const platform = req.query.platform as string;
      const region = req.query.region as string;
      
      let mentions;
      if (platform) {
        mentions = await storage.getMentionsByPlatform(platform);
      } else if (region) {
        mentions = await storage.getMentionsByRegion(region);
      } else {
        mentions = await storage.getMentions(limit);
      }
      
      res.json({ mentions });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch mentions", 
        message: (error as Error).message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { apiRequest } from "./queryClient";

export interface SentimentResult {
  label: "positive" | "negative" | "neutral";
  score: number;
  confidence: number;
}

export interface DashboardSummary {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  };
  keywords: { keyword: string; count: number; sentiment: string }[];
  regional: { region: string; sentiment: number; count: number }[];
  recentMentions: any[];
}

export interface Alert {
  id: string;
  name: string;
  query: string;
  threshold: number;
  isActive: string;
  lastTriggered?: string;
  createdAt: string;
}

export interface TrendData {
  id: string;
  timestamp: string;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  averageScore: number;
  platform: string;
  region?: string;
}

export const api = {
  async analyzeSentiment(texts: string[]): Promise<{ results: SentimentResult[] }> {
    const response = await apiRequest("POST", "/api/sentiment/analyze", { texts });
    return response.json();
  },

  async getSentimentTrends(hours = 24, platform?: string): Promise<{ trends: TrendData[] }> {
    const params = new URLSearchParams({ hours: hours.toString() });
    if (platform) params.append("platform", platform);
    
    const response = await apiRequest("GET", `/api/sentiment/trends?${params}`);
    return response.json();
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await apiRequest("GET", "/api/dashboard/summary");
    return response.json();
  },

  async getAlerts(): Promise<{ alerts: Alert[] }> {
    const response = await apiRequest("GET", "/api/alerts");
    return response.json();
  },

  async createAlert(alert: { name: string; query: string; threshold: number }): Promise<{ alert: Alert }> {
    const response = await apiRequest("POST", "/api/alerts", alert);
    return response.json();
  },

  async getMentions(limit = 100, platform?: string, region?: string): Promise<{ mentions: any[] }> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (platform) params.append("platform", platform);
    if (region) params.append("region", region);
    
    const response = await apiRequest("GET", `/api/mentions?${params}`);
    return response.json();
  },

  async getHealth(): Promise<{ status: string; timestamp: string; services: any }> {
    const response = await apiRequest("GET", "/api/health");
    return response.json();
  }
};

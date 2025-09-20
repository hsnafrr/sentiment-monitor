import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SentimentChart } from "@/components/charts/sentiment-chart";
import { RadarChart } from "@/components/charts/radar-chart";
import { DossierCard } from "@/components/dossier-card";
import { AlertCard } from "@/components/alert-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ["/api/sentiment/trends"],
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/alerts"],
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (summaryLoading || trendsLoading || alertsLoading) {
    return (
      <div className="min-h-screen bg-secondary pt-16 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="font-orbitron text-lg text-muted-foreground">Initializing surveillance systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-orbitron font-bold text-3xl text-foreground mb-2">OPERATION DASHBOARD</h2>
            <p className="text-muted-foreground">Real-time intelligence surveillance system</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-card border border-border rounded-lg px-4 py-2">
              <span className="font-jetbrains text-sm text-muted-foreground">LAST UPDATE:</span>
              <span className="font-jetbrains text-sm text-foreground ml-2" data-testid="last-update">
                {new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' })} UTC
              </span>
            </div>
            <Button 
              onClick={handleRefresh}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              data-testid="button-refresh"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Intel
            </Button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Sentiment Trend Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-orbitron font-bold text-lg">SENTIMENT ANALYSIS TREND</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full pulse-red"></div>
                <span className="text-sm text-muted-foreground">Live Feed Active</span>
              </div>
            </div>
            
            {trends && Array.isArray(trends) && trends.length > 0 ? (
              <SentimentChart data={trends} />
            ) : (
              <div className="h-64 bg-background rounded border border-border flex items-center justify-center">
                <p className="text-muted-foreground">No trend data available</p>
              </div>
            )}

            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Negative</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Positive</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Neutral</span>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-orbitron font-bold text-lg">ACTIVE ALERTS</h3>
              <Activity className="text-primary pulse-red" />
            </div>
            
            <div className="space-y-3" data-testid="alerts-container">
              {alerts && Array.isArray(alerts) && alerts.length > 0 ? (
                alerts.slice(0, 3).map((alert: any) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    type={alert.threshold > 0.7 ? "high" : alert.threshold > 0.4 ? "medium" : "low"}
                    timeAgo={alert.lastTriggered ? formatTimeAgo(alert.lastTriggered) : "No activity"}
                    description={`Alert for: ${alert.query}`}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Radar Map */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-orbitron font-bold text-lg mb-6">GEOGRAPHICAL INTELLIGENCE</h3>
            
            {summary?.regional && Array.isArray(summary.regional) && summary.regional.length > 0 ? (
              <RadarChart regionalData={summary.regional} />
            ) : (
              <div className="h-64 bg-background rounded border border-border flex items-center justify-center">
                <p className="text-muted-foreground">No regional data available</p>
              </div>
            )}
          </div>

          {/* Top Keywords Dossier */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-orbitron font-bold text-lg mb-6">INTELLIGENCE DOSSIER</h3>
            
            <div className="space-y-4" data-testid="dossier-container">
              {summary?.keywords && Array.isArray(summary.keywords) && summary.keywords.length > 0 ? (
                summary.keywords.slice(0, 4).map((keyword: any, index: number) => (
                  <DossierCard
                    key={`${keyword.keyword}-${index}`}
                    keyword={keyword.keyword || `KEYWORD_${index + 1}`}
                    mentions={keyword.count || 0}
                    sentiment={keyword.sentiment as "positive" | "negative" | "neutral" || "neutral"}
                    percentage={Math.min(((keyword.count || 0) / (summary?.sentiment?.total || 1)) * 100, 100)}
                    threatLevel={keyword.sentiment === "negative" ? "HIGH" : keyword.sentiment === "neutral" ? "MEDIUM" : "LOW"}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No keyword data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sentiment Summary Stats */}
        {summary?.sentiment && summary.sentiment.total !== undefined && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center" data-testid="stat-total">
              <div className="text-2xl font-orbitron font-bold text-foreground">{summary.sentiment.total?.toLocaleString() || 0}</div>
              <div className="text-sm text-muted-foreground">Total Mentions</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center" data-testid="stat-positive">
              <div className="text-2xl font-orbitron font-bold text-green-500">{summary.sentiment.positive?.toLocaleString() || 0}</div>
              <div className="text-sm text-muted-foreground">Positive</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center" data-testid="stat-negative">
              <div className="text-2xl font-orbitron font-bold text-primary">{summary.sentiment.negative?.toLocaleString() || 0}</div>
              <div className="text-sm text-muted-foreground">Negative</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center" data-testid="stat-neutral">
              <div className="text-2xl font-orbitron font-bold text-yellow-500">{summary.sentiment.neutral?.toLocaleString() || 0}</div>
              <div className="text-sm text-muted-foreground">Neutral</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

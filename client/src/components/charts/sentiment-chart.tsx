import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { TrendData } from "@/lib/api";
import { useMemo } from "react";

interface SentimentChartProps {
  data: TrendData[];
}

export function SentimentChart({ data }: SentimentChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      positive: item.positiveCount,
      negative: item.negativeCount,
      neutral: item.neutralCount,
      score: item.averageScore * 100, // Convert to percentage
    })).reverse(); // Show chronological order
  }, [data]);

  return (
    <div className="h-64 w-full" data-testid="sentiment-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 20%)" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: "hsl(240, 5%, 64%)" }}
            stroke="hsl(240, 6%, 20%)"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "hsl(240, 5%, 64%)" }}
            stroke="hsl(240, 6%, 20%)"
          />
          <Legend 
            wrapperStyle={{ color: "hsl(240, 5%, 64%)" }}
          />
          <Line 
            type="monotone" 
            dataKey="negative" 
            stroke="hsl(0, 84%, 47%)" 
            strokeWidth={2}
            name="Negative"
            dot={{ fill: "hsl(0, 84%, 47%)", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: "hsl(0, 84%, 47%)", strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="positive" 
            stroke="hsl(120, 70%, 45%)" 
            strokeWidth={2}
            name="Positive"
            dot={{ fill: "hsl(120, 70%, 45%)", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: "hsl(120, 70%, 45%)", strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="neutral" 
            stroke="hsl(48, 96%, 53%)" 
            strokeWidth={2}
            name="Neutral"
            dot={{ fill: "hsl(48, 96%, 53%)", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: "hsl(48, 96%, 53%)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

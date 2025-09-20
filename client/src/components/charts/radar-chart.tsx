import { useMemo } from "react";

interface RadarPoint {
  x: number;
  y: number;
  sentiment: "positive" | "negative" | "neutral";
  region: string;
  value: number;
}

interface RadarChartProps {
  regionalData: { region: string; sentiment: number; count: number }[];
}

export function RadarChart({ regionalData }: RadarChartProps) {
  const radarPoints = useMemo(() => {
    const points: RadarPoint[] = [];
    const centerX = 100;
    const centerY = 100;
    
    regionalData.forEach((data, index) => {
      const angle = (index * 2 * Math.PI) / regionalData.length;
      const radius = Math.min(Math.abs(data.sentiment) * 60 + 20, 80);
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      points.push({
        x,
        y,
        sentiment: data.sentiment > 0.1 ? "positive" : data.sentiment < -0.1 ? "negative" : "neutral",
        region: data.region || `Region ${index + 1}`,
        value: data.sentiment
      });
    });
    
    return points;
  }, [regionalData]);

  const getPointColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "hsl(120, 70%, 45%)";
      case "negative":
        return "hsl(0, 84%, 47%)";
      default:
        return "hsl(48, 96%, 53%)";
    }
  };

  return (
    <div className="relative h-64 bg-background rounded border border-border flex items-center justify-center" data-testid="radar-chart">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Radar circles */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(0, 84%, 47%, 0.3)" strokeWidth="1" className="radar-circle" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(0, 84%, 47%, 0.3)" strokeWidth="1" className="radar-circle" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="hsl(0, 84%, 47%, 0.3)" strokeWidth="1" className="radar-circle" />
        <circle cx="100" cy="100" r="20" fill="none" stroke="hsl(0, 84%, 47%, 0.3)" strokeWidth="1" className="radar-circle" />
        
        {/* Center point */}
        <circle cx="100" cy="100" r="2" fill="hsl(0, 84%, 47%)" className="glow-red-intense" />
        
        {/* Data points */}
        {radarPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill={getPointColor(point.sentiment)}
              className="pulse-red"
              data-testid={`radar-point-${index}`}
            />
            <title>{`${point.region}: ${point.value.toFixed(2)}`}</title>
          </g>
        ))}
        
        {/* Radar sweep line */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="20"
          stroke="hsl(0, 84%, 47%)"
          strokeWidth="1"
          className="origin-bottom"
          style={{ 
            transformOrigin: "100px 100px",
            animation: "radar-sweep 4s infinite linear"
          }}
        />
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 text-xs">
        {regionalData.slice(0, 4).map((data, index) => (
          <div key={index} className="flex items-center justify-between" data-testid={`radar-legend-${index}`}>
            <span className="text-muted-foreground">{data.region || `Region ${index + 1}`}:</span>
            <span className={`font-jetbrains ${
              data.sentiment > 0.1 ? "text-green-500" : 
              data.sentiment < -0.1 ? "text-primary" : 
              "text-yellow-500"
            }`}>
              {data.sentiment > 0 ? "+" : ""}{(data.sentiment * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

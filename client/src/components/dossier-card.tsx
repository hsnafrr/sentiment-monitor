interface DossierCardProps {
  keyword: string;
  mentions: number;
  sentiment: "positive" | "negative" | "neutral";
  percentage: number;
  threatLevel: "HIGH" | "MEDIUM" | "LOW";
}

export function DossierCard({ keyword, mentions, sentiment, percentage, threatLevel }: DossierCardProps) {
  const getSentimentColor = () => {
    switch (sentiment) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-primary";
      case "neutral":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getProgressColor = () => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500";
      case "negative":
        return "bg-primary";
      case "neutral":
        return "bg-yellow-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="dossier-card rounded p-4" data-testid={`dossier-card-${keyword}`}>
      <div className="flex items-center justify-between mb-2">
        <span 
          className="font-jetbrains font-bold text-sm" 
          data-testid={`dossier-keyword-${keyword}`}
        >
          #{keyword.toUpperCase()}
        </span>
        <span 
          className={`text-sm font-jetbrains ${getSentimentColor()}`}
          data-testid={`dossier-mentions-${keyword}`}
        >
          {mentions.toLocaleString()} mentions
        </span>
      </div>
      <div className="text-xs text-muted-foreground mb-2" data-testid={`dossier-info-${keyword}`}>
        Sentiment: {percentage}% {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} | Threat Level: {threatLevel}
      </div>
      <div className="w-full bg-background rounded-full h-2">
        <div 
          className={`${getProgressColor()} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
          data-testid={`dossier-progress-${keyword}`}
        />
      </div>
    </div>
  );
}

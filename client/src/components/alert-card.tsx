import { Alert } from "@/lib/api";
import { AlertTriangle, Clock } from "lucide-react";

interface AlertCardProps {
  alert: Alert;
  type: "high" | "medium" | "low";
  timeAgo: string;
  description: string;
}

export function AlertCard({ alert, type, timeAgo, description }: AlertCardProps) {
  const getAlertStyles = () => {
    switch (type) {
      case "high":
        return "bg-destructive/10 border-destructive";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500";
      case "low":
        return "bg-green-500/10 border-green-500";
      default:
        return "bg-muted/10 border-border";
    }
  };

  return (
    <div 
      className={`${getAlertStyles()} border rounded p-3 cursor-pointer hover:opacity-80 transition-opacity`}
      data-testid={`alert-card-${alert.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium text-sm" data-testid={`alert-name-${alert.id}`}>
            {alert.name}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground font-jetbrains">
          <Clock className="h-3 w-3" />
          <span data-testid={`alert-time-${alert.id}`}>{timeAgo}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground" data-testid={`alert-description-${alert.id}`}>
        {description}
      </p>
    </div>
  );
}

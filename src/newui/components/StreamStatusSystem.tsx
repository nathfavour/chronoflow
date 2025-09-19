import { Badge } from "./ui/badge";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  DollarSign,
  Activity
} from "lucide-react";

export type StreamStatus = "active" | "paused" | "completed" | "at-risk" | "pending";

interface StreamStatusProps {
  status: StreamStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function StreamStatusBadge({ status, size = "md", showIcon = true }: StreamStatusProps) {
  const getStatusConfig = (status: StreamStatus) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          icon: Play,
          className: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20",
          dotColor: "bg-green-500"
        };
      case "paused":
        return {
          label: "Paused",
          icon: Pause,
          className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20",
          dotColor: "bg-yellow-500"
        };
      case "completed":
        return {
          label: "Completed",
          icon: CheckCircle,
          className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
          dotColor: "bg-blue-500"
        };
      case "at-risk":
        return {
          label: "At Risk",
          icon: AlertTriangle,
          className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
          dotColor: "bg-red-500"
        };
      case "pending":
        return {
          label: "Pending",
          icon: Clock,
          className: "bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/20",
          dotColor: "bg-gray-500"
        };
      default:
        return {
          label: "Unknown",
          icon: Activity,
          className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
          dotColor: "bg-gray-500"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  return (
    <Badge 
      variant="secondary" 
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-2`}
    >
      {showIcon && (
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${config.dotColor} ${status === 'active' ? 'animate-pulse' : ''}`} />
          <Icon className={iconSizes[size]} />
        </div>
      )}
      {config.label}
    </Badge>
  );
}

export function getStatusColor(status: StreamStatus): string {
  switch (status) {
    case "active":
      return "text-green-600";
    case "paused":
      return "text-yellow-600";
    case "completed":
      return "text-blue-600";
    case "at-risk":
      return "text-red-600";
    case "pending":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}

export function getStatusBorderColor(status: StreamStatus): string {
  switch (status) {
    case "active":
      return "border-green-500/20";
    case "paused":
      return "border-yellow-500/20";
    case "completed":
      return "border-blue-500/20";
    case "at-risk":
      return "border-red-500/20";
    case "pending":
      return "border-gray-500/20";
    default:
      return "border-gray-500/20";
  }
}
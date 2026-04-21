import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }) {
  const statusConfig = {
    up: {
      label: "Up",
      variant: "default",
      className: "bg-green-500 hover:bg-green-600",
      iconColor: "text-white",
    },
    down: {
      label: "Down",
      variant: "destructive",
      className: "",
      iconColor: "text-white",
    },
    paused: {
      label: "Paused",
      variant: "secondary",
      className: "bg-gray-400 hover:bg-gray-500",
      iconColor: "text-white",
    },
  };

  const config = statusConfig[status] || statusConfig.paused;

  return (
    <Badge variant={config.variant} className={cn("gap-1", config.className)}>
      <Circle className={cn("h-2 w-2 fill-current", config.iconColor)} />
      {config.label}
    </Badge>
  );
}

export function UptimeBadge({ uptime }) {
  const getVariant = () => {
    if (uptime >= 99)
      return {
        variant: "default",
        className: "bg-green-500 hover:bg-green-600",
      };
    if (uptime >= 95)
      return {
        variant: "default",
        className: "bg-yellow-500 hover:bg-yellow-600",
      };
    return { variant: "destructive", className: "" };
  };

  const config = getVariant();

  return (
    <Badge variant={config.variant} className={config.className}>
      {uptime.toFixed(2)}% uptime
    </Badge>
  );
}

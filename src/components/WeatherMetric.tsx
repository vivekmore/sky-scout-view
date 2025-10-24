import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherMetricProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  highlight?: boolean;
}

export const WeatherMetric = ({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  highlight = false,
}: WeatherMetricProps) => {
  const trendClasses = (() => {
    if (trend === "up") return "bg-accent/20 text-accent";
    if (trend === "down") return "bg-destructive/20 text-destructive";
    if (trend === "stable") return "bg-muted text-muted-foreground";
    return "";
  })();
  let trendSymbol;
  switch (trend) {
    case "up":
      trendSymbol = "↑";
      break;
    case "down":
      trendSymbol = "↓";
      break;
    case "stable":
      trendSymbol = "→";
      break;
    default:
      trendSymbol = "";
  }

  return (
    <Card
      className={`p-3 sm:p-4 transition-all flex flex-col justify-between h-full ${
        highlight ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-1">
              {label}
            </span>
          </div>
          <div className="flex items-baseline gap-1 flex-wrap">
            <span
              className={`font-bold text-xl sm:text-2xl ${
                highlight ? "text-primary" : "text-foreground"
              }`}
            >
              {value}
            </span>
            {unit && <span className="text-[10px] sm:text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {trend && (
          <div
            className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded ${trendClasses}`}
          >
            {trendSymbol}
          </div>
        )}
      </div>
    </Card>
  );
};

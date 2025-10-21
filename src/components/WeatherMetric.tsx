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
  highlight = false 
}: WeatherMetricProps) => {
  return (
    <Card className={`p-4 transition-all ${highlight ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>
              {value}
            </span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded ${
            trend === 'up' ? 'bg-accent/20 text-accent' :
            trend === 'down' ? 'bg-destructive/20 text-destructive' :
            'bg-muted text-muted-foreground'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>
    </Card>
  );
};

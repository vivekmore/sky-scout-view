import { Card } from "@/components/ui/card";
import { Wind, Droplets } from "lucide-react";

interface TimelineData {
  time: string;
  relativeTime: string;
  windSpeed: number;
  windDirection: number;
  gusts: number;
  rainChance?: number;
  isCurrent?: boolean;
  isForecast?: boolean;
}

interface TimelineCardProps {
  data: TimelineData;
}

const getWindDirection = (degrees: number): string => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const TimelineCard = ({ data }: TimelineCardProps) => {
  return (
    <Card
      className={`p-4 min-w-[160px] transition-all ${
        data.isCurrent
          ? "ring-2 ring-primary shadow-xl scale-105 bg-gradient-to-br from-primary/5 to-accent/5"
          : data.isForecast
            ? "opacity-75 hover:opacity-100"
            : "hover:shadow-md"
      }`}
    >
      <div className="space-y-3">
        <div className="text-center">
          <div
            className={`text-sm font-medium ${data.isCurrent ? "text-primary" : "text-muted-foreground"}`}
          >
            {data.relativeTime}
          </div>
          <div className="text-xs text-muted-foreground">{data.time}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Wind</span>
            </div>
            <span className="text-lg font-bold text-foreground">{data.windSpeed}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Direction</span>
            <span className="font-medium text-foreground">
              {getWindDirection(data.windDirection)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Gusts</span>
            <span className="font-medium text-accent">{data.gusts} mph</span>
          </div>

          {data.rainChance !== undefined && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">Rain</span>
              </div>
              <span className="font-medium text-foreground">{data.rainChance}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

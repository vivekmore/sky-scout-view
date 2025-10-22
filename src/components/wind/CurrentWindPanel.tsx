import { Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CurrentWindPanelProps {
  speed: number;
  direction: number;
  live: boolean;
  className?: string;
}

function directionLabel(deg: number) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(deg / 45) % 8;
  return dirs[i];
}

export const CurrentWindPanel: React.FC<CurrentWindPanelProps> = ({
  speed,
  direction,
  live,
  className,
}) => {
  return (
    <Card
      className={cn(
        "flex items-center justify-center shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-card/80 backdrop-blur",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
          <span>{live ? "🟢 Live" : "⚪ Waiting"}</span>
          <span className="hidden md:inline">Current Speed</span>
        </div>
        <Wind className="h-10 w-10 md:h-12 md:w-12 text-primary animate-pulse" />
        <div className="text-center space-y-1">
          <div className="text-6xl md:text-8xl font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none">
            {speed.toFixed(1)}
          </div>
          <div className="text-2xl md:text-3xl text-muted-foreground font-medium">mph</div>
          <div className="text-5xl md:text-7xl font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none mt-2">
            {directionLabel(direction)}
          </div>
        </div>
      </div>
    </Card>
  );
};

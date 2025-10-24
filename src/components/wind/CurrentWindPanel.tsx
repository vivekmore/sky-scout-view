import { Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CurrentWindPanelProps {
  speed: number;
  direction: number;
  avgSpeed5: number;
  avgSpeed10: number;
  avgSpeed20: number;
  avgDirection20: number;
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
  avgSpeed5,
  avgSpeed10,
  avgSpeed20,
  avgDirection20,
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

        {/* Average Wind Speeds */}
        <div className="w-full mt-4 pt-4 border-t border-border/50">
          <div className="text-sm font-medium text-muted-foreground mb-2">Averages</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-muted-foreground">5 min</div>
              <div className="text-lg font-bold text-foreground">{avgSpeed5.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">10 min</div>
              <div className="text-lg font-bold text-foreground">{avgSpeed10.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">20 min</div>
              <div className="text-lg font-bold text-foreground">{avgSpeed20.toFixed(1)}</div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <div className="text-xs text-muted-foreground">20 min avg direction</div>
            <div className="text-2xl font-bold bg-[var(--gradient-wind)] bg-clip-text">
              {directionLabel(avgDirection20)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

import { Wind } from "lucide-react";
import { PanelContainer } from "@/components/ui/panel-container";
import { cn } from "@/lib/utils";

interface CurrentWindPanelProps {
  speed: number;
  direction: number;
  avgSpeed5: number;
  avgSpeed10: number;
  avgSpeed20: number;
  avgDirection5: number;
  avgDirection10: number;
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
  avgDirection5,
  avgDirection10,
  avgDirection20,
  className,
}) => {
  return (
    <PanelContainer
      center
      noPadding
      className={cn(
        // original classes (now mostly provided by PanelContainer but keep for future extension)
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-3 p-4">
        <div className="flex items-center gap-2 text-lg text-muted-foreground">
          <span className="hidden md:inline">Current Winds</span>
        </div>
        <Wind className="h-10 w-10 md:h-12 md:w-12 text-primary animate-pulse" />
        <div className="text-center space-y-1">
          <div className="text-9xl font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none">
            {speed.toFixed(0)}
            <span className="text-6xl text-muted-foreground font-medium"> mph</span>
          </div>

          <div className="text-8xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none mt-2">
            {directionLabel(direction)}
          </div>
        </div>

        {/* Average Wind Speeds */}
        <div className="w-full mt-4 pt-4 border-t border-border/50">
          <div className="text-2xl text-center font-medium text-muted-foreground my-8">
            Averages
          </div>
          <div className="grid grid-cols-3 gap-20 text-center">
            <div>
              <div className="text-xl text-muted-foreground">&nbsp; last 5 min</div>

              <div className="text-5xl font-bold text-foreground">
                <span className="text-xl text-transparent font-medium"> mph</span>
                {avgSpeed5.toFixed(0)}
                <span className="text-xl text-muted-foreground font-medium"> mph</span>
              </div>
              <div className="text-4xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection5)}
              </div>
            </div>
            <div>
              <div className="text-xl text-muted-foreground">&nbsp; last 10 min</div>

              <div className="text-5xl font-bold text-foreground">
                <span className="text-xl text-transparent font-medium"> mph</span>
                {avgSpeed10.toFixed(0)}
                <span className="text-xl text-muted-foreground font-medium"> mph</span>
              </div>
              <div className="text-4xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection10)}
              </div>
            </div>
            <div>
              <div className="text-xl text-muted-foreground">&nbsp; last 20 min</div>

              <div className="text-5xl font-bold text-foreground">
                <span className="text-xl text-transparent font-medium"> mph</span>
                {avgSpeed20.toFixed(0)}
                <span className="text-xl text-muted-foreground font-medium"> mph</span>
              </div>
              <div className="text-4xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection20)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};

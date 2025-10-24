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
      <div className="flex flex-col items-center justify-center space-y-3 p-3 sm:p-4">
        <div className="flex items-center gap-2 text-base sm:text-lg text-muted-foreground">
          <span className="hidden md:inline">Current Winds</span>
        </div>
        <Wind className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary animate-pulse" />
        <div className="text-center space-y-1">
          <div className="font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none text-6xl xs:text-7xl sm:text-8xl md:text-9xl">
            {speed.toFixed(0)}
            <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-muted-foreground font-medium">
              {" "}
              mph
            </span>
          </div>

          <div className="text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none mt-2 text-5xl xs:text-6xl sm:text-7xl md:text-8xl">
            {directionLabel(direction)}
          </div>
        </div>

        {/* Average Wind Speeds */}
        <div className="w-full mt-2 sm:mt-4 pt-4 border-t border-border/50">
          <div className="text-center font-medium text-muted-foreground my-4 sm:my-6 text-xl sm:text-2xl">
            Averages
          </div>
          <div className="grid gap-6 sm:gap-12 md:gap-20 grid-cols-1 sm:grid-cols-3 text-center">
            <div className="space-y-2">
              <div className="text-sm sm:text-base text-muted-foreground">last 5 min</div>
              <div className="font-bold text-3xl sm:text-4xl md:text-5xl text-foreground">
                {avgSpeed5.toFixed(0)}
                <span className="text-base sm:text-xl text-muted-foreground font-medium"> mph</span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection5)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm sm:text-base text-muted-foreground">last 10 min</div>
              <div className="font-bold text-3xl sm:text-4xl md:text-5xl text-foreground">
                {avgSpeed10.toFixed(0)}
                <span className="text-base sm:text-xl text-muted-foreground font-medium"> mph</span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection10)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm sm:text-base text-muted-foreground">last 20 min</div>
              <div className="font-bold text-3xl sm:text-4xl md:text-5xl text-foreground">
                {avgSpeed20.toFixed(0)}
                <span className="text-base sm:text-xl text-muted-foreground font-medium"> mph</span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection20)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};

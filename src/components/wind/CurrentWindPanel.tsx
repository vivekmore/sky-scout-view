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
  highSpeed5: number;
  highSpeed10: number;
  highSpeed20: number;
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
  highSpeed5,
  highSpeed10,
  highSpeed20,
  className,
}) => {
  return (
    <PanelContainer center noPadding className={cn("h-full overflow-hidden", className)}>
      <div className="flex flex-col items-center justify-between h-full w-full px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-6 xl:px-8 xl:py-8 2xl:px-10 2xl:py-10 overflow-y-auto">
        {/* Current Winds Section */}
        <div className="flex flex-col items-center justify-center w-full space-y-1 xs:space-y-1.5 sm:space-y-2 md:space-y-2.5 lg:space-y-3">
          {/* Section Label */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-muted-foreground">
            <Wind className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-primary" />
            <span>Current Winds</span>
          </div>

          {/* Current Wind Data */}
          <div className="text-center space-y-1 xs:space-y-1.5 sm:space-y-2">
            <div className="font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">
              {speed.toFixed(0)}
              <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-muted-foreground font-medium">
                {" "}
                mph
              </span>
            </div>

            <div className="text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
              {directionLabel(direction)}
            </div>
          </div>
        </div>

        {/* Averages Section */}
        <div className="w-full mt-2 xs:mt-3 sm:mt-4 md:mt-5 pt-2 xs:pt-3 sm:pt-4 md:pt-5 border-t border-border/50">
          {/* Section Label - matching style with Current Winds */}
          <div className="text-center font-medium text-muted-foreground mb-2 xs:mb-3 sm:mb-4 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            Averages
          </div>

          {/* Average Wind Data Grid */}
          <div className="grid gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-3 text-center">
            {/* 5 min average */}
            <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
              <div className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground">
                last 5 min
              </div>
              <div className="font-bold text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-foreground">
                {avgSpeed5.toFixed(0)}
                <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground font-medium">
                  {" "}
                  mph
                </span>
              </div>
              <div className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection5)}
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-muted-foreground/70 font-medium">
                High: {highSpeed5.toFixed(0)} mph
              </div>
            </div>

            {/* 10 min average */}
            <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
              <div className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground">
                last 10 min
              </div>
              <div className="font-bold text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-foreground">
                {avgSpeed10.toFixed(0)}
                <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground font-medium">
                  {" "}
                  mph
                </span>
              </div>
              <div className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection10)}
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-muted-foreground/70 font-medium">
                High: {highSpeed10.toFixed(0)} mph
              </div>
            </div>

            {/* 20 min average */}
            <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
              <div className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground">
                last 20 min
              </div>
              <div className="font-bold text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-foreground">
                {avgSpeed20.toFixed(0)}
                <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground font-medium">
                  {" "}
                  mph
                </span>
              </div>
              <div className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection20)}
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-muted-foreground/70 font-medium">
                High: {highSpeed20.toFixed(0)} mph
              </div>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};

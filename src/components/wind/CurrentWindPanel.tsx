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
    <PanelContainer center noPadding className={cn("h-full", className)}>
      <div className="flex flex-col items-center justify-between h-full w-full px-4 py-6 xs:px-5 xs:py-7 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-12 xl:py-14 2xl:px-16 2xl:py-16 3xl:px-20 3xl:py-20 4xl:px-24 4xl:py-24 5xl:px-32 5xl:py-32">
        {/* Current Winds Section */}
        <div className="flex flex-col items-center justify-center w-full space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8 2xl:space-y-10 3xl:space-y-12 4xl:space-y-16 5xl:space-y-20">
          {/* Section Label */}
          <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-7 4xl:gap-8 5xl:gap-10 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl 5xl:text-8xl font-medium text-muted-foreground">
            <Wind className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16 4xl:h-20 4xl:w-20 5xl:h-24 5xl:w-24 text-primary" />
            <span>Current Winds</span>
          </div>

          {/* Current Wind Data */}
          <div className="text-center space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 2xl:space-y-7 3xl:space-y-8 4xl:space-y-10 5xl:space-y-12">
            <div className="font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[12rem] 3xl:text-[15rem] 4xl:text-[18rem] 5xl:text-[24rem]">
              {speed.toFixed(0)}
              <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-[10rem] 5xl:text-[13rem] text-muted-foreground font-medium">
                {" "}
                mph
              </span>
            </div>

            <div className="text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] 3xl:text-[12rem] 4xl:text-[15rem] 5xl:text-[20rem]">
              {directionLabel(direction)}
            </div>
          </div>
        </div>

        {/* Averages Section */}
        <div className="w-full mt-6 xs:mt-7 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14 2xl:mt-16 3xl:mt-20 4xl:mt-24 5xl:mt-32 pt-6 xs:pt-7 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14 2xl:pt-16 3xl:pt-20 4xl:pt-24 5xl:pt-32 border-t border-border/50">
          {/* Section Label - matching style with Current Winds */}
          <div className="text-center font-medium text-muted-foreground mb-6 xs:mb-7 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 2xl:mb-16 3xl:mb-20 4xl:mb-24 5xl:mb-32 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl 5xl:text-8xl">
            Averages
          </div>

          {/* Average Wind Data Grid */}
          <div className="grid gap-6 xs:gap-7 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 3xl:gap-24 4xl:gap-32 5xl:gap-40 grid-cols-1 sm:grid-cols-3 text-center">
            {/* 5 min average */}
            <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 2xl:space-y-7 3xl:space-y-8 4xl:space-y-10 5xl:space-y-12">
              <div className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-muted-foreground">
                last 5 min
              </div>
              <div className="font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-[10rem] 5xl:text-[13rem] text-foreground">
                {avgSpeed5.toFixed(0)}
                <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-muted-foreground font-medium">
                  {" "}
                  mph
                </span>
              </div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl 5xl:text-[10rem] text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection5)}
              </div>
            </div>

            {/* 10 min average */}
            <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 2xl:space-y-7 3xl:space-y-8 4xl:space-y-10 5xl:space-y-12">
              <div className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-muted-foreground">
                last 10 min
              </div>
              <div className="font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-[10rem] 5xl:text-[13rem] text-foreground">
                {avgSpeed10.toFixed(0)}
                <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-muted-foreground font-medium">
                  {" "}
                  mph
                </span>
              </div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl 5xl:text-[10rem] text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection10)}
              </div>
            </div>

            {/* 20 min average */}
            <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 2xl:space-y-7 3xl:space-y-8 4xl:space-y-10 5xl:space-y-12">
              <div className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-muted-foreground">
                last 20 min
              </div>
              <div className="font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl 4xl:text-[10rem] 5xl:text-[13rem] text-foreground">
                {avgSpeed20.toFixed(0)}
                <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-muted-foreground font-medium">
                  {" "}
                  mph
                </span>
              </div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl 5xl:text-[10rem] text-accent font-bold bg-[var(--gradient-wind)] bg-clip-text">
                {directionLabel(avgDirection20)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};

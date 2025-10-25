import { Card } from "@/components/ui/card";
import { PanelContainer } from "@/components/ui/panel-container";
import { cn } from "@/lib/utils"; // added for merging classes

interface WindCompassProps {
  direction: number;
  speed: number;
  className?: string;
  variant?: "default" | "unstyled" | "panel"; // keep 'unstyled' variant string for API flexibility if needed
}

function directionLabel(deg: number) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(deg / 45) % 8;
  return dirs[i];
}

export const WindCompass = ({
  direction,
  speed,
  className = "",
  variant = "default",
}: WindCompassProps) => {
  const effectiveVariant = variant;

  // Geometry constants tied to base size (w-80 / h-80). We scale the whole thing down on small screens.
  const OUTER_SIZE = 320; // w-80
  const INSET = 12; // inset-3 => 0.75rem default = 12px
  const INNER_DIAMETER = OUTER_SIZE - INSET * 2; // 296
  const RADIUS = INNER_DIAMETER / 2; // 148
  const GAP = 6; // gap from outer edge so ticks sit well inside circle

  const compass = (
    <div
      className={cn(
        // Responsive sizing: smaller on mobile, larger on desktop/TV
        "relative w-[200px] h-[200px] xs:w-[240px] xs:h-[240px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] xl:w-[480px] xl:h-[480px] 2xl:w-[560px] 2xl:h-[560px]",
        "transition-all duration-300"
      )}
      aria-label="Wind direction compass"
    >
      {/* Outer ring with realistic dark red border */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-muted/40 to-muted/10 shadow-[0_10px_24px_rgba(0,0,0,0.3)] border-[4px] sm:border-[5px] lg:border-[6px] border-[#551010]"
        style={{
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05), 0 8px 18px rgba(0,0,0,0.35)",
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(135deg, rgba(120,0,0,0.15), rgba(0,0,0,0.25))",
        }}
      />

      {/* Inner compass circle */}
      <div className="absolute inset-2 sm:inset-2.5 lg:inset-3 rounded-full border-[4px] sm:border-[5px] lg:border-[6px] border-border bg-gradient-to-br from-card via-card to-muted/30 shadow-inner">
        {/* Degree markings - scale with compass size */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10;
          const isMajor = angle % 30 === 0;
          // Scale markings based on compass size
          const baseRadius = 100; // base for 200px compass
          const currentSize = typeof window !== 'undefined' ? 
            (window.innerWidth < 400 ? 200 : 
             window.innerWidth < 640 ? 240 :
             window.innerWidth < 768 ? 280 :
             window.innerWidth < 1024 ? 340 :
             window.innerWidth < 1280 ? 400 :
             window.innerWidth < 1536 ? 480 : 560) : 200;
          const scale = currentSize / 200;
          const length = (isMajor ? 16 : 8) * scale;
          const width = (isMajor ? 3 : 1.5) * scale;
          const radius = (currentSize - (scale > 1.4 ? 24 : scale > 1 ? 20 : 16)) / 2;
          const gap = 6 * scale;
          const translateX = radius - gap - length;
          
          return (
            <div
              key={angle}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${translateX}px)`,
                width: `${length}px`,
                height: `${width}px`,
                backgroundColor: "hsl(var(--muted-foreground))",
                opacity: isMajor ? 0.65 : 0.35,
                borderRadius: 2,
              }}
            />
          );
        })}

        {/* Intercardinal directions (remain inside) - responsive text */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:top-11 lg:left-11 text-xs sm:text-sm lg:text-base font-medium text-muted-foreground/70">
          NW
        </div>
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 lg:top-11 lg:right-11 text-xs sm:text-sm lg:text-base font-medium text-muted-foreground/70">
          NE
        </div>
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 lg:bottom-11 lg:left-11 text-xs sm:text-sm lg:text-base font-medium text-muted-foreground/70">
          SW
        </div>
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-11 lg:right-11 text-xs sm:text-sm lg:text-base font-medium text-muted-foreground/70">
          SE
        </div>
      </div>

      {/* External cardinal direction labels (map style) - increased spacing */}
      <div className="absolute inset-0 pointer-events-none select-none font-extrabold tracking-wider text-foreground/90">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[140%] sm:-translate-y-[150%] lg:-translate-y-[160%] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl drop-shadow-sm">
          N
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[140%] sm:translate-y-[150%] lg:translate-y-[160%] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-muted-foreground drop-shadow-sm">
          S
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[140%] sm:-translate-x-[150%] lg:-translate-x-[160%] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-muted-foreground drop-shadow-sm">
          W
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[140%] sm:translate-x-[150%] lg:translate-x-[160%] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-muted-foreground drop-shadow-sm">
          E
        </div>
      </div>

      {/* Wind needle - scale with compass */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
        style={{ transform: `rotate(${direction}deg)` }}
        aria-hidden
      >
        {/* North pointer (red) - responsive sizing */}
        <div className="absolute top-[calc(50%-52px)] xs:top-[calc(50%-62px)] sm:top-[calc(50%-73px)] md:top-[calc(50%-88px)] lg:top-[calc(50%-104px)] xl:top-[calc(50%-125px)] 2xl:top-[calc(50%-145px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] xs:border-l-[7px] sm:border-l-[9px] md:border-l-[10px] lg:border-l-[12px] xl:border-l-[14px] 2xl:border-l-[16px] border-r-[6px] xs:border-r-[7px] sm:border-r-[9px] md:border-r-[10px] lg:border-r-[12px] xl:border-r-[14px] 2xl:border-r-[16px] border-b-[52px] xs:border-b-[62px] sm:border-b-[73px] md:border-b-[88px] lg:border-b-[104px] xl:border-b-[125px] 2xl:border-b-[145px] border-l-transparent border-r-transparent border-b-primary drop-shadow-[0_4px_6px_rgba(0.9,0,0,0)]" />

        {/* South pointer (white/muted) - responsive sizing */}
        <div className="absolute bottom-[calc(50%-52px)] xs:bottom-[calc(50%-62px)] sm:bottom-[calc(50%-73px)] md:bottom-[calc(50%-88px)] lg:bottom-[calc(50%-104px)] xl:bottom-[calc(50%-125px)] 2xl:bottom-[calc(50%-145px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] xs:border-l-[7px] sm:border-l-[9px] md:border-l-[10px] lg:border-l-[12px] xl:border-l-[14px] 2xl:border-l-[16px] border-r-[6px] xs:border-r-[7px] sm:border-r-[9px] md:border-r-[10px] lg:border-r-[12px] xl:border-r-[14px] 2xl:border-r-[16px] border-t-[52px] xs:border-t-[62px] sm:border-t-[73px] md:border-t-[88px] lg:border-t-[104px] xl:border-t-[125px] 2xl:border-t-[145px] border-l-transparent border-r-transparent border-t-muted-foreground/40 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]" />
      </div>

      {/* Center pivot - responsive sizing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl border-[2px] sm:border-[3px] lg:border-[4px] border-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 rounded-full bg-background/80" />
    </div>
  );

  const infoPanel = (
    <div className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20" aria-live="polite">
      <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-foreground mb-2 sm:mb-3">
        <span className={"text-transparent"}>°</span>
        {direction}°
      </div>
      <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-accent mb-2 sm:mb-3 lg:mb-4">
        {directionLabel(direction)}
      </div>
      <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-muted-foreground">
        {speed.toFixed(0)}
        <span className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"> mph</span>
      </div>
    </div>
  );

  const content = (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-2 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
      {compass}
      {infoPanel}
    </div>
  );

  if (effectiveVariant === "unstyled") {
    return (
      <div className={cn("h-full w-full flex justify-center", className)}>{content}</div>
    );
  }

  if (effectiveVariant === "panel") {
    return (
      <PanelContainer center noPadding className={className}>
        <div className="h-full w-full flex justify-center">{content}</div>
      </PanelContainer>
    );
  }

  // default
  return (
    <Card className={cn("h-full w-full flex justify-center", className)}>{content}</Card>
  );
};

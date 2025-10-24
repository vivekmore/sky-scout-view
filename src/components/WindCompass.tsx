import { Card } from "@/components/ui/card";
import { PanelContainer } from "@/components/ui/panel-container";

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

  // Constants tied to current sizing (w-80 h-80 + inset-3). If size changes, recompute.
  const OUTER_SIZE = 320; // w-80
  const INSET = 12; // inset-3 => 0.75rem default = 12px
  const INNER_DIAMETER = OUTER_SIZE - INSET * 2; // 296
  const RADIUS = INNER_DIAMETER / 2; // 148
  const GAP = 6; // gap from outer edge so ticks sit well inside circle

  const content = (
    <div className="flex flex-col items-center gap-4 flex-1 justify-center">
      {/* Enlarged compass (previously w-60 h-60) */}
      <div className="relative w-80 h-80 max-w-full">
        {/* Outer ring with realistic dark red border */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-muted/40 to-muted/10 shadow-[0_10px_24px_rgba(0,0,0,0.3)] border-[6px] border-[#551010]"
          style={{
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05), 0 8px 18px rgba(0,0,0,0.35)",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(135deg, rgba(120,0,0,0.15), rgba(0,0,0,0.25))",
          }}
        />

        {/* Inner compass circle */}
        <div className="absolute inset-3 rounded-full border-[6px] border-border bg-gradient-to-br from-card via-card to-muted/30 shadow-inner">
          {/* Degree markings */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const isMajor = angle % 30 === 0;
            const length = isMajor ? 16 : 8; // radial length of tick
            const width = isMajor ? 3 : 1.5; // thickness
            // Position tick so it ends "GAP" inside the circumference.
            const translateX = RADIUS - GAP - length; // start point from center
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

          {/* Cardinal directions (removed from inside to move outside) */}

          {/* Intercardinal directions (remain inside) */}
          <div className="absolute top-11 left-11 text-sm font-medium text-muted-foreground/70">
            NW
          </div>
          <div className="absolute top-11 right-11 text-sm font-medium text-muted-foreground/70">
            NE
          </div>
          <div className="absolute bottom-11 left-11 text-sm font-medium text-muted-foreground/70">
            SW
          </div>
          <div className="absolute bottom-11 right-11 text-sm font-medium text-muted-foreground/70">
            SE
          </div>
        </div>

        {/* External cardinal direction labels (map style) */}
        <div className="absolute inset-0 pointer-events-none select-none font-extrabold tracking-wider text-foreground/90">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] text-3xl drop-shadow-sm">
            N
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[120%] text-3xl text-muted-foreground drop-shadow-sm">
            S
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[120%] text-3xl text-muted-foreground drop-shadow-sm">
            W
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[120%] text-3xl text-muted-foreground drop-shadow-sm">
            E
          </div>
        </div>

        {/* Wind needle */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${direction}deg)` }}
        >
          {/* North pointer (red) */}
          <div className="absolute top-[calc(50%-104px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[104px] border-l-transparent border-r-transparent border-b-primary drop-shadow-[0_4px_6px_rgba(0.9,0,0,0)]" />

          {/* South pointer (white/muted) */}
          <div className="absolute bottom-[calc(50%-104px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[104px] border-l-transparent border-r-transparent border-t-muted-foreground/40 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]" />
        </div>

        {/* Center pivot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl border-[4px] border-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background/80" />
      </div>

      <div className="text-center mt-12">
        <div className="text-7xl font-bold text-foreground">
          <span className={"text-transparent"}>°</span>
          {direction}°
        </div>
        <div className="text-5xl font-bold text-accent">{directionLabel(direction)}</div>
        <div className="text-3xl text-muted-foreground mt-1">
          {speed.toFixed(0)}
          <span className="text-xl"> mph</span>
        </div>
      </div>
    </div>
  );

  if (effectiveVariant === "unstyled") {
    return <div className={"p-6 h-full w-full flex " + className}>{content}</div>;
  }

  if (effectiveVariant === "panel") {
    return (
      <PanelContainer center noPadding className={className}>
        <div className="p-6 h-full w-full flex">{content}</div>
      </PanelContainer>
    );
  }

  // default
  return <Card className={"p-6 h-full w-full " + className}>{content}</Card>;
};

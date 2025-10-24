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

  const content = (
    <div className="flex flex-col items-center gap-4 flex-1 justify-center">
      <div className="relative w-40 h-40">
        {/* Outer ring with shadow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-muted/40 to-muted/10 shadow-[0_8px_16px_rgba(0,0,0,0.15)]" />

        {/* Inner compass circle */}
        <div className="absolute inset-2 rounded-full border-4 border-border bg-gradient-to-br from-card via-card to-muted/30 shadow-inner">
          {/* Degree markings */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const isMajor = angle % 30 === 0;
            const length = isMajor ? 8 : 4;
            const width = isMajor ? 2 : 1;
            return (
              <div
                key={angle}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(68px)`,
                  width: `${length}px`,
                  height: `${width}px`,
                  backgroundColor: "hsl(var(--muted-foreground))",
                  opacity: isMajor ? 0.6 : 0.3,
                }}
              />
            );
          })}

          {/* Cardinal directions */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-sm font-bold text-foreground">
            N
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm font-bold text-muted-foreground">
            S
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
            W
          </div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
            E
          </div>

          {/* Intercardinal directions */}
          <div className="absolute top-6 left-6 text-xs font-medium text-muted-foreground/70">
            NW
          </div>
          <div className="absolute top-6 right-6 text-xs font-medium text-muted-foreground/70">
            NE
          </div>
          <div className="absolute bottom-6 left-6 text-xs font-medium text-muted-foreground/70">
            SW
          </div>
          <div className="absolute bottom-6 right-6 text-xs font-medium text-muted-foreground/70">
            SE
          </div>
        </div>

        {/* Wind needle */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${direction}deg)` }}
        >
          {/* North pointer (red) */}
          <div className="absolute top-[calc(50%-50px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[50px] border-l-transparent border-r-transparent border-b-primary drop-shadow-md" />

          {/* South pointer (white/muted) */}
          <div className="absolute bottom-[calc(50%-50px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[50px] border-l-transparent border-r-transparent border-t-muted-foreground/40 drop-shadow-md" />
        </div>

        {/* Center pivot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg border-2 border-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-background/80" />
      </div>

      <div className="text-center">
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

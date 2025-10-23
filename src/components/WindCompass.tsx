import { Card } from "@/components/ui/card";

interface WindCompassProps {
  direction: number;
  speed: number;
}

export const WindCompass = ({ direction, speed }: WindCompassProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">Wind Direction</h3>
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
                  key={i}
                  className="absolute top-1/2 left-1/2 origin-left"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(68px)`,
                    width: `${length}px`,
                    height: `${width}px`,
                    backgroundColor: 'hsl(var(--muted-foreground))',
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
          <div className="text-3xl font-bold text-foreground">{direction}°</div>
          <div className="text-sm text-muted-foreground mt-1">
            {speed} <span className="text-xs">mph</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

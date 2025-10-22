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
          {/* Compass circle */}
          <div className="absolute inset-0 rounded-full border-4 border-border bg-gradient-to-br from-card to-muted/20">
            {/* Cardinal directions */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground">
              N
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground">
              S
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
              W
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
              E
            </div>
          </div>

          {/* Wind arrow */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-1000"
            style={{ transform: `rotate(${direction}deg)` }}
          >
            <div className="h-16 w-1 bg-gradient-to-t from-primary to-accent rounded-full shadow-lg">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary" />
            </div>
          </div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-lg" />
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

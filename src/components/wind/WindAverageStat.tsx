import { Card } from "@/components/ui/card";
import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindAverageStatProps {
  label: string;
  minutes: number;
  value: number;
  highlight?: boolean;
  className?: string;
}

export const WindAverageStat: React.FC<WindAverageStatProps> = ({
  label,
  minutes,
  value,
  highlight,
  className,
}) => {
  return (
    <Card
      className={cn(
        "p-4 md:p-5 transition-all hover:shadow-md bg-gradient-to-br from-card to-card/80",
        highlight && "ring-2 ring-primary scale-[1.03]",
        className
      )}
    >
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-sm font-medium text-primary">{label}</div>
          <div className="text-xs text-muted-foreground">Last {minutes} Minutes</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Speed</span>
            </div>
            <span className="text-3xl md:text-4xl font-bold text-foreground">
              {value.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Unit</span>
            <span className="font-medium text-foreground">mph</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

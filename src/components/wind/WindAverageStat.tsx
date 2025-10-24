import { Wind } from "lucide-react";

interface WindAverageStatProps {
  minutes: number;
  value: number;
}

export const WindAverageStat: React.FC<WindAverageStatProps> = ({ minutes, value }) => {
  return (
    <div className="space-y-3">
      <div className="11space-y-2">
        <div className="flex items-center justify-evenly">
          <div className="flex items-center gap-1">
            <Wind className="h-8 w-8 text-primary" />
            {/*<span className="text-sm text-muted-foreground">Speed</span>*/}
            <div className="w-36 text-md text-muted-foreground pr-px">Last {minutes} Minutes</div>
            <span className="text-3xl font-bold text-foreground">{value.toFixed(1)}</span>
            <span className="font-medium text-foreground">mph</span>
          </div>
        </div>
      </div>
    </div>
  );
};

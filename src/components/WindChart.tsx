import { Card } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface WindDataPoint {
  time: string;
  speed: number;
  gust: number;
}

interface WindChartProps {
  data: WindDataPoint[];
  className?: string;
}

export const WindChart = ({ data, className = "" }: WindChartProps) => {
  return (
    <Card className={"p-4 sm:p-6 h-[360px] xs:h-[400px] md:h-[480px] flex flex-col " + className}>
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">
        Wind Speed Timeline
      </h3>
      <ResponsiveContainer width="100%" height={"100%"}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gustGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            fontSize={11}
            interval={0}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            fontSize={11}
            label={{
              value: "mph",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 11,
            }}
          />
          <Tooltip
            wrapperStyle={{ zIndex: 10 }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="gust"
            stroke="hsl(var(--accent))"
            fill="url(#gustGradient)"
            strokeWidth={2}
            name="Gusts"
          />
          <Area
            type="monotone"
            dataKey="speed"
            stroke="hsl(var(--primary))"
            fill="url(#windGradient)"
            strokeWidth={3}
            name="Wind Speed"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <div className="w-3 h-3 rounded-full bg-primary sm:w-4 sm:h-4" />
          <span className="text-muted-foreground">Wind Speed</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <div className="w-3 h-3 rounded-full bg-accent sm:w-4 sm:h-4" />
          <span className="text-muted-foreground">Gusts</span>
        </div>
      </div>
    </Card>
  );
};

import { WindCompass } from "./WindCompass";
import { WindChart } from "./WindChart";
import { TimelineCard } from "./TimelineCard";
import { WeatherMetric } from "./WeatherMetric";
import { Droplets, Eye, Gauge, Wind } from "lucide-react";

interface WeatherData {
  time: string;
  relativeTime: string;
  windSpeed: number;
  windDirection: number;
  gusts: number;
  rainChance?: number;
  isCurrent: boolean;
  isForecast: boolean;
  speed: number;
  gust: number;
}

interface ChartDataPoint {
  time: string;
  speed: number;
  gust: number;
}

interface WeatherContentProps {
  weatherData: WeatherData[];
  currentData: WeatherData | undefined;
  chartData: ChartDataPoint[];
}

export const WeatherContent = ({ weatherData, currentData, chartData }: WeatherContentProps) => {
  return (
    <>
      {/* Current Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WeatherMetric
          icon={Wind}
          label="Wind Speed"
          value={currentData?.windSpeed || 0}
          unit="mph"
          trend="stable"
          highlight
        />
        <WeatherMetric
          icon={Gauge}
          label="Gusts"
          value={currentData?.gusts || 0}
          unit="mph"
          trend="up"
        />
        <WeatherMetric icon={Eye} label="Visibility" value="10" unit="mi" />
        <WeatherMetric icon={Droplets} label="Rain Forecast" value="15" unit="%" />
      </div>

      {/* Main Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WindCompass
            direction={currentData?.windDirection || 0}
            speed={currentData?.windSpeed || 0}
          />
        </div>
        <div className="lg:col-span-2">
          <WindChart data={chartData} />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="flex gap-4 min-w-max">
            {weatherData.map((data) => (
              <TimelineCard key={data.time} data={data} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

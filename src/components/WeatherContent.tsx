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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-1 order-2 xl:order-1">
          <WindCompass
            direction={currentData?.windDirection || 0}
            speed={currentData?.windSpeed || 0}
            minorTickAngle={5}
            majorTickAngle={30}
          />
        </div>
        <div className="xl:col-span-2 order-1 xl:order-2">
          <WindChart data={chartData} />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
        <div className="overflow-x-auto pb-3 sm:pb-4 pt-1 sm:pt-2 -mx-2 sm:mx-0">
          <div className="px-2 flex gap-3 sm:gap-4 min-w-max">
            {weatherData.map((data) => (
              <TimelineCard key={data.time} data={data} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

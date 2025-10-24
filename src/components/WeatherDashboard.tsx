import { useCallback, useEffect, useState } from "react";
import { WeatherContent } from "./WeatherContent";
import { WeatherSettings } from "./WeatherSettings";
import { Maximize2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { mockData, weatherService } from "@/services/weatherService";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(mockData());
  const [showApiInfo, setShowApiInfo] = useState(true);
  const [isLoadingReal, setIsLoadingReal] = useState(false);
  const [usingRealData, setUsingRealData] = useState(false);
  const { toast } = useToast();

  const fetchRealWeatherData = useCallback(async () => {
    const config = weatherService.getConfig();
    if (!config) return;

    setIsLoadingReal(true);
    try {
      const macAddress = config.macAddress;
      const rawData = await weatherService.fetchDeviceData(macAddress, 50);
      const processed = weatherService.processWeatherData(rawData);

      // Map to our UI format with timeline
      const mapped = processed.slice(0, 7).map((entry, idx) => {
        const latestIndex = 0;
        const isCurrentIdx = idx === Math.min(latestIndex, processed.length - 1);
        const minutesOffset = (idx - latestIndex) * 5;

        const timeOffsetString =
          minutesOffset > 0 ? `${Math.abs(minutesOffset)}m ago` : `+${minutesOffset}m`;
        const relativeTime = isCurrentIdx ? "Now" : timeOffsetString;
        return {
          time: entry.time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          relativeTime: relativeTime,
          windSpeed: Math.round(entry.windSpeed),
          windDirection: entry.windDirection,
          gusts: Math.round(entry.gusts),
          rainChance: entry.rainHourly > 0 ? Math.round(entry.rainHourly * 100) : undefined,
          isCurrent: isCurrentIdx,
          isForecast: idx > latestIndex,
          speed: entry.windSpeed,
          gust: entry.gusts,
        };
      });

      setWeatherData(mapped);
      setUsingRealData(true);
    } catch (error) {
      toast({
        title: "Failed to fetch weather data",
        description: error instanceof Error ? error.message : "Please check your settings",
        variant: "destructive",
      });
      setUsingRealData(false);
    } finally {
      setIsLoadingReal(false);
    }
  }, [toast]);

  useEffect(() => {
    const config = weatherService.getConfig();
    if (config) {
      fetchRealWeatherData();
    }

    const interval = globalThis.setInterval(() => {
      if (weatherService.getConfig()) {
        fetchRealWeatherData();
      } else {
        setWeatherData(mockData());
      }
    }, 30000);

    return () => globalThis.clearInterval(interval);
  }, [fetchRealWeatherData]);

  const currentData = weatherData.find((d) => d.isCurrent);
  const chartData = weatherData.map((d) => ({
    time: d.relativeTime,
    speed: d.speed,
    gust: d.gust,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Weather Station
            </h1>
            <div className="flex gap-2">
              <Link to="/simple">
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Simple View
                </Button>
              </Link>
              <WeatherSettings />
            </div>
          </div>
          <p className="text-muted-foreground">
            {usingRealData
              ? "Live data from Ambient Weather"
              : "Real-time wind conditions & forecast"}
          </p>
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
            {isLoadingReal && " • Refreshing..."}
          </div>
        </div>

        {/* API Configuration Alert */}
        {showApiInfo && !usingRealData && (
          <Alert className="border-primary/50 bg-primary/5">
            <AlertDescription className="flex items-center justify-between">
              <div className="text-sm">
                <strong>Demo Mode:</strong> Currently showing simulated data. Click "Configure API"
                above to connect your Ambient Weather station.
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowApiInfo(false)}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <WeatherContent weatherData={weatherData} currentData={currentData} chartData={chartData} />
      </div>
    </div>
  );
};

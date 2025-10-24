import { useCallback, useEffect, useState } from "react";
import { WeatherContent } from "./WeatherContent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { mockData, weatherService } from "@/services/weatherService";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";

export const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(mockData());
  const [showApiInfo, setShowApiInfo] = useState(true);
  const [isLoadingReal, setIsLoadingReal] = useState(false);
  const [usingRealData, setUsingRealData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchRealWeatherData = useCallback(async () => {
    const config = weatherService.getConfig();
    if (!config) return;
    setIsLoadingReal(true);
    try {
      const macAddress = config.macAddress;
      const rawData = await weatherService.fetchDeviceData(macAddress, 50);
      const processed = weatherService.processWeatherData(rawData);
      const mapped = processed.slice(0, 7).map((entry, idx) => {
        const latestIndex = 0;
        const isCurrentIdx = idx === Math.min(latestIndex, processed.length - 1);
        const minutesOffset = (idx - latestIndex) * 5;
        const timeOffsetString =
          minutesOffset > 0 ? `${Math.abs(minutesOffset)}m ago` : `+${minutesOffset}m`;
        const relativeTime = isCurrentIdx ? "Now" : timeOffsetString;
        return {
          time: entry.time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          relativeTime,
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
      setLastUpdated(new Date());
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
        setUsingRealData(false);
        setLastUpdated(new Date());
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
    <AppLayout
      usingRealData={usingRealData}
      isLoading={isLoadingReal}
      lastUpdated={lastUpdated}
      onRefresh={fetchRealWeatherData}
      className="bg-[var(--gradient-sky)]"
    >
      <div className="max-w-7xl mx-auto w-full space-y-5 md:space-y-6 px-1 sm:px-0">
        {!usingRealData && showApiInfo && (
          <Alert className="border-primary/50 bg-primary/5">
            <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="text-sm leading-relaxed">
                <strong className="font-semibold">Demo Mode:</strong> Currently showing simulated
                data. Use <span className="font-medium">Settings</span> to connect your station.
              </div>
              <div className="flex w-full sm:w-auto justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiInfo(false)}
                  className="self-end"
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <WeatherContent weatherData={weatherData} currentData={currentData} chartData={chartData} />
      </div>
    </AppLayout>
  );
};

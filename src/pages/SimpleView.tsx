import { useState, useEffect, useRef, useCallback } from "react";
import { weatherService } from "@/services/weatherService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WeatherSettings } from "@/components/WeatherSettings";
import { WindCompass } from "@/components/WindCompass";
import { ArrowLeft, Wind } from "lucide-react";
import { Link } from "react-router-dom";

export default function SimpleView() {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentDirection, setCurrentDirection] = useState(0);
  const [avgSpeed5, setAvgSpeed5] = useState(0);
  const [avgSpeed10, setAvgSpeed10] = useState(0);
  const [avgSpeed20, setAvgSpeed20] = useState(0);
  const [usingRealData, setUsingRealData] = useState(false);
  const { toast } = useToast();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch data from API and calculate averages (memoized)
  const fetchAndCalculate = useCallback(async () => {
    try {
      const config = weatherService.getConfig();
      if (!config?.macAddress) {
        setUsingRealData(false);
        return;
      }

      const rawData = await weatherService.fetchDeviceData(config.macAddress, 10);
      if (!rawData || rawData.length === 0) {
        setUsingRealData(false);
        return;
      }

      const processed = weatherService.processWeatherData(rawData);
      const now = new Date();

      // Current speed and direction (use most recent reading; Ambient Weather API typically returns newest first)
      if (processed.length > 0) {
        setCurrentSpeed(processed[0].windSpeed);
        setCurrentDirection(processed[0].windDirection);
      }

      // Filter data by time ranges
      const last5mins = processed.filter((d) => now.getTime() - d.time.getTime() <= 5 * 60 * 1000);
      const last10mins = processed.filter(
        (d) => now.getTime() - d.time.getTime() <= 10 * 60 * 1000
      );
      const last20mins = processed.filter(
        (d) => now.getTime() - d.time.getTime() <= 20 * 60 * 1000
      );

      // Calculate average speeds
      if (last5mins.length > 0) {
        const avg = last5mins.reduce((sum, d) => sum + d.windSpeed, 0) / last5mins.length;
        setAvgSpeed5(avg);
      } else {
        setAvgSpeed5(0);
      }

      if (last10mins.length > 0) {
        const avg = last10mins.reduce((sum, d) => sum + d.windSpeed, 0) / last10mins.length;
        setAvgSpeed10(avg);
      } else {
        setAvgSpeed10(0);
      }

      if (last20mins.length > 0) {
        const avg = last20mins.reduce((sum, d) => sum + d.windSpeed, 0) / last20mins.length;
        setAvgSpeed20(avg);
      } else {
        setAvgSpeed20(0);
      }

      setUsingRealData(true);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Data fetch error",
        description: error instanceof Error ? error.message : "Unable to retrieve weather data",
        variant: "destructive",
      });
      setUsingRealData(false);
    }
  }, [toast]);

  useEffect(() => {
    // Initial fetch
    fetchAndCalculate();

    // Poll every 60 seconds
    pollRef.current = globalThis.setInterval(() => {
      fetchAndCalculate();
    }, 60 * 1000);

    return () => {
      if (pollRef.current) {
        globalThis.clearInterval(pollRef.current);
      }
    };
  }, [fetchAndCalculate]);

  const getDirectionLabel = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--gradient-sky)] overflow-hidden">
      {/* Header - Compact */}
      <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 shrink-0">
        <Link to="/">
          <Button variant="ghost" size="sm" className="hover:bg-card/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Full Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden sm:block">
            {usingRealData ? "🟢 Live" : "⚪ Waiting..."}
          </div>
          <WeatherSettings />
        </div>
      </div>

      {/* Top Section - 60% height, divided into 2 columns */}
      <div className="h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-2 px-3 md:px-4 pb-2">
        {/* Left: Compass */}
        <div className="flex items-center justify-center">
          <div className="scale-110 md:scale-125">
            <WindCompass direction={currentDirection} speed={currentSpeed} />
          </div>
        </div>

        {/* Right: Current Wind Speed */}
        <Card className="flex items-center justify-center shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <div className="flex flex-col items-center justify-center space-y-3 p-4">
            <div className="text-base md:text-lg text-muted-foreground">Current Speed</div>
            <Wind className="h-10 w-10 md:h-12 md:w-12 text-primary animate-pulse" />
            <div className="text-center space-y-1">
              <div className="text-6xl md:text-8xl font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none">
                {currentSpeed.toFixed(1)}
              </div>
              <div className="text-2xl md:text-3xl text-muted-foreground font-medium">mph</div>
              <div className="text-5xl md:text-7xl font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none mt-2">
                {getDirectionLabel(currentDirection)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section - Average speeds */}
      <div className="flex-1 px-3 md:px-4 pb-3 md:pb-4">
        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-2">
          <Card className="p-4 md:p-5 transition-all hover:shadow-md bg-gradient-to-br from-card to-card/80">
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-sm font-medium text-primary">Average</div>
                <div className="text-xs text-muted-foreground">Last 5 Minutes</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Speed</span>
                  </div>
                  <span className="text-3xl md:text-4xl font-bold text-foreground">
                    {avgSpeed5.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="font-medium text-foreground">mph</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-5 transition-all hover:shadow-md bg-gradient-to-br from-card to-card/80 ring-2 ring-primary scale-105">
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-sm font-medium text-primary">Average</div>
                <div className="text-xs text-muted-foreground">Last 10 Minutes</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Speed</span>
                  </div>
                  <span className="text-3xl md:text-4xl font-bold text-foreground">
                    {avgSpeed10.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="font-medium text-foreground">mph</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-5 transition-all hover:shadow-md bg-gradient-to-br from-card to-card/80">
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-sm font-medium text-primary">Average</div>
                <div className="text-xs text-muted-foreground">Last 20 Minutes</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Speed</span>
                  </div>
                  <span className="text-3xl md:text-4xl font-bold text-foreground">
                    {avgSpeed20.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="font-medium text-foreground">mph</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

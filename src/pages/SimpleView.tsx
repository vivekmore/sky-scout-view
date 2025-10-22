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
      {/* Header - Fixed height */}
      <div className="flex items-center justify-between p-4 md:p-6 shrink-0">
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
      <div className="h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-6">
        {/* Left: Compass */}
        <div className="flex items-center justify-center">
          <div className="scale-125 md:scale-150">
            <WindCompass direction={currentDirection} speed={currentSpeed} />
          </div>
        </div>

        {/* Right: Current Wind Speed */}
        <Card className="flex items-center justify-center shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="text-lg md:text-xl text-muted-foreground mt-2">Current Speed</div>
            <Wind className="h-12 w-12 md:h-16 md:w-16 text-primary animate-pulse" />
            <div className="text-center space-y-2">
              <div className="text-7xl md:text-9xl font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none">
                {currentSpeed.toFixed(1)}
              </div>
              <div className="text-3xl md:text-4xl text-muted-foreground font-medium">mph</div>
              <div className="text-7xl md:text-9xl font-bold bg-[var(--gradient-wind)] bg-clip-text leading-none">
                {getDirectionLabel(currentSpeed)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section - 40% height, average speeds */}
      <div className="flex-1 p-4 md:p-6">
        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 transition-all hover:shadow-md bg-gradient-to-br from-card to-card/80">
            <div className="space-y-4">
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

          <Card className="p-6 transition-all hover:shadow-md ring-2 ring-primary shadow-xl scale-105 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="space-y-4">
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

          <Card className="p-6 transition-all hover:shadow-md bg-gradient-to-br from-card to-card/80">
            <div className="space-y-4">
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

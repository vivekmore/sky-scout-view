import { useState, useEffect, useRef, useCallback } from "react";
import { weatherService } from "@/services/weatherService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { WeatherSettings } from "@/components/WeatherSettings";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function SimpleView() {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [avgDirection20, setAvgDirection20] = useState(0);
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

      const rawData = await weatherService.fetchDeviceData(config.macAddress, 288);
      if (!rawData || rawData.length === 0) {
        setUsingRealData(false);
        return;
      }

      const processed = weatherService.processWeatherData(rawData);
      const now = new Date();

      // Current speed (use most recent reading; Ambient Weather API typically returns newest first)
      if (processed.length > 0) {
        setCurrentSpeed(processed[0].windSpeed);
      }

      // Filter data by time ranges
      const last5mins = processed.filter(d => (now.getTime() - d.time.getTime()) <= 5 * 60 * 1000);
      const last10mins = processed.filter(d => (now.getTime() - d.time.getTime()) <= 10 * 60 * 1000);
      const last20mins = processed.filter(d => (now.getTime() - d.time.getTime()) <= 20 * 60 * 1000);

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

        // Average direction (simple mean; could be improved with circular averaging if needed)
        const avgDir = last20mins.reduce((sum, d) => sum + d.windDirection, 0) / last20mins.length;
        setAvgDirection20(avgDir);
      } else {
        setAvgSpeed20(0);
        setAvgDirection20(0);
      }

      setUsingRealData(true);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Data fetch error",
        description: error instanceof Error ? error.message : 'Unable to retrieve weather data',
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
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Full Dashboard
            </Button>
          </Link>
          <WeatherSettings />
        </div>

        {/* Status */}
        <div className="text-center text-sm text-muted-foreground">
          {usingRealData ? "Live data (polled) from Ambient Weather" : "Waiting for data..."}
        </div>

        {/* Current Wind Speed - Large Display */}
        <div className="text-center space-y-2">
          <div className="text-6xl md:text-9xl font-bold text-primary">
            {currentSpeed.toFixed(1)}
          </div>
          <div className="text-2xl md:text-3xl text-muted-foreground">mph</div>
          <div className="text-lg text-muted-foreground">Current Wind Speed</div>
        </div>

        {/* Average Direction - Medium */}
        <div className="text-center space-y-2 border-t border-border pt-8">
          <div className="text-4xl md:text-6xl font-bold text-foreground">
            {getDirectionLabel(avgDirection20)} ({Math.round(avgDirection20)}°)
          </div>
          <div className="text-lg text-muted-foreground">Average Direction (20 min)</div>
        </div>

        {/* Average Speeds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-8">
          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-foreground">
              {avgSpeed5.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">mph</div>
            <div className="text-base text-muted-foreground">Avg Speed (5 min)</div>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-foreground">
              {avgSpeed10.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">mph</div>
            <div className="text-base text-muted-foreground">Avg Speed (10 min)</div>
          </div>

          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-foreground">
              {avgSpeed20.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">mph</div>
            <div className="text-base text-muted-foreground">Avg Speed (20 min)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

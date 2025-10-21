import { useState, useEffect } from "react";
import { WindCompass } from "./WindCompass";
import { WindChart } from "./WindChart";
import { TimelineCard } from "./TimelineCard";
import { WeatherMetric } from "./WeatherMetric";
import { Wind, Eye, Droplets, Gauge } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Mock data generator (replace with actual API calls)
const generateMockData = () => {
  const now = new Date();
  const baseSpeed = 12;
  
  const timePoints = [
    { offset: -120, label: "2h ago" },
    { offset: -60, label: "1h ago" },
    { offset: -30, label: "30m ago" },
    { offset: -15, label: "15m ago" },
    { offset: 0, label: "Now" },
    { offset: 15, label: "+15m" },
    { offset: 60, label: "+1h" },
  ];
  
  return timePoints.map(({ offset, label }) => {
    const time = new Date(now.getTime() + offset * 60000);
    const variance = Math.random() * 4 - 2;
    const speed = Math.max(5, baseSpeed + variance);
    const gust = speed + Math.random() * 5 + 3;
    
    return {
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      relativeTime: label,
      windSpeed: Math.round(speed),
      windDirection: Math.round(180 + Math.random() * 60),
      gusts: Math.round(gust),
      rainChance: offset >= 0 ? Math.round(Math.random() * 30) : undefined,
      isCurrent: offset === 0,
      isForecast: offset > 0,
      speed,
      gust,
    };
  });
};

export const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(generateMockData());
  const [showApiInfo, setShowApiInfo] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setWeatherData(generateMockData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentData = weatherData.find(d => d.isCurrent);
  const chartData = weatherData.map(d => ({
    time: d.relativeTime,
    speed: d.speed,
    gust: d.gust,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Weather Station
          </h1>
          <p className="text-muted-foreground">Real-time wind conditions & forecast</p>
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* API Configuration Alert */}
        {showApiInfo && (
          <Alert className="border-primary/50 bg-primary/5">
            <AlertDescription className="flex items-center justify-between">
              <div className="text-sm">
                <strong>Demo Mode:</strong> Currently showing simulated data. Connect your Ambient Weather API key to display real weather data.
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowApiInfo(false)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
          <WeatherMetric
            icon={Eye}
            label="Visibility"
            value="10"
            unit="mi"
          />
          <WeatherMetric
            icon={Droplets}
            label="Rain Forecast"
            value="15"
            unit="%"
          />
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
          <h2 className="text-2xl font-bold text-foreground">Timeline</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {weatherData.map((data, idx) => (
                <TimelineCard key={idx} data={data} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

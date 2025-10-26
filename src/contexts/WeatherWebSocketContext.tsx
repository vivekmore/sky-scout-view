import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useAmbientWeatherWebSocket, WebSocketMessage } from "@/services/ambientWeatherWebSocket";

interface WeatherData {
  windSpeed: number;
  windDirection: number;
  windGust: number;
  timestamp: Date;
  macAddress?: string;
}

interface WeatherWebSocketContextValue {
  latestData: WeatherData | null;
  connectionStatus: string;
  isConnected: boolean;
  messageHistory: WeatherData[];
}

const WeatherWebSocketContext = createContext<WeatherWebSocketContextValue | undefined>(undefined);

interface WeatherWebSocketProviderProps {
  children: ReactNode;
}

export const WeatherWebSocketProvider = ({ children }: WeatherWebSocketProviderProps) => {
  const [latestData, setLatestData] = useState<WeatherData | null>(null);
  const [messageHistory, setMessageHistory] = useState<WeatherData[]>([]);

  const handleMessage = useCallback((data: WebSocketMessage) => {
    // Extract wind data from the message
    // Ambient Weather sends data with keys like windspeedmph, winddir, windgustmph
    if (data.windspeedmph !== undefined || data.winddir !== undefined) {
      const weatherData: WeatherData = {
        windSpeed: Number(data.windspeedmph) || 0,
        windDirection: Number(data.winddir) || 0,
        windGust: Number(data.windgustmph) || 0,
        timestamp: data.dateutc ? new Date(data.dateutc) : new Date(),
        macAddress: data.macAddress as string | undefined,
      };

      setLatestData(weatherData);

      // Keep last 100 weather data points for averaging
      setMessageHistory((prev) => {
        const updated = [weatherData, ...prev].slice(0, 100);
        return updated;
      });
    }
  }, []);

  const { connectionStatus, isConnected } = useAmbientWeatherWebSocket({
    onMessage: handleMessage,
    shouldConnect: true,
  });

  // Clean up old data (older than 30 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
      setMessageHistory((prev) =>
        prev.filter((data) => data.timestamp.getTime() > thirtyMinutesAgo)
      );
    }, 1000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <WeatherWebSocketContext.Provider
      value={{
        latestData,
        connectionStatus,
        isConnected,
        messageHistory,
      }}
    >
      {children}
    </WeatherWebSocketContext.Provider>
  );
};

export const useWeatherWebSocket = () => {
  const context = useContext(WeatherWebSocketContext);
  if (context === undefined) {
    throw new Error("useWeatherWebSocket must be used within a WeatherWebSocketProvider");
  }
  return context;
};

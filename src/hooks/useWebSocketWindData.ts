import { useCallback, useEffect, useReducer } from "react";
import { useWeatherWebSocket } from "@/contexts/WeatherWebSocketContext";
import type { WindState, WindDataHook, WindAverages } from "@/types/weather";

// Action types
type Action =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: Partial<WindState> }
  | { type: "ERROR"; error: string }
  | { type: "RESET" };

const initialState: WindState = {
  currentSpeed: 0,
  currentDirection: 0,
  avgSpeed5: 0,
  avgSpeed10: 0,
  avgSpeed20: 0,
  avgDirection5: 0,
  avgDirection10: 0,
  avgDirection20: 0,
  highSpeed5: 0,
  highSpeed10: 0,
  highSpeed20: 0,
  usingRealData: false,
  lastUpdated: null,
  isLoading: false,
  error: undefined,
};

function reducer(state: WindState, action: Action): WindState {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true, error: undefined };
    case "SUCCESS":
      return { ...state, ...action.payload, isLoading: false, error: undefined };
    case "ERROR":
      return { ...state, isLoading: false, error: action.error, usingRealData: false };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Compute wind averages from WebSocket history
function computeAverages(
  history: { timestamp: Date; windSpeed: number; windDirection: number }[],
  now: Date
): WindAverages {
  const windowMs = (m: number) => m * 60 * 1000;
  const byMinutes = (mins: number) =>
    history.filter((d) => now.getTime() - d.timestamp.getTime() <= windowMs(mins));

  const avg = (arr: { timestamp: Date; windSpeed: number }[]) =>
    arr.length > 0 ? arr.reduce((s, d) => s + d.windSpeed, 0) / arr.length : 0;

  // Vector averaging for wind direction (handles circular nature of angles)
  const avgDirection = (arr: { timestamp: Date; windDirection: number }[]) => {
    if (arr.length === 0) return 0;

    // Convert to radians and calculate x/y components
    let sumX = 0;
    let sumY = 0;
    arr.forEach((d) => {
      const rad = (d.windDirection * Math.PI) / 180;
      sumX += Math.cos(rad);
      sumY += Math.sin(rad);
    });

    const avgX = sumX / arr.length;
    const avgY = sumY / arr.length;

    // Convert back to degrees
    let angle = (Math.atan2(avgY, avgX) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    return angle;
  };

  const high = (arr: { timestamp: Date; windSpeed: number }[]) =>
    arr.length > 0 ? Math.max(...arr.map((d) => d.windSpeed)) : 0;

  return {
    avgSpeed5: avg(byMinutes(5)),
    avgSpeed10: avg(byMinutes(10)),
    avgSpeed20: avg(byMinutes(20)),
    avgDirection5: avgDirection(byMinutes(5)),
    avgDirection10: avgDirection(byMinutes(10)),
    avgDirection20: avgDirection(byMinutes(20)),
    highSpeed5: high(byMinutes(5)),
    highSpeed10: high(byMinutes(10)),
    highSpeed20: high(byMinutes(20)),
  };
}

export function useWebSocketWindData(): WindDataHook {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Get WebSocket data from context
  const {
    latestData: wsLatestData,
    messageHistory: wsHistory,
    isConnected: wsConnected,
  } = useWeatherWebSocket();

  // Update state when WebSocket data arrives
  useEffect(() => {
    if (!wsConnected) {
      dispatch({ type: "ERROR", error: "WebSocket not connected" });
      return;
    }

    if (wsLatestData) {
      const now = new Date();

      // Compute averages from WebSocket history
      const averages =
        wsHistory.length > 0
          ? computeAverages(wsHistory, now)
          : {
              avgSpeed5: 0,
              avgSpeed10: 0,
              avgSpeed20: 0,
              avgDirection5: 0,
              avgDirection10: 0,
              avgDirection20: 0,
              highSpeed5: 0,
              highSpeed10: 0,
              highSpeed20: 0,
            };

      dispatch({
        type: "SUCCESS",
        payload: {
          currentSpeed: wsLatestData.windSpeed,
          currentDirection: wsLatestData.windDirection,
          ...averages,
          usingRealData: true,
          lastUpdated: wsLatestData.timestamp,
        },
      });
    }
  }, [wsLatestData, wsHistory, wsConnected]);

  // Manual refresh is not applicable for WebSocket (it's real-time)
  const refresh = useCallback(async () => {
    // No-op for WebSocket - data comes automatically
    console.log("Refresh called on WebSocket wind data (no-op - data is real-time)");
  }, []);

  // Polling control is not applicable for WebSocket
  const setPollingEnabled = useCallback(() => {
    // No-op for WebSocket - no polling involved
  }, []);

  return { ...state, refresh, setPollingEnabled };
}

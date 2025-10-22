import { useCallback, useEffect, useReducer, useRef } from "react";
import { weatherService } from "@/services/weatherService";
import type { UseWindDataOptions, WindState, WindDataHook, WindAverages } from "@/types/weather";

// Action types emulate a potential future Redux slice
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

// Exported for potential unit tests
export function computeAverages(
  processed: { time: Date; windSpeed: number }[],
  now: Date
): WindAverages {
  const windowMs = (m: number) => m * 60 * 1000;
  const byMinutes = (mins: number) =>
    processed.filter((d) => now.getTime() - d.time.getTime() <= windowMs(mins));

  const avg = (arr: { time: Date; windSpeed: number }[]) =>
    arr.length > 0 ? arr.reduce((s, d) => s + d.windSpeed, 0) / arr.length : 0;

  return {
    avgSpeed5: avg(byMinutes(5)),
    avgSpeed10: avg(byMinutes(10)),
    avgSpeed20: avg(byMinutes(20)),
  };
}

export function useWindData(options: UseWindDataOptions = {}): WindDataHook {
  const { macAddress, pollIntervalMs = 60_000, recordWindow = 10 } = options;
  const [state, dispatch] = useReducer(reducer, initialState);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingEnabledRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      dispatch({ type: "LOADING" });
      const config = weatherService.getConfig();
      const resolvedMac = macAddress || config?.macAddress;
      if (!resolvedMac) {
        dispatch({ type: "ERROR", error: "Missing device MAC address" });
        return;
      }

      const raw = await weatherService.fetchDeviceData(resolvedMac, recordWindow);
      if (!raw || raw.length === 0) {
        dispatch({ type: "ERROR", error: "No data returned" });
        return;
      }

      const processed = weatherService.processWeatherData(raw);
      const now = new Date();

      const { avgSpeed5, avgSpeed10, avgSpeed20 } = computeAverages(processed, now);

      dispatch({
        type: "SUCCESS",
        payload: {
          currentSpeed: processed[0]?.windSpeed ?? 0,
          currentDirection: processed[0]?.windDirection ?? 0,
          avgSpeed5,
          avgSpeed10,
          avgSpeed20,
          usingRealData: true,
          lastUpdated: now,
        },
      });
    } catch (e) {
      dispatch({
        type: "ERROR",
        error: e instanceof Error ? e.message : "Unknown wind data error",
      });
    }
  }, [macAddress, recordWindow]);

  // Polling lifecycle
  useEffect(() => {
    refresh(); // initial
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(() => {
      if (pollingEnabledRef.current) refresh();
    }, pollIntervalMs);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh, pollIntervalMs]);

  const setPollingEnabled = useCallback((enabled: boolean) => {
    pollingEnabledRef.current = enabled;
  }, []);

  return { ...state, refresh, setPollingEnabled };
}

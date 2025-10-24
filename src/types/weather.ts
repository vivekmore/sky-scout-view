export interface WindSample {
  time: Date;
  windSpeed: number; // mph
  windDirection: number; // degrees
}

export interface WindAverages {
  avgSpeed5: number;
  avgSpeed10: number;
  avgSpeed20: number;
  avgDirection5: number;
  avgDirection10: number;
  avgDirection20: number;
}

export interface WindState extends WindAverages {
  currentSpeed: number;
  currentDirection: number;
  usingRealData: boolean;
  lastUpdated: Date | null;
  isLoading: boolean;
  error?: string;
}

export interface WindActions {
  refresh: () => Promise<void>;
  setPollingEnabled: (enabled: boolean) => void;
}

export interface UseWindDataOptions {
  /** mac address override; if omitted uses weatherService stored config */
  macAddress?: string;
  /** Polling interval in ms (default 60_000) */
  pollIntervalMs?: number;
  /** Number of records to request (default 10) */
  recordWindow?: number;
}

export type WindDataHook = WindState & WindActions;

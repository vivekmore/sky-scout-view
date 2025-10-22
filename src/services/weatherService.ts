interface AmbientWeatherConfig {
  apiKey: string;
  applicationKey: string;
  macAddress?: string;
}

interface AmbientWeatherData {
  dateutc: number;
  windspeedmph: number;
  winddir: number;
  windgustmph: number;
  hourlyrainin?: number;
  dailyrainin?: number;
  [key: string]: unknown;
}

interface AmbientWeatherDevice {
  macAddress: string;
  info?: unknown;
  lastData?: AmbientWeatherData;
  name?: string;
  [key: string]: unknown;
}

export interface ProcessedWeatherEntry {
  time: Date;
  windSpeed: number;
  windDirection: number;
  gusts: number;
  rainHourly: number;
  rainDaily: number;
}

const STORAGE_KEY = "ambient_weather_config";
const API_BASE_URL = "https://rt.ambientweather.net/v1";

export const weatherService = {
  ws: null as WebSocket | null,
  reconnectTimeout: null as NodeJS.Timeout | null,
  dataBuffer: [] as AmbientWeatherData[],
  saveConfig(config: AmbientWeatherConfig) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  getConfig(): AmbientWeatherConfig | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          apiKey: "0116a8e2bd0e41acb8df02b2821eedbbad89280a712f425b9b47809ee61bf5b2",
          applicationKey: "dd3dd1d0c9de43afb0a08324da83706dbe4fe8b4852349b88bddc2793ed14732",
          macAddress: "EC:64:C9:F1:82:EA",
        };
  },

  clearConfig() {
    localStorage.removeItem(STORAGE_KEY);
  },

  async fetchDevices(): Promise<AmbientWeatherDevice[]> {
    const config = this.getConfig();
    if (!config?.apiKey || !config?.applicationKey) {
      throw new Error("API credentials not configured");
    }

    const url = `${API_BASE_URL}/devices?applicationKey=${config.applicationKey}&apiKey=${config.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch devices: ${response.statusText}`);
    }

    return (await response.json()) as Promise<AmbientWeatherDevice[]>;
  },

  async fetchDeviceData(macAddress: string, limit: number = 288): Promise<AmbientWeatherData[]> {
    const config = this.getConfig();
    if (!config?.apiKey || !config?.applicationKey) {
      throw new Error("API credentials not configured");
    }

    const url = `${API_BASE_URL}/devices/${macAddress}?applicationKey=${config.applicationKey}&apiKey=${config.apiKey}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch device data: ${response.statusText}`);
    }

    return (await response.json()) as Promise<AmbientWeatherData[]>;
  },

  processWeatherData(data: AmbientWeatherData[]): ProcessedWeatherEntry[] {
    if (!data || data.length === 0) return [];

    return data.map((entry) => ({
      time: new Date(entry.dateutc),
      windSpeed: entry.windspeedmph || 0,
      windDirection: entry.winddir || 0,
      gusts: entry.windgustmph || 0,
      rainHourly: entry.hourlyrainin || 0,
      rainDaily: entry.dailyrainin || 0,
    }));
  },
};

// Mock data generator (replace with actual API calls)
export const mockData = () => {
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
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
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

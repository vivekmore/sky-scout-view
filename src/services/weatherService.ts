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

const STORAGE_KEY = 'ambient_weather_config';
const API_BASE_URL = 'https://rt.ambientweather.net/v1';
const WEBSOCKET_URL = 'wss://rt2.ambientweather.net/v1';

export const weatherService = {
  ws: null as WebSocket | null,
  reconnectTimeout: null as NodeJS.Timeout | null,
  dataBuffer: [] as AmbientWeatherData[],
  saveConfig(config: AmbientWeatherConfig) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  getConfig(): AmbientWeatherConfig | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
        apiKey: '0116a8e2bd0e41acb8df02b2821eedbbad89280a712f425b9b47809ee61bf5b2',
        applicationKey: 'dd3dd1d0c9de43afb0a08324da83706dbe4fe8b4852349b88bddc2793ed14732',
        macAddress: 'EC:64:C9:F1:82:EA'
    };
  },

  clearConfig() {
    localStorage.removeItem(STORAGE_KEY);
  },

  async fetchDevices(): Promise<AmbientWeatherDevice[]> {
    const config = this.getConfig();
    if (!config?.apiKey || !config?.applicationKey) {
      throw new Error('API credentials not configured');
    }

    const url = `${API_BASE_URL}/devices?applicationKey=${config.applicationKey}&apiKey=${config.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch devices: ${response.statusText}`);
    }

    return await response.json() as Promise<AmbientWeatherDevice[]>;
  },

  async fetchDeviceData(macAddress: string, limit: number = 288): Promise<AmbientWeatherData[]> {
    const config = this.getConfig();
    if (!config?.apiKey || !config?.applicationKey) {
      throw new Error('API credentials not configured');
    }

    const url = `${API_BASE_URL}/devices/${macAddress}?applicationKey=${config.applicationKey}&apiKey=${config.apiKey}&limit=${limit}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch device data: ${response.statusText}`);
    }

    return await response.json() as Promise<AmbientWeatherData[]>;
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

  connectWebSocket(onData: (data: AmbientWeatherData) => void, onError?: (error: any) => void) {
    const config = this.getConfig();
    if (!config?.apiKey || !config?.applicationKey) {
      throw new Error('API credentials not configured');
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const url = `${WEBSOCKET_URL}/subscribe?applicationKey=${config.applicationKey}&apiKey=${config.apiKey}`;
    console.log('Connecting to Ambient Weather WebSocket...');
    
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected to Ambient Weather');
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket data received:', data);
        
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach((deviceData: AmbientWeatherData) => {
            this.dataBuffer.unshift(deviceData);
            if (this.dataBuffer.length > 50) {
              this.dataBuffer = this.dataBuffer.slice(0, 50);
            }
            onData(deviceData);
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError?.(error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed, reconnecting in 5s...');
      this.reconnectTimeout = setTimeout(() => {
        this.connectWebSocket(onData, onError);
      }, 5000);
    };
  },

  disconnectWebSocket() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.dataBuffer = [];
  },

  getBufferedData() {
    return this.dataBuffer;
  }
};

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
  [key: string]: any;
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
    return stored ? JSON.parse(stored) : null;
  },

  clearConfig() {
    localStorage.removeItem(STORAGE_KEY);
  },

  async fetchDevices(): Promise<any[]> {
    const config = this.getConfig();
    if (!config?.apiKey || !config?.applicationKey) {
      throw new Error('API credentials not configured');
    }

    const url = `${API_BASE_URL}/devices?applicationKey=${config.applicationKey}&apiKey=${config.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch devices: ${response.statusText}`);
    }

    return response.json();
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

    return response.json();
  },

  processWeatherData(data: AmbientWeatherData[]) {
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

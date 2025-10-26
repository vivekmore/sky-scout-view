import { useEffect, useCallback, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { weatherService } from "./weatherService";

const WS_BASE_URL = "https://rt2.ambientweather.net";

export interface WebSocketMessage {
  method?: string;
  command?: string;
  event?: string;
  apiKey?: string;
  apiKeys?: string[];
  devices?: string[];
  device?: string;
  dateutc?: number;
  macAddress?: string;
  [key: string]: unknown;
}

export interface UseAmbientWeatherWebSocketOptions {
  onMessage?: (data: WebSocketMessage) => void;
  onSubscribed?: (devices: unknown) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  shouldConnect?: boolean;
}

type ConnectionStatus = "Connecting" | "Connected" | "Disconnected" | "Error";

export const useAmbientWeatherWebSocket = (options: UseAmbientWeatherWebSocketOptions = {}) => {
  const {
    onMessage,
    onSubscribed,
    onError,
    onConnect,
    onDisconnect,
    shouldConnect = true,
  } = options;

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("Disconnected");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const config = weatherService.getConfig();

  useEffect(() => {
    if (!config?.apiKey || !config?.applicationKey || !shouldConnect) {
      return;
    }

    // Construct Socket.IO URL with query parameters
    const socketUrl = `${WS_BASE_URL}/?api=1&applicationKey=${config.applicationKey}`;

    console.log("Connecting to Ambient Weather Socket.IO:", socketUrl);
    setConnectionStatus("Connecting");

    // Create Socket.IO connection
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Socket.IO connected to Ambient Weather");
      setConnectionStatus("Connected");
      setIsConnected(true);
      onConnect?.();

      // Subscribe using the apiKey
      console.log("Subscribing with apiKey:", config.apiKey);
      socket.emit("subscribe", { apiKeys: [config.apiKey] });
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
      setConnectionStatus("Disconnected");
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setConnectionStatus("Error");
      setIsConnected(false);
      onError?.(error);
    });

    // Listen for subscribed event
    socket.on("subscribed", (data: unknown) => {
      console.log("Successfully subscribed to devices:", data);
      onSubscribed?.(data);
    });

    // Listen for data events (weather updates)
    socket.on("data", (data: WebSocketMessage) => {
      console.log("Received weather data:", data);
      onMessage?.(data);
    });

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up Socket.IO connection");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    config?.apiKey,
    config?.applicationKey,
    shouldConnect,
    onMessage,
    onSubscribed,
    onError,
    onConnect,
    onDisconnect,
  ]);

  const subscribe = useCallback(
    (apiKeys: string[]) => {
      if (socketRef.current && isConnected) {
        console.log("Subscribing to apiKeys:", apiKeys);
        socketRef.current.emit("subscribe", { apiKeys });
      } else {
        console.warn("Cannot subscribe: Socket not connected");
      }
    },
    [isConnected]
  );

  const unsubscribe = useCallback(
    (apiKeys: string[]) => {
      if (socketRef.current && isConnected) {
        console.log("Unsubscribing from apiKeys:", apiKeys);
        socketRef.current.emit("unsubscribe", { apiKeys });
      } else {
        console.warn("Cannot unsubscribe: Socket not connected");
      }
    },
    [isConnected]
  );

  return {
    connectionStatus,
    isConnected,
    subscribe,
    unsubscribe,
    socket: socketRef.current,
  };
};

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Radio } from "lucide-react";
import { useAmbientWeatherWebSocket, WebSocketMessage } from "@/services/ambientWeatherWebSocket";

interface MessageLog {
  id: string;
  timestamp: Date;
  data: WebSocketMessage;
}

export const WebSocketMonitor = () => {
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMessage = useCallback((data: WebSocketMessage) => {
    const newMessage: MessageLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      data,
    };
    setMessages((prev) => [newMessage, ...prev].slice(0, 100)); // Keep only last 100 messages
  }, []);

  const handleSubscribed = useCallback((data: unknown) => {
    const newMessage: MessageLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      data: { event: "subscribed", ...data } as WebSocketMessage,
    };
    setMessages((prev) => [newMessage, ...prev].slice(0, 100));
  }, []);

  const { connectionStatus, isConnected } = useAmbientWeatherWebSocket({
    onMessage: handleMessage,
    onSubscribed: handleSubscribed,
    shouldConnect: true,
  });

  const handleClear = () => {
    setMessages([]);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "Connected":
        return "bg-green-500";
      case "Connecting":
        return "bg-yellow-500";
      case "Disconnected":
        return "bg-gray-500";
      case "Error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              WebSocket Monitor
            </CardTitle>
            <CardDescription>Real-time messages from Ambient Weather</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="gap-1">
              <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              {connectionStatus}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={messages.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">No messages received yet. Waiting for data...</p>
            </div>
          ) : (
            <div className="space-y-3" ref={scrollRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {msg.timestamp.toLocaleTimeString()}
                    </Badge>
                    {(msg.data.method || msg.data.event) && (
                      <Badge variant="secondary" className="text-xs">
                        {msg.data.method || msg.data.event}
                      </Badge>
                    )}
                  </div>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(msg.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="mt-2 text-xs text-muted-foreground text-right">
          {messages.length > 0 && `${messages.length} message${messages.length !== 1 ? "s" : ""}`}
        </div>
      </CardContent>
    </Card>
  );
};

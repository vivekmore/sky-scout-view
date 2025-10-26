import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocketWindData } from "@/hooks/useWebSocketWindData";
import { useWindData } from "@/hooks/useWindData";
import { WindCompass } from "@/components/WindCompass";
import { CurrentWindPanel } from "@/components/wind";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataSource } from "@/components/DataSourceSelector";

export default function SimpleView() {
  const [dataSource, setDataSource] = useState<DataSource>("websocket");

  // WebSocket data
  const wsData = useWebSocketWindData();

  // REST API data
  const restData = useWindData({ pollIntervalMs: 10_000 });

  // Use the selected data source
  const {
    currentSpeed,
    currentDirection,
    avgSpeed5,
    avgSpeed10,
    avgSpeed20,
    avgDirection5,
    avgDirection10,
    avgDirection20,
    usingRealData,
    error,
    isLoading,
    lastUpdated,
    refresh,
  } = dataSource === "websocket" ? wsData : restData;

  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Data fetch error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <AppLayout
      usingRealData={usingRealData}
      isLoading={isLoading}
      lastUpdated={lastUpdated || null}
      onRefresh={refresh}
      dataSource={dataSource}
      onDataSourceChange={setDataSource}
      className="bg-[var(--gradient-sky)]"
    >
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr min-h-0">
        <div className="flex h-full">
          <WindCompass variant="panel" direction={currentDirection} speed={currentSpeed} />
        </div>
        <div className="flex h-full">
          <CurrentWindPanel
            className="w-full h-full"
            speed={currentSpeed}
            direction={currentDirection}
            avgSpeed5={avgSpeed5}
            avgSpeed10={avgSpeed10}
            avgSpeed20={avgSpeed20}
            avgDirection5={avgDirection5}
            avgDirection10={avgDirection10}
            avgDirection20={avgDirection20}
          />
        </div>
      </div>
    </AppLayout>
  );
}

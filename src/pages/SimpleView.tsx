import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWindData } from "@/hooks/useWindData";
import { WindCompass } from "@/components/WindCompass";
import { CurrentWindPanel } from "@/components/wind";
import { AppLayout } from "@/components/layout/AppLayout";

export default function SimpleView() {
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
  } = useWindData();

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

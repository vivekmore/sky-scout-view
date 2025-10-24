import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useWindData } from "@/hooks/useWindData";
import { Button } from "@/components/ui/button";
import { WeatherSettings } from "@/components/WeatherSettings";
import { WindCompass } from "@/components/WindCompass";
import { CurrentWindPanel, WindStatusIndicator } from "@/components/wind";
import { ArrowLeft } from "lucide-react";

export default function SimpleView() {
  // Centralized wind data hook (future Redux adapter could replace this)
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

  // Surface errors via toast layer
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
    <div className="h-screen flex flex-col bg-[var(--gradient-sky)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 shrink-0">
        <Link to="/">
          <Button variant="ghost" size="sm" className="hover:bg-card/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Full Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <WindStatusIndicator
            className="text-xs md:text-sm text-muted-foreground hidden sm:block"
            usingRealData={usingRealData}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
          />
          <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          <WeatherSettings />
        </div>
      </div>

      {/* Main Content */}
      {/* Make two columns that each fill remaining vertical space; each box fills its column */}
      <div className="flex-1 h-full grid grid-cols-2 gap-4 px-4 pb-4 min-h-0 auto-rows-fr">
        {/* Compass Column */}
        <div className="h-full flex">
          <div className="w-full h-full flex items-center justify-center rounded-lg bg-card/80 backdrop-blur shadow-[var(--shadow-card)]">
            <div className="w-full h-full flex items-center justify-center">
              <div className="scale-110 md:scale-125">
                <WindCompass direction={currentDirection} speed={currentSpeed} />
              </div>
            </div>
          </div>
        </div>
        {/* Current Wind Column */}
        <div className="h-full flex">
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
    </div>
  );
}

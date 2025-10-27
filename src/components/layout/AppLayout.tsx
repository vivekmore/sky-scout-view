import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WeatherSettings } from "@/components/WeatherSettings";
import { WindStatusIndicator } from "@/components/wind";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Instagram, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AppLayoutProps {
  children: ReactNode;
  usingRealData?: boolean;
  isLoading?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  jumpRun?: number | null;
  onJumpRunChange?: (value: number | null) => void;
  className?: string;
}

export function AppLayout({
  children,
  usingRealData,
  isLoading,
  lastUpdated,
  onRefresh,
  jumpRun,
  onJumpRunChange,
  className,
}: Readonly<AppLayoutProps>) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(jumpRun?.toString() || "");

  const handleSave = () => {
    const value = Number.parseInt(inputValue);
    if (!Number.isNaN(value) && value >= 0 && value <= 360) {
      onJumpRunChange?.(value);
      setOpen(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onJumpRunChange?.(null);
    setOpen(false);
  };
  return (
    <div className={cn("h-screen flex flex-col overflow-hidden bg-[var(--gradient-sky)]", className)}>
      <header className="shrink-0 px-2 py-1.5 sm:px-3 sm:py-2 border-b border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/"
              className="font-bold text-base sm:text-lg md:text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight"
            >
              Weather Station
            </Link>
            <nav className="flex gap-2">&nbsp;</nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {(usingRealData !== undefined || isLoading !== undefined || lastUpdated) && (
              <WindStatusIndicator
                className="hidden md:block text-xs md:text-sm text-muted-foreground"
                usingRealData={!!usingRealData}
                isLoading={!!isLoading}
                lastUpdated={lastUpdated ?? null}
              />
            )}
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="order-2 md:order-none"
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            )}
            {onJumpRunChange && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant={jumpRun !== null && jumpRun !== undefined ? "default" : "outline"}
                    size="sm"
                    className="gap-2 order-3 md:order-none"
                  >
                    <Target className="w-4 h-4" />
                    {jumpRun !== null && jumpRun !== undefined
                      ? `Jump Run: ${jumpRun}°`
                      : "Set Jump Run"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Jump Run</DialogTitle>
                    <DialogDescription>
                      Enter the jump run direction (0-360 degrees)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="jumpRun">Direction (degrees)</Label>
                      <Input
                        id="jumpRun"
                        type="number"
                        min="0"
                        max="360"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="0-360"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={handleClear}>
                        Clear
                      </Button>
                      <Button onClick={handleSave}>Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <WeatherSettings />
          </div>
        </div>
      </header>
      <main className="flex-1 min-h-0 overflow-hidden p-1.5 sm:p-2 md:p-3 flex flex-col">{children}</main>
      {/* Footer */}
      <footer className="shrink-0 py-1.5 px-2 sm:px-4 text-[10px] sm:text-xs text-muted-foreground border-t border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 flex items-center justify-center pb-[calc(env(safe-area-inset-bottom)+0.25rem)]">
        <div className="flex items-center gap-1 flex-wrap justify-center text-center">
          <span className="font-medium text-foreground/80">Made with ❤️ by</span>
          <a
            href="https://instagram.com/maverick_skysurfer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-semibold text-foreground hover:text-accent transition-colors"
          >
            <Instagram className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            @maverick_skysurfer
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

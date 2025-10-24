import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WeatherSettings } from "@/components/WeatherSettings";
import { WindStatusIndicator } from "@/components/wind";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Instagram } from "lucide-react"; // added

interface AppLayoutProps {
  children: ReactNode;
  usingRealData?: boolean;
  isLoading?: boolean;
  lastUpdated?: Date | null; // restrict to Date|null for WindStatusIndicator compatibility
  onRefresh?: () => void;
  className?: string;
}

export function AppLayout({
  children,
  usingRealData,
  isLoading,
  lastUpdated,
  onRefresh,
  className,
}: AppLayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-[var(--gradient-sky)]", className)}>
      <header className="shrink-0 px-3 py-2 md:px-6 md:py-4 border-b border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/"
              className="font-bold text-xl md:text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight"
            >
              Weather Station
            </Link>
            <nav className="flex gap-2">&nbsp;</nav>
          </div>
          <div className="flex items-center gap-3">
            {(usingRealData !== undefined || isLoading !== undefined || lastUpdated) && (
              <WindStatusIndicator
                className="hidden md:block text-xs md:text-sm text-muted-foreground"
                usingRealData={!!usingRealData}
                isLoading={!!isLoading}
                lastUpdated={lastUpdated ?? null}
              />
            )}
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            )}
            <WeatherSettings />
          </div>
        </div>
      </header>
      <main className="flex-1 min-h-0 p-2 flex flex-col">{children}</main>
      {/* New footer */}
      <footer className="shrink-0 py-3 px-6 text-sm text-muted-foreground border-t border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 flex flex-col sm:flex-row gap-2 items-center justify-center">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-center text-foreground/80">Made with ❤️ by</span>
          <a
            href="https://instagram.com/maverick_skysurfer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-accent transition-colors"
          >
            <Instagram className="w-4 h-4" aria-hidden="true" />
            @maverick_skysurfer
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

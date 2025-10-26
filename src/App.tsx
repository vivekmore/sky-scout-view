import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherWebSocketProvider } from "@/contexts/WeatherWebSocketContext";
import Index from "./pages/Index";
import SimpleView from "./pages/SimpleView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function computeBasename(): string {
  const raw = import.meta.env.BASE_URL || "/"; // e.g. '/', './', '/repo/'
  if (raw === "/" || raw === "./") return ""; // root or relative build => no basename
  // Strip trailing slashes but keep a single leading slash for subpath (e.g. /repo)
  return raw.replace(/\/+$/, "").replace(/^(?!\/)/, "/");
}

const basename = computeBasename();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WeatherWebSocketProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<SimpleView />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WeatherWebSocketProvider>
  </QueryClientProvider>
);

export default App;

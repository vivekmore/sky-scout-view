import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SimpleView from "./pages/SimpleView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function computeBasename(): string {
  if (import.meta.env.DEV) return "";
  const host = globalThis.location?.hostname || "";
  if (host.endsWith(".github.io")) {
    const parts = (globalThis.location?.pathname || "").split("/").filter(Boolean);
    if (parts.length > 0) return `/${parts[0]}`;
  }
  return "";
}

const basename = computeBasename();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;

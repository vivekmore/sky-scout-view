import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SimpleView from "./pages/SimpleView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Remove trailing slash from Vite base for React Router basename
const basename = import.meta.env.BASE_URL.replace(/\/+$/, "");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Use Vite's BASE_URL so routing works when served from /<repo-name> on GitHub Pages */}
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<SimpleView />} />
          <Route path="/dashboard" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

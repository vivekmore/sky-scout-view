import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <AppLayout>
      <div className="flex h-full items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="mb-4 text-6xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            404
          </h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/80 font-medium">
            Return to Home
          </a>
        </div>
      </div>
    </AppLayout>
  );
};

export default NotFound;

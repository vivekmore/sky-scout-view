import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Check, AlertCircle } from "lucide-react";
import { weatherService } from "@/services/weatherService";
import { useToast } from "@/hooks/use-toast";

export const WeatherSettings = () => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [applicationKey, setApplicationKey] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const config = weatherService.getConfig();
    if (config) {
      setApiKey(config.apiKey);
      setApplicationKey(config.applicationKey);
      setMacAddress(config.macAddress || "");
      setIsConfigured(true);
    }
  }, [open]);

  const handleSave = async () => {
    if (!apiKey.trim() || !applicationKey.trim()) {
      toast({
        title: "Missing credentials",
        description: "Please provide both API Key and Application Key",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      weatherService.saveConfig({ apiKey, applicationKey, macAddress: macAddress || undefined });
      
      // Test the connection
      const devices = await weatherService.fetchDevices();
      
      setIsConfigured(true);
      toast({
        title: "Settings saved!",
        description: `Connected successfully. Found ${devices.length} device(s).`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    weatherService.clearConfig();
    setApiKey("");
    setApplicationKey("");
    setMacAddress("");
    setIsConfigured(false);
    toast({
      title: "Settings cleared",
      description: "API credentials removed from browser storage",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isConfigured ? "outline" : "default"} size="sm" className="gap-2">
          {isConfigured ? (
            <>
              <Check className="w-4 h-4" />
              API Connected
            </>
          ) : (
            <>
              <Settings className="w-4 h-4" />
              Configure API
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ambient Weather API Settings</DialogTitle>
          <DialogDescription>
            Enter your Ambient Weather API credentials to fetch real-time weather data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Get your API keys:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Visit <a href="https://ambientweather.net/account" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ambientweather.net/account</a></li>
                <li>Log in to your account</li>
                <li>Find your API Key and Application Key</li>
              </ol>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationKey">Application Key</Label>
            <Input
              id="applicationKey"
              type="password"
              placeholder="Enter your Application Key"
              value={applicationKey}
              onChange={(e) => setApplicationKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="macAddress">MAC Address (Optional)</Label>
            <Input
              id="macAddress"
              placeholder="Device MAC address (auto-detect if empty)"
              value={macAddress}
              onChange={(e) => setMacAddress(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-select your first device
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          {isConfigured && (
            <Button variant="outline" onClick={handleClear}>
              Clear Settings
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isTesting}>
              {isTesting ? "Testing..." : "Save & Test"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

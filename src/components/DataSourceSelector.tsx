import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2, Radio, Database } from "lucide-react";

export type DataSource = "websocket" | "rest";

interface DataSourceSelectorProps {
  value: DataSource;
  onChange: (source: DataSource) => void;
}

export const DataSourceSelector = ({ value, onChange }: DataSourceSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (source: DataSource) => {
    onChange(source);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">Data Source</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Data Source</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSelect("websocket")} className="cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">WebSocket</span>
                <span className="text-xs text-muted-foreground">Real-time updates</span>
              </div>
            </div>
            {value === "websocket" && (
              <Badge variant="default" className="ml-2">
                Active
              </Badge>
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("rest")} className="cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">REST API</span>
                <span className="text-xs text-muted-foreground">Polling every minute</span>
              </div>
            </div>
            {value === "rest" && (
              <Badge variant="default" className="ml-2">
                Active
              </Badge>
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

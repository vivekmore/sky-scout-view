import React from "react";

interface WindStatusIndicatorProps {
  usingRealData: boolean;
  isLoading: boolean;
  lastUpdated: Date | null;
  className?: string;
}

export const WindStatusIndicator: React.FC<WindStatusIndicatorProps> = ({
  usingRealData,
  isLoading,
  lastUpdated,
  className,
}) => {
  let status: string;
  if (usingRealData) status = "🟢 Live";
  else if (isLoading) status = "⏳ Loading";
  else status = "⚪ Waiting";

  return (
    <div className={className}>
      <span>{status}</span>
      {lastUpdated && (
        <span className="ml-2 opacity-70">
          {lastUpdated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </div>
  );
};

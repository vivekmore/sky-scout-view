import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Shared panel container to unify visual style across dashboard panels.
 * Provides gradient background, blur, shadow, and flexible centering.
 */
export interface PanelContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** If true, centers children with flex; otherwise children render normally */
  center?: boolean;
  /** Optional disable padding; default includes p-4 */
  noPadding?: boolean;
}

export const PanelContainer = React.forwardRef<HTMLDivElement, PanelContainerProps>(
  ({ className, children, center = false, noPadding = false, ...rest }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-card/80 backdrop-blur h-full w-full",
          center && "flex items-center justify-center",
          !noPadding && "p-4",
          className
        )}
        {...rest}
      >
        {children}
      </Card>
    );
  }
);
PanelContainer.displayName = "PanelContainer";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const separatorVariants = cva("shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-[1px] w-full bg-border",
      vertical: "h-full w-[1px] bg-border",
    },
    decorative: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    decorative: true,
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof separatorVariants> {}

const Separator = React.forwardRef<
  HTMLDivElement,
  SeparatorProps
>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(separatorVariants({ orientation, decorative, className }))}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };

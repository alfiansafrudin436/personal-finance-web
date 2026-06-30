import * as React from "react";
import { cn } from "@/lib/utils";
import { FormInputProps } from "./FormInput";

export interface FormGroupProps extends Omit<FormInputProps, "label"> {
  label?: string;
  error?: string;
  className?: string;
  children?: React.ReactNode;
}

const FormGroup = React.forwardRef<HTMLInputElement, FormGroupProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
          >
            {label}
          </label>
        )}
        {children || (
          <input
            ref={ref}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500",
            )}
            {...props}
          />
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
FormGroup.displayName = "FormGroup";

export { FormGroup };

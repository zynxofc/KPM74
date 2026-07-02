import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, error, checked, onChange, ...props }, ref) => {
    return (
      <div className={cn("space-y-1 w-full", className)}>
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">
              {label}
            </span>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-450">{description}</p>
            )}
          </div>
          
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={checked}
              onChange={onChange}
              ref={ref}
              {...props}
            />
            {/* Toggle bar */}
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-secondary"></div>
          </div>
        </label>
        {error && (
          <p className="text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

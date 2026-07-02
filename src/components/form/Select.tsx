import * as React from "react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">
            {label}
          </label>
        )}
        <select
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-all focus:outline-none focus-visible:ring-2 cursor-pointer",
            error 
              ? "border-red-500 focus-visible:ring-red-500/50" 
              : "border-slate-300 dark:border-slate-700 focus-visible:ring-primary dark:focus-visible:ring-secondary",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

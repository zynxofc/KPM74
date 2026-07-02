import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <Calendar className="w-4 h-4" />
          </span>
          <input
            type="date"
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-all focus:outline-none focus-visible:ring-2",
              error 
                ? "border-red-500 focus-visible:ring-red-500/50" 
                : "border-slate-300 dark:border-slate-700 focus-visible:ring-primary dark:focus-visible:ring-secondary",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

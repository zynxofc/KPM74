import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, checked, onChange, ...props }, ref) => {
    return (
      <div className={cn("space-y-1", className)}>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={checked}
              onChange={onChange}
              ref={ref}
              {...props}
            />
            {/* Custom Checkbox Frame */}
            <div className="w-5 h-5 rounded-md border border-slate-350 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 peer-checked:bg-primary dark:peer-checked:bg-secondary peer-checked:border-primary dark:peer-checked:border-secondary flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-primary dark:peer-focus-visible:ring-secondary">
              {/* Checkmark icon inside */}
              <svg
                className="w-3 h-3 text-white hidden peer-checked:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {label}
          </span>
        </label>
        {error && (
          <p className="text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

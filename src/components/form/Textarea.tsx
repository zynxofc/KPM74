import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-all focus:outline-none focus-visible:ring-2 min-h-[100px]",
            error 
              ? "border-red-500 focus-visible:ring-red-500/50" 
              : "border-slate-300 dark:border-slate-700 focus-visible:ring-primary dark:focus-visible:ring-secondary",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

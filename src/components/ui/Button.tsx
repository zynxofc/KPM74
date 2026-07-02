"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  shineEffect?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", shineEffect = false, children, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-97 disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-secondary focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg",
      secondary: "bg-secondary text-white hover:bg-teal-600 shadow-md hover:shadow-lg",
      glass: "glass-button text-slate-800 dark:text-slate-100",
      outline: "border-2 border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200",
      ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-xl",
      md: "px-6 py-3 text-base rounded-button",
      lg: "px-8 py-4 text-lg rounded-2xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyle,
          variants[variant],
          sizes[size],
          shineEffect && "relative overflow-hidden group",
          className
        )}
        {...props}
      >
        {children}
        {shineEffect && (
          <span className="absolute top-0 left-[-150%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] transition-all duration-75 group-hover:left-[150%] group-hover:transition-all group-hover:duration-700 pointer-events-none" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

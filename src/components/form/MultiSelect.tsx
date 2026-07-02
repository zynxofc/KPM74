"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Pilih beberapa opsi...",
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeOption = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt);

  return (
    <div className="space-y-1.5 w-full relative" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">
          {label}
        </label>
      )}

      {/* Select Box Frame */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-3 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-all focus:outline-none focus-visible:ring-2 flex flex-wrap gap-1.5 items-center justify-between cursor-pointer min-h-[46px]",
          error 
            ? "border-red-500 focus-visible:ring-red-500/50" 
            : "border-slate-300 dark:border-slate-700 focus-visible:ring-primary dark:focus-visible:ring-secondary"
        )}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex flex-wrap gap-1.5 flex-grow">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary border border-primary/20 dark:border-secondary/20"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => removeOption(opt.value, e)}
                  className="hover:text-red-500 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-slate-400 dark:text-slate-500 text-sm select-none">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-455 shrink-0 transition-transform", isOpen && "transform rotate-180")} />
      </div>

      {/* Dropdown Options Box */}
      {isOpen && (
        <div className="absolute top-[100%] left-0 right-0 z-50 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl max-h-60 overflow-y-auto p-1.5 space-y-0.5">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer select-none flex items-center justify-between",
                  isSelected
                    ? "bg-slate-100 dark:bg-slate-800 text-primary dark:text-secondary font-semibold"
                    : "text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                )}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-secondary" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
};

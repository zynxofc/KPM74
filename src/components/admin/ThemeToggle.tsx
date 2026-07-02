"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/utils";

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Terang", icon: <Sun className="w-4 h-4" /> },
  { value: "dark", label: "Gelap", icon: <Moon className="w-4 h-4" /> },
  { value: "system", label: "Sistem", icon: <Monitor className="w-4 h-4" /> },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Pilih tema tampilan"
      className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5"
    >
      {themes.map((t) => (
        <button
          key={t.value}
          type="button"
          title={t.label}
          aria-pressed={theme === t.value}
          onClick={() => setTheme(t.value)}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary",
            theme === t.value
              ? "bg-white dark:bg-slate-700 text-primary dark:text-secondary shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

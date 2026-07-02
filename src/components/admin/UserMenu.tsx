"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth/actions";

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary flex items-center justify-center font-bold text-sm border border-primary/20 dark:border-secondary/20">
          AD
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-slate-850 dark:text-slate-200 leading-none">Admin Desa</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Single Administrator</span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-500 transition-transform",
            isOpen && "transform rotate-180"
          )}
        />
      </button>

      {/* Profile Dropdown Container */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 glass-card shadow-2xl p-2 space-y-0.5 z-50">
          <div className="px-3 py-2 border-b border-slate-200/40 dark:border-slate-800/40 mb-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Admin Desa Suka Maju</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">Single Administrator</p>
          </div>

          <Link
            href="/admin/pengaturan"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-650 dark:text-slate-350 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-semibold"
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </Link>

          {/* Logout via Server Action form — no client-side redirect or window.location */}
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-xs font-semibold text-left focus:outline-none cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

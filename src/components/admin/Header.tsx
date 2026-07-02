"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { Drawer } from "../ui/Drawer";
import { Sidebar } from "./Sidebar";

export const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="h-16 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md flex items-center justify-between px-6 z-40 relative">
      {/* Left: Hamburger (Mobile) & Breadcrumbs (Desktop) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-slate-700 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
          aria-label="Buka navigasi sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:block">
          <Breadcrumb />
        </div>
      </div>

      {/* Right: Theme Toggle + User Menu */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        title="Menu Navigasi"
        position="left"
        className="max-w-[280px] p-0"
      >
        <Sidebar onLinkClick={() => setIsMobileOpen(false)} />
      </Drawer>
    </header>
  );
};

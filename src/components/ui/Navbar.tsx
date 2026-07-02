"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { navigationConfig } from "@/lib/config";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { navLinks } = navigationConfig;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 md:px-8">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "w-full max-w-7xl rounded-full transition-all duration-300 px-6 py-3 flex items-center justify-between",
          isScrolled 
            ? "glass-navbar py-3 shadow-lg border-slate-200/40 dark:border-slate-800/40" 
            : "bg-transparent border-transparent py-4"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LinTree KPM
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:text-primary dark:hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 dark:focus-visible:ring-secondary/45",
                  isActive
                    ? "text-primary dark:text-secondary bg-primary/10 dark:bg-secondary/10"
                    : "text-slate-600 dark:text-slate-300"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Link href="/login">
            <Button variant="glass" size="sm" shineEffect className="flex items-center gap-1">
              Admin Portal <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-700 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 z-40 glass-navbar p-6 rounded-3xl shadow-xl flex flex-col md:hidden space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 dark:focus-visible:ring-secondary/45",
                      isActive
                        ? "text-primary dark:text-secondary bg-primary/10 dark:bg-secondary/10"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <hr className="border-slate-200/50 dark:border-slate-800/50" />
            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="primary" className="w-full justify-center">
                Admin Portal
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  // If we are just on /admin, return home breadcrumb
  const isOnlyAdmin = paths.length === 1 && paths[0] === "admin";

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
      <Link href="/admin" className="hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" /> Dashboard
      </Link>
      {!isOnlyAdmin &&
        paths.map((p, idx) => {
          if (p === "admin") return null;
          
          const isLast = idx === paths.length - 1;
          const href = `/${paths.slice(0, idx + 1).join("/")}`;
          const label = p.charAt(0).toUpperCase() + p.slice(1).replace("-", " ");

          return (
            <React.Fragment key={href}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {isLast ? (
                <span className="text-slate-800 dark:text-white font-bold">{label}</span>
              ) : (
                <Link href={href} className="hover:text-slate-800 dark:hover:text-white transition-colors">
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
    </nav>
  );
};

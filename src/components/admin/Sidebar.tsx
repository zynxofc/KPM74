"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Image as ImageIcon,
  Newspaper,
  HelpCircle,
  Map,
  Settings,
  LogOut,
  ArrowLeft,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth/actions";

interface SidebarProps {
  onLinkClick?: () => void;
}

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Anggota", href: "/admin/anggota", icon: Users },
  { label: "Program Kerja", href: "/admin/program-kerja", icon: FolderKanban },
  { label: "Galeri", href: "/admin/galeri", icon: ImageIcon },
  { label: "Berita", href: "/admin/berita", icon: Newspaper },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Peta Lokasi", href: "/admin/peta-lokasi", icon: Map },
  { label: "Activity Log", href: "/admin/activity-log", icon: ScrollText },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const pathname = usePathname();

  return (
    <aside className="w-full h-full bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight text-white">
          LinTree Admin
        </span>
        <Link
          href="/"
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="Lihat Website Utama"
          onClick={onLinkClick}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto" aria-label="Menu navigasi admin">
        {sidebarLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50",
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — Logout via Server Action */}
      <div className="p-4 border-t border-slate-800">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
};

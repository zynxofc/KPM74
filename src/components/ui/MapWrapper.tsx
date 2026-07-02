"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { MapLocation } from "@/db/schema";

// Dynamic import with no SSR to prevent 'window is not defined' Leaflet error on server builds
const Map = dynamic(() => import("@/components/ui/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] rounded-3xl bg-slate-200/40 dark:bg-slate-900/40 backdrop-blur-sm animate-pulse flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50">
      <div className="text-center space-y-3">
        <MapPin className="w-10 h-10 text-primary dark:text-secondary animate-bounce mx-auto" />
        <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Memuat Peta Interaktif Desa...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  locations: MapLocation[];
}

export default function MapWrapper({ locations }: MapWrapperProps) {
  return <Map locations={locations} />;
}

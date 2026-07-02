"use client";

import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapLocation } from "@/db/schema";
import { Button } from "./Button";
import { ExternalLink, Navigation } from "lucide-react";

// Fix Leaflet issue where markers don't show correctly on Next.js builds
// by using HTML/CSS custom pins instead of referencing missing default images
const createCustomIcon = (category: string) => {
  const colors: Record<string, string> = {
    posko: "#0F766E",        // Teal 700
    balai_desa: "#10B981",   // Emerald 500
    sekolah: "#3B82F6",      // Blue 500
    umkm: "#F59E0B",         // Amber 500
    tempat_ibadah: "#8B5CF6",// Violet 500
    wisata: "#EF4444",       // Red 500
  };

  const color = colors[category] || "#0F766E";

  return L.divIcon({
    className: "custom-leaflet-icon-wrapper",
    html: `
      <div class="flex items-center justify-center" style="
        width: 32px;
        height: 32px;
        background-color: ${color}22;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: ${color};
          border-radius: 50%;
          border: 2px solid white;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const categoryLabels: Record<string, string> = {
  posko: "Posko KPM",
  balai_desa: "Balai Desa",
  sekolah: "Sekolah / Pendidikan",
  umkm: "Sentra UMKM",
  tempat_ibadah: "Tempat Ibadah",
  wisata: "Wisata Desa",
};

const categoryBadgeColors: Record<string, string> = {
  posko: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  balai_desa: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  sekolah: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  umkm: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  tempat_ibadah: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  wisata: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

interface MapProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
}

export const Map: React.FC<MapProps> = ({ 
  locations, 
  center = [-7.5361, 110.1234], // Defaults to seeded KPM village
  zoom = 15 
}) => {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-800/50 relative z-10">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="w-full h-full min-h-[500px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.latitude, loc.longitude]} 
            icon={createCustomIcon(loc.category)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-2 min-w-[200px] text-slate-800 dark:text-slate-100 space-y-2">
                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border ${categoryBadgeColors[loc.category]}`}>
                  {categoryLabels[loc.category]}
                </span>
                
                <h4 className="font-bold text-sm text-slate-900 dark:text-white m-0">
                  {loc.name}
                </h4>
                
                {loc.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed m-0">
                    {loc.description}
                  </p>
                )}

                {loc.googleMapsUrl && (
                  <div className="pt-2">
                    <a 
                      href={loc.googleMapsUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="no-underline"
                    >
                      <Button variant="primary" size="sm" className="w-full py-1 text-[11px] font-semibold flex items-center justify-center gap-1">
                        <Navigation className="w-3 h-3" /> Navigasi G-Maps <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;

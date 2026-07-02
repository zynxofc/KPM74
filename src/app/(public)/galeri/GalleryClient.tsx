"use client";

import { useState, useMemo } from "react";
import {
  Image as ImageIcon,
  Video,
  X,
  Search,
  Compass,
  ZoomIn,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { GalleryItem } from "@/db/schema";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryClientProps {
  siteName: string;
  galleryItems: GalleryItem[];
}

export function GalleryClient({ siteName, galleryItems }: GalleryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  // Filter list on client-side search query and type filter
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [galleryItems, searchQuery, typeFilter]);

  return (
    <div className="px-6 max-w-7xl mx-auto space-y-12 relative">
      {/* Background Decorators */}
      <div className="absolute top-[20%] left-[-5%] w-[40%] aspect-square bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-primary bg-primary/10 border border-primary/20 dark:text-secondary dark:bg-secondary/10 dark:border-secondary/20 backdrop-blur-md">
          <ImageIcon className="w-3.5 h-3.5 text-primary dark:text-secondary" />
          Dokumentasi Visual Pengabdian
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
          Galeri Kegiatan KPM
        </h1>
        <p className="text-slate-600 dark:text-slate-455 max-w-3xl leading-relaxed text-sm sm:text-base">
          Jelajahi foto dan video dokumentasi kegiatan pengabdian masyarakat kelompok KPM {siteName} selama berada di desa.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <GlassCard hoverLift={false} className="p-4 flex flex-col sm:flex-row gap-3 justify-between items-center border border-slate-200/30 dark:border-slate-800/30">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan judul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto" role="group" aria-label="Filter tipe media">
          {["all", "image", "video"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                typeFilter === type
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/15"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-secondary"
              )}
            >
              {type === "all" ? "Semua" : type === "image" ? "Foto" : "Video"}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <GlassCard hoverLift={false} className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600 border border-slate-200/30 dark:border-slate-800/30">
          <Compass className="w-12 h-12 mb-3 opacity-30 animate-pulse text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-semibold">Belum ada dokumentasi media terdaftar.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
          {filteredItems.map((item) => (
            <GlassCard
              key={item.id}
              hoverLift
              onClick={() => setSelectedMedia(item)}
              className="p-3 border border-slate-200/30 dark:border-slate-800/30 overflow-hidden flex flex-col justify-between group cursor-pointer relative"
            >
              {/* Image Thumbnail */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950/10 dark:bg-slate-950/50 border border-slate-200/30 dark:border-slate-850 flex items-center justify-center">
                {item.type === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.fileUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Video className="w-8 h-8 text-primary dark:text-secondary" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-550">Video Media</span>
                  </div>
                )}

                {/* Floating Media Type Badge */}
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold bg-slate-900/80 text-white backdrop-blur-sm shadow">
                  {item.type === "image" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                  {item.type === "image" ? "FOTO" : "VIDEO"}
                </span>

                {/* Zoom Hover Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white transform scale-90 group-hover:scale-100 transition-transform duration-250" />
                </div>
              </div>

              {/* Title & Caption */}
              <div className="p-2 space-y-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.caption}
                  </p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Lightbox Modal Overlay */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
            onClick={() => setSelectedMedia(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Media Container Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()} // Stop click propagation
              className="w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center relative rounded-2xl overflow-hidden glass-card p-2 border border-slate-200/20"
            >
              <div className="w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/20 max-h-[70vh]">
                {selectedMedia.type === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedMedia.fileUrl}
                    alt={selectedMedia.title}
                    loading="eager"
                    decoding="async"
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.fileUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-[70vh] rounded-lg"
                  />
                )}
              </div>

              {/* Title & Caption below media */}
              <div className="w-full text-center px-4 py-4 space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                  {selectedMedia.title}
                </h2>
                {selectedMedia.caption && (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {selectedMedia.caption}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Post } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useClientPagination } from "@/hooks/useClientPagination";

interface NewsListClientProps {
  siteName: string;
  posts: Post[];
}

function formatDate(isoDate: string | null): string {
  if (!isoDate) return "-";
  try {
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

// Extract summary snippet from rich text html
function getSummary(htmlContent: string, maxLength: number = 130): string {
  // Simple regex to strip HTML tags
  const text = htmlContent.replace(/<[^>]*>/g, " ");
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function NewsListClient({ siteName, posts }: NewsListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get unique list of categories dynamically from posts
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category.toLowerCase()));
    return ["all", ...Array.from(cats)];
  }, [posts]);

  // Filter list on client-side search query and category filter
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || post.category.toLowerCase() === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, categoryFilter]);

  // Pagination hook: 6 items per page
  const { currentPage, totalPages, paginatedItems, onPageChange } =
    useClientPagination(filteredPosts, 6);

  return (
    <div className="px-6 max-w-7xl mx-auto space-y-12 relative">
      {/* Background Decorator */}
      <div className="absolute top-[20%] right-[-5%] w-[40%] aspect-square bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-primary bg-primary/10 border border-primary/20 dark:text-secondary dark:bg-secondary/10 dark:border-secondary/20 backdrop-blur-md">
          <FileText className="w-3.5 h-3.5 text-primary dark:text-secondary" />
          Publikasi & Kabar Terkini
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
          Portal Berita KPM
        </h1>
        <p className="text-slate-600 dark:text-slate-455 max-w-3xl leading-relaxed text-sm sm:text-base">
          Ikuti perkembangan berita terbaru, artikel, agenda, dan rilis publikasi kegiatan kelompok KPM {siteName}.
        </p>
      </div>

      {/* Search and Filters Panel */}
      <GlassCard hoverLift={false} className="p-4 flex flex-col sm:flex-row gap-3 justify-between items-center border border-slate-200/30 dark:border-slate-800/30">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none" role="group" aria-label="Filter kategori berita">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary uppercase whitespace-nowrap",
                categoryFilter === cat
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/15"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-secondary"
              )}
            >
              {cat === "all" ? "Semua" : cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* News Grid */}
      {filteredPosts.length === 0 ? (
        <GlassCard hoverLift={false} className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600 border border-slate-200/30 dark:border-slate-800/30">
          <Compass className="w-12 h-12 mb-3 opacity-30 animate-pulse text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-semibold">Belum ada pos berita yang terpublikasi.</p>
        </GlassCard>
      ) : (
        <div className="space-y-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map((post) => (
              <GlassCard
                key={post.id}
                hoverLift
                className="border border-slate-200/30 dark:border-slate-800/30 overflow-hidden flex flex-col justify-between group p-5 h-full"
              >
                <div className="space-y-4">
                  {/* Thumbnail Cover */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950/10 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/40 flex items-center justify-center shrink-0">
                    {post.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4">
                        <FileText className="w-8 h-8 opacity-45" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-550">Umum</span>
                      </div>
                    )}

                    {/* Category tag floating */}
                    <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase bg-slate-900/80 text-white backdrop-blur-sm shadow border border-white/10">
                      {post.category}
                    </span>
                  </div>

                  {/* Title & Date */}
                  <div className="space-y-1">
                    <Link href={`/berita/${post.slug}`}>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug hover:text-primary dark:hover:text-secondary transition-colors line-clamp-2 cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold pt-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>

                  {/* Content snippet */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {getSummary(post.content)}
                  </p>
                </div>

                {/* Read More CTA */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <Link href={`/berita/${post.slug}`} className="inline-flex items-center text-xs font-bold text-primary dark:text-secondary hover:underline cursor-pointer">
                    Baca Selengkapnya &rarr;
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Pagination Toolbar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border border-slate-200/50 dark:border-slate-800/50 rounded-2xl px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
              <span className="text-xs text-slate-500 dark:text-slate-455">
                Halaman <span className="font-semibold text-slate-800 dark:text-white">{currentPage}</span> dari <span className="font-semibold text-slate-800 dark:text-white">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 cursor-pointer"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

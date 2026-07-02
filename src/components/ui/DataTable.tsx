"use client";

import React from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface Header {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps<T> {
  headers: Header[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  filterOptions?: { label: string; value: string }[];
  selectedFilter?: string;
  onFilterChange?: (val: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  renderRow: (item: T, idx: number) => React.ReactNode;
}

export function DataTable<T>({
  headers,
  data,
  isLoading = false,
  emptyMessage = "Belum ada data tersedia",
  searchPlaceholder = "Cari data...",
  searchQuery,
  onSearchChange,
  filterOptions,
  selectedFilter,
  onFilterChange,
  pagination,
  renderRow,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      {(onSearchChange || onFilterChange) && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          {onSearchChange && (
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary transition-all"
              />
            </div>
          )}

          {/* Filters */}
          {onFilterChange && filterOptions && (
            <div className="relative w-full sm:max-w-xs flex items-center gap-2 justify-end">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedFilter || ""}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary transition-all cursor-pointer"
              >
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Main Table Card */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-700 dark:text-slate-350">
            {/* Headers */}
            <thead className="bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200/50 dark:border-slate-800/50">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h.key}
                    scope="col"
                    className={cn(
                      "px-6 py-4 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs",
                      h.className
                    )}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {headers.map((h) => (
                      <td key={h.key} className="px-6 py-4.5">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((item, idx) => renderRow(item, idx))
              ) : (
                // Empty State
                <tr>
                  <td colSpan={headers.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-slate-100 dark:bg-slate-850 rounded-2xl text-slate-400 dark:text-slate-500">
                        <Inbox className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{emptyMessage}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                          Coba sesuaikan kata kunci pencarian atau bersihkan filter Anda.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500 dark:text-slate-450">
              Halaman <span className="font-semibold text-slate-800 dark:text-white">{pagination.currentPage}</span> dari <span className="font-semibold text-slate-800 dark:text-white">{pagination.totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

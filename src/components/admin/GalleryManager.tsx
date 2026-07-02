"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Image as ImageIcon,
  Video,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useClientPagination } from "@/hooks/useClientPagination";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import { Select } from "@/components/form/Select";
import { ImagePicker } from "@/components/form/ImagePicker";
import { useToast } from "@/components/ui/Toast";
import { gallerySchema } from "@/lib/validations";
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/admin/actions";
import type { GalleryItem } from "@/db/schema";
import { cn } from "@/lib/utils";

type GalleryFormValues = z.input<typeof gallerySchema>;

interface GalleryManagerProps {
  initialItems: GalleryItem[];
}

const TYPE_OPTIONS = [
  { label: "Foto", value: "image" },
  { label: "Video", value: "video" },
];

export function GalleryManager({ initialItems }: GalleryManagerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // File state for media upload
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isMediaCleared, setIsMediaCleared] = useState(false);

  // Deletion State
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
  });

  // Filter list on client-side search query
  const filteredItems = initialItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Reusable Pagination Hook (8 items per page for media grid)
  const { currentPage, totalPages, paginatedItems, onPageChange } =
    useClientPagination(filteredItems, 8);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setServerError(null);
    setMediaFile(null);
    setIsMediaCleared(false);
    reset({
      title: "",
      type: "image",
      fileUrl: "",
      caption: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setServerError(null);
    setMediaFile(null);
    setIsMediaCleared(false);
    reset({
      title: item.title,
      type: item.type,
      fileUrl: item.fileUrl,
      caption: item.caption || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (item: GalleryItem) => {
    setDeletingItem(item);
    setIsDeleteConfirmOpen(true);
  };

  const onSubmit = async (values: GalleryFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", values.type);
      formData.append("fileUrl", isMediaCleared ? "" : values.fileUrl || "");
      formData.append("caption", values.caption || "");

      if (mediaFile) {
        formData.append("mediaFile", mediaFile);
      }

      let result;
      if (editingItem) {
        result = await updateGalleryItem(editingItem.id, null, formData);
      } else {
        result = await createGalleryItem(null, formData);
      }

      if (result.error) {
        setServerError(result.error);
        toast(result.error, "error");
      } else if (result.success) {
        toast(
          editingItem
            ? "Media galeri berhasil diperbarui."
            : "Media galeri baru berhasil ditambahkan.",
          "success"
        );
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    startTransition(async () => {
      const result = await deleteGalleryItem(deletingItem.id);
      if (result.error) {
        toast(result.error, "error");
      } else {
        toast("Media berhasil dihapus.", "success");
        setIsDeleteConfirmOpen(false);
        setDeletingItem(null);
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary dark:text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Galeri
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola dokumentasi foto dan video aktivitas pengabdi kelompok KPM.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shadow-lg shadow-primary/10 gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Tambah Media
        </Button>
      </div>

      {/* Search and Filter Panel */}
      <GlassCard hoverLift={false} className="p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Cari berdasarkan judul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex gap-1.5 w-full sm:w-auto" role="group" aria-label="Filter tipe media">
          {["all", "image", "video"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                typeFilter === type
                  ? "bg-primary text-white border-primary"
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
        <GlassCard hoverLift={false} className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
          <Film className="w-12 h-12 mb-3 opacity-30 animate-pulse" />
          <p className="text-sm font-semibold">Belum ada file media yang terdaftar.</p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedItems.map((item) => (
              <GlassCard
                key={item.id}
                hoverLift
                className="p-3 border border-slate-200/55 dark:border-slate-800/55 overflow-hidden flex flex-col justify-between group relative"
              >
                {/* Thumbnail Container */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950/20 dark:bg-slate-950/60 border border-slate-200/40 dark:border-slate-850 flex items-center justify-center">
                  {item.type === "image" ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.fileUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Video className="w-8 h-8 text-primary dark:text-secondary" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Video Media</span>
                    </div>
                  )}

                  {/* Floating Media Type Badge */}
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                    {item.type === "image" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                    {item.type === "image" ? "FOTO" : "VIDEO"}
                  </span>
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

                {/* Action Buttons overlay */}
                <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-2.5 mt-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => handleOpenEdit(item)}
                    className="flex-1 py-1.5 text-xs gap-1 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Ubah
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => handleOpenDelete(item)}
                    className="flex-1 py-1.5 text-xs gap-1 border border-red-200/30 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </Button>
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Ubah Data Media" : "Tambah Media Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-red-700 dark:text-red-400 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Judul Media"
            placeholder="Contoh: Pembagian Sembako di Balai Desa"
            error={errors.title?.message}
            {...register("title")}
          />

          <Select
            label="Tipe Media"
            options={TYPE_OPTIONS}
            error={errors.type?.message}
            {...register("type")}
          />

          <Textarea
            label="Keterangan Media (Opsional)"
            placeholder="Tambahkan penjelasan singkat mengenai dokumentasi media ini..."
            error={errors.caption?.message}
            {...register("caption")}
          />

          <ImagePicker
            label="File Media"
            initialImageUrl={isMediaCleared ? undefined : watch("fileUrl")}
            onChange={(file) => {
              setMediaFile(file);
              if (file === null) {
                setIsMediaCleared(true);
              } else {
                setIsMediaCleared(false);
              }
            }}
            error={errors.fileUrl?.message}
          />

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingItem ? "Simpan Perubahan" : "Tambah Media"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Media Galeri"
        message={`Apakah Anda yakin ingin menghapus media "${deletingItem?.title}" dari galeri? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Media"
        cancelText="Batal"
        isLoading={isPending}
      />
    </div>
  );
}

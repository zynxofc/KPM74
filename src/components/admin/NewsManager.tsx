"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import { Select } from "@/components/form/Select";
import { ImagePicker } from "@/components/form/ImagePicker";
import { useToast } from "@/components/ui/Toast";
import { postSchema } from "@/lib/validations";
import { createPost, updatePost, deletePost } from "@/lib/admin/actions";
import type { Post } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useClientPagination } from "@/hooks/useClientPagination";

type PostFormValues = z.input<typeof postSchema>;

interface NewsManagerProps {
  initialPosts: Post[];
}

const CATEGORY_OPTIONS = [
  { label: "Kegiatan", value: "kegiatan" },
  { label: "Pengumuman", value: "pengumuman" },
  { label: "Artikel", value: "artikel" },
  { label: "Lainnya", value: "umum" },
];

const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  kegiatan: {
    label: "Kegiatan",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  pengumuman: {
    label: "Pengumuman",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  artikel: {
    label: "Artikel",
    color: "text-emerald-650 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  umum: {
    label: "Umum",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
};

function formatDate(isoDate: string): string {
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

export function NewsManager({ initialPosts }: NewsManagerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // File state for thumbnail upload
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [isThumbCleared, setIsThumbCleared] = useState(false);

  // Deletion State
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  // Filter list on client-side search query
  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Reusable Pagination Hook (5 items per page)
  const { currentPage, totalPages, paginatedItems, onPageChange } =
    useClientPagination(filteredPosts, 5);

  const handleOpenAdd = () => {
    setEditingPost(null);
    setServerError(null);
    setThumbFile(null);
    setIsThumbCleared(false);
    reset({
      title: "",
      content: "",
      category: "umum",
      thumbnailUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setServerError(null);
    setThumbFile(null);
    setIsThumbCleared(false);
    reset({
      title: post.title,
      content: post.content,
      category: post.category,
      thumbnailUrl: post.thumbnailUrl,
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (post: Post) => {
    setDeletingPost(post);
    setIsDeleteConfirmOpen(true);
  };

  const onSubmit = async (values: PostFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("category", values.category);
      formData.append("thumbnailUrl", isThumbCleared ? "" : values.thumbnailUrl || "");

      if (thumbFile) {
        formData.append("thumbFile", thumbFile);
      }

      let result;
      if (editingPost) {
        result = await updatePost(editingPost.id, null, formData);
      } else {
        result = await createPost(null, formData);
      }

      if (result.error) {
        setServerError(result.error);
        toast(result.error, "error");
      } else if (result.success) {
        toast(
          editingPost ? "Berita berhasil diperbarui." : "Berita baru berhasil diterbitkan.",
          "success"
        );
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    startTransition(async () => {
      const result = await deletePost(deletingPost.id);
      if (result.error) {
        toast(result.error, "error");
      } else {
        toast("Berita berhasil dihapus.", "success");
        setIsDeleteConfirmOpen(false);
        setDeletingPost(null);
        window.location.reload();
      }
    });
  };

  const tableHeaders = [
    { key: "thumb", label: "Thumbnail" },
    { key: "title", label: "Judul Berita" },
    { key: "category", label: "Kategori" },
    { key: "publishedAt", label: "Tanggal Rilis" },
    { key: "actions", label: "Aksi", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary dark:text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Berita
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola penulisan artikel, pengumuman, dan publikasi berita resmi KPM.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shadow-lg shadow-primary/10 gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Tulis Berita
        </Button>
      </div>

      {/* Main Content Table Card */}
      <GlassCard hoverLift={false} className="p-6">
        <DataTable
          headers={tableHeaders}
          data={paginatedItems}
          searchPlaceholder="Cari berdasarkan judul atau konten..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterOptions={[
            { label: "Semua Kategori", value: "all" },
            { label: "Kegiatan", value: "kegiatan" },
            { label: "Pengumuman", value: "pengumuman" },
            { label: "Artikel", value: "artikel" },
            { label: "Umum", value: "umum" },
          ]}
          selectedFilter={categoryFilter}
          onFilterChange={setCategoryFilter}
          pagination={{
            currentPage,
            totalPages,
            onPageChange,
          }}
          renderRow={(post) => {
            const meta = categoryMeta[post.category] ?? categoryMeta.umum;
            return (
              <tr
                key={post.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* Thumbnail */}
                <td className="px-5 py-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {post.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </td>

                {/* Title & Slug Link */}
                <td className="px-5 py-3.5 max-w-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    {post.title}
                  </span>
                  <a
                    href={`/berita/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-secondary hover:underline font-semibold mt-0.5"
                  >
                    /{post.slug} <ExternalLink className="w-3 h-3" />
                  </a>
                </td>

                {/* Category badge */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold",
                      meta.bg,
                      meta.color
                    )}
                  >
                    {meta.label}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="text-xs text-slate-500 dark:text-slate-450 font-semibold">
                    {formatDate(post.publishedAt || post.createdAt || "")}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(post)}
                      className="p-2 rounded-lg text-slate-500 hover:text-primary dark:hover:text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="Ubah Berita"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(post)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          }}
        />
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? "Ubah Data Berita" : "Tulis Berita Baru"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-red-700 dark:text-red-400 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Judul Berita"
            placeholder="Contoh: KPM Kelompok 12 Menggelar Sosialisasi Sampah Organik"
            error={errors.title?.message}
            {...register("title")}
          />

          <Select
            label="Kategori Berita"
            options={CATEGORY_OPTIONS}
            error={errors.category?.message}
            {...register("category")}
          />

          <Textarea
            label="Isi Berita / Artikel"
            placeholder="Tuliskan berita lengkap di sini..."
            className="min-h-[220px]"
            error={errors.content?.message}
            {...register("content")}
          />

          <ImagePicker
            label="Gambar Cover / Thumbnail"
            initialImageUrl={isThumbCleared ? undefined : watch("thumbnailUrl")}
            onChange={(file) => {
              setThumbFile(file);
              if (file === null) {
                setIsThumbCleared(true);
              } else {
                setIsThumbCleared(false);
              }
            }}
            error={errors.thumbnailUrl?.message}
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
              {editingPost ? "Simpan Perubahan" : "Terbitkan Berita"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Berita"
        message={`Apakah Anda yakin ingin menghapus berita "${deletingPost?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Berita"
        cancelText="Batal"
        isLoading={isPending}
      />
    </div>
  );
}

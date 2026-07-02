"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import { Select } from "@/components/form/Select";
import { DatePicker } from "@/components/form/DatePicker";
import { ImagePicker } from "@/components/form/ImagePicker";
import { useToast } from "@/components/ui/Toast";
import { programSchema } from "@/lib/validations";
import { createProgram, updateProgram, deleteProgram } from "@/lib/admin/actions";
import type { Program } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useClientPagination } from "@/hooks/useClientPagination";

type ProgramFormValues = z.input<typeof programSchema>;

interface ProgramsManagerProps {
  initialPrograms: Program[];
}

const STATUS_OPTIONS = [
  { label: "Rencana", value: "rencana" },
  { label: "Berjalan", value: "berjalan" },
  { label: "Selesai", value: "selesai" },
];

const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
  rencana: {
    label: "Rencana",
    color: "text-slate-650 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
  berjalan: {
    label: "Berjalan",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  selesai: {
    label: "Selesai",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
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

export function ProgramsManager({ initialPrograms }: ProgramsManagerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // File state for documentation photo
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isDocCleared, setIsDocCleared] = useState(false);

  // Deletion State
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
  });

  // Filter list by search query and status dropdown on client-side
  const filteredPrograms = initialPrograms.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reusable Pagination Hook (5 items per page)
  const { currentPage, totalPages, paginatedItems, onPageChange } =
    useClientPagination(filteredPrograms, 5);

  const handleOpenAdd = () => {
    setEditingProgram(null);
    setServerError(null);
    setDocFile(null);
    setIsDocCleared(false);
    reset({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "rencana",
      documentationUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (program: Program) => {
    setEditingProgram(program);
    setServerError(null);
    setDocFile(null);
    setIsDocCleared(false);
    reset({
      name: program.name,
      description: program.description,
      startDate: program.startDate,
      endDate: program.endDate,
      status: program.status,
      documentationUrl: program.documentationUrl,
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (program: Program) => {
    setDeletingProgram(program);
    setIsDeleteConfirmOpen(true);
  };

  const onSubmit = async (values: ProgramFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("status", values.status);
      formData.append("documentationUrl", isDocCleared ? "" : values.documentationUrl || "");

      if (docFile) {
        formData.append("docFile", docFile);
      }

      let result;
      if (editingProgram) {
        result = await updateProgram(editingProgram.id, null, formData);
      } else {
        result = await createProgram(null, formData);
      }

      if (result.error) {
        setServerError(result.error);
        toast(result.error, "error");
      } else if (result.success) {
        toast(
          editingProgram
            ? "Program kerja berhasil diperbarui."
            : "Program kerja baru berhasil ditambahkan.",
          "success"
        );
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingProgram) return;
    startTransition(async () => {
      const result = await deleteProgram(deletingProgram.id);
      if (result.error) {
        toast(result.error, "error");
      } else {
        toast("Program kerja berhasil dihapus.", "success");
        setIsDeleteConfirmOpen(false);
        setDeletingProgram(null);
        window.location.reload();
      }
    });
  };

  const tableHeaders = [
    { key: "doc", label: "Dokumentasi" },
    { key: "name", label: "Program Kerja" },
    { key: "timeline", label: "Timeline" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Aksi", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/10 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-primary dark:text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Program Kerja
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola timeline, status, dan dokumentasi program kerja kelompok KPM.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shadow-lg shadow-primary/10 gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Tambah Program Kerja
        </Button>
      </div>

      {/* Main Content Table Card */}
      <GlassCard hoverLift={false} className="p-6">
        <DataTable
          headers={tableHeaders}
          data={paginatedItems}
          searchPlaceholder="Cari berdasarkan nama atau deskripsi..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterOptions={[
            { label: "Semua Status", value: "all" },
            { label: "Rencana", value: "rencana" },
            { label: "Berjalan", value: "berjalan" },
            { label: "Selesai", value: "selesai" },
          ]}
          selectedFilter={statusFilter}
          onFilterChange={setStatusFilter}
          pagination={{
            currentPage,
            totalPages,
            onPageChange,
          }}
          renderRow={(program) => {
            const meta = statusMeta[program.status] ?? statusMeta.rencana;
            return (
              <tr
                key={program.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* Documentation Photo */}
                <td className="px-5 py-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {program.documentationUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={program.documentationUrl}
                        alt={program.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FolderKanban className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </td>

                {/* Name & Desc */}
                <td className="px-5 py-3.5 max-w-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    {program.name}
                  </span>
                  <span className="text-xs text-slate-450 dark:text-slate-400 block truncate mt-0.5">
                    {program.description}
                  </span>
                </td>

                {/* Timeline */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {formatDate(program.startDate)} — {formatDate(program.endDate)}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
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

                {/* Actions */}
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(program)}
                      className="p-2 rounded-lg text-slate-500 hover:text-primary dark:hover:text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="Ubah Program Kerja"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(program)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      title="Hapus Program Kerja"
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
        title={editingProgram ? "Ubah Program Kerja" : "Tambah Program Kerja Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-red-700 dark:text-red-400 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Nama Program Kerja"
            placeholder="Contoh: Bimbingan Belajar Anak Desa"
            error={errors.name?.message}
            {...register("name")}
          />

          <Textarea
            label="Deskripsi Program Kerja"
            placeholder="Jelaskan mengenai tujuan, target, dan rencana program kerja..."
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label="Tanggal Mulai"
              error={errors.startDate?.message}
              {...register("startDate")}
            />
            <DatePicker
              label="Tanggal Selesai"
              error={errors.endDate?.message}
              {...register("endDate")}
            />
          </div>

          <Select
            label="Status Program"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            {...register("status")}
          />

          <ImagePicker
            label="Foto Dokumentasi"
            initialImageUrl={isDocCleared ? undefined : watch("documentationUrl")}
            onChange={(file) => {
              setDocFile(file);
              if (file === null) {
                setIsDocCleared(true);
              } else {
                setIsDocCleared(false);
              }
            }}
            error={errors.documentationUrl?.message}
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
              {editingProgram ? "Simpan Perubahan" : "Tambah Program"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Program Kerja"
        message={`Apakah Anda yakin ingin menghapus program kerja "${deletingProgram?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Program"
        cancelText="Batal"
        isLoading={isPending}
      />
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/form/Input";
import { ImagePicker } from "@/components/form/ImagePicker";
import { useToast } from "@/components/ui/Toast";
import { memberSchema } from "@/lib/validations";
import { createMember, updateMember, deleteMember } from "@/lib/admin/actions";
import type { Member } from "@/db/schema";
import { useClientPagination } from "@/hooks/useClientPagination";

type MemberFormValues = z.input<typeof memberSchema>;

interface MembersManagerProps {
  initialMembers: Member[];
}

export function MembersManager({ initialMembers }: MembersManagerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // File state for member photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isPhotoCleared, setIsPhotoCleared] = useState(false);

  // Deletion State
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
  });

  // Filter list on client-side search query
  const filteredMembers = initialMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nimNip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reusable Pagination Hook (5 items per page)
  const { currentPage, totalPages, paginatedItems, onPageChange } =
    useClientPagination(filteredMembers, 5);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setServerError(null);
    setPhotoFile(null);
    setIsPhotoCleared(false);
    reset({
      name: "",
      nimNip: "",
      role: "",
      photoUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setServerError(null);
    setPhotoFile(null);
    setIsPhotoCleared(false);
    reset({
      name: member.name,
      nimNip: member.nimNip,
      role: member.role,
      photoUrl: member.photoUrl,
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (member: Member) => {
    setDeletingMember(member);
    setIsDeleteConfirmOpen(true);
  };

  const onSubmit = async (values: MemberFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("nimNip", values.nimNip);
      formData.append("role", values.role);
      formData.append("photoUrl", isPhotoCleared ? "" : values.photoUrl || "");

      if (photoFile) {
        formData.append("photoFile", photoFile);
      }

      let result;
      if (editingMember) {
        result = await updateMember(editingMember.id, null, formData);
      } else {
        result = await createMember(null, formData);
      }

      if (result.error) {
        setServerError(result.error);
        toast(result.error, "error");
      } else if (result.success) {
        toast(
          editingMember
            ? "Data anggota berhasil diperbarui."
            : "Anggota baru berhasil ditambahkan.",
          "success"
        );
        setIsModalOpen(false);

        // Fetch fresh members client side (or trigger reload)
        window.location.reload();
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    startTransition(async () => {
      const result = await deleteMember(deletingMember.id);
      if (result.error) {
        toast(result.error, "error");
      } else {
        toast("Anggota berhasil dihapus.", "success");
        setIsDeleteConfirmOpen(false);
        setDeletingMember(null);
        window.location.reload();
      }
    });
  };

  const tableHeaders = [
    { key: "photo", label: "Foto" },
    { key: "name", label: "Nama Lengkap" },
    { key: "nimNip", label: "NIM / NIP" },
    { key: "role", label: "Jabatan" },
    { key: "actions", label: "Aksi", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary dark:text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Anggota
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Daftar anggota pengabdi KPM kelompok mahasiswa dan DPL.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shadow-lg shadow-primary/10 gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Tambah Anggota
        </Button>
      </div>

      {/* Main Content Table Card */}
      <GlassCard hoverLift={false} className="p-6">
        <DataTable
          headers={tableHeaders}
          data={paginatedItems}
          searchPlaceholder="Cari berdasarkan nama, NIM, atau jabatan..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          pagination={{
            currentPage,
            totalPages,
            onPageChange,
          }}
          renderRow={(member) => (
            <tr
              key={member.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
            >
              {/* Photo */}
              <td className="px-5 py-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-850 flex items-center justify-center">
                  {member.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </td>

              {/* Name */}
              <td className="px-5 py-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {member.name}
                </span>
              </td>

              {/* NIM/NIP */}
              <td className="px-5 py-3">
                <span className="font-mono text-xs text-slate-550 dark:text-slate-400">
                  {member.nimNip}
                </span>
              </td>

              {/* Position/Role */}
              <td className="px-5 py-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary">
                  {member.role}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(member)}
                    className="p-2 rounded-lg text-slate-500 hover:text-primary dark:hover:text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    title="Ubah Anggota"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(member)}
                    className="p-2 rounded-lg text-slate-550 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    title="Hapus Anggota"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Ubah Data Anggota" : "Tambah Anggota Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-red-700 dark:text-red-400 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Muhammad Rafli"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="NIM / NIP"
            placeholder="Contoh: 181234567 atau 198001012020121001"
            error={errors.nimNip?.message}
            {...register("nimNip")}
          />

          <Input
            label="Jabatan"
            placeholder="Contoh: Ketua Kelompok, Anggota, DPL"
            error={errors.role?.message}
            {...register("role")}
          />

          <ImagePicker
            label="Foto Anggota"
            initialImageUrl={isPhotoCleared ? undefined : watch("photoUrl")}
            onChange={(file) => {
              setPhotoFile(file);
              if (file === null) {
                setIsPhotoCleared(true);
              } else {
                setIsPhotoCleared(false);
              }
            }}
            error={errors.photoUrl?.message}
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
              {editingMember ? "Simpan Perubahan" : "Tambah Anggota"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Anggota"
        message={`Apakah Anda yakin ingin menghapus data anggota "${deletingMember?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Anggota"
        isLoading={isPending}
      />
    </div>
  );
}

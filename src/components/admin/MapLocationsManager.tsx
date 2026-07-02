"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
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
import { useToast } from "@/components/ui/Toast";
import { mapLocationSchema } from "@/lib/validations";
import { createMapLocation, updateMapLocation, deleteMapLocation } from "@/lib/admin/actions";
import type { MapLocation } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useClientPagination } from "@/hooks/useClientPagination";

type MapLocationFormValues = z.input<typeof mapLocationSchema>;

interface MapLocationsManagerProps {
  initialLocations: MapLocation[];
}

const CATEGORY_OPTIONS = [
  { label: "Posko KPM", value: "posko" },
  { label: "Balai Desa", value: "balai_desa" },
  { label: "Sekolah", value: "sekolah" },
  { label: "UMKM Desa", value: "umkm" },
  { label: "Tempat Ibadah", value: "tempat_ibadah" },
  { label: "Wisata Desa", value: "wisata" },
];

const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  posko: {
    label: "Posko KPM",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-900/30",
  },
  balai_desa: {
    label: "Balai Desa",
    color: "text-sky-650 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/30",
  },
  sekolah: {
    label: "Sekolah",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  umkm: {
    label: "UMKM Desa",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  tempat_ibadah: {
    label: "Tempat Ibadah",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  wisata: {
    label: "Wisata Desa",
    color: "text-teal-600 dark:text-teal-450",
    bg: "bg-teal-100 dark:bg-teal-900/30",
  },
};

export function MapLocationsManager({ initialLocations }: MapLocationsManagerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MapLocation | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Deletion State
  const [deletingLocation, setDeletingLocation] = useState<MapLocation | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MapLocationFormValues>({
    resolver: zodResolver(mapLocationSchema),
  });

  // Filter list by search query and category filter dropdown on client-side
  const filteredLocations = initialLocations.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || l.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Reusable Pagination Hook (5 items per page)
  const { currentPage, totalPages, paginatedItems, onPageChange } =
    useClientPagination(filteredLocations, 5);

  const handleOpenAdd = () => {
    setEditingLocation(null);
    setServerError(null);
    reset({
      name: "",
      category: "posko",
      latitude: undefined,
      longitude: undefined,
      description: "",
      googleMapsUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (location: MapLocation) => {
    setEditingLocation(location);
    setServerError(null);
    reset({
      name: location.name,
      category: location.category,
      latitude: location.latitude,
      longitude: location.longitude,
      description: location.description || "",
      googleMapsUrl: location.googleMapsUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (location: MapLocation) => {
    setDeletingLocation(location);
    setIsDeleteConfirmOpen(true);
  };

  const onSubmit = async (values: MapLocationFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("latitude", String(values.latitude));
      formData.append("longitude", String(values.longitude));
      formData.append("description", values.description || "");
      formData.append("googleMapsUrl", values.googleMapsUrl || "");

      let result;
      if (editingLocation) {
        result = await updateMapLocation(editingLocation.id, null, formData);
      } else {
        result = await createMapLocation(null, formData);
      }

      if (result.error) {
        setServerError(result.error);
        toast(result.error, "error");
      } else if (result.success) {
        toast(
          editingLocation
            ? "Lokasi peta berhasil diperbarui."
            : "Lokasi peta baru berhasil ditambahkan.",
          "success"
        );
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingLocation) return;
    startTransition(async () => {
      const result = await deleteMapLocation(deletingLocation.id);
      if (result.error) {
        toast(result.error, "error");
      } else {
        toast("Lokasi peta berhasil dihapus.", "success");
        setIsDeleteConfirmOpen(false);
        setDeletingLocation(null);
        window.location.reload();
      }
    });
  };

  const tableHeaders = [
    { key: "category", label: "Kategori" },
    { key: "name", label: "Nama Lokasi" },
    { key: "coords", label: "Koordinat (Lat, Lng)" },
    { key: "link", label: "Navigasi" },
    { key: "actions", label: "Aksi", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary dark:text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Peta Lokasi
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola marker, popup deskripsi, dan rute navigasi peta wilayah pengabdi KPM.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shadow-lg shadow-primary/10 gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Tambah Lokasi
        </Button>
      </div>

      {/* Main Content Table Card */}
      <GlassCard hoverLift={false} className="p-6">
        <DataTable
          headers={tableHeaders}
          data={paginatedItems}
          searchPlaceholder="Cari berdasarkan nama lokasi..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterOptions={[
            { label: "Semua Kategori", value: "all" },
            { label: "Posko KPM", value: "posko" },
            { label: "Balai Desa", value: "balai_desa" },
            { label: "Sekolah", value: "sekolah" },
            { label: "UMKM Desa", value: "umkm" },
            { label: "Tempat Ibadah", value: "tempat_ibadah" },
            { label: "Wisata Desa", value: "wisata" },
          ]}
          selectedFilter={categoryFilter}
          onFilterChange={setCategoryFilter}
          pagination={{
            currentPage,
            totalPages,
            onPageChange,
          }}
          renderRow={(location) => {
            const meta = categoryMeta[location.category] ?? categoryMeta.posko;
            return (
              <tr
                key={location.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
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

                {/* Name & Desc */}
                <td className="px-5 py-3.5 max-w-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                    {location.name}
                  </span>
                  {location.description && (
                    <span className="text-xs text-slate-450 dark:text-slate-400 block truncate mt-0.5">
                      {location.description}
                    </span>
                  )}
                </td>

                {/* Coords */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                  </span>
                </td>

                {/* Navigation Link */}
                <td className="px-5 py-3.5">
                  {location.googleMapsUrl ? (
                    <a
                      href={location.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary dark:text-secondary font-bold hover:underline"
                    >
                      Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(location)}
                      className="p-2 rounded-lg text-slate-500 hover:text-primary dark:hover:text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      title="Ubah Lokasi"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(location)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      title="Hapus Lokasi"
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
        title={editingLocation ? "Ubah Lokasi Peta" : "Tambah Lokasi Peta Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-red-700 dark:text-red-400 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Nama Lokasi"
            placeholder="Contoh: Balai Desa Suka Maju"
            error={errors.name?.message}
            {...register("name")}
          />

          <Select
            label="Kategori Marker"
            options={CATEGORY_OPTIONS}
            error={errors.category?.message}
            {...register("category")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              placeholder="Contoh: -7.53610"
              error={errors.latitude?.message}
              {...register("latitude", { valueAsNumber: true })}
            />
            <Input
              label="Longitude"
              type="number"
              step="any"
              placeholder="Contoh: 110.12340"
              error={errors.longitude?.message}
              {...register("longitude", { valueAsNumber: true })}
            />
          </div>

          <Textarea
            label="Deskripsi Singkat (Opsional)"
            placeholder="Informasi mengenai lokasi ini..."
            error={errors.description?.message}
            {...register("description")}
          />

          <Input
            label="URL Google Maps Navigasi (Opsional)"
            placeholder="Contoh: https://maps.google.com/?q=-7.5361,110.1234"
            error={errors.googleMapsUrl?.message}
            {...register("googleMapsUrl")}
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
              {editingLocation ? "Simpan Perubahan" : "Tambah Lokasi"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Lokasi Peta"
        message={`Apakah Anda yakin ingin menghapus lokasi "${deletingLocation?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Lokasi"
        cancelText="Batal"
        isLoading={isPending}
      />
    </div>
  );
}

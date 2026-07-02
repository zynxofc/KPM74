"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mapLocationSchema, settingsSchema } from "@/lib/validations";
import { MapLocation } from "@/db/schema";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Drawer } from "../ui/Drawer";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { DataTable } from "../ui/DataTable";
import { useToast } from "../ui/Toast";
import { Input } from "../form/Input";
import { Textarea } from "../form/Textarea";
import { Select } from "../form/Select";
import { Toggle } from "../form/Toggle";
import { Checkbox } from "../form/Checkbox";
import { DatePicker } from "../form/DatePicker";
import { MultiSelect } from "../form/MultiSelect";
import { ImagePicker } from "../form/ImagePicker";

import { 
  Users, 
  FolderKanban, 
  Newspaper, 
  Image as ImageIcon, 
  Plus, 
  Settings, 
  RefreshCw, 
  Activity, 
  Trash2 
} from "lucide-react";

interface DashboardClientProps {
  initialMarkersCount: number;
  initialMarkers: MapLocation[];
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  initialMarkersCount,
  initialMarkers,
}) => {
  const { toast } = useToast();
  
  // State for Map Location Modal
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  // State for Settings Drawer
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  // State for Reset Confirmation Dialog
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  // State for loading indicators
  const [isResetting, setIsResetting] = useState(false);

  // Client-side local list of markers (for DataTable interactive demo)
  const [markers, setMarkers] = useState<MapLocation[]>(initialMarkers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. React Hook Form for Add Location Modal (Zod validation)
  const {
    register: registerLocation,
    handleSubmit: handleSubmitLocation,
    reset: resetLocationForm,
    formState: { errors: locationErrors },
  } = useForm({
    resolver: zodResolver(mapLocationSchema),
    defaultValues: {
      name: "",
      category: "posko" as const,
      latitude: -7.5361,
      longitude: 110.1234,
      description: "",
      googleMapsUrl: "",
    },
  });

  // 2. React Hook Form for Settings Drawer (Zod validation)
  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    control: settingsControl,
    formState: { errors: settingsErrors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "LinTree Desa Suka Maju",
      description: "Portal digital resmi Kuliah Pengabdian Masyarakat Kelompok 12.",
      socialInstagram: "https://instagram.com/kpm12",
      socialWhatsapp: "https://wa.me/628123456789",
      allowPublicRegistrations: false,
      maintenanceMode: false,
    },
  });

  // Handle Location Form Submission (UI Mock)
  const onLocationSubmit = (data: z.infer<typeof mapLocationSchema>) => {
    toast(`Berhasil memvalidasi lokasi: ${data.name}! (Simulasi database)`, "success");
    
    // Add locally to the table list for demonstration
    const newLoc: MapLocation = {
      id: Math.max(...markers.map((m) => m.id), 0) + 1,
      name: data.name,
      category: data.category,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      description: data.description || null,
      googleMapsUrl: data.googleMapsUrl || null,
      createdAt: new Date().toISOString(),
    };
    
    setMarkers([newLoc, ...markers]);
    setIsLocationModalOpen(false);
    resetLocationForm();
  };

  // Handle Settings Form Submission (UI Mock)
  const onSettingsSubmit = (data: z.infer<typeof settingsSchema>) => {
    toast(`Pengaturan portal "${data.siteName}" berhasil disimpan! (Simulasi database)`, "success");
    setIsSettingsDrawerOpen(false);
  };

  // Handle Database Reset Action (UI Mock)
  const handleResetData = () => {
    setIsResetting(true);
    setTimeout(() => {
      setMarkers([]); // Trigger DataTable empty state
      setIsResetting(false);
      setIsResetConfirmOpen(false);
      toast("Daftar lokasi peta berhasil di-reset!", "info");
    }, 1500);
  };

  // Handlers for DataTable actions
  const handleDeleteRow = (id: number, name: string) => {
    setMarkers(markers.filter((m) => m.id !== id));
    toast(`Marker "${name}" berhasil dihapus secara lokal!`, "success");
  };

  // DataTable filtering & searching logic
  const filteredMarkers = markers.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || m.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // DataTable pagination sizing
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredMarkers.length / itemsPerPage);
  const paginatedMarkers = filteredMarkers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categoryLabels: Record<string, string> = {
    posko: "Posko KPM",
    balai_desa: "Balai Desa",
    sekolah: "Sekolah",
    umkm: "Sentra UMKM",
    tempat_ibadah: "Ibadah",
    wisata: "Wisata",
  };

  const statCards = [
    { label: "Marker Peta (DB)", value: initialMarkersCount, change: "Seeded", icon: <FolderKanban className="w-5 h-5" /> },
    { label: "Anggota (Mock)", value: "15", change: "2 Divisi", icon: <Users className="w-5 h-5" /> },
    { label: "Galeri Foto (Mock)", value: "32", change: "Lightbox Aktif", icon: <ImageIcon className="w-5 h-5" /> },
    { label: "Berita Aktif (Mock)", value: "12", change: "+1 Draft", icon: <Newspaper className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Fokus Fondasi Admin</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fase audit UI & form komponen: demonstrasi interaktif, type-safe, dan validasi schema Zod.
          </p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => setIsSettingsDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Pengaturan Portal
          </Button>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-2 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/35"
          >
            <RefreshCw className="w-4 h-4" /> Reset Table
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 shadow-lg shadow-primary/10"
          >
            <Plus className="w-4 h-4" /> Tambah Marker
          </Button>
        </div>
      </div>

      {/* 2. Stats Grid Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <GlassCard key={i} hoverLift={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.label}</span>
              <div className="p-2.5 rounded-2xl bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary border border-primary/20 dark:border-secondary/20">
                {card.icon}
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{card.value}</span>
              <p className="text-[10px] text-slate-450 dark:text-slate-400 font-bold tracking-wide uppercase">{card.change}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* 3. Main Split View: DataTable & Activity logs */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Reusable DataTable widget */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daftar Marker Peta</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-850 dark:text-slate-400 px-2 py-0.5 rounded-md">
              {filteredMarkers.length} Lokasi
            </span>
          </div>

          <DataTable<MapLocation>
            headers={[
              { key: "name", label: "Nama Lokasi" },
              { key: "category", label: "Kategori" },
              { key: "coords", label: "Koordinat" },
              { key: "actions", label: "Aksi", className: "text-right" },
            ]}
            data={paginatedMarkers}
            searchPlaceholder="Cari marker..."
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            filterOptions={[
              { label: "Semua Kategori", value: "all" },
              { label: "Posko KPM", value: "posko" },
              { label: "Balai Desa", value: "balai_desa" },
              { label: "Sekolah", value: "sekolah" },
              { label: "Sentra UMKM", value: "umkm" },
              { label: "Tempat Ibadah", value: "tempat_ibadah" },
              { label: "Wisata Desa", value: "wisata" },
            ]}
            selectedFilter={selectedFilter}
            onFilterChange={(val) => {
              setSelectedFilter(val);
              setCurrentPage(1);
            }}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
            renderRow={(item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                  {item.name}
                  {item.description && (
                    <span className="block text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs">
                      {item.description}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary border border-primary/20 dark:border-secondary/20">
                    {categoryLabels[item.category]}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                  {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteRow(item.id, item.name)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    title="Hapus secara lokal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )}
          />
        </div>

        {/* Right: Recent activity list */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aktivitas Terkini</h3>
          <GlassCard hoverLift={false} className="p-6 border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 space-y-6">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-primary dark:text-secondary" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Database Peta Di-Seeding</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  System telah memuat 6 data marker utama dari seeder database `dev.db`.
                </p>
                <span className="block text-[9px] text-slate-400">Baru saja</span>
              </div>
            </div>

            <div className="flex gap-4 border-t border-slate-200/50 dark:border-slate-850 pt-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4 text-slate-500" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Hardening Aksesibilitas</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Menambahkan ring `focus-visible` pada tombol, Navbar menu, dan form login.
                </p>
                <span className="block text-[9px] text-slate-400">10 menit yang lalu</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 4. MODAL: Tambah Marker (RHF + Zod Validation Demo) */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Tambah Marker Lokasi Desa"
      >
        <form onSubmit={handleSubmitLocation(onLocationSubmit)} className="space-y-4 py-2">
          <Input
            label="Nama Lokasi"
            placeholder="Contoh: Balai Desa Suka Maju"
            error={locationErrors.name?.message}
            {...registerLocation("name")}
          />

          <Select
            label="Kategori Lokasi"
            options={[
              { label: "Posko KPM", value: "posko" },
              { label: "Balai Desa", value: "balai_desa" },
              { label: "Sekolah / Instansi", value: "sekolah" },
              { label: "Sentra UMKM", value: "umkm" },
              { label: "Tempat Ibadah", value: "tempat_ibadah" },
              { label: "Wisata Desa", value: "wisata" },
            ]}
            error={locationErrors.category?.message}
            {...registerLocation("category")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              step="any"
              label="Latitude"
              placeholder="-7.5361"
              error={locationErrors.latitude?.message}
              {...registerLocation("latitude", { valueAsNumber: true })}
            />
            <Input
              type="number"
              step="any"
              label="Longitude"
              placeholder="110.1234"
              error={locationErrors.longitude?.message}
              {...registerLocation("longitude", { valueAsNumber: true })}
            />
          </div>

          <Textarea
            label="Deskripsi Informasi"
            placeholder="Tuliskan deskripsi lengkap lokasi penanda..."
            error={locationErrors.description?.message}
            {...registerLocation("description")}
          />

          <Input
            label="Link Rute Google Maps"
            placeholder="https://maps.google.com/?q=..."
            error={locationErrors.googleMapsUrl?.message}
            {...registerLocation("googleMapsUrl")}
          />

          <div className="flex justify-end gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 mt-6">
            <Button type="button" variant="glass" size="sm" onClick={() => setIsLocationModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Marker
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. DRAWER: Pengaturan Portal (RHF + Zod Validation Demo) */}
      <Drawer
        isOpen={isSettingsDrawerOpen}
        onClose={() => setIsSettingsDrawerOpen(false)}
        title="Pengaturan Portal KPM"
      >
        <form onSubmit={handleSubmitSettings(onSettingsSubmit)} className="space-y-5 py-2">
          <Input
            label="Nama Portal"
            error={settingsErrors.siteName?.message}
            {...registerSettings("siteName")}
          />

          <Textarea
            label="Deskripsi Portal"
            error={settingsErrors.description?.message}
            {...registerSettings("description")}
          />

          <Input
            label="Sosial Instagram Link"
            error={settingsErrors.socialInstagram?.message}
            {...registerSettings("socialInstagram")}
          />

          <Input
            label="Sosial WhatsApp Link"
            error={settingsErrors.socialWhatsapp?.message}
            {...registerSettings("socialWhatsapp")}
          />

          {/* Demonstration of Toggle Component */}
          <Controller
            name="maintenanceMode"
            control={settingsControl}
            render={({ field }) => (
              <Toggle
                label="Mode Pemeliharaan (Maintenance)"
                description="Kunci akses publik dan tampilkan halaman pemeliharaan sementara"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Demonstration of Checkbox Component */}
          <Controller
            name="allowPublicRegistrations"
            control={settingsControl}
            render={({ field }) => (
              <Checkbox
                label="Izinkan Pendaftaran Anggota Publik"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Demonstration of DatePicker Component */}
          <DatePicker
            label="Batas Akhir KPM (Demonstrasi Tanggal)"
            defaultValue="2026-07-31"
          />

          {/* Demonstration of MultiSelect Component */}
          <MultiSelect
            label="Tag Wilayah Desa (Multi-Select)"
            options={[
              { label: "Dusun Krajan", value: "krajan" },
              { label: "Dusun Ngasinan", value: "ngasinan" },
              { label: "Dusun Suka Damai", value: "sukadamai" },
            ]}
            value={["krajan"]}
            onChange={(vals) => toast(`Opsi Multi-Select terpilih: ${vals.join(", ")}`, "info")}
          />

          {/* Demonstration of ImagePicker Component */}
          <ImagePicker 
            label="Gambar Latar Belakang Hero (Image Picker UI)"
            onChange={(file) => {
              if (file) toast(`Gambar terpilih: ${file.name} (File terproses di client)`, "success");
            }}
          />

          <div className="flex gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 mt-8">
            <Button type="button" variant="glass" className="flex-1" onClick={() => setIsSettingsDrawerOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Drawer>

      {/* 6. CONFIRM DIALOG: Reset Data */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset Daftar Marker Peta"
        message="Apakah Anda yakin ingin menghapus sementara seluruh daftar penanda lokasi desa di tabel dashboard ini? Semua data pada list client-side ini akan dihapus secara visual."
        isLoading={isResetting}
      />
    </div>
  );
};

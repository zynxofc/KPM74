"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Image as ImageIcon,
  Share2,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import { Toggle } from "@/components/form/Toggle";
import { ImagePicker } from "@/components/form/ImagePicker";
import { useToast } from "@/components/ui/Toast";
import { settingsSchema } from "@/lib/validations";
import { updateSettings } from "@/lib/admin/actions";
import type { Setting } from "@/db/schema";
import { cn } from "@/lib/utils";

type SettingsFormValues = z.input<typeof settingsSchema>;

interface SettingsFormProps {
  initialSettings: Setting;
}

type TabType = "general" | "hero" | "social";

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { toast } = useTransitionStateToast();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  // File state for background image upload
  const [bgFile, setBgFile] = useState<File | null>(null);
  // Track if current background image is cleared
  const [isBgCleared, setIsBgCleared] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: initialSettings.siteName,
      description: initialSettings.description,
      socialInstagram: initialSettings.socialInstagram,
      socialTiktok: initialSettings.socialTiktok,
      socialWhatsapp: initialSettings.socialWhatsapp,
      socialMaps: initialSettings.socialMaps,
      heroTitle: initialSettings.heroTitle,
      heroSubtitle: initialSettings.heroSubtitle,
      heroBgImage: initialSettings.heroBgImage,
      allowPublicRegistrations: initialSettings.allowPublicRegistrations,
      maintenanceMode: initialSettings.maintenanceMode,
    },
  });

  const watchBgImage = watch("heroBgImage");

  const onSubmit = async (values: SettingsFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("siteName", values.siteName);
      formData.append("description", values.description);
      formData.append("socialInstagram", values.socialInstagram || "");
      formData.append("socialTiktok", values.socialTiktok || "");
      formData.append("socialWhatsapp", values.socialWhatsapp || "");
      formData.append("socialMaps", values.socialMaps || "");
      formData.append("heroTitle", values.heroTitle);
      formData.append("heroSubtitle", values.heroSubtitle);
      // If cleared, pass empty string, otherwise pass existing value
      formData.append("heroBgImage", isBgCleared ? "" : values.heroBgImage || "");
      formData.append("allowPublicRegistrations", String(values.allowPublicRegistrations));
      formData.append("maintenanceMode", String(values.maintenanceMode));

      if (bgFile) {
        formData.append("heroBgImageFile", bgFile);
      }

      const result = await updateSettings(null, formData);

      if (result.error) {
        setServerError(result.error);
        toast(result.error, "error");
      } else if (result.success) {
        toast("Pengaturan portal berhasil diperbarui.", "success");
        // Reset file input states since upload is done
        setBgFile(null);
        setIsBgCleared(false);
      }
    });
  };

  const tabs = [
    { id: "general", label: "Umum", icon: Settings },
    { id: "hero", label: "Hero Banner", icon: ImageIcon },
    { id: "social", label: "Sosmed & CTA", icon: Share2 },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pengaturan Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola informasi umum landing page, CTA media sosial, dan konfigurasi Hero section.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar/Tabs */}
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/10 dark:bg-secondary dark:text-slate-950"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="flex-grow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-red-700 dark:text-red-400 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard hoverLift={false} className="p-6 space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                      Pengaturan Umum
                    </h2>
                    
                    <Input
                      label="Nama Portal"
                      placeholder="Contoh: LinTree KPM Desa Suka Maju"
                      error={errors.siteName?.message}
                      {...register("siteName")}
                    />

                    <Textarea
                      label="Deskripsi / SEO Global"
                      placeholder="Masukkan deskripsi singkat portal untuk pencarian SEO..."
                      error={errors.description?.message}
                      {...register("description")}
                    />

                    <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-6 space-y-4">
                      <Toggle
                        label="Maintenance Mode"
                        description="Aktifkan untuk membatasi akses publik sementara waktu."
                        checked={watch("maintenanceMode")}
                        onChange={(e) => setValue("maintenanceMode", e.target.checked)}
                      />

                      <Toggle
                        label="Izinkan Registrasi Publik"
                        description="Menu ini dinonaktifkan (Single Administrator selalu aktif)."
                        disabled
                        checked={false}
                        onChange={() => {}}
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "hero" && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard hoverLift={false} className="p-6 space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                      Konfigurasi Hero Banner
                    </h2>

                    <Input
                      label="Judul Utama (Title)"
                      placeholder="Contoh: Selamat Datang di KPM Kelompok 12"
                      error={errors.heroTitle?.message}
                      {...register("heroTitle")}
                    />

                    <Input
                      label="Sub-judul (Subtitle)"
                      placeholder="Contoh: Mengabdi dengan Hati, Membangun Desa Mandiri"
                      error={errors.heroSubtitle?.message}
                      {...register("heroSubtitle")}
                    />

                    <ImagePicker
                      label="Gambar Background Hero"
                      initialImageUrl={isBgCleared ? undefined : watchBgImage}
                      onChange={(file) => {
                        setBgFile(file);
                        if (file === null) {
                          setIsBgCleared(true);
                        } else {
                          setIsBgCleared(false);
                        }
                      }}
                      error={errors.heroBgImage?.message}
                    />
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "social" && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard hoverLift={false} className="p-6 space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                      Tautan Sosial & CTA Tombol
                    </h2>

                    <Input
                      label="WhatsApp Link"
                      placeholder="Contoh: https://wa.me/628123456789"
                      error={errors.socialWhatsapp?.message}
                      {...register("socialWhatsapp")}
                    />

                    <Input
                      label="Instagram Link"
                      placeholder="Contoh: https://instagram.com/kpm.sukamaju"
                      error={errors.socialInstagram?.message}
                      {...register("socialInstagram")}
                    />

                    <Input
                      label="TikTok Link"
                      placeholder="Contoh: https://tiktok.com/@kpm.sukamaju"
                      error={errors.socialTiktok?.message}
                      {...register("socialTiktok")}
                    />

                    <Input
                      label="Google Maps Lokasi Posko"
                      placeholder="Contoh: https://maps.google.com/?q=-7.5361,110.1234"
                      error={errors.socialMaps?.message}
                      {...register("socialMaps")}
                    />
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                className="shadow-lg shadow-primary/10 gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Simple internal helper to use toast without crash if ToastProvider is loading
function useTransitionStateToast() {
  try {
    return useToast();
  } catch {
    return {
      toast: (message: string, type: "success" | "error" | "info" = "success") => {
        alert(`${type.toUpperCase()}: ${message}`);
      },
    };
  }
}

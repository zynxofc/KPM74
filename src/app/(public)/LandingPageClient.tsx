"use client";

import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  MapPin,
  Eye,
  Compass,
  Users,
} from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Setting } from "@/db/schema";

interface LandingPageClientProps {
  settings: Setting;
}

export default function LandingPageClient({ settings }: LandingPageClientProps) {
  const hasBgImage = !!settings.heroBgImage;

  return (
    <div className="relative overflow-hidden w-full min-h-screen flex flex-col justify-between">
      {/* Background Decorators / Ambient Blobs */}
      {!hasBgImage && (
        <>
          <div aria-hidden="true" className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div aria-hidden="true" className="absolute bottom-[20%] right-[-10%] w-[50%] aspect-square bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Hero Background Image with Blur and Gradient Overlay */}
      {hasBgImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 scale-105"
          style={{ backgroundImage: `url(${settings.heroBgImage})` }}
        >
          {/* Blur layer and dark/light overlay depending on styling */}
          <div className="absolute inset-0 bg-slate-50/80 dark:bg-slate-950/85 backdrop-blur-[3px] mix-blend-normal" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50 dark:via-slate-950/25 dark:to-slate-950" />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative px-6 max-w-7xl mx-auto flex flex-col items-center text-center justify-center flex-grow pt-28 pb-12 md:py-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-primary bg-primary/10 border border-primary/20 dark:text-secondary dark:bg-secondary/10 dark:border-secondary/20 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-primary dark:text-secondary" /> 
            Portal Digital Resmi {settings.siteName}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-none">
            {settings.heroTitle}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
            {settings.heroSubtitle}
          </p>

          {/* Call to Actions (Liquid Glass Buttons) */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/program-kerja">
              <Button variant="primary" size="lg" className="shadow-xl shadow-primary/25 dark:shadow-secondary/5 flex items-center gap-2">
                Lihat Program Kerja <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            <Link href="/peta-lokasi">
              <Button variant="glass" size="lg" shineEffect className="flex items-center gap-2 border border-slate-200/50 dark:border-slate-800/50">
                <MapPin className="w-5 h-5 text-primary dark:text-secondary" /> Eksplorasi Lokasi Desa
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Quick Access Portal & Links Tree */}
      <section className="relative px-6 max-w-7xl mx-auto py-12 z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Card 1: Profil */}
          <GlassCard className="flex flex-col justify-between h-64 p-8 group border border-slate-200/30 dark:border-slate-800/30">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-primary dark:text-secondary mb-6 transition-all duration-300 group-hover:bg-primary dark:group-hover:bg-secondary group-hover:text-white dark:group-hover:text-slate-950">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-850 dark:text-slate-100">Profil & Anggota</h3>
              <p className="mt-2 text-slate-655 dark:text-slate-400 text-sm leading-relaxed">
                Kenali struktur kelompok, visi misi, dosen pembimbing, dan mahasiswa pengabdi.
              </p>
            </div>
            <Link href="/profil" className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-teal-600 dark:text-secondary dark:hover:text-teal-400">
              Jelajahi Anggota <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </GlassCard>

          {/* Card 2: Berita & Publikasi */}
          <GlassCard className="flex flex-col justify-between h-64 p-8 group border border-slate-200/30 dark:border-slate-800/30">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-accent mb-6 transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-855 dark:text-slate-100">Kabar Berita</h3>
              <p className="mt-2 text-slate-655 dark:text-slate-400 text-sm leading-relaxed">
                Ikuti perkembangan berita terbaru, artikel, dan rilis publikasi kegiatan KPM di desa.
              </p>
            </div>
            <Link href="/berita" className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-teal-600 dark:text-secondary dark:hover:text-teal-400">
              Baca Berita <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </GlassCard>

          {/* Card 3: Social Media Tree */}
          <GlassCard className="flex flex-col justify-between h-64 p-8 group sm:col-span-2 lg:col-span-1 border border-slate-200/30 dark:border-slate-800/30">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-primary dark:text-secondary mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-855 dark:text-slate-100">Hubungi Kami</h3>
              <p className="mt-2 text-slate-655 dark:text-slate-400 text-sm leading-relaxed">
                Tautan media sosial resmi dan saluran komunikasi kelompok KPM.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              {settings.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-200/50 hover:bg-pink-500 hover:text-white dark:bg-slate-850 dark:hover:bg-pink-600 transition-colors text-slate-600 dark:text-slate-350" title="Instagram">
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {settings.socialTiktok && (
                <a href={settings.socialTiktok} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-200/50 hover:bg-slate-900 hover:text-white dark:bg-slate-850 dark:hover:bg-white dark:hover:text-slate-900 transition-colors text-slate-600 dark:text-slate-350" title="TikTok">
                  <TikTokIcon className="w-5 h-5" />
                </a>
              )}
              {settings.socialWhatsapp && (
                <a href={settings.socialWhatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-200/50 hover:bg-emerald-500 hover:text-white dark:bg-slate-850 dark:hover:bg-emerald-600 transition-colors text-slate-600 dark:text-slate-350" title="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings.socialMaps && (
                <a href={settings.socialMaps} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-200/50 hover:bg-sky-500 hover:text-white dark:bg-slate-850 dark:hover:bg-sky-600 transition-colors text-slate-600 dark:text-slate-350" title="Google Maps Lokasi Posko">
                  <MapPin className="w-5 h-5" />
                </a>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
}

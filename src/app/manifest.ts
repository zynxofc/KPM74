import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LinTree KPM — Portal Resmi KPM",
    short_name: "LinTree KPM",
    description:
      "Portal digital resmi Kuliah Pengabdian Masyarakat (KPM) — Pusat informasi, dokumentasi, publikasi, dan branding kelompok.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#0F766E",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    categories: ["education", "government"],
    lang: "id",
    orientation: "portrait-primary",
  };
}

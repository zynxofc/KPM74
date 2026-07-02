import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://lintreekpm.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "LinTree KPM — Portal Resmi KPM",
    template: "%s — LinTree KPM",
  },
  description:
    "Portal digital resmi Kuliah Pengabdian Masyarakat (KPM) — Pusat informasi, dokumentasi, publikasi, dan branding kelompok.",
  keywords: ["KPM", "Kuliah Pengabdian Masyarakat", "LinTree KPM", "Desa", "Portal KPM"],
  authors: [{ name: "KPM Team" }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "LinTree KPM — Portal Resmi KPM",
    description:
      "Portal digital resmi Kuliah Pengabdian Masyarakat (KPM) — Pusat informasi, dokumentasi, publikasi, dan branding kelompok.",
    url: BASE_URL,
    siteName: "LinTree KPM",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinTree KPM — Portal Resmi Kuliah Pengabdian Masyarakat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinTree KPM — Portal Resmi KPM",
    description:
      "Portal digital resmi Kuliah Pengabdian Masyarakat (KPM) — Pusat informasi, dokumentasi, publikasi, dan branding kelompok.",
    images: ["/og-image.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}

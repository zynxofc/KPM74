import { db } from "@/db";
import { faqs } from "@/db/schema";
import { FaqListClient } from "./FaqListClient";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lintreekpm.vercel.app";

export const metadata: Metadata = {
  title: "Tanya Jawab (FAQ)",
  description: "Temukan jawaban atas berbagai pertanyaan umum seputar program Kuliah Pengabdian Masyarakat (KPM).",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: "Tanya Jawab (FAQ) — LinTree KPM",
    description: "Temukan jawaban atas berbagai pertanyaan umum seputar program Kuliah Pengabdian Masyarakat (KPM).",
    url: `${BASE_URL}/faq`,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FAQ LinTree KPM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanya Jawab (FAQ) — LinTree KPM",
    description: "Temukan jawaban atas berbagai pertanyaan umum seputar program Kuliah Pengabdian Masyarakat (KPM).",
    images: ["/og-image.png"],
  },
};

export const revalidate = 0;

export default async function PublicFaqPage() {
  const faqList = isPreviewMode() ? getPreviewData("faqs") : await db.select().from(faqs);

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12 sm:py-16 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tanya Jawab (FAQ)
        </h1>
        <p className="text-slate-550 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          Punya pertanyaan seputar KPM? Temukan jawaban atas hal-hal yang sering ditanyakan di sini.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <FaqListClient faqList={faqList} />
    </div>
  );
}

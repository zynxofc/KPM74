import { db } from "@/db";
import { faqs } from "@/db/schema";
import { FaqsManager } from "@/components/admin/FaqsManager";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

export const metadata: Metadata = {
  title: "Manajemen FAQ — LinTree Admin",
  description: "Kelola daftar tanya jawab seputar Kuliah Pengabdian Masyarakat (KPM).",
};

export const revalidate = 0;

export default async function AdminFaqPage() {
  const faqList = isPreviewMode()
    ? getPreviewData("faqs")
    : await db.select().from(faqs);

  return <FaqsManager initialFaqs={faqList} />;
}

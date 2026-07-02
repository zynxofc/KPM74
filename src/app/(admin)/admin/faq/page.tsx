import { db } from "@/db";
import { faqs } from "@/db/schema";
import { FaqsManager } from "@/components/admin/FaqsManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen FAQ — LinTree Admin",
  description: "Kelola daftar tanya jawab seputar Kuliah Pengabdian Masyarakat (KPM).",
};

export const revalidate = 0;

export default async function AdminFaqPage() {
  const faqList = await db.select().from(faqs);

  return <FaqsManager initialFaqs={faqList} />;
}

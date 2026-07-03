import { db } from "@/db";
import { programs } from "@/db/schema";
import { ProgramsManager } from "@/components/admin/ProgramsManager";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

export const metadata: Metadata = {
  title: "Manajemen Program Kerja — LinTree Admin",
  description: "Kelola timeline, status, dan dokumentasi program kerja kelompok KPM.",
};

export const revalidate = 0;

export default async function AdminProgramsPage() {
  const programsList = isPreviewMode()
    ? getPreviewData("programs")
    : await db.select().from(programs);

  return <ProgramsManager initialPrograms={programsList} />;
}

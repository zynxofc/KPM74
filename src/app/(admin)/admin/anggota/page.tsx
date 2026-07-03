import { db } from "@/db";
import { members } from "@/db/schema";
import { MembersManager } from "@/components/admin/MembersManager";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

export const metadata: Metadata = {
  title: "Manajemen Anggota — LinTree Admin",
  description: "Kelola daftar anggota KPM kelompok mahasiswa dan DPL.",
};

export const revalidate = 0;

export default async function AdminMembersPage() {
  const membersList = isPreviewMode()
    ? getPreviewData("members")
    : await db.select().from(members);

  return <MembersManager initialMembers={membersList} />;
}

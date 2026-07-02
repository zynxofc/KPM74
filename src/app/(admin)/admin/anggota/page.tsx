import { db } from "@/db";
import { members } from "@/db/schema";
import { MembersManager } from "@/components/admin/MembersManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Anggota — LinTree Admin",
  description: "Kelola daftar anggota KPM kelompok mahasiswa dan DPL.",
};

export const revalidate = 0;

export default async function AdminMembersPage() {
  // Query all members sorted by id descending
  const membersList = await db.select().from(members);

  return <MembersManager initialMembers={membersList} />;
}

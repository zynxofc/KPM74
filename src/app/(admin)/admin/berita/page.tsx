import { db } from "@/db";
import { posts } from "@/db/schema";
import { NewsManager } from "@/components/admin/NewsManager";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

export const metadata: Metadata = {
  title: "Manajemen Berita — LinTree Admin",
  description: "Kelola penulisan artikel, pengumuman, dan publikasi berita resmi KPM.",
};

export const revalidate = 0;

export default async function AdminNewsPage() {
  const newsList = isPreviewMode()
    ? getPreviewData("posts")
    : await db.select().from(posts);

  return <NewsManager initialPosts={newsList} />;
}

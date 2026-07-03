import { NewsListClient } from "./NewsListClient";
import type { Metadata } from "next";
import { getSiteSettings, getNewsPostsList } from "@/lib/preview";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings?.siteName || "LinTree KPM";
  return {
    title: `Kabar Berita — ${siteName}`,
    description: `Dapatkan informasi, rilis pers, artikel, dan rilis publikasi kegiatan KPM kelompok ${siteName} di desa.`,
  };
}

export default async function PublicNewsPage() {
  const siteSettings = await getSiteSettings();
  const allPosts = await getNewsPostsList();

  const siteName = siteSettings?.siteName || "LinTree KPM";

  return <NewsListClient siteName={siteName} posts={allPosts} />;
}

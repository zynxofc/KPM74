import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://lintreekpm.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/profil",
          "/program-kerja",
          "/galeri",
          "/berita",
          "/berita/",
          "/peta-lokasi",
          "/faq",
        ],
        disallow: ["/admin", "/admin/", "/api/", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

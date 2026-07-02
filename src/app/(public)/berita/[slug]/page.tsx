import { db } from "@/db";
import { settings, posts } from "@/db/schema";
import { eq, ne, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, User, Tag, FileText } from "lucide-react";

export const revalidate = 0;

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  
  if (!post) return { title: "Berita Tidak Ditemukan" };
  
  const siteName = siteSettings?.siteName || "LinTree KPM";
  // Strip html to get plain text description
  const plainText = post.content.replace(/<[^>]*>/g, " ");
  const description = plainText.substring(0, 150).trim() + "...";

  return {
    title: `${post.title} — ${siteName}`,
    description,
  };
}

function formatDate(isoDate: string | null): string {
  if (!isoDate) return "-";
  try {
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export default async function NewsDetailPage({ params }: Params) {
  const { slug } = await params;

  // Fetch the article
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!post) {
    notFound();
  }

  // Fetch other articles as recommendations (up to 3 items)
  const recommendations = await db
    .select()
    .from(posts)
    .where(ne(posts.id, post.id))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  return (
    <div className="px-6 max-w-5xl mx-auto space-y-8 relative pb-12">
      {/* Background Decorators */}
      <div className="absolute top-[10%] left-[-5%] w-[40%] aspect-square bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back Button */}
      <div className="self-start">
        <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
        </Link>
      </div>

      {/* Article Content */}
      <article className="space-y-6">
        {/* Cover Photo */}
        {post.thumbnailUrl && (
          <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200/30 dark:border-slate-800/30 shadow-lg shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Metadata & Title */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 uppercase px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 dark:bg-secondary/10 dark:text-secondary dark:border-secondary/20">
              <Tag className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              KPM Admin
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Rich Text Body */}
        <GlassCard hoverLift={false} className="p-6 sm:p-10 border border-slate-200/40 dark:border-slate-800/40">
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </GlassCard>
      </article>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200/50 dark:border-slate-800/50">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary dark:text-secondary" /> Berita Lainnya
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <GlassCard
                key={item.id}
                hoverLift
                className="border border-slate-200/30 dark:border-slate-800/30 overflow-hidden flex flex-col justify-between group p-4 h-full"
              >
                <div className="space-y-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950/10 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/30 shrink-0">
                    {item.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 h-full">
                        <FileText className="w-6 h-6 opacity-45" />
                        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-550">Umum</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm hover:text-primary dark:hover:text-secondary transition-colors line-clamp-2 leading-snug">
                    <Link href={`/berita/${item.slug}`} className="cursor-pointer">
                      {item.title}
                    </Link>
                  </h3>
                  <span className="block text-[10px] text-slate-500 font-semibold">
                    {formatDate(item.publishedAt)}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

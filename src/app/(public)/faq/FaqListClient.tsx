"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Faq } from "@/db/schema";
import { cn } from "@/lib/utils";

interface FaqListClientProps {
  faqList: Faq[];
}

export function FaqListClient({ faqList }: FaqListClientProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {faqList.length === 0 ? (
        <GlassCard className="p-12 text-center text-slate-500 dark:text-slate-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate-400" />
          <p className="font-semibold text-lg">FAQ belum tersedia</p>
          <p className="text-sm mt-1">Silakan hubungi administrator jika Anda memiliki pertanyaan.</p>
        </GlassCard>
      ) : (
        faqList.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <GlassCard
              key={faq.id}
              hoverLift={false}
              className={cn(
                "p-0 border overflow-hidden transition-all duration-305",
                isOpen
                  ? "border-primary/50 dark:border-secondary/50 bg-white/70 dark:bg-slate-900/70"
                  : "border-slate-200/50 dark:border-slate-800/50 hover:border-primary/30"
              )}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:bg-slate-50 dark:focus-visible:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isOpen
                      ? "bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-455"
                  )}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-slate-400 dark:text-slate-550 transition-transform duration-300",
                  isOpen && "rotate-180 text-primary dark:text-secondary"
                )} />
              </button>

              {/* Accordion Body */}
              <div className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                isOpen ? "max-h-[500px] opacity-100 border-t border-slate-100 dark:border-slate-800" : "max-h-0 opacity-0"
              )}>
                <div className="px-6 py-5 text-slate-650 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </GlassCard>
          );
        })
      )}
    </div>
  );
}

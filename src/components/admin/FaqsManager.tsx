"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import { useToast } from "@/components/ui/Toast";
import { faqSchema } from "@/lib/validations";
import { createFaq, updateFaq, deleteFaq } from "@/lib/admin/actions";
import { useClientPagination } from "@/hooks/useClientPagination";
import type { Faq } from "@/db/schema";

type FaqFormValues = z.input<typeof faqSchema>;

interface FaqsManagerProps {
  initialFaqs: Faq[];
}

export function FaqsManager({ initialFaqs }: FaqsManagerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Deletion State
  const [deletingFaq, setDeletingFaq] = useState<Faq | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
  });

  // Filter list on client-side search query
  const filteredFaqs = initialFaqs.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Reusable Pagination Hook (5 items per page)
  const { currentPage, totalPages, paginatedItems, onPageChange } =
    useClientPagination(filteredFaqs, 5);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setServerError(null);
    reset({
      question: "",
      answer: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setServerError(null);
    reset({
      question: faq.question,
      answer: faq.answer,
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (faq: Faq) => {
    setDeletingFaq(faq);
    setIsDeleteConfirmOpen(true);
  };

  const onSubmit = async (values: FaqFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("question", values.question);
      formData.append("answer", values.answer);

      let result;
      if (editingFaq) {
        result = await updateFaq(editingFaq.id, null, formData);
      } else {
        result = await createFaq(null, formData);
      }

      if (result.error) {
        setServerError(result.error);
        toast(result.error, "error");
      } else if (result.success) {
        toast(
          editingFaq ? "FAQ berhasil diperbarui." : "FAQ baru berhasil ditambahkan.",
          "success"
        );
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingFaq) return;
    startTransition(async () => {
      const result = await deleteFaq(deletingFaq.id);
      if (result.error) {
        toast(result.error, "error");
      } else {
        toast("FAQ berhasil dihapus.", "success");
        setIsDeleteConfirmOpen(false);
        setDeletingFaq(null);
        window.location.reload();
      }
    });
  };

  const tableHeaders = [
    { key: "question", label: "Pertanyaan" },
    { key: "answer", label: "Jawaban" },
    { key: "actions", label: "Aksi", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary dark:text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen FAQ
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola daftar tanya jawab seputar Kuliah Pengabdian Masyarakat (KPM).
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shadow-lg shadow-primary/10 gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" /> Tambah FAQ
        </Button>
      </div>

      {/* Main Content Table Card */}
      <GlassCard hoverLift={false} className="p-6">
        <DataTable
          headers={tableHeaders}
          data={paginatedItems}
          searchPlaceholder="Cari berdasarkan pertanyaan atau jawaban..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          pagination={{
            currentPage,
            totalPages,
            onPageChange,
          }}
          renderRow={(faq) => (
            <tr
              key={faq.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-6 py-4.5 font-bold text-slate-905 dark:text-slate-100 max-w-xs">
                {faq.question}
              </td>
              <td className="px-6 py-4.5 text-slate-600 dark:text-slate-350 max-w-sm">
                <p className="line-clamp-2">{faq.answer}</p>
              </td>
              <td className="px-6 py-4.5 text-right whitespace-nowrap">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(faq)}
                    className="p-2 rounded-lg text-slate-500 hover:text-primary dark:hover:text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    title="Ubah FAQ"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(faq)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    title="Hapus FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </GlassCard>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaq ? "Ubah Data FAQ" : "Tambah FAQ Baru"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-red-700 dark:text-red-400 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Pertanyaan"
            placeholder="Contoh: Apa saja fokus program kerja KPM di desa ini?"
            error={errors.question?.message}
            {...register("question")}
          />

          <Textarea
            label="Jawaban"
            placeholder="Tuliskan penjelasan detail jawaban di sini..."
            className="min-h-[140px]"
            error={errors.answer?.message}
            {...register("answer")}
          />

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingFaq ? "Simpan Perubahan" : "Tambah FAQ"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus FAQ"
        message={`Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus FAQ"
        cancelText="Batal"
        isLoading={isPending}
      />
    </div>
  );
}

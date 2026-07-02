"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="space-y-6 pt-2">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-2xl text-red-500 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
              {message}
            </p>
            <p className="text-xs text-red-500 font-semibold">
              Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
          <Button
            variant="glass"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 focus-visible:ring-red-500"
          >
            {isLoading ? "Memproses..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

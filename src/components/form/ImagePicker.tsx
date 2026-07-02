"use client";

import React, { useState, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  name?: string;
  label?: string;
  onChange?: (file: File | null) => void;
  error?: string;
  placeholder?: string;
  initialImageUrl?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  name,
  label,
  onChange,
  error,
  placeholder = "Seret gambar ke sini atau klik untuk memilih",
  initialImageUrl,
}) => {
  const [prevInitialImageUrl, setPrevInitialImageUrl] = useState(initialImageUrl);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);

  // Sync initialImageUrl if it changes (derived state pattern)
  if (initialImageUrl !== prevInitialImageUrl) {
    setPrevInitialImageUrl(initialImageUrl);
    setPreview(initialImageUrl || null);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (onChange) onChange(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) onChange(null);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">
          {label}
        </label>
      )}

      {/* Upload Box Dropzone (UI Only, File input processed locally for preview) */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "w-full rounded-2xl border-2 border-dashed bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-[160px] group",
          error 
            ? "border-red-500 hover:border-red-500" 
            : "border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-secondary"
        )}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          name={name}
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          /* Preview Mode */
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full shadow-lg transition-transform active:scale-90"
              title="Hapus Gambar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Empty / Prompt Mode */
          <div className="flex flex-col items-center justify-center space-y-2 text-slate-450 dark:text-slate-500">
            <div className="p-3 bg-slate-100 dark:bg-slate-850 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary dark:group-hover:text-secondary transition-all">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                {placeholder}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-450">
                Mendukung JPEG, PNG, atau WebP (Maks. 2MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default ImagePicker;

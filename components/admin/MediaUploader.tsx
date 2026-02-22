"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy, Loader2, Check } from "lucide-react";
import { type DriveFile, getPublicUrl } from "@/lib/drive-utils";

interface MediaUploaderProps {
  files: DriveFile[];
  subfolder?: string;
  onUpload: (file: File, subfolder?: string) => Promise<void>;
  onDelete: (fileId: string) => Promise<void>;
}

export function MediaUploader({
  files,
  subfolder,
  onUpload,
  onDelete,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        await onUpload(file, subfolder);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    [onUpload, subfolder]
  );

  function copyUrl(fileId: string) {
    navigator.clipboard.writeText(getPublicUrl(fileId));
    setCopied(fileId);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Image
              </>
            )}
          </span>
        </label>
        {subfolder && (
          <span className="text-sm text-gray-500">Folder: {subfolder}</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="group relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
          >
            <div className="relative h-32">
              <Image
                src={getPublicUrl(file.id)}
                alt={file.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-600 truncate">{file.name}</p>
            </div>
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyUrl(file.id)}
                className="p-1.5 bg-white/90 rounded-md shadow-sm hover:bg-white"
                title="Copy URL"
              >
                {copied === file.id ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="p-1.5 bg-white/90 rounded-md shadow-sm hover:bg-white"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          </div>
        ))}

        {files.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-8">
            No images yet. Upload one to get started.
          </p>
        )}
      </div>
    </div>
  );
}

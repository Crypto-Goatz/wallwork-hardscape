"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, Trash2, Save, RefreshCw, ImageIcon, GripVertical } from "lucide-react";

interface PortfolioSlot {
  id: string;
  title: string;
  description: string;
  category: string;
  previewUrl?: string;
  image_ids?: string;
}

const EMPTY_SLOT = (i: number): PortfolioSlot => ({
  id: `new-${i}`,
  title: "",
  description: "",
  category: "",
});

const CATEGORIES = [
  "Retaining Wall",
  "Paver Patio",
  "Boulder Wall",
  "Outdoor Kitchen",
  "Concrete Driveway",
  "Excavation / Grading",
  "Other",
];

const MAX_PHOTOS = 10;

export default function AdminPortfolioPage() {
  const [slots, setSlots] = useState<PortfolioSlot[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content?sheet=portfolio");
      const json = await res.json();
      const rows: PortfolioSlot[] = (json.data ?? []).filter((r: PortfolioSlot) => r.title);
      const padded = [...rows.slice(0, MAX_PHOTOS)];
      while (padded.length < MAX_PHOTOS) padded.push(EMPTY_SLOT(padded.length));
      setSlots(padded);
    } catch {
      setSlots(Array.from({ length: MAX_PHOTOS }, (_, i) => EMPTY_SLOT(i)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const updateSlot = (index: number, field: keyof PortfolioSlot, value: string) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleImageSelect = async (index: number, file: File) => {
    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, previewUrl } : s)));

    setUploading(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json.fileId) {
        setSlots((prev) =>
          prev.map((s, i) =>
            i === index ? { ...s, image_ids: json.fileId, previewUrl } : s
          )
        );
      }
    } catch {
      // Media upload not configured — just keep preview
    } finally {
      setUploading(null);
    }
  };

  const saveSlot = async (index: number) => {
    setSaving(index);
    const slot = slots[index];
    try {
      if (slot.id.startsWith("new-") || !slot.id) {
        await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet: "portfolio",
            data: { ...slot, id: `portfolio_${Date.now()}`, previewUrl: undefined },
          }),
        });
      } else {
        const res = await fetch("/api/content?sheet=portfolio");
        const json = await res.json();
        const rowIndex = (json.data ?? []).findIndex((r: PortfolioSlot) => r.id === slot.id);
        if (rowIndex >= 0) {
          await fetch("/api/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sheet: "portfolio",
              rowIndex,
              data: { ...slot, previewUrl: undefined },
            }),
          });
        }
      }
      setSaved(index);
      setTimeout(() => setSaved(null), 2000);
      await fetchPortfolio();
    } finally {
      setSaving(null);
    }
  };

  const clearSlot = (index: number) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? EMPTY_SLOT(i) : s)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Upload up to 10 project photos with titles and descriptions.
          </p>
        </div>
        <button
          onClick={fetchPortfolio}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} strokeWidth={1.5} />
          Refresh
        </button>
      </div>

      {/* Photo count bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Photos added</span>
            <span className="font-medium text-gray-900">
              {slots.filter((s) => s.title || s.image_ids).length} / {MAX_PHOTOS}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-500"
              style={{
                width: `${(slots.filter((s) => s.title || s.image_ids).length / MAX_PHOTOS) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500 text-sm">Loading portfolio...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {slots.map((slot, i) => {
            const isEmpty = !slot.title && !slot.image_ids && !slot.previewUrl;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                  isEmpty ? "border-dashed border-gray-200" : "border-gray-200 shadow-sm"
                }`}
              >
                {/* Image area */}
                <div className="relative aspect-video bg-gray-50">
                  {slot.previewUrl || slot.image_ids ? (
                    <Image
                      src={slot.previewUrl || `/api/media/${slot.image_ids}`}
                      alt={slot.title || `Portfolio photo ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group hover:bg-gray-100 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageSelect(i, file);
                        }}
                      />
                      <ImageIcon className="w-8 h-8 text-gray-300 mb-2 group-hover:text-gray-400 transition-colors" strokeWidth={1.5} />
                      <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                        Click to upload photo
                      </span>
                    </label>
                  )}

                  {/* Slot number badge */}
                  <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isEmpty ? "bg-gray-200 text-gray-400" : "bg-red-600 text-white"
                  }`}>
                    {i + 1}
                  </div>

                  {/* Upload overlay if has image */}
                  {(slot.previewUrl || slot.image_ids) && (
                    <label className="absolute top-2 right-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageSelect(i, file);
                        }}
                      />
                      <div className="w-7 h-7 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center transition-colors">
                        {uploading === i ? (
                          <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" strokeWidth={1.5} />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                        )}
                      </div>
                    </label>
                  )}
                </div>

                {/* Fields */}
                <div className="p-4 space-y-3">
                  <input
                    type="text"
                    value={slot.title}
                    onChange={(e) => updateSlot(i, "title", e.target.value)}
                    placeholder="Project title (e.g. Retaining Wall — Mt. Lebanon)"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                  />

                  <select
                    value={slot.category}
                    onChange={(e) => updateSlot(i, "category", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 text-gray-700"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <textarea
                    value={slot.description}
                    onChange={(e) => updateSlot(i, "description", e.target.value)}
                    placeholder="Brief project description..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 resize-none"
                  />

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      disabled={saving === i || !slot.title}
                      onClick={() => saveSlot(i)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors"
                    >
                      {saving === i ? (
                        <RefreshCw className="w-3 h-3 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <Save className="w-3 h-3" strokeWidth={1.5} />
                      )}
                      {saved === i ? "Saved!" : "Save"}
                    </button>
                    {!isEmpty && (
                      <button
                        type="button"
                        onClick={() => clearSlot(i)}
                        className="px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Save, Plus, Trash2, RefreshCw, User } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: string;
}

const EMPTY_SLOT: Testimonial = { id: "", name: "", role: "", text: "", rating: "5" };
const MAX_SLOTS = 5;

const PLACEHOLDERS: Testimonial[] = [
  { id: "p1", name: "Brian M.", role: "Homeowner — Mt. Lebanon, PA", text: "Wall Works completely transformed our backyard. The retaining wall they built is solid, beautiful, and exactly what we envisioned. The crew was professional, on time, and cleaned up every day.", rating: "5" },
  { id: "p2", name: "Stephanie R.", role: "Homeowner — Peters Township, PA", text: "We had a massive erosion problem on our hillside property. Wall Works built a tiered boulder wall system that solved everything. Honestly exceeded our expectations.", rating: "5" },
  { id: "p3", name: "Dave & Lisa T.", role: "Homeowners — Upper St. Clair, PA", text: "From the estimate to the final walkthrough, everything was seamless. Our paver patio and outdoor kitchen came out stunning. We use it every weekend.", rating: "5" },
  { id: "p4", name: "Kevin O.", role: "Property Manager — Pittsburgh, PA", text: "We needed a commercial retaining wall done fast and done right. Wall Works delivered on both. Clear communication, competitive price, and flawless execution.", rating: "5" },
  { id: "p5", name: "Rachel H.", role: "Homeowner — Bethel Park, PA", text: "Our concrete driveway and front walkway look absolutely incredible. Multiple neighbors have asked who we used. Couldn't be happier with the quality and professionalism.", rating: "5" },
];

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              n <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [slots, setSlots] = useState<Testimonial[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content?sheet=testimonials");
      const json = await res.json();
      const rows: Testimonial[] = (json.data ?? []).filter((r: Testimonial) => r.name);
      // Pad to MAX_SLOTS
      const padded = [...rows.slice(0, MAX_SLOTS)];
      while (padded.length < MAX_SLOTS) padded.push({ ...EMPTY_SLOT, id: `new-${padded.length}` });
      setSlots(padded);
    } catch {
      // No sheets — show empty slots
      setSlots(Array.from({ length: MAX_SLOTS }, (_, i) => ({ ...EMPTY_SLOT, id: `new-${i}` })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const updateSlot = (index: number, field: keyof Testimonial, value: string) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const saveSlot = async (index: number) => {
    setSaving(index);
    const slot = slots[index];
    try {
      if (slot.id.startsWith("new-") || !slot.id) {
        await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sheet: "testimonials", data: { ...slot, id: `t_${Date.now()}` } }),
        });
      } else {
        // Find real row index
        const res = await fetch("/api/content?sheet=testimonials");
        const json = await res.json();
        const allRows: Testimonial[] = json.data ?? [];
        const rowIndex = allRows.findIndex((r) => r.id === slot.id);
        if (rowIndex >= 0) {
          await fetch("/api/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sheet: "testimonials", rowIndex, data: slot }),
          });
        }
      }
      setSaved(index);
      setTimeout(() => setSaved(null), 2000);
      await fetchTestimonials();
    } finally {
      setSaving(null);
    }
  };

  const clearSlot = (index: number) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...EMPTY_SLOT, id: `new-${i}` } : s))
    );
  };

  const loadPlaceholder = (index: number) => {
    const p = PLACEHOLDERS[index];
    if (!p) return;
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...p, id: s.id } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage up to 5 client reviews shown on the website.
          </p>
        </div>
        <button
          onClick={fetchTestimonials}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} strokeWidth={1.5} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500 text-sm">Loading testimonials...</span>
        </div>
      ) : (
        <div className="grid gap-5">
          {slots.map((slot, i) => {
            const isEmpty = !slot.name && !slot.text;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border p-6 transition-all ${
                  isEmpty ? "border-dashed border-gray-200" : "border-gray-200 shadow-sm"
                }`}
              >
                {/* Slot header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isEmpty ? "bg-gray-100 text-gray-400" : "bg-red-600 text-white"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {isEmpty ? "Empty slot" : slot.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEmpty && (
                      <button
                        type="button"
                        onClick={() => loadPlaceholder(i)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" strokeWidth={1.5} />
                        Load sample
                      </button>
                    )}
                    {!isEmpty && (
                      <button
                        type="button"
                        onClick={() => clearSlot(i)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={saving === i || !slot.name}
                      onClick={() => saveSlot(i)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 transition-colors flex items-center gap-1"
                    >
                      {saving === i ? (
                        <RefreshCw className="w-3 h-3 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <Save className="w-3 h-3" strokeWidth={1.5} />
                      )}
                      {saved === i ? "Saved!" : "Save"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={slot.name}
                        onChange={(e) => updateSlot(i, "name", e.target.value)}
                        placeholder="e.g. John D."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                      />
                    </div>
                  </div>

                  {/* Role / Location */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Role / Location
                    </label>
                    <input
                      type="text"
                      value={slot.role}
                      onChange={(e) => updateSlot(i, "role", e.target.value)}
                      placeholder="e.g. Homeowner — Pittsburgh, PA"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                    />
                  </div>

                  {/* Review text */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Review Text <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={slot.text}
                      onChange={(e) => updateSlot(i, "text", e.target.value)}
                      placeholder="What did the client say about the project?"
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 resize-none"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Star Rating
                    </label>
                    <StarRating
                      value={parseInt(slot.rating) || 5}
                      onChange={(n) => updateSlot(i, "rating", String(n))}
                    />
                  </div>
                </div>

                {/* Live preview */}
                {!isEmpty && (
                  <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-medium">Preview</p>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3.5 h-3.5 ${n <= (parseInt(slot.rating) || 5) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 italic mb-2">&ldquo;{slot.text}&rdquo;</p>
                    <p className="text-xs font-semibold text-gray-900">{slot.name}</p>
                    {slot.role && <p className="text-xs text-gray-400">{slot.role}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

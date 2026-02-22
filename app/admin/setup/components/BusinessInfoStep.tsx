"use client";

import { useState } from "react";

export interface BusinessInfo {
  name: string;
  phone: string;
  email: string;
  url: string;
  tagline: string;
  industry: string;
}

interface Props {
  initial: Partial<BusinessInfo>;
  onComplete: (data: BusinessInfo) => void;
}

const INDUSTRIES = [
  "Home Services",
  "Construction & Remodeling",
  "Landscaping & Lawn Care",
  "Cleaning Services",
  "Auto Repair & Detailing",
  "Salon & Spa",
  "Health & Wellness",
  "Legal Services",
  "Accounting & Finance",
  "Real Estate",
  "Restaurant & Food Service",
  "Fitness & Personal Training",
  "Photography & Videography",
  "Pet Services",
  "Education & Tutoring",
  "Technology & IT Services",
  "Marketing & Design",
  "Other",
];

export function BusinessInfoStep({ initial, onComplete }: Props) {
  const [form, setForm] = useState<BusinessInfo>({
    name: initial.name || "",
    phone: initial.phone || "",
    email: initial.email || "",
    url: initial.url || "",
    tagline: initial.tagline || "",
    industry: initial.industry || "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessInfo, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Business name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email is required";
    if (!form.industry) e.industry = "Select an industry";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onComplete(form);
  }

  const inputClass =
    "w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-white mb-2">Tell us about your business</h2>
      <p className="text-white/60 text-sm mb-6">This information will be used across your website.</p>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Business Name *</label>
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Acme Plumbing Co."
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Phone *</label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(555) 555-5555"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Email *</label>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="info@acmeplumbing.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Website URL</label>
        <input
          className={inputClass}
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://acmeplumbing.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Tagline</label>
        <input
          className={inputClass}
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          placeholder="Professional Plumbing You Can Trust"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Industry *</label>
        <select
          className={inputClass}
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
        >
          <option value="" className="bg-slate-900">Select an industry...</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind} className="bg-slate-900">
              {ind}
            </option>
          ))}
        </select>
        {errors.industry && <p className="text-red-400 text-xs mt-1">{errors.industry}</p>}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        Continue
      </button>
    </form>
  );
}

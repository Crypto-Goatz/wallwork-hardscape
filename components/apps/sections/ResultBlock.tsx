"use client";

import type { ResultSection } from "@/config/app-schema";

interface ResultBlockProps {
  section: ResultSection;
  values: Record<string, string>;
}

export function ResultBlock({ section, values }: ResultBlockProps) {
  // Evaluate showIf condition
  if (section.showIf) {
    try {
      const paramNames = Object.keys(values);
      const paramValues = Object.values(values);
      const fn = new Function(...paramNames, `return (${section.showIf});`);
      if (!fn(...paramValues)) return null;
    } catch {
      return null;
    }
  }

  // Interpolate {{field_name}} placeholders
  const html = section.template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => values[key] || ""
  );

  return (
    <div className="space-y-4">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
      )}
      <div
        className="rounded-lg bg-green-50 border border-green-200 p-6 prose prose-green max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

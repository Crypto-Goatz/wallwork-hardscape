"use client";

import type { TextSection } from "@/config/app-schema";

interface TextBlockProps {
  section: TextSection;
}

export function TextBlock({ section }: TextBlockProps) {
  return (
    <div className="space-y-4">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
      )}
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: section.body }}
      />
    </div>
  );
}

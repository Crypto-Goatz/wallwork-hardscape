"use client";

import type { FormSection, FormField } from "@/config/app-schema";
import { Input, Textarea } from "@/components/ui/input";

interface FormBlockProps {
  section: FormSection;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

function renderField(
  field: FormField,
  value: string,
  onChange: (name: string, value: string) => void
) {
  const baseClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors";

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          name={field.name}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      );

    case "select":
      return (
        <select
          name={field.name}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
          className={baseClass}
        >
          <option value="">{field.placeholder || "Select..."}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name={field.name}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              {opt}
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name={field.name}
            checked={value === "true"}
            onChange={(e) => onChange(field.name, e.target.checked ? "true" : "false")}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          {field.label}
        </label>
      );

    case "hidden":
      return (
        <input type="hidden" name={field.name} value={value} />
      );

    default:
      return (
        <Input
          type={field.type === "phone" ? "tel" : field.type}
          name={field.name}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          min={field.validation?.min}
          max={field.validation?.max}
          pattern={field.validation?.pattern}
        />
      );
  }
}

export function FormBlock({ section, values, onChange }: FormBlockProps) {
  return (
    <div className="space-y-4">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
      )}
      <div className="space-y-4">
        {section.fields.map((field) => (
          <div key={field.name}>
            {field.type !== "checkbox" && field.type !== "hidden" && (
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            {renderField(field, values[field.name] || field.defaultValue || "", onChange)}
          </div>
        ))}
      </div>
    </div>
  );
}

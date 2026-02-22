/**
 * AppDefinition schema — the central data structure that powers
 * the dynamic app renderer. Stored as JSON in the custom_apps sheet.
 */

// ── Field types ─────────────────────────────────────────────

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "phone"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio"
    | "hidden";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// ── Section types ───────────────────────────────────────────

export interface TextSection {
  type: "text";
  heading?: string;
  body: string; // HTML string
}

export interface FormSection {
  type: "form";
  heading?: string;
  fields: FormField[];
}

export interface CalculatorSection {
  type: "calculator";
  heading?: string;
  inputs: FormField[];
  formula: string; // JS expression evaluated with input values
  resultLabel: string;
  resultFormat?: string; // e.g. "${{result}}" or "{{result}} sq ft"
}

export interface WizardStep {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface WizardSection {
  type: "wizard";
  heading?: string;
  steps: WizardStep[];
}

export interface ResultSection {
  type: "result";
  heading?: string;
  template: string; // HTML with {{field_name}} placeholders
  showIf?: string; // JS expression evaluated against form values
}

export type AppSection =
  | TextSection
  | FormSection
  | CalculatorSection
  | WizardSection
  | ResultSection;

// ── Top-level definition ────────────────────────────────────

export interface AppDefinition {
  meta: {
    title: string;
    slug: string;
    description: string;
    icon?: string; // Lucide icon name
  };
  sections: AppSection[];
  crm?: {
    source: string;
    tags: string[];
    workflowId?: string;
    fieldMap: Record<string, string>; // form_field -> CRM contact field
  };
  settings?: {
    showHeader?: boolean;
    showFooter?: boolean;
    submitButtonText?: string;
    successMessage?: string;
    redirectUrl?: string;
  };
}

// ── Validator ───────────────────────────────────────────────

export function parseAppDefinition(raw: unknown): AppDefinition {
  if (!raw || typeof raw !== "object") {
    throw new Error("AppDefinition must be an object");
  }

  const obj = raw as Record<string, unknown>;

  // Validate meta
  if (!obj.meta || typeof obj.meta !== "object") {
    throw new Error("AppDefinition.meta is required");
  }
  const meta = obj.meta as Record<string, unknown>;
  if (typeof meta.title !== "string" || !meta.title) {
    throw new Error("meta.title is required");
  }
  if (typeof meta.slug !== "string" || !meta.slug) {
    throw new Error("meta.slug is required");
  }
  if (typeof meta.description !== "string") {
    throw new Error("meta.description is required");
  }

  // Validate sections
  if (!Array.isArray(obj.sections)) {
    throw new Error("AppDefinition.sections must be an array");
  }

  const validTypes = ["text", "form", "calculator", "wizard", "result"];
  for (const section of obj.sections) {
    if (!section || typeof section !== "object") {
      throw new Error("Each section must be an object");
    }
    const s = section as Record<string, unknown>;
    if (!validTypes.includes(s.type as string)) {
      throw new Error(
        `Invalid section type "${s.type}". Must be one of: ${validTypes.join(", ")}`
      );
    }
  }

  return obj as unknown as AppDefinition;
}

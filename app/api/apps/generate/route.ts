import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

const SCHEMA_PROMPT = [
  "You are an expert at converting user requirements into structured JSON app definitions.",
  "",
  "Given the user's input (which may be JSON data, markdown instructions, or a combination), generate a valid AppDefinition JSON object.",
  "",
  "## AppDefinition Schema",
  "",
  "interface AppDefinition {",
  "  meta: {",
  '    title: string;        // Display title',
  '    slug: string;         // URL-safe slug (lowercase, hyphens)',
  '    description: string;  // Brief description',
  '    icon?: string;        // Lucide icon name (e.g. "Calculator", "ClipboardList")',
  "  };",
  "  sections: AppSection[]; // Ordered array of sections",
  "  crm?: {",
  '    source: string;       // Lead source name',
  '    tags: string[];       // Tags to apply to CRM contact',
  '    workflowId?: string;  // Optional CRM workflow to trigger',
  '    fieldMap: Record<string, string>; // form_field_name -> CRM_field_name',
  "  };",
  "  settings?: {",
  "    showHeader?: boolean;",
  "    showFooter?: boolean;",
  "    submitButtonText?: string;",
  "    successMessage?: string;",
  "    redirectUrl?: string;",
  "  };",
  "}",
  "",
  "## Section Types",
  "",
  '1. TextSection: { type: "text", heading?: string, body: string }',
  "   - body is HTML content",
  "",
  '2. FormSection: { type: "form", heading?: string, fields: FormField[] }',
  "   - FormField: { name, label, type, placeholder?, required?, options?, defaultValue?, validation? }",
  '   - type: "text" | "email" | "phone" | "number" | "select" | "textarea" | "checkbox" | "radio" | "hidden"',
  "   - validation: { min?, max?, pattern?, message? }",
  "",
  '3. CalculatorSection: { type: "calculator", heading?: string, inputs: FormField[], formula: string, resultLabel: string, resultFormat?: string }',
  '   - formula: JS expression using input names as variables (e.g. "length * width")',
  '   - resultFormat: template with {{result}} placeholder (e.g. "${{result}}")',
  "",
  '4. WizardSection: { type: "wizard", heading?: string, steps: WizardStep[] }',
  "   - WizardStep: { title: string, description?: string, fields: FormField[] }",
  "",
  '5. ResultSection: { type: "result", heading?: string, template: string, showIf?: string }',
  "   - template: HTML with {{field_name}} placeholders",
  "   - showIf: JS boolean expression using field names",
  "",
  "## Rules",
  "- Generate ONLY valid JSON (no markdown fences, no explanation)",
  "- Use appropriate section types based on user requirements",
  "- Always include meta with title, slug, and description",
  "- For forms that collect contact info, include crm config with fieldMap",
  "- Make field names lowercase with underscores",
  "- Use descriptive labels and helpful placeholders",
  "- Set required: true for essential fields",
  "- If the user describes something too complex for this schema (custom charts, interactive maps, complex state machines), set isComplex: true at the root level and include a sourceCode field with a React component that implements it",
  "",
  "Return ONLY the JSON object.",
].join("\n");

/**
 * POST /api/apps/generate
 * Use Gemini AI to generate an AppDefinition from user input.
 */
export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "input is required (string)" },
        { status: 400 }
      );
    }

    const prompt = `${SCHEMA_PROMPT}\n\n## User Input\n\n${input}`;
    const raw = await generateContent(prompt);

    // Strip markdown fences if present
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();

    const parsed = JSON.parse(cleaned);
    const isComplex = parsed.isComplex === true;
    const sourceCode = parsed.sourceCode || undefined;

    // Remove non-schema fields before returning definition
    delete parsed.isComplex;
    delete parsed.sourceCode;

    return NextResponse.json({
      definition: parsed,
      isComplex,
      sourceCode,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

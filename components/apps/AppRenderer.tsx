"use client";

import { useState } from "react";
import type { AppDefinition } from "@/config/app-schema";
import { TextBlock } from "./sections/TextBlock";
import { FormBlock } from "./sections/FormBlock";
import { CalculatorBlock } from "./sections/CalculatorBlock";
import { WizardBlock } from "./sections/WizardBlock";
import { ResultBlock } from "./sections/ResultBlock";
import { CheckCircle2 } from "lucide-react";

interface AppRendererProps {
  definition: AppDefinition;
  preview?: boolean;
}

export function AppRenderer({ definition, preview }: AppRendererProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (preview) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/apps/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: definition.meta.slug,
          values,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Has any form/wizard section?
  const hasFormContent = definition.sections.some(
    (s) => s.type === "form" || s.type === "wizard"
  );

  if (submitted) {
    const msg =
      definition.settings?.successMessage ||
      "Thank you! Your submission has been received.";
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
        <p className="text-gray-600">{msg}</p>
        {definition.settings?.redirectUrl && (
          <a
            href={definition.settings.redirectUrl}
            className="inline-block mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {definition.sections.map((section, index) => {
        switch (section.type) {
          case "text":
            return <TextBlock key={index} section={section} />;
          case "form":
            return (
              <FormBlock
                key={index}
                section={section}
                values={values}
                onChange={handleChange}
              />
            );
          case "calculator":
            return <CalculatorBlock key={index} section={section} />;
          case "wizard":
            return (
              <WizardBlock
                key={index}
                section={section}
                values={values}
                onChange={handleChange}
              />
            );
          case "result":
            return (
              <ResultBlock key={index} section={section} values={values} />
            );
          default:
            return null;
        }
      })}

      {hasFormContent && (
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting || preview}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting
              ? "Submitting..."
              : definition.settings?.submitButtonText || "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}

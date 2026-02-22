"use client";

import { useState } from "react";
import type { WizardSection } from "@/config/app-schema";
import { FormBlock } from "./FormBlock";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WizardBlockProps {
  section: WizardSection;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export function WizardBlock({ section, values, onChange }: WizardBlockProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = section.steps;
  const step = steps[currentStep];

  const canAdvance = () => {
    if (!step) return false;
    for (const field of step.fields) {
      if (field.required && !values[field.name]?.trim()) return false;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                i < currentStep
                  ? "bg-green-500 text-white"
                  : i === currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                i === currentStep ? "font-medium text-gray-900" : "text-gray-500"
              }`}
            >
              {s.title}
            </span>
            {i < steps.length - 1 && (
              <div className="w-8 h-px bg-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Current step */}
      {step && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
            {step.description && (
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            )}
          </div>

          <FormBlock
            section={{ type: "form", fields: step.fields }}
            values={values}
            onChange={onChange}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={!canAdvance()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

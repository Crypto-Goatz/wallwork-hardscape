"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: Set<number>;
}

const STEPS = [
  { num: 1, label: "Business Info" },
  { num: 2, label: "Branding" },
  { num: 3, label: "Google Connect" },
  { num: 4, label: "Import Site" },
  { num: 5, label: "AI Content" },
  { num: 6, label: "Integrations" },
  { num: 7, label: "Complete" },
];

export function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, i) => {
        const isComplete = completedSteps.has(step.num);
        const isCurrent = step.num === currentStep;

        return (
          <div key={step.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isComplete
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {isComplete ? <Check className="w-5 h-5" /> : step.num}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium hidden sm:block ${
                  isCurrent ? "text-white" : "text-white/40"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded ${
                  isComplete ? "bg-green-500" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

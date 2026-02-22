"use client";

import { useState, useMemo } from "react";
import type { CalculatorSection } from "@/config/app-schema";
import { Input } from "@/components/ui/input";

interface CalculatorBlockProps {
  section: CalculatorSection;
}

export function CalculatorBlock({ section }: CalculatorBlockProps) {
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const input of section.inputs) {
      initial[input.name] = input.defaultValue || "";
    }
    return initial;
  });

  const result = useMemo(() => {
    try {
      // Build a sandboxed numeric context from inputs
      const numericValues: Record<string, number> = {};
      for (const [key, val] of Object.entries(inputs)) {
        numericValues[key] = parseFloat(val) || 0;
      }

      // Create function with named params
      const paramNames = Object.keys(numericValues);
      const paramValues = Object.values(numericValues);
      const fn = new Function(...paramNames, `return (${section.formula});`);
      const raw = fn(...paramValues);
      return typeof raw === "number" && !isNaN(raw) ? raw : null;
    } catch {
      return null;
    }
  }, [inputs, section.formula]);

  const formattedResult =
    result !== null && section.resultFormat
      ? section.resultFormat.replace("{{result}}", result.toLocaleString())
      : result !== null
        ? result.toLocaleString()
        : "—";

  return (
    <div className="space-y-4">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {section.inputs.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {field.label}
            </label>
            <Input
              type="number"
              name={field.name}
              value={inputs[field.name] || ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
              placeholder={field.placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-6 text-center">
        <p className="text-sm font-medium text-blue-700 mb-1">
          {section.resultLabel}
        </p>
        <p className="text-3xl font-bold text-blue-900">{formattedResult}</p>
      </div>
    </div>
  );
}

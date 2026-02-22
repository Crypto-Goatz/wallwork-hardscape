"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { AppRenderer } from "@/components/apps/AppRenderer";
import { parseAppDefinition, type AppDefinition } from "@/config/app-schema";
import {
  Sparkles,
  Save,
  Download,
  ArrowLeft,
  Upload,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AppImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [definition, setDefinition] = useState<AppDefinition | null>(null);
  const [definitionJson, setDefinitionJson] = useState("");
  const [isComplex, setIsComplex] = useState(false);
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") {
        setInput(text);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setAnalyzing(true);
    setDefinition(null);
    setJsonError(null);
    setIsComplex(false);
    setSourceCode(null);

    try {
      const res = await fetch("/api/apps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data = await res.json();
      const json = JSON.stringify(data.definition, null, 2);
      setDefinitionJson(json);
      setIsComplex(data.isComplex || false);
      setSourceCode(data.sourceCode || null);

      try {
        const parsed = parseAppDefinition(data.definition);
        setDefinition(parsed);
      } catch (e) {
        setJsonError(e instanceof Error ? e.message : "Invalid definition");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleJsonEdit = (value: string) => {
    setDefinitionJson(value);
    setJsonError(null);
    try {
      const parsed = parseAppDefinition(JSON.parse(value));
      setDefinition(parsed);
    } catch (e) {
      setDefinition(null);
      if (value.trim()) {
        setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      }
    }
  };

  const handlePublish = async () => {
    if (!definition) return;

    setPublishing(true);
    try {
      const now = new Date().toISOString();
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet: "custom_apps",
          data: {
            id: `app_${Date.now()}`,
            title: definition.meta.title,
            slug: definition.meta.slug,
            status: "active",
            definition: definitionJson,
            created_at: now,
            updated_at: now,
          },
        }),
      });
      router.push("/admin/apps");
    } catch {
      alert("Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  const handleDownloadSource = () => {
    if (!sourceCode) return;
    const blob = new Blob([sourceCode], { type: "text/tsx" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${definition?.meta.slug || "app"}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/apps"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold">AI Import</h1>
      </div>

      {/* Step 1: Input */}
      <Card>
        <CardHeader>
          <CardTitle>1. Describe Your App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Paste JSON data, markdown instructions, or a combination describing the
            tool you want to create. The AI will generate a structured app definition.
          </p>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Example:\n\nCreate a roof estimate calculator with the following fields:\n- Roof length (feet)\n- Roof width (feet)\n- Pitch factor (select: Low 1.05, Medium 1.15, Steep 1.3)\n- Material cost per sq ft ($)\n\nFormula: length * width * pitch * cost\nShow the total estimate formatted as currency.\n\nAlso collect the customer's name, email, and phone number.\nTag them as "roof-estimate" in the CRM.`}
            className="min-h-[200px]"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !input.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {analyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {analyzing ? "Analyzing..." : "Analyze with AI"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.md,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Result */}
      {definitionJson && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSON editor */}
          <Card>
            <CardHeader>
              <CardTitle>2. Review & Edit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={definitionJson}
                onChange={(e) => handleJsonEdit(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
              />
              {jsonError && (
                <p className="text-sm text-red-600">{jsonError}</p>
              )}
              {isComplex && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <p className="text-sm text-yellow-800">
                    This app is too complex for the standard renderer. A custom
                    React component has been generated.
                  </p>
                  {sourceCode && (
                    <button
                      onClick={handleDownloadSource}
                      className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download Source Code
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>3. Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {definition ? (
                <AppRenderer definition={definition} preview />
              ) : (
                <p className="text-sm text-gray-500 py-8 text-center">
                  Fix JSON errors to see preview
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Publish */}
      {definition && (
        <Card>
          <CardContent className="py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {definition.meta.title}
              </p>
              <p className="text-sm text-gray-500">
                Will be published at /tools/{definition.meta.slug}
              </p>
            </div>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

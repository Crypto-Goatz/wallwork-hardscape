"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { AppRenderer } from "@/components/apps/AppRenderer";
import { parseAppDefinition, type AppDefinition } from "@/config/app-schema";
import { Save, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AppRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  definition: string;
  created_at: string;
  updated_at: string;
}

export default function AppEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [json, setJson] = useState("{}");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [preview, setPreview] = useState<AppDefinition | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [rowIndex, setRowIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isNew) return;

    async function loadApp() {
      try {
        const res = await fetch("/api/content?sheet=custom_apps");
        if (!res.ok) throw new Error("Failed to load");
        const { data } = await res.json();

        // Find by id or by index
        const idx = data.findIndex(
          (a: AppRow) => a.id === id || String(data.indexOf(a)) === id
        );
        if (idx === -1) throw new Error("App not found");

        const app = data[idx];
        setTitle(app.title);
        setSlug(app.slug);
        setStatus(app.status);
        setJson(app.definition || "{}");
        setRowIndex(idx);

        try {
          const parsed = parseAppDefinition(JSON.parse(app.definition));
          setPreview(parsed);
        } catch {
          // Invalid JSON, that's ok for editing
        }
      } catch {
        alert("Failed to load app");
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [id, isNew]);

  const handleJsonChange = (value: string) => {
    setJson(value);
    setJsonError(null);
    try {
      const parsed = parseAppDefinition(JSON.parse(value));
      setPreview(parsed);
      // Auto-populate meta fields from definition
      if (parsed.meta.title && !title) setTitle(parsed.meta.title);
      if (parsed.meta.slug && !slug) setSlug(parsed.meta.slug);
    } catch (e) {
      setPreview(null);
      if (value.trim()) {
        setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      }
    }
  };

  const handleSave = async () => {
    // Validate JSON
    try {
      parseAppDefinition(JSON.parse(json));
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      return;
    }

    if (!title.trim() || !slug.trim()) {
      alert("Title and slug are required");
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const data: AppRow = {
        id: isNew ? `app_${Date.now()}` : id,
        title,
        slug,
        status,
        definition: json,
        created_at: isNew ? now : "",
        updated_at: now,
      };

      if (isNew) {
        await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sheet: "custom_apps", data }),
        });
      } else {
        await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet: "custom_apps",
            rowIndex,
            data,
          }),
        });
      }

      router.push("/admin/apps");
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-3 text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/apps"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold">
            {isNew ? "New App" : "Edit App"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Editor panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Calculator"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-calculator"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Definition JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={json}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
                placeholder='{"meta": {"title": "...", "slug": "...", "description": "..."}, "sections": []}'
              />
              {jsonError && (
                <p className="text-sm text-red-600 mt-2">{jsonError}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {preview ? (
                  <AppRenderer definition={preview} preview />
                ) : (
                  <p className="text-sm text-gray-500 py-8 text-center">
                    Enter valid JSON to see a preview
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

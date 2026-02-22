"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Sparkles,
  ExternalLink,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface AppRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  definition: string;
  created_at: string;
  updated_at: string;
}

export default function AppsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApps = async () => {
    try {
      const res = await fetch("/api/content?sheet=custom_apps");
      if (res.ok) {
        const { data } = await res.json();
        setApps(data || []);
      }
    } catch {
      // Sheet may not exist yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const toggleStatus = async (app: AppRow, index: number) => {
    const newStatus = app.status === "active" ? "draft" : "active";
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet: "custom_apps",
          rowIndex: index,
          data: { ...app, status: newStatus, updated_at: new Date().toISOString() },
        }),
      });
      setApps((prev) =>
        prev.map((a, i) => (i === index ? { ...a, status: newStatus } : a))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const deleteApp = async (index: number) => {
    if (!confirm("Are you sure you want to delete this app?")) return;
    try {
      await fetch(`/api/content?sheet=custom_apps&rowIndex=${index}`, {
        method: "DELETE",
      });
      setApps((prev) => prev.filter((_, i) => i !== index));
    } catch {
      alert("Failed to delete app");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-3 text-gray-500">Loading apps...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Apps</h1>
          <p className="text-gray-600 mt-1">
            Create and manage custom tools, calculators, and forms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/apps/import"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            AI Import
          </Link>
          <Link
            href="/admin/apps/edit/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New App
          </Link>
        </div>
      </div>

      {apps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No apps yet. Create your first one!</p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/admin/apps/import"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                AI Import
              </Link>
              <Link
                href="/admin/apps/edit/new"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Manual Create
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app, index) => (
            <Card key={app.id || index} className="relative">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.title}</h3>
                    <p className="text-sm text-gray-500">/tools/{app.slug}</p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      app.status === "active"
                        ? "bg-green-100 text-green-700"
                        : app.status === "archived"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => toggleStatus(app, index)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title={app.status === "active" ? "Set to draft" : "Set to active"}
                  >
                    {app.status === "active" ? (
                      <ToggleRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>

                  {app.status === "active" && (
                    <a
                      href={`/tools/${app.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                  )}

                  <Link
                    href={`/admin/apps/edit/${app.id || index}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteApp(index)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

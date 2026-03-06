"use client";

import { useState, useEffect, useCallback } from "react";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { SHEETS_SCHEMA, type SheetName } from "@/config/sheets-schema";
import type { Row } from "@/lib/google/sheets";

const TABS: { key: SheetName; label: string }[] = [
  { key: "services", label: "Services" },
  { key: "blog", label: "Blog" },
  { key: "portfolio", label: "Portfolio" },
  { key: "testimonials", label: "Testimonials" },
  { key: "team", label: "Team" },
  { key: "faqs", label: "FAQs" },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<SheetName>("services");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (sheet: SheetName) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content?sheet=${sheet}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setRows(json.data ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const handleSave = async (rowIndex: number, data: Row) => {
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheet: activeTab, rowIndex, data }),
    });
    await fetchData(activeTab);
  };

  const handleAdd = async (data: Row) => {
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheet: activeTab, data }),
    });
    await fetchData(activeTab);
  };

  const handleDelete = async (rowIndex: number) => {
    await fetch(`/api/content?sheet=${activeTab}&rowIndex=${rowIndex}`, {
      method: "DELETE",
    });
    await fetchData(activeTab);
  };

  const schema = SHEETS_SCHEMA[activeTab];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Manager</h1>
        <p className="text-gray-600 mt-1">
          Edit your website content. Changes sync directly with Google Sheets.
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-500">Loading...</span>
        </div>
      ) : (
        <ContentEditor
          sheetName={activeTab}
          columns={schema.columns}
          rows={rows}
          onSave={handleSave}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

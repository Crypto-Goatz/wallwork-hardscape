"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import type { Row } from "@/lib/google/sheets";

interface ContentEditorProps {
  sheetName: string;
  columns: readonly string[];
  rows: Row[];
  onSave: (rowIndex: number, data: Row) => Promise<void>;
  onAdd: (data: Row) => Promise<void>;
  onDelete: (rowIndex: number) => Promise<void>;
}

export function ContentEditor({
  sheetName,
  columns,
  rows,
  onSave,
  onAdd,
  onDelete,
}: ContentEditorProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newRowData, setNewRowData] = useState<Row>({});

  const largeFields = ["content", "description", "bio", "text", "answer"];

  async function handleSave(rowIndex: number) {
    setSaving(true);
    try {
      await onSave(rowIndex, editData);
      setEditingRow(null);
      setEditData({});
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd() {
    setSaving(true);
    try {
      await onAdd(newRowData);
      setAdding(false);
      setNewRowData({});
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(rowIndex: number) {
    if (!confirm("Are you sure you want to delete this row?")) return;
    await onDelete(rowIndex);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold capitalize">{sheetName}</h3>
        <Button
          size="sm"
          onClick={() => {
            setAdding(true);
            setNewRowData({});
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Row
        </Button>
      </div>

      {/* Add new row form */}
      {adding && (
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-4 space-y-3">
          <h4 className="font-medium text-sm text-blue-900">New Entry</h4>
          {columns.map((col) => (
            <div key={col}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {col}
              </label>
              {largeFields.includes(col) ? (
                <Textarea
                  value={newRowData[col] || ""}
                  onChange={(e) =>
                    setNewRowData({ ...newRowData, [col]: e.target.value })
                  }
                  rows={3}
                />
              ) : (
                <Input
                  value={newRowData[col] || ""}
                  onChange={(e) =>
                    setNewRowData({ ...newRowData, [col]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Existing rows */}
      <div className="space-y-3">
        {rows.map((row, i) => {
          const isEditing = editingRow === i;
          if (!row.id && !row.key && !row.title && !row.name && !row.question) return null;

          return (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              {isEditing ? (
                <div className="space-y-3">
                  {columns.map((col) => (
                    <div key={col}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {col}
                      </label>
                      {largeFields.includes(col) ? (
                        <Textarea
                          value={editData[col] ?? row[col] ?? ""}
                          onChange={(e) =>
                            setEditData({ ...editData, [col]: e.target.value })
                          }
                          rows={3}
                        />
                      ) : (
                        <Input
                          value={editData[col] ?? row[col] ?? ""}
                          onChange={(e) =>
                            setEditData({ ...editData, [col]: e.target.value })
                          }
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(i)} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingRow(null);
                        setEditData({});
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {row.title || row.name || row.question || row.key || `Row ${i + 1}`}
                    </p>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {row.description || row.excerpt || row.text || row.value || row.answer || ""}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-3 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingRow(i);
                        setEditData({ ...row });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(i)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {rows.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No entries yet. Click &quot;Add Row&quot; to create one.
          </p>
        )}
      </div>
    </div>
  );
}

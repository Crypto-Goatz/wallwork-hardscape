"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SUBFOLDERS = [
  { key: "portfolio", label: "Portfolio" },
  { key: "team", label: "Team" },
  { key: "blog", label: "Blog" },
  { key: "general", label: "General" },
] as const;

type Subfolder = (typeof SUBFOLDERS)[number]["key"];

interface MediaFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  size?: string;
  createdTime?: string;
}

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<Subfolder>("portfolio");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async (subfolder: Subfolder) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/media?subfolder=${subfolder}`);
      if (!res.ok) throw new Error(`Failed to fetch ${subfolder} media`);
      const json = await res.json();
      setFiles(json.files ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(activeTab);
  }, [activeTab, fetchFiles]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subfolder", activeTab);

    const res = await fetch("/api/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error ?? "Failed to upload file");
    }

    await fetchFiles(activeTab);
  };

  const handleDelete = async (fileId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;

    const res = await fetch(`/api/media?fileId=${fileId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete file");
    await fetchFiles(activeTab);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="text-gray-600 mt-1">
          Upload and manage images stored in Google Drive.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px" aria-label="Media tabs">
          {SUBFOLDERS.map((tab) => (
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

      {/* Media Content */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{activeTab} Media</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <span className="ml-3 text-gray-500">Loading media...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={() => fetchFiles(activeTab)}
                className="text-sm text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <MediaUploader
              files={files}
              onUpload={handleUpload}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

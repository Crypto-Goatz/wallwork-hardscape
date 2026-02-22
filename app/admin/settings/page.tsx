"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getPublicUrl } from "@/lib/drive-utils";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Key,
  Save,
  Upload,
  Trash2,
  Palette,
  ImageIcon,
} from "lucide-react";

interface IntegrationStatus {
  googleSheets: boolean;
  googleDrive: boolean;
  gemini: boolean;
  cro9: boolean;
  crm: boolean;
}

interface EnvStatus {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_SHEETS_ID: string;
  GOOGLE_DRIVE_FOLDER_ID: string;
  GEMINI_API_KEY: string;
  CRO9_API_KEY: string;
  CRM_API_KEY: string;
}

function maskValue(val: string): string {
  if (!val || val === "not set") return "Not configured";
  if (val.length <= 8) return "****";
  return val.slice(0, 4) + "****" + val.slice(-4);
}

export default function SettingsPage() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Logo state
  const [logoImageId, setLogoImageId] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoMessage, setLogoMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Color state
  const [colors, setColors] = useState({
    primary: "#2563eb",
    secondary: "#1e40af",
    accent: "#f59e0b",
  });
  const [colorSaving, setColorSaving] = useState(false);
  const [colorMessage, setColorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [statusRes, envRes] = await Promise.all([
          fetch("/api/settings/status"),
          fetch("/api/settings/env"),
        ]);

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setStatus(statusData);
        }

        if (envRes.ok) {
          const envData = await envRes.json();
          setEnvStatus(envData);
        }
      } catch {
        // Settings endpoints may not exist yet, that's ok
      }

      // Load site_config for logo and colors
      try {
        const configRes = await fetch("/api/content?sheet=site_config");
        if (configRes.ok) {
          const { data } = await configRes.json();
          const configMap: Record<string, string> = {};
          for (const row of data) {
            if (row.key && row.value) configMap[row.key] = row.value;
          }
          if (configMap.logo_image_id) setLogoImageId(configMap.logo_image_id);
          if (configMap.primary_color)
            setColors((c) => ({ ...c, primary: configMap.primary_color }));
          if (configMap.secondary_color)
            setColors((c) => ({ ...c, secondary: configMap.secondary_color }));
          if (configMap.accent_color)
            setColors((c) => ({ ...c, accent: configMap.accent_color }));
        }
      } catch {
        // site_config may not be available
      }

      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSaveGeminiKey = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet: "site_config",
          data: { key: "gemini_api_key", value: geminiKey },
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveMessage("Gemini API key saved successfully");
      setGeminiKey("");
    } catch {
      setSaveMessage("Failed to save Gemini API key");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setLogoMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subfolder", "general");

      const uploadRes = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { file: uploaded } = await uploadRes.json();

      // Save the file ID to site_config
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet: "site_config",
          data: { key: "logo_image_id", value: uploaded.id },
        }),
      });

      setLogoImageId(uploaded.id);
      setLogoMessage("Logo uploaded successfully");
    } catch {
      setLogoMessage("Failed to upload logo");
    } finally {
      setLogoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogoRemove = async () => {
    setLogoMessage(null);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet: "site_config",
          data: { key: "logo_image_id", value: "" },
        }),
      });
      setLogoImageId(null);
      setLogoMessage("Logo removed");
    } catch {
      setLogoMessage("Failed to remove logo");
    }
  };

  const handleSaveColors = async () => {
    setColorSaving(true);
    setColorMessage(null);
    try {
      await Promise.all([
        fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet: "site_config",
            data: { key: "primary_color", value: colors.primary },
          }),
        }),
        fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet: "site_config",
            data: { key: "secondary_color", value: colors.secondary },
          }),
        }),
        fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheet: "site_config",
            data: { key: "accent_color", value: colors.accent },
          }),
        }),
      ]);
      setColorMessage("Colors saved successfully");
    } catch {
      setColorMessage("Failed to save colors");
    } finally {
      setColorSaving(false);
    }
  };

  const integrationItems = status
    ? [
        { name: "Google Sheets", connected: status.googleSheets, description: "Content management backend" },
        { name: "Google Drive", connected: status.googleDrive, description: "Media file storage" },
        { name: "Gemini AI", connected: status.gemini, description: "AI content generation" },
        { name: "CRO9 Analytics", connected: status.cro9, description: "Analytics and behavioral tracking" },
        { name: "CRM", connected: status.crm, description: "Customer relationship management" },
      ]
    : [];

  const envItems = envStatus
    ? [
        { label: "Service Account Email", value: envStatus.GOOGLE_SERVICE_ACCOUNT_EMAIL },
        { label: "Google Sheets ID", value: envStatus.GOOGLE_SHEETS_ID },
        { label: "Google Drive Folder ID", value: envStatus.GOOGLE_DRIVE_FOLDER_ID },
        { label: "Gemini API Key", value: envStatus.GEMINI_API_KEY },
        { label: "CRO9 API Key", value: envStatus.CRO9_API_KEY },
        { label: "CRM API Key", value: envStatus.CRM_API_KEY },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-3 text-gray-500">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your integrations and configuration.
        </p>
      </div>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Upload your site logo. It will appear in the header and footer across all pages.
          </p>
          {logoImageId && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
              <Image
                src={getPublicUrl(logoImageId)}
                alt="Current logo"
                width={160}
                height={48}
                className="h-12 w-auto object-contain"
                unoptimized
              />
              <button
                onClick={handleLogoRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={logoUploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Upload className="h-4 w-4" />
              {logoUploading ? "Uploading..." : "Upload Logo"}
            </button>
          </div>
          {logoMessage && (
            <p
              className={`text-sm mt-2 ${
                logoMessage.includes("success") || logoMessage === "Logo removed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {logoMessage}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Scheme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Customize your site&apos;s brand colors. Changes take effect on the next page load.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {(
              [
                { key: "primary", label: "Primary" },
                { key: "secondary", label: "Secondary" },
                { key: "accent", label: "Accent" },
              ] as const
            ).map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={(e) =>
                      setColors((c) => ({ ...c, [key]: e.target.value }))
                    }
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colors[key]}
                    onChange={(e) =>
                      setColors((c) => ({ ...c, [key]: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Preview bar */}
          <div className="flex rounded-lg overflow-hidden h-8 mb-4">
            <div className="flex-1" style={{ backgroundColor: colors.primary }} />
            <div className="flex-1" style={{ backgroundColor: colors.secondary }} />
            <div className="flex-1" style={{ backgroundColor: colors.accent }} />
          </div>
          <button
            onClick={handleSaveColors}
            disabled={colorSaving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {colorSaving ? "Saving..." : "Save Colors"}
          </button>
          {colorMessage && (
            <p
              className={`text-sm mt-2 ${
                colorMessage.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {colorMessage}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          {integrationItems.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {integrationItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.connected ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-green-600">Connected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-sm text-red-600">Not connected</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Unable to load integration status. The status API may not be configured yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* CRM Connection */}
      <Card>
        <CardHeader>
          <CardTitle>CRM Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Connect your CRM account to sync contacts, manage leads, and automate follow-ups.
          </p>
          <a
            href="/api/crm/connect"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Connect CRM
          </a>
        </CardContent>
      </Card>

      {/* Environment Variables (Masked) */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          {envItems.length > 0 ? (
            <div className="space-y-2">
              {envItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <code className="text-sm text-gray-500 font-mono">
                    {maskValue(item.value)}
                  </code>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Unable to load environment status. The env API may not be configured yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Gemini API Key Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gemini API Key
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Enter your Gemini API key to enable AI content generation. This will be saved
            to your site_config sheet.
          </p>
          <div className="flex gap-3">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter Gemini API key..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSaveGeminiKey}
              disabled={saving || !geminiKey.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          {saveMessage && (
            <p
              className={`text-sm mt-2 ${
                saveMessage.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {saveMessage}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

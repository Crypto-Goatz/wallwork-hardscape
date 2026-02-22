"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface Props {
  businessName: string;
  onComplete: (data: { googleKey: string; spreadsheetId: string; spreadsheetUrl: string; driveFolderId: string }) => void;
  onBack: () => void;
}

type Status = "idle" | "validating" | "creating-sheet" | "creating-drive" | "done" | "error";

export function GoogleConnectStep({ businessName, onComplete, onBack }: Props) {
  const [googleKey, setGoogleKey] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [serviceEmail, setServiceEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [driveFolderId, setDriveFolderId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function callSetupApi(action: string, extra: Record<string, unknown> = {}) {
    const res = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      JSON.parse(text); // validate JSON
      setGoogleKey(btoa(text));
    } catch {
      setErrorMsg("Invalid JSON file");
    }
  }

  async function handleConnect() {
    if (!googleKey) {
      setErrorMsg("Please upload or paste your service account JSON");
      return;
    }

    setErrorMsg("");

    try {
      // Step 1: Validate
      setStatus("validating");
      const validateRes = await callSetupApi("validate-google", { googleKey });
      setServiceEmail(validateRes.serviceAccountEmail);

      // Step 2: Create Sheet
      setStatus("creating-sheet");
      const sheetRes = await callSetupApi("create-sheet", { googleKey, businessName });
      setSpreadsheetId(sheetRes.spreadsheetId);
      setSpreadsheetUrl(sheetRes.spreadsheetUrl);

      // Step 3: Create Drive
      setStatus("creating-drive");
      const driveRes = await callSetupApi("setup-drive", { googleKey, businessName });
      setDriveFolderId(driveRes.rootFolderId);

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Connection failed");
    }
  }

  const isDone = status === "done";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">Connect Google Workspace</h2>
      <p className="text-white/60 text-sm">
        Upload your Google Cloud service account JSON key. This will create your content spreadsheet and media folders automatically.
      </p>

      {/* Instructions */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70 space-y-2">
        <p className="font-medium text-white/90">How to get your service account key:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Go to Google Cloud Console</li>
          <li>Create or select a project</li>
          <li>Enable Google Sheets API and Google Drive API</li>
          <li>Go to IAM & Admin &gt; Service Accounts</li>
          <li>Create a service account and download the JSON key</li>
        </ol>
      </div>

      {/* File Upload or Paste */}
      {!isDone && (
        <>
          <div
            className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
            <p className="text-white/60 text-sm">
              {googleKey ? "Key loaded — click to replace" : "Click to upload service-account.json"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="text-center text-white/30 text-xs">or paste the base64-encoded key below</div>

          <textarea
            value={googleKey}
            onChange={(e) => setGoogleKey(e.target.value)}
            className="w-full h-20 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white text-xs font-mono placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste base64-encoded service account key..."
          />
        </>
      )}

      {/* Status Messages */}
      {status !== "idle" && (
        <div className="space-y-3">
          <StatusLine done={status !== "validating"} active={status === "validating"} label="Validating credentials..." result={serviceEmail ? `Account: ${serviceEmail}` : undefined} />
          <StatusLine done={["creating-drive", "done"].includes(status)} active={status === "creating-sheet"} label="Creating content spreadsheet..." result={spreadsheetUrl ? "Sheet created" : undefined} />
          <StatusLine done={status === "done"} active={status === "creating-drive"} label="Creating Drive folder structure..." result={driveFolderId ? "Folders created" : undefined} />
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-white/20 py-3 text-white font-medium hover:bg-white/5 transition-colors"
        >
          Back
        </button>
        {isDone ? (
          <button
            onClick={() => onComplete({ googleKey, spreadsheetId, spreadsheetUrl, driveFolderId })}
            className="flex-1 rounded-lg bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={!googleKey || !["idle", "error"].includes(status)}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "error" ? "Retry" : "Connect & Create"}
          </button>
        )}
      </div>
    </div>
  );
}

function StatusLine({ done, active, label, result }: { done: boolean; active: boolean; label: string; result?: string }) {
  if (!done && !active) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
      ) : (
        <Loader2 className="w-4 h-4 text-blue-400 shrink-0 animate-spin" />
      )}
      <span className={done ? "text-green-400" : "text-white/80"}>{result || label}</span>
    </div>
  );
}

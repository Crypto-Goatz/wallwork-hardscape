"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, Rocket, AlertCircle } from "lucide-react";

interface Props {
  spreadsheetUrl: string;
  onFinish: () => Promise<void>;
}

export function CompletionStep({ spreadsheetUrl, onFinish }: Props) {
  const [finishing, setFinishing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleFinish() {
    setFinishing(true);
    setError("");
    try {
      await onFinish();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to finalize setup");
    } finally {
      setFinishing(false);
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <Rocket className="w-10 h-10 text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">You&apos;re all set!</h2>
        <p className="text-white/60 max-w-md mx-auto">
          Your site is configured and a redeployment has been triggered. Changes will be live in a few minutes.
        </p>

        <div className="space-y-3 text-left max-w-sm mx-auto">
          <a
            href="/admin"
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors"
          >
            <span className="font-medium">Go to Dashboard</span>
            <ExternalLink className="w-4 h-4 text-white/40" />
          </a>
          <a
            href="/"
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors"
          >
            <span className="font-medium">View Your Site</span>
            <ExternalLink className="w-4 h-4 text-white/40" />
          </a>
          {spreadsheetUrl && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10 transition-colors"
            >
              <span className="font-medium">Open Content Sheet</span>
              <ExternalLink className="w-4 h-4 text-white/40" />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch</h2>
      <p className="text-white/60 text-sm">
        Everything is configured. Click the button below to save your configuration, set environment variables, and trigger a deployment.
      </p>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
        <p className="text-sm font-medium text-white/90">This will:</p>
        <div className="space-y-2 text-sm text-white/70">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Write site config to your spreadsheet</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Set environment variables on Vercel</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Trigger a redeployment</div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handleFinish}
        disabled={finishing}
        className="w-full rounded-lg bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {finishing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Finishing setup...
          </>
        ) : (
          "Complete Setup & Deploy"
        )}
      </button>
    </div>
  );
}

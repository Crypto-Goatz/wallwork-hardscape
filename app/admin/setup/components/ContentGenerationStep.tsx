"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import type { BusinessInfo } from "./BusinessInfoStep";

interface Props {
  businessInfo: BusinessInfo;
  googleKey: string;
  spreadsheetId: string;
  onComplete: (data: { geminiKey: string; generated: boolean }) => void;
  onBack: () => void;
}

type Status = "idle" | "generating" | "done" | "error";

export function ContentGenerationStep({ businessInfo, googleKey, spreadsheetId, onComplete, onBack }: Props) {
  const [geminiKey, setGeminiKey] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  async function handleGenerate() {
    if (!geminiKey.trim()) {
      setErrorMsg("Enter your Gemini API key");
      return;
    }

    setErrorMsg("");
    setStatus("generating");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-content",
          googleKey,
          spreadsheetId,
          geminiKey,
          businessInfo,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setCounts(data);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Content generation failed");
    }
  }

  function handleSkip() {
    onComplete({ geminiKey: "", generated: false });
  }

  const isDone = status === "done";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">AI Content Generation</h2>
      <p className="text-white/60 text-sm">
        Enter your Gemini API key and we&apos;ll generate initial website content tailored to your business —
        services, FAQs, blog posts, SEO metadata, and team placeholders.
      </p>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <p>Get a free Gemini API key from <span className="text-blue-400">Google AI Studio</span> (aistudio.google.com).</p>
      </div>

      {!isDone && (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Gemini API Key</label>
          <input
            type="password"
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIza..."
          />
        </div>
      )}

      {status === "generating" && (
        <div className="flex items-center gap-3 text-blue-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating content with AI... this may take a minute</span>
        </div>
      )}

      {isDone && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <Sparkles className="w-5 h-5" />
            Content generated and written to your spreadsheet!
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-white/70">
            {counts.services && <div><CheckCircle2 className="w-3 h-3 inline mr-1 text-green-400" />{counts.services} services</div>}
            {counts.faqs && <div><CheckCircle2 className="w-3 h-3 inline mr-1 text-green-400" />{counts.faqs} FAQs</div>}
            {counts.blog && <div><CheckCircle2 className="w-3 h-3 inline mr-1 text-green-400" />{counts.blog} blog posts</div>}
            {counts.seo && <div><CheckCircle2 className="w-3 h-3 inline mr-1 text-green-400" />{counts.seo} SEO entries</div>}
            {counts.team && <div><CheckCircle2 className="w-3 h-3 inline mr-1 text-green-400" />{counts.team} team members</div>}
          </div>
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
            onClick={() => onComplete({ geminiKey, generated: true })}
            className="flex-1 rounded-lg bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        ) : (
          <div className="flex-1 flex gap-2">
            <button
              onClick={handleSkip}
              className="flex-1 rounded-lg border border-white/20 py-3 text-white/60 font-medium hover:bg-white/5 transition-colors text-sm"
            >
              Skip
            </button>
            <button
              onClick={handleGenerate}
              disabled={status === "generating"}
              className="flex-1 rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === "error" ? "Retry" : "Generate"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

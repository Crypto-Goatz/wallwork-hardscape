"use client";

import { useState, useRef } from "react";
import {
  Globe,
  GitBranch,
  FileArchive,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
} from "lucide-react";
import type { ImportedContent } from "@/lib/setup/site-importer";

type ImportTab = "url" | "git" | "zip";

interface SiteImportStepProps {
  geminiKey: string;
  googleKey: string;
  spreadsheetId: string;
  onComplete: (data: {
    imported: boolean;
    content?: ImportedContent;
    businessInfo?: ImportedContent["businessInfo"];
  }) => void;
  onBack: () => void;
}

type Phase = "input" | "crawling" | "analyzing" | "review" | "writing" | "done";

export function SiteImportStep({
  geminiKey,
  googleKey,
  spreadsheetId,
  onComplete,
  onBack,
}: SiteImportStepProps) {
  const [tab, setTab] = useState<ImportTab>("url");
  const [url, setUrl] = useState("");
  const [gitUrl, setGitUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ImportedContent | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [crawlInfo, setCrawlInfo] = useState<{
    pageCount?: number;
    fileCount?: number;
    emails?: string[];
    phones?: string[];
  }>({});

  // For file upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSkip = () => {
    onComplete({ imported: false });
  };

  // ── URL Import ──────────────────────────────────────────

  const handleUrlImport = async () => {
    if (!url.trim()) return;
    setError(null);

    // Phase 1: Crawl
    setPhase("crawling");
    setStatus("Fetching website pages...");

    try {
      const crawlRes = await fetch("/api/setup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "crawl", url }),
      });
      const crawlData = await crawlRes.json();
      if (crawlData.error) throw new Error(crawlData.error);

      setCrawlInfo({
        pageCount: crawlData.pageCount,
        emails: crawlData.emails,
        phones: crawlData.phones,
      });

      // Phase 2: Analyze
      setPhase("analyzing");
      setStatus(
        `Found ${crawlData.pageCount} pages. Analyzing content with AI...`
      );

      const analyzeRes = await fetch("/api/setup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          geminiKey,
          crawlData: crawlData._crawlData,
          sourceType: "url",
        }),
      });
      const analyzeData = await analyzeRes.json();
      if (analyzeData.error) throw new Error(analyzeData.error);

      setContent(analyzeData.content);
      buildCounts(analyzeData.content);
      setPhase("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
      setPhase("input");
    }
  };

  // ── GitHub Import ─────────────────────────────────────

  const handleGitImport = async () => {
    if (!gitUrl.trim()) return;
    setError(null);

    setPhase("crawling");
    setStatus("Fetching repository files...");

    try {
      const gitRes = await fetch("/api/setup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "github", url: gitUrl }),
      });
      const gitData = await gitRes.json();
      if (gitData.error) throw new Error(gitData.error);

      setCrawlInfo({ fileCount: gitData.fileCount });

      setPhase("analyzing");
      setStatus(
        `Found ${gitData.fileCount} content files. Analyzing with AI...`
      );

      const analyzeRes = await fetch("/api/setup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          geminiKey,
          fileData: gitData._fileData,
          sourceType: "git",
        }),
      });
      const analyzeData = await analyzeRes.json();
      if (analyzeData.error) throw new Error(analyzeData.error);

      setContent(analyzeData.content);
      buildCounts(analyzeData.content);
      setPhase("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
      setPhase("input");
    }
  };

  // ── ZIP Import ────────────────────────────────────────

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    setPhase("crawling");
    setStatus("Extracting and analyzing ZIP contents...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("geminiKey", geminiKey);

      const res = await fetch("/api/setup/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setCrawlInfo({ fileCount: data.fileCount });
      setContent(data.content);
      buildCounts(data.content);
      setPhase("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
      setPhase("input");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Write to Sheets ───────────────────────────────────

  const handleWrite = async () => {
    if (!content) return;
    setPhase("writing");
    setStatus("Writing content to your Google Sheet...");

    try {
      const res = await fetch("/api/setup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "write",
          content,
          googleKey,
          spreadsheetId,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setPhase("done");
      setStatus("Import complete!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to write to sheet");
      setPhase("review");
    }
  };

  const handleDone = () => {
    onComplete({
      imported: true,
      content: content || undefined,
      businessInfo: content?.businessInfo,
    });
  };

  function buildCounts(c: ImportedContent) {
    const newCounts: Record<string, number> = {};
    if (c.services?.length) newCounts.Services = c.services.length;
    if (c.testimonials?.length) newCounts.Testimonials = c.testimonials.length;
    if (c.blog?.length) newCounts["Blog Posts"] = c.blog.length;
    if (c.team?.length) newCounts["Team Members"] = c.team.length;
    if (c.faqs?.length) newCounts.FAQs = c.faqs.length;
    if (c.portfolio?.length) newCounts.Portfolio = c.portfolio.length;
    if (c.seo?.length) newCounts["SEO Entries"] = c.seo.length;
    setCounts(newCounts);
  }

  // ── Input Phase ───────────────────────────────────────

  if (phase === "input") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Import Existing Site</h2>
          <p className="text-white/60 text-sm mt-1">
            Have an existing website? Import its content automatically. We&apos;ll
            extract your services, testimonials, blog posts, and more.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(
            [
              { id: "url" as const, icon: Globe, label: "From URL" },
              { id: "git" as const, icon: GitBranch, label: "From GitHub" },
              { id: "zip" as const, icon: FileArchive, label: "Upload ZIP" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/20 border border-red-500/30">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* URL Tab */}
        {tab === "url" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-white/40 mt-1.5">
                We&apos;ll crawl the homepage and key pages (about, services, blog,
                etc.) to extract content.
              </p>
            </div>
            <button
              onClick={handleUrlImport}
              disabled={!url.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Globe className="w-4 h-4" />
              Scan & Import
            </button>
          </div>
        )}

        {/* Git Tab */}
        {tab === "git" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-white/40 mt-1.5">
                Must be a public repository. We&apos;ll read HTML, Markdown, and JSON
                files to extract content.
              </p>
            </div>
            <button
              onClick={handleGitImport}
              disabled={!gitUrl.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              Fetch & Import
            </button>
          </div>
        )}

        {/* ZIP Tab */}
        {tab === "zip" && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/60 mb-3">
                Upload a ZIP file containing your website files (HTML, Markdown,
                JSON). We&apos;ll extract content from the files inside.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleZipUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Choose ZIP File
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleSkip}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Skip — I&apos;ll start fresh
          </button>
        </div>
      </div>
    );
  }

  // ── Loading Phase (crawling/analyzing) ────────────────

  if (phase === "crawling" || phase === "analyzing") {
    return (
      <div className="py-12 text-center space-y-6">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
        <div>
          <h3 className="text-lg font-semibold text-white">{status}</h3>
          <p className="text-sm text-white/50 mt-1">
            This may take 15-30 seconds depending on the site.
          </p>
        </div>

        {phase === "analyzing" && crawlInfo.pageCount && (
          <div className="max-w-xs mx-auto bg-white/5 rounded-lg p-4 text-left">
            <p className="text-xs text-white/40 mb-2">Crawl summary:</p>
            <p className="text-sm text-white/70">
              {crawlInfo.pageCount} pages fetched
            </p>
            {crawlInfo.emails && crawlInfo.emails.length > 0 && (
              <p className="text-sm text-white/70">
                {crawlInfo.emails.length} email(s) found
              </p>
            )}
            {crawlInfo.phones && crawlInfo.phones.length > 0 && (
              <p className="text-sm text-white/70">
                {crawlInfo.phones.length} phone number(s) found
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Review Phase ──────────────────────────────────────

  if (phase === "review") {
    const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Content Found</h2>
          <p className="text-white/60 text-sm mt-1">
            We extracted {totalItems} items from your site. Review what was found
            below, then import into your sheet.
          </p>
        </div>

        {/* Business Info */}
        {content?.businessInfo && (
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-white/80">Business Info</h3>
            {content.businessInfo.name && (
              <p className="text-sm text-white/60">
                Name: <span className="text-white">{content.businessInfo.name}</span>
              </p>
            )}
            {content.businessInfo.phone && (
              <p className="text-sm text-white/60">
                Phone: <span className="text-white">{content.businessInfo.phone}</span>
              </p>
            )}
            {content.businessInfo.email && (
              <p className="text-sm text-white/60">
                Email: <span className="text-white">{content.businessInfo.email}</span>
              </p>
            )}
            {content.businessInfo.industry && (
              <p className="text-sm text-white/60">
                Industry:{" "}
                <span className="text-white">{content.businessInfo.industry}</span>
              </p>
            )}
          </div>
        )}

        {/* Content Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(counts).map(([label, count]) => (
            <div
              key={label}
              className="bg-white/5 rounded-lg p-4 text-center"
            >
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-xs text-white/50 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {totalItems === 0 && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-medium">
                No structured content could be extracted.
              </p>
              <p className="text-xs text-yellow-200/70 mt-1">
                The site may use JavaScript rendering or have content in a format
                we couldn&apos;t parse. You can try the ZIP upload or proceed with
                AI-generated content instead.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/20 border border-red-500/30">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => {
              setPhase("input");
              setContent(null);
              setError(null);
            }}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Try again
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Skip import
            </button>
            {totalItems > 0 && (
              <button
                onClick={handleWrite}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Import {totalItems} items
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Writing Phase ─────────────────────────────────────

  if (phase === "writing") {
    return (
      <div className="py-12 text-center space-y-6">
        <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto" />
        <h3 className="text-lg font-semibold text-white">{status}</h3>
      </div>
    );
  }

  // ── Done Phase ────────────────────────────────────────

  return (
    <div className="py-12 text-center space-y-6">
      <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
      <div>
        <h2 className="text-xl font-bold text-white">Import Complete!</h2>
        <p className="text-white/60 text-sm mt-1">
          Your site content has been imported to the Google Sheet.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
        {Object.entries(counts).map(([label, count]) => (
          <div
            key={label}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center"
          >
            <p className="text-xl font-bold text-green-400">{count}</p>
            <p className="text-xs text-white/50">{label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleDone}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Continue Setup
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

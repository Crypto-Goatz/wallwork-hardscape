import { generateContent } from "@/lib/gemini";
import { SHEETS_SCHEMA } from "@/config/sheets-schema";

// ── Types ───────────────────────────────────────────────────

export interface CrawlResult {
  pages: { url: string; title: string; text: string }[];
  images: string[];
  emails: string[];
  phones: string[];
}

export interface ImportedContent {
  businessInfo?: {
    name?: string;
    phone?: string;
    email?: string;
    tagline?: string;
    industry?: string;
  };
  services: Record<string, string>[];
  testimonials: Record<string, string>[];
  blog: Record<string, string>[];
  team: Record<string, string>[];
  faqs: Record<string, string>[];
  portfolio: Record<string, string>[];
  seo: Record<string, string>[];
}

// ── URL Crawling ────────────────────────────────────────────

/**
 * Priority paths to check when crawling a site.
 */
const PRIORITY_PATHS = [
  "/about",
  "/services",
  "/contact",
  "/blog",
  "/testimonials",
  "/reviews",
  "/team",
  "/portfolio",
  "/work",
  "/projects",
  "/faq",
  "/faqs",
  "/our-services",
  "/our-team",
  "/about-us",
];

/**
 * Strip HTML to plain text, preserving some structure.
 */
function htmlToText(html: string): string {
  return html
    // Remove scripts, styles, SVGs
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    // Convert headings to text with markers
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n## $1\n")
    // Convert list items
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    // Convert paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
    // Convert line breaks
    .replace(/<br\s*\/?>/gi, "\n")
    // Remove remaining tags
    .replace(/<[^>]+>/g, " ")
    // Decode HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Clean up whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

/**
 * Extract the page <title> from HTML.
 */
function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : "";
}

/**
 * Extract all image src URLs from HTML.
 */
function extractImages(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const url = new URL(m[1], baseUrl).href;
      // Skip tiny/tracking images and data URIs
      if (
        !url.startsWith("data:") &&
        !url.includes("1x1") &&
        !url.includes("tracking") &&
        !url.includes("pixel")
      ) {
        images.push(url);
      }
    } catch {
      // Invalid URL, skip
    }
  }
  return [...new Set(images)];
}

/**
 * Extract internal links from HTML.
 */
function extractInternalLinks(html: string, baseUrl: string): string[] {
  const base = new URL(baseUrl);
  const links: string[] = [];
  const re = /<a[^>]+href=["']([^"'#]+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const url = new URL(m[1], baseUrl);
      if (url.hostname === base.hostname && url.pathname !== "/") {
        links.push(url.origin + url.pathname);
      }
    } catch {
      // Skip invalid
    }
  }
  return [...new Set(links)];
}

/**
 * Extract phone numbers from text.
 */
function extractPhones(text: string): string[] {
  const re = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  return [...new Set(text.match(re) || [])];
}

/**
 * Extract email addresses from text.
 */
function extractEmails(text: string): string[] {
  const re = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(text.match(re) || [])];
}

/**
 * Fetch a single page, return HTML or null.
 */
async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RocketBot/1.0; +https://rocketclients.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return null;

    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Crawl a website starting from the given URL.
 * Fetches homepage + up to 8 additional priority pages.
 */
export async function crawlSite(rootUrl: string): Promise<CrawlResult> {
  const base = new URL(rootUrl);
  const origin = base.origin;

  const pages: CrawlResult["pages"] = [];
  let allImages: string[] = [];
  let allEmails: string[] = [];
  let allPhones: string[] = [];

  // 1. Fetch homepage
  const homeHtml = await fetchPage(origin + "/");
  if (!homeHtml) {
    throw new Error("Could not fetch the homepage. Make sure the URL is correct and accessible.");
  }

  const homeText = htmlToText(homeHtml);
  pages.push({ url: origin + "/", title: extractTitle(homeHtml), text: homeText });
  allImages.push(...extractImages(homeHtml, origin));
  allEmails.push(...extractEmails(homeText));
  allPhones.push(...extractPhones(homeText));

  // 2. Find internal links
  const foundLinks = extractInternalLinks(homeHtml, origin);

  // 3. Prioritize pages
  const prioritized: string[] = [];

  // First add priority paths that exist in found links
  for (const path of PRIORITY_PATHS) {
    const match = foundLinks.find(
      (l) => new URL(l).pathname.toLowerCase() === path
    );
    if (match) prioritized.push(match);
  }

  // Then add priority paths speculatively (they might exist even if not linked from homepage)
  for (const path of PRIORITY_PATHS) {
    const specUrl = origin + path;
    if (!prioritized.includes(specUrl)) {
      prioritized.push(specUrl);
    }
  }

  // 4. Fetch up to 8 additional pages
  let fetched = 0;
  for (const url of prioritized) {
    if (fetched >= 8) break;

    const html = await fetchPage(url);
    if (!html) continue;

    const text = htmlToText(html);
    if (text.length < 50) continue; // Skip near-empty pages

    pages.push({ url, title: extractTitle(html), text });
    allImages.push(...extractImages(html, origin));
    allEmails.push(...extractEmails(text));
    allPhones.push(...extractPhones(text));
    fetched++;
  }

  return {
    pages,
    images: [...new Set(allImages)].slice(0, 50), // Cap at 50 images
    emails: [...new Set(allEmails)],
    phones: [...new Set(allPhones)],
  };
}

// ── GitHub Repo Import ──────────────────────────────────────

/**
 * Parse a GitHub URL into owner/repo.
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(
    /github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/
  );
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

/**
 * Fetch files from a public GitHub repo via the Trees API.
 * Returns content of HTML, MD, and JSON files.
 */
export async function fetchGitHubRepo(
  repoUrl: string
): Promise<{ files: { path: string; content: string }[] }> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) throw new Error("Invalid GitHub URL");

  const { owner, repo } = parsed;

  // Get the default branch
  const repoRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: { Accept: "application/vnd.github.v3+json" },
    }
  );
  if (!repoRes.ok)
    throw new Error("Could not access repo. Make sure it's public.");
  const repoData = await repoRes.json();
  const branch = repoData.default_branch || "main";

  // Get the file tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers: { Accept: "application/vnd.github.v3+json" },
    }
  );
  if (!treeRes.ok) throw new Error("Could not fetch repo file tree");
  const treeData = await treeRes.json();

  // Filter to content files (HTML, MD, JSON, txt) up to a reasonable size
  const contentFiles = (
    treeData.tree as Array<{ path: string; type: string; size?: number }>
  ).filter(
    (f) =>
      f.type === "blob" &&
      (f.size || 0) < 100000 && // Skip files > 100KB
      /\.(html?|md|markdown|json|txt)$/i.test(f.path) &&
      !f.path.includes("node_modules") &&
      !f.path.includes("package-lock") &&
      !f.path.startsWith(".")
  );

  // Fetch up to 20 files
  const files: { path: string; content: string }[] = [];
  for (const file of contentFiles.slice(0, 20)) {
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`
      );
      if (rawRes.ok) {
        const content = await rawRes.text();
        files.push({ path: file.path, content });
      }
    } catch {
      // Skip individual file errors
    }
  }

  return { files };
}

// ── ZIP File Import ─────────────────────────────────────────

/**
 * Extract text content files from a ZIP buffer.
 */
export async function extractZipContents(
  buffer: ArrayBuffer
): Promise<{ files: { path: string; content: string }[] }> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(buffer);

  const files: { path: string; content: string }[] = [];

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    if (path.includes("node_modules")) continue;
    if (path.startsWith(".") || path.includes("/.")) continue;

    // Only process text-based content files
    if (!/\.(html?|md|markdown|json|txt|css)$/i.test(path)) continue;

    // Skip large files (check via async text length as fallback)
    // JSZip doesn't expose uncompressed size directly, so we rely on file extension filtering

    try {
      const content = await entry.async("text");
      // Skip files larger than 100KB of text
      if (content.length > 100000) continue;
      files.push({ path, content });
    } catch {
      // Skip binary/corrupt files
    }
  }

  return { files: files.slice(0, 30) };
}

// ── AI Content Extraction ───────────────────────────────────

/**
 * Build the extraction prompt with our exact sheet schemas.
 */
function buildExtractionPrompt(
  sourceContent: string,
  sourceType: "url" | "git" | "zip"
): string {
  const schemaDesc = `
## Target Schema

You must extract content into these exact structures:

### businessInfo (object)
- name: Business name
- phone: Primary phone number
- email: Primary email
- tagline: Business tagline or slogan
- industry: One of: Home Services, Construction, Legal, Medical, Dental, Restaurant, Retail, Auto Services, Real Estate, Landscaping, Cleaning, HVAC, Plumbing, Electrical, Roofing, General Contractor, Other

### services (array of objects)
Each: { id, title, slug, description, image_id, icon, order }
- slug: URL-friendly (lowercase, hyphens)
- icon: One of: Wrench, Shield, Star, Zap, Award, Hammer, Settings, Heart, Sparkles, Target
- image_id: External image URL if found, empty string if not
- order: Numeric string starting from "1"

### testimonials (array of objects)
Each: { id, name, role, text, rating, image_id }
- rating: "5" or "4" (string)

### blog (array of objects)
Each: { id, title, slug, content, excerpt, image_id, published_at, status }
- content: Full post HTML
- excerpt: 1-2 sentence summary
- published_at: ISO date (YYYY-MM-DD)
- status: "published"

### team (array of objects)
Each: { id, name, role, bio, image_id }

### faqs (array of objects)
Each: { id, question, answer, category }
- category: General, Services, Pricing, or Process

### portfolio (array of objects)
Each: { id, title, description, image_ids, category, date }
- image_ids: Comma-separated URLs

### seo (array of objects)
Each: { page_path, title, description, og_image_id }
- Generate for: /, /about, /services, /contact, /blog, /testimonials, /portfolio
`;

  return [
    "You are a website content extraction expert. Extract structured content from the following",
    sourceType === "url" ? "scraped website pages" : "website source files",
    "and map it to the target schema below.",
    "",
    "IMPORTANT RULES:",
    "- Extract ONLY real content that exists in the source. Do NOT invent or fabricate content.",
    "- If a section has no matching content, return an empty array.",
    "- For image_id fields, use the full image URL if found, empty string otherwise.",
    "- Generate unique IDs like svc-1, test-1, post-1, team-1, faq-1, port-1.",
    "- Return ONLY valid JSON. No markdown fences, no explanations.",
    "",
    schemaDesc,
    "",
    "## Source Content",
    "",
    sourceContent,
    "",
    "Return a single JSON object with keys: businessInfo, services, testimonials, blog, team, faqs, portfolio, seo",
  ].join("\n");
}

/**
 * Use Gemini AI to extract structured content from crawled/parsed data.
 */
export async function extractContentWithAI(
  data: CrawlResult | { files: { path: string; content: string }[] },
  sourceType: "url" | "git" | "zip",
  geminiKey: string
): Promise<ImportedContent> {
  let sourceContent: string;

  if ("pages" in data) {
    // URL crawl result
    const pageTexts = data.pages
      .map((p) => `--- Page: ${p.url} (${p.title}) ---\n${p.text}`)
      .join("\n\n");

    const extras: string[] = [];
    if (data.emails.length > 0) extras.push(`Emails found: ${data.emails.join(", ")}`);
    if (data.phones.length > 0) extras.push(`Phones found: ${data.phones.join(", ")}`);
    if (data.images.length > 0)
      extras.push(`Images found:\n${data.images.slice(0, 20).join("\n")}`);

    sourceContent = pageTexts + "\n\n" + extras.join("\n");
  } else {
    // File-based import (git/zip)
    sourceContent = data.files
      .map((f) => `--- File: ${f.path} ---\n${f.content}`)
      .join("\n\n");
  }

  // Trim to ~100K chars to stay within Gemini context limits
  if (sourceContent.length > 100000) {
    sourceContent = sourceContent.slice(0, 100000) + "\n\n[...truncated]";
  }

  const prompt = buildExtractionPrompt(sourceContent, sourceType);
  const raw = await generateContent(prompt, geminiKey);

  // Parse the AI response
  const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    businessInfo: parsed.businessInfo || {},
    services: parsed.services || [],
    testimonials: parsed.testimonials || [],
    blog: parsed.blog || [],
    team: parsed.team || [],
    faqs: parsed.faqs || [],
    portfolio: parsed.portfolio || [],
    seo: parsed.seo || [],
  };
}

/**
 * Write imported content to the Google Sheet.
 */
export async function writeImportedContent(
  content: ImportedContent,
  spreadsheetId: string,
  googleKey: string
): Promise<Record<string, number>> {
  const { getAuthFromCredentials, getSheetsClientWithAuth } = await import(
    "@/lib/google/auth"
  );
  const credentials = JSON.parse(
    Buffer.from(googleKey, "base64").toString("utf-8")
  );
  const auth = getAuthFromCredentials(credentials);
  const sheets = getSheetsClientWithAuth(auth);

  const writeData: { range: string; values: string[][] }[] = [];
  const counts: Record<string, number> = {};

  const sheetMappings: Array<{ key: keyof ImportedContent; sheet: string }> = [
    { key: "services", sheet: "services" },
    { key: "testimonials", sheet: "testimonials" },
    { key: "blog", sheet: "blog" },
    { key: "team", sheet: "team" },
    { key: "faqs", sheet: "faqs" },
    { key: "portfolio", sheet: "portfolio" },
    { key: "seo", sheet: "seo" },
  ];

  for (const { key, sheet } of sheetMappings) {
    const rows = content[key] as Record<string, string>[];
    if (rows && rows.length > 0) {
      const cols = SHEETS_SCHEMA[sheet as keyof typeof SHEETS_SCHEMA].columns;
      writeData.push({
        range: `${sheet}!A2`,
        values: rows.map((row) =>
          cols.map((c) => String(row[c] || ""))
        ),
      });
      counts[key] = rows.length;
    }
  }

  if (writeData.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "RAW",
        data: writeData,
      },
    });
  }

  return counts;
}

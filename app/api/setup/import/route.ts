import { NextRequest, NextResponse } from "next/server";
import {
  crawlSite,
  fetchGitHubRepo,
  extractZipContents,
  extractContentWithAI,
  writeImportedContent,
} from "@/lib/setup/site-importer";

function json(data: object, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * POST /api/setup/import
 * Handles site import from URL, GitHub repo, or ZIP file.
 *
 * Actions:
 * - crawl:   Fetch pages from a URL and return raw crawl data
 * - github:  Fetch files from a public GitHub repo
 * - analyze: Send crawled/fetched content to Gemini for extraction
 * - write:   Write extracted content to Google Sheets
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Handle ZIP file upload (multipart form data)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const geminiKey = formData.get("geminiKey") as string;

      if (!file) return json({ error: "No file uploaded" }, 400);

      const buffer = await file.arrayBuffer();
      const { files } = await extractZipContents(buffer);

      if (files.length === 0) {
        return json(
          { error: "No content files found in the ZIP (HTML, MD, JSON, TXT)" },
          400
        );
      }

      // If geminiKey provided, do analysis immediately
      if (geminiKey) {
        const content = await extractContentWithAI(
          { files },
          "zip",
          geminiKey
        );
        return json({
          source: "zip",
          fileCount: files.length,
          content,
        });
      }

      return json({
        source: "zip",
        fileCount: files.length,
        files: files.map((f) => ({
          path: f.path,
          size: f.content.length,
        })),
      });
    }

    // Handle JSON body requests
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "crawl": {
        const { url } = body;
        if (!url) return json({ error: "URL is required" }, 400);

        // Validate URL
        try {
          new URL(url);
        } catch {
          return json({ error: "Invalid URL format" }, 400);
        }

        const crawlResult = await crawlSite(url);

        return json({
          source: "url",
          pageCount: crawlResult.pages.length,
          imageCount: crawlResult.images.length,
          emails: crawlResult.emails,
          phones: crawlResult.phones,
          pages: crawlResult.pages.map((p) => ({
            url: p.url,
            title: p.title,
            textLength: p.text.length,
          })),
          // Include full data for analysis step
          _crawlData: crawlResult,
        });
      }

      case "github": {
        const { url } = body;
        if (!url) return json({ error: "GitHub URL is required" }, 400);

        if (!url.includes("github.com")) {
          return json({ error: "Not a valid GitHub URL" }, 400);
        }

        const { files } = await fetchGitHubRepo(url);

        if (files.length === 0) {
          return json(
            {
              error:
                "No content files found in this repo (HTML, MD, JSON, TXT)",
            },
            400
          );
        }

        return json({
          source: "github",
          fileCount: files.length,
          files: files.map((f) => ({
            path: f.path,
            size: f.content.length,
          })),
          // Include full data for analysis step
          _fileData: { files },
        });
      }

      case "analyze": {
        const { geminiKey, crawlData, fileData, sourceType } = body;
        if (!geminiKey) return json({ error: "Gemini API key is required" }, 400);

        let content;
        if (crawlData) {
          content = await extractContentWithAI(crawlData, "url", geminiKey);
        } else if (fileData) {
          content = await extractContentWithAI(
            fileData,
            sourceType || "git",
            geminiKey
          );
        } else {
          return json({ error: "No source data provided" }, 400);
        }

        return json({ content });
      }

      case "write": {
        const { content, googleKey, spreadsheetId } = body;
        if (!content || !googleKey || !spreadsheetId) {
          return json(
            { error: "content, googleKey, and spreadsheetId are required" },
            400
          );
        }

        const counts = await writeImportedContent(
          content,
          spreadsheetId,
          googleKey
        );

        return json({ written: true, counts });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ error: message }, 500);
  }
}

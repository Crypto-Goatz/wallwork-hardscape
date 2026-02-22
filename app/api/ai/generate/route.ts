import { NextRequest, NextResponse } from "next/server";
import { generateContent, generateBlogPost, generateSEO } from "@/lib/gemini";

/**
 * POST /api/ai/generate
 * Generate content using Gemini AI
 *
 * Body: { prompt: string, type?: "general" | "blog" | "seo", context?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { prompt, type = "general", context = "" } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    let content: string;

    switch (type) {
      case "blog": {
        const blogDraft = await generateBlogPost(prompt, context);
        return NextResponse.json({ content: JSON.stringify(blogDraft, null, 2), blogDraft });
      }

      case "seo": {
        const seo = await generateSEO(prompt);
        return NextResponse.json({ content: JSON.stringify(seo, null, 2), seo });
      }

      default:
        content = await generateContent(prompt);
        return NextResponse.json({ content });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

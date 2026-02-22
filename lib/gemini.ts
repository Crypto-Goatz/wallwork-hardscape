import { GoogleGenerativeAI } from "@google/generative-ai";

function getClient(apiKey?: string) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini API key is not configured");
  return new GoogleGenerativeAI(key);
}

export interface SEOSuggestions {
  title: string;
  description: string;
  keywords: string[];
}

export interface BlogDraft {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
}

/**
 * Generate arbitrary content from a prompt.
 */
export async function generateContent(
  prompt: string,
  apiKey?: string
): Promise<string> {
  const genAI = getClient(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Generate SEO metadata for page content.
 */
export async function generateSEO(
  pageContent: string,
  apiKey?: string
): Promise<SEOSuggestions> {
  const prompt = `Analyze the following page content and generate SEO metadata. Return a JSON object with "title" (max 60 chars), "description" (max 155 chars), and "keywords" (array of 5-10 relevant keywords).

Content:
${pageContent}

Return only valid JSON, no markdown fences.`;

  const text = await generateContent(prompt, apiKey);
  return JSON.parse(text);
}

/**
 * Generate a full blog post draft from a topic.
 */
export async function generateBlogPost(
  topic: string,
  businessContext: string,
  apiKey?: string
): Promise<BlogDraft> {
  const prompt = `Write a professional blog post for a business website.

Business context: ${businessContext}
Topic: ${topic}

Return a JSON object with:
- "title": engaging blog post title
- "slug": URL-friendly slug (lowercase, hyphens)
- "excerpt": 1-2 sentence summary (max 200 chars)
- "content": full blog post in HTML (use <h2>, <h3>, <p>, <ul>, <li>, <strong> tags)

The content should be 500-800 words, professional, and SEO-optimized.
Return only valid JSON, no markdown fences.`;

  const text = await generateContent(prompt, apiKey);
  return JSON.parse(text);
}

/**
 * Improve or rewrite existing content with specific instructions.
 */
export async function improveContent(
  content: string,
  instructions: string,
  apiKey?: string
): Promise<string> {
  const prompt = `Improve the following content based on these instructions: ${instructions}

Original content:
${content}

Return only the improved content, no explanations or markdown fences.`;

  return generateContent(prompt, apiKey);
}

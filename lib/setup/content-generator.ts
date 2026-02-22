import { generateContent } from "@/lib/gemini";

interface BusinessInfo {
  name: string;
  industry: string;
  phone: string;
  email: string;
  tagline: string;
  url: string;
}

interface GeneratedContent {
  services: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    icon: string;
    order: string;
  }>;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>;
  blog: Array<{
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published_at: string;
    status: string;
  }>;
  seo: Array<{
    page_path: string;
    title: string;
    description: string;
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    bio: string;
  }>;
}

type ProgressCallback = (step: string, done: boolean) => void;

const ICONS = [
  "Wrench",
  "Shield",
  "Star",
  "Zap",
  "Award",
  "Hammer",
  "Settings",
  "Heart",
  "Sparkles",
  "Target",
];

/**
 * Generate all initial site content using Gemini AI.
 */
export async function generateAllContent(
  info: BusinessInfo,
  apiKey: string,
  onProgress?: ProgressCallback
): Promise<GeneratedContent> {
  const context = `Business: ${info.name}\nIndustry: ${info.industry}\nTagline: ${info.tagline}\nPhone: ${info.phone}\nEmail: ${info.email}\nWebsite: ${info.url}`;

  onProgress?.("Generating services...", false);
  const services = await generateServices(context, apiKey);

  onProgress?.("Generating FAQs...", false);
  const faqs = await generateFAQs(context, apiKey);

  onProgress?.("Generating blog posts...", false);
  const blog = await generateBlogPosts(context, apiKey);

  onProgress?.("Generating SEO metadata...", false);
  const seo = await generateSEOData(context, info, apiKey);

  onProgress?.("Generating team placeholders...", false);
  const team = generateTeamPlaceholders(info.industry);

  onProgress?.("Content generation complete", true);

  return { services, faqs, blog, seo, team };
}

async function generateServices(context: string, apiKey: string) {
  const prompt = `Generate 6-8 realistic services for this business. Return ONLY a JSON array (no markdown fences) where each item has: "title", "slug" (URL-friendly lowercase with hyphens), "description" (2-3 sentences, professional).

${context}

Return only valid JSON array.`;

  const text = await generateContent(prompt, apiKey);
  const parsed = JSON.parse(text.replace(/```json?\n?|\n?```/g, ""));

  return parsed.map(
    (svc: { title: string; slug: string; description: string }, i: number) => ({
      id: `svc-${i + 1}`,
      title: svc.title,
      slug: svc.slug,
      description: svc.description,
      image_id: "",
      icon: ICONS[i % ICONS.length],
      order: String(i + 1),
    })
  );
}

async function generateFAQs(context: string, apiKey: string) {
  const prompt = `Generate 8-10 realistic frequently asked questions for this business. Return ONLY a JSON array (no markdown fences) where each item has: "question", "answer" (2-3 sentences), "category" (one of: "General", "Services", "Pricing", "Process").

${context}

Return only valid JSON array.`;

  const text = await generateContent(prompt, apiKey);
  const parsed = JSON.parse(text.replace(/```json?\n?|\n?```/g, ""));

  return parsed.map(
    (faq: { question: string; answer: string; category: string }, i: number) => ({
      id: `faq-${i + 1}`,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    })
  );
}

async function generateBlogPosts(context: string, apiKey: string) {
  const prompt = `Generate 3 professional blog posts for this business website. Return ONLY a JSON array (no markdown fences) where each item has: "title", "slug" (URL-friendly), "excerpt" (1-2 sentences, max 200 chars), "content" (full post in HTML using <h2>, <h3>, <p>, <ul>, <li>, <strong> tags, 400-600 words).

${context}

Return only valid JSON array.`;

  const text = await generateContent(prompt, apiKey);
  const parsed = JSON.parse(text.replace(/```json?\n?|\n?```/g, ""));
  const now = new Date().toISOString().split("T")[0];

  return parsed.map(
    (
      post: { title: string; slug: string; excerpt: string; content: string },
      i: number
    ) => ({
      id: `post-${i + 1}`,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      image_id: "",
      published_at: now,
      status: "published",
    })
  );
}

async function generateSEOData(
  context: string,
  info: BusinessInfo,
  apiKey: string
) {
  const pages = [
    { path: "/", label: "Home page" },
    { path: "/about", label: "About page" },
    { path: "/services", label: "Services page" },
    { path: "/contact", label: "Contact page" },
    { path: "/blog", label: "Blog listing page" },
    { path: "/testimonials", label: "Testimonials page" },
    { path: "/portfolio", label: "Portfolio page" },
  ];

  const prompt = `Generate SEO metadata for each of these pages on a business website. Return ONLY a JSON array (no markdown fences) where each item has: "page_path", "title" (max 60 chars, include business name), "description" (max 155 chars, compelling).

Pages: ${pages.map((p) => `${p.path} (${p.label})`).join(", ")}

${context}

Return only valid JSON array.`;

  const text = await generateContent(prompt, apiKey);
  const parsed = JSON.parse(text.replace(/```json?\n?|\n?```/g, ""));

  return parsed.map(
    (seo: { page_path: string; title: string; description: string }) => ({
      page_path: seo.page_path,
      title: seo.title,
      description: seo.description,
      og_image_id: "",
    })
  );
}

function generateTeamPlaceholders(industry: string) {
  const templates = [
    { name: "Team Member", role: "Founder & Lead", bio: `Passionate ${industry} professional with years of experience delivering exceptional results.` },
    { name: "Team Member", role: "Operations Manager", bio: `Keeps everything running smoothly and ensures every client receives top-notch service.` },
    { name: "Team Member", role: "Client Relations", bio: `Dedicated to providing outstanding customer service and building lasting relationships.` },
  ];

  return templates.map((t, i) => ({
    id: `team-${i + 1}`,
    name: t.name,
    role: t.role,
    bio: t.bio,
    image_id: "",
  }));
}

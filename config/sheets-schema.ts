/**
 * Google Sheets schema definition.
 * Each client's Google Sheet must have these tabs with the specified columns.
 * The first row of each tab is treated as headers.
 */

export const SHEETS_SCHEMA = {
  site_config: {
    description: "Key-value pairs for site configuration",
    columns: ["key", "value"],
  },
  services: {
    description: "Service offerings displayed on the services page",
    columns: [
      "id",
      "title",
      "slug",
      "description",
      "image_id",
      "icon",
      "order",
    ],
  },
  portfolio: {
    description: "Portfolio/project items with images",
    columns: [
      "id",
      "title",
      "description",
      "image_ids",
      "category",
      "date",
    ],
  },
  testimonials: {
    description: "Client testimonials and reviews",
    columns: ["id", "name", "role", "text", "rating", "image_id"],
  },
  blog: {
    description: "Blog posts with full content",
    columns: [
      "id",
      "title",
      "slug",
      "content",
      "excerpt",
      "image_id",
      "published_at",
      "status",
    ],
  },
  team: {
    description: "Team member profiles",
    columns: ["id", "name", "role", "bio", "image_id"],
  },
  faqs: {
    description: "Frequently asked questions",
    columns: ["id", "question", "answer", "category"],
  },
  seo: {
    description: "Per-page SEO metadata overrides",
    columns: ["page_path", "title", "description", "og_image_id"],
  },
  custom_apps: {
    description: "Custom app/tool definitions (JSON-driven pages)",
    columns: [
      "id",
      "title",
      "slug",
      "status",
      "definition",
      "created_at",
      "updated_at",
    ],
  },
} as const;

export type SheetName = keyof typeof SHEETS_SCHEMA;

export interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_id: string;
  icon: string;
  order: string;
}

export interface PortfolioRow {
  id: string;
  title: string;
  description: string;
  image_ids: string;
  category: string;
  date: string;
}

export interface TestimonialRow {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: string;
  image_id: string;
}

export interface BlogRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_id: string;
  published_at: string;
  status: string;
}

export interface TeamRow {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_id: string;
}

export interface FAQRow {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SEORow {
  page_path: string;
  title: string;
  description: string;
  og_image_id: string;
}

export interface CustomAppRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  definition: string;
  created_at: string;
  updated_at: string;
}

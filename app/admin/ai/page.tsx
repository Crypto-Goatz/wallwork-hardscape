"use client";

import { AIChat } from "@/components/admin/AIChat";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AIPage() {
  const handleSaveToBlog = async (content: string) => {
    const slug = `post-${Date.now()}`;
    const data: Record<string, string> = {
      id: slug,
      title: content.slice(0, 80),
      slug,
      content,
      excerpt: content.slice(0, 200),
      image_id: "",
      published_at: new Date().toISOString().split("T")[0],
      status: "draft",
    };

    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheet: "blog", data }),
    });

    if (!res.ok) throw new Error("Failed to save blog post");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Content Writer</h1>
        <p className="text-gray-600 mt-1">
          Generate content for your website using AI. Save posts directly to your blog.
        </p>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-gray-600">Quick Prompts</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600">
              Try: &quot;Write a blog post about kitchen remodeling trends&quot;
            </span>
            <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600">
              Try: &quot;Generate SEO metadata for my services page&quot;
            </span>
            <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600">
              Try: &quot;Improve this copy for better conversions&quot;
            </span>
          </div>
        </CardContent>
      </Card>

      <AIChat onSaveToBlog={handleSaveToBlog} />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { getPublicUrl } from "@/lib/drive-utils";

interface BlogPostProps {
  title: string;
  slug: string;
  excerpt: string;
  imageId?: string;
  publishedAt: string;
  variant?: "card" | "full";
  content?: string;
}

export function BlogPost({
  title,
  slug,
  excerpt,
  imageId,
  publishedAt,
  variant = "card",
  content,
}: BlogPostProps) {
  if (variant === "full") {
    return (
      <article className="max-w-3xl mx-auto">
        {imageId && (
          <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={getPublicUrl(imageId)}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          {publishedAt && (
            <time className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </header>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </article>
    );
  }

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {imageId && (
        <div className="relative h-48 bg-gray-100">
          <Image
            src={getPublicUrl(imageId)}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      )}
      <div className="p-5">
        {publishedAt && (
          <time className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Calendar className="w-3 h-3" />
            {new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{excerpt}</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
          Read More <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

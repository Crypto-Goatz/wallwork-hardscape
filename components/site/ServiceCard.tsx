import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPublicUrl } from "@/lib/drive-utils";

interface ServiceCardProps {
  title: string;
  description: string;
  slug: string;
  imageId?: string;
  icon?: string;
}

export function ServiceCard({
  title,
  description,
  slug,
  imageId,
}: ServiceCardProps) {
  return (
    <Link
      href={`/services/${slug}`}
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
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
          Learn More <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

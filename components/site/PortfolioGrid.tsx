import Image from "next/image";
import { getPublicUrl } from "@/lib/drive-utils";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_ids: string;
  category: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const firstImageId = item.image_ids?.split(",")[0]?.trim();
        return (
          <div
            key={item.id}
            className="group rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {firstImageId && (
              <div className="relative h-64 bg-gray-100">
                <Image
                  src={getPublicUrl(firstImageId)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            )}
            <div className="p-5">
              {item.category && (
                <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
                  {item.category}
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

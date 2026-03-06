"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

const CATEGORIES = [
  "All",
  "Hardscape",
  "Retaining Walls",
  "Excavation",
  "Concrete",
  "Masonry",
];

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === cat
                ? "bg-red-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Placeholder image */}
            <div className="relative h-64 bg-gray-200 flex flex-col items-center justify-center gap-3">
              <Camera className="w-10 h-10 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">
                Photo coming soon
              </span>
              <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

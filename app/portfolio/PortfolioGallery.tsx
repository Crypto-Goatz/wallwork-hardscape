"use client";

import { useState } from "react";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

const CATEGORIES = [
  "All",
  "Hardscape",
  "Retaining Walls",
];

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

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
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
          <button
            key={item.id}
            onClick={() => setLightbox(item)}
            className="group rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all text-left"
          >
            <div className="relative h-64 bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-5">
              <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full mb-2">
                {item.category}
              </span>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
              <Image
                src={lightbox.image}
                alt={lightbox.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
            <div className="p-6">
              <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full mb-2">
                {lightbox.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {lightbox.title}
              </h3>
              <p className="text-gray-600">{lightbox.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

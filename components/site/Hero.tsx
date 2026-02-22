import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  phone?: string;
  imageUrl?: string;
}

export function Hero({ title, subtitle, phone, imageUrl }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-blue-500 transition-colors"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call {phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

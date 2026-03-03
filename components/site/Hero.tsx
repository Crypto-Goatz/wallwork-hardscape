import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, ChevronDown } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  phone?: string;
  imageUrl?: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  minimal?: boolean; // compact interior-page hero
}

export function Hero({
  title,
  subtitle,
  phone,
  imageUrl = "/hero-hardscape.jpg",
  eyebrow,
  ctaLabel = "Get a Free Quote",
  ctaHref = "/contact",
  minimal = false,
}: HeroProps) {
  if (minimal) {
    return (
      <section className="relative bg-black text-white overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt="Wall Works Hardscape project"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Dark overlay — heavier for minimal/interior pages */}
          <div className="absolute inset-0 bg-black/70" />
          {/* subtle red tint at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-red-400 font-semibold mb-4">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-4">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-red-500 transition-colors"
              >
                {ctaLabel}
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  <span>{phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full hero for home page
  return (
    <section className="relative bg-black text-white overflow-hidden min-h-[85vh] flex flex-col justify-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="Wall Works Hardscape masterpiece project"
          fill
          className="object-cover object-center scale-105"
          priority
          unoptimized
          style={{ transform: "scale(1.05)" }}
        />
        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
        <div className="max-w-3xl">
          {eyebrow && (
            <p
              className="text-xs uppercase tracking-[0.25em] text-red-400 font-semibold mb-5"
              style={{
                opacity: 1,
                animation: "fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-balance mb-6"
            style={{
              animation: "fadeSlideUp 0.9s 0.1s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {title}
          </h1>
          <p
            className="text-lg sm:text-xl text-white/70 leading-relaxed mb-10 max-w-xl"
            style={{
              animation: "fadeSlideUp 0.9s 0.2s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {subtitle}
          </p>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{
              animation: "fadeSlideUp 0.9s 0.3s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-red-500 active:scale-95 transition-all duration-150"
            >
              {ctaLabel}
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </Link>
            {phone && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-white/40 uppercase tracking-widest">
                  Call us today
                </span>
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-2 text-white font-semibold text-lg hover:text-red-400 transition-colors"
                >
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  {phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-1"
        style={{ animation: "fadeSlideUp 1s 0.6s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  );
}

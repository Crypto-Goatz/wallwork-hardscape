"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { getPublicUrl } from "@/lib/drive-utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

interface HeaderProps {
  siteName: string;
  phone?: string;
  logoImageId?: string;
}

export function Header({ siteName, phone, logoImageId }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            {logoImageId ? (
              <Image
                src={getPublicUrl(logoImageId)}
                alt={siteName}
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            ) : (
              siteName
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            )}
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 rounded-md"
              >
                {link.label}
              </Link>
            ))}
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-blue-600"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

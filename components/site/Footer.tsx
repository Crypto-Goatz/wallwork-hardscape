import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { getPublicUrl } from "@/lib/drive-utils";

interface FooterProps {
  siteName: string;
  phone?: string;
  email?: string;
  logoImageId?: string;
}

export function Footer({ siteName, phone, email, logoImageId }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            {logoImageId ? (
              <div className="mb-3">
                <Image
                  src={getPublicUrl(logoImageId)}
                  alt={siteName}
                  width={140}
                  height={40}
                  className="h-10 w-auto object-contain brightness-0 invert"
                  unoptimized
                />
              </div>
            ) : (
              <h3 className="text-white text-lg font-bold mb-3">{siteName}</h3>
            )}
            <p className="text-sm text-gray-400 mb-3">
              Licensed and insured hardscape contractor serving Pittsburgh and
              Western Pennsylvania. Retaining walls, paver patios, excavation,
              concrete, and masonry.
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Serving Pittsburgh, Greensburg, Irwin, Monroeville, Murrysville,
                and surrounding communities.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-2">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  {email}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {year} {siteName}. All rights reserved. Powered by{" "}
          <a
            href="https://rocketclients.com"
            className="text-red-400 hover:text-red-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rocket+
          </a>
        </div>
      </div>
    </footer>
  );
}

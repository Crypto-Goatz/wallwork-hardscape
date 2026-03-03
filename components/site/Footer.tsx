import Link from "next/link";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
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
            <p className="text-sm text-gray-400 mb-4">
              Professional services you can trust. Quality work, fair prices,
              and customer satisfaction guaranteed.
            </p>
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

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>&copy; {year} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>

        {/* Powered by bar */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-5 justify-center">
            <a
              href="https://rocketopp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              {/* Placeholder — user will replace with real RocketOpp logo */}
              <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                R+
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors font-medium">
                Powered by RocketOpp
              </span>
            </a>
            <span className="text-gray-700 text-xs">|</span>
            <a
              href="https://0nmcp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              {/* Placeholder — user will replace with real 0nMCP logo */}
              <div className="w-7 h-7 rounded bg-gray-700 flex items-center justify-center text-white text-[10px] font-bold">
                0N
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors font-medium">
                0nMCP.com
              </span>
            </a>
          </div>
          <p className="text-[10px] text-gray-700 text-center max-w-2xl leading-relaxed">
            This site contains proprietary code of{" "}
            <a href="https://rocketopp.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-500 underline underline-offset-2">
              RocketOpp
            </a>
            . Any individual who accesses this codebase is subject to, and must abide by, the intellectual and physical
            property rules set forth within RocketOpp&apos;s legal terms. Unauthorized use, reproduction, or distribution
            of this code is strictly prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
}

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
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="https://www.google.com/search?sca_esv=73000156de4ea350&hl=en-US&sxsrf=ANbL-n6WogYC5zDWfrjsyZM-esPTFNmMWQ:1772552529574&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOXiK3Htuf0pOvPDjCYPKKWcSnCGeQvd9e0r0vbAsrv79nbSEOe1NjYaQB7jhSA0u4TXUSWqd1Q_uoX0BSfJPejMXlqn-6BCV7vR0S3qTqsUmd5Tcyg%3D%3D&q=Wall+Works+Hardscape+LLC+Reviews&sa=X&ved=2ahUKEwjizPveiISTAxWyEFkFHWtoBUUQ0bkNegQIHRAD&biw=1471&bih=812&dpr=2#lrd=0x4e47eff9aaf181c9:0x5c2ea2c578e321a6,3,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-yellow-500 hover:text-yellow-400 transition-colors font-medium"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Rate Our Work on Google
            </a>
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

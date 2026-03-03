"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  BarChart3,
  Settings,
  ArrowLeft,
  Inbox,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black text-white min-h-screen flex flex-col border-r border-white/10">
      {/* Brand header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Image
            src="/logo.png"
            alt="Wall Works Hardscape"
            width={0}
            height={0}
            sizes="140px"
            className="h-10 w-auto object-contain"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-tight">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
      </div>

      {/* RocketOpp branding */}
      <div className="p-4 border-t border-white/10 bg-black">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3 justify-center">
            {/* RocketOpp placeholder — user will replace with real logo */}
            <a
              href="https://rocketopp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 group"
            >
              <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-[10px] font-bold leading-none">
                R+
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors font-medium">
                RocketOpp
              </span>
            </a>
            <span className="text-white/20 text-xs">|</span>
            <a
              href="https://0nmcp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 group"
            >
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white text-[9px] font-bold leading-none">
                0N
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors font-medium">
                0nMCP
              </span>
            </a>
          </div>
          <p className="text-[10px] text-gray-600 leading-snug">
            Powered by{" "}
            <a href="https://rocketopp.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400 underline underline-offset-2">
              RocketOpp
            </a>{" "}
            &amp;{" "}
            <a href="https://0nmcp.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400 underline underline-offset-2">
              0nMCP
            </a>
          </p>
        </div>
        <p className="mt-3 text-[9px] text-gray-700 leading-relaxed text-center">
          This site contains proprietary code of RocketOpp. Anyone who accesses
          this codebase is subject to the intellectual and physical property
          rules set forth in{" "}
          <a
            href="https://rocketopp.com/legal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-500 underline underline-offset-1"
          >
            RocketOpp&apos;s legal terms
          </a>
          .
        </p>
      </div>
    </aside>
  );
}

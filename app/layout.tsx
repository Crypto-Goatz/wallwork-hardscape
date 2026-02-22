import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { getSiteConfig } from "@/config/site.config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    title: config.name || "Rocket Client Site",
    description: `Professional services by ${config.name || "our team"}. Quality work, fair prices, satisfaction guaranteed.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();
  const cro9Key = config.cro9Key || process.env.NEXT_PUBLIC_CRO9_KEY;
  const crmTrackingId = config.crmTrackingId || process.env.NEXT_PUBLIC_CRM_TRACKING_ID;

  const colorStyles = {
    "--color-primary": config.colors.primary,
    "--color-secondary": config.colors.secondary,
    "--color-accent": config.colors.accent,
  } as React.CSSProperties;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={colorStyles}
      >
        {children}

        {/* CRO9 Analytics Tracker */}
        {cro9Key && (
          <Script
            src="https://cdn.cro9.app/tracker.min.js"
            data-api-key={cro9Key}
            data-consent-mode="gdpr"
            strategy="afterInteractive"
          />
        )}

        {/* CRM Tracking Script */}
        {crmTrackingId && (
          <Script
            src="https://links.rocketclients.com/js/external-tracking.js"
            data-tracking-id={crmTrackingId}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { FadeIn } from "@/components/site/FadeIn";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export const revalidate = 300;

export default async function PortfolioPage() {
  const config = await getSiteConfig();
  let items: Record<string, string>[] = [];

  try {
    items = await getSheetData("portfolio");
  } catch {
    // Sheets not configured
  }

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen">
        <Hero
          minimal
          title="Our Portfolio"
          subtitle="A showcase of retaining walls, paver patios, outdoor living spaces, and more — built with precision across Pittsburgh."
          phone={config.phone}
          eyebrow="Our Work"
          imageUrl="/hero-retaining-wall.jpg"
          ctaLabel="Start Your Project"
        />

        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {items.length > 0 ? (
              <FadeIn direction="up" delay={100}>
                <PortfolioGrid
                  items={items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    image_ids: item.image_ids,
                    category: item.category,
                  }))}
                />
              </FadeIn>
            ) : (
              <FadeIn direction="up">
                <p className="text-center text-muted-foreground py-16 text-lg">
                  Portfolio photos coming soon — check back shortly!
                </p>
              </FadeIn>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-foreground text-white">
          <FadeIn direction="up">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Love What You See?</h2>
              <p className="text-white/70 text-lg mb-8">
                Let&apos;s bring the same quality to your property. Request your free estimate today.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-red-500 transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 flex items-center justify-center gap-2 text-white/50 text-sm">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                Call us: <a href={`tel:${config.phone.replace(/\D/g, "")}`} className="font-semibold text-white/80 hover:text-white transition-colors">{config.phone}</a>
              </p>
            </div>
          </FadeIn>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

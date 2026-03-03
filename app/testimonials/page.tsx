import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { FadeIn } from "@/components/site/FadeIn";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export const revalidate = 300;

export default async function TestimonialsPage() {
  const config = await getSiteConfig();
  let testimonials: Record<string, string>[] = [];

  try {
    testimonials = await getSheetData("testimonials");
  } catch {
    // Sheets not configured
  }

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen">
        <Hero
          minimal
          title="What Our Clients Say"
          subtitle="Hundreds of satisfied homeowners and businesses across Pittsburgh trust Wall Works Hardscape to transform their outdoor spaces."
          phone={config.phone}
          eyebrow="Reviews & Testimonials"
          imageUrl="/hero-patio.jpg"
          ctaLabel="Join Our Satisfied Clients"
        />

        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <FadeIn key={t.id || i} direction="up" delay={i * 80}>
                    <TestimonialCard
                      name={t.name}
                      role={t.role}
                      text={t.text}
                      rating={t.rating}
                    />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <FadeIn direction="up">
                <p className="text-center text-muted-foreground py-16 text-lg">
                  Client reviews coming soon!
                </p>
              </FadeIn>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-red-600 text-white">
          <FadeIn direction="up">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Be Our Next Success Story?</h2>
              <p className="text-red-100 text-lg mb-8">
                Get your free, no-obligation estimate and see why Pittsburgh trusts Wall Works Hardscape.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-red-50 transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 flex items-center justify-center gap-2 text-red-200 text-sm">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                Call us: <a href={`tel:${config.phone.replace(/\D/g, "")}`} className="font-semibold text-white hover:underline">{config.phone}</a>
              </p>
            </div>
          </FadeIn>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

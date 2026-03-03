import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { FadeIn } from "@/components/site/FadeIn";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export const revalidate = 300;

export default async function ServicesPage() {
  const config = await getSiteConfig();
  let services: Record<string, string>[] = [];

  try {
    services = await getSheetData("services");
  } catch {
    // Sheets not configured
  }

  const sorted = services.sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen">
        <Hero
          minimal
          title="Our Services"
          subtitle="From retaining walls and paver patios to outdoor kitchens and concrete driveways — we build it right the first time."
          phone={config.phone}
          eyebrow="What We Build"
          imageUrl="/hero-patio.jpg"
          ctaLabel="Get a Free Estimate"
        />

        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {sorted.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((svc, i) => (
                  <FadeIn key={svc.id} direction="up" delay={i * 70}>
                    <ServiceCard
                      title={svc.title}
                      description={svc.description}
                      slug={svc.slug}
                      imageId={svc.image_id}
                      icon={svc.icon}
                    />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <FadeIn direction="up">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Retaining Walls", desc: "Residential & commercial walls engineered for beauty and longevity." },
                    { title: "Paver Patios", desc: "Custom paver designs that turn your backyard into an outdoor living space." },
                    { title: "Concrete Driveways", desc: "Durable, clean driveways with decorative finish options." },
                    { title: "Outdoor Kitchens & Fireplaces", desc: "Built-in kitchens and fireplaces that extend your living space outdoors." },
                    { title: "Boulder Walls", desc: "Natural boulder walls that blend seamlessly into the landscape." },
                    { title: "Excavation & Grading", desc: "Site preparation and grading for any size project." },
                  ].map((svc, i) => (
                    <FadeIn key={svc.title} direction="up" delay={i * 70}>
                      <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{svc.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </FadeIn>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-red-600 text-white">
          <FadeIn direction="up">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
              <p className="text-red-100 text-lg mb-8">
                Tell us about your project and we&apos;ll put together a detailed, no-obligation estimate.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-red-50 transition-colors"
              >
                Get a Free Estimate <ArrowRight className="w-5 h-5" />
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

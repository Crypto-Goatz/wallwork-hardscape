import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { FadeIn } from "@/components/site/FadeIn";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

const PLACEHOLDER_TESTIMONIALS = [
  {
    id: "p1",
    name: "Brian M.",
    role: "Homeowner — Mt. Lebanon, PA",
    text: "Wall Works completely transformed our backyard. The retaining wall they built is solid, beautiful, and exactly what we envisioned. The crew was professional, on time, and cleaned up every day. Highly recommend.",
    rating: "5",
  },
  {
    id: "p2",
    name: "Stephanie R.",
    role: "Homeowner — Peters Township, PA",
    text: "We had a massive erosion problem on our hillside property. Wall Works came out, assessed the situation, and built a tiered boulder wall system that solved everything. Honestly exceeded our expectations.",
    rating: "5",
  },
  {
    id: "p3",
    name: "Dave & Lisa T.",
    role: "Homeowners — Upper St. Clair, PA",
    text: "From the estimate to the final walkthrough, everything was seamless. Our paver patio and outdoor kitchen came out stunning. We use it every weekend. Worth every penny.",
    rating: "5",
  },
];

export const revalidate = 300;

export default async function HomePage() {
  const config = await getSiteConfig();

  let services: Record<string, string>[] = [];
  let testimonials: Record<string, string>[] = [];

  try {
    services = await getSheetData("services");
    testimonials = await getSheetData("testimonials");
  } catch {
    // Sheets not configured yet — render with empty data
  }

  const displayTestimonials = testimonials.length > 0 ? testimonials : PLACEHOLDER_TESTIMONIALS;

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />

      <main>
        <Hero
          title={config.name}
          subtitle={config.tagline || "Professional hardscape services you can trust"}
          phone={config.phone}
          eyebrow="Pittsburgh's Premier Hardscape Contractor"
          imageUrl="/hero-hardscape.jpg"
        />

        {/* Services Section */}
        {services.length > 0 && (
          <section className="py-16 sm:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn direction="up" delay={0}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Services</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore what we offer. Every project gets the attention and quality it deserves.
                  </p>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
                  .slice(0, 6)
                  .map((svc, i) => (
                    <FadeIn key={svc.id} direction="up" delay={i * 80}>
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
              {services.length > 6 && (
                <FadeIn direction="up" delay={200}>
                  <div className="text-center mt-8">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1 text-red-600 font-medium hover:text-red-700"
                    >
                      View All Services <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </FadeIn>
              )}
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up" delay={0}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  What Our Clients Say
                </h2>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTestimonials.slice(0, 3).map((t, i) => (
                <FadeIn key={t.id} direction="up" delay={i * 100}>
                  <TestimonialCard
                    name={t.name}
                    role={t.role}
                    text={t.text}
                    rating={t.rating}
                  />
                </FadeIn>
              ))}
            </div>
            {displayTestimonials.length > 3 && (
              <FadeIn direction="up" delay={200}>
                <div className="text-center mt-8">
                  <Link
                    href="/testimonials"
                    className="inline-flex items-center gap-1 text-red-600 font-medium hover:text-red-700"
                  >
                    See All Reviews <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-red-600 text-white">
          <FadeIn direction="up" delay={0}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
                Contact us today for a free estimate. We&apos;ll discuss your project and provide a
                no-obligation quote.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-red-50 transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 flex items-center justify-center gap-2 text-red-200 text-sm">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                Or call us directly: <a href={`tel:${config.phone.replace(/\D/g, "")}`} className="font-semibold text-white hover:underline">{config.phone}</a>
              </p>
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer
        siteName={config.name}
        phone={config.phone}
        email={config.email}
        logoImageId={config.logoImageId}
      />
    </>
  );
}

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />

      <main>
        <Hero
          title={config.name}
          subtitle={config.tagline || "Professional services you can trust"}
          phone={config.phone}
        />

        {/* Services Section */}
        {services.length > 0 && (
          <section className="py-16 sm:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Our Services
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Explore what we offer. Every project gets the attention and
                  quality it deserves.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
                  .slice(0, 6)
                  .map((svc) => (
                    <ServiceCard
                      key={svc.id}
                      title={svc.title}
                      description={svc.description}
                      slug={svc.slug}
                      imageId={svc.image_id}
                      icon={svc.icon}
                    />
                  ))}
              </div>
              {services.length > 6 && (
                <div className="text-center mt-8">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800"
                  >
                    View All Services <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <section className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  What Our Clients Say
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.slice(0, 3).map((t) => (
                  <TestimonialCard
                    key={t.id}
                    name={t.name}
                    role={t.role}
                    text={t.text}
                    rating={t.rating}
                  />
                ))}
              </div>
              {testimonials.length > 3 && (
                <div className="text-center mt-8">
                  <Link
                    href="/testimonials"
                    className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800"
                  >
                    See All Reviews <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation. We&apos;ll discuss your
              project and provide a no-obligation quote.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
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

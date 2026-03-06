import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";

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
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                What Our Clients Say
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from the people who trust {config.name}.
              </p>
            </div>

            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <TestimonialCard
                    key={t.id || i}
                    name={t.name}
                    role={t.role}
                    text={t.text}
                    rating={t.rating}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">
                Testimonials are not yet available. Check back soon!
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

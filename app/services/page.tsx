import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ServiceCard } from "@/components/site/ServiceCard";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";

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
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                Our Services
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore the services we offer. Every project gets the attention
                and quality it deserves.
              </p>
            </div>

            {sorted.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((svc) => (
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
            ) : (
              <p className="text-center text-gray-500 py-12">
                Services are not yet available. Check back soon!
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";

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
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                Our Portfolio
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Browse our latest work and see what we can do for you.
              </p>
            </div>

            {items.length > 0 ? (
              <PortfolioGrid
                items={items.map((item) => ({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  image_ids: item.image_ids,
                  category: item.category,
                }))}
              />
            ) : (
              <p className="text-center text-gray-500 py-12">
                Portfolio items are not yet available. Check back soon!
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

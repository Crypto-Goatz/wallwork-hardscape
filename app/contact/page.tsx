import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EstimateForm } from "@/components/site/EstimateForm";
import { ContactInfo } from "@/components/site/ContactInfo";
import { ContactFAQ } from "@/components/site/ContactFAQ";
import { getSiteConfig } from "@/config/site.config";

export const revalidate = 300;

export const metadata = {
  title: "Free Estimate Request | Wallwork Hardscape",
  description:
    "Request a free hardscape estimate. We specialize in retaining walls, paver patios, concrete driveways, outdoor kitchens, boulder walls, and excavation throughout the Pittsburgh area.",
};

export default async function ContactPage() {
  const config = await getSiteConfig();

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-[color:var(--color-primary)] text-white py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-3 font-medium">
              No Obligation
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 leading-tight">
              Request Your <span className="text-[color:var(--color-accent)]">Free Estimate</span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              Tell us about your project in just a few steps. We'll prepare a detailed estimate and contact you within 1 business day.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

              {/* Form — takes 3/5 */}
              <div className="lg:col-span-3">
                <div className="bg-background border border-border rounded-2xl shadow-sm p-6 sm:p-8">
                  <EstimateForm />
                </div>
              </div>

              {/* Sidebar — takes 2/5 */}
              <div className="lg:col-span-2">
                <ContactInfo phone={config.phone} email={config.email} />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <ContactFAQ />
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

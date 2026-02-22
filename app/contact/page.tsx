import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { getSiteConfig } from "@/config/site.config";
import { Phone, Mail } from "lucide-react";

export const revalidate = 300;

export default async function ContactPage() {
  const config = await getSiteConfig();

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen">
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get in touch with {config.name}. We&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Get In Touch
                </h2>
                <div className="space-y-6">
                  {config.phone && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <a
                          href={`tel:${config.phone.replace(/\D/g, "")}`}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {config.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {config.email && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a
                          href={`mailto:${config.email}`}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {config.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send a Message
                </h2>
                <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

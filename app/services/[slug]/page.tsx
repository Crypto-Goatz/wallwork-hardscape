import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import { getPublicUrl } from "@/lib/drive-utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 300;

async function getServices() {
  try {
    return await getSheetData("services");
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const services = await getServices();
  return services
    .filter((s) => s.slug)
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((s) => s.slug === slug);
  const config = await getSiteConfig();

  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | ${config.name}`,
    description: service.description?.slice(0, 160) || `${service.title} services from ${config.name}`,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getSiteConfig();
  const services = await getServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) notFound();

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen">
        <article className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                {service.title}
              </h1>
            </div>

            {service.image_id && (
              <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-12 bg-gray-100">
                <Image
                  src={getPublicUrl(service.image_id)}
                  alt={service.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="prose prose-lg max-w-3xl mx-auto">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            <div className="mt-16 rounded-2xl bg-blue-600 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Interested in {service.title}?
              </h2>
              <p className="text-blue-100 max-w-xl mx-auto mb-8">
                Get in touch with us to learn more about how we can help.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

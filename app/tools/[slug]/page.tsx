import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AppRenderer } from "@/components/apps/AppRenderer";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import { parseAppDefinition } from "@/config/app-schema";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 300;

async function getActiveApps() {
  try {
    const data = await getSheetData("custom_apps");
    return data.filter((a) => a.status === "active");
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const apps = await getActiveApps();
  return apps.filter((a) => a.slug).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const apps = await getActiveApps();
  const app = apps.find((a) => a.slug === slug);

  if (!app) return { title: "Tool Not Found" };

  try {
    const definition = parseAppDefinition(JSON.parse(app.definition));
    return {
      title: definition.meta.title,
      description: definition.meta.description,
    };
  } catch {
    return { title: app.title || "Tool" };
  }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getSiteConfig();
  const apps = await getActiveApps();
  const app = apps.find((a) => a.slug === slug);

  if (!app) notFound();

  let definition;
  try {
    definition = parseAppDefinition(JSON.parse(app.definition));
  } catch {
    notFound();
  }

  const showHeader = definition.settings?.showHeader !== false;
  const showFooter = definition.settings?.showFooter !== false;

  return (
    <>
      {showHeader && (
        <Header
          siteName={config.name}
          phone={config.phone}
          logoImageId={config.logoImageId}
        />
      )}
      <main className="min-h-screen py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {definition.meta.title}
            </h1>
            {definition.meta.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {definition.meta.description}
              </p>
            )}
          </div>
          <AppRenderer definition={definition} />
        </div>
      </main>
      {showFooter && (
        <Footer
          siteName={config.name}
          phone={config.phone}
          email={config.email}
          logoImageId={config.logoImageId}
        />
      )}
    </>
  );
}

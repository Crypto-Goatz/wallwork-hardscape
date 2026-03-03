import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { FadeIn } from "@/components/site/FadeIn";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import { getPublicUrl } from "@/lib/drive-utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export const revalidate = 300;

export default async function AboutPage() {
  const config = await getSiteConfig();
  let teamMembers: Record<string, string>[] = [];

  try {
    teamMembers = await getSheetData("team");
  } catch {
    // Sheets not configured
  }

  return (
    <>
      <Header siteName={config.name} phone={config.phone} logoImageId={config.logoImageId} />
      <main className="min-h-screen">
        <Hero
          minimal
          title={`About ${config.name}`}
          subtitle="Built on integrity, craftsmanship, and a passion for transforming outdoor spaces across Pittsburgh and the surrounding areas."
          phone={config.phone}
          eyebrow="Our Story"
          imageUrl="/hero-retaining-wall.jpg"
          ctaLabel="Request a Free Estimate"
        />

        {/* Mission section */}
        <section className="py-20 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <FadeIn direction="up" delay={0}>
                <div>
                  <p className="text-xs uppercase tracking-widest text-red-600 font-semibold mb-3">Who We Are</p>
                  <h2 className="text-3xl font-bold text-foreground mb-5">
                    Pittsburgh&apos;s Trusted Hardscape Specialists
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Wall Works Hardscape LLC has been transforming outdoor spaces throughout the Pittsburgh region for years. We specialize in retaining walls, paver patios, outdoor kitchens, concrete driveways, and much more.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Every project we take on is treated with the same level of care and craftsmanship — from a small garden wall to a full outdoor living renovation.
                  </p>
                </div>
              </FadeIn>
              <FadeIn direction="up" delay={100}>
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] relative bg-gray-100">
                  <Image
                    src="/hero-patio.jpg"
                    alt="Wall Works Hardscape patio project"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {teamMembers.length > 0 && (
          <section className="py-20 bg-muted/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn direction="up">
                <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                  Meet Our Team
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, i) => (
                  <FadeIn key={member.id || i} direction="up" delay={i * 80}>
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
                      {member.image_id && (
                        <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                          <Image
                            src={getPublicUrl(member.image_id)}
                            alt={member.name || "Team member"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                      {member.role && (
                        <p className="text-sm font-medium text-red-600 mt-1">{member.role}</p>
                      )}
                      {member.bio && (
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{member.bio}</p>
                      )}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-foreground text-white">
          <FadeIn direction="up">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Start Your Project Today</h2>
              <p className="text-white/70 text-lg mb-8">
                Let&apos;s build something beautiful together. Request your free, no-obligation estimate.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-red-500 transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 flex items-center justify-center gap-2 text-white/50 text-sm">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                Or call us: <a href={`tel:${config.phone.replace(/\D/g, "")}`} className="font-semibold text-white/80 hover:text-white transition-colors">{config.phone}</a>
              </p>
            </div>
          </FadeIn>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

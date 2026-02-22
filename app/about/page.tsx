import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteConfig } from "@/config/site.config";
import { getSheetData } from "@/lib/google/sheets";
import { getPublicUrl } from "@/lib/drive-utils";
import Image from "next/image";

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
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              About {config.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {config.tagline || "Professional services you can trust. Quality work, fair prices, and customer satisfaction guaranteed."}
            </p>
          </div>
        </section>

        {teamMembers.length > 0 && (
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Meet Our Team
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, i) => (
                  <div
                    key={member.id || i}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center"
                  >
                    {member.image_id && (
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={getPublicUrl(member.image_id)}
                          alt={member.name || "Team member"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        {member.role}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-sm text-gray-500 mt-3">{member.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} logoImageId={config.logoImageId} />
    </>
  );
}

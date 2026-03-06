import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import Link from "next/link";
import { Shield, FileText, Building2, MapPin, ArrowRight } from "lucide-react";

const SERVICE_AREAS = [
  "Pittsburgh",
  "Allegheny County",
  "Westmoreland County",
  "Greensburg",
  "Irwin",
  "North Huntingdon",
  "Monroeville",
  "Murrysville",
  "Latrobe",
  "Plum",
  "Wexford",
  "Cranberry Township",
];

const DIFFERENTIATORS = [
  {
    icon: Shield,
    title: "Engineered Solutions",
    description:
      "We install manufacturer-engineered retaining wall systems from trusted brands including Unilock, Versa-Lok, MagnumStone, Keystone, RECON, Concord, and Stone & Company.",
  },
  {
    icon: FileText,
    title: "Detailed Estimates",
    description:
      "Every estimate is itemized so you understand what\u2019s included \u2014 materials, labor, drainage, reinforcement, and engineering requirements.",
  },
  {
    icon: Building2,
    title: "Residential & Commercial",
    description:
      "From backyard patios to commercial site development, we have the equipment and expertise for projects of any scale.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header siteName="Wall Works Hardscape" phone="(412) 555-0199" />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              About Wall Works Hardscape
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Licensed and insured hardscape contractor serving Pittsburgh and
              Western Pennsylvania.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Wall Works Hardscape is a locally owned and operated hardscape
                contractor serving Pittsburgh, Allegheny County, Westmoreland
                County, and surrounding communities. We specialize in engineered
                retaining wall systems, paver patio installation, excavation
                services, concrete construction, and masonry restoration.
              </p>
              <p>
                Every project we take on receives the same level of attention to
                detail &mdash; from proper base preparation and drainage to
                selecting the right engineered system for the job. We provide
                detailed, itemized estimates so our customers know exactly what
                is required to build a safe and long-lasting result.
              </p>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What Sets Us Apart
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {DIFFERENTIATORS.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white mb-5">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Proudly Serving
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Wall Works Hardscape serves homeowners, businesses, and developers
              across the greater Pittsburgh region.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {SERVICE_AREAS.map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                >
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-sm font-medium text-gray-700">
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-red-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Discuss Your Project?
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Contact Wall Works Hardscape today for a free, detailed estimate.
              Licensed and insured for residential and commercial projects.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-red-50 transition-colors"
            >
              Get a Free Estimate <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer
        siteName="Wall Works Hardscape"
        phone="(412) 555-0199"
        email="info@wallworkhardscape.com"
      />
    </>
  );
}

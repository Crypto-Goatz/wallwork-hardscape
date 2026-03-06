import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MapPin,
  Hammer,
  Layers,
  Shovel,
  Droplets,
  HardHat,
  Landmark,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const SERVICES = [
  {
    icon: Hammer,
    title: "Hardscaping & Outdoor Living",
    description:
      "Paver patios, outdoor kitchens, landscape walls, and decorative hardscape features that improve property value.",
  },
  {
    icon: Layers,
    title: "Retaining Wall Installation",
    description:
      "Engineered retaining wall systems for residential and commercial projects using Unilock, Versa-Lok, MagnumStone, and more.",
  },
  {
    icon: Shovel,
    title: "Excavation Services",
    description:
      "Site preparation, trenching, utility excavation, foundation footers, grading, and drainage installation.",
  },
  {
    icon: HardHat,
    title: "Concrete & Masonry",
    description:
      "Driveway installation, concrete flatwork, brick and block construction, stone veneer, masonry restoration.",
  },
  {
    icon: Droplets,
    title: "Grading & Drainage",
    description:
      "Yard grading, stormwater control, drainage correction, and slope stabilization for residential and commercial sites.",
  },
  {
    icon: Landmark,
    title: "Property Repairs & Maintenance",
    description:
      "Masonry repointing, structural repairs, and ongoing property maintenance to protect your investment.",
  },
];

const PRICING_TIERS = [
  {
    title: "Wire Basket / Boulder",
    range: "$50–$80",
    unit: "per sq ft",
    description: "Gabion or boulder retaining walls",
  },
  {
    title: "Segmental Concrete Block",
    range: "$65–$120+",
    unit: "per sq ft",
    description:
      "With proper base preparation, drainage stone, and geogrid reinforcement",
  },
  {
    title: "Concrete / Masonry",
    range: "$100–$130+",
    unit: "per sq ft",
    description: "Poured footers and veneer finishes",
  },
];

const COST_FACTORS = [
  "Wall height",
  "Excavation depth",
  "Drainage requirements",
  "Reinforcement grid length",
  "Soil conditions",
  "Equipment access",
  "Loads above the wall (driveways, vehicles, structures)",
  "Engineering requirements for taller walls",
];

const SYSTEMS = [
  {
    name: "Unilock",
    description: "Pavers and residential retaining wall systems",
    url: "https://www.unilock.com",
    logo: "/logos/unilock.svg",
  },
  {
    name: "Versa-Lok",
    description: "Engineered segmental retaining wall systems",
    url: "https://www.versa-lok.com",
    logo: "/logos/versa-lok.svg",
  },
  {
    name: "MagnumStone",
    description: "Commercial structural retaining wall systems",
    url: "https://www.magnumstone.com",
    logo: "/logos/magnumstone.png",
  },
  {
    name: "Keystone Hardscapes",
    description: "Compac III retaining wall system",
    url: "https://www.keystonehardscapes.com",
    logo: "/logos/keystone.jpg",
  },
  {
    name: "Tensar",
    description: "Walls and slope stabilization systems",
    url: "https://www.tensarcorp.com/solutions/walls-slope-systems",
    logo: "/logos/tensar.svg",
  },
  {
    name: "RECON Wall Systems",
    description: "Large-scale commercial retaining systems",
    url: "https://www.reconwalls.com",
    logo: "/logos/recon.png",
  },
  {
    name: "Redi-Rock",
    description: "Precast concrete retaining wall systems",
    url: "https://www.stoneconcrete.com/retaining-walls",
    logo: "/logos/redirock.svg",
  },
  {
    name: "Concorde Wall Systems",
    description: "Patented structural retaining wall system",
    url: "https://www.concordewalls.com/design-supply-construct.html",
    logo: "/logos/concorde.svg",
  },
];

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

export default function HomePage() {
  return (
    <>
      <Header siteName="Wall Works Hardscape" phone="(412) 235-8658" />

      <main>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HomeAndConstructionBusiness",
              name: "Wall Works Hardscape",
              url: "https://wallworkhardscape.com",
              telephone: "(412) 235-8658",
              email: "info@wallworkhardscape.com",
              description:
                "Licensed and insured hardscape contractor serving Pittsburgh, Allegheny County, and Westmoreland County. Services include retaining walls, paver patios, excavation, concrete, and masonry.",
              priceRange: "$$",
              areaServed: SERVICE_AREAS.map((area) => ({
                "@type": "Place",
                name: area + ", Pennsylvania",
              })),
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Hardscape Services",
                itemListElement: [
                  "Hardscape Construction",
                  "Retaining Wall Installation",
                  "Excavation Services",
                  "Concrete Construction",
                  "Masonry Restoration",
                  "Grading and Drainage",
                ].map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
              },
            }),
          }}
        />

        {/* ===== HERO ===== */}
        <section className="relative text-white overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero-retaining-wall.jpg"
              alt="Retaining wall project by Wall Works Hardscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Hardscape Contractor{" "}
                <span className="text-red-500">in Pittsburgh</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl">
                Wall Works Hardscape is a licensed and insured hardscape
                contractor serving Pittsburgh and surrounding communities. From
                engineered retaining walls to custom paver patios &mdash; built
                to last, designed to impress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-red-500 transition-colors"
                >
                  Get a Free Estimate
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:4122358658"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call (412) 235-8658
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES GRID ===== */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Our Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Professional hardscape, excavation, concrete, and masonry
                services for residential and commercial projects.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((svc) => (
                <Link
                  key={svc.title}
                  href="/services"
                  className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white mb-4 transition-transform group-hover:scale-110">
                    <svc.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-gray-600">{svc.description}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-red-600 font-medium hover:text-red-700"
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== RETAINING WALL PRICING ===== */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                How Much Does a Retaining Wall Cost?
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Retaining wall costs vary depending on wall height, length,
                materials, drainage requirements, and site access. In the
                Pittsburgh area, professionally installed retaining walls
                typically range from{" "}
                <strong>$50&ndash;$130+ per square foot</strong> depending on
                the system used and the complexity of the project.
              </p>
            </div>

            {/* Price Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tier.title}
                  </h3>
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {tier.range}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">{tier.unit}</div>
                  <p className="text-sm text-gray-600">{tier.description}</p>
                </div>
              ))}
            </div>

            {/* Cost Factors */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Costs Can Vary Depending On:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COST_FACTORS.map((factor) => (
                  <div
                    key={factor}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-gray-600 font-medium">
                Because every property is different, Wall Works Hardscape
                provides detailed, itemized estimates so you know exactly what
                is required to build a safe and long-lasting wall.
              </p>
            </div>
          </div>
        </section>

        {/* ===== ENGINEERED SYSTEMS ===== */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Engineered Systems We Install
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Trusted manufacturer partnerships for residential and commercial
                retaining wall and hardscape projects.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SYSTEMS.map((system) => (
                <a
                  key={system.name}
                  href={system.url}
                  target={system.url !== "#" ? "_blank" : undefined}
                  rel={system.url !== "#" ? "noopener noreferrer" : undefined}
                  className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-red-200 transition-all"
                >
                  {system.logo ? (
                    <div className="w-full h-14 flex items-center justify-start mb-4">
                      <img
                        src={system.logo}
                        alt={`${system.name} logo`}
                        className="h-10 w-auto max-w-[140px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-900 flex items-center justify-center mb-4 text-white text-xl font-bold group-hover:bg-red-600 transition-colors">
                      {system.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {system.name}
                    </h3>
                    {system.url !== "#" && (
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{system.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SERVICE AREAS ===== */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Serving Pittsburgh and Surrounding Communities
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Wall Works Hardscape proudly serves homeowners, businesses, and
                developers across the greater Pittsburgh region.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
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

        {/* ===== CTA ===== */}
        <section className="py-16 sm:py-20 bg-red-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Contact Wall Works Hardscape today for a free, detailed estimate.
              Licensed and insured for residential and commercial projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-red-50 transition-colors"
              >
                Request a Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors"
              >
                Schedule a Site Visit
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer
        siteName="Wall Works Hardscape"
        phone="(412) 235-8658"
        email="info@wallworkhardscape.com"
      />
    </>
  );
}

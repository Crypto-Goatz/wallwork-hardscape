import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  Hammer,
  Layers,
  Shovel,
  Droplets,
  HardHat,
  Landmark,
  ArrowRight,
  Phone,
  CheckCircle,
  Shield,
  Wrench,
  FileText,
} from "lucide-react";

const services = [
  {
    icon: Hammer,
    title: "Hardscape Contractor",
    description:
      "Hardscape construction transforms outdoor spaces into functional, beautiful extensions of your property. Our team specializes in designing and building durable hardscape features that improve property value while creating spaces your family and guests will enjoy for years to come.",
    items: [
      "Paver patio installation",
      "Outdoor living spaces",
      "Walkways",
      "Decorative landscape stone",
      "Outdoor kitchens",
      "Landscape walls",
      "Decorative hardscape features",
    ],
  },
  {
    icon: Layers,
    title: "Retaining Wall Contractor",
    description:
      "We design and install residential and commercial retaining walls engineered for long-term structural integrity. Our retaining wall systems address slope stabilization, landscape retention, and commercial site development challenges with proven products from industry-leading manufacturers.",
    items: [
      "Residential retaining walls",
      "Commercial retaining walls",
      "Engineered structural walls",
      "Retaining wall repairs",
    ],
    extra:
      "Systems installed include: Unilock, Versa-Lok, MagnumStone, Keystone Compac III, RECON, and Concord. Applications include slope stabilization, landscape retention, and commercial site development.",
  },
  {
    icon: Shovel,
    title: "Excavation Contractor",
    description:
      "Professional excavation ensures proper structural stability and water control for every project. From initial site preparation through final grading, our experienced crews handle earthwork of all scales with precision equipment and careful attention to existing utilities and property features.",
    items: [
      "Site preparation",
      "Earthwork",
      "Utility trenching",
      "Foundation excavation",
      "Grading and slope correction",
      "Drainage installation",
    ],
  },
  {
    icon: Droplets,
    title: "Grading & Drainage",
    description:
      "Proper grading and drainage protect your property from water damage, erosion, and foundation issues. We assess your site conditions and implement effective solutions that direct water away from structures while maintaining the natural aesthetics of your landscape.",
    items: [
      "Yard grading",
      "Stormwater control",
      "Drainage correction",
      "Slope stabilization",
    ],
  },
  {
    icon: HardHat,
    title: "Concrete Contractor",
    description:
      "Our concrete services cover everything from residential driveways to commercial structural work. We deliver clean, level, and long-lasting concrete installations with proper reinforcement, expansion joints, and finishing techniques suited to each application.",
    items: [
      "Driveways",
      "Flatwork",
      "Foundations",
      "Structural concrete",
      "Brick and block construction",
    ],
  },
  {
    icon: Landmark,
    title: "Masonry Contractor",
    description:
      "From new construction to historical restoration, our masonry team delivers precise, quality craftsmanship. We work with brick, block, and natural stone to build and repair structures that stand the test of time while maintaining their visual appeal.",
    items: [
      "Brick construction",
      "Block walls",
      "Stone veneer",
      "Repointing",
      "Structural repairs",
      "Masonry restoration",
    ],
  },
];

const WHY_CHOOSE = [
  "Professionally installed retaining wall systems",
  "Proper drainage and soil stabilization methods",
  "Quality base preparation and compaction",
  "Manufacturer-backed retaining wall systems",
  "Experience with residential and commercial projects",
  "Clear, itemized estimates so customers understand project costs",
];

const PRICING_TIERS = [
  {
    type: "Wire Basket (Gabion) or Boulder Retaining Walls",
    range: "$50\u2013$80",
    unit: "per square foot",
  },
  {
    type: "Segmental Concrete Block Retaining Walls",
    range: "$65\u2013$120+",
    unit: "per square foot",
  },
  {
    type: "Concrete or Masonry Walls with Poured Footers & Veneer Finishes",
    range: "$100\u2013$130+",
    unit: "per square foot",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header siteName="Wall Works Hardscape" phone="(412) 235-8658" />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Our Services
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              At Wall Works Hardscape, we design and build durable outdoor
              construction projects that improve drainage, stabilize landscapes,
              and enhance property value. Our services include retaining walls,
              excavation, grading, drainage solutions, paver patios, concrete
              work, and masonry construction for both residential and commercial
              clients throughout the Pittsburgh region.
            </p>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Why Choose Wall Works Hardscape
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHY_CHOOSE.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Sections */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 1;

            return (
              <section
                key={service.title}
                className={`flex flex-col ${
                  isEven ? "md:flex-row-reverse" : "md:flex-row"
                } gap-10 items-start`}
              >
                <div className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h2>
                </div>

                <div className="md:w-2/3">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {service.extra && (
                    <p className="text-gray-600 leading-relaxed mb-6 italic">
                      {service.extra}
                    </p>
                  )}

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
                  >
                    Request a Quote
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            );
          })}
        </div>

        {/* Retaining Wall Repair & Insurance */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Repair & Replacement */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Retaining Wall Repair & Replacement
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Many homeowners contact us when an existing retaining wall
                  begins to lean, crack, or fail. Wall Works Hardscape evaluates
                  failing retaining walls and provides options for structural
                  repair or full replacement using modern reinforced wall systems
                  designed for long-term stability.
                </p>
              </div>

              {/* Insurance Claims */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Insurance Claim Retaining Wall Repairs
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Retaining walls can fail due to heavy rainfall, drainage
                  issues, soil movement, or aging construction methods. In some
                  situations, repairs or replacements may qualify for homeowner
                  insurance coverage. Wall Works Hardscape assists homeowners
                  with evaluating damaged retaining walls and can provide
                  documentation, estimates, and reconstruction solutions when
                  insurance claims are involved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Retaining Wall FAQ &mdash; Pricing
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Retaining wall costs vary depending on wall height, length,
                materials, drainage requirements, and site access. In the
                Pittsburgh area, professionally installed retaining walls
                typically range from <strong>$50&ndash;$130+</strong> per square
                foot depending on the system used and project complexity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.type}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center"
                >
                  <p className="text-3xl font-bold text-red-600 mb-1">
                    {tier.range}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
                    {tier.unit}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {tier.type}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 text-center">
              <p className="text-gray-300 text-sm">
                Most residential segmental retaining wall projects fall between{" "}
                <span className="text-white font-bold">
                  $80 and $100 per square foot
                </span>{" "}
                depending on height and site conditions.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-red-600 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-red-100 text-lg mb-8">
              Contact Wall Works Hardscape for a detailed, itemized estimate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-red-50 transition-colors"
              >
                Get Your Free Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:4122358658"
                className="flex items-center gap-2 text-white font-semibold hover:text-red-100 transition-colors"
              >
                <Phone className="w-5 h-5" />
                (412) 235-8658
              </a>
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

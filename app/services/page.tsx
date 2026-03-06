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
              Professional hardscape, excavation, concrete, and masonry services
              for residential and commercial projects in the Pittsburgh area.
            </p>
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
                href="tel:4125550199"
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

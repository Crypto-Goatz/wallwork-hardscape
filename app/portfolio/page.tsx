import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PortfolioGallery } from "./PortfolioGallery";

const PORTFOLIO_ITEMS = [
  {
    id: "1",
    title: "Paver Patio Installation",
    description: "Custom paver patio with integrated seating area",
    category: "Hardscape",
  },
  {
    id: "2",
    title: "Residential Retaining Wall",
    description: "Engineered segmental block retaining wall with drainage system",
    category: "Retaining Walls",
  },
  {
    id: "3",
    title: "Commercial Retaining Wall",
    description: "Large-scale commercial retaining wall for site development",
    category: "Retaining Walls",
  },
  {
    id: "4",
    title: "Outdoor Living Space",
    description: "Complete outdoor living area with paver patio and landscape walls",
    category: "Hardscape",
  },
  {
    id: "5",
    title: "Yard Grading Project",
    description: "Property grading and drainage correction",
    category: "Excavation",
  },
  {
    id: "6",
    title: "Concrete Driveway Installation",
    description: "Poured concrete driveway with proper drainage",
    category: "Concrete",
  },
  {
    id: "7",
    title: "Masonry Restoration",
    description: "Historic brick masonry repointing and restoration",
    category: "Masonry",
  },
  {
    id: "8",
    title: "Excavation Project",
    description: "Site preparation and earthwork for new construction",
    category: "Excavation",
  },
  {
    id: "9",
    title: "Engineered Retaining Wall System",
    description: "Versa-Lok segmental retaining wall with geogrid reinforcement",
    category: "Retaining Walls",
  },
  {
    id: "10",
    title: "Hardscape Seating Area",
    description: "Custom stone seating area with decorative hardscape",
    category: "Hardscape",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Header siteName="Wall Works Hardscape" phone="(412) 555-0199" />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Our Portfolio
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Browse completed hardscape, retaining wall, excavation, and masonry
              projects across Pittsburgh and Western Pennsylvania.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <PortfolioGallery items={PORTFOLIO_ITEMS} />
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

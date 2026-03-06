import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PortfolioGallery } from "./PortfolioGallery";

const PORTFOLIO_ITEMS = [
  {
    id: "1",
    title: "Commercial Retaining Wall — Driveway Grade",
    description:
      "Large-scale segmental block retaining wall supporting a commercial driveway with integrated fencing and landscape grading.",
    category: "Retaining Walls",
    image: "/portfolio/commercial-retaining-wall-driveway.jpg",
  },
  {
    id: "2",
    title: "Commercial Retaining Wall — Parking Structure",
    description:
      "Tiered segmental retaining wall system along a commercial parking area, engineered for vehicle loading and slope retention.",
    category: "Retaining Walls",
    image: "/portfolio/commercial-retaining-wall-parking.jpg",
  },
  {
    id: "3",
    title: "Segmental Block Wall Construction",
    description:
      "Residential segmental concrete block retaining wall during construction phase with proper base preparation and backfill.",
    category: "Retaining Walls",
    image: "/portfolio/segmental-block-wall-construction.jpg",
  },
  {
    id: "4",
    title: "Engineered Retaining Wall Detail",
    description:
      "Close-up of engineered segmental retaining wall system showing precision block placement, drainage stone, and structural integrity.",
    category: "Retaining Walls",
    image: "/portfolio/engineered-retaining-wall-closeup.jpg",
  },
  {
    id: "5",
    title: "Paver Patio with Fire Pit & Retaining Wall",
    description:
      "Custom paver patio installation featuring a built-in fire pit and curved segmental retaining wall for slope retention.",
    category: "Hardscape",
    image: "/portfolio/paver-patio-firepit-retaining-wall.jpg",
  },
  {
    id: "6",
    title: "Tiered Retaining Wall — Hillside Stabilization",
    description:
      "Multi-tiered engineered retaining wall system with integrated paver steps on a steep residential hillside.",
    category: "Retaining Walls",
    image: "/portfolio/tiered-retaining-wall-hillside.jpg",
  },
  {
    id: "7",
    title: "Retaining Wall with Geogrid Reinforcement",
    description:
      "Retaining wall installation in progress showing geogrid reinforcement and proper excavation for structural stability.",
    category: "Retaining Walls",
    image: "/portfolio/retaining-wall-geogrid-installation.jpg",
  },
  {
    id: "8",
    title: "Residential Retaining Wall — Street View",
    description:
      "Large residential retaining wall with dark-faced block providing slope stabilization and driveway support.",
    category: "Retaining Walls",
    image: "/portfolio/residential-retaining-wall-streetview.jpg",
  },
  {
    id: "9",
    title: "Natural Stone Walkway",
    description:
      "Custom natural flagstone walkway with lush landscaping borders, creating an inviting garden path.",
    category: "Hardscape",
    image: "/portfolio/natural-stone-walkway.jpg",
  },
  {
    id: "10",
    title: "Paver Walkway with Landscape Edging",
    description:
      "Clean paver walkway installation along a commercial building with professional landscape plantings and edging.",
    category: "Hardscape",
    image: "/portfolio/paver-walkway-landscaping.jpg",
  },
  {
    id: "11",
    title: "Paver Patio with Steps & Seating Wall",
    description:
      "Multi-level paver patio with integrated block steps and seating wall, connecting to the home's deck and outdoor living space.",
    category: "Hardscape",
    image: "/portfolio/paver-patio-steps-seating-wall.jpg",
  },
  {
    id: "12",
    title: "Commercial Block Wall — Site Development",
    description:
      "Structural segmental block retaining wall for commercial new construction site development with drainage and gravel base.",
    category: "Retaining Walls",
    image: "/portfolio/commercial-block-wall-site-development.jpg",
  },
  {
    id: "13",
    title: "Custom Putting Green with Boulder Retaining Wall",
    description:
      "Residential putting green installation with natural boulder retaining wall and drainage system adjacent to pool area.",
    category: "Hardscape",
    image: "/portfolio/putting-green-boulder-retaining.jpg",
  },
  {
    id: "14",
    title: "Stone Retaining Wall with Fence Integration",
    description:
      "Decorative stone-faced retaining wall with capped top and integrated fence post supports for property boundary.",
    category: "Retaining Walls",
    image: "/portfolio/stone-retaining-wall-fence.jpg",
  },
  {
    id: "15",
    title: "Paver Pool Deck",
    description:
      "Large-format paver pool deck installation with natural boulder accents, drainage system, and poolside lounge area.",
    category: "Hardscape",
    image: "/portfolio/paver-pool-deck.jpg",
  },
  {
    id: "16",
    title: "Outdoor Kitchen & Paver Patio",
    description:
      "Custom outdoor kitchen with large-format paver patio, natural stone accents, and sports court access.",
    category: "Hardscape",
    image: "/portfolio/outdoor-kitchen-paver-patio.jpg",
  },
  {
    id: "17",
    title: "Paver Steps & Landscape Wall",
    description:
      "Custom paver steps with natural stone treads and segmental landscape wall with cap stones and integrated lighting.",
    category: "Hardscape",
    image: "/portfolio/paver-steps-landscape-wall.jpg",
  },
  {
    id: "18",
    title: "Brick Paver Patio with Planter Wall",
    description:
      "Herringbone-pattern brick paver patio with raised block planter walls and decorative landscaping in an enclosed courtyard.",
    category: "Hardscape",
    image: "/portfolio/brick-paver-patio-planter.jpg",
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

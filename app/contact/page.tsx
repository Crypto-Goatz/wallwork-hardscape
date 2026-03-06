import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EstimateWizard } from "@/components/site/EstimateWizard";
import { Phone, Mail, MapPin, Clock, Shield } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header siteName="Wall Works Hardscape" phone="(412) 235-8658" />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/portfolio/commercial-retaining-wall-driveway.jpg')] bg-cover bg-center opacity-10" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Free Estimate Request
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Tell us about your project and get a detailed, no-obligation estimate
              from our team of hardscape professionals.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Wizard */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6 sm:p-8 lg:p-10">
                  <EstimateWizard />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Contact */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Prefer to Talk?
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="tel:4122358658"
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-600 text-white group-hover:bg-red-700 transition-colors shadow-md shadow-red-600/20">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Call Us Now</p>
                        <p className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                          (412) 235-8658
                        </p>
                      </div>
                    </a>
                    <a
                      href="mailto:wallworkshardscape@gmail.com"
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                          Request by Email
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Why Wall Works?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 text-green-600 shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Licensed & Insured</p>
                        <p className="text-xs text-gray-500">Full liability coverage on every project</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Fast Response</p>
                        <p className="text-xs text-gray-500">Most estimates within 24-48 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Local to Pittsburgh</p>
                        <p className="text-xs text-gray-500">Serving Allegheny & Westmoreland County</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Areas */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Pittsburgh",
                      "Greensburg",
                      "Irwin",
                      "Monroeville",
                      "Murrysville",
                      "Latrobe",
                      "North Huntingdon",
                      "Jeannette",
                      "Delmont",
                      "Export",
                      "Penn Township",
                      "Manor",
                    ].map((area) => (
                      <span
                        key={area}
                        className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-md"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer
        siteName="Wall Works Hardscape"
        phone="(412) 235-8658"
        email="wallworkshardscape@gmail.com"
      />
    </>
  );
}

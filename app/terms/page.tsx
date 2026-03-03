import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteConfig } from "@/config/site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Wall Works Hardscape LLC",
  description: "Terms and conditions for Wall Works Hardscape LLC services.",
};

export default async function TermsPage() {
  const config = await getSiteConfig();

  return (
    <>
      <Header siteName={config.name} phone={config.phone} />
      <main className="bg-background min-h-screen">
        <section className="bg-black text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Legal</p>
            <h1 className="text-3xl font-bold">Terms &amp; Conditions</h1>
            <p className="text-white/60 text-sm mt-2">Last updated: March 1, 2026</p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing our website at wallworkshardscape.com or requesting our services, you agree to be bound by
              these Terms and Conditions. If you do not agree, please do not use our site or services. These terms apply to
              all visitors, leads, and customers of Wall Works Hardscape LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. Services</h2>
            <p>
              Wall Works Hardscape LLC provides hardscaping and landscaping services including, but not limited to,
              retaining walls, paver patios, concrete driveways, excavation, boulder walls, and outdoor kitchens.
              All work is performed by licensed and insured professionals in Allegheny County, PA, and surrounding areas.
            </p>
            <p className="mt-2">
              Free estimates are non-binding. Final pricing is subject to site conditions, material availability, and
              a signed written contract. We reserve the right to decline any project at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. Estimates &amp; Contracts</h2>
            <p>
              All estimates provided are valid for 30 days from the date of issue. Work will not commence without a signed
              contract and any required deposit as outlined in the contract. Prices may vary based on changes to scope of
              work, material costs, or unforeseen site conditions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Payment</h2>
            <p>
              Payment terms are specified in each project contract. Accepted payment methods include check, cash, and
              electronic bank transfer. Late payments may be subject to a fee of 1.5% per month on outstanding balances.
              Disputes regarding invoices must be submitted in writing within 10 days of receipt.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Warranties</h2>
            <p>
              Wall Works Hardscape LLC warrants all workmanship for a period of one (1) year from project completion.
              Manufacturer warranties on materials are passed through to the customer where applicable. Warranties do not
              cover damage caused by improper use, third-party modifications, acts of nature, or failure to follow
              maintenance recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Wall Works Hardscape LLC shall not be liable for any indirect,
              incidental, or consequential damages arising from use of our website or services. Our total liability
              shall not exceed the total amount paid by you for the specific service giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. Use of Website</h2>
            <p>
              You agree to use this website only for lawful purposes. You may not attempt to gain unauthorized access to
              any part of the site, transmit harmful code, or use the site in a way that could damage, disable, or impair
              our systems. We reserve the right to terminate access to the site for any user who violates these terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">8. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design, is the property of Wall Works
              Hardscape LLC and may not be reproduced or distributed without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">9. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the Commonwealth of Pennsylvania. Any disputes shall be
              resolved in the courts of Allegheny County, Pennsylvania.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">10. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Changes will be effective immediately upon posting
              to this page. Your continued use of the website constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">11. Contact</h2>
            <p>
              Questions about these Terms may be directed to:
            </p>
            <address className="not-italic mt-2 space-y-1">
              <p className="font-medium text-gray-900">Wall Works Hardscape LLC</p>
              <p>Pittsburgh, PA &amp; Surrounding Counties</p>
              <p>
                Phone:{" "}
                <a href={`tel:${config.phone.replace(/\D/g, "")}`} className="text-red-600 hover:underline">
                  {config.phone}
                </a>
              </p>
              {config.email && (
                <p>
                  Email:{" "}
                  <a href={`mailto:${config.email}`} className="text-red-600 hover:underline">
                    {config.email}
                  </a>
                </p>
              )}
            </address>
          </section>
        </article>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} />
    </>
  );
}

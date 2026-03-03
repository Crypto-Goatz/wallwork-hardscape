import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteConfig } from "@/config/site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Wall Works Hardscape LLC",
  description: "Privacy policy for Wall Works Hardscape LLC — how we collect and use your information.",
};

export default async function PrivacyPage() {
  const config = await getSiteConfig();

  return (
    <>
      <Header siteName={config.name} phone={config.phone} />
      <main className="bg-background min-h-screen">
        <section className="bg-black text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Legal</p>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-white/60 text-sm mt-2">Last updated: March 1, 2026</p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. Overview</h2>
            <p>
              Wall Works Hardscape LLC (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your personal information.
              This Privacy Policy explains what data we collect, how we use it, and your rights regarding your data
              when you use our website or request our services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Name, email address, phone number, and mailing address (via estimate request forms)</li>
              <li>Project details and descriptions you provide</li>
              <li>Communications you send us by email or phone</li>
            </ul>
            <p className="mt-3">We also collect limited technical data automatically, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Browser type, device, and operating system</li>
              <li>Pages visited and time spent on the site</li>
              <li>IP address and general location data</li>
              <li>Cookies and similar tracking technologies (see Section 6)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Prepare and deliver free project estimates</li>
              <li>Contact you regarding your inquiry or ongoing project</li>
              <li>Send confirmation emails after form submissions</li>
              <li>Improve our website and service offerings</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to fulfill the purpose for which it was collected,
              or as required by law. Estimate inquiries are typically retained for up to 3 years for business record
              purposes. You may request deletion of your data at any time (see Section 8).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Third-Party Services</h2>
            <p>We use select third-party services to operate our business and website, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Google Sheets / Drive</strong> — data storage and content management</li>
              <li><strong>Vercel</strong> — website hosting and performance</li>
            </ul>
            <p className="mt-3">
              Each of these services has their own privacy policies. We encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze
              site traffic. By continuing to use our site and accepting our cookie notice, you consent to the use of
              cookies. You can disable cookies in your browser settings, though some site features may not function as
              intended.
            </p>
            <p className="mt-2">
              We use only functional and analytics cookies. We do not use advertising or cross-site tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. Data Security</h2>
            <p>
              We implement reasonable technical and organizational measures to protect your personal information from
              unauthorized access, disclosure, or loss. However, no transmission over the internet is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us using the information below.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">9. Children&apos;s Privacy</h2>
            <p>
              Our website is not directed to children under the age of 13. We do not knowingly collect personal
              information from children. If you believe a child has submitted data to us, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
              date. Your continued use of the website after changes are posted constitutes acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">11. Contact</h2>
            <p>For privacy-related inquiries, please contact:</p>
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

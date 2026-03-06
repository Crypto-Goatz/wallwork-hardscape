"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Gift,
  Phone,
  ArrowRight,
  Sparkles,
  Shield,
  Calendar,
  FileText,
} from "lucide-react";

export default function HomeShowPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.phone.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/homeshow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="bg-red-600 text-white text-center py-2.5 px-4">
        <p className="text-sm font-bold tracking-wide">
          PITTSBURGH HOME &amp; GARDEN SHOW &mdash; March 7&ndash;15, 2026
        </p>
      </div>

      {/* Header */}
      <header className="bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Wall Works Hardscape" width={180} height={48} className="h-10 w-auto" />
          </Link>
          <a
            href="tel:4122358658"
            className="flex items-center gap-2 text-white font-semibold text-sm hover:text-red-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
            (412) 235-8658
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/textures/stone-blocks.jpg"
              alt=""
              fill
              className="object-cover opacity-15"
            />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left — Offer */}
              <div>
                <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Home Show Exclusive
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-2">
                  <span className="text-red-500">$500</span>
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Home Show Bonus
                </h2>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                  Get a <span className="text-white font-bold">$500 Visa Gift Card</span> with
                  any hardscape project over $7,500. Visit us at the Pittsburgh Home &amp; Garden Show!
                </p>

                {/* Offer Details */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/20 text-red-500 shrink-0 mt-0.5">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">$500 Visa Gift Card</p>
                      <p className="text-sm text-gray-400">On any project valued at $7,500 or more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/20 text-red-500 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Signed contract required</p>
                      <p className="text-sm text-gray-400">Contract must be signed within 30 days of the Home Show</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/20 text-red-500 shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">March 7&ndash;15, 2026</p>
                      <p className="text-sm text-gray-400">Pittsburgh Home &amp; Garden Show only</p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2">
                  {["Retaining Walls", "Patios", "Excavation", "Drainage", "Concrete", "Masonry"].map((s) => (
                    <span key={s} className="text-xs font-semibold bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — Form */}
              <div>
                {/* Countdown Timer */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-center">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Offer Expires In</p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<script src="https://widgets.leadconnectorhq.com/cdt/remoteEntry.js" timerId="69aa9f1df675b682ea559bde" position="center" altText="Countdown Timer" timerHrefLink="https://api.rocketclients.com/email-tracking/431e6f0aca9?contactId={{contact.id}}" data-v2="true"></script>`,
                    }}
                  />
                </div>

                {status === "success" ? (
                  <div className="bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-5">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      You&apos;re In, {form.firstName}!
                    </h3>
                    <p className="text-gray-400 mb-4">
                      We&apos;ll be in touch with details about claiming your $500 bonus.
                      Come see us at the Home Show!
                    </p>
                    <a
                      href="tel:4122358658"
                      className="inline-flex items-center gap-2 text-red-400 font-semibold hover:text-red-300"
                    >
                      <Phone className="w-4 h-4" />
                      (412) 235-8658
                    </a>
                  </div>
                ) : (
                  <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-1">Claim Your $500 Bonus</h3>
                      <p className="text-sm text-gray-400">Fill out the form and we&apos;ll reserve your offer.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={form.firstName}
                            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                            placeholder="Craig"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                            placeholder="Wall"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="(412) 555-1234"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                          Email
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          placeholder="you@email.com"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                        />
                      </div>

                      {status === "error" && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
                          <p className="text-sm text-red-400 font-medium">
                            Something went wrong. Please try again or call (412) 235-8658.
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-xl text-base font-bold hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all disabled:opacity-60 shadow-lg shadow-red-600/25"
                      >
                        {status === "loading" ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          <>
                            Claim My $500 Bonus
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-gray-600 leading-relaxed">
                        By submitting, you agree to be contacted about your project.
                        No spam, ever.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="border-t border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600/10 text-red-500 mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white mb-1">Licensed &amp; Insured</h3>
                <p className="text-sm text-gray-500">Full liability coverage on every project</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600/10 text-red-500 mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white mb-1">Itemized Estimates</h3>
                <p className="text-sm text-gray-500">No hidden costs — you see every detail</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600/10 text-red-500 mb-3">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white mb-1">$500 Bonus</h3>
                <p className="text-sm text-gray-500">Home Show exclusive — limited time only</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fine Print */}
        <section className="border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <p className="text-xs text-gray-600 leading-relaxed">
              Offer valid for projects over $7,500 with signed contract within 30 days of the
              Pittsburgh Home &amp; Garden Show (March 7&ndash;15, 2026). $500 Visa gift card
              issued upon project completion. Cannot be combined with other offers.
              Wall Works Hardscape LLC &bull; Pittsburgh, PA &bull; (412) 235-8658
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

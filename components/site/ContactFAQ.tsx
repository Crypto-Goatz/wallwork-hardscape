"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How much does a retaining wall cost?",
    a: "Retaining wall costs vary widely based on material, height, length, and site conditions. Block walls typically range from $25–$50/sqft, while natural stone and boulder walls can run $50–$100+/sqft. We provide detailed, itemized estimates so you know exactly what you're paying for.",
  },
  {
    q: "Do I need a permit for a retaining wall or patio?",
    a: "It depends on the size and location. In most Pennsylvania municipalities, walls over 4 feet tall require a permit. We're familiar with local permit requirements and can guide you through the process — or handle it on your behalf.",
  },
  {
    q: "How long does a typical project take?",
    a: "A standard residential retaining wall (40–60 ft) typically takes 3–5 days. Larger projects with excavation, drainage systems, or complex grading can take 1–3 weeks. We'll give you a realistic timeline during your estimate.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Pittsburgh and the surrounding counties including Allegheny, Westmoreland, Butler, Washington, and Beaver counties. Not sure if you're in our area? Give us a call — we travel for the right project.",
  },
  {
    q: "Do you handle the excavation too, or just the hardscape?",
    a: "We handle it all — from initial grading and excavation to final cleanup. Our crew does complete turnkey projects so you're never managing multiple contractors.",
  },
  {
    q: "What materials do you work with?",
    a: "We work with Allan Block, Versa-Lok, and other segmental retaining wall systems, natural boulders, tumbled concrete pavers, clay brick, flagstone, poured concrete, and more. We'll recommend the best fit for your budget and aesthetic.",
  },
  {
    q: "Is drainage included in a retaining wall installation?",
    a: "Proper drainage is critical to wall longevity — yes, we always include a drainage system (typically compacted gravel backfill and perforated drain tile) in every retaining wall project. Skipping drainage is how walls fail.",
  },
  {
    q: "How soon can we get started?",
    a: "Our schedule varies by season. Spring and summer book up fast — we typically book 4–8 weeks out during peak season. Submit your estimate request and we'll let you know our current availability.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[color:var(--color-border)] last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold text-[color:var(--color-foreground)] leading-snug">
          {q}
        </span>
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
            open
              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10"
              : "border-[color:var(--color-border)]"
          )}
        >
          {open ? (
            <Minus className="w-3 h-3 text-[color:var(--color-accent)]" strokeWidth={2} />
          ) : (
            <Plus className="w-3 h-3 text-[color:var(--color-muted-foreground)]" strokeWidth={2} />
          )}
        </div>
      </button>
      {open && (
        <p className="text-sm text-[color:var(--color-muted-foreground)] leading-relaxed pb-5 pr-8">
          {a}
        </p>
      )}
    </div>
  );
}

export function ContactFAQ() {
  return (
    <section className="py-16 bg-[color:var(--color-muted)]/30 border-t border-[color:var(--color-border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-[color:var(--color-accent)] font-semibold mb-2">
            Common Questions
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-foreground)] text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-[color:var(--color-muted-foreground)] mt-3 leading-relaxed">
            Everything you need to know before requesting your estimate.
          </p>
        </div>
        <div className="bg-[color:var(--color-background)] rounded-2xl border border-[color:var(--color-border)] shadow-sm px-6 md:px-8">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

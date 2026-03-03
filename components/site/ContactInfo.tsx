import { Phone, Mail, MapPin, Clock, Award, ShieldCheck, Hammer, Tag } from "lucide-react";

interface ContactInfoProps {
  phone: string;
  email: string;
}

const WHY_ITEMS = [
  { icon: Award, text: "20+ years of hardscape expertise in Western PA" },
  { icon: ShieldCheck, text: "Fully licensed, bonded & insured" },
  { icon: Hammer, text: "Built to last — we use premium materials only" },
  { icon: Tag, text: "Free, no-pressure estimates — always" },
];

export function ContactInfo({ phone, email }: ContactInfoProps) {
  return (
    <div className="space-y-6">
      {/* Contact card */}
      <div className="bg-[color:var(--color-primary)] rounded-2xl p-6 text-white">
        <h2 className="text-base font-bold mb-5 text-white">Get In Touch</h2>
        <div className="space-y-4">
          {phone && (
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[color:var(--color-accent)] transition-colors">
                <Phone className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wide">Call Us</p>
                <p className="font-semibold text-white group-hover:text-[color:var(--color-accent)] transition-colors text-sm">
                  {phone}
                </p>
              </div>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[color:var(--color-accent)] transition-colors">
                <Mail className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wide">Email</p>
                <p className="font-semibold text-white group-hover:text-[color:var(--color-accent)] transition-colors text-sm">
                  {email}
                </p>
              </div>
            </a>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">Service Area</p>
              <p className="font-semibold text-white text-sm">Pittsburgh, PA &amp; Surrounding Counties</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide">Hours</p>
              <p className="font-semibold text-white text-sm">Mon–Fri: 7am–6pm</p>
              <p className="text-white/60 text-xs">Sat: 8am–2pm &middot; Sun: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why choose us */}
      <div className="border border-[color:var(--color-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-[color:var(--color-foreground)]">
          Why Wallwork Hardscape?
        </h2>
        <div className="space-y-3">
          {WHY_ITEMS.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[color:var(--color-accent)]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-[color:var(--color-accent)]" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-[color:var(--color-muted-foreground)] leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Response time badge */}
      <div className="bg-[color:var(--color-accent)]/8 border border-[color:var(--color-accent)]/20 rounded-xl px-5 py-4 text-center">
        <p className="text-sm font-semibold text-[color:var(--color-accent)]">Typical Response Time</p>
        <p className="text-2xl font-bold text-[color:var(--color-foreground)] mt-0.5">
          Under 24 Hours
        </p>
        <p className="text-xs text-[color:var(--color-muted-foreground)] mt-1">
          We respond to every estimate request
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Wrench,
  FileText,
  Calendar,
  Send,
  BrickWall,
  Building2,
  Layers,
  Car,
  Shovel,
  Mountain,
  Flame,
  PenLine,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  { id: "residential_wall", label: "Residential Retaining Wall", icon: BrickWall },
  { id: "commercial_wall", label: "Commercial Retaining Wall", icon: Building2 },
  { id: "paver_patio", label: "Paver Patio / Outdoor Living", icon: Layers },
  { id: "concrete_driveway", label: "Concrete Driveway", icon: Car },
  { id: "excavation", label: "Excavation / Grading", icon: Shovel },
  { id: "boulder_wall", label: "Boulder Wall", icon: Mountain },
  { id: "outdoor_kitchen", label: "Outdoor Kitchen / Fireplace", icon: Flame },
  { id: "other", label: "Other", icon: PenLine },
];

const PROJECT_TYPE_LABELS: Record<string, string> = {
  residential_wall: "Residential Retaining Wall",
  commercial_wall: "Commercial Retaining Wall",
  paver_patio: "Paver Patio / Outdoor Living",
  concrete_driveway: "Concrete Driveway",
  excavation: "Excavation / Grading",
  boulder_wall: "Boulder Wall",
  outdoor_kitchen: "Outdoor Kitchen / Fireplace",
  other: "Other",
};

const TIMELINES = [
  { id: "asap", label: "ASAP", desc: "Ready to start immediately" },
  { id: "1_3_months", label: "1–3 Months", desc: "Planning for near future" },
  { id: "3_6_months", label: "3–6 Months", desc: "Mid-term planning" },
  { id: "planning", label: "Just Planning", desc: "Exploring my options" },
];

const PROJECT_STAGES = [
  { id: "ideas", label: "Ideas", desc: "Just starting to think about it" },
  { id: "budgeting", label: "Budgeting", desc: "Need a number to work with" },
  { id: "ready", label: "Ready to Schedule", desc: "Ready to move forward" },
  { id: "plans", label: "Have Plans", desc: "I have drawings or permits" },
];

const STEPS = [
  { title: "Your Info", icon: User },
  { title: "Project Type", icon: Wrench },
  { title: "Description", icon: FileText },
  { title: "Timeline", icon: Calendar },
];

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  "1_3_months": "1–3 Months",
  "3_6_months": "3–6 Months",
  planning: "Just Planning",
};

const STAGE_LABELS: Record<string, string> = {
  ideas: "Ideas / Early Thinking",
  budgeting: "Budgeting",
  ready: "Ready to Schedule",
  plans: "Have Plans / Drawings",
};

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  projectTypes: string[];
  otherDescription: string;
  description: string;
  timeline: string;
  projectStage: string;
}

const EMPTY: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  projectTypes: [],
  otherDescription: "",
  description: "",
  timeline: "",
  projectStage: "",
};

function buildPrefilledDescription(projectTypes: string[], otherDescription: string): string {
  const labels = projectTypes.map((t) =>
    t === "other" && otherDescription ? otherDescription : PROJECT_TYPE_LABELS[t] || t
  );
  if (labels.length === 0) return "";
  if (labels.length === 1) {
    return `I'm looking to get an estimate for a ${labels[0]} project. `;
  }
  const last = labels[labels.length - 1];
  const rest = labels.slice(0, -1).join(", ");
  return `I'm looking to get an estimate for ${rest} and ${last}. `;
}

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-background)] text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent transition text-sm";

export function EstimateForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [descriptionPrefilled, setDescriptionPrefilled] = useState(false);

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  function toggleProjectType(id: string) {
    setData((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(id)
        ? prev.projectTypes.filter((t) => t !== id)
        : [...prev.projectTypes, id],
    }));
  }

  function canAdvance() {
    if (step === 0) return data.firstName.trim() && data.phone.trim() && data.email.trim();
    if (step === 1) return data.projectTypes.length > 0;
    if (step === 2) return data.description.trim().length > 0;
    if (step === 3) return data.timeline && data.projectStage;
    return true;
  }

  function handleNext() {
    // When advancing from step 1 -> 2, pre-fill description
    if (step === 1 && !descriptionPrefilled) {
      const prefill = buildPrefilledDescription(data.projectTypes, data.otherDescription);
      setData((prev) => ({ ...prev, description: prefill }));
      setDescriptionPrefilled(true);
    }
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please call us directly.");
    }
  }

  // --- Success screen ---
  if (status === "success") {
    const projectLabels = data.projectTypes
      .map((t) =>
        t === "other" && data.otherDescription
          ? data.otherDescription
          : PROJECT_TYPE_LABELS[t] || t
      )
      .join(", ");

    return (
      <div className="py-10 px-2">
        {/* Check icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[color:var(--color-accent)]/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[color:var(--color-accent)]" strokeWidth={1.5} />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-[color:var(--color-foreground)] mb-3 text-center">
          Thank you, {data.firstName}!
        </h3>
        <p className="text-[color:var(--color-muted-foreground)] text-sm leading-relaxed text-center max-w-md mx-auto mb-8">
          We've received your estimate request and a confirmation email is on its way to{" "}
          <strong className="text-[color:var(--color-foreground)]">{data.email}</strong>. Our team
          will reach out within 1 business day.
        </p>

        {/* Summary card */}
        <div className="border border-[color:var(--color-border)] rounded-xl overflow-hidden mb-6">
          <div className="bg-[color:var(--color-primary)] px-5 py-3">
            <p className="text-xs font-semibold text-white uppercase tracking-widest">
              Your Estimate Summary
            </p>
          </div>
          <div className="divide-y divide-[color:var(--color-border)]">
            <div className="flex items-start gap-3 px-5 py-4">
              <User className="w-4 h-4 text-[color:var(--color-accent)] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-[color:var(--color-muted-foreground)] uppercase tracking-wide mb-0.5">
                  Contact
                </p>
                <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                  {data.firstName} {data.lastName}
                </p>
                <p className="text-xs text-[color:var(--color-muted-foreground)]">{data.phone} &middot; {data.email}</p>
              </div>
            </div>
            {data.address && (
              <div className="flex items-start gap-3 px-5 py-4">
                <MapPin className="w-4 h-4 text-[color:var(--color-accent)] mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-[color:var(--color-muted-foreground)] uppercase tracking-wide mb-0.5">
                    Property
                  </p>
                  <p className="text-sm font-semibold text-[color:var(--color-foreground)]">{data.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 px-5 py-4">
              <Wrench className="w-4 h-4 text-[color:var(--color-accent)] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-[color:var(--color-muted-foreground)] uppercase tracking-wide mb-0.5">
                  Project Type
                </p>
                <p className="text-sm font-semibold text-[color:var(--color-foreground)]">{projectLabels}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-5 py-4">
              <Clock className="w-4 h-4 text-[color:var(--color-accent)] mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-[color:var(--color-muted-foreground)] uppercase tracking-wide mb-0.5">
                  Timeline &amp; Stage
                </p>
                <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                  {TIMELINE_LABELS[data.timeline]} &middot; {STAGE_LABELS[data.projectStage]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call CTA */}
        <div className="bg-[color:var(--color-muted)] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
              Need to reach us sooner?
            </p>
            <p className="text-xs text-[color:var(--color-muted-foreground)] mt-0.5">
              We're available Mon–Fri 7am–6pm
            </p>
          </div>
          <a
            href="tel:4122358658"
            className="flex items-center gap-2 bg-[color:var(--color-accent)] text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition shrink-0"
          >
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            Call Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Step progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
                    isDone
                      ? "bg-[color:var(--color-accent)] border-[color:var(--color-accent)]"
                      : isActive
                      ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-muted)]"
                  )}
                >
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-white" strokeWidth={2} />
                  ) : (
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        isActive
                          ? "text-[color:var(--color-accent)]"
                          : "text-[color:var(--color-muted-foreground)]"
                      )}
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    isActive
                      ? "text-[color:var(--color-accent)]"
                      : isDone
                      ? "text-[color:var(--color-foreground)]"
                      : "text-[color:var(--color-muted-foreground)]"
                  )}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1.5 bg-[color:var(--color-muted)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[color:var(--color-accent)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[color:var(--color-muted-foreground)] mt-2">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      {/* Step content */}
      <div className="min-h-[340px]">

        {/* Step 0: Contact Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-[color:var(--color-foreground)] mb-1">
                Let's start with your info
              </h3>
              <p className="text-sm text-[color:var(--color-muted-foreground)]">
                We'll use this to contact you about your free estimate.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1.5">
                  First Name <span className="text-[color:var(--color-accent)]">*</span>
                </label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) => setData({ ...data, firstName: e.target.value })}
                  placeholder="John"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) => setData({ ...data, lastName: e.target.value })}
                  placeholder="Smith"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1.5">
                  Phone <span className="text-[color:var(--color-accent)]">*</span>
                </label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="(412) 235-8658"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1.5">
                  Email <span className="text-[color:var(--color-accent)]">*</span>
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="john@example.com"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1.5">
                Property Address
              </label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="123 Main St, Pittsburgh, PA"
                className={inputCls}
              />
            </div>
          </div>
        )}

        {/* Step 1: Project Type — personalized with first name */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-[color:var(--color-foreground)] mb-1">
                Great to meet you,{" "}
                <span className="text-[color:var(--color-accent)]">{data.firstName}</span>! What
                type of project?
              </h3>
              <p className="text-sm text-[color:var(--color-muted-foreground)]">
                Select all that apply — we handle multiple scopes.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map((pt) => {
                const selected = data.projectTypes.includes(pt.id);
                const Icon = pt.icon;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => toggleProjectType(pt.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all",
                      selected
                        ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/8 text-[color:var(--color-foreground)]"
                        : "border-[color:var(--color-border)] bg-[color:var(--color-background)] hover:border-[color:var(--color-accent)]/40 text-[color:var(--color-foreground)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        selected
                          ? "text-[color:var(--color-accent)]"
                          : "text-[color:var(--color-muted-foreground)]"
                      )}
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-medium leading-tight">{pt.label}</span>
                    {selected && (
                      <CheckCircle
                        className="w-4 h-4 text-[color:var(--color-accent)] ml-auto shrink-0"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {data.projectTypes.includes("other") && (
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1.5">
                  Please describe "Other"
                </label>
                <input
                  type="text"
                  value={data.otherDescription}
                  onChange={(e) => setData({ ...data, otherDescription: e.target.value })}
                  placeholder="e.g. Drainage, steps, walkway..."
                  className={inputCls}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Description — personalized with name + pre-written sentence */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-[color:var(--color-foreground)] mb-1">
                Tell us more,{" "}
                <span className="text-[color:var(--color-accent)]">{data.firstName}</span>
              </h3>
              <p className="text-sm text-[color:var(--color-muted-foreground)]">
                We've started a description based on your selections — feel free to edit and add any
                details.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[color:var(--color-foreground)] mb-1.5">
                Project Description <span className="text-[color:var(--color-accent)]">*</span>
              </label>
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={7}
                placeholder="Describe your project..."
                className={cn(inputCls, "resize-none leading-relaxed")}
              />
              <p className="text-xs text-[color:var(--color-muted-foreground)] mt-1.5">
                Tip: Mention approximate dimensions, existing conditions, and any access challenges.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Timeline & Stage — personalized */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[color:var(--color-foreground)] mb-1">
                Almost done,{" "}
                <span className="text-[color:var(--color-accent)]">{data.firstName}</span>!
              </h3>
              <p className="text-sm text-[color:var(--color-muted-foreground)]">
                Help us understand your schedule so we can prioritize your estimate.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[color:var(--color-foreground)] mb-3">
                Desired Timeline
              </p>
              <div className="grid grid-cols-2 gap-3">
                {TIMELINES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setData({ ...data, timeline: t.id })}
                    className={cn(
                      "flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all",
                      data.timeline === t.id
                        ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/8"
                        : "border-[color:var(--color-border)] bg-[color:var(--color-background)] hover:border-[color:var(--color-accent)]/40"
                    )}
                  >
                    <span className="text-sm font-bold text-[color:var(--color-foreground)]">
                      {t.label}
                    </span>
                    <span className="text-xs text-[color:var(--color-muted-foreground)] mt-0.5">
                      {t.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[color:var(--color-foreground)] mb-3">
                Project Stage
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PROJECT_STAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setData({ ...data, projectStage: s.id })}
                    className={cn(
                      "flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all",
                      data.projectStage === s.id
                        ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/8"
                        : "border-[color:var(--color-border)] bg-[color:var(--color-background)] hover:border-[color:var(--color-accent)]/40"
                    )}
                  >
                    <span className="text-sm font-bold text-[color:var(--color-foreground)]">
                      {s.label}
                    </span>
                    <span className="text-xs text-[color:var(--color-muted-foreground)] mt-0.5">
                      {s.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-[color:var(--color-border)]">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            step === 0
              ? "opacity-0 pointer-events-none"
              : "text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted)]"
          )}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          Back
        </button>

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance()}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              canAdvance()
                ? "bg-[color:var(--color-accent)] text-white hover:opacity-90"
                : "bg-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)] cursor-not-allowed"
            )}
          >
            Continue
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canAdvance() || status === "loading"}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              canAdvance()
                ? "bg-[color:var(--color-accent)] text-white hover:opacity-90"
                : "bg-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)] cursor-not-allowed"
            )}
          >
            {status === "loading" ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={1.5} />
                Submit Request
              </>
            )}
          </button>
        )}
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm mt-3 text-center">{errorMsg}</p>
      )}
    </div>
  );
}

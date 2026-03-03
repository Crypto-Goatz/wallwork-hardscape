"use client";

import { useState } from "react";
import { CheckCircle, ChevronRight, ChevronLeft, User, Wrench, FileText, Calendar, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  { id: "residential_wall", label: "Residential Retaining Wall", icon: "🧱" },
  { id: "commercial_wall", label: "Commercial Retaining Wall", icon: "🏗️" },
  { id: "paver_patio", label: "Paver Patio / Outdoor Living", icon: "🪨" },
  { id: "concrete_driveway", label: "Concrete Driveway", icon: "🚗" },
  { id: "excavation", label: "Excavation / Grading", icon: "🚜" },
  { id: "boulder_wall", label: "Boulder Wall", icon: "⛰️" },
  { id: "outdoor_kitchen", label: "Outdoor Kitchen / Fireplace", icon: "🔥" },
  { id: "other", label: "Other", icon: "✏️" },
];

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

export function EstimateForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
    if (step === 0) return data.firstName && data.phone && data.email;
    if (step === 1) return data.projectTypes.length > 0;
    if (step === 2) return data.description.trim().length > 0;
    if (step === 3) return data.timeline && data.projectStage;
    return true;
  }

  async function handleSubmit() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact_submission",
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          message: `Project Types: ${data.projectTypes.join(", ")}${data.otherDescription ? ` (${data.otherDescription})` : ""}. Description: ${data.description}. Timeline: ${data.timeline}. Stage: ${data.projectStage}.`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please call us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-[color:var(--color-accent)]/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[color:var(--color-accent)]" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Request Received!</h3>
        <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Thanks, {data.firstName}! We'll review your project details and reach out within 1 business day to schedule your free estimate.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress bar */}
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
                      : "border-muted-foreground/30 bg-muted"
                  )}
                >
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        isActive ? "text-[color:var(--color-accent)]" : "text-muted-foreground/50"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    isActive ? "text-[color:var(--color-accent)]" : "text-muted-foreground/60"
                  )}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-[color:var(--color-accent)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Step {step + 1} of {totalSteps}</p>
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        {/* Step 0: Contact Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Let's start with your info</h3>
              <p className="text-sm text-muted-foreground">We'll use this to contact you about your free estimate.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">First Name *</label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) => setData({ ...data, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) => setData({ ...data, lastName: e.target.value })}
                  placeholder="Smith"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="(412) 555-0199"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Property Address</label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="123 Main St, Pittsburgh, PA"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent transition"
              />
            </div>
          </div>
        )}

        {/* Step 1: Project Type */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">What type of project?</h3>
              <p className="text-sm text-muted-foreground">Select all that apply — we can handle multiple scopes.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map((pt) => {
                const selected = data.projectTypes.includes(pt.id);
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => toggleProjectType(pt.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all",
                      selected
                        ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/8 text-foreground"
                        : "border-border bg-background hover:border-[color:var(--color-accent)]/40 text-foreground"
                    )}
                  >
                    <span className="text-xl">{pt.icon}</span>
                    <span className="text-sm font-medium leading-tight">{pt.label}</span>
                    {selected && (
                      <CheckCircle className="w-4 h-4 text-[color:var(--color-accent)] ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            {data.projectTypes.includes("other") && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Please describe "Other"</label>
                <input
                  type="text"
                  value={data.otherDescription}
                  onChange={(e) => setData({ ...data, otherDescription: e.target.value })}
                  placeholder="e.g. Drainage, steps, walkway..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent transition"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Describe your project</h3>
              <p className="text-sm text-muted-foreground">The more detail, the better we can prepare for your estimate.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Project Description *</label>
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={6}
                placeholder="e.g. We have a hillside that needs a retaining wall about 40 ft long and 4 ft tall. There's an existing wood wall that needs to be removed first..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)] focus:border-transparent transition resize-none leading-relaxed"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Tip: Mention approximate dimensions, existing conditions, and any access challenges.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Timeline & Stage */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Timing & readiness</h3>
              <p className="text-sm text-muted-foreground">Help us understand your schedule so we can prioritize your estimate.</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Desired Timeline</p>
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
                        : "border-border bg-background hover:border-[color:var(--color-accent)]/40"
                    )}
                  >
                    <span className="text-sm font-bold text-foreground">{t.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Project Stage</p>
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
                        : "border-border bg-background hover:border-[color:var(--color-accent)]/40"
                    )}
                  >
                    <span className="text-sm font-bold text-foreground">{s.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            step === 0
              ? "opacity-0 pointer-events-none"
              : "text-foreground hover:bg-muted"
          )}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              canAdvance()
                ? "bg-[color:var(--color-accent)] text-white hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Continue <ChevronRight className="w-4 h-4" />
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
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {status === "loading" ? "Submitting..." : (
              <><Send className="w-4 h-4" /> Submit Request</>
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

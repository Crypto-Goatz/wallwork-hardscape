"use client";

import { useState, useRef } from "react";
import {
  User,
  Phone,
  MapPin,
  Mail,
  ArrowRight,
  ArrowLeft,
  Layers,
  Building2,
  Hammer,
  Truck,
  Mountain,
  Flame,
  HardHat,
  CircleDot,
  CheckCircle,
  Clock,
  Lightbulb,
  DollarSign,
  CalendarCheck,
  FileText,
  Send,
  Sparkles,
} from "lucide-react";

const PROJECT_TYPES = [
  { id: "residential-retaining", label: "Residential Retaining Wall", icon: Layers },
  { id: "commercial-retaining", label: "Commercial Retaining Wall", icon: Building2 },
  { id: "paver-patio", label: "Paver Patio / Outdoor Living", icon: Hammer },
  { id: "concrete-driveway", label: "Concrete Driveway", icon: Truck },
  { id: "excavation-grading", label: "Excavation / Grading", icon: Mountain },
  { id: "boulder-wall", label: "Boulder Wall", icon: CircleDot },
  { id: "outdoor-kitchen", label: "Outdoor Kitchen / Fireplace", icon: Flame },
  { id: "other", label: "Other", icon: HardHat },
];

const TIMELINES = [
  { id: "asap", label: "ASAP", icon: Sparkles },
  { id: "1-3-months", label: "1-3 Months", icon: Clock },
  { id: "3-6-months", label: "3-6 Months", icon: Clock },
  { id: "planning", label: "Just Planning", icon: Lightbulb },
];

const STAGES = [
  { id: "ideas", label: "Ideas", icon: Lightbulb },
  { id: "budgeting", label: "Budgeting", icon: DollarSign },
  { id: "ready", label: "Ready to Schedule", icon: CalendarCheck },
  { id: "plans", label: "Have Plans", icon: FileText },
];

interface FormData {
  name: string;
  phone: string;
  address: string;
  email: string;
  projectTypes: string[];
  otherType: string;
  description: string;
  timeline: string;
  stage: string;
}

export function EstimateWizard() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    email: "",
    projectTypes: [],
    otherType: "",
    description: "",
    timeline: "",
    stage: "",
  });

  const totalSteps = 4;

  function update(field: keyof FormData, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleProjectType(id: string) {
    setForm((prev) => {
      const types = prev.projectTypes.includes(id)
        ? prev.projectTypes.filter((t) => t !== id)
        : [...prev.projectTypes, id];
      return { ...prev, projectTypes: types };
    });
  }

  function next() {
    setDirection("forward");
    setStep((s) => Math.min(s + 1, totalSteps - 1));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function back() {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 0));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function canAdvance(): boolean {
    if (step === 0) return form.name.trim().length > 0 && form.phone.trim().length > 0;
    if (step === 1) return form.projectTypes.length > 0;
    if (step === 2) return true;
    return true;
  }

  async function handleSubmit() {
    setStatus("loading");
    try {
      const projectLabels = form.projectTypes.map(
        (id) => PROJECT_TYPES.find((p) => p.id === id)?.label || id
      );
      const timelineLabel = TIMELINES.find((t) => t.id === form.timeline)?.label || form.timeline;
      const stageLabel = STAGES.find((s) => s.id === form.stage)?.label || form.stage;

      const nameParts = form.name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const message = [
        `Project Types: ${projectLabels.join(", ")}`,
        form.otherType ? `Other Details: ${form.otherType}` : "",
        form.description ? `Description: ${form.description}` : "",
        form.address ? `Address: ${form.address}` : "",
        form.timeline ? `Timeline: ${timelineLabel}` : "",
        form.stage ? `Stage: ${stageLabel}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact_submission",
          firstName,
          lastName,
          email: form.email,
          phone: form.phone,
          message,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
      setDirection("forward");
      setStep(totalSteps);
    } catch {
      setStatus("error");
    }
  }

  const progressPercent = status === "success" ? 100 : ((step + 1) / totalSteps) * 100;

  if (status === "success") {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 rounded-2xl" />
        <div className="relative text-center py-16 px-6 animate-fade-in">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping-slow" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            Estimate Request Received!
          </h3>
          <p className="text-lg text-gray-600 mb-2 max-w-md mx-auto">
            Thank you, <span className="font-semibold text-gray-900">{form.name.split(" ")[0]}</span>.
            We&apos;ll review your project details and get back to you within 24 hours.
          </p>
          <p className="text-sm text-gray-500">
            For immediate assistance, call{" "}
            <a href="tel:4122358658" className="text-red-600 font-semibold hover:text-red-700">
              (412) 235-8658
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {["Your Info", "Project Type", "Details", "Review"].map((label, i) => (
            <button
              key={label}
              onClick={() => {
                if (i < step) {
                  setDirection("back");
                  setStep(i);
                }
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                i === step
                  ? "text-red-600"
                  : i < step
                  ? "text-gray-900 cursor-pointer hover:text-red-600"
                  : "text-gray-400"
              }`}
            >
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 transition-all duration-300 ${
                  i === step
                    ? "border-red-600 bg-red-600 text-white scale-110"
                    : i < step
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {i < step ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div
        key={step}
        className={`${direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"}`}
      >
        {/* Step 1: Contact Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Let&apos;s start with your info</h2>
              <p className="text-gray-500 mt-1">Tell us who you are and we&apos;ll take it from there.</p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <User className="w-4 h-4 text-red-500" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Craig Wall"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-base"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <Phone className="w-4 h-4 text-red-500" />
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(412) 555-1234"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-base"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                Project Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="123 Main St, Pittsburgh, PA"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-base"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                <Mail className="w-4 h-4 text-red-500" />
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-base"
              />
            </div>
          </div>
        )}

        {/* Step 2: Project Type */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">What type of project?</h2>
              <p className="text-gray-500 mt-1">Select all that apply — most projects involve multiple services.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map(({ id, label, icon: Icon }) => {
                const selected = form.projectTypes.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleProjectType(id)}
                    className={`group relative flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-left transition-all duration-200 ${
                      selected
                        ? "border-red-500 bg-red-50 shadow-md shadow-red-500/10"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                        selected
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        selected ? "text-red-700" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </span>
                    {selected && (
                      <CheckCircle className="w-5 h-5 text-red-600 absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {form.projectTypes.includes("other") && (
              <div className="mt-4 animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Describe your project type
                </label>
                <input
                  type="text"
                  value={form.otherType}
                  onChange={(e) => update("otherType", e.target.value)}
                  placeholder="e.g. Gabion basket wall, natural stone steps..."
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-base"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tell us more</h2>
              <p className="text-gray-500 mt-1">The more detail you share, the more accurate our estimate.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description of Work
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                placeholder="Tell us about your project — dimensions, site conditions, what you're looking to achieve..."
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-base resize-y min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Desired Timeline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TIMELINES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => update("timeline", form.timeline === id ? "" : id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 transition-all duration-200 ${
                      form.timeline === id
                        ? "border-red-500 bg-red-50 shadow-md shadow-red-500/10"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        form.timeline === id ? "text-red-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        form.timeline === id ? "text-red-700" : "text-gray-600"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Project Stage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STAGES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => update("stage", form.stage === id ? "" : id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 transition-all duration-200 ${
                      form.stage === id
                        ? "border-red-500 bg-red-50 shadow-md shadow-red-500/10"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        form.stage === id ? "text-red-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        form.stage === id ? "text-red-700" : "text-gray-600"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
              <p className="text-gray-500 mt-1">Double-check your details, then hit submit for your free estimate.</p>
            </div>

            <div className="space-y-4">
              {/* Contact Summary */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Contact Info</h3>
                  <button
                    onClick={() => { setDirection("back"); setStep(0); }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>{" "}
                    <span className="font-medium text-gray-900">{form.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>{" "}
                    <span className="font-medium text-gray-900">{form.phone}</span>
                  </div>
                  {form.address && (
                    <div>
                      <span className="text-gray-500">Address:</span>{" "}
                      <span className="font-medium text-gray-900">{form.address}</span>
                    </div>
                  )}
                  {form.email && (
                    <div>
                      <span className="text-gray-500">Email:</span>{" "}
                      <span className="font-medium text-gray-900">{form.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Summary */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Project</h3>
                  <button
                    onClick={() => { setDirection("back"); setStep(1); }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.projectTypes.map((id) => {
                    const pt = PROJECT_TYPES.find((p) => p.id === id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 text-sm font-medium bg-red-100 text-red-700 px-3 py-1.5 rounded-lg"
                      >
                        {pt?.label || id}
                      </span>
                    );
                  })}
                </div>
                {form.otherType && (
                  <p className="text-sm text-gray-600 mt-2">Other: {form.otherType}</p>
                )}
              </div>

              {/* Details Summary */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Details</h3>
                  <button
                    onClick={() => { setDirection("back"); setStep(2); }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  {form.description && (
                    <p className="text-gray-700">{form.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4">
                    {form.timeline && (
                      <div>
                        <span className="text-gray-500">Timeline:</span>{" "}
                        <span className="font-medium text-gray-900">
                          {TIMELINES.find((t) => t.id === form.timeline)?.label}
                        </span>
                      </div>
                    )}
                    {form.stage && (
                      <div>
                        <span className="text-gray-500">Stage:</span>{" "}
                        <span className="font-medium text-gray-900">
                          {STAGES.find((s) => s.id === form.stage)?.label}
                        </span>
                      </div>
                    )}
                  </div>
                  {!form.description && !form.timeline && !form.stage && (
                    <p className="text-gray-400 italic">No additional details provided</p>
                  )}
                </div>
              </div>
            </div>

            {status === "error" && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 font-medium">
                  Something went wrong. Please try again or call us at{" "}
                  <a href="tel:4122358658" className="underline font-bold">(412) 235-8658</a>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        {step > 0 ? (
          <button
            onClick={back}
            className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps - 1 ? (
          <button
            onClick={next}
            disabled={!canAdvance()}
            className="flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/20 hover:shadow-red-600/30"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all disabled:opacity-60 shadow-lg shadow-red-600/20 hover:shadow-red-600/30"
          >
            {status === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Estimate Request
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

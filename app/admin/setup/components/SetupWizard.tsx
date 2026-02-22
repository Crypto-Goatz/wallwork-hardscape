"use client";

import { useState, useEffect, useCallback } from "react";
import { StepIndicator } from "./StepIndicator";
import { BusinessInfoStep, type BusinessInfo } from "./BusinessInfoStep";
import { BrandingStep, type BrandingData } from "./BrandingStep";
import { GoogleConnectStep } from "./GoogleConnectStep";
import { SiteImportStep } from "./SiteImportStep";
import { ContentGenerationStep } from "./ContentGenerationStep";
import { IntegrationsStep } from "./IntegrationsStep";
import { CompletionStep } from "./CompletionStep";

const STORAGE_KEY = "rocket-setup-wizard";

interface WizardState {
  currentStep: number;
  completedSteps: number[];
  businessInfo: Partial<BusinessInfo>;
  branding: Partial<BrandingData>;
  googleKey: string;
  spreadsheetId: string;
  spreadsheetUrl: string;
  driveFolderId: string;
  siteImported: boolean;
  geminiKey: string;
  contentGenerated: boolean;
  crmApiKey: string;
  cro9Key: string;
}

const INITIAL_STATE: WizardState = {
  currentStep: 1,
  completedSteps: [],
  businessInfo: {},
  branding: {},
  googleKey: "",
  spreadsheetId: "",
  spreadsheetUrl: "",
  driveFolderId: "",
  siteImported: false,
  geminiKey: "",
  contentGenerated: false,
  crmApiKey: "",
  cro9Key: "",
};

export function SetupWizard() {
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({ ...INITIAL_STATE, ...parsed });
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Persist state
  const persist = useCallback((next: WizardState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  function markComplete(step: number) {
    const completed = state.completedSteps.includes(step)
      ? state.completedSteps
      : [...state.completedSteps, step];
    return completed;
  }

  function goTo(step: number, updates: Partial<WizardState> = {}) {
    persist({ ...state, currentStep: step, ...updates });
  }

  async function handleFinish() {
    const info = state.businessInfo as BusinessInfo;

    // 1. Save config to Sheet
    await callApi("save-config", {
      googleKey: state.googleKey,
      spreadsheetId: state.spreadsheetId,
      config: {
        business_name: info.name,
        phone: info.phone,
        email: info.email,
        website: info.url,
        tagline: info.tagline,
        industry: info.industry,
        primary_color: state.branding.primary || "#2563eb",
        secondary_color: state.branding.secondary || "#1e40af",
        accent_color: state.branding.accent || "#f59e0b",
        crm_tracking_id: state.crmApiKey || "",
        cro9_key: state.cro9Key || "",
        setup_complete: "true",
      },
    });

    // 2. Set env vars on Vercel
    const envVars: Record<string, string> = {
      GOOGLE_SERVICE_ACCOUNT_KEY: state.googleKey,
      GOOGLE_SHEETS_ID: state.spreadsheetId,
      GOOGLE_DRIVE_FOLDER_ID: state.driveFolderId,
      NEXT_PUBLIC_SITE_NAME: info.name,
      NEXT_PUBLIC_SITE_PHONE: info.phone,
      NEXT_PUBLIC_SITE_EMAIL: info.email,
      NEXT_PUBLIC_SITE_URL: info.url || "",
      NEXT_PUBLIC_SITE_TAGLINE: info.tagline || "",
      NEXT_PUBLIC_COLOR_PRIMARY: state.branding.primary || "#2563eb",
      NEXT_PUBLIC_COLOR_SECONDARY: state.branding.secondary || "#1e40af",
      NEXT_PUBLIC_COLOR_ACCENT: state.branding.accent || "#f59e0b",
    };

    if (state.geminiKey) envVars.GEMINI_API_KEY = state.geminiKey;
    if (state.crmApiKey) envVars.NEXT_PUBLIC_CRM_TRACKING_ID = state.crmApiKey;
    if (state.cro9Key) envVars.NEXT_PUBLIC_CRO9_KEY = state.cro9Key;

    try {
      await callApi("save-env", { envVars });
    } catch {
      // Vercel API may not be configured — continue anyway
    }

    // 3. Trigger redeploy
    try {
      await callApi("trigger-redeploy", {});
    } catch {
      // Non-fatal — user can manually redeploy
    }

    // Clear wizard state
    localStorage.removeItem(STORAGE_KEY);
  }

  if (!loaded) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const completedSet = new Set(state.completedSteps);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Site Setup Wizard</h1>
        <p className="text-white/50 mt-1 text-sm">Configure your site in a few simple steps</p>
      </div>

      <StepIndicator currentStep={state.currentStep} completedSteps={completedSet} />

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8">
        {state.currentStep === 1 && (
          <BusinessInfoStep
            initial={state.businessInfo}
            onComplete={(data) =>
              goTo(2, {
                businessInfo: data,
                completedSteps: markComplete(1),
              })
            }
          />
        )}

        {state.currentStep === 2 && (
          <BrandingStep
            initial={state.branding}
            businessName={(state.businessInfo as BusinessInfo)?.name || ""}
            onComplete={(data) =>
              goTo(3, {
                branding: data,
                completedSteps: markComplete(2),
              })
            }
            onBack={() => goTo(1)}
          />
        )}

        {state.currentStep === 3 && (
          <GoogleConnectStep
            businessName={(state.businessInfo as BusinessInfo)?.name || "My Site"}
            onComplete={(data) =>
              goTo(4, {
                googleKey: data.googleKey,
                spreadsheetId: data.spreadsheetId,
                spreadsheetUrl: data.spreadsheetUrl,
                driveFolderId: data.driveFolderId,
                completedSteps: markComplete(3),
              })
            }
            onBack={() => goTo(2)}
          />
        )}

        {state.currentStep === 4 && (
          <SiteImportStep
            geminiKey={state.geminiKey}
            googleKey={state.googleKey}
            spreadsheetId={state.spreadsheetId}
            onComplete={(data) => {
              const updates: Partial<WizardState> = {
                siteImported: data.imported,
                completedSteps: markComplete(4),
              };

              // Auto-fill business info from import if we found it
              if (data.businessInfo) {
                const current = state.businessInfo as Partial<BusinessInfo>;
                updates.businessInfo = {
                  ...current,
                  name: current.name || data.businessInfo.name || current.name,
                  phone: current.phone || data.businessInfo.phone || current.phone,
                  email: current.email || data.businessInfo.email || current.email,
                  tagline: current.tagline || data.businessInfo.tagline || current.tagline,
                  industry: current.industry || data.businessInfo.industry || current.industry,
                };
              }

              goTo(5, updates);
            }}
            onBack={() => goTo(3)}
          />
        )}

        {state.currentStep === 5 && (
          <ContentGenerationStep
            businessInfo={state.businessInfo as BusinessInfo}
            googleKey={state.googleKey}
            spreadsheetId={state.spreadsheetId}
            onComplete={(data) =>
              goTo(6, {
                geminiKey: data.geminiKey,
                contentGenerated: data.generated,
                completedSteps: markComplete(5),
              })
            }
            onBack={() => goTo(4)}
          />
        )}

        {state.currentStep === 6 && (
          <IntegrationsStep
            onComplete={(data) =>
              goTo(7, {
                crmApiKey: data.crmApiKey,
                cro9Key: data.cro9Key,
                completedSteps: markComplete(6),
              })
            }
            onBack={() => goTo(5)}
          />
        )}

        {state.currentStep === 7 && (
          <CompletionStep
            spreadsheetUrl={state.spreadsheetUrl}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}

async function callApi(action: string, body: Record<string, unknown>) {
  const res = await fetch("/api/setup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...body }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

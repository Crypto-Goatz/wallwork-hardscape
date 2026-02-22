"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  TrendingUp,
  MousePointer,
  ScrollText,
  DoorOpen,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { BehavioralData } from "@/lib/cro9";

interface SXOPanelProps {
  behavioralData: BehavioralData | null;
}

export function SXOPanel({ behavioralData }: SXOPanelProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!behavioralData) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze this website behavioral data and provide specific, actionable SXO (Search Experience Optimization) recommendations:

Scroll Depth: ${JSON.stringify(behavioralData.scrollDepth)}
Rage Clicks: ${JSON.stringify(behavioralData.rageClicks)}
Dead Clicks: ${JSON.stringify(behavioralData.deadClicks)}
Exit Intent: ${JSON.stringify(behavioralData.exitIntent)}
Form Abandonment: ${JSON.stringify(behavioralData.formAbandonment)}

Provide 3-5 concrete recommendations with specific actions the site owner can take.`,
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setRecommendations(data.content);
    } catch {
      setRecommendations(
        "Unable to generate recommendations. Check your Gemini API key."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  if (!behavioralData) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
        <p className="font-medium">CRO9 data not available</p>
        <p className="text-sm mt-1">
          Connect CRO9 analytics in Settings to see behavioral insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <ScrollText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Avg Scroll Depth</p>
                <p className="text-2xl font-bold">
                  {behavioralData.scrollDepth[0]?.avgDepth
                    ? `${Math.round(behavioralData.scrollDepth[0].avgDepth)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <MousePointer className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Rage Clicks</p>
                <p className="text-2xl font-bold">
                  {behavioralData.rageClicks.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <MousePointer className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Dead Clicks</p>
                <p className="text-2xl font-bold">
                  {behavioralData.deadClicks.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <DoorOpen className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Form Abandonment</p>
                <p className="text-2xl font-bold">
                  {behavioralData.formAbandonment[0]?.rate
                    ? `${Math.round(behavioralData.formAbandonment[0].rate)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Recommendations</h3>
            <Button size="sm" onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recommendations ? (
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {recommendations}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Click &quot;Analyze with AI&quot; to get AI-powered optimization
              recommendations based on your CRO9 behavioral data.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Detailed Tables */}
      {behavioralData.rageClicks.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-red-600">
              Rage Click Hotspots
            </h3>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Element</th>
                  <th className="pb-2">Page</th>
                  <th className="pb-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {behavioralData.rageClicks.slice(0, 5).map((click, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">{click.selector}</td>
                    <td className="py-2">{click.page}</td>
                    <td className="py-2 font-medium">{click.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

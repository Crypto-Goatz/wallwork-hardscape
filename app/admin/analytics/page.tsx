import { getAnalyticsStats } from "@/lib/cro9";
import { AnalyticsEmbed } from "@/components/admin/AnalyticsEmbed";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default async function AnalyticsPage() {
  let stats = null;
  let error: string | null = null;

  try {
    stats = await getAnalyticsStats();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load analytics";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-600 mt-1">
          View your website performance metrics and visitor data.
        </p>
      </div>

      {error || !stats ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
            <CardHeader className="p-0">
              <CardTitle className="text-lg text-gray-600">
                Analytics Not Configured
              </CardTitle>
            </CardHeader>
            <p className="text-gray-500 mt-2 max-w-md">
              {error ??
                "CRO9 analytics integration is not set up yet. Configure your CRO9 API key in Settings to enable analytics tracking."}
            </p>
            <a
              href="/admin/settings"
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Go to Settings
            </a>
          </CardContent>
        </Card>
      ) : (
        <AnalyticsEmbed stats={stats} />
      )}
    </div>
  );
}

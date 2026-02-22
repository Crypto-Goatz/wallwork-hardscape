import { getBehavioralData } from "@/lib/cro9";
import { SXOPanel } from "@/components/admin/SXOPanel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default async function SXOPage() {
  let data = null;
  let error: string | null = null;

  try {
    data = await getBehavioralData();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load behavioral data";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Search Experience Optimization</h1>
        <p className="text-gray-600 mt-1">
          Behavioral data, heatmaps, and search experience insights powered by CRO9.
        </p>
      </div>

      {error || !data ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="h-12 w-12 text-gray-300 mb-4" />
            <CardHeader className="p-0">
              <CardTitle className="text-lg text-gray-600">
                SXO Data Not Available
              </CardTitle>
            </CardHeader>
            <p className="text-gray-500 mt-2 max-w-md">
              {error ??
                "CRO9 behavioral tracking is not configured yet. Set up your CRO9 integration in Settings to access heatmaps and behavioral analytics."}
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
        <SXOPanel behavioralData={data} />
      )}
    </div>
  );
}

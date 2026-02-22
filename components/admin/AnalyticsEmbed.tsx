"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, Eye, Timer, TrendingDown } from "lucide-react";
import type { AnalyticsStats } from "@/lib/cro9";

interface AnalyticsEmbedProps {
  stats: AnalyticsStats | null;
}

export function AnalyticsEmbed({ stats }: AnalyticsEmbedProps) {
  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="font-medium">Analytics not available</p>
        <p className="text-sm mt-1">
          Connect CRO9 in Settings to view analytics data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Visitors</p>
                <p className="text-2xl font-bold">
                  {stats.visitors.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Page Views</p>
                <p className="text-2xl font-bold">
                  {stats.pageviews.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Bounce Rate</p>
                <p className="text-2xl font-bold">
                  {stats.bounceRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Timer className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Avg Session</p>
                <p className="text-2xl font-bold">
                  {Math.floor(stats.avgSessionDuration / 60)}:
                  {String(Math.floor(stats.avgSessionDuration % 60)).padStart(2, "0")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Top Pages</h3>
        </CardHeader>
        <CardContent>
          {stats.topPages.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Page</th>
                  <th className="pb-2 text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPages.map((page, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs">{page.path}</td>
                    <td className="py-2 text-right font-medium">
                      {page.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">No page data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

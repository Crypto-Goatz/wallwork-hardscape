import { getIntegrationStatus, isSetupComplete } from "@/lib/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, FileText, Image, Bot, BarChart3, Settings, Activity, Blocks } from "lucide-react";

export default async function AdminDashboardPage() {
  if (!(await isSetupComplete())) redirect("/admin/setup");

  const status = getIntegrationStatus();

  const integrations = [
    { name: "Google Sheets", key: "googleSheets" as const, description: "Content management via Sheets" },
    { name: "Google Drive", key: "googleDrive" as const, description: "Media storage and management" },
    { name: "Gemini AI", key: "gemini" as const, description: "AI content generation" },
    { name: "CRO9 Analytics", key: "cro9" as const, description: "Analytics and behavior tracking" },
    { name: "CRM", key: "crm" as const, description: "Customer relationship management" },
  ];

  const quickLinks = [
    { href: "/admin/content", label: "Content Manager", icon: FileText, description: "Edit site content via Google Sheets" },
    { href: "/admin/media", label: "Media Library", icon: Image, description: "Upload and manage images" },
    { href: "/admin/ai", label: "AI Writer", icon: Bot, description: "Generate content with AI" },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, description: "View site performance" },
    { href: "/admin/apps", label: "Apps", icon: Blocks, description: "Create and manage custom tools" },
    { href: "/admin/sxo", label: "SXO Panel", icon: Activity, description: "Behavioral data and search experience" },
    { href: "/admin/settings", label: "Settings", icon: Settings, description: "Configure integrations" },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Manage your website content, media, analytics, and integrations all from one place.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Integration Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const connected = status[integration.key];
            return (
              <Card key={integration.key}>
                <CardContent className="flex items-center gap-3 p-4">
                  {connected ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                    <p className="text-xs mt-1">
                      {connected ? (
                        <span className="text-green-600">Connected</span>
                      ) : (
                        <span className="text-red-600">Not configured</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Icon className="h-8 w-8 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-medium">{link.label}</p>
                      <p className="text-sm text-gray-500">{link.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Inbox,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
  Circle,
  XCircle,
} from "lucide-react";

interface Lead {
  id: string;
  submitted_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  project_types: string;
  description: string;
  timeline: string;
  project_stage: string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", icon: Circle, color: "text-blue-600 bg-blue-50" },
  { value: "contacted", label: "Contacted", icon: CheckCircle2, color: "text-amber-600 bg-amber-50" },
  { value: "quoted", label: "Quoted", icon: CheckCircle2, color: "text-purple-600 bg-purple-50" },
  { value: "won", label: "Won", icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  { value: "lost", label: "Lost", icon: XCircle, color: "text-gray-500 bg-gray-50" },
];

function statusStyle(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
}

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const json = await res.json();
      const rows = (json.data ?? []) as Lead[];
      // Sort newest first, filter out empty rows
      setLeads(rows.filter((r) => r.first_name || r.email).reverse());
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateStatus = async (index: number, status: string, lead: Lead) => {
    setUpdatingId(lead.id);
    try {
      // Find the real index in the original (un-reversed) array
      const res = await fetch("/api/leads");
      const json = await res.json();
      const allLeads = (json.data ?? []).filter((r: Lead) => r.first_name || r.email);
      const realIndex = allLeads.findIndex((l: Lead) => l.id === lead.id);
      if (realIndex === -1) return;
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex: realIndex, status }),
      });
      await fetchLeads();
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const counts = STATUS_OPTIONS.reduce(
    (acc, s) => ({ ...acc, [s.value]: leads.filter((l) => l.status === s.value).length }),
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads & Contacts</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Estimate requests submitted through the website contact form.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} strokeWidth={1.5} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`p-3 rounded-xl border text-left transition-all ${
            filter === "all"
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <p className={`text-2xl font-bold ${filter === "all" ? "text-white" : "text-gray-900"}`}>
            {leads.length}
          </p>
          <p className={`text-xs mt-0.5 ${filter === "all" ? "text-gray-300" : "text-gray-500"}`}>
            All Leads
          </p>
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`p-3 rounded-xl border text-left transition-all ${
              filter === s.value
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <p className={`text-2xl font-bold ${filter === s.value ? "text-white" : "text-gray-900"}`}>
              {counts[s.value] ?? 0}
            </p>
            <p className={`text-xs mt-0.5 ${filter === s.value ? "text-gray-300" : "text-gray-500"}`}>
              {s.label}
            </p>
          </button>
        ))}
      </div>

      {/* Lead list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-500 text-sm">Loading leads...</span>
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="w-10 h-10 text-gray-300 mb-3" strokeWidth={1.5} />
            <p className="text-gray-500 font-medium">No leads found</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter !== "all"
                ? `No leads with status "${filter}" yet.`
                : "Leads from your estimate form will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead, i) => {
            const isExpanded = expandedId === lead.id;
            const st = statusStyle(lead.status || "new");
            return (
              <Card key={lead.id || i} className="overflow-hidden">
                {/* Summary row */}
                <CardContent className="p-0">
                  <button
                    className="w-full text-left p-4 sm:p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  >
                    {/* Status dot */}
                    <div className={`mt-0.5 shrink-0 w-2.5 h-2.5 rounded-full ${
                      lead.status === "new" ? "bg-blue-500" :
                      lead.status === "contacted" ? "bg-amber-500" :
                      lead.status === "quoted" ? "bg-purple-500" :
                      lead.status === "won" ? "bg-green-500" : "bg-gray-300"
                    }`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>
                            {st.label}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            {formatDate(lead.submitted_at)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 truncate">{lead.project_types || "—"}</p>
                      <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                        {lead.phone && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" strokeWidth={1.5} /> {lead.phone}
                          </span>
                        )}
                        {lead.email && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" strokeWidth={1.5} /> {lead.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" strokeWidth={1.5} />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" strokeWidth={1.5} />
                    )}
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Contact details */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Contact
                          </h3>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone.replace(/\D/g, "")}`}
                              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                            >
                              <Phone className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={1.5} />
                              {lead.phone}
                            </a>
                          )}
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                            >
                              <Mail className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={1.5} />
                              {lead.email}
                            </a>
                          )}
                          {lead.address && (
                            <p className="flex items-start gap-2 text-sm text-gray-700">
                              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                              {lead.address}
                            </p>
                          )}
                        </div>

                        {/* Project details */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Project
                          </h3>
                          <div className="space-y-1.5 text-sm text-gray-700">
                            <p><span className="text-gray-400">Type: </span>{lead.project_types || "—"}</p>
                            <p className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                              {lead.timeline || "—"}
                            </p>
                            <p><span className="text-gray-400">Stage: </span>{lead.project_stage || "—"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {lead.description && (
                        <div>
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Description
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-3 border border-gray-200">
                            {lead.description}
                          </p>
                        </div>
                      )}

                      {/* Status changer */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Update Status
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s.value}
                              disabled={lead.status === s.value || updatingId === lead.id}
                              onClick={() => updateStatus(i, s.value, lead)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                lead.status === s.value
                                  ? `${s.color} border-transparent cursor-default`
                                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                              } disabled:opacity-50`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="flex gap-3 pt-1">
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone.replace(/\D/g, "")}`}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Phone className="w-4 h-4" strokeWidth={1.5} />
                            Call Now
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <Mail className="w-4 h-4" strokeWidth={1.5} />
                            Send Email
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

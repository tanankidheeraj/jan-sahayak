"use client";

import React, { useState, useEffect } from "react";
import { api, AdminStatsData, AdminSummaryData } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import { MapComponent } from "../../components/MapComponent";

export default function AdminDashboardPage() {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [summary, setSummary] = useState<AdminSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [statsData, summaryData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminSummary(),
      ]);
      setStats(statsData);
      setSummary(summaryData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.updateGrievanceStatus(
        id,
        newStatus,
        `Status updated to '${newStatus}' by municipal administrative desk at ${new Date().toLocaleTimeString()}.`
      );
      await loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-surface font-body">
        <span className="material-symbols-outlined text-[36px] text-secondary-container animate-spin">
          progress_activity
        </span>
        <span className="text-sm font-bold text-on-surface-variant font-headline">
          Loading Official Command Dashboard...
        </span>
      </div>
    );
  }

  const categoryIcons: Record<string, string> = {
    roads: "pothole / PWD",
    water: "water_drop / Jal Board",
    electricity: "bolt / DISCOM",
    sanitation: "delete_sweep / MCD",
    health: "local_hospital / Health",
    other: "assignment / Civic Desk",
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-body pb-24">
      {/* SECTION 1: HEADER & OPERATIONAL OVERVIEW BAR (From Stitch 7_admin_dashboard.html) */}
      <header className="bg-primary-container text-on-primary py-4 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-lg text-white">
                  Jan Sahayak • Official Redressal Portal
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary-container">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-white/80">Command Center for Municipal Commissioners & Ward Engineers</p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadDashboard}
              className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Sync Live Data</span>
            </button>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
              <span>All 30 Wards Active</span>
            </div>
          </div>
        </div>
      </header>

      {stats && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* SECTION 2: TOP ROW - 4 STAT KPI CARDS (Exact Stitch 7_admin_dashboard layout) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Complaints */}
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Total Complaints
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">कुल दर्ज शिकायतें</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">inbox</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                  {stats.total_cases}
                </span>
                <span className="text-xs font-bold text-tertiary-container bg-tertiary-fixed/40 px-2 py-0.5 rounded-md">
                  +12% this week
                </span>
              </div>

              <div className="mt-3 pt-2 bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Database volume</span>
                <span className="font-bold text-on-surface">{stats.total_grievances} Grv + {stats.total_issue_reports} Defects</span>
              </div>
            </div>

            {/* Open / Pending Complaints */}
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                    Open / Pending
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">लंबित मामले (Action Req.)</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">pending_actions</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                  {stats.by_status["Open"] || 0}
                </span>
                <span className="text-xs font-bold text-error bg-error-container px-2 py-0.5 rounded-full">
                  High Urgency
                </span>
              </div>

              <div className="mt-3 pt-2 bg-secondary-fixed/20 rounded-xl p-2.5 flex items-center justify-between text-xs text-on-secondary-fixed font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                  <span>Triage SLA &lt; 24h</span>
                </span>
                <span className="font-bold">Pending Review</span>
              </div>
            </div>

            {/* In Progress */}
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-primary-container uppercase tracking-wider block">
                    In Progress
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">प्रक्रियाधीन मामले</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-container text-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">published_with_changes</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                  {stats.by_status["In Progress"] || 0}
                </span>
                <span className="text-xs font-semibold text-primary-container bg-surface-container px-2 py-0.5 rounded">
                  Field Squad Active
                </span>
              </div>

              <div className="mt-3 pt-2 bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between text-xs text-on-surface-variant">
                <span>Avg Resolution Time</span>
                <span className="font-bold text-primary-container">2.4 Days target</span>
              </div>
            </div>

            {/* Resolved Complaints */}
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-tertiary-container uppercase tracking-wider block">
                    Resolved & Closed
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">निस्तारित शिकायतें</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/40 text-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-headline font-bold text-3xl text-tertiary-container tracking-tight">
                  {stats.by_status["Resolved"] || 0}
                </span>
                <span className="text-xs font-bold text-tertiary-container bg-tertiary-fixed px-2 py-0.5 rounded-full">
                  {stats.resolution_rate_percent}% Speed
                </span>
              </div>

              <div className="mt-3 pt-2 bg-tertiary-fixed/20 rounded-xl p-2.5 flex items-center justify-between text-xs text-tertiary-container font-semibold">
                <span>Citizen Satisfaction</span>
                <span>94.2% Rating ⭐</span>
              </div>
            </div>
          </section>

          {/* SECTION: AI Weekly Redressal & Predictive Insights (Stitch Highlight Box) */}
          {summary && (
            <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary-container via-[#131b63] to-primary text-on-primary shadow-xl space-y-5 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-base text-white">
                      एआई साप्ताहिक विश्लेषण • AI Weekly Redressal & Predictive Insights
                    </h2>
                    <p className="text-xs text-secondary-fixed">
                      Automated Executive Intelligence Generated {summary.generated_at}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/15 text-white">
                  Gemini 1.5 Active
                </span>
              </div>

              <p className="text-sm leading-relaxed text-white/90 font-normal">
                {summary.executive_summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-secondary-container uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span>Emerging Civic Trends</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {summary.emerging_trends.map((tr, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-secondary-container font-bold">•</span>
                        <span>{tr}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-tertiary-fixed uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Actionable Recommendations</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {summary.key_recommendations.map((rc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-tertiary-fixed font-bold">✓</span>
                        <span>{rc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: Geospatial Hotspots & Field Dispatch Map */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-base text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-[20px]">pin_drop</span>
                  <span>Geographic Hotspots & Field Dispatch (लाइव घटना नक्शा)</span>
                </h3>
                <p className="text-xs text-outline">Real-time OpenStreetMap pins for all 38 citizen reports</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {stats.hotspots.slice(0, 3).map((h, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-[11px]">
                    📍 {h.location}: {h.total_complaints}
                  </span>
                ))}
              </div>
            </div>

            <MapComponent
              center={[22.5937, 78.9629]}
              zoom={5}
              grievances={stats.recent_grievances}
              issues={stats.recent_issues}
              height="400px"
            />
          </section>

          {/* SECTION: Active Citizen Complaints & Redressal Table (From Stitch 7_admin_dashboard) */}
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  सक्रिय नागरिक शिकायतें • Active Redressal Dossiers
                </h3>
                <p className="text-xs text-outline">Click buttons to change status in real-time</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-outline uppercase font-bold text-[11px]">
                    <th className="py-3 px-3">Tracking ID</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Citizen & Subject</th>
                    <th className="py-3 px-3">Urgency</th>
                    <th className="py-3 px-3">Current Status</th>
                    <th className="py-3 px-3 text-right">Official Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {stats.recent_grievances.map((g) => (
                    <tr key={g.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-primary">
                        {g.id}
                      </td>
                      <td className="py-3 px-3 capitalize font-semibold text-on-surface">
                        {g.category}
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-bold text-on-surface truncate">{g.title}</div>
                        <div className="text-[11px] text-outline">{g.city} • {g.citizen_name}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          g.urgency === "Critical" ? "bg-error-container text-on-error-container" :
                          g.urgency === "High" ? "bg-secondary-fixed text-on-secondary-fixed" :
                          "bg-surface-container text-on-surface"
                        }`}>
                          {g.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          g.status === "Resolved" ? "bg-tertiary-fixed text-tertiary-container" :
                          g.status === "In Progress" ? "bg-surface-container text-primary-container" :
                          "bg-error-container text-on-error-container"
                        }`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex gap-1">
                          {["Open", "In Progress", "Resolved"].map((s) => (
                            <button
                              key={s}
                              disabled={updatingId === g.id || g.status === s}
                              onClick={() => handleUpdateStatus(g.id, s)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                g.status === s
                                  ? "bg-primary-container text-white cursor-default"
                                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

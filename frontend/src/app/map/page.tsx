"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { api, GrievanceData, IssueReportData } from "../../lib/api";
import { MapComponent } from "../../components/MapComponent";

export default function CivicMapPage() {
  const { t } = useLanguage();
  const [grievances, setGrievances] = useState<GrievanceData[]>([]);
  const [issues, setIssues] = useState<IssueReportData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [gData, iData] = await Promise.all([
        api.getAllGrievances({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined
        }),
        api.getAllReports({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined
        })
      ]);
      setGrievances(gData);
      setIssues(iData);
    } catch (err) {
      console.error("Map data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const categories = [
    { id: "all", label: "All Sectors", icon: "domain", color: "#64748b" },
    { id: "roads", label: "Roads & Transit", icon: "traffic", color: "#fe9832" },
    { id: "water", label: "Water & Pipelines", icon: "water_drop", color: "#0284c7" },
    { id: "electricity", label: "Power & Grid", icon: "bolt", color: "#ca8a04" },
    { id: "sanitation", label: "Sanitation & Waste", icon: "delete_sweep", color: "#16a34a" },
    { id: "health", label: "Public Health", icon: "health_and_safety", color: "#dc2626" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-variant gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-headline">
              {t.navMap} • Live Infrastructure Pins
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {grievances.length + issues.length} Active Pins
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1 font-body">
            Real-time citizen reports and civic defects geo-tagged across Indian cities.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface flex items-center gap-2 text-xs font-bold transition-all shadow-sm border border-outline-variant"
        >
          <span className={`material-symbols-outlined text-base ${isLoading ? "animate-spin" : ""}`}>
            refresh
          </span>
          <span>Refresh Map</span>
        </button>
      </div>

      {/* Filter and Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-on-surface-variant hover:bg-surface-variant border border-outline-variant"
              }`}
            >
              <span className="material-symbols-outlined text-sm" style={{ color: selectedCategory === cat.id ? '#ffffff' : cat.color }}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-on-surface-variant font-label">Status Filter:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Incidents</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-surface p-2 rounded-3xl border border-outline-variant shadow-lg overflow-hidden">
        <MapComponent
          center={[22.5937, 78.9629]}
          zoom={5}
          grievances={grievances}
          issues={issues}
          height="620px"
        />
      </div>
    </div>
  );
}


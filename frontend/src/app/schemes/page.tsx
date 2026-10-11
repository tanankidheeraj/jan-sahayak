"use client";

import React, { useState, useEffect } from "react";
import { api, SchemeItem } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";

export default function SchemesPage() {
  const { language, t } = useLanguage();
  const [allSchemes, setAllSchemes] = useState<SchemeItem[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<SchemeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchemeModal, setSelectedSchemeModal] = useState<SchemeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Questionnaire drawer toggle
  const [showMatcher, setShowMatcher] = useState(false);
  const [userAge, setUserAge] = useState(32);
  const [userIncome, setUserIncome] = useState(180000);
  const [userOccupation, setUserOccupation] = useState("Farmer");

  useEffect(() => {
    setIsLoading(true);
    api.getAllSchemes()
      .then((data) => {
        setAllSchemes(data);
        setFilteredSchemes(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFilter = (cat: string, search: string) => {
    let result = allSchemes;
    if (cat !== "all") {
      result = result.filter(
        (s) => s.category.toLowerCase().includes(cat.toLowerCase())
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.name_hi && s.name_hi.includes(q)) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }
    setFilteredSchemes(result);
  };

  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.matchSchemes({
        age: userAge,
        state: "All",
        income: userIncome,
        occupation: userOccupation,
        gender: "All",
        category: "General"
      });
      setFilteredSchemes(res.schemes);
      setShowMatcher(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTabs = [
    { id: "all", label: `All Schemes (${allSchemes.length})` },
    { id: "agriculture", label: "🌾 Agriculture" },
    { id: "healthcare", label: "🩺 Healthcare" },
    { id: "housing", label: "🏠 Housing" },
    { id: "pension", label: "🛡️ Pension & Security" },
    { id: "women", label: "👩 Women & Child" },
    { id: "msme", label: "💼 MSME & Livelihood" },
  ];

  return (
    <div className="bg-surface min-h-screen text-on-surface font-body pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Eligibility Summary & Benefit Spotlight Banner (From Stitch 4_matched_schemes.html) */}
        <section className="relative overflow-hidden rounded-3xl bg-primary-container text-on-primary p-6 shadow-md border border-outline-variant/30">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 opacity-10 pointer-events-none text-white">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="2"></circle>
              <circle cx="50" cy="50" fill="currentColor" r="8"></circle>
              <g stroke="currentColor" strokeWidth="1.5">
                <line x1="50" x2="50" y1="5" y2="95"></line>
                <line x1="5" x2="95" y1="50" y2="50"></line>
                <line x1="18.18" x2="81.82" y1="18.18" y2="81.82"></line>
                <line x1="18.18" x2="81.82" y1="81.82" y2="18.18"></line>
              </g>
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>
              <span>Verified Eligibility Spotlight • MyScheme</span>
            </div>
            <button
              onClick={() => setShowMatcher(!showMatcher)}
              className="text-xs font-bold text-secondary-container hover:underline bg-white/10 px-3 py-1 rounded-full"
            >
              {showMatcher ? "Hide Profile" : "Edit Profile (पात्रता बदलें) ⚙️"}
            </button>
          </div>

          <div className="relative z-10 mb-4">
            <h1 className="font-headline font-bold text-2xl sm:text-3xl tracking-tight text-white">
              {filteredSchemes.length} Government Schemes Active
            </h1>
            <p className="text-sm text-surface-container-high/90 font-medium mt-0.5">
              आपके प्रोफाइल अनुसार सत्यापित केंद्रीय एवं राज्य योजनाएं
            </p>
          </div>

          {/* Total Benefit Callout Stat Card */}
          <div className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md p-4 flex items-center justify-between border border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-white flex items-center justify-center font-bold shadow-md">
                <span className="material-symbols-outlined text-[26px]">currency_rupee</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-surface-container-highest uppercase tracking-wider">
                  Total Entitlement Potential
                </span>
                <span className="font-headline font-bold text-xl sm:text-2xl text-white tracking-tight">
                  Up to ₹5,72,000 <span className="text-xs font-normal text-surface-container-high">/ year (Cashless & DBT)</span>
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center">
              <span className="material-symbols-outlined text-secondary-container text-[36px]">
                payments
              </span>
            </div>
          </div>
        </section>

        {/* Profile Matcher Expandable Drawer */}
        {showMatcher && (
          <form onSubmit={handleRunMatch} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 shadow-md space-y-4">
            <h3 className="font-headline font-bold text-base text-primary">
              नागरिक विवरण दर्ज करें • Quick Eligibility Assessment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-outline block mb-1">Age (वर्ष):</label>
                <input
                  type="number"
                  value={userAge}
                  onChange={(e) => setUserAge(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-outline-variant/60 bg-surface focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-outline block mb-1">Occupation (व्यवसाय):</label>
                <select
                  value={userOccupation}
                  onChange={(e) => setUserOccupation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant/60 bg-surface focus:outline-none"
                >
                  <option value="Farmer">Farmer (किसान)</option>
                  <option value="Student">Student (छात्र)</option>
                  <option value="Daily Wage">Daily Wage (दैनिक मजदूर)</option>
                  <option value="Artisan">Artisan (शिल्पकार / विश्वकर्मा)</option>
                  <option value="Self-employed">Self-employed (स्वरोजगार)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-outline block mb-1">Annual Income (वार्षिक आय ₹):</label>
                <input
                  type="number"
                  step="20000"
                  value={userIncome}
                  onChange={(e) => setUserIncome(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-outline-variant/60 bg-surface focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-primary-container text-white font-bold rounded-xl text-xs hover:bg-primary transition-colors"
            >
              Filter Schemes Based on My Criteria →
            </button>
          </form>
        )}

        {/* Search & Voice Filtering Bar (Stitch 4_matched_schemes.html) */}
        <section className="flex flex-col gap-3">
          <div className="relative flex items-center w-full">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilter(selectedCategory, e.target.value);
              }}
              placeholder="Search scheme name or category (योजना का नाम खोजें)..."
              className="w-full h-12 pl-11 pr-12 rounded-2xl bg-surface-container-lowest text-on-surface placeholder:text-outline font-body text-sm shadow-sm border border-outline-variant/30 focus:outline-none focus:bg-surface-container-low transition-colors"
            />
          </div>

          {/* Category Filter Chips (Stitch filter pills) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  handleFilter(tab.id, searchQuery);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === tab.id
                    ? "bg-primary-container text-white shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Matched Schemes Cards List */}
        <section className="space-y-4">
          {filteredSchemes.map((scheme) => (
            <article
              key={scheme.id}
              className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-md border border-outline-variant/30 transition-all flex flex-col gap-3"
            >
              {/* Header: Ministry & Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[26px]">
                      {scheme.category === "Agriculture"
                        ? "potted_plant"
                        : scheme.category === "Healthcare"
                        ? "local_hospital"
                        : scheme.category === "Housing"
                        ? "roofing"
                        : "account_balance"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-outline">
                      {scheme.ministry}
                    </span>
                    <h2 className="font-headline font-bold text-base sm:text-lg text-on-surface">
                      {scheme.name}
                    </h2>
                    {scheme.name_hi && (
                      <span className="text-xs text-secondary-container font-medium">
                        {scheme.name_hi}
                      </span>
                    )}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary-container text-xs font-bold whitespace-nowrap">
                  ✓ Eligible
                </span>
              </div>

              {/* Benefit Amount Spotlight */}
              <div className="rounded-xl bg-surface-container-low p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                    Direct Benefit / Entitlement
                  </span>
                  <span className="font-headline font-bold text-base text-primary">
                    {scheme.benefits}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {scheme.description}
              </p>

              {/* Required Documents Pills */}
              {scheme.documents_required && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-outline mr-1 self-center">
                    दस्तावेज:
                  </span>
                  {scheme.documents_required.slice(0, 3).map((doc, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-medium"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                <button
                  onClick={() => setSelectedSchemeModal(scheme)}
                  className="text-xs font-bold text-primary-container hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>आवेदन प्रक्रिया (Full Steps)</span>
                </button>

                <a
                  href={scheme.official_portal}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>पोर्टल पर आवेदन करें</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </article>
          ))}
        </section>

        {/* Modal */}
        {selectedSchemeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl border border-outline-variant/40">
              <div className="flex justify-between items-start pb-3 border-b border-outline-variant/20">
                <div>
                  <h3 className="font-headline font-bold text-xl text-primary">
                    {selectedSchemeModal.name}
                  </h3>
                  <p className="text-xs text-outline">{selectedSchemeModal.ministry}</p>
                </div>
                <button
                  onClick={() => setSelectedSchemeModal(null)}
                  className="text-outline hover:text-on-surface text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs space-y-3">
                <div className="p-3 bg-secondary-fixed/30 rounded-xl text-secondary font-semibold">
                  🎁 {selectedSchemeModal.benefits}
                </div>

                <div>
                  <h4 className="font-bold text-on-surface uppercase mb-1">आवश्यक दस्तावेज (Checklist):</h4>
                  <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                    {selectedSchemeModal.documents_required.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-on-surface uppercase mb-1">आवेदन के चरण (Steps):</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-on-surface-variant">
                    {selectedSchemeModal.application_steps.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex justify-between">
                <button
                  onClick={() => setSelectedSchemeModal(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold"
                >
                  बंद करें (Close)
                </button>
                <a
                  href={selectedSchemeModal.official_portal}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-xl bg-secondary-container text-white text-xs font-bold shadow-md"
                >
                  आधिकारिक वेबसाइट खोलें →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

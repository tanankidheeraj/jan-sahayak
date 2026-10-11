"use client";

import React, { useState } from "react";
import { api, GrievanceData } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import { VoiceButton } from "../../components/VoiceButton";

export default function GrievancePage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"file" | "track">("file");

  // Filing states
  const [description, setDescription] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<GrievanceData | null>(null);

  // Tracking states
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [trackedGrievance, setTrackedGrievance] = useState<GrievanceData | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleVoiceInput = (transcript: string) => {
    setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const handleFileGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitGrievance({
        description: description.trim(),
        user_language: language,
        citizen_name: citizenName || "Citizen",
        citizen_phone: citizenPhone || undefined,
        city: city,
        address: address || undefined,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Submission error. Please ensure server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingId.trim() || isTracking) return;

    setIsTracking(true);
    setTrackError(null);
    setTrackedGrievance(null);

    try {
      const res = await api.getGrievanceById(searchTrackingId.trim());
      if (res) {
        setTrackedGrievance(res);
      } else {
        setTrackError(`No record found for Tracking ID "${searchTrackingId.trim()}"`);
      }
    } catch (e) {
      setTrackError("Error fetching status. Please try again.");
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-body pb-24">
      {/* Stitch Header Bar */}
      <section className="bg-primary-container text-on-primary py-4 px-4 sm:px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-secondary-container">
              assignment
            </span>
            <div>
              <h1 className="font-headline font-bold text-lg text-white">
                शिकायत निवारण • Citizen Grievance Portal
              </h1>
              <p className="text-[11px] text-white/80">CPGRAMS & Civic Charter Aligned</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("file")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "file" ? "bg-white text-primary shadow-sm" : "text-white"
              }`}
            >
              Lodge Complaint
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "track" ? "bg-white text-primary shadow-sm" : "text-white"
              }`}
            >
              Track Status
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === "file" ? (
          !result ? (
            /* Exact Stitch 5_file_complaint Step Layout */
            <form onSubmit={handleFileGrievance} className="space-y-6">
              {/* STEP 1: Voice-First Issue Recording (Stitch Card) */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-fixed/40 via-surface-container-low to-surface-container p-6 shadow-sm border border-outline-variant/30 text-center flex flex-col items-center gap-3">
                <div className="relative flex items-center justify-center my-2">
                  <span className="absolute w-24 h-24 rounded-full bg-secondary-container/20 animate-ping pointer-events-none"></span>
                  <div className="relative z-10">
                    <VoiceButton onTranscript={handleVoiceInput} size="lg" className="w-18 h-18 shadow-xl" />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-headline font-bold text-base text-on-secondary-container">
                    बोलकर बताएं / Speak to Record
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    हिन्दी, English या स्थानीय बोली में बोलें
                  </span>
                </div>

                {/* Text / Transcript Field */}
                <div className="w-full text-left space-y-1.5 mt-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-on-surface-variant">
                      ऑडियो से लिखा गया विवरण (Speech Transcript & Problem Details) *
                    </label>
                    <span className="text-xs font-bold text-tertiary-fixed-variant">
                      ✓ AI Transcribed
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., हमारे रामपुर (वार्ड 4) के मुख्य मार्ग पर पिछले 4 दिनों से पानी की पाइपलाइन फूटी है और सड़क पर जलभराव हो रहा है..."
                    className="w-full bg-surface-container-lowest text-on-surface rounded-xl p-4 text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner leading-relaxed"
                    required
                  />
                </div>
              </section>

              {/* Personal Details */}
              <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 space-y-4">
                <h3 className="font-headline font-bold text-sm text-primary">
                  नागरिक संपर्क विवरण • Complainant Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-outline block mb-1">Your Name (नाम):</label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full p-2.5 rounded-lg border border-outline-variant/60 bg-surface focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-outline block mb-1">Mobile Number (मोबाइल):</label>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 rounded-lg border border-outline-variant/60 bg-surface focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-outline block mb-1">City / Nagar Nigam:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-outline-variant/60 bg-surface focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-outline block mb-1">Ward / Street Address:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Ward 4, Main Market Road"
                      className="w-full p-2.5 rounded-lg border border-outline-variant/60 bg-surface focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Submission Button with SLA Guarantee Badge */}
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="w-full py-4 rounded-2xl bg-secondary-container hover:bg-secondary text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>AI द्वारा विभाग और शिकायत पत्र तैयार किया जा रहा है...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    <span>शिकायत दर्ज करें • Submit Grievance (SLA 7 Days)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Successful Registration Dossier (From Stitch 5_file_complaint.html) */
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-outline-variant/40 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-tertiary-fixed/30 border border-tertiary-fixed-dim/40">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-tertiary-container text-white flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[28px]">check_circle</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-tertiary-container">
                      शिकायत सफलतापूर्वक दर्ज • Registered Successfully
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Tracking ID: <b className="font-mono text-primary font-bold">{result.id}</b>
                    </p>
                  </div>
                </div>
              </div>

              {/* Glowing AI Redressal Draft Header */}
              <div className="p-4 rounded-2xl bg-primary-container text-on-primary flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <span className="font-headline font-bold text-sm block">एआई विश्लेषण • AI Redressal Draft</span>
                    <span className="text-[11px] text-white/80">Auto-categorized under Public Charter</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-bold text-secondary-fixed">
                  Urgency: {result.urgency}
                </span>
              </div>

              {/* Department Tag */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container text-[24px]">
                  account_balance
                </span>
                <div>
                  <span className="text-[11px] font-bold text-outline uppercase">
                    संबंधित विभाग (Designated Department)
                  </span>
                  <p className="font-headline font-bold text-sm text-primary">
                    {result.department}
                  </p>
                </div>
              </div>

              {/* Formal Letters Preview */}
              <div className="space-y-3">
                <h4 className="font-headline font-bold text-sm text-on-surface">
                  औपचारिक शिकायत पत्र (Official Redressal Dossier)
                </h4>
                <div className="p-4 rounded-xl bg-surface text-xs font-mono whitespace-pre-line border border-outline-variant/30 leading-relaxed max-h-60 overflow-y-auto">
                  {result.formal_letter || result.translated_description_en}
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex justify-between">
                <button
                  onClick={() => {
                    setResult(null);
                    setDescription("");
                  }}
                  className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface"
                >
                  नई शिकायत दर्ज करें
                </button>
                <button
                  onClick={() => {
                    setSearchTrackingId(result.id);
                    setActiveTab("track");
                    handleTrack({ preventDefault: () => {} } as any);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold shadow-md"
                >
                  स्थिति ट्रैक करें (Track Timeline) →
                </button>
              </div>
            </div>
          )
        ) : (
          /* Tracking View */
          <div className="space-y-6">
            <form onSubmit={handleTrack} className="flex gap-2 bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/40 shadow-sm">
              <input
                type="text"
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                placeholder="Enter Tracking ID (e.g. GRV-2026-1001)..."
                className="flex-1 px-4 py-2 text-sm bg-transparent font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary transition-colors"
              >
                Track Status
              </button>
            </form>

            {trackError && (
              <div className="p-4 rounded-2xl bg-error-container text-on-error-container text-xs font-bold">
                {trackError}
              </div>
            )}

            {trackedGrievance && (
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-md space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                  <div>
                    <span className="font-mono text-xs text-outline">{trackedGrievance.id}</span>
                    <h3 className="font-headline font-bold text-base text-on-surface">{trackedGrievance.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed">
                    {trackedGrievance.status}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div className="p-3 bg-surface-container-low rounded-xl">
                    <span className="text-outline block font-bold">Department:</span>
                    <span className="font-semibold text-primary">{trackedGrievance.department}</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl">
                    <span className="text-outline block font-bold">Description:</span>
                    <span className="text-on-surface">{trackedGrievance.description}</span>
                  </div>
                  {trackedGrievance.resolution_notes && (
                    <div className="p-3 bg-tertiary-fixed/30 rounded-xl text-tertiary-container">
                      <span className="block font-bold">Official Resolution Note:</span>
                      <span>{trackedGrievance.resolution_notes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

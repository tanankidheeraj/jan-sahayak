"use client";

import React, { useState } from "react";
import { api, IssueReportData } from "../../lib/api";
import { useLanguage } from "../../context/LanguageContext";
import { MapComponent } from "../../components/MapComponent";

export default function ReportIssuePage() {
  const { language, t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [address, setAddress] = useState("Main Arterial Ring Road, Ward 14");
  
  // Coordinates
  const [latitude, setLatitude] = useState<number>(28.6139);
  const [longitude, setLongitude] = useState<number>(77.2090);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<IssueReportData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsDetectingGps(false);
        setGpsLocked(true);
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsDetectingGps(false);
        alert("GPS not detected. Click on the map to set location.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("description", description);
      formData.append("address", address);
      formData.append("city", city);

      const res = await api.reportIssue(formData);
      setSubmittedReport(res);
    } catch (err) {
      console.error(err);
      alert("Failed to report issue. Ensure server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-body pb-24">
      {/* Stitch 6_report_civic_issue Header */}
      <section className="bg-primary-container text-on-primary py-4 px-4 sm:px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-secondary-container">
              domain
            </span>
            <div>
              <h1 className="font-headline font-bold text-lg text-white">
                सार्वजनिक बुनियादी ढांचा • Public Infrastructure
              </h1>
              <p className="text-[11px] text-white/80">Vision AI Defect Analysis & Geo-Tagging</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            <span>AI Geo-Track</span>
          </span>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {!submittedReport ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Context Breadcrumb & Reassurance */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Fast-Track Civic Desk</span>
                </span>
                <h2 className="font-headline font-bold text-2xl text-on-surface">
                  Report Issue <span className="text-base text-on-surface-variant font-normal">/ समस्या रिपोर्ट</span>
                </h2>
              </div>
              <span className="text-xs text-outline font-medium">
                Instant camera scan & municipal escalation
              </span>
            </div>

            {/* Photo Capture & AI Tactical Preview (From Stitch 6_report_civic_issue.html) */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container shadow-md border border-outline-variant/30">
              {previewUrl ? (
                <div className="relative w-full h-64 sm:h-72">
                  <img src={previewUrl} alt="Captured defect" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-secondary-container text-[16px]">check_circle</span>
                      <span>Photo Captured</span>
                    </span>
                  </div>

                  {/* Retake Button */}
                  <label className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container-lowest backdrop-blur-md text-primary-container text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">flip_camera_ios</span>
                    <span>Retake / बदलें</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>

                  {/* Bottom AI Confidence Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md text-on-surface text-xs font-bold shadow-sm">
                      <span className="material-symbols-outlined text-tertiary-fixed-variant text-[18px]">smart_toy</span>
                      <span>Gemini Vision AI Engine • Ready</span>
                    </div>
                    <span className="text-white text-xs font-mono drop-shadow">Live Image Data</span>
                  </div>
                </div>
              ) : (
                <label className="w-full py-16 flex flex-col items-center justify-center cursor-pointer bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="w-16 h-16 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[36px]">add_a_photo</span>
                  </div>
                  <span className="font-headline font-bold text-base text-on-surface">
                    सड़क, गड्ढे, कचरे या लीकेज की फोटो अपलोड करें
                  </span>
                  <span className="text-xs text-outline mt-1">
                    Tap to Open Camera or Choose Image (JPEG/PNG)
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
                </label>
              )}

              {/* AI Diagnostic Summary Tray */}
              <div className="p-4 bg-surface-container-lowest space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px] text-error">warning</span>
                    <span>High Severity / उच्च प्राथमिकता</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-secondary-container bg-secondary-fixed/50 px-2.5 py-0.5 rounded text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
                    <span>Public Safety Priority</span>
                  </div>
                </div>

                <div className="rounded-xl bg-surface-container-low p-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary-container text-[20px] mt-0.5">travel_explore</span>
                    <div>
                      <span className="font-headline font-bold text-sm text-on-surface">
                        Infrastructure Diagnostic Scan
                      </span>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        Gemini identifies potholes, dangling live electrical wires, uncollected garbage clusters, and clean water pipeline bursts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & GPS Geo-Tagging Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary-container text-[18px]">location_on</span>
                    <span>स्थान जियो-टैग • Incident Geo-Location</span>
                  </h3>
                  <p className="text-xs text-outline">Click on the map to place pinpoint coordinates</p>
                </div>

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isDetectingGps}
                  className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-secondary-container hover:text-white text-primary-container text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">near_me</span>
                  <span>{isDetectingGps ? "Detecting GPS..." : "Detect GPS Location"}</span>
                </button>
              </div>

              <div className="text-xs flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-on-surface font-mono font-medium">
                  Lat: {latitude.toFixed(4)}° N, Lng: {longitude.toFixed(4)}° E
                </span>
                {gpsLocked && (
                  <span className="text-tertiary-fixed-variant font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>GPS Locked</span>
                  </span>
                )}
              </div>

              <MapComponent
                center={[latitude, longitude]}
                zoom={13}
                selectedLocation={[latitude, longitude]}
                onSelectLocation={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  setGpsLocked(true);
                }}
                height="280px"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                  <label className="font-bold text-outline block mb-1">Street Address / Landmark:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-outline-variant/60 bg-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submission Action */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className="w-full py-4 rounded-2xl bg-secondary-container hover:bg-secondary text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-surface-container-high disabled:text-outline"
            >
              {isSubmitting ? (
                <span>Gemini Vision AI द्वारा विश्लेषण हो रहा है...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>रिपोर्ट दर्ज करें • Submit Civic Report</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Success Dossier */
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-outline-variant/40 space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-tertiary-fixed/30 border border-tertiary-fixed-dim/40">
              <span className="material-symbols-outlined text-tertiary-container text-[28px]">
                check_circle
              </span>
              <div>
                <h3 className="font-headline font-bold text-base text-tertiary-container">
                  रिपोर्ट दर्ज एवं नक्शे पर पिन स्थापित • Reported & Geo-Tagged!
                </h3>
                <span className="text-xs text-on-surface-variant font-mono">
                  Incident ID: <b>{submittedReport.id}</b>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img
                src={`http://localhost:8000${submittedReport.image_url}`}
                alt="Defect"
                className="w-full h-56 object-cover rounded-2xl border border-outline-variant/30"
              />
              <div className="space-y-3">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="text-[11px] font-bold text-outline uppercase block">AI Detected Issue</span>
                  <span className="font-headline font-bold text-base text-primary">{submittedReport.detected_issue}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="text-[11px] font-bold text-outline uppercase block">Severity / Priority</span>
                  <span className="font-bold text-secondary">{submittedReport.severity}</span>
                </div>
                {submittedReport.safety_notes && (
                  <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-semibold">
                    ⚠️ {submittedReport.safety_notes}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/20 flex justify-between">
              <button
                onClick={() => {
                  setSubmittedReport(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold"
              >
                नई रिपोर्ट दर्ज करें
              </button>
              <a
                href="/map"
                className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold shadow-md"
              >
                नागरिक नक्शे पर देखें →
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

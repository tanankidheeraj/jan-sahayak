"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAccessibility } from "../context/AccessibilityContext";
import { VoiceButton } from "../components/VoiceButton";

export default function HomePage() {
  const { language, setLanguage, t, speechLangCode } = useLanguage();
  const { toggleLargeText } = useAccessibility();
  const router = useRouter();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [checkedLang, setCheckedLang] = useState(false);

  useEffect(() => {
    // If user has not chosen a language yet, redirect to /welcome
    const saved = localStorage.getItem("lang") || localStorage.getItem("jan_sahayak_lang");
    if (!saved) {
      router.replace("/welcome");
    } else {
      setCheckedLang(true);
    }
  }, [router]);

  const handleVoiceInput = (transcript: string) => {
    router.push(`/chat?q=${encodeURIComponent(transcript)}`);
  };

  const popularPrompts = [
    {
      icon: "payments",
      color: "text-secondary",
      text: "पीएम किसान ₹2000 किस्त स्थिति?",
      query: "पीएम किसान ₹2000 किस्त स्थिति क्या है?"
    },
    {
      icon: "family_restroom",
      color: "text-primary-container",
      text: "नया राशन कार्ड कैसे बनवाएं?",
      query: "नया राशन कार्ड कैसे बनवाएं?"
    },
    {
      icon: "fingerprint",
      color: "text-tertiary-fixed-variant",
      text: "आधार में मोबाइल नंबर अपडेट",
      query: "आधार कार्ड में मोबाइल नंबर कैसे अपडेट करें?"
    },
    {
      icon: "local_hospital",
      color: "text-secondary",
      text: "आयुष्मान भारत ₹5 लाख मुफ्त इलाज?",
      query: "आयुष्मान भारत योजना के तहत मुफ्त इलाज कैसे मिलेगा?"
    }
  ];

  const govServices = [
    {
      title: t.serviceAgricultureTitle,
      subtitle: t.serviceAgricultureSub,
      icon: "agriculture",
      href: "/schemes?cat=Agriculture",
      badge: "DBT Direct Transfer",
      color: "bg-tertiary-fixed/30 text-tertiary-fixed-variant"
    },
    {
      title: t.serviceHealthTitle,
      subtitle: t.serviceHealthSub,
      icon: "health_and_safety",
      href: "/schemes?cat=Healthcare",
      badge: "₹5L Cashless",
      color: "bg-secondary-fixed/40 text-secondary"
    },
    {
      title: t.serviceGrievanceTitle,
      subtitle: t.serviceGrievanceSub,
      icon: "assignment",
      href: "/grievance",
      badge: "Auto-Routing",
      color: "bg-primary-fixed/40 text-primary-container"
    },
    {
      title: t.serviceInfraTitle,
      subtitle: t.serviceInfraSub,
      icon: "domain",
      href: "/report-issue",
      badge: "Photo + GPS",
      color: "bg-secondary-fixed/50 text-secondary"
    }
  ];

  return (
    <div className="bg-surface min-h-screen text-on-surface flex flex-col font-body">
      {/* Sub-header Context Banner with Ashoka Motif */}
      <section className="bg-primary-container text-on-primary py-4 px-4 sm:px-6 relative overflow-hidden shadow-sm">
        {/* Ashoka Chakra Background Motif */}
        <div className="absolute -right-8 -top-8 w-44 h-44 opacity-10 pointer-events-none text-white">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="2"></circle>
            <circle cx="50" cy="50" fill="currentColor" r="8"></circle>
            <g stroke="currentColor" strokeWidth="1.5">
              <line x1="50" x2="50" y1="5" y2="95"></line>
              <line x1="5" x2="95" y1="50" y2="50"></line>
              <line x1="18.18" x2="81.82" y1="18.18" y2="81.82"></line>
              <line x1="18.18" x2="81.82" y1="81.82" y2="18.18"></line>
              <line x1="7.61" x2="92.39" y1="32.68" y2="67.32"></line>
              <line x1="7.61" x2="92.39" y1="67.32" y2="32.68"></line>
            </g>
          </svg>
        </div>

        <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-white shadow-sm font-bold text-lg font-headline">
              जन
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg text-white">जन सहायक</span>
                <span className="text-xs text-white/80 font-normal">Jan Sahayak</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/80 uppercase tracking-wider font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                <span>Digital India AI • Citizen Services</span>
              </div>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLargeText}
              aria-label="Text zoom"
              className="px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all"
            >
              A<sup>±</sup>
            </button>
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* 1. Greeting Banner with Ashoka Motif Subtle Background */}
        <section className="relative overflow-hidden bg-surface-container-low rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 opacity-5 pointer-events-none text-primary">
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

          <div className="relative z-10 flex flex-col space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1 rounded-full w-fit shadow-sm border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-variant"></span>
              <span className="text-xs text-tertiary-container font-bold font-label">
                {t.verifiedCitizen}
              </span>
            </div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-primary tracking-tight">
              {t.greetingCitizen} 👋
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed">
              {t.greetingQuestion}
            </p>
          </div>
        </section>

        {/* 2. Massive Voice Assistant Card (Hero Component from Stitch) */}
        <section className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border border-outline-variant/40 flex flex-col items-center text-center">
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-secondary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="inline-flex items-center gap-1.5 bg-secondary-fixed/50 px-3.5 py-1 rounded-full text-secondary font-semibold text-xs mb-4">
            <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
            <span>{t.voiceCompanionTitle}</span>
          </div>

          {/* Centered Pulsing Mic Button */}
          <div className="relative my-4 flex items-center justify-center">
            <span className="absolute w-28 h-28 rounded-full bg-secondary-container/20 animate-ping pointer-events-none"></span>
            <span className="absolute w-24 h-24 rounded-full bg-secondary-container/30 pointer-events-none"></span>
            <div className="relative z-10">
              <VoiceButton onTranscript={handleVoiceInput} size="lg" className="w-20 h-20 shadow-xl" />
            </div>
          </div>

          {/* Live transcription / Status text */}
          <div className="mt-3 flex flex-col items-center space-y-1">
            <h3 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">
              {t.tapAndSpeak}
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm">
              {t.voiceHeroDescription}
            </p>
          </div>

          {/* Supported Languages Pill Badge */}
          <div className="mt-3 flex items-center gap-2 bg-surface-container px-3.5 py-1.5 rounded-full text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[16px] text-primary-container">translate</span>
            <span className="font-medium text-on-surface">{t.supportedLangsPill}</span>
          </div>

          {/* Quick Prompt Chips Carousel / Wrap */}
          <div className="w-full mt-6 pt-4 bg-surface-container-low/70 rounded-xl p-4 flex flex-col space-y-2.5 text-left border border-outline-variant/30">
            <div className="font-label text-xs text-outline font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
              <span>{t.popularPromptsTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {popularPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(`/chat?q=${encodeURIComponent(p.query)}`)}
                  className="bg-surface-container-lowest hover:bg-surface-container active:scale-95 transition-all text-on-surface px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm border border-outline-variant/20 text-left"
                >
                  <span className={`material-symbols-outlined text-[18px] ${p.color}`}>
                    {p.icon}
                  </span>
                  <span className="truncate">{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Active Tracking Widget: Ayushman Golden Card (Exact Stitch layout) */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  medical_services
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  {t.recentStatusTitle}
                </span>
                <h4 className="font-headline font-bold text-base text-on-surface">
                  {t.ayushmanTitle}
                </h4>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary-container text-xs font-bold font-label">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>{t.approvedBadge}</span>
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-outline block">{t.applicationIdLabel}</span>
              <span className="font-mono font-bold text-on-surface">AB-2026-8841</span>
            </div>
            <div>
              <span className="text-outline block">{t.beneficiaryLabel}</span>
              <span className="font-bold text-on-surface">{t.beneficiaryDetails}</span>
            </div>
            <Link
              href="/schemes"
              className="px-3 py-1.5 rounded-lg bg-primary-container text-white font-bold text-xs flex items-center gap-1 self-start sm:self-auto hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>{t.downloadCard}</span>
            </Link>
          </div>
        </section>

        {/* 4. Government Services 2-Column Grid (From Stitch Layout) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg text-primary">
              {t.govServicesTitle}
            </h3>
            <Link href="/schemes" className="text-xs font-bold text-secondary hover:underline">
              {t.viewAllSchemes} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {govServices.map((service, idx) => (
              <Link
                key={idx}
                href={service.href}
                className="bg-surface-container-lowest hover:bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 shadow-sm transition-all flex items-start justify-between group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${service.color}`}>
                    <span className="material-symbols-outlined text-[22px]">
                      {service.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                      {service.subtitle}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-primary-container">
                      {service.badge}
                    </span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform text-[20px]">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

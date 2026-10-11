"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAccessibility } from "../context/AccessibilityContext";
import { LanguageCode } from "../lib/translations";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { toggleLargeText } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.navHome, icon: "home" },
    { href: "/chat", label: t.navChat, icon: "graphic_eq" },
    { href: "/schemes", label: t.navSchemes, icon: "potted_plant" },
    { href: "/grievance", label: t.navGrievance, icon: "assignment" },
    { href: "/report-issue", label: t.navReport, icon: "domain" },
    { href: "/map", label: t.navMap, icon: "pin_drop" },
    { href: "/admin", label: t.navAdmin, icon: "admin_panel_settings" },
  ];

  const languagesList: { code: LanguageCode; label: string }[] = [
    { code: "hi", label: "हिन्दी" },
    { code: "en", label: "English" },
    { code: "te", label: "తెలుగు" },
    { code: "ta", label: "தமிழ்" },
    { code: "bn", label: "বাংলা" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary-container text-on-primary shadow-md border-b border-white/10">
      {/* Tricolor accent bar */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand matching Stitch Home */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-white shadow-sm font-headline font-bold text-base group-hover:scale-105 transition-transform">
              जन
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-lg text-white leading-tight">
                  जन सहायक
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-white/15 text-white/90">
                  Jan Sahayak
                </span>
              </div>
              <span className="text-[10px] text-white/80 leading-none">
                AI for Bharat & Public Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? "text-secondary-container" : ""}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Change Language button & accessibility */}
          <div className="flex items-center gap-2">
            <Link
              href="/welcome"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-white text-xs font-bold transition-all shadow-sm border border-white/20"
              title="Change Language (भाषा बदलें)"
            >
              <span className="material-symbols-outlined text-[16px]">translate</span>
              <span>{t.languageSelect || "Language"}</span>
            </Link>

            <button
              onClick={toggleLargeText}
              title="Large text mode"
              className="px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors"
            >
              A<sup>±</sup>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/15 text-white"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-white/15 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold ${
                    isActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary-container">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

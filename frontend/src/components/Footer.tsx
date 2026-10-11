"use client";

import React from "react";
import Link from "next/link";
import { Shield, PhoneCall, HeartHandshake, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-900 text-slate-300 pt-10 pb-8 mt-16 border-t-4 border-saffron-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand and Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-saffron-500 flex items-center justify-center text-navy-900 font-extrabold text-sm">
                जन
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                {t.appName}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              AI for Bharat & Public Services: A voice-first, multilingual citizen assistant
              bridging citizens and government authorities with automated grievance redressal and
              infrastructure intelligence.
            </p>
            <div className="pt-2 text-xs text-saffron-400 font-semibold flex items-center gap-2">
              <Shield size={14} />
              <span>Compliant with Indian Digital Accessibility Guidelines (GIGW 3.0)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Citizen Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/chat" className="hover:text-saffron-400 transition-colors">
                  {t.navChat}
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-saffron-400 transition-colors">
                  {t.navSchemes}
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-saffron-400 transition-colors">
                  {t.navGrievance}
                </Link>
              </li>
              <li>
                <Link href="/report-issue" className="hover:text-saffron-400 transition-colors">
                  {t.navReport}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-saffron-400 transition-colors">
                  {t.navAdmin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Helplines */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall size={14} className="text-saffron-400" />
              National Helplines
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-2 rounded bg-navy-800/80 border border-navy-700">
                <span className="font-bold text-white block">112</span>
                <span>National Emergency Number</span>
              </div>
              <div className="p-2 rounded bg-navy-800/80 border border-navy-700">
                <span className="font-bold text-white block">1915</span>
                <span>National Consumer & Citizen Helpline</span>
              </div>
              <div className="p-2 rounded bg-navy-800/80 border border-navy-700">
                <span className="font-bold text-white block">14567</span>
                <span>Elderline (Senior Citizens)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Jan Sahayak. Developed for AI for Bharat & Public Services.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Powered by Gemini AI & Open Data</span>
            <span className="h-3 w-[1px] bg-slate-700"></span>
            <span className="text-indiaGreen-400 font-medium">Empowering 1.4 Billion Citizens</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

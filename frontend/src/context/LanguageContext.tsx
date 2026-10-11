"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageCode, translations, TranslationDict } from "../lib/translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDict;
  speechLangCode: string;
}

const speechMap: Record<LanguageCode, string> = {
  hi: "hi-IN",
  en: "en-IN",
  te: "te-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  mr: "mr-IN"
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>("hi");

  useEffect(() => {
    const saved = (localStorage.getItem("lang") || localStorage.getItem("jan_sahayak_lang")) as LanguageCode;
    if (saved && translations[saved]) {
      setLanguageState(saved);
      if (typeof document !== "undefined") {
        document.documentElement.lang = saved;
        document.documentElement.setAttribute("data-lang", saved);
      }
    } else {
      if (typeof document !== "undefined") {
        document.documentElement.lang = "hi";
        document.documentElement.setAttribute("data-lang", "hi");
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
    localStorage.setItem("jan_sahayak_lang", lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.setAttribute("data-lang", lang);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language] || translations.en,
        speechLangCode: speechMap[language] || "en-IN"
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

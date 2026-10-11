"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageCode } from "../../lib/translations";

interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  sampleGreeting: string;
  icon: string;
  fontClass: string;
}

const languages: LanguageOption[] = [
  {
    code: "hi",
    nativeName: "हिन्दी",
    englishName: "Hindi",
    sampleGreeting: "नमस्ते! जन सहायक में आपका स्वागत है।",
    icon: "translate",
    fontClass: "font-['Noto_Sans_Devanagari']"
  },
  {
    code: "en",
    nativeName: "English",
    englishName: "English",
    sampleGreeting: "Welcome to Jan Sahayak AI Assistant.",
    icon: "language",
    fontClass: "font-['Inter']"
  },
  {
    code: "te",
    nativeName: "తెలుగు",
    englishName: "Telugu",
    sampleGreeting: "నమస్కారం! జన సహాయక్ కు స్వాగతం.",
    icon: "record_voice_over",
    fontClass: "font-['Noto_Sans_Telugu']"
  },
  {
    code: "ta",
    nativeName: "தமிழ்",
    englishName: "Tamil",
    sampleGreeting: "வணக்கம்! ஜன சஹாயக்கிற்கு வரவேற்கிறோம்.",
    icon: "campaign",
    fontClass: "font-['Noto_Sans_Tamil']"
  },
  {
    code: "bn",
    nativeName: "বাংলা",
    englishName: "Bengali",
    sampleGreeting: "নমস্কার! জন সহায়ক এ আপনাকে স্বাগতম।",
    icon: "spatial_audio",
    fontClass: "font-['Noto_Sans_Bengali']"
  },
  {
    code: "mr",
    nativeName: "मराठी",
    englishName: "Marathi",
    sampleGreeting: "नमस्कार! जन सहायक मध्ये आपले स्वागत आहे.",
    icon: "mic",
    fontClass: "font-['Noto_Sans_Devanagari']"
  }
];

export default function WelcomeLanguagePage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language || "hi");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Voice guidance audio prompt: "Choose your language" in Hindi and English
  const playVoicePrompt = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    const hiUtterance = new SpeechSynthesisUtterance("कृपया अपनी भाषा चुनें।");
    hiUtterance.lang = "hi-IN";
    hiUtterance.rate = 0.95;

    const enUtterance = new SpeechSynthesisUtterance("Please select your preferred language to continue.");
    enUtterance.lang = "en-IN";
    enUtterance.rate = 0.95;

    hiUtterance.onend = () => {
      window.speechSynthesis.speak(enUtterance);
    };

    enUtterance.onend = () => {
      setIsPlayingAudio(false);
    };

    enUtterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    hiUtterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(hiUtterance);
  };

  useEffect(() => {
    // Attempt audio guidance once upon mount (if allowed by browser autoplay policy)
    const timer = setTimeout(() => {
      try {
        playVoicePrompt();
      } catch (e) {
        console.warn("Autoplay audio blocked by browser policy:", e);
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setSelectedLang(code);
  };

  const handleContinue = () => {
    // Persist choice in localStorage and global context
    setLanguage(selectedLang);
    localStorage.setItem("lang", selectedLang);
    localStorage.setItem("jan_sahayak_lang", selectedLang);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface flex flex-col justify-between font-body">
      {/* Tricolor Header Bar */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center w-full">
        {/* National Emblem & Title Hub */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-container text-white shadow-md font-headline font-extrabold text-2xl mx-auto">
            जन
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary font-headline tracking-tight">
              जन सहायक • Jan Sahayak
            </h1>
            <p className="text-sm sm:text-base font-semibold text-on-surface-variant">
              Digital India AI • National Citizen Services Initiative
            </p>
          </div>

          {/* Voice Prompt Playback Button */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={playVoicePrompt}
              aria-label="Replay audio guide: Choose your language"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                isPlayingAudio
                  ? "bg-secondary text-white animate-pulse"
                  : "bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/40"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlayingAudio ? "volume_up" : "campaign"}
              </span>
              <span>
                {isPlayingAudio ? "बोल रहे हैं... (Playing Voice Guide)" : "आवाज़ में सुनें • Listen Instructions"}
              </span>
            </button>
          </div>

          <p className="text-xs text-outline font-medium">
            कृपया आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें • Choose your language
          </p>
        </div>

        {/* 6 Language Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Language selection options">
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <div
                key={lang.code}
                tabIndex={0}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${lang.nativeName} (${lang.englishName})`}
                onClick={() => handleSelect(lang.code)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(lang.code);
                  }
                }}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 outline-none flex flex-col justify-between border-2 ${
                  isSelected
                    ? "bg-surface-container-lowest border-primary shadow-lg ring-4 ring-primary/10 scale-[1.02]"
                    : "bg-surface-container-lowest hover:bg-surface border-outline-variant/30 hover:border-outline shadow-sm"
                }`}
              >
                {/* Selection Radio Circle */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {lang.icon}
                    </span>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? "border-primary bg-primary" : "border-outline-variant bg-transparent"
                  }`}>
                    {isSelected && (
                      <span className="material-symbols-outlined text-white text-[16px]">
                        check
                      </span>
                    )}
                  </div>
                </div>

                {/* Language Script Name */}
                <div className="space-y-1">
                  <h2 className={`text-2xl font-bold text-on-surface tracking-tight ${lang.fontClass}`}>
                    {lang.nativeName}
                  </h2>
                  <p className="text-xs font-semibold text-outline">
                    {lang.englishName}
                  </p>
                </div>

                {/* Sample Greeting Snippet */}
                <div className="mt-4 pt-3 border-t border-outline-variant/20">
                  <p className={`text-xs text-on-surface-variant font-medium leading-relaxed italic ${lang.fontClass}`}>
                    “{lang.sampleGreeting}”
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button Hub */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={handleContinue}
            className="w-full sm:w-80 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-container active:scale-98 text-white font-headline font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>जारी रखें • Continue</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          <p className="text-[11px] text-outline font-medium text-center">
            You can change your language anytime from the top bar.
          </p>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-4 text-center text-xs text-outline border-t border-outline-variant/20 bg-surface-container-lowest">
        Jan Sahayak • National Multilingual AI Citizen Redressal & Services Platform
      </footer>
    </div>
  );
}

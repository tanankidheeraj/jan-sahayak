"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface SpeakerButtonProps {
  text: string;
  langCode?: string;
  className?: string;
  size?: "sm" | "md";
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  langCode,
  className = "",
  size = "md"
}) => {
  const { speechLangCode, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const targetLang = langCode || speechLangCode;

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.toLowerCase() === targetLang.toLowerCase() ||
             v.lang.toLowerCase().startsWith(targetLang.split("-")[0])
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const iconSize = size === "sm" ? 16 : 20;

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={isPlaying ? t.stopAudio : t.speakReply}
      title={isPlaying ? t.stopAudio : t.speakReply}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        isPlaying
          ? "bg-indiaGreen-600 text-white animate-pulse"
          : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX size={iconSize} />
          <span>{t.stopAudio}</span>
        </>
      ) : (
        <>
          <Volume2 size={iconSize} className="text-saffron-600" />
          <span>{t.speakReply}</span>
        </>
      )}
    </button>
  );
};

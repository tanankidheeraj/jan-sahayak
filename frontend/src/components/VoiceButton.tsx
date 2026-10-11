"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  className = "",
  size = "md"
}) => {
  const { speechLangCode, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = speechLangCode;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onTranscript(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [speechLangCode, onTranscript]);

  const toggleListening = async () => {
    if (!isSupported) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (micErr) {
        console.warn("Mic permission error:", micErr);
        alert("Microphone permission was denied. Please allow microphone access in your browser.");
        return;
      }

      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = speechLangCode;
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    }
  };

  const sizeClasses = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg"
  }[size];

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28
  }[size];

  return (
    <button
      type="button"
      onClick={toggleListening}
      aria-label={isListening ? t.listening : t.tapToSpeak}
      title={isListening ? t.listening : t.tapToSpeak}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-saffron-300 ${
        isListening
          ? "bg-red-600 text-white animate-pulse ring-4 ring-red-300"
          : "bg-saffron-500 hover:bg-saffron-600 text-white"
      } ${sizeClasses} ${className}`}
    >
      {isListening ? (
        <span className="flex items-center gap-1.5">
          <MicOff size={iconSizes} className="animate-bounce" />
          <span className="sr-only">{t.listening}</span>
        </span>
      ) : (
        <Mic size={iconSizes} />
      )}
    </button>
  );
};

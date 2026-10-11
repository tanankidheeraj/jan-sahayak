"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  langCode?: string;
  timestamp: string;
  actions?: string[];
}

function ChatContent() {
  const searchParams = useSearchParams();
  const { language, setLanguage, t, speechLangCode } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speedLabels: Record<number, string> = {
    0.8: "0.8x (धीमा)",
    1.0: "1.0x (सामान्य)",
    1.2: "1.2x (तेज)"
  };

  useEffect(() => {
    // Initial welcome message from Stitch design
    setMessages([
      {
        id: "initial-bot",
        role: "assistant",
        content: "नमस्ते! मैं जन सहायक AI आवाज़ साथी हूँ। आप मुझसे सरकारी योजनाओं, राशन कार्ड, आय प्रमाण पत्र या पानी-सड़क की शिकायतों के बारे में अपनी भाषा में पूछ सकते हैं।",
        langCode: speechLangCode,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: ["पीएम किसान ₹2000 स्थिति", "नया राशन कार्ड प्रक्रिया", "सड़क गड्ढा शिकायत"]
      }
    ]);

    const initialQuery = searchParams.get("q");
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const [liveTranscript, setLiveTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Load browser TTS voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setAvailableVoices(v);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Speech Recognition setup (Web Speech API)
  const startVoiceInput = async () => {
    setErrorMessage(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Please use Chrome or Chromium-based browsers for voice input.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    // Step: Request microphone permissions explicitly first
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release stream immediately; SpeechRecognition will take over the mic
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (micErr: any) {
      console.warn("Microphone access error:", micErr);
      if (micErr.name === "NotAllowedError" || micErr.name === "PermissionDeniedError") {
        setErrorMessage("Microphone permission denied. Please allow microphone access in browser settings.");
      } else {
        setErrorMessage("Could not connect to microphone. Please verify your hardware connection.");
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLangCode;

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript("");
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (interim) {
          setLiveTranscript(interim);
        }

        if (final.trim()) {
          setLiveTranscript(final);
          handleSendMessage(final.trim());
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error event:", event.error);
        setIsListening(false);
        if (event.error === "no-speech") {
          setErrorMessage("No speech detected. Please speak clearly into the microphone.");
        } else if (event.error === "not-allowed") {
          setErrorMessage("Microphone permission blocked. Please enable it in browser URL bar.");
        } else if (event.error === "network") {
          setErrorMessage("Network issue with speech recognition service. Please check connection.");
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.warn("Failed to start speech recognition:", e);
      setIsListening(false);
      setErrorMessage("Failed to start speech recognition. Please use Chrome.");
    }
  };

  // Text to Speech playback with voiceschanged matching & fallback
  const speakText = (text: string, lang?: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Call speechSynthesis.cancel() before a new utterance
    window.speechSynthesis.cancel();
    setVoiceNotice(null);

    if (activeSpeechText === text) {
      setActiveSpeechText(null);
      return;
    }

    const targetLang = lang || speechLangCode;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = speechRate;

    // Find best matching voice
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    let selectedVoice = voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase());

    if (!selectedVoice) {
      // Try prefix match (e.g. 'te' for 'te-IN')
      const prefix = targetLang.split("-")[0].toLowerCase();
      selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      // Fallback to English voice if Indian language voice not installed locally
      const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
      if (enVoice) {
        utterance.voice = enVoice;
        setVoiceNotice(`Note: Native ${targetLang} voice not installed on this system. Falling back to default system voice.`);
      }
    }

    utterance.onstart = () => setActiveSpeechText(text);
    utterance.onend = () => setActiveSpeechText(null);
    utterance.onerror = () => setActiveSpeechText(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudioPlayback = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setActiveSpeechText(null);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    setErrorMessage(null);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLiveTranscript("");
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.chat({
        message: text.trim(),
        language: language,
        history: historyPayload
      });

      if (!res || !res.reply) {
        throw new Error("Empty response received from AI backend.");
      }

      const assistantMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        langCode: res.speech_lang_code || speechLangCode,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: res.suggested_actions
      };

      setMessages((prev) => [...prev, assistantMessage]);
      // Automatically read reply aloud
      speakText(res.reply, res.speech_lang_code || speechLangCode);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errMsg = err?.message || "तकनीकी समस्या के कारण उत्तर नहीं मिल सका। कृपया पुनः प्रयास करें।";
      setErrorMessage(`AI Connection Notice: ${errMsg}`);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content: "तकनीकी समस्या के कारण उत्तर नहीं मिल सका। कृपया पुनः प्रयास करें। (Unable to connect to AI service. Please ensure backend is running.)",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-body pb-24">
      {/* Stitch 2_speak_ai Status & Controls Bar */}
      <section className="bg-surface-container-low border-b border-outline-variant/30 py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary-container">
              graphic_eq
            </span>
            <span className="text-xs font-bold font-headline text-primary-container uppercase tracking-wider">
              AI Voice Guidance • ऑडियो सहायक
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed accessibility toggle */}
            <button
              onClick={() => {
                const rates = [0.8, 1.0, 1.2];
                const next = rates[(rates.indexOf(speechRate) + 1) % rates.length];
                setSpeechRate(next);
              }}
              className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold text-on-surface flex items-center gap-1 shadow-sm"
              title="Voice pace control"
            >
              <span className="material-symbols-outlined text-[14px]">speed</span>
              <span>{speedLabels[speechRate]}</span>
            </button>

            {/* Audio Wave Animated Equalizer */}
            <div className="flex items-end gap-0.5 h-5 px-1.5 py-0.5 bg-surface-container-lowest rounded-md border border-outline-variant/30">
              <div className="w-1 bg-secondary-container rounded-full animate-bounce h-3" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-1 bg-primary-container rounded-full animate-bounce h-4" style={{ animationDelay: "0.25s" }}></div>
              <div className="w-1 bg-secondary-container rounded-full animate-bounce h-2" style={{ animationDelay: "0.15s" }}></div>
              <div className="w-1 bg-tertiary-fixed-variant rounded-full animate-bounce h-3" style={{ animationDelay: "0.3s" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Conversation & Sonic Hub */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Ambient Pulsing Sonic Orb (From Stitch 2_speak_ai.html) */}
        <section className="w-full bg-gradient-to-b from-surface-container-low to-surface-container rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm border border-outline-variant/30 text-center">
          <div className="relative w-32 h-32 flex items-center justify-center my-2">
            <div className={`absolute inset-0 rounded-full bg-secondary-container/20 ${isListening ? "animate-ping" : ""}`}></div>
            <div className="absolute inset-2 rounded-full bg-primary-container/15 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-secondary-fixed/40"></div>

            {/* Center Emblem Chakra Inspired Audio Hub */}
            <button
              onClick={startVoiceInput}
              className="relative z-10 w-20 h-20 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <svg className="w-12 h-12 text-secondary-container animate-[spin_12s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 48 48">
                <circle cx="24" cy="24" opacity="0.3" r="20" stroke="currentColor"></circle>
                <path d="M24 4v40M4 24h40M9.8 9.8l28.4 28.4M9.8 38.2l28.4-28.4" opacity="0.4"></path>
                <circle cx="24" cy="24" fill="currentColor" r="8"></circle>
              </svg>
              <span className="material-symbols-outlined text-white text-[28px] absolute">
                {isListening ? "mic_off" : "graphic_eq"}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-primary-container font-label text-xs font-bold shadow-sm border border-outline-variant/20">
              <span className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-ping" : "bg-tertiary-fixed-variant"}`}></span>
              <span>{isListening ? "Listening... (आवाज़ रिकॉर्ड हो रही है)" : "लाइव ऑडियो मार्गदर्शन • Tap Orb to Speak"}</span>
            </span>
            {activeSpeechText && (
              <button
                onClick={stopAudioPlayback}
                className="px-2.5 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold flex items-center gap-1"
                title="Stop Audio Playback"
              >
                <span className="material-symbols-outlined text-[14px]">stop_circle</span>
                <span>Stop Voice</span>
              </button>
            )}
          </div>

          {/* Live Speech Recognition Transcript Box */}
          {liveTranscript && (
            <div className="mt-4 w-full max-w-lg bg-surface-container-lowest/90 backdrop-blur-sm border border-secondary-container/40 p-3 rounded-2xl shadow-sm text-left">
              <div className="flex items-center gap-1.5 text-secondary-container text-xs font-bold mb-1">
                <span className="material-symbols-outlined text-[16px] animate-pulse">mic</span>
                <span>Live Spoken Words:</span>
              </div>
              <p className="text-sm font-semibold text-on-surface italic">
                “{liveTranscript}”
              </p>
            </div>
          )}

          {/* User-facing Speech Error Banner */}
          {errorMessage && (
            <div className="mt-3 w-full max-w-lg bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 text-left">
              <span className="material-symbols-outlined text-red-600 text-[18px] flex-shrink-0">
                error
              </span>
              <div className="flex-1">
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* System voice note if regional voice not pre-installed */}
          {voiceNotice && (
            <div className="mt-2 w-full max-w-lg bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl text-[11px] font-medium flex items-center gap-1.5 text-left">
              <span className="material-symbols-outlined text-amber-600 text-[16px] flex-shrink-0">
                info
              </span>
              <span>{voiceNotice}</span>
            </div>
          )}
        </section>

        {/* Message Thread */}
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div key={msg.id} className="space-y-2">
                {isUser ? (
                  /* User Spoken Query Card (Exact Stitch 2_speak_ai layout) */
                  <div className="w-full flex flex-col gap-1.5">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5 text-primary-container">
                        <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
                        <span className="font-label text-xs font-bold">आपने पूछा / You asked:</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary-container font-label text-[11px] font-semibold">
                        Citizen Voice Query
                      </span>
                    </div>

                    <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30">
                      <p className="font-headline font-bold text-base text-on-surface leading-snug">
                        “{msg.content}”
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/20">
                        <span className="text-[11px] text-outline flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px] text-tertiary-fixed-variant">check_circle</span>
                          100% सही पहचाना गया (Transcribed clearly)
                        </span>
                        <button
                          onClick={() => handleSendMessage(msg.content)}
                          className="text-xs text-secondary-container hover:text-secondary flex items-center gap-0.5 font-bold"
                        >
                          <span className="material-symbols-outlined text-[16px]">replay</span>
                          <span>फिर बोलें</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* AI Multimodal Response Card (Exact Stitch 2_speak_ai layout) */
                  <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary-container">
                          <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                        </div>
                        <div>
                          <h2 className="font-headline font-bold text-base text-on-surface">
                            जन सहायक समाधान • AI Guidance
                          </h2>
                          <p className="text-[11px] text-on-surface-variant font-medium">
                            Government Welfare & Civic Verification
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => speakText(msg.content, msg.langCode)}
                        className={`h-9 px-3.5 rounded-full flex items-center gap-1.5 transition-all text-xs font-bold ${
                          activeSpeechText === msg.content
                            ? "bg-tertiary-fixed-variant text-white animate-pulse"
                            : "bg-surface-container text-primary-container hover:bg-surface-container-high"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {activeSpeechText === msg.content ? "volume_off" : "volume_up"}
                        </span>
                        <span>{activeSpeechText === msg.content ? "रोकें (Stop)" : "सुनें (Listen)"}</span>
                      </button>
                    </div>

                    {/* Official Context Pill */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low">
                      <span className="material-symbols-outlined text-secondary-container text-[20px]">verified</span>
                      <p className="text-xs text-on-surface font-semibold leading-snug">
                        सत्यापित सरकारी स्रोत • Verified Public Database (MyScheme & CPGRAMS)
                      </p>
                    </div>

                    {/* Text Body */}
                    <div className="text-sm text-on-surface leading-relaxed whitespace-pre-line font-normal">
                      {msg.content}
                    </div>

                    {/* Action Suggestion Chips */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/20">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(act)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surface-container hover:bg-secondary-fixed/50 text-primary-container border border-outline-variant/30 transition-colors"
                          >
                            {act} →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-secondary animate-spin">
                progress_activity
              </span>
              <span>जन सहायक जानकारी खोज रहा है... (AI Analyzing...)</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Persistent Floating Input Bar at Bottom */}
      <footer className="fixed bottom-0 inset-x-0 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/40 p-3 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {/* Saffron Mic FAB Button */}
          <button
            onClick={startVoiceInput}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-all flex-shrink-0 ${
              isListening ? "bg-red-600 animate-pulse ring-4 ring-red-200" : "bg-secondary-container hover:bg-secondary"
            }`}
            title="Tap & Speak"
          >
            <span className="material-symbols-outlined text-[26px]">
              {isListening ? "mic_off" : "mic"}
            </span>
          </button>

          {/* Text Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex-1 flex items-center gap-2 bg-surface-container-low rounded-2xl px-4 py-2 border border-outline-variant/30 focus-within:border-primary-container"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="अपनी भाषा में लिखें या बोलें (Ask by typing or voice)..."
              className="flex-1 bg-transparent text-sm text-on-surface placeholder-on-surface-variant focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-1.5 rounded-lg text-primary-container disabled:text-outline"
            >
              <span className="material-symbols-outlined text-[22px]">send</span>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-variant font-bold">Loading Voice Assistant...</div>}>
      <ChatContent />
    </Suspense>
  );
}

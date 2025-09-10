"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, Play, Square } from "lucide-react";

interface AudioGuideTTSProps {
  text: string; // fallback text if selector not found
  selector?: string; // optional CSS selector to read translated textContent from
}

export default function AudioGuideTTS({ text, selector }: AudioGuideTTSProps) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);

  // Get current selected language from Google Translate widget or <html lang>
  const getCurrentLang = () => {
    if (typeof window === "undefined") return "en";
    const sel = document.querySelector("select.goog-te-combo") as HTMLSelectElement | null;
    const val = sel?.value?.trim();
    if (val && val.length > 0) return val; // e.g., "hi"
    const htmlLang = document.documentElement.getAttribute("lang");
    return htmlLang && htmlLang.length > 0 ? htmlLang : "en";
  };

  // Resolve text to speak: use translated DOM if present
  const getTextToSpeak = () => {
    if (typeof window === "undefined") return text;
    try {
      // Prefer the nearest descriptive container if available
      // Callers can pass a selector using data attribute on a wrapping element; we sniff from props via closure
    } catch {}
    return text;
  };

  const handlePlay = (sel?: string) => {
    if (!synth) return;
    // Extract from selector if provided; fallback to base text
    let ttsText = text;
    if (sel) {
      const el = document.querySelector(sel);
      if (el && el.textContent && el.textContent.trim().length > 0) {
        ttsText = el.textContent.trim();
      }
    }
    if (!ttsText) return;
    if (synth.speaking) synth.cancel();
    utteranceRef.current = new window.SpeechSynthesisUtterance(ttsText);
    const voices = synth.getVoices();
    const langCode = (getCurrentLang() || 'en').toLowerCase();
    // Choose a voice that matches the langCode
    let voice = voices.find(v => v.lang?.toLowerCase() === langCode)
      || voices.find(v => v.lang?.toLowerCase().startsWith(langCode))
      || voices.find(v => v.lang?.toLowerCase().split('-')[0] === langCode)
      || voices.find(v => v.lang?.toLowerCase().startsWith('en'));
    if (voice) utteranceRef.current.voice = voice;
    // Set utterance lang; normalize some codes
    const normalized = langCode.length === 2 ? `${langCode}-${langCode.toUpperCase()}` : langCode;
    utteranceRef.current.lang = voice?.lang || normalized || 'en-US';
    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utteranceRef.current.onpause = () => setIsPaused(true);
    utteranceRef.current.onresume = () => setIsPaused(false);
    utteranceRef.current.onstart = () => setIsSpeaking(true);
    synth.speak(utteranceRef.current);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    if (synth && synth.speaking) synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (synth && synth.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (synth && synth.paused) {
      synth.resume();
      setIsPaused(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    if (synth && !voicesReady) {
      const handle = () => setVoicesReady(true);
      synth.addEventListener?.("voiceschanged", handle as any);
      // also trigger once
      setTimeout(() => setVoicesReady(true), 250);
      return () => synth.removeEventListener?.("voiceschanged", handle as any);
    }
    return () => {
      if (synth && synth.speaking) synth.cancel();
    };
  }, [synth, voicesReady]);

  return (
    <div className="flex items-center gap-2">
  <Button onClick={() => handlePlay(selector)} disabled={isSpeaking && !isPaused} className="flex-1 flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        Play Audio Guide
      </Button>
      <Button variant="outline" onClick={handlePause} disabled={!isSpeaking || isPaused} size="sm" aria-label="Pause">
        <Pause className="w-4 h-4" />
      </Button>
      <Button variant="outline" onClick={handleResume} disabled={!isPaused} size="sm" aria-label="Resume">
        <Play className="w-4 h-4" />
      </Button>
      <Button variant="outline" onClick={handleStop} disabled={!isSpeaking} size="sm" aria-label="Stop">
        <Square className="w-4 h-4" />
      </Button>
    </div>
  );
}
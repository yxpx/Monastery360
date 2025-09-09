"use client";

import { useRef, useState, useEffect } from "react";

interface AudioGuideTTSProps {
  text: string;
}

export default function AudioGuideTTS({ text }: AudioGuideTTSProps) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlay = () => {
    if (!synth) return;
    let ttsText = text;
    if (language === 'hi') {
      // Try to extract the visible translated text from the description box
      const descBox = document.querySelector('.text-sm.text-foreground.leading-relaxed.whitespace-pre-wrap');
      if (descBox) {
        ttsText = descBox.textContent || text;
      }
    }
    if (!ttsText) return;
    if (synth.speaking) synth.cancel();
    utteranceRef.current = new window.SpeechSynthesisUtterance(ttsText);
    const voices = synth.getVoices();
    if (language === 'hi') {
      const hindiFemaleVoice = voices.find(v =>
        v.lang?.toLowerCase().startsWith('hi') &&
        (
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('woman') ||
          v.voiceURI.toLowerCase().includes('female') ||
          v.voiceURI.toLowerCase().includes('woman') ||
          v.name.toLowerCase().includes('google hindi') ||
          v.name.toLowerCase().includes('hindi')
        )
      );
      if (hindiFemaleVoice) {
        utteranceRef.current.voice = hindiFemaleVoice;
        utteranceRef.current.lang = 'hi-IN';
      } else {
        utteranceRef.current.lang = 'hi-IN';
      }
    } else {
      // English female voice
      const femaleVoice = voices.find(v => v.lang?.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('female'))
        || voices.find(v => v.lang?.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('woman'))
        || voices.find(v => v.lang?.toLowerCase().startsWith('en') && v.voiceURI.toLowerCase().includes('female'))
        || voices.find(v => v.lang?.toLowerCase().startsWith('en') && v.voiceURI.toLowerCase().includes('woman'))
        || voices.find(v => v.lang?.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('zira'))
        || voices.find(v => v.lang?.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('susan'))
        || voices.find(v => v.lang?.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('samantha'))
        || voices.find(v => v.lang?.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('google us english'));
      if (femaleVoice) utteranceRef.current.voice = femaleVoice;
      utteranceRef.current.lang = 'en-US';
    }
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
    return () => {
      if (synth && synth.speaking) synth.cancel();
    };
  }, [synth]);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'hi')} style={{ marginRight: 8 }}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
      <button onClick={handlePlay} disabled={isSpeaking && !isPaused}>Play Audio Guide</button>
      <button onClick={handlePause} disabled={!isSpeaking || isPaused}>Pause</button>
      <button onClick={handleResume} disabled={!isPaused}>Resume</button>
      <button onClick={handleStop} disabled={!isSpeaking}>Stop</button>
    </div>
  );
}

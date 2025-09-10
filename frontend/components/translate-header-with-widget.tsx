"use client";
import { useState } from "react";
import TranslateWidgetToggle from "@/components/translate-widget-toggle";
import { NavigationHeader } from "./navigation-header";

interface Props {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function TranslateHeaderWithWidget({ activeView, onViewChange }: Props) {
  const [showTranslate, setShowTranslate] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  return (
    <>
      <TranslateWidgetToggle show={showTranslate} />
      <NavigationHeader
        activeView={activeView}
        onViewChange={onViewChange}
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => {
          setCurrentLanguage(lang);
          // If English selected, we're choosing source; keep widget available for one-click
          if (lang === "en") {
            setShowTranslate(true);
            if (window.resetGoogleTranslate) window.resetGoogleTranslate();
          } else {
            // Switch via helper
            if (window.setGoogleTranslateLanguage) {
              window.setGoogleTranslateLanguage(lang);
              setShowTranslate(true);
            }
          }
        }}
        translateActive={showTranslate}
        onToggleTranslate={() => setShowTranslate((v) => !v)}
      />
    </>
  );
}
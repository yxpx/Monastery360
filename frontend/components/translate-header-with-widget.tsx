"use client";
import { useState } from "react";
import TranslateWidgetToggle from "./translate-widget-toggle";
import { NavigationHeader } from "./navigation-header";

export default function TranslateHeaderWithWidget() {
  const [showTranslate, setShowTranslate] = useState(false);
  const [activeView, setActiveView] = useState("map");
  const [currentLanguage, setCurrentLanguage] = useState("en");

  return (
    <>
      <TranslateWidgetToggle show={showTranslate} />
      <NavigationHeader
        activeView={activeView}
        onViewChange={setActiveView}
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => {
          setCurrentLanguage(lang);
          if (lang === "en") setShowTranslate(true);
        }}
      />
    </>
  );
}

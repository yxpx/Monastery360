"use client"

import { useState, useEffect } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { MainContent } from "@/components/main-content"

export default function Home() {
  const [activeView, setActiveView] = useState("map")
  const [currentLanguage, setCurrentLanguage] = useState("en")

  useEffect(() => {
    // In a real implementation, this would load language resources
    console.log("Language changed to:", currentLanguage)
    document.documentElement.lang = currentLanguage
  }, [currentLanguage])

  // Service worker would be added in production build with proper PWA setup

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <NavigationHeader
        activeView={activeView}
        onViewChange={setActiveView}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <MainContent activeView={activeView} onViewChange={setActiveView} />
    </div>
  )
}

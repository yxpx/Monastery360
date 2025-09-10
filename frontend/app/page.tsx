"use client"

import { useState, useEffect } from "react"
import TranslateHeaderWithWidget from "@/components/translate-header-with-widget"
import { MainContent } from "@/components/main-content"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const [activeView, setActiveView] = useState("landing")
  const [showLanding, setShowLanding] = useState(true)

  const handleStartExploring = () => {
    setShowLanding(false)
    setActiveView("map")
  }

  const handleViewChange = (view: string) => {
    if (view === "landing") {
      setShowLanding(true)
    } else {
      setShowLanding(false)
    }
    setActiveView(view)
  }

  // Service worker would be added in production build with proper PWA setup

  if (showLanding) {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <TranslateHeaderWithWidget activeView={activeView} onViewChange={handleViewChange} />
        <LandingPage onStartExploring={handleStartExploring} />
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <TranslateHeaderWithWidget activeView={activeView} onViewChange={handleViewChange} />
      <MainContent activeView={activeView} onViewChange={handleViewChange} />
    </div>
  )
}

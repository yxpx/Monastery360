"use client"
import { Button } from "@/components/ui/button"
import { Calendar, Route, Download, HelpCircle, Github } from "lucide-react"
import { LanguageSelector } from "./language-selector"
import Image from "next/image"

interface NavigationHeaderProps {
  activeView: string
  onViewChange: (view: string) => void
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

export function NavigationHeader({
  activeView,
  onViewChange,
  currentLanguage,
  onLanguageChange,
}: NavigationHeaderProps) {
  const handleDownload = () => {
    if ("serviceWorker" in navigator) {
      // Trigger PWA install prompt or download app info
      console.log("[Download/Install PWA triggered")
    }
  }

  const handleHelp = () => {
    onViewChange("website-info")
  }

  const handleGithub = () => {
    window.open("https://github.com/yxpx/monastery360", "_blank", "noopener,noreferrer")
  }

  const handleLogoClick = () => {
    onViewChange("map")
  }

  return (
    <header
      className="w-full bg-card border-b border-border p-4 sm:p-6 flex-shrink-0"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          aria-label="Go to home page"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleLogoClick()
            }
          }}
        >
          <Image
            src="/logo.svg"
            alt="Monastery360 logo"
            width={48}
            height={48}
            className="rounded-lg shrink-0 scale-225"
            priority
          />
          <h1 className="text-xl sm:text-2xl leading-none font-semibold text-foreground heading-luxe">Monastery360</h1>
        </div>

        <nav className="flex items-center gap-2 relative" role="navigation" aria-label="Main navigation menu">
          <Button
            variant={activeView === "calendar" ? "default" : "outline"}
            size="default"
            onClick={() => onViewChange("calendar")}
            className="px-6 py-3 text-base font-medium rounded-lg transition-colors hidden sm:flex items-center gap-2"
            aria-label="View festival calendar"
          >
            <Calendar className="w-5 h-5" aria-hidden="true" />
            <span className="hidden md:inline">Calendar</span>
          </Button>

          <Button
            variant={activeView === "planner" ? "default" : "outline"}
            size="default"
            onClick={() => onViewChange("planner")}
            className="px-6 py-3 text-base font-medium rounded-lg transition-colors hidden sm:flex items-center gap-2"
            aria-label="View trip planner"
          >
            <Route className="w-5 h-5" aria-hidden="true" />
            <span className="hidden md:inline">Planner</span>
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={handleDownload}
            className="px-6 py-3 text-base font-medium rounded-lg transition-colors hidden sm:flex items-center gap-2"
            aria-label="Download or install Monastery360 app"
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            <span className="hidden md:inline">Download</span>
          </Button>
          
          <div className="relative z-50">
            <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={handleHelp}
            className="px-6 py-3 text-base font-medium rounded-lg transition-colors flex items-center gap-2"
            aria-label="Get help and information"
          >
            <HelpCircle className="w-5 h-5" aria-hidden="true" />
            <span className="hidden md:inline">Information</span>
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={handleGithub}
            className="px-6 py-3 text-base font-medium rounded-lg transition-colors hidden sm:flex items-center gap-2"
            aria-label="View source code on GitHub"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
            <span className="hidden md:inline">Github</span>
          </Button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav
        className="sm:hidden mt-4 flex gap-3 overflow-x-auto pb-2"
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        <Button
          variant={activeView === "map" ? "default" : "outline"}
          size="default"
          onClick={() => onViewChange("map")}
          className="flex-shrink-0 px-4 py-2"
          aria-label="View monastery map"
        >
          Map
        </Button>
        <Button
          variant={activeView === "planner" ? "default" : "outline"}
          size="default"
          onClick={() => onViewChange("planner")}
          className="flex-shrink-0 px-4 py-2"
          aria-label="View trip planner"
        >
          Planner
        </Button>
        <Button
          variant={activeView === "calendar" ? "default" : "outline"}
          size="default"
          onClick={() => onViewChange("calendar")}
          className="flex-shrink-0 px-4 py-2"
          aria-label="View festival calendar"
        >
          Calendar
        </Button>
        <Button
          variant={activeView === "qna" ? "default" : "outline"}
          size="default"
          onClick={() => onViewChange("qna")}
          className="flex-shrink-0 px-4 py-2"
          aria-label="View questions and AI guide"
        >
          Q&A
        </Button>
        <Button
          variant="outline"
          size="default"
          onClick={handleDownload}
          className="flex-shrink-0 px-4 py-2"
          aria-label="Download app"
        >
          Download
        </Button>
      </nav>
    </header>
  )
}
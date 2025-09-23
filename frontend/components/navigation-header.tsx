"use client"
import { Button } from "@/components/ui/button"
import { Calendar, Route, Download, HelpCircle, Github, Smartphone, Check } from "lucide-react"
import { LanguageSelector } from "./language-selector"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import Image from "next/image"

interface NavigationHeaderProps {
  activeView: string
  onViewChange: (view: string) => void
  currentLanguage: string
  onLanguageChange: (language: string) => void
  translateActive?: boolean
  onToggleTranslate?: () => void
}

export function NavigationHeader({
  activeView,
  onViewChange,
  currentLanguage,
  onLanguageChange,
  translateActive,
  onToggleTranslate,
}: NavigationHeaderProps) {
  const { 
    isInstallable, 
    isInstalled, 
    canInstall, 
    installApp, 
    showInstallInstructions 
  } = usePWAInstall()

  const handleDownload = async () => {
    if (isInstalled) {
      // App is already installed, show success message or open app
      alert("Monastery360 is already installed! You can find it in your app drawer or home screen.")
      return
    }

    if (canInstall) {
      // Browser supports native install prompt
      await installApp()
    } else if (isInstallable) {
      // Show manual installation instructions
      showInstallInstructions()
    } else {
      // Service worker not supported
      alert("Your browser doesn't support app installation. Please use a modern browser like Chrome, Firefox, or Safari.")
    }
  }

  const handleHelp = () => {
    onViewChange("website-info")
  }

  const handleGithub = () => {
    window.open("https://github.com/yxpx/monastery360", "_blank", "noopener,noreferrer")
  }

  const handleLogoClick = () => {
    onViewChange("landing")
  }

  return (
    <header
      className="w-full bg-card border-b border-border p-6 flex-shrink-0"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
          onClick={handleLogoClick}
          aria-label="Go to home page"
        >
          <Image
            src="/logo.svg"
            alt="Monastery360 logo"
            width={48}
            height={48}
            className="rounded-lg shrink-0 scale-225"
            priority
          />
          <h1 className="text-2xl leading-none font-semibold text-foreground heading-luxe">Monastery360</h1>
  </button>

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
            variant={isInstalled ? "default" : "outline"}
            size="default"
            onClick={handleDownload}
            className="px-6 py-3 text-base font-medium rounded-lg transition-colors hidden sm:flex items-center gap-2"
            aria-label={
              isInstalled 
                ? "Monastery360 is installed" 
                : canInstall 
                  ? "Install Monastery360 app" 
                  : "Download or install Monastery360 app"
            }
          >
            {isInstalled ? (
              <Check className="w-5 h-5" aria-hidden="true" />
            ) : canInstall ? (
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Download className="w-5 h-5" aria-hidden="true" />
            )}
            <span className="hidden md:inline">
              {isInstalled ? "Installed" : canInstall ? "Install" : "Download"}
            </span>
          </Button>
          
          <div className="relative z-50">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              translateActive={!!translateActive}
              onToggleTranslate={onToggleTranslate}
            />
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
        className="sm:hidden mt-6 flex gap-3 overflow-x-auto pb-2"
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
          variant={isInstalled ? "default" : "outline"}
          size="default"
          onClick={handleDownload}
          className="flex-shrink-0 px-4 py-2 flex items-center gap-2"
          aria-label={
            isInstalled 
              ? "Monastery360 is installed" 
              : canInstall 
                ? "Install Monastery360 app" 
                : "Download or install Monastery360 app"
          }
        >
          {isInstalled ? (
            <Check className="w-4 h-4" aria-hidden="true" />
          ) : canInstall ? (
            <Smartphone className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Download className="w-4 h-4" aria-hidden="true" />
          )}
          {isInstalled ? "Installed" : canInstall ? "Install" : "Download"}
        </Button>
      </nav>
    </header>
  )
}

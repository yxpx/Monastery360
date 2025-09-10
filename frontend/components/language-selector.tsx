"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Globe } from "lucide-react"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
  onToggleTranslate?: () => void;
  translateActive?: boolean;
}

export function LanguageSelector({ currentLanguage, onLanguageChange, onToggleTranslate, translateActive }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "ne", name: "Nepali", native: "नेपाली" },
  ]

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  return (
    <div className="relative">
      <Button
        variant={translateActive ? "default" : "outline"}
        size="default"
        onClick={() => {
          // If current is English, toggle the floating widget for one-click translate
          if (currentLang.code === "en" && onToggleTranslate) onToggleTranslate();
          else setIsOpen(!isOpen);
        }}
        className="px-6 py-3 text-base font-medium rounded-lg transition-colors flex items-center gap-2"
        aria-label={currentLang.code === "en" ? (translateActive ? "Hide Google Translate" : "Show Google Translate") : "Select language"}
        aria-pressed={translateActive}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-5 h-5" aria-hidden="true" />
  {currentLang.code === "en" ? "Language" : currentLang.name}
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-1 right-0 z-50 min-w-32 p-1 border border-border">
          <div role="listbox" aria-label="Available languages">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => {
                  onLanguageChange(language.code)
                  // Drive Google Translate once
                  if (language.code === "en") {
                    window.resetGoogleTranslate && window.resetGoogleTranslate();
                  } else {
                    window.setGoogleTranslateLanguage && window.setGoogleTranslateLanguage(language.code);
                  }
                  setIsOpen(false)
                }}
                role="option"
                aria-selected={language.code === currentLanguage}
              >
                <div>
                  <div className="font-medium">{language.name}</div>
                  <div className="text-xs text-muted-foreground">{language.native}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
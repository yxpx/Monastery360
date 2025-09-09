"use client";

import { useEffect } from "react";

// Extend window type for Google Translate
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export default function GoogleTranslateWrapper() {
  useEffect(() => {
    // Google Translate callback
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
      }
    };

    // Inject Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.type = "text/javascript";
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return null; // This component does not render any visible content
}

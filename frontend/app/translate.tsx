"use client";

import { useEffect } from "react";

// Extend window type for Google Translate
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
    setGoogleTranslateLanguage?: (lang: string) => void;
    resetGoogleTranslate?: () => void;
  }
}

export default function GoogleTranslateWrapper() {
  useEffect(() => {
    // Ensure a single container exists for the widget so the script can mount
    let widgetEl = document.getElementById("google_translate_element");
    if (!widgetEl) {
      widgetEl = document.createElement("div");
      widgetEl.id = "google_translate_element";
      // Important: don't use display:none at init; it makes Google render a long language list.
      // Keep it offscreen but visible so it initializes as a dropdown.
      widgetEl.style.position = "fixed";
      widgetEl.style.top = "-9999px";
      widgetEl.style.left = "-9999px";
      widgetEl.style.visibility = "hidden";
      document.body.appendChild(widgetEl);
    }

    // Google Translate callback
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false, // don't auto-show banners
          },
          "google_translate_element"
        );
      }
    };

    // Inject Google Translate script
    const existing = document.querySelector(
      'script[src^="https://translate.google.com/translate_a/element.js"]'
    ) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.type = "text/javascript";
    if (!existing) {
      document.body.appendChild(script);
    }

    // Helper: set the googtrans cookie and try to switch without reload
    function setCookie(name: string, value: string) {
      const domain = window.location.hostname;
      const path = "/";
      // Set for current domain
      document.cookie = `${name}=${value}; path=${path}`;
      // Also set for top-level domain if applicable
      if (domain.indexOf(".") > -1) {
        document.cookie = `${name}=${value}; domain=.${domain}; path=${path}`;
      }
    }

    function deleteCookie(name: string) {
      const domain = window.location.hostname;
      const path = "/";
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
      if (domain.indexOf(".") > -1) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.${domain}; path=${path}`;
      }
    }

    function findTranslateSelect(): HTMLSelectElement | null {
      // The combo lives in the DOM, not inside an iframe for the new element.
      return document.querySelector("select.goog-te-combo");
    }

  // Note: We rely on Google Translate to handle dynamic content automatically when active.

    window.setGoogleTranslateLanguage = (lang: string) => {
      // Update cookies for Google Translate
  setCookie("googtrans", `/en/${lang}`);

      // Try to switch via the dropdown if available (no full reload)
      const select = findTranslateSelect();
      if (select) {
        if (select.value !== lang) {
          select.value = lang;
          select.dispatchEvent(new Event("change"));
        }
      } else {
        // Fallback: reload to let the script pick up cookies
        window.location.reload();
      }
      // Update <html lang>
      document.documentElement.setAttribute("lang", lang);
    };

    window.resetGoogleTranslate = () => {
      deleteCookie("googtrans");
      // Attempt to reset via select first
      const select = findTranslateSelect();
      if (select) {
        select.value = "";
        select.dispatchEvent(new Event("change"));
      } else {
        window.location.reload();
      }
  document.documentElement.setAttribute("lang", "en");
    };

    // Cleanup function
    return () => {
      // Keep the script loaded across the app lifetime; don't remove it.
      delete window.googleTranslateElementInit;
    };
  }, []);

  return null; // This component does not render any visible content
}
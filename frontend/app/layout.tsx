import type { ReactNode } from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import Translate from "./translate"; // Import the new component
// import TextToSpeech from "../components/TextToSpeech";
// Import AudioGuideTTS for section-based TTS
import AudioGuideTTS from "../components/AudioGuideTTS";

export const metadata: Metadata = {
  title: "Monastery360",
  description: "Interactive PWA for exploring Sikkim monasteries with 360° tours and cultural insights",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Your head content remains the same */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon1.png" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Google Translate widget container */}
        <div id="google_translate_element" style={{ position: "fixed", top: 0, right: 0, zIndex: 9999 }} />
        {/* Render the new client component */}
        <Translate />
        {/* Example usage of AudioGuideTTS: place this in your audio guide section, not globally */}
        {/* <AudioGuideTTS text="This is the audio guide text to be read aloud." /> */}
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        />
      </body>
    </html>
  );
}

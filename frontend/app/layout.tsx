import React, { Suspense } from "react"
import type { Metadata } from "next"
// Removed Analytics import due to missing module/types
import "./globals.css"
import Translate from "./translate"

export const metadata: Metadata = {
  title: "Monastery360 - Sikkim Monastery Explorer",
  description: "Interactive PWA for exploring Sikkim monasteries with 360° tours and cultural insights",
  manifest: "/manifest.json",
  themeColor: "#1a1a1a",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Monastery360",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Monastery360",
    title: "Monastery360 - Sikkim Monastery Explorer",
    description: "Interactive PWA for exploring Sikkim monasteries with 360° tours and cultural insights",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monastery360 - Sikkim Monastery Explorer",
    description: "Interactive PWA for exploring Sikkim monasteries with 360° tours and cultural insights",
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Monastery360" />
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
  <body className="font-sans">
  <Suspense fallback={null}>{children}</Suspense>
  {/* Mount Google Translate initializer once globally */}
  <Translate />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        />
      </body>
    </html>
  )
}

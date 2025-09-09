"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, ExternalLink, Image as ImageIcon, Map, Volume2 } from "lucide-react"
import AudioGuideTTS from "./AudioGuideTTS"
import Image from "next/image"

interface Monastery {
  id: number
  name: string
  coords: string
  map_url: string
  embed_link: string
  s_desc: string
  l_desc: string
}

interface MonasteryDetailViewProps {
  monastery: Monastery
  onBack: () => void
}

export function MonasteryDetailView({ monastery, onBack }: MonasteryDetailViewProps) {
  const [imageError, setImageError] = useState(false)
  const [streetViewError, setStreetViewError] = useState(false)
  const [activeView, setActiveView] = useState<'image' | '360'>('image')

  const getLocationFromCoords = (coords: string) => {
    if (!coords || coords.trim() === "") return "Location Unknown"
    
    const [lat, lng] = coords.split(',').map(coord => parseFloat(coord.trim()))
    
    if (lat >= 27.5) return "North Sikkim"
    if (lat >= 27.2 && lat < 27.5) {
      if (lng >= 88.5) return "East Sikkim"
      return "South Sikkim"
    }
    return "West Sikkim"
  }

  const hasEmbedLink = monastery.embed_link && 
    monastery.embed_link.trim() !== "" && 
    monastery.embed_link !== "-" && 
    monastery.embed_link !== "--" &&
    monastery.embed_link.includes("iframe")

  return (
    <div className="h-full flex flex-col min-h-0 max-h-full">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">{monastery.name}</h1>
          <p className="text-sm text-muted-foreground">{getLocationFromCoords(monastery.coords)}</p>
        </div>
        {monastery.map_url && monastery.map_url !== "" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(monastery.map_url, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View on Map
          </Button>
          )}
        </div>

      {/* Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
        {/* Image/360 View Section */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Card className="flex-1 p-4 bg-card border border-border rounded-lg flex flex-col min-h-0">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-2 flex-shrink-0">
              <Button
                variant={activeView === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('image')}
                className="flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Image
              </Button>
              <Button
                variant={activeView === '360' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('360')}
                className="flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                360° View
              </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 p-4 overflow-hidden">
              {activeView === 'image' ? (
                imageError ? (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Image not available</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Image file: {monastery.id}.png
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative max-w-full max-h-full aspect-auto">
                      <Image
                        src={`/data/monastery/${monastery.id}.png`}
                        alt={`${monastery.name} monastery`}
                        width={800}
                        height={600}
                        className="object-contain rounded-lg max-w-full max-h-full"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                      />
                    </div>
                  </div>
                )
              ) : (
                // 360° View Content
                streetViewError || !hasEmbedLink ? (
                  <div className="text-center">
                    <Map className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">360° view not available</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {monastery.map_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(monastery.map_url, '_blank')}
                          className="mt-2"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Google Maps
                        </Button>
                      ) : (
                        "No 360° data available"
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div 
                      className="w-full h-full max-w-[95%] max-h-[95%] rounded-lg overflow-hidden border"
                      dangerouslySetInnerHTML={{ 
                        __html: monastery.embed_link.replace(
                          'width="600" height="450"', 
                          'width="100%" height="100%" style="min-height:400px;"'
                        )
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </Card>
        </div>

        {/* Description and Audio Section */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4 min-h-0">
          {/* Description Section - Scrollable */}
          <Card className="flex-1 p-4 bg-card border border-border rounded-lg flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 pr-2 min-h-0">
              {monastery.l_desc ? (
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {monastery.l_desc}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic text-center py-8">
                  No description available for this monastery.
                </div>
              )}
            </div>
          </Card>

          {/* Audio Stream Section */}
          <Card className="p-4 bg-card border border-border rounded-lg flex-shrink-0">
            <div className="space-y-3">
              <AudioGuideTTS text={monastery.l_desc || "No description available for this monastery."} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
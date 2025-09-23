"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, ExternalLink, Image as ImageIcon, Map, Volume2 } from "lucide-react"
import Image from "next/image"
import AudioGuideTTS from "@/components/audio-guide"

interface Monastery {
  id: number
  name: string
  coords: string
  map_url: string
  embed_link: string
  booking?: string
  s_desc: string
  l_desc: string
}

interface MonasteryDetailViewProps {
  monastery: Monastery
  onBack: () => void
}

export function MonasteryDetailView({ monastery, onBack }: MonasteryDetailViewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>(`/data/monastery/${monastery.id}.png`)
  const [activeView, setActiveView] = useState<'image' | '360' | 'interior'>('image')
  const [interiorAvailable, setInteriorAvailable] = useState<boolean>(false)
  const [interiorImageSrc, setInteriorImageSrc] = useState<string | null>(null)

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

  // Always allow both image and 360° view for monastery entries
  // Determine if this item is an archive (no valid iframe embed)
  const hasEmbedLink = monastery.embed_link && monastery.embed_link.includes('<iframe')

  // Known interior 360 iframes shared by user (interior-specific views)
  const interiorEmbeds: Record<number, string> = useMemo(() => ({
    9: '<iframe src="https://www.google.com/maps/embed?pb=!4v1757449828599!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRHF5N0tadUFF!2m2!1d27.31301918268649!2d88.6045482341578!3f230.4072667429632!4f-10.457691964156524!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    53: '<iframe src="https://www.google.com/maps/embed?pb=!4v1757450511611!6m8!1m7!1sCAoSFENJSE0wb2dLRUlDQWdJREp2b0VI!2m2!1d27.36903851299968!2d88.61320069409064!3f32.184572992285894!4f3.316719902511579!5f0.4000000000000002" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    57: '<iframe src="https://www.google.com/maps/embed?pb=!4v1757451176842!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0d2OHItZ3dF!2m2!1d27.34783476133961!2d88.62869602800377!3f2.6003379735170427!4f9.682297601638993!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    171: '<iframe src="https://www.google.com/maps/embed?pb=!4v1757452339736!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGg0OURqV3c.!2m2!1d27.41303405816734!2d88.58375766744783!3f179.95496974279092!4f-14.895188395082556!5f0.4000000000000002" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    176: '<iframe src="https://www.google.com/maps/embed?pb=!4v1757452457944!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRF91ZnoteXdF!2m2!1d27.32849856209447!2d88.33547316295622!3f259.29373068943875!4f1.7535912081229554!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    195: '<iframe src="https://www.google.com/maps/embed?pb=!4v1757452812776!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2tzTVh5b0FF!2m2!1d27.2886859898702!2d88.56146202338051!3f75.40243916770442!4f-4.451890368389286!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    202: '<iframe width="560" height="315" src="https://www.youtube.com/embed/w2B2BE81v9A?si=1UvYi1vaOAJ1RkPs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
  }), [])
  // Make any iframe embed responsive (replace fixed width/height)
  const toResponsive = (html: string) =>
    html.replace(/width="\d+"\s+height="\d+"/i, 'width="100%" height="100%" style="min-height:400px;"')


  const hasInteriorEmbed = !!interiorEmbeds[monastery.id]

  // Preload/check interior image (_x) availability and set interiorAvailable flag
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    // Reset on monastery change
    setInteriorAvailable(false)
    setInteriorImageSrc(null)

    const check = async () => {
      // If we already have an interior iframe, it's available
      if (hasInteriorEmbed) {
        if (!cancelled) setInteriorAvailable(true)
        return
      }
      // Otherwise, probe for _x image (png then jpg) using HEAD
      const png = `/data/monastery/${monastery.id}_x.png`
      const jpg = `/data/monastery/${monastery.id}_x.jpg`
      try {
        const resPng = await fetch(png, { method: 'HEAD', signal: controller.signal })
        if (resPng.ok) {
          if (!cancelled) {
            setInteriorImageSrc(png)
            setInteriorAvailable(true)
          }
          return
        }
      } catch {}
      try {
        const resJpg = await fetch(jpg, { method: 'HEAD', signal: controller.signal })
        if (resJpg.ok && !cancelled) {
          setInteriorImageSrc(jpg)
          setInteriorAvailable(true)
          return
        }
      } catch {}
      if (!cancelled) {
        setInteriorImageSrc(null)
        setInteriorAvailable(false)
      }
    }

    check()
    return () => { cancelled = true; controller.abort() }
  }, [monastery.id, hasInteriorEmbed])

  // Fallback to .jpg if primary .png image fails
  useEffect(() => {
    setImageError(false)
    setImageSrc(`/data/monastery/${monastery.id}.png`)
  }, [monastery.id])

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
          <span className="notranslate" translate="no">Back to Map</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">{monastery.name}</h1>
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
            {/* Toggle between image and 360° view */}
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
              {interiorAvailable && (
                <Button
                  variant={activeView === 'interior' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('interior')}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Interior
                </Button>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 p-4 overflow-hidden">
              {activeView === 'image' ? (
                imageError ? (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Image not available</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Image file: {monastery.id}.png/.jpg
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative max-w-full max-h-full aspect-auto">
                      <Image
                        src={imageSrc}
                        alt={`${monastery.name} monastery`}
                        width={800}
                        height={600}
                        className="object-contain rounded-lg max-w-full max-h-full"
                        onError={() => {
                          if (imageSrc.endsWith('.png')) {
                            setImageSrc(`/data/monastery/${monastery.id}.jpg`)
                          } else {
                            setImageError(true)
                          }
                        }}
                        onLoad={() => setImageError(false)}
                      />
                    </div>
                  </div>
                )
              ) : (
                activeView === '360' ? (
                  hasEmbedLink ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="w-full h-full max-w-[95%] max-h-[95%] rounded-lg overflow-hidden border"
                          dangerouslySetInnerHTML={{
                            __html: toResponsive(monastery.embed_link),
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Map className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">360° view not available</p>
                    </div>
                  )
                ) : interiorAvailable ? (
                  <div className="w-full h-full flex items-center justify-center">
        {hasInteriorEmbed ? (
                      <div
                        className="w-full h-full max-w-[95%] max-h-[95%] rounded-lg overflow-hidden border"
                        dangerouslySetInnerHTML={{
          __html: toResponsive(interiorEmbeds[monastery.id]),
                        }}
                      />
                    ) : interiorImageSrc ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative max-w-full max-h-full aspect-auto">
                          <Image
                            src={interiorImageSrc}
                            alt={`${monastery.name} interior`}
                            width={800}
                            height={600}
                            className="object-contain rounded-lg max-w-full max-h-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Map className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Interior not available</p>
                      </div>
                    )}
                  </div>
                ) : null
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
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap" id="monastery-desc">
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
            <AudioGuideTTS text={monastery.l_desc || monastery.s_desc} selector="#monastery-desc" />
          </Card>
        </div>
      </div>
    </div>
  )
}
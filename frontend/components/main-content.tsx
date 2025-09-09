"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { InteractiveMap } from "./interactive-map"
import { MonasteryDetailView } from "./monastery-detail-view"
import { MonasteryList } from "./monastery-list"
import { TripPlanner } from "./trip-planner"
import { FestivalCalendar } from "./festival-calendar"
import { HolidayInfoPanel } from "./holiday-info-panel"
import { BasicQNA } from "./basic-qna"
import { AITripGuide } from "./ai-trip-guide"
import { WebsiteInfo } from "./website-info"

interface Monastery {
  id: number
  name: string
  coords: string
  map_url: string
  embed_link: string
  s_desc: string
  l_desc: string
}

interface MainContentProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function MainContent({ activeView, onViewChange }: MainContentProps) {
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null)
  const [showMonasteryDetail, setShowMonasteryDetail] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [locationFunction, setLocationFunction] = useState<(() => void) | null>(null)

  const handleMonasterySelect = (monastery: Monastery) => {
    setSelectedMonastery(monastery)
    setShowMonasteryDetail(true)
  }

  const handleMonasteryZoom = (monastery: Monastery) => {
    // This will zoom the map to the monastery location
    if (mapInstance && monastery.coords) {
      const [lat, lng] = monastery.coords.split(',').map((coord: string) => parseFloat(coord.trim()))
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstance.setView([lat, lng], 15)
      }
    }
  }

  const handleBackToMap = () => {
    setShowMonasteryDetail(false)
    setSelectedMonastery(null)
  }

  const handleLocationClick = () => {
    // Trigger location functionality in the InteractiveMap
    if (locationFunction && typeof locationFunction === 'function') {
      try {
        locationFunction()
      } catch (error) {
        console.error('Error calling location function:', error)
        alert('Unable to access location. Please try again.')
      }
    } else {
      console.warn('Location function not available yet')
      alert('Map is still loading. Please wait a moment and try again.')
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case "map":
        if (showMonasteryDetail && selectedMonastery) {
          return <MonasteryDetailView monastery={selectedMonastery} onBack={handleBackToMap} />
        }

        return (
          <div className="flex flex-col sm:flex-row gap-3 h-full p-2">
            <div className="flex-1 min-w-0">
              <Card className="h-full p-3 bg-card border border-border rounded-lg">
                <InteractiveMap
                  onMonasterySelect={(monastery) => {
                    handleMonasterySelect(monastery)
                  }}
                  onMapReady={setMapInstance}
                  onLocationRequest={() => console.log("Location requested from map")}
                  onLocationFunctionReady={setLocationFunction}
                />
              </Card>
            </div>

            <div className="w-full sm:w-80 flex-shrink-0 mt-3 sm:mt-0">
              <MonasteryList
                onMonasterySelect={handleMonasterySelect}
                onMonasteryZoom={handleMonasteryZoom}
                onLocationClick={handleLocationClick}
                onAudioClick={(monastery) => {
                  handleMonasterySelect(monastery)
                }}
              />
            </div>
          </div>
        )

      case "planner":
        return (
          <div className="flex gap-2 h-full p-2">
            <div className="flex-1 min-w-0">
              <Card className="h-full p-4 bg-card border border-border rounded-lg">
                <TripPlanner />
              </Card>
            </div>
          </div>
        )

      case "calendar":
        return (
          <div className="flex flex-col sm:flex-row gap-2 h-full p-2">
            <div className="flex-1 min-w-0">
              <Card className="h-full p-4 bg-card border border-border rounded-lg overflow-hidden">
                <FestivalCalendar />
              </Card>
            </div>
            <div className="w-full sm:w-80 flex-shrink-0 mt-2 sm:mt-0">
              <HolidayInfoPanel />
            </div>
          </div>
        )

      case "qna":
        return (
          <div className="flex flex-col sm:flex-row gap-2 h-full p-2">
            <div className="flex-1 min-w-0">
              <Card className="h-full p-4 bg-card border border-border rounded-lg overflow-hidden">
                <BasicQNA />
              </Card>
            </div>
            <div className="flex-1 min-w-0 mt-2 sm:mt-0">
              <Card className="h-full p-4 bg-card border border-border rounded-lg overflow-hidden">
                <AITripGuide />
              </Card>
            </div>
          </div>
        )

      case "website-info":
        return (
          <Card className="w-full h-full p-4 bg-card border border-border rounded-lg overflow-hidden">
            <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
              <WebsiteInfo />
            </div>
          </Card>
        )

      default:
        return (
          <Card className="w-full h-full p-4 flex items-center justify-center bg-card border border-border rounded-lg">
            <p className="text-muted-foreground">Select a view to get started</p>
          </Card>
        )
    }
  }

  return (
    <main className="flex-1 h-full overflow-hidden" role="main" aria-label="Main application content">
      {renderContent()}
    </main>
  )
}
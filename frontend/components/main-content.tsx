"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { InteractiveMap } from "./interactive-map"
import { MonasteryDetailView } from "./monastery-detail-view"
import { MonasteryList } from "./monastery-list"
import { TripPlanner } from "./trip-planner"
import { FestivalCalendar } from "./festival-calendar"
import { BasicQNA } from "./basic-qna"
import { AITripGuide } from "./ai-trip-guide"
import { WebsiteInfo } from "./website-info"
import { ArchiveDetailView } from "./archive-detail-view"
import { ServiceDetailView } from "./service-detail-view"

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
  // Category tab state and selected item/detail state
  const [activeCategoryTab, setActiveCategoryTabState] = useState<'Monastery'|'Archive'|'Services'>('Monastery')
  const [selectedCategory, setSelectedCategory] = useState<typeof activeCategoryTab | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [locationFunction, setLocationFunction] = useState<(() => void) | null>(null)


  // Generic selector for any category
  const handleItemSelect = (item: any, category: typeof activeCategoryTab) => {
    setSelectedItem(item)
    setSelectedCategory(category)
    setShowDetail(true)
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
    setShowDetail(false)
    setSelectedItem(null)
    setSelectedCategory(null)
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
        // Show selected detail view based on category
        if (showDetail && selectedItem && selectedCategory) {
          switch (selectedCategory) {
            case 'Monastery':
              return <MonasteryDetailView monastery={selectedItem} onBack={handleBackToMap} />
            case 'Archive':
              return <ArchiveDetailView archive={selectedItem} onBack={handleBackToMap} />
            case 'Services':
              return <ServiceDetailView service={selectedItem} onBack={handleBackToMap} />
          }
        }
        return (
          <div className="flex gap-3 h-full p-2">
            <div className="flex-1 min-w-0">
              <Card className="h-full p-3 bg-card border border-border rounded-lg">
                <InteractiveMap
                  onMonasterySelect={(item) => handleItemSelect(item, 'Monastery')}
                  onMapReady={setMapInstance}
                  onLocationRequest={() => console.log("Location requested from map")}
                  onLocationFunctionReady={(fn) => setLocationFunction(() => fn)}
                />
              </Card>
            </div>

            <div className="w-80 flex-shrink-0">
              <MonasteryList
                  activeCategory={activeCategoryTab}
                  onCategoryChange={(tab) => {
                    // switch tabs and clear any detail selection
                    setActiveCategoryTabState(tab)
                    setShowDetail(false)
                    setSelectedCategory(null)
                    setSelectedItem(null)
                  }}
                onItemSelect={handleItemSelect}
                onMonasteryZoom={handleMonasteryZoom}
                onLocationClick={handleLocationClick}
                onAudioClick={(item) => handleItemSelect(item, activeCategoryTab)}
              />
            </div>
          </div>
        )

      case "planner":
        return (
          <div className="flex gap-2 h-full">
            <div className="flex-1 min-w-0">
              <Card className="h-full p-4 bg-card border border-border rounded-lg">
                <TripPlanner />
              </Card>
            </div>
          </div>
        )

      case "calendar":
        return (
          <Card className="w-full h-full p-4 bg-card border border-border rounded-lg overflow-hidden">
            <FestivalCalendar />
          </Card>
        )

      case "qna":
        return (
          <div className="flex gap-2 h-full">
            <div className="flex-1 min-w-0">
              <Card className="h-full p-4 bg-card border border-border rounded-lg overflow-hidden">
                <BasicQNA />
              </Card>
            </div>
            <div className="flex-1 min-w-0">
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

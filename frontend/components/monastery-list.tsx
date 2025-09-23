"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Volume2, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Monastery {
  id: number
  name: string
  coords: string
  map_url: string
  embed_link: string
  s_desc: string
  l_desc: string
}

interface MonasteryListProps {
  // Controlled category from parent
  activeCategory: 'Monastery' | 'Archive' | 'Services'
  onCategoryChange: (category: 'Monastery' | 'Archive' | 'Services') => void
  // Generic item select callback
  onItemSelect: (item: any, category: 'Monastery' | 'Archive' | 'Services') => void
  onMonasteryZoom: (monastery: Monastery) => void
  onLocationClick: () => void
  onAudioClick: (monastery: Monastery) => void
}

export function MonasteryList({
  activeCategory,
  onCategoryChange,
  onItemSelect,
  onMonasteryZoom,
  onLocationClick,
  onAudioClick,
}: MonasteryListProps) {
  const [monasteryData, setMonasteryData] = useState<Monastery[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [archivesData, setArchivesData] = useState<any[]>([])
  const [servicesData, setServicesData] = useState<any[]>([])
  const [loadingArchives, setLoadingArchives] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    const fetchMonasteryData = async () => {
      try {
        console.log('Fetching monastery data from /data/monastery.json')
        const response = await fetch('/data/monastery.json')
        console.log('Response status:', response.status)
        const data = await response.json()
        console.log('Raw data loaded:', data.length, 'items')
        // Filter out entries with empty names or descriptions
        const filteredData = data.filter((monastery: Monastery) => 
          monastery.name && monastery.name.trim() !== ""
        )
        console.log('Filtered data:', filteredData.length, 'items')
        setMonasteryData(filteredData)
      } catch (error) {
        console.error('Error loading monastery data:', error)
        setMonasteryData([])
      } finally {
        setLoading(false)
      }
    }

    fetchMonasteryData()
  }, [])

  // Load archives.json
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const res = await fetch('/data/archives.json')
        const data = await res.json()
        setArchivesData(data)
      } catch (e) {
        console.error('Error loading archives:', e)
      } finally {
        setLoadingArchives(false)
      }
    }
    fetchArchives()
  }, [])

  // Load services.json
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/data/services.json')
        const data = await res.json()
        setServicesData(data)
      } catch (e) {
        console.error('Error loading services:', e)
      } finally {
        setLoadingServices(false)
      }
    }
    fetchServices()
  }, [])

  const getCurrentItems = () => {
    let items: any[] = []
    switch (activeCategory) {
      case "Monastery":
        items = monasteryData
        break
      case "Archive":
        items = archivesData
        break
      case "Services":
        items = servicesData
        break
      default:
        items = monasteryData
    }
    // Filter by search term across name and description fields
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      items = items.filter(item => {
        const text = [item.name, item.s_desc, item.l_desc, item.desc]
          .filter(Boolean)
          .join(' ')  .toLowerCase()
        return text.includes(term)
      })
    }
    return items
  }

  const getLocationFromCoords = (coords: string) => {
    if (!coords || coords.trim() === "") return "Location Unknown"
    
    // Parse coordinates to determine region
    const [lat, lng] = coords.split(',').map((coord: string) => parseFloat(coord.trim()))
    
    if (lat >= 27.5) return "North Sikkim"
    if (lat >= 27.2 && lat < 27.5) {
      if (lng >= 88.5) return "East Sikkim"
      return "South Sikkim"
    }
    return "West Sikkim"
  }

  // Function to clean monastery name (remove location suffixes)
  const cleanMonasteryName = (name: string) => {
    // Remove common location suffixes
    return name.replace(/\s+(North|South|East|West)\s+Sikkim$/, '')
                 .replace(/\s+Sikkim$/, '')
                 .trim()
  }

  return (
    <Card
      className="p-4 border border-border rounded-lg h-full flex flex-col"
      role="complementary"
      aria-label="Monastery and cultural site listings"
    >
      {/* Category Tabs */}
      <div className="flex gap-1 mb-2" role="tablist" aria-label="Content categories">
        {['Monastery', 'Archive', 'Services'].map((tab) => (
          <Button
            key={tab}
            variant={tab === activeCategory ? 'default' : 'outline'}
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={() => onCategoryChange(tab as any)}
            role="tab"
            aria-selected={tab === activeCategory}
            aria-controls={`${tab.toLowerCase()}-panel`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Search Input - compact spacing */}
      <div className="relative mb-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Search ${activeCategory.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-7 h-7 text-xs bg-secondary/50 border-secondary-foreground/20 focus:border-primary/50 focus:bg-background py-0"
        />
      </div>

      <div
        className="flex-1 overflow-y-auto mb-3 space-y-2 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
        role="tabpanel"
        id={`${activeCategory.toLowerCase()}-panel`}
      >
        {(activeCategory === 'Monastery' && loading) ||
         (activeCategory === 'Archive' && loadingArchives) ||
         (activeCategory === 'Services' && loadingServices) ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading {activeCategory.toLowerCase()}...</div>
          </div>
        ) : getCurrentItems().length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">No {activeCategory.toLowerCase()} found</div>
          </div>
        ) : (
          getCurrentItems().map((item) => (
            <Card
              key={item.id}
              className="p-3 bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors group"
              role="button"
              tabIndex={0}
              aria-label={`${activeCategory === "Monastery" ? cleanMonasteryName(item.name) : item.name}`}
            >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <button
                      type="button"
                      className="w-full text-left bg-transparent border-0 p-0 cursor-pointer"
                      onClick={() => {
                        if (activeCategory === 'Monastery') {
                          onMonasteryZoom(item)
                        } else {
                          onItemSelect(item, activeCategory)
                        }
                      }}
                      aria-label={activeCategory === "Monastery" ? `Zoom to ${cleanMonasteryName(item.name)}` : `Select ${item.name}`}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {activeCategory === "Monastery" ? cleanMonasteryName(item.name) : item.name}
                      </p>
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onItemSelect(item, activeCategory)
                    }}
                    aria-label={`Open 360 view of ${item.name}`}
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 border-none"
          onClick={onLocationClick}
          aria-label="Show current location on map"
          disabled={loading}
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          Location
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1 flex items-center gap-2"
          onClick={() => {
            const currentItems = getCurrentItems()
            if (currentItems.length > 0) {
              onAudioClick(currentItems[0])
            }
          }}
          aria-label="Play audio guide for selected content"
        >
          <Volume2 className="w-4 h-4" aria-hidden="true" />
          AUDIO STREAM
        </Button>
      </div>
    </Card>
  )
}

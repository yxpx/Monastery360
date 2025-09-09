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
  onMonasterySelect: (monastery: Monastery) => void
  onMonasteryZoom: (monastery: Monastery) => void
  onLocationClick: () => void
  onAudioClick: (monastery: Monastery) => void
}

export function MonasteryList({
  onMonasterySelect,
  onMonasteryZoom,
  onLocationClick,
  onAudioClick,
}: MonasteryListProps) {
  const [activeCategory, setActiveCategory] = useState("Monastery")
  const [monasteryData, setMonasteryData] = useState<Monastery[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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
          monastery.name && monastery.name.trim() !== "" &&
          monastery.s_desc && monastery.s_desc.trim() !== ""
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

  const archives = [
    { id: 6, name: "Buddhist Manuscripts", location: "Digital Archive", type: "Archive" },
    { id: 7, name: "Historical Artifacts", location: "Digital Archive", type: "Archive" },
    { id: 8, name: "Traditional Paintings", location: "Digital Archive", type: "Archive" },
  ]

  const others = [
    { id: 9, name: "Meditation Centers", location: "Various", type: "Others" },
    { id: 10, name: "Pilgrimage Routes", location: "Sikkim", type: "Others" },
    { id: 11, name: "Cultural Sites", location: "Various", type: "Others" },
  ]

  const getCurrentItems = () => {
    let items: any[] = []
    switch (activeCategory) {
      case "Monastery":
        items = monasteryData
        break
      case "Archive":
        items = archives
        break
      case "Others":
        items = others
        break
      default:
        items = monasteryData
        break
    }
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.s_desc && item.s_desc.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.desc && item.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      )
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
        {["Monastery", "Archive", "Others"].map((tab) => (
          <Button
            key={tab}
            variant={tab === activeCategory ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={() => {
              setActiveCategory(tab)
              setSearchTerm("") // Reset search when switching categories
            }}
            role="tab"
            aria-selected={tab === activeCategory}
            aria-controls={`${tab.toLowerCase()}-panel`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Search ${activeCategory.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-7 h-7 text-xs bg-secondary/50 border-secondary-foreground/20 focus:border-primary/50 focus:bg-background py-1"
        />
      </div>

      <div
        className="flex-1 overflow-y-auto mb-3 space-y-2 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
        role="tabpanel"
        id={`${activeCategory.toLowerCase()}-panel`}
        aria-label={`${activeCategory} listings`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading monasteries...</div>
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
              aria-label={`${activeCategory === "Monastery" ? cleanMonasteryName(item.name) : item.name} in ${activeCategory === "Monastery" ? getLocationFromCoords((item as Monastery).coords) : (item as any).location}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onMonasteryZoom(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onMonasteryZoom(item)
                    }
                  }}
                >
                  <p className="text-sm font-medium text-foreground">{activeCategory === "Monastery" ? cleanMonasteryName(item.name) : item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeCategory === "Monastery" ? getLocationFromCoords((item as Monastery).coords) : (item as any).location}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMonasterySelect(item)
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
      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center sm:justify-start gap-2 bg-transparent"
          onClick={onLocationClick}
          aria-label="Show current location on map"
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Location</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => {
            const currentItems = getCurrentItems()
            if (currentItems.length > 0) {
              onAudioClick(currentItems[0])
            }
          }}
          aria-label="Play audio guide for selected content"
        >
          <Volume2 className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">AUDIO STREAM</span>
        </Button>
      </div>
    </Card>
  )
}
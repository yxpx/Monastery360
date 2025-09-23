"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"

// Monastery data will be loaded from the JSON file

interface InteractiveMapProps {
  onMonasterySelect?: (monastery: any) => void
  onMapReady?: (map: any) => void
  onLocationRequest?: () => void
  onLocationFunctionReady?: (locationFunction: () => void) => void
}

export function InteractiveMap({ onMonasterySelect, onMapReady, onLocationRequest, onLocationFunctionReady }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedMonastery, setSelectedMonastery] = useState<any>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [monasteryData, setMonasteryData] = useState<any[]>([])
  const isMapInitializedRef = useRef(false)
  const [mapKey, setMapKey] = useState(0) // Add a key for forcing remount
  const sikkimBoundsRef = useRef<any>(null) // Store Sikkim bounds for reset
  const [userLocation, setUserLocation] = useState<any>(null)
  const [nearbyCircle, setNearbyCircle] = useState<any>(null)
  const [archiveData, setArchiveData] = useState<any[]>([])
  const [servicesData, setServicesData] = useState<any[]>([])
  const dataProcessedRef = useRef(false) // Track if data has been processed
  const [interiorIds, setInteriorIds] = useState<number[]>([])
  const monasteryLayerRef = useRef<any>(null)

  // Cleanup function
  const cleanupMap = () => {
    if (mapInstance) {
      console.log('InteractiveMap: Cleaning up map instance')
      try {
        mapInstance.remove()
      } catch (e) {
        console.log('InteractiveMap: Error during cleanup:', e)
      }
      setMapInstance(null)
    }
    
    const container = mapRef.current
    if (container) {
      try {
        delete (container as any)._leaflet_id
        container.innerHTML = ''
        // Reset any forced styles
        container.style.width = ''
        container.style.height = ''
      } catch (e) {
        console.log('InteractiveMap: Error cleaning container:', e)
      }
    }
    
    isMapInitializedRef.current = false
    dataProcessedRef.current = false
  }

  // Force map recreation if needed
  const resetMap = () => {
    cleanupMap()
    setMapKey(prev => prev + 1)
  }

  useEffect(() => {
    const fetchMonasteryData = async () => {
      try {
        console.log('InteractiveMap: Fetching monastery data from /data/monastery.json')
        const response = await fetch('/data/monastery.json')
        console.log('InteractiveMap: Response status:', response.status)
        const data = await response.json()
        console.log('InteractiveMap: Raw data loaded:', data.length, 'items')
        // Filter out entries with empty names, descriptions, or coordinates
        const filteredData = data.filter((monastery: any) => 
          monastery.name && monastery.name.trim() !== "" && 
          monastery.coords && monastery.coords.trim() !== ""
        )
        console.log('InteractiveMap: Filtered data:', filteredData.length, 'items')
        setMonasteryData(filteredData)
      } catch (error) {
        console.error('InteractiveMap: Error loading monastery data:', error)
        setMonasteryData([])
      }
    }

  fetchMonasteryData()
    // fetch archives.json
    ;(async () => {
      try {
        const res = await fetch('/data/archives.json')
        const data = await res.json()
        setArchiveData(data)
      } catch (e) {
        console.error('InteractiveMap: Error loading archives.json', e)
      }
    })()
    // fetch services.json
    ;(async () => {
      try {
        const res = await fetch('/data/services.json')
        const data = await res.json()
        setServicesData(data)
      } catch (e) {
        console.error('InteractiveMap: Error loading services.json', e)
      }
    })()
  }, [])

  // Detect monasteries that have interior content (explicit IDs with embeds from user, or images named id_x.(png|jpg))
  useEffect(() => {
  const knownInteriorWithEmbeds = new Set<number>([9, 53, 57, 171, 176, 195, 202])
    // Probe for _x images by attempting to fetch the asset heads
    const controller = new AbortController()
    const collect = async () => {
      const ids = new Set<number>([...knownInteriorWithEmbeds])
      // Try reasonable range from loaded monastery data
      const candidates = monasteryData.map(m => Number(m.id)).filter(n => !Number.isNaN(n))
      // helper to check one
      const checkId = async (id: number) => {
        const png = `/data/monastery/${id}_x.png`
        const jpg = `/data/monastery/${id}_x.jpg`
        try {
          const res = await fetch(png, { method: 'HEAD', signal: controller.signal })
          if (res.ok) return true
        } catch {}
        try {
          const res2 = await fetch(jpg, { method: 'HEAD', signal: controller.signal })
          if (res2.ok) return true
        } catch {}
        return false
      }
      await Promise.allSettled(candidates.map(async (id) => {
        const ok = await checkId(id)
        if (ok) ids.add(id)
      }))
      setInteriorIds(Array.from(ids))
    }
    if (monasteryData.length > 0) collect()
    return () => controller.abort()
  }, [monasteryData])

  useEffect(() => {
    console.log('InteractiveMap: useEffect triggered', {
      window: typeof window !== "undefined",
      mapRef: !!mapRef.current,
      monasteryDataLength: monasteryData.length,
  dataProcessed: dataProcessedRef.current,
  interiorIdsCount: interiorIds.length
    })
    
    if (typeof window === "undefined" || !mapRef.current || monasteryData.length === 0) {
      console.log('InteractiveMap: Skipping map initialization')
      return
    }

    // If already initialized, don't tear down/rebuild the map; marker updates happen in another effect
    if (isMapInitializedRef.current && mapInstance) {
      console.log('InteractiveMap: Map already initialized; skip full init')
      return
    }

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
  console.log('InteractiveMap: Initializing map with', monasteryData.length, 'monasteries')
      
      // Double check container exists and is attached to DOM
      const container = mapRef.current
      if (!container || !container.isConnected) {
        console.log('InteractiveMap: Container not available or not in DOM, skipping initialization')
        return
      }

      const L = (await import("leaflet")).default

      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      // Clean up existing map if it exists
      if (mapInstance) {
        console.log('InteractiveMap: Cleaning up existing map instance')
        try {
          mapInstance.remove()
        } catch (e) {
          console.log('InteractiveMap: Error removing existing map:', e)
        }
        setMapInstance(null)
      }

      // Ensure container is completely clean
      if (container) {
        // Remove any Leaflet-specific properties
        delete (container as any)._leaflet_id
        // Clear the container HTML to ensure clean state
        container.innerHTML = ''
        
        // Ensure container has dimensions
        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
          console.log('InteractiveMap: Container has no dimensions, waiting...')
          // Set a minimum size to prevent offsetWidth issues
          container.style.width = container.style.width || '100%'
          container.style.height = container.style.height || '500px'
        }
      }

      try {
        // Wait a small amount to ensure container is properly sized
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Final check before creating map
        if (!container || !container.isConnected || container.offsetWidth === 0) {
          console.log('InteractiveMap: Container still not ready, aborting')
          return
        }

        // Define bounds for Sikkim region to restrict panning
        const sikkimBounds = L.latLngBounds(
          L.latLng(27.0, 88.0),  // Southwest corner
          L.latLng(28.2, 88.9)   // Northeast corner
        )

        // Initialize map centered on Sikkim with zoom restrictions and pan limits
        const map = L.map(container, {
          minZoom: 8,    // More relaxed minimum zoom (was 10)
          maxZoom: 18,   // Allow detailed zoom
          maxBounds: sikkimBounds,  // Restrict panning to Sikkim bounds
          maxBoundsViscosity: 1.0   // Make bounds completely solid
        }).setView([27.3389, 88.4167], 10)

        // Add tile layer with a subtle, premium style
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map)

        // Load and add Sikkim border with bright neon color
        try {
          const response = await fetch('/coords.txt')
          const sikkimData = await response.json()
          
          // Add Sikkim border overlay with neon dark blue colors
          const sikkimBorder = L.geoJSON(sikkimData, {
            style: {
              color: '#0099FF',        // Neon dark blue for border
              weight: 4,               // Bold border
              opacity: 1,              // Full opacity
              fillColor: '#0066CC',    // Darker blue fill
              fillOpacity: 0.15,       // Subtle fill
              dashArray: '8, 4'        // Dashed pattern
            }
          }).addTo(map)

          // Fit map bounds to Sikkim with some padding
          const bounds = sikkimBorder.getBounds()
          sikkimBoundsRef.current = bounds
          map.fitBounds(bounds, { padding: [20, 20] })
          
          console.log('InteractiveMap: Sikkim border added successfully')
        } catch (error) {
          console.log('InteractiveMap: Could not load Sikkim border data:', error)
        }

        // Custom icons for different types
        const monasteryIcon = L.divIcon({
          html: `<div class="w-4 h-4 bg-orange-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                   <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                   </svg>
                 </div>`,
          className: "monastery-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        const archiveIcon = L.divIcon({
          html: `<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                   <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M4 4v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2zm4 8a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z"/>
                   </svg>
                 </div>`,
          className: "archive-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        const othersIcon = L.divIcon({
          html: `<div class="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                   <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                   </svg>
                 </div>`,
          className: "others-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        const interiorIcon = L.divIcon({
          html: `<div class="w-4 h-4 bg-black rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                   <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                   </svg>
                 </div>`,
          className: "interior-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })
        
        // Icon for 360° view monasteries
        const view360Icon = L.divIcon({
          html: `<div class="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                   <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                   </svg>
                 </div>`,
          className: "view360-marker",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        // Function to clean monastery name (remove location suffixes)
        const cleanMonasteryName = (name: string) => {
          // Remove common location suffixes
          return name.replace(/\s+(North|South|East|West)\s+Sikkim$/, '')
                     .replace(/\s+Sikkim$/, '')
                     .trim()
        }

        // Create and add a layer group for monastery markers
        const monasteryLayer = L.layerGroup().addTo(map)
        monasteryLayerRef.current = monasteryLayer

        // Initial draw of monastery markers
        monasteryData.forEach((monastery) => {
          const [lat, lng] = monastery.coords.split(',').map((coord: string) => parseFloat(coord.trim()))
          if (!isNaN(lat) && !isNaN(lng)) {
            const cleanName = cleanMonasteryName(monastery.name)
            // Determine if monastery has a 360° embed, interior, or default
            const embed = monastery.embed_link || ''
            // detect 360° view by presence of an iframe embed
            const has360 = embed.includes('<iframe')
            const isInterior = interiorIds.includes(Number(monastery.id))
            const icon = has360 ? view360Icon : monasteryIcon
            const marker = L.marker([lat, lng], { icon })
              .bindPopup(`
                <div class="p-2 min-w-[200px]">
                  <h3 class="font-semibold text-sm mb-1">${cleanName}</h3>
                  <p class="text-xs text-gray-600 mb-2">${monastery.s_desc}</p>
                  ${has360 ? '<span class="text-[10px] text-yellow-800 font-semibold">(360° view)</span>' : ''}
                </div>
              `)
              .bindTooltip(cleanName, {
                permanent: false,
                direction: 'top',
                offset: [0, -8],
                className: 'monastery-tooltip'
              })

            marker.on("click", () => {
              setSelectedMonastery({...monastery, name: cleanName})
              onMonasterySelect?.({...monastery, name: cleanName})
            })

            marker.addTo(monasteryLayer)
          }
        })

        // Add archive markers from JSON
        archiveData.forEach((archive: any) => {
          if (!archive.coords) return
          const [lat, lng] = archive.coords.split(',').map((c: string) => parseFloat(c.trim()))
          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng], { icon: archiveIcon })
              .addTo(map)
              .bindPopup(`
                <div class="p-2 min-w-[200px]">
                  <h3 class="font-semibold text-sm mb-1">${archive.name}</h3>
                  <p class="text-xs text-gray-600 mb-2">${archive.l_desc || ''}</p>
                  <span class="text-xs text-blue-600 font-medium">Archive</span>
                </div>
              `)
              .bindTooltip(archive.name, {
                permanent: false,
                direction: 'top',
                offset: [0, -8],
                className: 'archive-tooltip'
              })
          }
        })

        // Add service markers from JSON
        servicesData.forEach((service: any) => {
          if (!service.coords) return
          const [lat, lng] = service.coords.split(',').map((c: string) => parseFloat(c.trim()))
          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng], { icon: othersIcon })
              .addTo(map)
              .bindPopup(`
                <div class="p-2 min-w-[200px]">
                  <h3 class="font-semibold text-sm mb-1">${service.name}</h3>
                  <p class="text-xs text-gray-600 mb-2">${service.l_desc || ''}</p>
                  <span class="text-xs text-green-600 font-medium">Service</span>
                </div>
              `)
              .bindTooltip(service.name, {
                permanent: false,
                direction: 'top',
                offset: [0, -8],
                className: 'service-tooltip'
              })
          }
        })

        // Invalidate size to ensure Leaflet recalculates container dimensions
        map.invalidateSize()
        setMapInstance(map)
  isMapInitializedRef.current = true
  dataProcessedRef.current = true
        onMapReady?.(map)

      } catch (error) {
        console.error('InteractiveMap: Error initializing map:', error)
        // If there's still an error, reset the initialization flag so it can be retried
        isMapInitializedRef.current = false
      }
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mapRef.current && mapRef.current.isConnected) {
        initMap().catch(console.error)
      } else {
        console.log('InteractiveMap: Container not ready after delay')
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      console.log('InteractiveMap: Cleanup function called')
      cleanupMap()
    }
  }, [monasteryData, archiveData, servicesData])

  // Update monastery markers when interior ids or monastery data change (without reinitializing the map)
  useEffect(() => {
    const updateMonasteryMarkers = async () => {
      if (!mapInstance || !monasteryLayerRef.current) return
      const L = (await import("leaflet")).default
      // Recreate icons (same styles as init)
  const monasteryIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-orange-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                 <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                 </svg>
               </div>`,
        className: "monastery-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })
  const interiorIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-black rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                 <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                 </svg>
               </div>`,
        className: "interior-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      // Add view360Icon in update context
      const view360Icon = L.divIcon({
        html: `<div class="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                 <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                 </svg>
               </div>`,
        className: "view360-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })
      const layer: any = monasteryLayerRef.current
      layer.clearLayers()
      // Function to clean monastery name
      const cleanMonasteryName = (name: string) => name
        .replace(/\s+(North|South|East|West)\s+Sikkim$/, '')
        .replace(/\s+Sikkim$/, '')
        .trim()

      monasteryData.forEach((monastery) => {
        const [lat, lng] = monastery.coords.split(',').map((coord: string) => parseFloat(coord.trim()))
        if (isNaN(lat) || isNaN(lng)) return
        const cleanName = cleanMonasteryName(monastery.name)
  const embed = monastery.embed_link || ''
  const has360 = embed.includes('<iframe')
  const icon = has360 ? view360Icon : monasteryIcon
  const marker = L.marker([lat, lng], { icon })
          .bindPopup(`
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold text-sm mb-1">${cleanName}</h3>
              <p class="text-xs text-gray-600 mb-2">${monastery.s_desc}</p>
              ${has360 ? '<span class="text-[10px] text-yellow-800 font-semibold">(360° view)</span>' : ''}
            </div>
          `)
          .bindTooltip(cleanName, {
            permanent: false,
            direction: 'top',
            offset: [0, -8],
            className: 'monastery-tooltip'
          })
        marker.on("click", () => {
          setSelectedMonastery({...monastery, name: cleanName})
          onMonasterySelect?.({...monastery, name: cleanName})
        })
        marker.addTo(layer)
      })
    }
    updateMonasteryMarkers().catch(console.error)
  }, [interiorIds, monasteryData, mapInstance])

  // Expose the location function after map is ready (run once when mapInstance initializes)
  useEffect(() => {
    if (mapInstance && onLocationFunctionReady) {
      onLocationFunctionReady(handleUserLocation)
    }
    // Only depend on mapInstance to prevent loops if onLocationFunctionReady is unstable
  }, [mapInstance])

  // Component cleanup effect
  useEffect(() => {
    return () => {
      console.log('InteractiveMap: Component unmounting')
      cleanupMap()
    }
  }, [])

  const centerOnMonastery = (monastery: any) => {
    if (mapInstance && monastery.coords) {
      const [lat, lng] = monastery.coords.split(',').map((coord: string) => parseFloat(coord.trim()))
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstance.setView([lat, lng], 15)
        setSelectedMonastery(monastery)
      }
    }
  }

  // Function to handle user location and show nearby attractions
  const handleUserLocation = async () => {
    if (!mapInstance) return

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      const { latitude, longitude } = position.coords
      
      // Import Leaflet dynamically
      const L = (await import("leaflet")).default

      // Remove existing user location marker and circle
      if (userLocation?.marker) {
        mapInstance.removeLayer(userLocation.marker)
      }
      if (nearbyCircle) {
        mapInstance.removeLayer(nearbyCircle)
      }

      // Add user location marker
      const userIcon = L.divIcon({
        html: `<div class="w-5 h-5 bg-purple-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                 <div class="w-2 h-2 bg-white rounded-full"></div>
               </div>`,
        className: "user-location-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const userMarker = L.marker([latitude, longitude], { icon: userIcon })
        .addTo(mapInstance)
        .bindTooltip("Your Location", {
          permanent: false,
          direction: 'top',
          offset: [0, -10],
          className: 'user-location-tooltip'
        })

      // Add 2km radius circle with better visibility
      const circle = L.circle([latitude, longitude], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        radius: 2000, // 2km radius
        weight: 3,
        dashArray: '8, 4',
        opacity: 0.8
      }).addTo(mapInstance)

      setNearbyCircle(circle)

      // Find nearby attractions within 2km
      const nearbyAttractions: any[] = []

      // Check monasteries
      monasteryData.forEach((monastery) => {
        if (monastery.coords) {
          const [lat, lng] = monastery.coords.split(',').map((coord: string) => parseFloat(coord.trim()))
          if (!isNaN(lat) && !isNaN(lng)) {
            const distance = calculateDistance(latitude, longitude, lat, lng)
            if (distance <= 2) { // Within 2km
              nearbyAttractions.push({
                ...monastery,
                distance: distance.toFixed(1),
                type: 'Monastery'
              })
            }
          }
        }
      })

      // Add archive locations (static for demo)
      const archiveData = [
        { name: "Buddhist Manuscripts", coords: "27.35, 88.45", desc: "Digital archive of ancient Buddhist manuscripts" },
        { name: "Historical Artifacts", coords: "27.30, 88.40", desc: "Collection of historical Buddhist artifacts" },
        { name: "Traditional Paintings", coords: "27.40, 88.50", desc: "Traditional Buddhist art and paintings" }
      ]

      archiveData.forEach((archive) => {
        const [lat, lng] = archive.coords.split(',').map((coord: string) => parseFloat(coord.trim()))
        const distance = calculateDistance(latitude, longitude, lat, lng)
        if (distance <= 2) {
          nearbyAttractions.push({
            ...archive,
            distance: distance.toFixed(1),
            type: 'Archive'
          })
        }
      })

      // Add other locations (static for demo)
      const othersData = [
        { name: "Meditation Center", coords: "27.32, 88.42", desc: "Community meditation and wellness center" },
        { name: "Pilgrimage Route", coords: "27.38, 88.48", desc: "Traditional pilgrimage pathway" },
        { name: "Cultural Site", coords: "27.36, 88.46", desc: "Important cultural heritage site" }
      ]

      othersData.forEach((other) => {
        const [lat, lng] = other.coords.split(',').map((coord: string) => parseFloat(coord.trim()))
        const distance = calculateDistance(latitude, longitude, lat, lng)
        if (distance <= 2) {
          nearbyAttractions.push({
            ...other,
            distance: distance.toFixed(1),
            type: 'Cultural Site'
          })
        }
      })

      // Show nearby attractions popup with better styling
      if (nearbyAttractions.length > 0) {
        const popupContent = `
          <div class="p-3 min-w-[280px] max-w-[320px]">
            <h3 class="font-bold text-sm mb-3 text-blue-700 border-b border-blue-200 pb-1">📍 Nearby Attractions (Within 2km)</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              ${nearbyAttractions.map(attraction => `
                <div class="p-2 bg-gradient-to-r ${attraction.type === 'Monastery' ? 'from-orange-50 to-orange-100 border-l-3 border-orange-500' : attraction.type === 'Archive' ? 'from-blue-50 to-blue-100 border-l-3 border-blue-500' : 'from-green-50 to-green-100 border-l-3 border-green-500'} rounded-r shadow-sm">
                  <div class="font-semibold text-xs text-gray-800">${attraction.name}</div>
                  <div class="text-xs text-gray-600 mt-1">🚶 ${attraction.distance}km away</div>
                  <div class="text-xs text-${attraction.type === 'Monastery' ? 'orange' : attraction.type === 'Archive' ? 'blue' : 'green'}-600 font-medium">${attraction.type}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `
        userMarker.bindPopup(popupContent, { maxWidth: 350 }).openPopup()
      } else {
        userMarker.bindPopup(`
          <div class="p-3 text-center">
            <h3 class="font-semibold text-sm mb-2 text-gray-700">📍 Your Location</h3>
            <p class="text-xs text-gray-600 mb-2">No attractions found within 2km</p>
            <p class="text-xs text-blue-600">Try exploring the map to discover monasteries and cultural sites!</p>
          </div>
        `).openPopup()
      }

      // Center map on user location with smooth animation
      mapInstance.flyTo([latitude, longitude], 14, {
        animate: true,
        duration: 1.5
      })

      // Update user location state
      setUserLocation({
        lat: latitude,
        lng: longitude,
        marker: userMarker,
        nearbyAttractions
      })

      onLocationRequest?.()

    } catch (error) {
      console.error('Error getting user location:', error)
      alert('Unable to get your location. Please check if location services are enabled and try again.')
    }
  }

  // Function to calculate distance between two points in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map Container */}
      <div className="flex-1 relative rounded-lg overflow-hidden border border-border">
        <div 
          key={mapKey}
          ref={mapRef} 
          className="w-full h-full min-h-[500px]" 
        />


        {/* Map Controls - move to top right */}
        <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
          <Button
            size="sm"
            variant="secondary"
            className="bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card/95 transition-colors pointer-events-auto"
            onClick={() => {
              if (mapInstance) {
                if (sikkimBoundsRef.current) {
                  mapInstance.fitBounds(sikkimBoundsRef.current, { padding: [20, 20] })
                } else {
                  mapInstance.setView([27.3389, 88.4167], 10)
                }
              }
            }}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>

        {/* Marker Legend - move to bottom left */}
        <Card className="absolute bottom-4 left-4 p-2 bg-card/95 backdrop-blur-sm shadow-lg z-[1001] pointer-events-none border border-border">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-foreground mb-1.5">Map Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full border border-white shadow-sm"></div>
              <span className="text-xs text-foreground">Monasteries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white shadow-sm"></div>
              <span className="text-xs text-foreground">Monasteries (360° view)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full border border-white shadow-sm"></div>
              <span className="text-xs text-foreground">Archives</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full border border-white shadow-sm"></div>
              <span className="text-xs text-foreground">Services</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full border border-white shadow-sm"></div>
              <span className="text-xs text-foreground">Your Location</span>
            </div>
          </div>
        </Card>

        {/* Selected Monastery Info */}
        {selectedMonastery && (
          <Card className="absolute bottom-4 left-4 right-4 p-4 bg-card/95 backdrop-blur-sm shadow-lg z-40">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground mb-1">{selectedMonastery.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{selectedMonastery.s_desc}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setSelectedMonastery(null)} className="flex-shrink-0">
                ×
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

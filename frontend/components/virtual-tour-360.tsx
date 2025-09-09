"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, Info, Play, Pause } from "lucide-react"

interface VirtualTour360Props {
  monasteryId?: number
  onInfoToggle?: () => void
}

// Sample 360 panoramic images for monasteries
const monastery360Images = {
  1: "/360-panoramic-view-of-rumtek-monastery-interior-wi.jpg",
  2: "/360-panoramic-view-of-pemayangtse-monastery-courty.jpg",
  3: "/360-panoramic-view-of-tashiding-monastery-prayer-h.jpg",
  4: "/360-panoramic-view-of-enchey-monastery-overlooking.jpg",
  5: "/360-panoramic-view-of-dubdi-monastery-ancient-medi.jpg",
}

export function VirtualTour360({ monasteryId = 1, onInfoToggle }: VirtualTour360Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [lastMouseX, setLastMouseX] = useState(0)

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [autoRotate])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouseX(e.clientX)
    setAutoRotate(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMouseX
    setRotation((prev) => (prev + deltaX * 0.5) % 360)
    setLastMouseX(e.clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setLastMouseX(e.touches[0].clientX)
    setAutoRotate(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const deltaX = e.touches[0].clientX - lastMouseX
    setRotation((prev) => (prev + deltaX * 0.5) % 360)
    setLastMouseX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const resetView = () => {
    setRotation(0)
    setZoom(1)
    setAutoRotate(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 360 Image Container */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          transform: `scale(${zoom})`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
      >
        <img
          ref={imageRef}
          src={monastery360Images[monasteryId as keyof typeof monastery360Images] || "/placeholder.svg"}
          alt="360° Virtual Tour"
          className="h-full w-auto object-cover"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
            minWidth: "200%",
          }}
          draggable={false}
        />
      </div>

      {/* Loading Overlay */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">Loading 360° Experience...</p>
        </div>
      </div>

      {/* Control Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        {/* Top Controls */}
        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-start">
          <div className="p-2 sm:p-3 bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg">
            <p className="text-white text-sm font-medium">360° Virtual Tour</p>
            <p className="text-white/70 text-xs">Drag to explore • Scroll to zoom</p>
          </div>

          <div className="flex gap-1 sm:gap-2">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
              onClick={onInfoToggle}
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 bg-black/70 backdrop-blur-sm border-white/20 text-white hover:bg-black/80"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
          <div className="p-2 sm:p-3 bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-3 text-white hover:bg-white/20"
                  onClick={() => setAutoRotate(!autoRotate)}
                >
                  {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="ml-2 text-xs hidden sm:inline">Auto Rotate</span>
                </button>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-3 text-white hover:bg-white/20"
                  onClick={resetView}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="ml-2 text-xs hidden sm:inline">Reset</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-3 text-white hover:bg-white/20"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="text-white text-xs px-2">{Math.round(zoom * 100)}%</div>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-3 text-white hover:bg-white/20"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar for Auto Rotate */}
            {autoRotate && (
              <div className="mt-2 w-full bg-white/20 rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-100"
                  style={{ width: `${((rotation % 360) / 360) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Hotspots for Interactive Elements */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 text-xs sm:text-sm bg-primary/80 backdrop-blur-sm hover:bg-primary animate-pulse"
            onClick={() => console.log("Hotspot clicked")}
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Learn More</span>
          </button>
        </div>

        <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 text-xs sm:text-sm bg-primary/80 backdrop-blur-sm hover:bg-primary animate-pulse"
            onClick={() => console.log("Audio guide started")}
          >
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Audio Guide</span>
          </button>
        </div>
      </div>
    </div>
  )
}
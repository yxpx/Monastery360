"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Headphones, Radio, Music, Play, Pause } from "lucide-react"

// The AudioPlayer component has been moved into this file to resolve the import error.
const AudioPlayer = ({ currentTrackId, onTrackChange, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Mock track data for the player
  const tracks = [
    { id: 1, title: "Track 1: Sacred Chants", artist: "Unknown" },
    { id: 2, title: "Track 2: Temple Bells", artist: "Monastery Recordings" },
    { id: 3, title: "Track 3: Morning Meditations", artist: "Anonymous" },
  ]

  const currentTrack = tracks.find(track => track.id === currentTrackId)

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
        <Button size="icon" className="rounded-full" onClick={handlePlayPause}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium text-foreground truncate">{currentTrack?.title}</p>
          <p className="text-xs text-muted-foreground truncate">{currentTrack?.artist}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50">
        <div className="flex-shrink-0">
          <Button size="icon" className="rounded-full w-10 h-10 sm:w-12 sm:h-12" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
          </Button>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg sm:text-xl font-semibold text-foreground truncate">{currentTrack?.title}</h4>
          <p className="text-sm text-muted-foreground truncate">{currentTrack?.artist}</p>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <h5 className="text-sm font-medium text-foreground">Track List</h5>
        <div className="space-y-2">
          {tracks.map(track => (
            <div
              key={track.id}
              onClick={() => onTrackChange(track.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                currentTrackId === track.id ? "bg-primary/10 border-primary/20" : "hover:bg-secondary/50 border-border"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{track.title}</p>
              <p className="text-xs text-muted-foreground">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface AudioStreamPanelProps {
  monasteryId?: number
  showFullPlayer?: boolean
}

const liveStreams = [
  {
    id: 1,
    title: "Live Morning Prayers",
    monastery: "Rumtek",
    status: "live",
    listeners: 234,
    description: "Join the morning prayer session",
  },
  {
    id: 2,
    title: "Meditation Session",
    monastery: "Pemayangtse",
    status: "scheduled",
    listeners: 0,
    description: "Guided meditation at 6 PM",
  },
  {
    id: 3,
    title: "Evening Chants",
    monastery: "Tashiding",
    status: "offline",
    listeners: 0,
    description: "Traditional evening prayers",
  },
]

export function AudioStreamPanel({ monasteryId, showFullPlayer = false }: AudioStreamPanelProps) {
  const [currentTrackId, setCurrentTrackId] = useState(1)
  const [activeStream, setActiveStream] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white"
      case "scheduled":
        return "bg-yellow-500 text-white"
      case "offline":
        return "bg-gray-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <Radio className="w-3 h-3" />
      case "scheduled":
        return <Volume2 className="w-3 h-3" />
      case "offline":
        return <Music className="w-3 h-3" />
      default:
        return <Headphones className="w-3 h-3" />
    }
  }

  if (!showFullPlayer) {
    return (
      <Card className="h-full p-4 md:p-6 bg-card border border-border rounded-lg flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Audio Stream</h3>
        </div>

        <div className="flex-1 space-y-3">
          {/* Live Streams */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Live Streams</h4>
            <div className="space-y-2">
              {liveStreams.slice(0, 2).map((stream) => (
                <div
                  key={stream.id}
                  className={`p-2 rounded-lg border cursor-pointer transition-colors hover:bg-secondary/50 ${
                    activeStream === stream.id ? "bg-primary/10 border-primary/20" : "border-border"
                  }`}
                  onClick={() => setActiveStream(activeStream === stream.id ? null : stream.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-foreground">{stream.title}</p>
                    <Badge className={`${getStatusColor(stream.status)} text-xs flex items-center gap-1`}>
                      {getStatusIcon(stream.status)}
                      {stream.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{stream.monastery}</p>
                  {stream.status === "live" && (
                    <p className="text-xs text-muted-foreground">{stream.listeners} listening</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Audio Player */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Audio Guides</h4>
            <AudioPlayer currentTrackId={currentTrackId} onTrackChange={setCurrentTrackId} compact />
          </div>
        </div>

        <Button variant="outline" size="sm" className="mt-4 bg-transparent">
          <Headphones className="w-4 h-4 mr-2" />
          Full Player
        </Button>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4">
      {/* Live Streams Section */}
      <Card className="p-4 md:p-6 bg-card border border-border rounded-lg md:w-1/2">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Live Streams</h3>
        </div>

        <div className="space-y-2">
          {liveStreams.map((stream) => (
            <div
              key={stream.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-secondary/50 ${
                activeStream === stream.id ? "bg-primary/10 border-primary/20" : "border-border"
              }`}
              onClick={() => setActiveStream(activeStream === stream.id ? null : stream.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm md:text-base font-medium text-foreground">{stream.title}</h4>
                <Badge className={`${getStatusColor(stream.status)} text-xs flex items-center gap-1`}>
                  {getStatusIcon(stream.status)}
                  {stream.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{stream.monastery} Monastery</p>
              <p className="text-xs text-muted-foreground">{stream.description}</p>
              {stream.status === "live" && (
                <p className="text-xs text-primary mt-1">{stream.listeners} people listening</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Audio Player Section */}
      <Card className="flex-1 p-4 md:p-6 bg-card border border-border rounded-lg md:w-1/2">
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Audio Collection</h3>
        </div>

        <AudioPlayer currentTrackId={currentTrackId} onTrackChange={setCurrentTrackId} />
      </Card>
    </div>
  )
}


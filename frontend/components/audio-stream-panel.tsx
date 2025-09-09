"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "./audio-player"
import { Volume2, Headphones, Radio, Music } from "lucide-react"

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
      <Card className="h-full p-4 bg-card border border-border rounded-lg flex flex-col">
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
    <div className="h-full flex flex-col space-y-4">
      {/* Live Streams Section */}
      <Card className="p-4 bg-card border border-border rounded-lg">
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
                <h4 className="text-sm font-medium text-foreground">{stream.title}</h4>
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
      <Card className="flex-1 p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Audio Collection</h3>
        </div>

        <AudioPlayer currentTrackId={currentTrackId} onTrackChange={setCurrentTrackId} />
      </Card>
    </div>
  )
}

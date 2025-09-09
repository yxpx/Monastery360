"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, Star } from "lucide-react"

interface MonasteryInfoPanelProps {
  monasteryId: number
  onClose: () => void
}

const monasteryDetails = {
  1: {
    name: "Rumtek Monastery",
    tradition: "Kagyu",
    established: 1966,
    location: "Gangtok, East Sikkim",
    description:
      "The largest monastery in Sikkim, also known as the Dharmachakra Centre. It serves as the main seat of the Karma Kagyu lineage and houses many precious relics.",
    highlights: ["Golden Stupa", "Prayer Wheels", "Ancient Manuscripts", "Meditation Hall"],
    visitingHours: "6:00 AM - 6:00 PM",
    bestTime: "March to May, September to November",
    significance: "Main seat of the 17th Karmapa",
  },
  2: {
    name: "Pemayangtse Monastery",
    tradition: "Nyingma",
    established: 1705,
    location: "Pelling, West Sikkim",
    description:
      "One of the oldest and premier monasteries of Sikkim, meaning 'Perfect Sublime Lotus'. It's a three-storied structure representing the three worlds.",
    highlights: ["Wooden Sculptures", "Ancient Murals", "Sacred Texts", "Mountain Views"],
    visitingHours: "7:00 AM - 5:00 PM",
    bestTime: "October to December, March to May",
    significance: "Head monastery of Nyingma sect in Sikkim",
  },
}

export function MonasteryInfoPanel({ monasteryId, onClose }: MonasteryInfoPanelProps) {
  const monastery = monasteryDetails[monasteryId as keyof typeof monasteryDetails] || monasteryDetails[1]

  return (
    <Card className="h-full p-6 bg-card border border-border rounded-lg overflow-y-auto">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">{monastery.name}</h2>
          <Badge variant="secondary" className="mb-2">
            {monastery.tradition} Tradition
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Est.</span>
            <span className="font-medium">{monastery.established}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{monastery.location}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">About</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{monastery.description}</p>
        </div>

        {/* Highlights */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Key Highlights</h3>
          <div className="grid grid-cols-2 gap-2">
            {monastery.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Star className="w-3 h-3 text-primary" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visiting Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Visiting Information</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hours:</span>
              <span className="font-medium">{monastery.visitingHours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Best Time:</span>
              <span className="font-medium">{monastery.bestTime}</span>
            </div>
          </div>
        </div>

        {/* Significance */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Religious Significance</h3>
          <p className="text-sm text-muted-foreground">{monastery.significance}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button size="sm" className="flex-1">
            <MapPin className="w-4 h-4 mr-2" />
            View on Map
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Users className="w-4 h-4 mr-2" />
            Plan Visit
          </Button>
        </div>
      </div>
    </Card>
  )
}

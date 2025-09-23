"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, Headphones, Camera, Globe } from "lucide-react"

export function WebsiteInfo() {
  const features = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Interactive Map",
      description: "Explore Sikkim's monasteries with geo-tagged locations and detailed information.",
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "360° Virtual Tours",
      description: "Immersive virtual experiences of monastery interiors and surroundings.",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Festival Calendar",
      description: "Stay updated with Buddhist festivals and cultural events throughout the year.",
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Audio Guides",
      description: "Listen to detailed descriptions and cultural insights about each monastery.",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Multilingual Support",
      description: "Available in English, Hindi, and Nepali for broader accessibility.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Cultural Preservation",
      description: "Digital archive preserving Sikkim's rich Buddhist heritage for future generations.",
    },
  ]

  const stats = [
    { label: "Monasteries Featured", value: "100+" },
    { label: "Languages Supported", value: "10+" },
    { label: "Cultural Festivals", value: "20+" },
    { label: "Audio Guides", value: "100+" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Monastery360</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A Progressive Web App designed to boost tourism and preserve the cultural heritage of Sikkim's monasteries
          through interactive digital experiences.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 text-center border border-border">
            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 border border-border">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

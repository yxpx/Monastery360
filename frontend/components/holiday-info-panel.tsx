"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Star, Clock } from "lucide-react"

interface Holiday {
  id: number
  name: string
  date: string
  type: "major" | "minor" | "seasonal"
  description: string
  monastery?: string
  significance: string
  duration?: string
  activities?: string[]
}

const upcomingHolidays: Holiday[] = [
  {
    id: 1,
    name: "Losar",
    date: "2024-02-10",
    type: "major",
    description:
      "Tibetan New Year celebration marking the beginning of the lunar calendar with traditional dances, prayers, and feasts.",
    monastery: "All monasteries",
    significance: "Most important festival in Tibetan Buddhism, symbolizing renewal and purification",
    duration: "3 days",
    activities: ["Traditional dances", "Prayer ceremonies", "Community feasts", "Gift exchanges"],
  },
  {
    id: 2,
    name: "Saga Dawa",
    date: "2024-05-23",
    type: "major",
    description: "Triple blessed day celebrating Buddha's birth, enlightenment, and parinirvana.",
    monastery: "All monasteries",
    significance: "One of the holiest days in Buddhism when merit is multiplied",
    duration: "1 day",
    activities: ["Meditation sessions", "Merit-making activities", "Butter lamp offerings", "Circumambulation"],
  },
  {
    id: 3,
    name: "Pang Lhabsol",
    date: "2024-08-15",
    type: "major",
    description: "Unique Sikkimese festival honoring Mount Khangchendzonga as the guardian deity.",
    monastery: "Tashiding, Pemayangtse",
    significance: "Celebrates the sacred bond between Sikkim and its guardian mountain",
    duration: "2 days",
    activities: ["Warrior dances", "Traditional music", "Mountain worship", "Cultural performances"],
  },
]

export function HolidayInfoPanel() {
  const nextHoliday = upcomingHolidays[0]
  const daysUntilNext = Math.ceil((new Date(nextHoliday.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getTypeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-primary text-primary-foreground"
      case "minor":
        return "bg-secondary text-secondary-foreground"
      case "seasonal":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Next Holiday Highlight */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Next Festival</h3>
          </div>
          <Badge className={getTypeColor(nextHoliday.type)}>{nextHoliday.type}</Badge>
        </div>

        <h4 className="text-lg font-bold text-foreground mb-2">{nextHoliday.name}</h4>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(nextHoliday.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{daysUntilNext > 0 ? `${daysUntilNext} days` : "Today"}</span>
          </div>
        </div>

        <p className="text-sm text-foreground leading-relaxed mb-3">{nextHoliday.description}</p>

        {nextHoliday.monastery && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{nextHoliday.monastery}</span>
          </div>
        )}
      </Card>

      {/* Holiday List */}
      <Card className="flex-1 p-4 bg-card border border-border rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Upcoming Festivals</h3>

        <div className="space-y-3">
          {upcomingHolidays.map((holiday) => (
            <div key={holiday.id} className="p-3 bg-secondary/30 rounded-lg border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{holiday.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {new Date(holiday.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{holiday.significance}</p>

              {holiday.activities && (
                <div className="flex flex-wrap gap-1">
                  {holiday.activities.slice(0, 2).map((activity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                  {holiday.activities.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{holiday.activities.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Cultural Note */}
      <Card className="p-4 bg-accent/10 border border-accent/20">
        <h4 className="font-medium text-foreground mb-2">Cultural Note</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sikkim's festivals blend Tibetan Buddhist traditions with local customs, creating unique celebrations that
          honor both spiritual teachings and the natural beauty of the Himalayas.
        </p>
      </Card>
    </div>
  )
}

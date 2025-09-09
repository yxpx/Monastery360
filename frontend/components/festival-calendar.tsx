"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

interface Festival {
  id: number
  name: string
  date: string
  type: "major" | "minor" | "seasonal"
  description: string
  monastery?: string
  significance: string
}

const sikkimFestivals: Festival[] = [
  {
    id: 1,
    name: "Losar",
    date: "2024-02-10",
    type: "major",
    description: "Tibetan New Year celebration marking the beginning of the lunar calendar",
    monastery: "All monasteries",
    significance: "Most important festival in Tibetan Buddhism",
  },
  {
    id: 2,
    name: "Saga Dawa",
    date: "2024-05-23",
    type: "major",
    description: "Celebrates Buddha's birth, enlightenment, and death anniversary",
    monastery: "All monasteries",
    significance: "Triple blessed day in Buddhist calendar",
  },
  {
    id: 3,
    name: "Pang Lhabsol",
    date: "2024-08-15",
    type: "major",
    description: "Guardian deity of Sikkim celebration with traditional dances",
    monastery: "Tashiding, Pemayangtse",
    significance: "Unique to Sikkim, honors Mount Khangchendzonga",
  },
  {
    id: 4,
    name: "Drupka Teshi",
    date: "2024-07-04",
    type: "major",
    description: "First sermon of Buddha at Sarnath",
    monastery: "Rumtek, Enchey",
    significance: "Turning of the Wheel of Dharma",
  },
  {
    id: 5,
    name: "Lhabab Duchen",
    date: "2024-11-15",
    type: "major",
    description: "Buddha's descent from heaven after teaching his mother",
    monastery: "All monasteries",
    significance: "One of the four great holy days",
  },
  {
    id: 6,
    name: "Bumchu",
    date: "2024-03-15",
    type: "minor",
    description: "Sacred water ceremony at Tashiding Monastery",
    monastery: "Tashiding",
    significance: "Predicts the coming year's fortune",
  },
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function FestivalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get festivals for current month
  const monthFestivals = sikkimFestivals.filter((festival) => {
    const festivalDate = new Date(festival.date)
    return festivalDate.getMonth() === currentMonth && festivalDate.getFullYear() === currentYear
  })

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getFestivalForDate = (day: number) => {
    return monthFestivals.find((festival) => {
      const festivalDate = new Date(festival.date)
      return festivalDate.getDate() === day
    })
  }

  const getFestivalTypeColor = (type: string) => {
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
    <div className="h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            {months[currentMonth]} {currentYear}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="flex-1 p-4 bg-card border border-border rounded-lg">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="p-2 h-16" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const festival = getFestivalForDate(day)
            const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()

            return (
              <div
                key={day}
                className={`p-2 h-16 border border-border rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${
                  isToday ? "bg-primary/10 border-primary" : ""
                } ${festival ? "bg-accent/20" : ""}`}
                onClick={() => festival && setSelectedFestival(festival)}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm font-medium ${isToday ? "text-primary" : "text-foreground"}`}>{day}</span>
                  {festival && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${getFestivalTypeColor(festival.type)}`} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Festival Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Major Festivals</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-muted-foreground">Minor Festivals</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-muted-foreground">Seasonal Events</span>
        </div>
      </div>

      {/* Selected Festival Modal */}
      {selectedFestival && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedFestival(null)}
        >
          <Card
            className="max-w-md w-full m-4 p-6 bg-card border border-border rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{selectedFestival.name}</h3>
                <Badge className={getFestivalTypeColor(selectedFestival.type)}>{selectedFestival.type} festival</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFestival(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Date</p>
                <p className="font-medium">
                  {new Date(selectedFestival.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">{selectedFestival.description}</p>
              </div>

              {selectedFestival.monastery && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Celebrated at</p>
                  <p className="text-sm font-medium">{selectedFestival.monastery}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Significance</p>
                <p className="text-sm leading-relaxed">{selectedFestival.significance}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

interface Event {
  id: number
  name: string
  date: string
  l_desc: string
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function FestivalCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Load events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/data/events.json')
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error loading events:', error)
      }
    }
    fetchEvents()
  }, [])

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get events for current month
  const monthEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === currentMonth
  })

  // Use all events sorted by date
  const sortedEvents = events
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

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

  const getEventForDate = (day: number) => {
    return monthEvents.find((event) => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === day
    })
  }

  const formatEventDate = (dateStr: string) => {
    // Handle various date formats from the JSON
    if (dateStr.includes('(')) {
      return dateStr.split('(')[0].trim()
    }
    return dateStr
  }

  return (
    <div className="h-full flex gap-4">
      {/* Left Panel - Upcoming Events */}
      <Card className="w-80 p-4 bg-card/95 backdrop-blur-sm border border-border">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Events</h3>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors border border-border/50"
              onClick={() => setSelectedEvent(event)}
            >
              <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-2">{event.name}</h4>
              <p className="text-xs text-muted-foreground">{formatEventDate(event.date)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Panel - Calendar with Event Details */}
  <div className="flex-1 flex flex-col min-h-0">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {months[currentMonth]} {currentYear}
          </h2>
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

  <div className="flex gap-4 flex-1 min-h-0">
          {/* Calendar Grid */}
          <Card className="flex-1 p-3 bg-card/95 backdrop-blur-sm border border-border flex flex-col min-h-0">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Dates */}
            <div className="grid grid-cols-7 gap-1 flex-1 overflow-auto">
              {/* Empty slots before first day */}
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} className="p-2" />
              ))}
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1
                const evt = getEventForDate(day)
                return (
                  <div
                    key={day}
                    className={`p-2 text-center text-sm rounded-lg ${evt ? 'bg-secondary/30 hover:bg-secondary/50 cursor-pointer' : ''}`}
                    onClick={() => evt && setSelectedEvent(evt)}
                  >
                    <div>{day}</div>
                    {evt && <div className="mt-1 h-1 w-1 mx-auto bg-primary rounded-full" />}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Event Details Panel */}
          <Card className="w-96 p-4 bg-card/95 backdrop-blur-sm border border-border flex flex-col h-full">
              <h3 className="font-semibold text-foreground mb-4">Event Details</h3>
              {selectedEvent ? (
                <>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Image or Placeholder */}
                    <div className="aspect-video mb-4 bg-muted rounded-lg overflow-hidden">
                      <img
                        key={selectedEvent.id}
                        src={`/data/events/${selectedEvent.id}.png`}
                        alt={selectedEvent.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement
                          t.style.display = 'none'
                          t.nextElementSibling?.classList.remove('invisible')
                        }}
                      />
                      <div className="invisible w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        <CalendarIcon className="w-8 h-8 mb-2" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <h4 className="font-medium text-foreground mb-1">{selectedEvent.name}</h4>
                      <Badge variant="secondary" className="text-xs">{formatEventDate(selectedEvent.date)}</Badge>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 pr-2">
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedEvent.l_desc}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Close Details
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground text-sm flex-1 flex flex-col items-center justify-center">
                  <CalendarIcon className="w-12 h-12 mb-3 opacity-50" />
                  <p>Select an event from the calendar or events to view details</p>
                </div>
              )}
            </Card>
        </div>
      </div>
    </div>
  )
}

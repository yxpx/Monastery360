"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, DollarSign, Clock, Users, Sparkles } from "lucide-react"

interface TripPlannerProps {
  onPlanGenerated?: (plan: any) => void
}

export function TripPlanner({ onPlanGenerated }: TripPlannerProps) {
  const [formData, setFormData] = useState({
    budget: "",
    days: "",
    travelers: "",
    interests: "",
    accommodation: "",
    transport: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateTripPlan = async () => {
    setIsGenerating(true)

    // Simulate API call to Gemini
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockPlan = {
      title: `${formData.days}-Day Sikkim Monastery Tour`,
      budget: formData.budget,
      itinerary: [
        {
          day: 1,
          title: "Arrival & Gangtok Exploration",
          activities: ["Check-in at hotel", "Visit Enchey Monastery", "Explore MG Marg"],
          cost: "₹2,500",
        },
        {
          day: 2,
          title: "Rumtek Monastery & Cultural Sites",
          activities: ["Morning visit to Rumtek Monastery", "Traditional lunch", "Institute of Tibetology"],
          cost: "₹3,200",
        },
        {
          day: 3,
          title: "West Sikkim Monasteries",
          activities: ["Drive to Pelling", "Pemayangtse Monastery", "Sangachoeling Monastery"],
          cost: "₹4,100",
        },
      ],
      bookingLinks: [
        { name: "Hotels in Gangtok", url: "#", price: "₹1,500/night" },
        { name: "Monastery Tour Guide", url: "#", price: "₹800/day" },
        { name: "Local Transport", url: "#", price: "₹2,000/day" },
      ],
      totalCost: "₹15,800",
      tips: [
        "Book monastery visits in advance during festival seasons",
        "Carry warm clothes as temperatures can drop suddenly",
        "Respect photography restrictions in sacred areas",
      ],
    }

    setGeneratedPlan(mockPlan)
    setIsGenerating(false)
    onPlanGenerated?.(mockPlan)
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 md:p-8">
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
        {!generatedPlan ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Plan Your Monastery Journey</h2>
              <p className="text-muted-foreground">Let AI create a personalized itinerary for your Sikkim adventure</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget (INR)
                </Label>
                <Input
                  id="budget"
                  placeholder="e.g., 20000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="days" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration (Days)
                </Label>
                <Select onValueChange={(value) => handleInputChange("days", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="10">10 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Travelers
                </Label>
                <Select onValueChange={(value) => handleInputChange("travelers", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select travelers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Solo</SelectItem>
                    <SelectItem value="2">Couple</SelectItem>
                    <SelectItem value="3-4">Small Group (3-4)</SelectItem>
                    <SelectItem value="5+">Large Group (5+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accommodation" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Accommodation Type
                </Label>
                <Select onValueChange={(value) => handleInputChange("accommodation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accommodation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget Hotels</SelectItem>
                    <SelectItem value="mid-range">Mid-range Hotels</SelectItem>
                    <SelectItem value="luxury">Luxury Resorts</SelectItem>
                    <SelectItem value="homestay">Local Homestays</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Special Interests
              </Label>
              <Textarea
                id="interests"
                placeholder="e.g., Photography, Meditation, Cultural experiences, Adventure activities..."
                value={formData.interests}
                onChange={(e) => handleInputChange("interests", e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={generateTripPlan}
              disabled={isGenerating || !formData.budget || !formData.days}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Your Perfect Trip...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Trip Plan
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-2xl font-bold text-foreground">{generatedPlan.title}</h2>
              <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                New Plan
              </Button>
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Total: {generatedPlan.totalCost}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formData.days} Days
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formData.travelers} Travelers
                </span>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Day-wise Itinerary</h3>
              {generatedPlan.itinerary.map((day: any) => (
                <Card key={day.day} className="p-4">
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <h4 className="font-medium">
                      Day {day.day}: {day.title}
                    </h4>
                    <span className="text-sm text-muted-foreground">{day.cost}</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {day.activities.map((activity: string, idx: number) => (
                      <li key={idx}>• {activity}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Booking Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {generatedPlan.bookingLinks.map((link: any, idx: number) => (
                  <Card key={idx} className="p-3 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-sm">{link.name}</p>
                      <p className="text-xs text-muted-foreground">{link.price}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Book Now
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Travel Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {generatedPlan.tips.map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
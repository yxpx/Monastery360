"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, DollarSign, Clock, Users, Sparkles, Calculator } from "lucide-react"
import ReactMarkdown from 'react-markdown'

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    try {
      const res = await fetch(`${apiUrl}/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const plan = await res.json()
      setGeneratedPlan(plan)
      onPlanGenerated?.(plan)
    } catch (err) {
      console.error("Error generating plan:", err)
      setGeneratedPlan({ title: "Error", text: "Failed to fetch trip plan." })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
  <div className="md:h-full md:min-h-0 min-h-[100dvh] grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Panel: Forms */}
  <div className="md:h-full md:min-h-0 h-auto bg-white border border-black/10 rounded p-3 md:p-4 flex flex-col">
        {/* Header with back arrow and title */}
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold">Forms</h2>
        </div>
  <div className="md:flex-1 md:min-h-0 md:overflow-y-auto overflow-visible scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 space-y-6">
          {/* Form title */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Plan Your Sikkim Journey</h3>
            <p className="text-muted-foreground">Let AI create a personalized itinerary for your Sikkim adventure</p>
          </div>
          {/* Form fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Budget (INR)
              </Label>
              <Input
                id="budget"
                placeholder="e.g., 20000"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="bg-black/5 border-border"
              />
            </div>

            {/* Duration (Days) */}
            <div className="space-y-2">
              <Label htmlFor="days" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (Days)
              </Label>
              <Input
                type="number"
                id="days"
                placeholder="e.g., 3"
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
                className="bg-black/5 border-border"
              />
            </div>

            {/* Number of Travelers */}
            <div className="space-y-2">
              <Label htmlFor="travelers" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Travelers
              </Label>
              <Input
                type="number"
                id="travelers"
                placeholder="e.g., 2"
                value={formData.travelers}
                onChange={(e) => handleInputChange("travelers", e.target.value)}
                className="bg-black/5 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accommodation" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Accommodation Type
              </Label>
              <Select onValueChange={(value) => handleInputChange("accommodation", value)}>
                <SelectTrigger className="bg-black/5 border-border w-full md:w-auto">
                  <SelectValue placeholder="Select accommodation" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="budget">Budget Hotels</SelectItem>
                  <SelectItem value="mid-range">Mid-range Hotels</SelectItem>
                  <SelectItem value="luxury">Luxury Resorts</SelectItem>
                  <SelectItem value="homestay">Local Homestays</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Special Interests */}
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
              className="bg-black/5 border-border"
            />
          </div>
          {/* Generate Button */}
          <Button
            onClick={generateTripPlan}
            disabled={isGenerating || !formData.budget || !formData.days}
            className="w-full mt-2 md:mt-4"
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
      </div>
  {/* Right Panel: Output */}
    <div className="md:h-full md:min-h-0 h-auto bg-white border border-black/10 rounded p-3 md:p-4 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold">TRIP ITINERARY</h2>
        </div>
    <div className="md:flex-1 md:min-h-0 md:overflow-y-auto overflow-visible scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
          {!generatedPlan ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                <p className="text-lg">Ready to plan your perfect trip?</p>
                <p className="text-sm mt-2">Fill in the form and click "Generate Trip Plan" to get started!</p>
              </div>
            </div>
          ) : generatedPlan.text ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Generated by Gemini AI</span>
                </div>
                <Button variant="outline" onClick={() => setGeneratedPlan(null)} size="sm">
                  New Plan
                </Button>
              </div>
              <div className="trip-markdown">
                <ReactMarkdown>
                  {generatedPlan.text}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-destructive">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <p>Something went wrong while generating your trip plan.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setGeneratedPlan(null)}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

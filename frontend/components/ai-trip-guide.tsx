"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send, MapPin, Clock, Star, Users } from "lucide-react"

interface TripSuggestion {
  id: number
  title: string
  duration: string
  difficulty: "Easy" | "Moderate" | "Challenging"
  highlights: string[]
  monasteries: string[]
  bestTime: string
  description: string
}

const sampleSuggestions: TripSuggestion[] = [
  {
    id: 1,
    title: "Spiritual Heritage Trail",
    duration: "3 Days",
    difficulty: "Easy",
    highlights: ["Ancient monasteries", "Cultural immersion", "Mountain views", "Traditional ceremonies"],
    monasteries: ["Rumtek", "Enchey", "Ganesh Tok"],
    bestTime: "March - May",
    description:
      "Perfect for first-time visitors seeking spiritual experiences. Visit the most accessible monasteries around Gangtok with comfortable accommodations and easy transportation.",
  },
  {
    id: 2,
    title: "Complete Monastery Circuit",
    duration: "7 Days",
    difficulty: "Moderate",
    highlights: ["All major monasteries", "Festival participation", "Local cuisine", "Himalayan landscapes"],
    monasteries: ["Rumtek", "Pemayangtse", "Tashiding", "Enchey", "Dubdi"],
    bestTime: "September - November",
    description:
      "Comprehensive tour covering all major monasteries in Sikkim. Includes cultural festivals, traditional meals, and stunning Himalayan vistas.",
  },
  {
    id: 3,
    title: "Adventure & Spirituality",
    duration: "10 Days",
    difficulty: "Challenging",
    highlights: ["Remote monasteries", "Trekking routes", "High altitude", "Rare ceremonies"],
    monasteries: ["Tashiding", "Dubdi", "Pemayangtse", "Remote hermitages"],
    bestTime: "October - November",
    description:
      "For experienced travelers seeking remote spiritual sites. Includes trekking to high-altitude monasteries and participation in rare ceremonial events.",
  },
]

export function AITripGuide() {
  const [userQuery, setUserQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] = useState<TripSuggestion | null>(null)
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "ai"; content: string }>>([])

  const handleGenerateGuide = async () => {
    if (!userQuery.trim()) return

    setIsGenerating(true)
    setChatHistory((prev) => [...prev, { type: "user", content: userQuery }])

    // Simulate AI response (in real implementation, this would call Gemini API)
    setTimeout(() => {
      const randomSuggestion = sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)]
      setCurrentSuggestion(randomSuggestion)

      const aiResponse = `Based on your interests, I recommend the "${randomSuggestion.title}" experience. This ${randomSuggestion.duration} journey offers ${randomSuggestion.highlights.join(", ").toLowerCase()} and is perfect for ${randomSuggestion.difficulty.toLowerCase()} level travelers.`

      setChatHistory((prev) => [...prev, { type: "ai", content: aiResponse }])
      setIsGenerating(false)
      setUserQuery("")
    }, 2000)
  }

  const quickPrompts = [
    "Plan a 3-day spiritual journey",
    "Best monasteries for photography",
    "Family-friendly monastery visits",
    "Festival season recommendations",
    "Budget-friendly monastery tour",
    "Adventure and spirituality combo",
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Challenging":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">AI Trip Guide</h2>
        <Badge variant="secondary" className="text-xs">
          Powered by Gemini
        </Badge>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {chatHistory.length === 0 ? (
          <Card className="p-6 text-center bg-gradient-to-r from-primary/5 to-accent/5">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Welcome to your AI Trip Guide!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ask me anything about planning your monastery visit in Sikkim. I can help with itineraries,
              recommendations, and cultural insights.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => setUserQuery(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          chatHistory.map((message, index) => (
            <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[80%] p-3 ${
                  message.type === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </Card>
            </div>
          ))
        )}

        {/* Current Suggestion Display */}
        {currentSuggestion && (
          <Card className="p-4 bg-accent/10 border border-accent/20">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">{currentSuggestion.title}</h3>
              <Badge className={getDifficultyColor(currentSuggestion.difficulty)}>{currentSuggestion.difficulty}</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{currentSuggestion.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{currentSuggestion.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{currentSuggestion.bestTime}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Key Highlights</h4>
                <div className="flex gap-1 flex-wrap">
                  {currentSuggestion.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Monasteries Included</h4>
                <div className="flex gap-1 flex-wrap">
                  {currentSuggestion.monasteries.map((monastery, index) => (
                    <Badge key={index} className="text-xs bg-primary/20 text-primary">
                      {monastery}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1">
                <Star className="w-4 h-4 mr-2" />
                Save Itinerary
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Share Plan
              </Button>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex justify-start">
            <Card className="p-3 bg-card border border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="text-sm text-muted-foreground ml-2">Generating recommendations...</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask me about monastery visits, cultural experiences, travel planning..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleGenerateGuide()
              }
            }}
          />
          <Button onClick={handleGenerateGuide} disabled={!userQuery.trim() || isGenerating} className="self-end">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by Gemini AI</span>
        </div>
      </div>
    </div>
  )
}

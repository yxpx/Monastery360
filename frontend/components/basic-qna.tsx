"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"

interface QAItem {
  id: number
  question: string
  answer: string
  category: "general" | "visiting" | "culture" | "practical"
  tags: string[]
}

const qnaData: QAItem[] = [
  {
    id: 1,
    question: "What are the visiting hours for monasteries in Sikkim?",
    answer:
      "Most monasteries in Sikkim are open from 6:00 AM to 6:00 PM. However, specific timings may vary. Rumtek Monastery is open 6:00 AM - 6:00 PM, Pemayangtse is open 7:00 AM - 5:00 PM. It's recommended to visit during morning hours for the best experience and to witness morning prayers.",
    category: "visiting",
    tags: ["hours", "timing", "schedule"],
  },
  {
    id: 2,
    question: "What should I wear when visiting monasteries?",
    answer:
      "Dress modestly and respectfully. Wear long pants or skirts that cover your knees, and shirts that cover your shoulders. Remove shoes before entering prayer halls. Avoid bright colors and revealing clothing. Many monasteries provide shoe storage areas at the entrance.",
    category: "culture",
    tags: ["dress code", "etiquette", "respect"],
  },
  {
    id: 3,
    question: "Can I take photographs inside the monasteries?",
    answer:
      "Photography rules vary by monastery. Generally, photography is allowed in courtyards and exterior areas, but may be restricted inside prayer halls and near sacred artifacts. Always ask for permission before taking photos, especially of monks or during ceremonies. Some monasteries charge a small fee for photography.",
    category: "visiting",
    tags: ["photography", "rules", "restrictions"],
  },
  {
    id: 4,
    question: "What is the best time to visit Sikkim monasteries?",
    answer:
      "The best time to visit is during March-May and September-November when the weather is pleasant and clear. Avoid monsoon season (June-August) due to heavy rainfall and potential landslides. Winter visits (December-February) offer clear mountain views but can be very cold.",
    category: "practical",
    tags: ["weather", "season", "timing"],
  },
  {
    id: 5,
    question: "How do I reach the major monasteries from Gangtok?",
    answer:
      "Rumtek Monastery: 24 km from Gangtok (45 minutes by taxi). Enchey Monastery: 3 km from Gangtok (15 minutes). Pemayangtse: 110 km from Gangtok (3 hours via Pelling). Tashiding: 118 km from Gangtok (3.5 hours). Local taxis and shared jeeps are available.",
    category: "practical",
    tags: ["transport", "distance", "directions"],
  },
  {
    id: 6,
    question: "What are the main Buddhist traditions in Sikkim?",
    answer:
      "Sikkim primarily follows two Buddhist traditions: Nyingma (the oldest school) and Kagyu. Nyingma monasteries include Pemayangtse, Tashiding, and Enchey. Kagyu tradition is represented by Rumtek Monastery, which is the seat of the Karmapa. Each tradition has unique practices and teachings.",
    category: "culture",
    tags: ["Buddhism", "traditions", "schools"],
  },
  {
    id: 7,
    question: "Are there any entry fees for monasteries?",
    answer:
      "Most monasteries in Sikkim do not charge entry fees, but donations are welcome and appreciated. Some monasteries may charge a small fee for photography (usually ₹10-50). Contributions help maintain the monasteries and support the monastic community.",
    category: "practical",
    tags: ["fees", "donations", "cost"],
  },
  {
    id: 8,
    question: "Can I participate in monastery ceremonies?",
    answer:
      "Visitors are generally welcome to observe ceremonies and prayers, but participation depends on the specific monastery and ceremony. Morning and evening prayers are usually open to respectful observers. Special festivals may have different rules. Always ask the monks for guidance.",
    category: "culture",
    tags: ["ceremonies", "participation", "prayers"],
  },
]

const categories = [
  { id: "all", label: "All Questions", color: "bg-primary" },
  { id: "general", label: "General", color: "bg-secondary" },
  { id: "visiting", label: "Visiting", color: "bg-accent" },
  { id: "culture", label: "Culture", color: "bg-chart-1" },
  { id: "practical", label: "Practical", color: "bg-chart-2" },
]

export function BasicQNA() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const filteredQNA = qnaData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category)
    return cat?.color || "bg-muted"
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search questions, answers, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* QNA List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredQNA.length === 0 ? (
          <Card className="p-6 text-center bg-muted/30">
            <p className="text-muted-foreground">No questions found matching your search.</p>
          </Card>
        ) : (
          filteredQNA.map((item) => (
            <Card key={item.id} className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => toggleExpanded(item.id)}>
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <Badge className={`${getCategoryColor(item.category)} text-white text-xs`}>{item.category}</Badge>
                  </div>
                  <h3 className="font-medium text-foreground mb-2 pr-4">{item.question}</h3>

                  {expandedItems.includes(item.id) && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.answer}</p>
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  {expandedItems.includes(item.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredQNA.length} of {qnaData.length} questions
          </span>
          <span>Can't find what you're looking for? Try the AI Guide!</span>
        </div>
      </div>
    </div>
  )
}

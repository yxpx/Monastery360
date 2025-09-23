"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Route, Download, AudioWaveform } from "lucide-react"

interface LandingPageProps {
  onStartExploring: () => void
}

export function LandingPage({ onStartExploring }: LandingPageProps) {
  const features = [
    {
      icon: MapPin,
      title: "Interactive Maps",
      description: "Explore monasteries across Sikkim with detailed location mapping"
    },
    {
      icon: AudioWaveform,
      title: "Audio Guides",
      description: "Immersive audio experiences and virtual tours"
    },
    {
      icon: Calendar,
      title: "Festival Calendar",
      description: "Stay updated with monastery events and cultural celebrations"
    },
    {
      icon: Route,
      title: "Trip Planner",
      description: "Plan your spiritual journey with personalized itineraries"
    }
  ]

  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 dark:from-slate-950 dark:via-amber-950/20 dark:to-orange-950/10">
      {/* Sophisticated Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent"></div>
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-blue-100/20 via-purple-100/10 to-transparent dark:from-blue-900/20 dark:via-purple-900/10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-orange-100/20 via-pink-100/10 to-transparent dark:from-orange-900/20 dark:via-pink-900/10"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1/2 bg-gradient-to-t from-secondary/5 to-transparent rounded-full blur-3xl"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-20 w-24 h-24 bg-gradient-to-br from-accent/8 to-secondary/5 rounded-full blur-xl animate-bounce"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row min-h-full overflow-y-auto">
        
        {/* Left Side - Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-6 lg:py-8">
          <div className="max-w-2xl">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full border border-primary/20 backdrop-blur-sm">
                  <span className="text-sm font-medium text-primary">✨ Spiritual Journey Awaits</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold heading-luxe leading-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Monastery360
                </h1>
                
                <h2 className="text-xl lg:text-2xl font-semibold text-foreground/80 leading-tight">
                  Discover the Sacred Heritage of Sikkim
                </h2>
                
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Embark on a spiritual journey through ancient monasteries with interactive maps, 
                  immersive audio guides, and cultural insights. Experience the tranquility and 
                  wisdom of Himalayan Buddhism from anywhere in the world.
                </p>
              </div>
              
              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 lg:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">100+</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Monasteries</div>
                    <div className="text-xs text-muted-foreground">Sacred Sites</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">360°</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Virtual Tours</div>
                    <div className="text-xs text-muted-foreground">Immersive view</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">24/7</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Audio Guides</div>
                    <div className="text-xs text-muted-foreground">Always Available</div>
                  </div>
                </div>
              </div>
              
              {/* CTA Section */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={onStartExploring}
                  size="lg"
                  className="px-8 py-3 text-base font-semibold rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:via-primary hover:to-accent/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary/20"
                >
                  Start Exploring
                  <span className="ml-2">→</span>
                </Button>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
                    PWA Ready
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></div>
                    Offline Support
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500"></div>
                    Multilingual
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Feature Cards */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-6 lg:py-8">
          <div className="w-full max-w-lg">
            <div className="grid grid-cols-1 gap-3">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`group p-4 lg:p-5 bg-gradient-to-r backdrop-blur-xl border border-white/20 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                    index % 2 === 0 
                      ? 'from-card/80 via-card/60 to-primary/5' 
                      : 'from-secondary/5 via-card/60 to-accent/5'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${
                      index % 4 === 0 ? 'from-primary/20 to-primary/10' :
                      index % 4 === 1 ? 'from-secondary/20 to-secondary/10' :
                      index % 4 === 2 ? 'from-accent/20 to-accent/10' :
                      'from-primary/15 to-accent/15'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-5 h-5 ${
                        index % 4 === 0 ? 'text-primary' :
                        index % 4 === 1 ? 'text-secondary-foreground' :
                        index % 4 === 2 ? 'text-accent-foreground' :
                        'text-primary'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm lg:text-base text-foreground mb-1 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Bottom Feature Highlight */}
            <div className="mt-4 p-4 lg:p-5 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/10 backdrop-blur-sm">
              <div className="text-center space-y-2">
                <h3 className="text-xs lg:text-sm font-medium text-primary">Accessibility</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Designed following WCAG 2.1 AA best practices — semantic HTML structure, keyboard navigability, and ARIA used where appropriate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, ExternalLink } from "lucide-react"
import { Map } from "lucide-react"
import AudioGuideTTS from "@/components/audio-guide"

export interface ServiceDetailViewProps {
  service: any
  onBack: () => void
}

export function ServiceDetailView({ service, onBack }: ServiceDetailViewProps) {
  const hasEmbed = service.embed_link?.includes('<iframe')
  return (
    <div className="h-full flex flex-col min-h-0 max-h-full">
      {/* Header */}
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border flex-shrink-0">
        <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{service.name}</h1>
      </div>
      {/* Booking section */}
      {service.booking && (
        <div className="p-4 border-b border-border flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => window.open(service.booking, '_blank')}
            aria-label={`Book ${service.name}`}
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Book
          </Button>
        </div>
      )}
      {/* Content panels */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
        {/* Embed Panel */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 p-4 bg-card border border-border rounded-lg overflow-hidden">
            {hasEmbed ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: service.embed_link.replace(
                  'width="600" height="450"',
                  'width="100%" height="100%" style="min-height:400px;"'
                ) }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <Map className="w-16 h-16 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No 360° view available</p>
              </div>
            )}
          </Card>
        </div>
        {/* Description and Audio Panel */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4 min-h-0">
          <Card className="flex-1 p-4 bg-card border border-border rounded-lg overflow-y-auto">
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap" id="service-desc">
              {service.l_desc}
            </div>
          </Card>
          <Card className="p-4 bg-card border border-border rounded-lg flex-shrink-0">
            <AudioGuideTTS text={service.l_desc || service.s_desc} selector="#service-desc" />
          </Card>
        </div>
      </div>
    </div>
  )
}

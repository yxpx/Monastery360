import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import AudioGuideTTS from "@/components/audio-guide"

export interface ArchiveDetailViewProps {
  archive: any
  onBack: () => void
}

export function ArchiveDetailView({ archive, onBack }: ArchiveDetailViewProps) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{archive.name}</h1>
      </div>
      {/* Detail Panels: Image and Description */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
        {/* Image Panel */}
        <Card className="flex-1 p-4 bg-card border border-border rounded-lg flex items-center justify-center">
          {imgError ? (
            <div className="text-center text-muted-foreground">
              <p>Image not available</p>
            </div>
          ) : (
            <Image
              src={`/data/archive/${archive.id}.png`}
              alt={archive.name}
              width={800}
              height={600}
              className="object-contain rounded-lg max-w-full max-h-full"
              onError={() => setImgError(true)}
            />
          )}
        </Card>

        {/* Description Panel */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4 min-h-0">
          <Card className="flex-1 p-4 bg-card border border-border rounded-lg overflow-y-auto">
            <div className="text-sm text-foreground whitespace-pre-wrap break-words" id="archive-desc">
              {archive.l_desc.split(/(https?:\/\/[^\s]+)/g).map((part: string, idx: number) =>
                part.match(/^https?:\/\//) ? (
                  <a key={idx} href={part} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    {part}
                  </a>
                ) : (
                  <span key={idx}>{part}</span>
                )
              )}
            </div>
          </Card>
          <Card className="p-4 bg-card border border-border rounded-lg flex-shrink-0">
            <AudioGuideTTS text={archive.l_desc || archive.s_desc} selector="#archive-desc" />
          </Card>
        </div>
      </div>
    </div>
  )
}

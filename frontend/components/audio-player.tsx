"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Download,
  Heart,
  List,
} from "lucide-react"

interface AudioTrack {
  id: number
  title: string
  monastery: string
  type: "guide" | "prayer" | "ambient" | "teaching"
  duration: string
  url: string
  description: string
}

const audioTracks: AudioTrack[] = [
  {
    id: 1,
    title: "Rumtek Monastery Audio Guide",
    monastery: "Rumtek",
    type: "guide",
    duration: "12:45",
    url: "/audio/rumtek-guide.mp3",
    description: "Complete guided tour of Rumtek Monastery with historical insights",
  },
  {
    id: 2,
    title: "Morning Prayer Chants",
    monastery: "Pemayangtse",
    type: "prayer",
    duration: "8:30",
    url: "/audio/morning-prayers.mp3",
    description: "Traditional morning prayer chants from Pemayangtse Monastery",
  },
  {
    id: 3,
    title: "Himalayan Meditation Sounds",
    monastery: "Tashiding",
    type: "ambient",
    duration: "15:20",
    url: "/audio/meditation-ambient.mp3",
    description: "Peaceful ambient sounds for meditation and relaxation",
  },
  {
    id: 4,
    title: "Buddhist Philosophy Teaching",
    monastery: "Enchey",
    type: "teaching",
    duration: "18:15",
    url: "/audio/philosophy-teaching.mp3",
    description: "Introduction to Buddhist philosophy and meditation practices",
  },
  {
    id: 5,
    title: "Evening Prayer Ceremony",
    monastery: "Dubdi",
    type: "prayer",
    duration: "10:45",
    url: "/audio/evening-prayers.mp3",
    description: "Traditional evening prayer ceremony with monks chanting",
  },
]

interface AudioPlayerProps {
  currentTrackId?: number
  onTrackChange?: (trackId: number) => void
  compact?: boolean
}

export function AudioPlayer({ currentTrackId = 1, onTrackChange, compact = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const currentTrack = audioTracks.find((track) => track.id === currentTrackId) || audioTracks[0]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleTrackEnd)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleTrackEnd)
    }
  }, [currentTrackId])

  const handleTrackEnd = () => {
    if (isRepeat) {
      audioRef.current?.play()
    } else {
      handleNext()
    }
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    const currentIndex = audioTracks.findIndex((track) => track.id === currentTrackId)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : audioTracks.length - 1
    onTrackChange?.(audioTracks[previousIndex].id)
  }

  const handleNext = () => {
    const currentIndex = audioTracks.findIndex((track) => track.id === currentTrackId)
    let nextIndex

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * audioTracks.length)
    } else {
      nextIndex = currentIndex < audioTracks.length - 1 ? currentIndex + 1 : 0
    }

    onTrackChange?.(audioTracks[nextIndex].id)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    setVolume(newVolume)
    audio.volume = newVolume / 100
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume / 100
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "guide":
        return "bg-primary text-primary-foreground"
      case "prayer":
        return "bg-accent text-accent-foreground"
      case "ambient":
        return "bg-secondary text-secondary-foreground"
      case "teaching":
        return "bg-chart-1 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (compact) {
    return (
      <Card className="p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={togglePlay} className="flex-shrink-0">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground">{currentTrack.monastery}</p>
          </div>
          <Badge className={`${getTypeColor(currentTrack.type)} text-xs`}>{currentTrack.type}</Badge>
        </div>
        <audio ref={audioRef} src={currentTrack.url} />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Current Track Info */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.monastery} Monastery</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(currentTrack.type)}>{currentTrack.type}</Badge>
            <Button size="sm" variant="ghost" onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{currentTrack.description}</p>
      </Card>

      {/* Main Player Controls */}
      <Card className="p-4 bg-card border border-border rounded-lg">
        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button size="sm" variant="ghost" onClick={() => setIsShuffle(!isShuffle)}>
            <Shuffle className={`w-4 h-4 ${isShuffle ? "text-primary" : ""}`} />
          </Button>
          <Button size="sm" variant="ghost" onClick={handlePrevious}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button size="lg" onClick={togglePlay}>
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNext}>
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsRepeat(!isRepeat)}>
            <Repeat className={`w-4 h-4 ${isRepeat ? "text-primary" : ""}`} />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={toggleMute}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8">{isMuted ? 0 : volume}%</span>
        </div>
      </Card>

      {/* Additional Controls */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="flex-1 bg-transparent"
        >
          <List className="w-4 h-4 mr-2" />
          Playlist
        </Button>
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <Card className="p-4 bg-card border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Audio Collection</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {audioTracks.map((track) => (
              <div
                key={track.id}
                className={`p-2 rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${
                  track.id === currentTrackId ? "bg-primary/10 border border-primary/20" : ""
                }`}
                onClick={() => onTrackChange?.(track.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {track.monastery} • {track.duration}
                    </p>
                  </div>
                  <Badge className={`${getTypeColor(track.type)} text-xs ml-2`}>{track.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <audio ref={audioRef} src={currentTrack.url} />
    </div>
  )
}

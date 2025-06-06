import { useRef, useEffect, useState } from "react"
import { Pause, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VideoCard() {
  const videoRef = useRef(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true // Requerido para autoplay en muchos navegadores
      video.play()
        .then(() => {
          setTimeout(() => {
            video.pause()
            video.currentTime = 0
          }, 1000) // Reproducir 1 segundo y pausar para mostrar la miniatura
        })
        .catch(err => {
          console.warn("No se pudo reproducir automáticamente el video:", err)
        })
    }
  }, [])

  const handleVideoToggle = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsVideoPlaying(true)
    } else {
      video.pause()
      setIsVideoPlaying(false)
    }
  }

  return (
    <div className="relative">
      <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0 relative">
          <video
            ref={videoRef}
            src="/assets/img/vista.mp4"
            className="w-full aspect-video object-cover"
            poster="/placeholder.svg?height=400&width=600"
            playsInline
            muted
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          >
            Tu navegador no soporta la reproducción de este video.
          </video>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            onClick={handleVideoToggle}
          >
            {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

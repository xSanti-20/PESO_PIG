"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { MapPin, Users, Award } from "lucide-react"
import VideoCard from "./VideoCard"
import Image from "next/image"

function HomePage() {
  const { isMobile } = useMobile()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      img: "/assets/img/overview.jpeg",
      title: "Ubicación Estratégica",
      description: "Espinal, Tolima, a 435 metros sobre el nivel del mar, con un clima promedio de 28°C.",
      icon: MapPin,
      badge: "Ubicación",
    },
    {
      img: "/assets/img/production.jpeg",
      title: "Producción Integral",
      description: "Ciclo completo: lechones precebo, machos terminados y hembras para cría.",
      icon: Award,
      badge: "Producción",
    },
    {
      img: "/assets/img/training.jpeg",
      title: "Formación Técnica",
      description: "Instrucción técnica de alta calidad a cargo de Gestores y Pasantes de la unidad de Porcinos.",
      icon: Users,
      badge: "Formación",
    },
  ]

  const galleryImages = ["gallery1", "gallery2", "gallery3", "gallery4", "gallery5", "gallery6"]

  const handleVideoToggle = () => {
    const video = document.querySelector("video")
    if (video) {
      if (isVideoPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-purple-100/50"></div>
        <div className="relative container mx-auto px-4 max-w-6xl text-center">
          <Badge variant="outline" className="mb-6 text-lg px-4 py-2 bg-white/80 backdrop-blur-sm">
            Software Innovador
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 tracking-tight">PESO PIG</h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
            Peso Pig es un software innovador diseñado para optimizar y automatizar los procesos de pesaje y
            alimentación. Nuestro sistema garantiza precisión, eficiencia y un manejo inteligente de los recursos,
            ofreciendo soluciones personalizadas para maximizar el rendimiento en cada operación.
          </p>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`${isMobile ? "order-2" : "order-1"} space-y-6`}>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                Desde 1958
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                Bienvenidos a la Unidad de Porcinos
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ubicada en el Espinal, Tolima, nuestra unidad ha sido un referente en formación, investigación y
                producción porcícola desde 1958. Con un enfoque en la sostenibilidad y el desarrollo práctico,
                preparamos a nuestros aprendices para liderar el sector agropecuario del futuro.
              </p>
              <Button variant="outline" size="lg" className="mt-6">
                Nuestra Historia
              </Button>
            </div>
            <VideoCard />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nuestra Filosofía</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprometidos con la excelencia en formación y producción porcícola
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  Misión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Formar aprendices en el campo porcícola mediante procesos prácticos de investigación, producción y
                  comercialización. Fomentamos el desarrollo regional y la competitividad de nuestros egresados.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  Visión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Ser un modelo nacional de producción porcina sostenible, contribuyendo al desarrollo rural y
                  promoviendo la investigación aplicada en colaboración con universidades y empresas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Datos Destacados</h2>
            <p className="text-lg text-gray-600">Conoce los aspectos más importantes de nuestra unidad</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="group shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden h-48">
                      <Image
                        src={feature.img || "/placeholder.svg"}
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800">{feature.badge}</Badge>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <IconComponent className="w-6 h-6 text-pink-500" />
                        <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Galería</h2>
            <p className="text-lg text-gray-600">Explora nuestras instalaciones y actividades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, index) => (
              <Card
                key={index}
                className="group overflow-hidden shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden h-64">
                    <Image
                      src={`/assets/img/${img}.jpeg`}
                      alt={`Galería ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[var(--bg-color-rosado)] to-[var(--bg-color-primary)] text-black py-6 text-center">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="space-y-2">
            <p className="text-lg font-bold">© 2024 SENA</p>
            <p className="text-sm opacity-90">Todos Los Derechos Reservados</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default HomePage

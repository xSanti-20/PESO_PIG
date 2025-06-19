"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import PublicNav from "@/components/nav/PublicNav"
import { FaWhatsapp, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

export default function QuienesSomos() {
  const { isMobile, isTablet, isDesktop } = useMobile()

  const teamMembers = [
    {
      name: "Santiago Puentes",
      role: "Gerente de Proyecto",
      image: "/assets/img/santiagoo.jpg",
      phone: "+57 311 260 4880",
      description:
        "Con una sólida experiencia en la coordinación de equipos, Santiago asegura que los proyectos se entreguen a tiempo, gestionando recursos de manera eficiente y promoviendo la comunicación efectiva entre todas las partes involucradas.",
    },
    {
      name: "Danna Marcela",
      role: "Analista y Desarrollador de Software",
      image: "/assets/img/dana.jpg",
      phone: "+57 320 456 3776",
      description:
        "Experta en interfaces de usuario, Danna combina creatividad y técnica para crear experiencias digitales intuitivas, priorizando la accesibilidad y el diseño centrado en el usuario.",
    },
    {
      name: "Sofia Guzman",
      role: "Subgerente de Proyecto",
      image: "/assets/img/sofi.jpeg",
      phone: "+57 314 526 7223",
      description:
        "Especialista en gestión ágil, Sofia se asegura de que cada proyecto cumpla con los objetivos del cliente y sea entregado dentro del plazo acordado, fomentando siempre el trabajo en equipo y la excelencia.",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1))
  }

  const member = teamMembers[currentIndex]

  const getResponsiveClasses = (mobile, tablet, desktop) => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  return (
    <>
      <PublicNav />
      <div className={`container mx-auto px-4 ${getResponsiveClasses("py-4", "py-6", "py-8")}`}>
        <h1 className={`font-bold text-center mb-6 ${getResponsiveClasses("text-2xl", "text-3xl", "text-4xl")}`}>
          Quiénes Somos
        </h1>

        <div className={`mb-8 text-justify mx-auto ${getResponsiveClasses("max-w-full", "max-w-2xl", "max-w-3xl")}`}>
          <p className={`mb-4 ${getResponsiveClasses("text-sm leading-relaxed", "text-base", "text-base")}`}>
            Somos un equipo de desarrolladores y programadores de software dedicados a crear soluciones tecnológicas
            innovadoras que transforman ideas en realidad. Con experiencia en diversas tecnologías y metodologías
            ágiles, trabajamos en conjunto para diseñar proyectos, desarrollar y entregar que se adaptan a las
            necesidades de nuestros clientes y usuarios.
          </p>
        </div>

        <h2 className={`font-semibold text-center mb-6 ${getResponsiveClasses("text-xl", "text-2xl", "text-3xl")}`}>
          Nuestro Equipo
        </h2>

        <div className={`flex justify-center items-center gap-4 mb-8 ${getResponsiveClasses("px-2", "px-4", "px-6")}`}>
          <button
            onClick={handlePrev}
            className={`text-gray-600 hover:text-black transition-colors ${getResponsiveClasses(
              "text-lg p-2",
              "text-xl p-2",
              "text-2xl p-3",
            )}`}
            aria-label="Miembro anterior"
          >
            <FaChevronLeft />
          </button>

          <Card
            className={`
              flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden min-h-[20rem]
              ${getResponsiveClasses("w-full max-w-sm", "max-w-2xl", "max-w-4xl")}
            `}
          >
            {/* Imagen con altura consistente */}
            <div
              className={`
                flex-shrink-0 relative
                ${getResponsiveClasses("w-full h-60", "md:w-1/2 md:h-80", "md:w-1/2 md:h-96")}
              `}
            >
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={currentIndex === 0}
              />
            </div>

            <CardContent
              className={`
                flex-1 p-4 flex flex-col justify-center
                ${getResponsiveClasses("text-center", "md:p-5 md:text-left", "md:p-6 md:text-left")}
              `}
            >
              <h3 className={`font-semibold mb-1 ${getResponsiveClasses("text-lg", "text-xl", "text-2xl")}`}>
                {member.name}
              </h3>
              <p className={`text-gray-500 mb-3 ${getResponsiveClasses("text-sm", "text-base", "text-base")}`}>
                {member.role}
              </p>
              <p
                className={`mb-4 text-justify ${getResponsiveClasses("text-xs leading-relaxed", "text-sm", "text-sm")}`}
              >
                {member.description}
              </p>
              <div
                className={`flex items-center text-green-600 gap-2 ${getResponsiveClasses("justify-center", "justify-center md:justify-start", "justify-center md:justify-start")}`}
              >
                <FaWhatsapp className={getResponsiveClasses("text-sm", "text-base", "text-base")} />
                <a
                  href={`https://wa.me/${member.phone.replace(/\s/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline hover:text-green-700 transition-colors ${getResponsiveClasses(
                    "text-xs",
                    "text-sm",
                    "text-sm",
                  )}`}
                >
                  {member.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          <button
            onClick={handleNext}
            className={`text-gray-600 hover:text-black transition-colors ${getResponsiveClasses(
              "text-lg p-2",
              "text-xl p-2",
              "text-2xl p-3",
            )}`}
            aria-label="Siguiente miembro"
          >
            <FaChevronRight />
          </button>
        </div>

        {isMobile && (
          <div className="flex justify-center gap-2 mb-6">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                aria-label={`Ir al miembro ${index + 1}`}
              />
            ))}
          </div>
        )}

        {isMobile && (
          <div className="flex justify-between items-center mb-6 px-4">
            <span className="text-sm text-gray-600">
              {currentIndex + 1} de {teamMembers.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <footer
        className={`text-black font-bold ${getResponsiveClasses("py-3", "py-4", "py-4")}`}
        style={{
          background: "linear-gradient(to right, var(--bg-color-rosado), var(--bg-color-primary))",
        }}
      >
        <div className="container mx-auto text-center">
          <p className={getResponsiveClasses("text-xs", "text-sm", "text-sm")}>
            © 2024 PESO PIG. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  )
}

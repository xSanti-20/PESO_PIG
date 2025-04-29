"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PublicNav from "@/components/nav/PublicNav";
import { FaWhatsapp, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function QuienesSomos() {
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  const member = teamMembers[currentIndex];

  return (
    <>
      <PublicNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Quiénes Somos</h1>

        <div className="mb-12 text-justify max-w-3xl mx-auto">
          <p className="mb-4">
            Somos un equipo de desarrolladores y programadores de software dedicados a crear soluciones tecnológicas innovadoras que transforman ideas en
            realidad. Con experiencia en diversas tecnologías y metodologías ágiles, trabajamos en conjunto para diseñar proyectos, desarrollar y entregar
            que se adaptan a las necesidades de nuestros clientes y usuarios.
          </p>
        </div>

        <h2 className="text-3xl font-semibold text-center mb-8">Nuestro Equipo</h2>

        <div className="flex justify-center items-center gap-6 mb-12">
          <button onClick={handlePrev} className="text-2xl text-gray-600 hover:text-black">
            <FaChevronLeft />
          </button>

          <Card className="flex flex-col md:flex-row items-center max-w-4xl shadow-xl rounded-2xl overflow-hidden">
            <div className="w-full md:w-1/2 h-64 md:h-full">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <CardContent className="w-full md:w-1/2 p-6 text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
              <p className="text-gray-500 mb-2">{member.role}</p>
              <p className="text-sm mb-4 text-justify">{member.description}</p>
              <div className="flex justify-center md:justify-start items-center text-green-600 gap-2">
                <FaWhatsapp />
                <a
                  href={`https://wa.me/${member.phone.replace(/\s/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-sm"
                >
                  {member.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          <button onClick={handleNext} className="text-2xl text-gray-600 hover:text-black">
            <FaChevronRight />
          </button>
        </div>
      </div>

      <footer
        className="text-black py-4 font-bold"
        style={{
          background: "linear-gradient(to right, var(--bg-color-rosado), var(--bg-color-primary))",
        }}
      >
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2024 PESO PIG. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

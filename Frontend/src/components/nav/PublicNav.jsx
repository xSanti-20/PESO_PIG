"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

function PublicNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isMobile, isTablet } = useMobile()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (!isMobile && !isTablet) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile, isTablet])

  return (
    <>
      <nav className="bg-nav-public shadow-lg relative z-40">
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* Logo (Izquierda) */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img
                src="/assets/img/pesopig.png"
                alt="PesoPig"
                width={isMobile ? 40 : isTablet ? 50 : 65}
                height={isMobile ? 35 : isTablet ? 45 : 60}
                className="transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Menu - Centrado */}
          {!isMobile && !isTablet && (
            <>
              {/* Enlaces de navegación (Centro) */}
              <div className="flex-1 flex justify-center">
                <div className="flex space-x-12">
                  <Link
                    href="/about"
                    className="text-white font-bold hover:underline transition-all duration-300 hover:text-white/80"
                  >
                    ¿Quiénes Somos?
                  </Link>
                  <Link
                    href="/contact"
                    className="text-white font-bold hover:underline transition-all duration-300 hover:text-white/80"
                  >
                    Contáctanos
                  </Link>
                  <Link
                    href="/documentations"
                    className="text-white font-bold hover:underline transition-all duration-300 hover:text-white/80"
                  >
                    Documentación
                  </Link>
                </div>
              </div>

              {/* Botón Ingresar (Derecha) */}
              <div className="flex-shrink-0">
                <Button asChild variant="secondary" className="text-sm bg-white text-gray-800 hover:bg-white/90">
                  <Link href="/user/login">Ingresar</Link>
                </Button>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          {(isMobile || isTablet) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-white/20"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        {(isMobile || isTablet) && isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMobileMenu} />

            <div className="fixed top-0 left-0 right-0 bg-nav-public-mobile shadow-lg z-50 animate-slide-down p-4">
              <div className="container mx-auto flex flex-col space-y-4">
                <div className="flex justify-between items-center border-b border-white/20 pb-4">
                  <div className="flex items-center space-x-3">
                    <img src="/assets/img/pesopig.png" alt="PesoPig" width={40} height={35} />
                    <span className="text-white font-bold text-lg">PesoPig</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileMenu}
                    className="text-white hover:bg-white/20"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/about"
                    className="block text-white hover:bg-white/20 py-3 px-4 rounded-lg font-medium transition-colors"
                    onClick={closeMobileMenu}
                  >
                    ¿Quiénes Somos?
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-white hover:bg-white/20 py-3 px-4 rounded-lg font-medium transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Contáctanos
                  </Link>
                  <Link
                    href="/documentations"
                    className="block text-white hover:bg-white/20 py-3 px-4 rounded-lg font-medium transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Documentación
                  </Link>
                </nav>

                <div className="">
                  <Button asChild className="w-full bg-white text-gray-800 hover:bg-white/90 font-medium">
                    <Link href="/user/login" onClick={closeMobileMenu}>
                      Ingresar
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      <style jsx>{`
        .bg-nav-public {
          background: linear-gradient(135deg, var(--bg-color-primary), var(--bg-color-rosado)) !important;
        }

        .bg-nav-public-mobile {
          background: linear-gradient(135deg, var(--bg-color-primary), var(--bg-color-rosado)) !important;
        }

        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        :root {
          --bg-color-primary: #1B8FB0;
          --bg-color-rosado: #E57B76;
        }
      `}</style>
    </>
  )
}

export default PublicNav

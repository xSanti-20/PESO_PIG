import PublicNav from "@/components/nav/PublicNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin } from "lucide-react"

const ContactPage = () => {
  return (
    <>
      <PublicNav></PublicNav>
      <div className="min-h-screen bg-gradient-to-br from-white-50 to-purple-50">
        {/* Header Section */}
        <header className="relative py-16 px-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-white-200/30 to-purple-200/30 rounded-3xl mx-4"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">¡CONTACTANOS!🐷</h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Si necesitas ayuda o tienes alguna sugerencia, comunícate con nosotros. El equipo de desarrollo está aquí
              para apoyarte y ayudarte a aprovechar al máximo nuestro software.
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 pb-16 space-y-12">
          {/* Contact Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center text-gray-800">Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100">
                  <Phone className="w-8 h-8 text-pink-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Teléfono:</p>
                    <a
                      href="https://wa.me/573014434734"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      +57 3014434734
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100">
                  <Mail className="w-8 h-8 text-pink-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Correo:</p>
                    <a
                      href="mailto:proyectopesopig@gmail.com"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      proyectopesopig@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100">
                  <MapPin className="w-8 h-8 text-pink-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Dirección:</p>
                    <a
                      href="https://www.google.com/maps/search/?q=Centro+Agropecuario+La+Granja,+Espinal,+Tolima"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      Centro Agropecuario La Granja, Espinal, Tolima
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center text-gray-800">
                Síguenos en nuestras redes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-8">
                <a
                  href="https://wa.me/3014434734"
                  className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition-all duration-300 transform hover:scale-105"
                >
                  <img src="/assets/icons/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
                  <span className="font-semibold text-green-800">WhatsApp</span>
                </a>

                <a
                  href="https://www.instagram.com/uniporcinosespinal?igsh=MW43aXNmcm5mNmo4dw==."
                  className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-pink-100 to-purple-200 hover:from-pink-200 hover:to-purple-300 transition-all duration-300 transform hover:scale-105"
                >
                  <img src="/assets/icons/instagram.png" alt="Instagram" className="w-8 h-8" />
                  <span className="font-semibold text-purple-800">Instagram</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Form and Map Section
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form 
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Escríbenos para más información</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      className="h-12 text-lg border-2 border-pink-200 focus:border-pink-400 rounded-lg"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Tu correo"
                      className="h-12 text-lg border-2 border-pink-200 focus:border-pink-400 rounded-lg"
                    />
                  </div>

                  <div>
                    <Textarea
                      placeholder="Tu mensaje"
                      rows={5}
                      className="text-lg border-2 border-pink-200 focus:border-pink-400 rounded-lg resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card> */}

            {/* Map */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Nuestra Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <iframe
                    className="w-full h-80 lg:h-96"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.5103103899733!2d-74.92858405906603!3d4.173630179762671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3ed4838908caab%3A0x6a92913310256ac9!2sSena%20La%20Granja!5e1!3m2!1ses!2sco!4v1732748911707!5m2!1ses!2sco"
                    allowFullScreen=""
                    loading="lazy"
                    title="Ubicación Centro Agropecuario La Granja"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[var(--bg-color-rosado)] to-[var(--bg-color-primary)] text-black py-6 text-center">
        <div className="container mx-auto text-center">
          <p className="text-sm font-bold">© 2024 PESO PIG. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  )
}

export default ContactPage

import React from 'react';
import './page.css'; // Archivo de estilos CSS
import PublicNav from '@/components/nav/PublicNav';

const ContactPage = () => {
  return (
    <>
      <PublicNav />
      <div className="contact-page">
        {/* Encabezado decorado con el emoji y formas */}
        <header className="contact-header">
          <div className="header-decoration"></div>
          <h1 className="contact-title">¡CONTACTANOS!🐷</h1>
          <p className="contact-subtitle">
            Si necesitas ayuda o tienes alguna sugerencia, comunícate con nosotros.
            El equipo de desarrollo está aquí para apoyarte y ayudarte a aprovechar al máximo nuestro software.
          </p>
        </header>

        {/* Sección de información de contacto */}
        <section className="contact-details">
          <h2 className="section-title">Información de Contacto</h2>
          <div className="contact-info">
            <p>
              <span className="icon">📞</span>
              Teléfono: <a href="https://wa.me/573014434734" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                +57 3014434734
              </a>
            </p>
            <p>
              <span className="icon">📧</span>
              Correo: <a href="mailto:proyectopesopig@gmail.com" className="text-blue-600 hover:underline">
                proyectopesopig@gmail.com
              </a>
            </p>
            <p>
              <span className="icon">📍</span>
              Dirección: <a href="https://www.google.com/maps/search/?q=Centro+Agropecuario+La+Granja,+Espinal,+Tolima"
                target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Centro Agropecuario La Granja, Espinal, Tolima
              </a>
            </p>
          </div>
        </section>

        {/* Redes sociales */}

        <section className="contact-social">
          <h2 className="section-title">Síguenos en nuestras redes</h2>
          <div className="social-links flex space-x-4">
            <a href="https://wa.me/3014434734" className="social-link flex items-center">
              <img
                src="/assets/icons/WhatsApp.png"
                alt="WhatsApp"
                className="w-6 h-6 mr-2"
              />
              WhatsApp
            </a>
            <a href="https://instagram.com" className="social-link flex items-center">
              <img
                src="/assets/icons/instagram.png"
                alt="Instagram"
                className="w-6 h-6 mr-2"
              />
              Instagram
            </a>
          </div>
        </section>


        {/* Contenedor de formulario y mapa */}
        <section className="contact-form-map-container">
          <div className="contact-form-section">
            <h2 className="section-title">Escríbenos para mas informacion</h2>
            <form className="contact-form">
              <input type="text" className="contact-input" placeholder="Tu nombre" />
              <input type="email" className="contact-input" placeholder="Tu correo" />
              <textarea
                className="contact-textarea"
                placeholder="Tu mensaje"
                rows="5"
              ></textarea>
              <button type="submit" className="contact-button">
                Enviar Mensaje
              </button>
            </form>
          </div>

          <div className="contact-map">
            <h2 className="section-title">Nuestra Ubicación</h2>
            <iframe
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.5103103899733!2d-74.92858405906603!3d4.173630179762671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3ed4838908caab%3A0x6a92913310256ac9!2sSena%20La%20Granja!5e1!3m2!1ses!2sco!4v1732748911707!5m2!1ses!2sco"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

        </section>
      </div>
      <footer
        className="text-black py-4 mt-8 font-bold"
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
};

export default ContactPage;

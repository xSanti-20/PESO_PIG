'use client';
import React from "react";

function HomePage() {
    return (
        <>
            <main className="w-full bg-gray-100">
                {/* Encabezado Principal */}
                <header className="text-black py-12 text-center">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h1 className="text-4xl md:text-5xl font-bold mt-10">PESO PIG</h1>
                        <p className="text-lg md:text-xl mt-4 leading-relaxed max-w-4xl mx-auto">
                            Peso Pig es un software innovador diseñado para optimizar y automatizar los procesos de pesaje y alimentación. Nuestro sistema garantiza precisión, eficiencia y un manejo inteligente de los recursos, ofreciendo soluciones personalizadas para maximizar el rendimiento en cada operación.
                        </p>
                    </div>
                </header>

                {/* Sección de Bienvenida */}
                <section className="container mx-auto px-4 max-w-6xl my-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center md:text-left flex flex-col justify-center -mt-24 md:-mt-44">
                        <h2 className="text-3xl font-semibold mb-6">Bienvenidos a la Unidad de Porcinos</h2>
                        <p className="text-lg text-gray-700">
                            Ubicada en el Espinal, Tolima, nuestra unidad ha sido un referente en formación, investigación y producción porcícola desde 1958. Con un enfoque en la sostenibilidad y el desarrollo práctico, preparamos a nuestros aprendices para liderar el sector agropecuario del futuro.
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <video
                            src="/assets/img/vista.mp4"
                            controls
                            className="rounded-lg shadow-lg w-auto max-w-lg aspect-square object-cover"
                        >
                            Tu navegador no soporta la reproducción de este video.
                        </video>
                    </div>
                </section>

                {/* Sección de Misión y Visión */}
                <section className="bg-gray-100 py-12 text-center">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-2xl font-semibold mb-4">Misión</h3>
                                <p className="text-gray-700">
                                    Formar aprendices en el campo porcícola mediante procesos prácticos de investigación, producción y comercialización. Fomentamos el desarrollo regional y la competitividad de nuestros egresados.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-2xl font-semibold mb-4">Visión</h3>
                                <p className="text-gray-700">
                                    Ser un modelo nacional de producción porcina sostenible, contribuyendo al desarrollo rural y promoviendo la investigación aplicada en colaboración con universidades y empresas.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección de Características Destacadas */}
                <section className="container mx-auto my-12 px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-8">Datos Destacados</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                img: "/assets/img/overview.jpeg",
                                title: "Ubicación Estratégica",
                                description: "Espinal, Tolima, a 435 metros sobre el nivel del mar, con un clima promedio de 28°C.",
                                targetId: "ubicacion"
                            },
                            {
                                img: "/assets/img/production.jpeg",
                                title: "Producción Integral",
                                description: "Ciclo completo: lechones precebo, machos terminados y hembras para cría."
                            },
                            {
                                img: "/assets/img/training.jpeg",
                                title: "Formación Técnica",
                                description: "Instrucción técnica de alta calidad a cargo de Gestores y Pasantes de la unidad de Porcinos."
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                onClick={() =>
                                    feature.targetId &&
                                    document.getElementById(feature.targetId)?.scrollIntoView({ behavior: "smooth" })
                                }
                                className="bg-white shadow-md rounded-lg p-6 text-center hover:scale-105 transition-transform cursor-pointer"
                            >
                                <img
                                    src={feature.img}
                                    alt={feature.title}
                                    className="rounded-lg mb-4 w-full h-48 object-cover"
                                />
                                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Galería de Imágenes */}
                <section className="bg-gray-100 py-12">
                    <div className="container mx-auto text-center px-4 max-w-6xl">
                        <h2 className="text-3xl font-bold mb-8">Galería</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                "gallery1", "gallery2", "gallery3",
                                "gallery4", "gallery5", "gallery6"
                            ].map((img, index) => (
                                <img
                                    key={index}
                                    src={`/assets/img/${img}.jpeg`}
                                    alt={`Galería ${index + 1}`}
                                    className="rounded-lg shadow-lg w-full h-64 object-cover"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pie de Página */}
                <footer className="bg-gradient-to-r from-[var(--bg-color-rosado)] to-[var(--bg-color-primary)] text-black py-6 text-center">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <p className="text-sm font-bold">© 2024 SENA. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </main>
        </>
    );
}

export default HomePage;

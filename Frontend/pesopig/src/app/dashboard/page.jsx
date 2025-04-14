"use client"
import PrivateNav from "@/components/nav/PrivateNav";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css"; // Importamos el CSS separado

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleNavigation = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(path);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      <div className="flex flex-col flex-1">
        <PrivateNav>
          <div className={styles.dashboardContainer}>
            {/* Imagen de bienvenida */}
            <Image
              src="/assets/img/dashboard.jpg"
              alt="Dashboard"
              width={350}  // Aumentado el tamaño
              height={230}  // Aumentado el tamaño
              className={styles.dashboardImage}
            />

            {/* Mensaje de bienvenida */}
            <h1 className={styles.welcomeText}>¡Bienvenido al Home de Peso Pig!</h1>
            <p className={styles.welcomeDescription}>
              Aquí puedes gestionar todos los procesos de los animales 
              de manera eficiente. Accede a los módulos y administra todo con facilidad.
            </p>
          </div>
        </PrivateNav>
      </div>
    </div>
  );
}

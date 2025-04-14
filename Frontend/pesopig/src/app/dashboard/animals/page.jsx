"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/nav/PrivateNav";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterPiglet from "./formpiglet";

function Piglet() {
  const TitlePage = "Animales";
  const [pigletData, setPigletData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesPiglet = [
    "ID",
    "Nombre",
    "Peso Acumulado",
    "Nacimiento",
    "Peso Inicial",
    "Sexo",
    "Raza",
    "Etapa"
  ];

  async function fetchPiglets() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/Piglet/ConsultAllPiglets");

      if (response.status === 200) {
        const data = response.data.map((piglet) => ({
          id: piglet.id_Piglet,
          nombre: piglet.name_Piglet,
          pesoAcumulado: piglet.acum_Weight ?? "Sin dato",
          nacimiento: piglet.fec_Birth ? new Date(piglet.fec_Birth).toLocaleDateString() : "Sin fecha",
          pesoInicial: piglet.weight_Initial ?? "Sin dato",
          sexo: piglet.sex_Piglet ?? "Sin dato",
          raza: piglet.nam_Race || "Sin raza",
          etapa: piglet.name_Stage || "Sin etapa",
        }));
        setPigletData(data);
        console.log(data)
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de los lechones.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPiglets();
  }, []);

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10);
      await axiosInstance.delete(`/api/Piglet/DeletePiglet?id_Piglet=${numericId}`);
      fetchPiglets();
    } catch (error) {
      console.error("Error detallado al eliminar:", error);
    }
  };

  return (
    <PrivateNav>
      {/* Pantalla de carga */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="flex flex-col items-center">
            <img src="/assets/img/pesopig.png" alt="Cargando..." className="w-20 h-20 animate-spin" />
            <p className="text-lg text-gray-700 font-semibold mt-2">Cargando...</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {!isLoading && (
        <ContentPage
          TitlePage={TitlePage}
          Data={pigletData}
          TitlesTable={titlesPiglet}
          FormPage={() => <RegisterPiglet refreshData={fetchPiglets} />}
          onDelete={handleDelete}
          endpoint="/api/Piglet/DeletePiglet"
        />
      )}

      {error && <div className="text-red-600">{error}</div>}
    </PrivateNav>
  );
}

export default Piglet;

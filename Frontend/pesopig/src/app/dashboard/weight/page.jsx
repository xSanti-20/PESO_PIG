"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/nav/PrivateNav";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterWeighing from "./formweight";

function Weighing() {
  const TitlePage = "Pesajes";
  const [weighingData, setWeighingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesWeighing = [
    "ID",
    "Peso Actual",
    "Ganancia de Peso",
    "Fecha de Pesaje",
    "Nombre del Animal",
    "Registrado por"
  ];

  async function fetchWeighings() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/Weighing/ConsultAllWeighings");

      if (response.status === 200) {
        const data = response.data.map((weighing) => ({
          id: weighing.id_Weighing,
          pesoActual: weighing.weight_Current ?? "Sin dato",
          gananciaPeso: weighing.weight_Gain ?? "Sin dato",
          fechaPesaje: weighing.fec_Weight ? new Date(weighing.fec_Weight).toLocaleDateString() : "Sin fecha",
          nombreAnimal: weighing.name_Piglet || "Sin nombre",
          registradoPor: weighing.nom_Users || "Desconocido",
        }));
        setWeighingData(data);
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de pesaje.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWeighings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10);
      await axiosInstance.delete(`/api/Weighing/DeleteWeighing?id_Weighings=${numericId}`);
      fetchWeighings();
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
          Data={weighingData}
          TitlesTable={titlesWeighing}
          FormPage={() => <RegisterWeighing refreshData={fetchWeighings} />}
          onDelete={handleDelete}
          endpoint="/api/Weighing/DeleteWeighing"
        />
      )}

      {error && <div className="text-red-600">{error}</div>}
    </PrivateNav>
  );
}

export default Weighing;

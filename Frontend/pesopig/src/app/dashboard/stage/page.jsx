"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/nav/PrivateNav";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterStage from "./formstage";

function Stage() {
  const TitlePage = "Etapa";
  const [stageData, setstageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesStage = [
    "ID",
    "Nombre",
    "Peso Desde",
    "Peso Hasta",
    "Total Semanas"
    
  ];

  async function fetchStage() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/Stage/ConsultAllStages");

      if (response.status === 200) {
        const data = response.data.map((stage) => ({
          id: stage.id_Stage,
          name_Stage: stage.name_Stage,
          weight_From: stage.weight_From,
          weight_Upto: stage.weight_Upto,
          tot_Weeks: stage.tot_Weeks,
        }));
        setstageData(data);
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de la Etapa .");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStage();
  }, []);
 
  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10);
      await axiosInstance.delete(`/api/Stage/DeleteStage?id_Stage=${numericId}`);
      fetchStage();
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
          Data={stageData}
          TitlesTable={titlesStage}
          FormPage={() => <RegisterStage refreshData={fetchStage} />}
          onDelete={handleDelete}
          endpoint="/api/Stage/DeleteStage"
        />
      )}

      {error && <div className="text-red-600">{error}</div>}
    </PrivateNav>
  );
}

export default Stage;
"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/nav/PrivateNav";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterRace from "./formrace";

function Race() {
  const TitlePage = "Raza";
  const [raceData, setRaceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesRace = [
    "ID",
    "Nombre",
  ];

  async function fetchRace() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/Race/ConsultAllRaces");

      if (response.status === 200) {
        const data = response.data.map((race) => ({
          id: race.id_Race,
          nam_Race: race.nam_Race, // Corregido aquí
        }));
        setRaceData(data);
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de la Raza.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRace();
  }, []);
 
  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10);
      await axiosInstance.delete(`/api/Race/DeleteRace?id_Race=${numericId}`);
      fetchRace();
    } catch (error) {
      console.error("Error detallado al eliminar:", error);
    }
  };

  return (
    <PrivateNav>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="flex flex-col items-center">
            <img src="/assets/img/pesopig.png" alt="Cargando..." className="w-20 h-20 animate-spin" />
            <p className="text-lg text-gray-700 font-semibold mt-2">Cargando...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <ContentPage
          TitlePage={TitlePage}
          Data={raceData}
          TitlesTable={titlesRace}
          FormPage={() => <RegisterRace refreshData={fetchRace} />}
          onDelete={handleDelete}
          endpoint="/api/Race/DeleteRace"
        />
      )}

      {error && <div className="text-red-600">{error}</div>}
    </PrivateNav>
  );
}

export default Race;

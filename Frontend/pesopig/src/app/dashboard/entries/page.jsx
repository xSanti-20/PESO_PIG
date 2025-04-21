"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/nav/PrivateNav";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterEntryPage from "./formentries"; // ✅ asegúrate que este archivo existe

function Entries() {
  const TitlePage = "Entradas de Alimento";
  const [entryData, setEntryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesEntry = [
    "ID",
    "Valor Entrada",
    "Fecha Entrada",
    "Fecha Expiración",
    "Cantidad",
    "Nombre Alimento"
  ];

  async function fetchEntries() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/Entries/ConsultAllEntries");

      if (response.status === 200) {
        const data = response.data.map((entry) => ({
          id: entry.id_Entries,
          valor: entry.vlr_Entries,
          fechaEntrada: entry.fec_Entries ? new Date(entry.fec_Entries).toLocaleDateString() : "Sin fecha",
          fechaVencimiento: entry.fec_Expiration ? new Date(entry.fec_Expiration).toLocaleDateString() : "Sin fecha",
          cantidad: entry.can_Food ?? "Sin dato",
          nombreAlimento: entry.nam_Food || "Sin alimento"
        }));
        setEntryData(data);
      }
    } catch (error) {
      setError("No se pudieron cargar las entradas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10);
      await axiosInstance.delete(`/api/Entries/DeleteEntries?id_Entries=${numericId}`);
      fetchEntries();
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
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
          Data={entryData}
          TitlesTable={titlesEntry}
          FormPage={() => <RegisterEntryPage refreshData={fetchEntries} />}
          onDelete={handleDelete}
          endpoint="/api/Entries/DeleteEntries"
        />
      )}

      {error && <div className="text-red-600">{error}</div>}
    </PrivateNav>
  );
}

export default Entries;

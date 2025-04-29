"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/nav/PrivateNav";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterFeeding from "./formfeeding";

function Feeding() {
  const TitlePage = "Alimentación";
  const [feedingData, setFeedingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFeeding, setEditingFeeding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const titlesFeeding = [
    "ID",
    "Observación",
    "Cantidad del alimento ",
    "Alimento Suministrado",
    "Usuario",
    "Lechón",
    "Alimento",
    "Fecha de la alimentacion"
  ];

  async function fetchFeedings() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/Feeding/ConsultAllFeedings");

      if (response.status === 200) {
        const data = response.data.map((feeding) => ({
          id: feeding.id_Feeding,
          observacion: feeding.obc_Feeding ?? "Sin observación",
          cantidaddelalimento: feeding.can_Food ?? 0,
          alimentoSuministrado: feeding.sum_Food ?? "No especificado",
          usuario: feeding.nom_Users ?? "Sin usuario",
          lechon: feeding.name_Piglet ?? "Sin lechón",
          alimento: feeding.nam_Food ?? "Sin alimento",
          fechadelaalimentacion: feeding.dat_Feeding ? new Date(feeding.dat_Feeding).toLocaleDateString() : "Sin fecha",
          original: feeding,
        
        }));

        setFeedingData(data);
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de Alimentación.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10);
      await axiosInstance.delete(`/api/Feeding/DeleteFeeding?id_Feeding=${numericId}`);
      fetchFeedings();
    } catch (error) {
      console.error("Error detallado al eliminar:", error);
    }
  };

  const handleUpdate = (row) => {
    setEditingFeeding(row.original);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingFeeding(null);
    }, 300);
  };

  return (
    <PrivateNav>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="flex flex-col items-center">
            <img
              src="/assets/img/pesopig.png"
              alt="Cargando..."
              className="w-20 h-20 animate-spin"
            />
            <p className="text-lg text-gray-700 font-semibold mt-2">Cargando...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <ContentPage
          TitlePage={TitlePage}
          Data={feedingData}
          TitlesTable={titlesFeeding}
          FormPage={() => (
            <RegisterFeeding
              refreshData={fetchFeedings}
              feedingToEdit={editingFeeding}
              onCancelEdit={handleCloseModal}
              closeModal={handleCloseModal}
            />
          )}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          endpoint="/Api/Feeding/DeleteFeeding"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refreshData={fetchFeedings}
        />
      )}

      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
    </PrivateNav>
  );
}

export default Feeding;

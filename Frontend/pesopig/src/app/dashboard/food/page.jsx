"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/nav/PrivateNav";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterFood from "./formfood";

function Food() {
  const TitlePage = "Alimento";
  const [foodData, setFoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesFood = [
    "ID",
    "Nombre",
    "Descripcion",
    "Existencia",
    "Valor Unitario",
    "Fecha Expiracion",
    "Unidad Existente",
    "Etapa",
  ];

  async function fetchFoods() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Food/ConsultAllFoods");

      if (response.status === 200) {
        const data = response.data.map((food) => ({
          id: food.id_Food,
          nombre: food.nam_Food,
          descripcion: food.des_Food ?? "Sin descripción",
          existencia: food.existence ?? 0,
          valorUnitario: food.vlr_Unit ?? 0,
          fechaExpiracion: food.fec_Expiration
            ? new Date(food.fec_Expiration).toLocaleDateString("es-ES")
            : "Sin fecha",
          unidadExistente: food.und_Extent ?? "Sin unidad",
          etapa: food.name_Stage || "Sin etapa",
        }));

        setFoodData(data);
      }
    } catch (error) {
      setError("No se pudieron cargar los datos del Alimento.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10);
      await axiosInstance.delete(`/Api/Food/DeleteFood?id_Food=${numericId}`);
      fetchFoods();
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
          Data={foodData}
          TitlesTable={titlesFood}
          FormPage={() => <RegisterFood refreshData={fetchFoods} />}
          onDelete={handleDelete}
          endpoint="/Api/Food/DeleteFood"
        />
      )}

      {error && <div className="text-red-600">{error}</div>}
    </PrivateNav>
  );
}

export default Food;

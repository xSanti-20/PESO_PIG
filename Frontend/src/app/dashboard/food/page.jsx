"use client"

import { useState, useEffect } from "react"
import PrivateNav from "@/components/nav/PrivateNav"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import RegisterFood from "./formfood"
import AlertModal from "@/components/AlertModal"

function Food() {
  const TitlePage = "Alimento"
  const [foodData, setFoodData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingFood, setEditingFood] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    message: "",
    type: "success",
    redirectUrl: null,
  })

  const titlesFood = [
    "ID",
    "Nombre",
    "Unidad de Medida",
    "Valor Unitario",
    "Etapa",
    "Racion del alimento",
    "Existencia",
  ]

  const closeAlert = () => {
    setAlertInfo({
      ...alertInfo,
      isOpen: false,
    })
  }

  async function fetchFoods() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Food/ConsultAllFoods")

      if (response.status === 200) {
        const data = response.data.map((food) => ({
          id: food.id_Food,
          nombre: food.nam_Food,
          unidadExistente: food.und_Extent ?? "Sin unidad",
          valorUnitario: food.vlr_Unit ?? 0,
          etapa: food.name_Stage || "Sin etapa",
          racion: food.rat_Food ?? 0,
          existencia: food.existence ?? 0,
          original: food,
        }))

        setFoodData(data)
      }
    } catch (error) {
      setError("No se pudieron cargar los datos del Alimento.")
      setAlertInfo({
        isOpen: true,
        message: "No se pudieron cargar los datos del Alimento.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10)
      await axiosInstance.delete(`/api/Food/DeleteFood?id_Food=${numericId}`)
      fetchFoods()
      setAlertInfo({
        isOpen: true,
        message: "Alimento eliminado correctamente",
        type: "success",
      })
    } catch (error) {
      console.error("Error detallado al eliminar:", error)
      setAlertInfo({
        isOpen: true,
        message: "Error al eliminar el alimento",
        type: "error",
      })
    }
  }

  const handleUpdate = (row) => {
    setEditingFood(row.original)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setEditingFood(null)
    }, 300)
  }

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
          FormPage={() => (
            <RegisterFood
              refreshData={fetchFoods}
              foodToEdit={editingFood}
              onCancelEdit={handleCloseModal}
              closeModal={handleCloseModal}
              showAlert={(message, type, redirectUrl = null) => {
                setAlertInfo({
                  isOpen: true,
                  message,
                  type,
                  redirectUrl,
                })
              }}
            />
          )}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          endpoint="/Api/Food/DeleteFood"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refreshData={fetchFoods}
        />
      )}

      {error && <div className="text-red-600 text-center mt-4">{error}</div>}

      {/* Alerta personalizada */}
      <AlertModal
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        type={alertInfo.type}
        onClose={closeAlert}
        redirectUrl={alertInfo.redirectUrl}
      />
    </PrivateNav>
  )
}

export default Food

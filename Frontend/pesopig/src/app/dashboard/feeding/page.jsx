"use client"

import { useState, useEffect } from "react"
import PrivateNav from "@/components/nav/PrivateNav"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import RegisterFeeding from "./formfeeding"
import AlertModal from "@/components/AlertModal"
import { getStageByWeight } from "@/components/utils/FeedingPlan"

function Feeding() {
  const TitlePage = "Alimentación"
  const [feedingData, setFeedingData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingFeeding, setEditingFeeding] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    message: "",
    type: "success",
    redirectUrl: null,
  })

  const titlesFeeding = [
    "ID",
    "Corral",
    "Etapa",
    "Consumo por Animal (KG)",
    "Cantidad Total (KG)",
    "Alimento",
    "Usuario",
    "Fecha",
    "Observación",
  ]

  const closeAlert = () => {
    setAlertInfo({
      ...alertInfo,
      isOpen: false,
    })
  }

  async function fetchFeedings() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/Feeding/ConsultAllFeedings")

      if (response.status === 200) {
        const data = response.data.map((feeding) => {
          // Calcular etapa basada en el peso promedio del corral
          const stage = feeding.averageWeight ? getStageByWeight(feeding.averageWeight) : "N/A"

          return {
            id: feeding.id_Feeding,
            corral: feeding.des_Corral ?? "Sin corral",
            etapa: stage || "N/A",
            cantidadTotal: `${feeding.can_Food ?? 0} KG`,
            consumoPorAnimal: `${feeding.sum_Food ?? 0} KG`,
            alimento: feeding.nam_Food ?? "Sin alimento",
            usuario: feeding.nom_Users ?? "Sin usuario",
            fecha: feeding.dat_Feeding ? new Date(feeding.dat_Feeding).toLocaleDateString() : "Sin fecha",
            observacion: feeding.obc_Feeding ?? "Sin observación",
            original: feeding,
          }
        })

        setFeedingData(data)
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de Alimentación.")
      setAlertInfo({
        isOpen: true,
        message: "No se pudieron cargar los datos de Alimentación.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedings()
  }, [])

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10)
      const response = await axiosInstance.delete(`/api/Feeding/DeleteFeeding?id_Feeding=${numericId}`)

      fetchFeedings()
      setAlertInfo({
        isOpen: true,
        message: "Alimentación eliminada correctamente. El inventario ha sido restaurado.",
        type: "success",
      })
    } catch (error) {
      console.error("Error detallado al eliminar:", error)
      setAlertInfo({
        isOpen: true,
        message: "Error al eliminar la alimentación",
        type: "error",
      })
    }
  }

  const handleUpdate = (row) => {
    setEditingFeeding(row.original)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setEditingFeeding(null)
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
        <>
          {/* Información del plan de alimentación */}
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Plan de Alimentación SENA</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded">
                <strong>Precebos:</strong> 6.5 - 30 kg
                <br />
                <span className="text-gray-600">Duración: 49 días</span>
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Levante:</strong> 30 - 60 kg
                <br />
                <span className="text-gray-600">Duración: 42 días</span>
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Engorde:</strong> 60 - 100 kg
                <br />
                <span className="text-gray-600">Duración: 47 días</span>
              </div>
            </div>
          </div>

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
            endpoint="/Api/Feeding/DeleteFeeding"
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            refreshData={fetchFeedings}
          />
        </>
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

export default Feeding

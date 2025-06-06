"use client"

import { useState, useEffect } from "react"
import PrivateNav from "@/components/nav/PrivateNav"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import RegisterWeighing from "./formweight"
import AlertModal from "@/components/AlertModal"

function Weighing() {
  const TitlePage = "Pesajes"
  const [weighingData, setWeighingData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWeighing, setEditingWeighing] = useState(null)
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    message: "",
    type: "success",
    redirectUrl: null,
  })

  const titlesWeighing = [
    "ID",
    "Peso Actual",
    "Ganancia de Peso",
    "Fecha de Pesaje",
    "Nombre del Animal",
    "Registrado por",
  ]

  const closeAlert = () => {
    setAlertInfo({
      ...alertInfo,
      isOpen: false,
    })
  }

  async function fetchWeighings() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/Weighing/ConsultAllWeighings")

      if (response.status === 200) {
        const data = response.data.map((weighing) => ({
          id: weighing.id_Weighing,
          pesoActual: weighing.weight_Current ?? "Sin dato",
          gananciaPeso: weighing.weight_Gain ?? "Sin dato",
          fechaPesaje: weighing.fec_Weight ? new Date(weighing.fec_Weight).toLocaleDateString() : "Sin fecha",
          nombreAnimal: weighing.name_Piglet || "Sin nombre",
          registradoPor: weighing.nom_Users || "Desconocido",
          // Guardar datos originales para posibles acciones adicionales
          original: weighing,
        }))
        setWeighingData(data)
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de pesaje.")
      setAlertInfo({
        isOpen: true,
        message: "No se pudieron cargar los datos de pesaje.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeighings()
  }, [])

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10)
      await axiosInstance.delete(`/api/Weighing/DeleteWeighing?id_Weighings=${numericId}`)
      fetchWeighings()
      setAlertInfo({
        isOpen: true,
        message: "Pesaje eliminado correctamente",
        type: "success",
      })
    } catch (error) {
      console.error("Error detallado al eliminar:", error)
      setAlertInfo({
        isOpen: true,
        message: "Error al eliminar el pesaje",
        type: "error",
      })
    }
  }

  // Función para manejar la edición de pesajes
  const handleUpdate = async (row) => {
    try {
      // Obtener los datos completos del pesaje para asegurar que tenemos toda la información
      const weighingId = row.original.id_Weighing
      const response = await axiosInstance.get(`/api/Weighing/GetWeighingId?id_Weighings=${weighingId}`)

      if (response.status === 200) {
        const weighingData = response.data
        console.log("Pesaje a editar (datos completos):", weighingData)
        setEditingWeighing(weighingData)
        setIsModalOpen(true)
      } else {
        // Si no podemos obtener los datos completos, usamos los que ya tenemos
        console.log("Usando datos parciales para editar:", row.original)
        setEditingWeighing(row.original)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Error al obtener datos completos del pesaje:", error)
      // En caso de error, intentamos con los datos que ya tenemos
      setEditingWeighing(row.original)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Limpiar el pesaje en edición después de un breve retraso
    // para evitar que el formulario cambie antes de que el modal se cierre
    setTimeout(() => {
      setEditingWeighing(null)
    }, 300)
  }

  // Función para recalcular el peso acumulado de un lechón
  const recalculatePigletWeight = async (row) => {
    try {
      if (!row || !row.original || !row.original.id_Piglet) {
        setAlertInfo({
          isOpen: true,
          message: "No se puede recalcular el peso para este registro.",
          type: "error",
        })
        return
      }

      const pigletId = row.original.id_Piglet

      // Obtener los datos del lechón para conocer su peso inicial
      const pigletResponse = await axiosInstance.get(`/api/Piglet/GetPigletId?id_Piglet=${pigletId}`)
      const piglet = pigletResponse.data

      if (!piglet) {
        setAlertInfo({
          isOpen: true,
          message: "No se encontró el lechón asociado a este pesaje.",
          type: "error",
        })
        return
      }

      // Llamar al endpoint para recalcular el peso
      await axiosInstance.post(
        `/api/Weighing/RecalculatePigletWeight?id_Piglet=${pigletId}&newInitialWeight=${piglet.weight_Initial}`,
      )

      setAlertInfo({
        isOpen: true,
        message: "Peso del lechón recalculado correctamente.",
        type: "success",
      })
      fetchWeighings()
    } catch (error) {
      console.error("Error al recalcular el peso:", error)
      setAlertInfo({
        isOpen: true,
        message: "Ocurrió un error al recalcular el peso del lechón.",
        type: "error",
      })
    }
  }

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
          FormPage={() => (
            <RegisterWeighing
              refreshData={fetchWeighings}
              weighingToEdit={editingWeighing}
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
          endpoint="/api/Weighing/DeleteWeighing"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refreshData={fetchWeighings}
          extraActions={[
            {
              label: "Recalcular Peso",
              onClick: recalculatePigletWeight,
              icon: "calculator",
            },
          ]}
        />
      )}

      {error && <div className="text-red-600">{error}</div>}

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

export default Weighing

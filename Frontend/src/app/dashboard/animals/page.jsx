"use client"

import { useState, useEffect } from "react"
import PrivateNav from "@/components/nav/PrivateNav"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import RegisterPiglet from "./formpiglet"
import AlertModal from "@/components/AlertModal"
import DeleteRecord from "@/components/utils/Delete"

function Piglet() {
  const TitlePage = "Animales"
  const [pigletData, setPigletData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingPiglet, setEditingPiglet] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    message: "",
    type: "success",
    redirectUrl: null,
  })

  const titlesPiglet = [
    "ID",
    "Nombre",
    "Peso Acumulado",
    "Nacimiento",
    "Peso Inicial",
    "Sexo",
    "Corral",
    "Raza",
    "Etapa",
    "Placa Sena",
  ]

  const closeAlert = () => {
    setAlertInfo({
      ...alertInfo,
      isOpen: false,
    })
  }

  async function fetchPiglets() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/Piglet/ConsultAllPiglets")

      if (response.status === 200) {
        const data = response.data.map((piglet) => ({
          id: piglet.id_Piglet,
          nombre: piglet.name_Piglet,
          pesoAcumulado: piglet.acum_Weight ?? "Sin dato",
          nacimiento: piglet.fec_Birth ? new Date(piglet.fec_Birth).toLocaleDateString() : "Sin fecha",
          pesoInicial: piglet.weight_Initial ?? "Sin dato",
          sexo: piglet.sex_Piglet ?? "Sin dato",
          corral: piglet.des_Corral || "Sin corral",
          raza: piglet.nam_Race || "Sin raza",
          etapa: piglet.name_Stage || "Sin etapa",
          placasena: piglet.placa_Sena ?? "Sin dato",
          // Guardamos los datos originales para edición
          original: piglet,
        }))
        setPigletData(data)
        console.log("Datos cargados:", data)
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de los lechones.")
      setAlertInfo({
        isOpen: true,
        message: "No se pudieron cargar los datos de los lechones.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPiglets()
  }, [])

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10)
      await axiosInstance.delete(`/api/Piglet/DeletePiglet?id_Piglet=${numericId}`)
      fetchPiglets()
      setAlertInfo({
        isOpen: true,
        message: "Lechón eliminado correctamente",
        type: "success",
      })
    } catch (error) {
      console.error("Error detallado al eliminar:", error)
      setAlertInfo({
        isOpen: true,
        message: "Error al eliminar el lechón",
        type: "error",
      })
    }
  }

  const handleUpdate = async (row) => {
    try {
      // Obtener los datos completos del lechón para asegurar que tenemos toda la información
      const pigletId = row.original.id_Piglet
      const response = await axiosInstance.get(`/api/Piglet/GetPigletId?id_Piglet=${pigletId}`)

      if (response.status === 200) {
        const pigletData = response.data
        console.log("Lechón a editar (datos completos):", pigletData)
        setEditingPiglet(pigletData)
        setIsModalOpen(true)
      } else {
        // Si no podemos obtener los datos completos, usamos los que ya tenemos
        console.log("Usando datos parciales para editar:", row.original)
        setEditingPiglet(row.original)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Error al obtener datos completos del lechón:", error)
      // En caso de error, intentamos con los datos que ya tenemos
      setEditingPiglet(row.original)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Limpiar el lechón en edición después de un breve retraso
    // para evitar que el formulario cambie antes de que el modal se cierre
    setTimeout(() => {
      setEditingPiglet(null)
    }, 300)
  }

  // Función para recalcular el peso acumulado de un lechón
  const recalculatePigletWeight = async (row) => {
    try {
      if (!row || !row.original || !row.original.id_Piglet) {
        setAlertInfo({
          isOpen: true,
          message: "No se puede recalcular el peso para este lechón.",
          type: "error",
        })
        return
      }

      const pigletId = row.original.id_Piglet
      const initialWeight = row.original.weight_Initial

      // Llamar al endpoint para recalcular el peso
      await axiosInstance.post(
        `/api/Weighing/RecalculatePigletWeight?id_Piglet=${pigletId}&newInitialWeight=${initialWeight}`,
      )

      setAlertInfo({
        isOpen: true,
        message: "Peso del lechón recalculado correctamente.",
        type: "success",
      })
      fetchPiglets()
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
          Data={pigletData}
          TitlesTable={titlesPiglet}
          FormPage={() => (
            <RegisterPiglet
              refreshData={fetchPiglets}
              pigletToEdit={editingPiglet}
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
          endpoint="/api/Piglet/DeletePiglet"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refreshData={fetchPiglets}
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

export default Piglet

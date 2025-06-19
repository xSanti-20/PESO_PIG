"use client"

import { useState, useEffect } from "react"
import PrivateNav from "@/components/nav/PrivateNav"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import RegisterPiglet from "./formpiglet"
import StageControlPanel from "@/components/StageControlPanel"
import AlertModal from "@/components/AlertModal"
import ExportAllPigletsButton from "@/components/ExportAllPigletsButton" // ✅ Usar la versión corregida
import { FaExchangeAlt, FaCheckCircle } from "react-icons/fa"

function Piglet() {
  const TitlePage = "Animales"
  const [pigletData, setPigletData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingPiglet, setEditingPiglet] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showStagePanel, setShowStagePanel] = useState(false)
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
    "Días en Etapa",
    "Placa Sena",
  ]

  // ✅ Función para mostrar alertas
  const showAlert = (type, message, onSuccessCallback = null) => {
    setAlertInfo({
      isOpen: true,
      message,
      type,
      onSuccessCallback,
    })
  }

  const closeAlert = () => {
    const callback = alertInfo.onSuccessCallback
    setAlertInfo({
      isOpen: false,
      message: "",
      type: "success",
      onSuccessCallback: null,
    })
    if (callback) callback()
  }

  async function fetchPiglets() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/Piglet/ConsultAllPiglets")

      if (response.status === 200) {
        const data = response.data.map((piglet) => {
          const daysInStage = piglet.sta_Date
            ? Math.floor((new Date() - new Date(piglet.sta_Date)) / (1000 * 60 * 60 * 24))
            : 0

          const formattedWeightInitial =
            typeof piglet.weight_Initial === "number" ? piglet.weight_Initial.toFixed(1) : "Sin dato"

          const formattedAcumWeight =
            typeof piglet.acum_Weight === "number" ? piglet.acum_Weight.toFixed(1) : "Sin dato"

          return {
            id: piglet.id_Piglet,
            nombre: piglet.name_Piglet,
            pesoAcumulado: formattedAcumWeight,
            nacimiento: piglet.fec_Birth ? new Date(piglet.fec_Birth).toLocaleDateString() : "Sin fecha",
            pesoInicial: formattedWeightInitial,
            sexo: piglet.sex_Piglet ?? "Sin dato",
            corral: piglet.des_Corral || "Sin corral",
            raza: piglet.nam_Race || "Sin raza",
            etapa: piglet.name_Stage || "Sin etapa",
            diasEnEtapa: daysInStage > 0 ? `${daysInStage} días` : "Sin fecha",
            placasena: piglet.placa_Sena ?? "Sin dato",
            original: piglet, // ✅ Datos originales para PDF
          }
        })
        setPigletData(data)
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de los lechones.")
      showAlert("error", "No se pudieron cargar los datos de los lechones.")
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
      showAlert("success", "Lechón eliminado correctamente")
    } catch (error) {
      console.error("Error detallado al eliminar:", error)
      showAlert("error", "Error al eliminar el lechón")
    }
  }

  const handleUpdate = async (row) => {
    try {
      const pigletId = row.original.id_Piglet
      const response = await axiosInstance.get(`/api/Piglet/GetPigletId?id_Piglet=${pigletId}`)

      if (response.status === 200) {
        setEditingPiglet(response.data)
        setIsModalOpen(true)
      } else {
        setEditingPiglet(row.original)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Error al obtener datos completos del lechón:", error)
      setEditingPiglet(row.original)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setEditingPiglet(null)
    }, 300)
  }

  const recalculatePigletWeight = async (row) => {
    try {
      if (!row?.original?.id_Piglet) {
        showAlert("error", "No se puede recalcular el peso para este lechón.")
        return
      }

      const pigletId = row.original.id_Piglet
      const initialWeight = row.original.weight_Initial

      await axiosInstance.post(
        `/api/Weighing/RecalculatePigletWeight?id_Piglet=${pigletId}&newInitialWeight=${initialWeight}`,
      )

      showAlert(
        "success",
        "Peso del lechón recalculado correctamente. Se han actualizado todos los pesajes y verificado la etapa.",
      )
      fetchPiglets()
    } catch (error) {
      console.error("Error al recalcular el peso:", error)
      showAlert("error", "Ocurrió un error al recalcular el peso del lechón.")
    }
  }

  const checkPigletStage = async (row) => {
    try {
      if (!row?.original?.id_Piglet) {
        showAlert("error", "No se puede verificar la etapa para este lechón.")
        return
      }

      const pigletId = row.original.id_Piglet
      const response = await axiosInstance.post(`/api/Piglet/CheckStage/${pigletId}`)

      if (response.data.success) {
        if (response.data.stageChanged) {
          showAlert(
            "success",
            `${response.data.pigletName} cambió a etapa ${response.data.newStage}. Razón: ${response.data.transitionReason}`,
          )
          fetchPiglets()
        } else {
          showAlert("info", `${response.data.pigletName}: ${response.data.message}`)
        }
      } else {
        showAlert("error", response.data.message || "Error al verificar la etapa")
      }
    } catch (error) {
      console.error("Error al verificar etapa:", error)
      showAlert("error", "Error al verificar la etapa del lechón.")
    }
  }

  const checkAllStages = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.post("/api/Piglet/CheckAllStages")

      if (response.data) {
        const { totalProcessed, stageChanges, weightDeficient, errors } = response.data

        let message = `Verificación completada: ${totalProcessed} lechones procesados.`
        if (stageChanges > 0) {
          message += ` ${stageChanges} cambios de etapa realizados.`
        }
        if (weightDeficient > 0) {
          message += ` ${weightDeficient} lechones con peso deficiente.`
        }
        if (errors > 0) {
          message += ` ${errors} errores encontrados.`
        }

        showAlert(stageChanges > 0 ? "success" : "info", message)

        if (stageChanges > 0) {
          fetchPiglets()
        }
      }
    } catch (error) {
      console.error("Error al verificar todas las etapas:", error)
      showAlert("error", "Error al verificar las etapas de todos los lechones.")
    } finally {
      setIsLoading(false)
    }
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
          <div className="mb-4 flex gap-4 flex-wrap">
            <button
              onClick={() => setShowStagePanel(!showStagePanel)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaExchangeAlt />
              <span>{showStagePanel ? "Ocultar" : "Mostrar"} Control de Etapas</span>
            </button>

            <button
              onClick={checkAllStages}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaCheckCircle />
              <span>Verificar Todas las Etapas</span>
            </button>

            {/* ✅ Botón corregido para exportar todos los lechones */}
            <ExportAllPigletsButton pigletsData={pigletData.map((p) => p.original)} showAlert={showAlert} />
          </div>

          {showStagePanel && (
            <div className="mb-6">
              <StageControlPanel showAlert={showAlert} onStageChange={fetchPiglets} />
            </div>
          )}

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
                showAlert={showAlert}
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
                tooltip: "Recalcula el peso acumulado y verifica la etapa",
              },
              {
                label: "Verificar Etapa",
                onClick: checkPigletStage,
                icon: "exchange-alt",
                tooltip: "Verifica si debe cambiar de etapa",
              },
            ]}
          />
        </>
      )}

      {error && <div className="text-red-600">{error}</div>}

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

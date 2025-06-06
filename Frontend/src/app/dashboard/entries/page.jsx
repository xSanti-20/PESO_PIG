"use client"

import { useState, useEffect } from "react"
import PrivateNav from "@/components/nav/PrivateNav"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import RegisterEntryPage from "./formentries"
import AlertModal from "@/components/AlertModal"

function Entries() {
  const TitlePage = "Entradas de Alimento"
  const [entryData, setEntryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    isOpen: false,
    message: "",
    type: "success",
    redirectUrl: null,
  })

  const titlesEntry = [
    "ID",
    "Valor Unitario",
    "Fecha Entrada",
    "Fecha Expiración",
    "Cantidad",
    "Nombre Alimento",
    "Valor Total",
  ]

  const closeAlert = () => {
    setAlertInfo({
      ...alertInfo,
      isOpen: false,
    })
  }

  async function fetchEntries() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/api/Entries/ConsultAllEntries")

      if (response.status === 200) {
        const data = response.data.map((entry) => ({
          id: entry.id_Entries,
          valorUnitario: entry.vlr_Unitary,
          fechaEntrada: entry.fec_Entries ? new Date(entry.fec_Entries).toLocaleDateString() : "Sin fecha",
          fechaVencimiento: entry.fec_Expiration ? new Date(entry.fec_Expiration).toLocaleDateString() : "Sin fecha",
          cantidad: entry.can_Food ?? "Sin dato",
          nombreAlimento: entry.nam_Food || "Sin alimento",
          valorTotal: entry.vlr_Total || "Sin Valor",
          original: entry,
        }))
        setEntryData(data)
      }
    } catch (error) {
      setError("No se pudieron cargar las entradas.")
      setAlertInfo({
        isOpen: true,
        message: "No se pudieron cargar las entradas.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10)
      await axiosInstance.delete(`/api/Entries/DeleteEntries?id_Entries=${numericId}`)
      fetchEntries()
      setAlertInfo({
        isOpen: true,
        message: "Entrada eliminada correctamente",
        type: "success",
      })
    } catch (error) {
      console.error("Error al eliminar entrada:", error)
      setAlertInfo({
        isOpen: true,
        message: "Error al eliminar la entrada",
        type: "error",
      })
    }
  }

  const handleUpdate = (row) => {
    setEditingEntry(row.original)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setEditingEntry(null)
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
          Data={entryData}
          TitlesTable={titlesEntry}
          FormPage={() => (
            <RegisterEntryPage
              refreshData={fetchEntries}
              entryToEdit={editingEntry}
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
          endpoint="/api/Entries/DeleteEntries"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refreshData={fetchEntries}
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

export default Entries

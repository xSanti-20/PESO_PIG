"use client"
import { useState, useEffect } from "react"
import styles from "./page.module.css"
import axiosInstance from "@/lib/axiosInstance"
import { FaWarehouse, FaIdCard } from "react-icons/fa"
import { Button } from "@/components/ui/button"

// Función para enviar datos al backend
async function SendData(body, isEditing = false) {
  if (isEditing) {
    const response = await axiosInstance.put("/api/Corral/UpdateCorral", body)
    return response
  } else {
    const response = await axiosInstance.post("/api/Corral/CreateCorral", body)
    return response
  }
}

function RegisterCorralPage({ refreshData, corralToEdit, onCancelEdit, closeModal }) {
  const [formData, setFormData] = useState({
    Des_Corral: "",
    Tot_Animales: "",
  })

  const [loading, setLoading] = useState(false)
  const isEditing = !!corralToEdit

  useEffect(() => {
    if (isEditing) {
      setFormData({
        Des_Corral: corralToEdit.des_Corral || "",
        Tot_Animales: corralToEdit.tot_Animal?.toString() || "",
      })
    } else {
      setFormData({
        Des_Corral: "",
        Tot_Animales: "",
      })
    }
  }, [corralToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handlerSubmit(event) {
    event.preventDefault()
    const Des_Corral = formData.Des_Corral.trim()
    const Tot_Animales = formData.Tot_Animales.trim()

    if (!Des_Corral || !Tot_Animales) {
      alert("Todos los campos son requeridos.")
      return
    }

    const body = {
      Des_Corral,
      Tot_Animal: Number.parseInt(Tot_Animales, 10),
      Tot_Pesaje: 0, // Inicializar en 0
      // No incluimos Est_Corral ya que se establecerá automáticamente en el backend
    }

    if (isEditing) {
      body.id_Corral = corralToEdit.id_Corral
      body.Est_Corral = corralToEdit.est_Corral // Mantener el estado actual si estamos editando
      body.Tot_Pesaje = corralToEdit.tot_Pesaje // Mantener el pesaje actual
    }

    try {
      setLoading(true)
      const response = await SendData(body, isEditing)
      alert(
        response.data.message ||
        (isEditing ? "Corral actualizado con éxito." : "Corral registrado con éxito. Estado: libre"),
      )

      setFormData({ Des_Corral: "", Tot_Animales: "" })

      if (closeModal) closeModal()
      if (typeof refreshData === "function") refreshData()
    } catch (error) {
      console.error("Error completo:", error)
      const errorMessage = error.response?.data || "Error desconocido"
      alert(`Ocurrió un error al ${isEditing ? "actualizar" : "registrar"} el corral: ` + JSON.stringify(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={`col-md-6 ${styles.form_box} d-flex align-items-center justify-content-center`}>
        <form className={styles.form} onSubmit={handlerSubmit}>
          <h1 className={styles.title}>{isEditing ? "Actualizar Corral" : "Registrar Corral"}</h1>

          <div className={styles.input_box}>
            <input
              type="text"
              id="Des_Corral"
              name="Des_Corral"
              placeholder="Descripción del Corral"
              value={formData.Des_Corral}
              onChange={handleChange}
            />
            <FaWarehouse className={styles.icon} />
          </div>

          <div className={styles.input_box}>
            <input
              type="number"
              id="Tot_Animales"
              name="Tot_Animales"
              placeholder="Total de Animales"
              value={formData.Tot_Animales}
              onChange={handleChange}
            />
            <FaIdCard className={styles.icon} />
          </div>

          <div className={styles.button_box}>
            <Button type="submit" disabled={loading}>
              {loading ? (isEditing ? "Actualizando..." : "Registrando...") : isEditing ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterCorralPage

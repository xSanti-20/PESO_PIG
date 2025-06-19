"use client"
import { useState, useEffect } from "react"
import "./Stage.Module.css"
import axiosInstance from "@/lib/axiosInstance"
import { FaFileAlt, FaRegClock } from "react-icons/fa"
import { LiaMicroscopeSolid } from "react-icons/lia"
import { Button } from "@/components/ui/button"

// Función para enviar datos al backend
async function sendData(body, isEditing = false) {
  if (isEditing) {
    const response = await axiosInstance.put("api/Stage/UpdateStage", body)
    return response
  } else {
    const response = await axiosInstance.post("api/Stage/CreateStage", body)
    return response
  }
}

function StageForm({ refreshData, stageToEdit, onCancelEdit, closeModal, showAlert }) {
  const [formData, setFormData] = useState({
    Name_Stage: "",
    Weight_From: "",
    Weight_Upto: "",
    Dur_Stage: "",
  })

  const [loading, setLoading] = useState(false)
  const isEditing = !!stageToEdit

  useEffect(() => {
    if (isEditing) {
      setFormData({
        Name_Stage: stageToEdit.name_Stage || "",
        Weight_From: stageToEdit.weight_From || "",
        Weight_Upto: stageToEdit.weight_Upto || "",
        Dur_Stage: stageToEdit.dur_Stage || "",
      })
    } else {
      setFormData({
        Name_Stage: "",
        Weight_From: "",
        Weight_Upto: "",
        Dur_Stage: "",
      })
    }
  }, [stageToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const { Name_Stage, Weight_From, Weight_Upto, Dur_Stage } = formData

    if (!Name_Stage || !Weight_From || !Weight_Upto || !Dur_Stage) {
      if (showAlert) {
        showAlert("Todos los campos son requeridos.", "error")
      } else {
        alert("Todos los campos son requeridos.")
      }
      return
    }

    const body = { Name_Stage, Weight_From, Weight_Upto, Dur_Stage }

    if (isEditing) {
      body.Id_Stage = stageToEdit.id_Stage
    }

    try {
      setLoading(true)
      const response = await sendData(body, isEditing)

      const successMessage =
        response.data.message || (isEditing ? "Etapa actualizada con éxito." : "Etapa registrada con éxito.")

      if (showAlert) {
        showAlert(successMessage, "success")
      } else {
        alert(successMessage)
      }

      setFormData({
        Name_Stage: "",
        Weight_From: "",
        Weight_Upto: "",
        Dur_Stage: "",
      })

      if (closeModal) closeModal()
      if (typeof refreshData === "function") refreshData()
    } catch (error) {
      console.error("Error completo:", error)
      const errorMessage = error.response?.data || "Error desconocido"

      if (showAlert) {
        showAlert(
          `Ocurrió un error al ${isEditing ? "actualizar" : "registrar"} la etapa: ` + JSON.stringify(errorMessage),
          "error"
        )
      } else {
        alert(`Ocurrió un error al ${isEditing ? "actualizar" : "registrar"} la etapa: ` + JSON.stringify(errorMessage))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wrapper">
      <div className="form_box">
        <form onSubmit={handleSubmit}>
          <h2 className="title">{isEditing ? "Actualizar Etapa" : "Registrar Etapa"}</h2>

          {/* Nombre Etapa */}
          <div className="input_box">
            <input
              type="text"
              name="Name_Stage"
              placeholder="Nombre Etapa"
              value={formData.Name_Stage}
              onChange={handleChange}
            />
            <FaFileAlt className="icon" />
          </div>

          {/* Peso Desde */}
          <div className="input_box">
            <input
              type="number"
              name="Weight_From"
              placeholder="Peso Desde"
              value={formData.Weight_From}
              onChange={handleChange}
            />
            <LiaMicroscopeSolid className="icon" />
          </div>

          {/* Peso Hasta */}
          <div className="input_box">
            <input
              type="number"
              name="Weight_Upto"
              placeholder="Peso Hasta"
              value={formData.Weight_Upto}
              onChange={handleChange}
            />
            <LiaMicroscopeSolid className="icon" />
          </div>

          {/* Duración de la etapa */}
          <div className="input_box">
            <input
              type="number"
              name="Dur_Stage"
              placeholder="Duración (días)"
              value={formData.Dur_Stage}
              onChange={handleChange}
            />
            <FaRegClock className="icon" />
          </div>

          <Button type="submit" disabled={loading} className="enviar">
            {loading ? (isEditing ? "Actualizando..." : "Registrando...") : isEditing ? "Actualizar" : "Registrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default StageForm

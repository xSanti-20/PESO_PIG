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

  // ✅ Validación mejorada para rangos de peso
  const validateWeightRange = () => {
    const weightFrom = Number.parseFloat(formData.Weight_From)
    const weightUpto = Number.parseFloat(formData.Weight_Upto)

    if (weightFrom >= weightUpto) {
      return "El peso inicial debe ser menor que el peso final"
    }

    if (weightFrom < 0 || weightUpto < 0) {
      return "Los pesos no pueden ser negativos"
    }

    return null
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

    // ✅ Validar rangos de peso
    const weightValidationError = validateWeightRange()
    if (weightValidationError) {
      if (showAlert) {
        showAlert(weightValidationError, "error")
      } else {
        alert(weightValidationError)
      }
      return
    }

    // ✅ Convertir a números con decimales
    const body = {
      Name_Stage,
      Weight_From: Number.parseFloat(Weight_From),
      Weight_Upto: Number.parseFloat(Weight_Upto),
      Dur_Stage: Number.parseInt(Dur_Stage),
    }

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
          "error",
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
              required
            />
            <FaFileAlt className="icon" />
          </div>

          {/* ✅ Peso Desde - Ahora acepta decimales */}
          <div className="input_box">
            <input
              type="number"
              step="0.1"
              min="0"
              name="Weight_From"
              placeholder="Peso Desde (kg)"
              value={formData.Weight_From}
              onChange={handleChange}
              required
            />
            <LiaMicroscopeSolid className="icon" />
          </div>

          {/* ✅ Peso Hasta - Ahora acepta decimales */}
          <div className="input_box">
            <input
              type="number"
              step="0.1"
              min="0"
              name="Weight_Upto"
              placeholder="Peso Hasta (kg)"
              value={formData.Weight_Upto}
              onChange={handleChange}
              required
            />
            <LiaMicroscopeSolid className="icon" />
          </div>

          {/* Duración de la etapa */}
          <div className="input_box">
            <input
              type="number"
              min="1"
              name="Dur_Stage"
              placeholder="Duración (días)"
              value={formData.Dur_Stage}
              onChange={handleChange}
              required
            />
            <FaRegClock className="icon" />
          </div>

          {/* ✅ Información de ayuda para las nuevas etapas */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
            <h4 className="font-semibold text-blue-800 mb-2">📋 Rangos de Peso Recomendados:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>
                • <strong>Pre-inicio:</strong> 6.5 - 17.5 kg
              </li>
              <li>
                • <strong>Iniciación:</strong> 17.5 - 30 kg
              </li>
              <li>
                • <strong>Levante:</strong> 30 - 60 kg
              </li>
              <li>
                • <strong>Engorde:</strong> 60 - 120 kg
              </li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            {onCancelEdit && (
              <Button type="button" onClick={onCancelEdit} variant="outline" disabled={loading}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading} className="enviar">
              {loading ? (isEditing ? "Actualizando..." : "Registrando...") : isEditing ? "Actualizar" : "Registrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StageForm

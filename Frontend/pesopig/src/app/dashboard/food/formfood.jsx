"use client"
import { useState, useEffect } from "react"
import styles from "./page.module.css"
import axiosInstance from "@/lib/axiosInstance"
import { FaUtensils, FaCalendarAlt, FaWarehouse, FaWeightHanging, FaPiggyBank } from "react-icons/fa"

// Función para enviar datos al backend
async function SendData(body) {
  console.log("Enviando datos al backend:", body)
  const response = await axiosInstance.post("/api/Food/CreateFood", body)
  return response
}

function RegisterFoodPage({ refreshData }) {
  const [loading, setLoading] = useState(false)
  const [stages, setStages] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const stagesResponse = await axiosInstance.get("/api/Stage/ConsultAllStages")
        setStages(stagesResponse.data)
      } catch (error) {
        console.error("Error al obtener datos:", error)
        alert("No se pudieron cargar las opciones necesarias.")
      }
    }

    fetchData()
  }, [])

  async function handlerSubmit(event) {
    event.preventDefault()
    setError("")

    const form = new FormData(event.currentTarget)

    const nam_Food = form.get("nam_Food")?.trim() || ""
    const des_Food = form.get("des_Food")?.trim() || ""
    const existence = form.get("existence") || ""
    const vlr_Unit = form.get("vlr_Unit") || ""
    const fec_Expiration = form.get("fec_Expiration") || ""
    const und_Extent = form.get("und_Extent")?.trim() || ""
    const id_Stage = form.get("id_Stage") || ""

    if (!nam_Food || !des_Food || !existence || !vlr_Unit || !fec_Expiration || !und_Extent || !id_Stage) {
      setError("Todos los campos son requeridos.")
      alert("Todos los campos son requeridos.")
      return
    }

    const body = {
      nam_Food,
      des_Food,
      existence: Number.parseInt(existence),
      vlr_Unit: Number.parseInt(vlr_Unit),
      fec_Expiration,
      und_Extent,
      id_Stage: Number.parseInt(id_Stage),
    }

    try {
      setLoading(true)
      const response = await SendData(body)
      alert(response.data.message || "Registro exitoso")
      event.target.reset()

      if (typeof refreshData === "function") {
        refreshData()
      }
    } catch (error) {
      console.error("Error completo:", error)

      if (error.response) {
        console.log("Datos de respuesta:", error.response.data)
        console.log("Estado HTTP:", error.response.status)
        console.log("Cabeceras:", error.response.headers)

        const errorMessage =
          typeof error.response.data === "object" ? JSON.stringify(error.response.data, null, 2) : error.response.data

        setError(`Error ${error.response.status}: ${errorMessage}`)
        alert(`Ocurrió un error al registrar el alimento: ${errorMessage}`)
      } else if (error.request) {
        console.log("Solicitud sin respuesta:", error.request)
        setError("No se recibió respuesta del servidor")
        alert("No se recibió respuesta del servidor")
      } else {
        console.log("Error:", error.message)
        setError(`Error: ${error.message}`)
        alert(`Error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={`col-md-6 ${styles.form_box} d-flex align-items-center justify-content-center`}>
        <form className={styles.form} onSubmit={handlerSubmit}>
          <h1 className={styles.title}>Registrar Alimento</h1>

          {error && <div className={`${styles.error_message} col-span-2`}>{error}</div>}

          {/* Nombre del alimento */}
          <div className={styles.input_box}>
            <input type="text" id="nam_Food" name="nam_Food" placeholder="Nombre del Alimento" />
            <FaUtensils className={styles.icon} />
          </div>

          {/* Descripción del alimento */}
          <div className={styles.input_box}>
            <input type="text" id="des_Food" name="des_Food" placeholder="Descripción del Alimento" />
            <FaPiggyBank className={styles.icon} />
          </div>

          {/* Existencia */}
          <div className={styles.input_box}>
            <input type="number" id="existence" name="existence" placeholder="Existencia" step="1" />
            <FaWarehouse className={styles.icon} />
          </div>

          {/* Valor unitario */}
          <div className={styles.input_box}>
            <input type="number" id="vlr_Unit" name="vlr_Unit" placeholder="Valor Unitario" step="1" />
            <FaUtensils className={styles.icon} />
          </div>

          {/* Fecha de vencimiento */}
          <div className={styles.input_box}>
            <input type="date" id="fec_Expiration" name="fec_Expiration" placeholder="Fecha de Vencimiento" />
            <FaCalendarAlt className={styles.icon} />
          </div>

          {/* Unidad de medida */}
          <div className={styles.input_box}>
            <input type="text" id="und_Extent" name="und_Extent" placeholder="Unidad de Medida" />
            <FaWeightHanging className={styles.icon} />
          </div>

          {/* Selección de Etapa */}
          <div className={styles.input_box}>
            <select id="id_Stage" name="id_Stage" className={styles.select}>
              <option value="">Selecciona una etapa</option>
              {stages.map((stage) => (
                <option key={stage.id_Stage} value={stage.id_Stage}>
                  {stage.name_Stage}
                </option>
              ))}
            </select>
            <FaWarehouse className={styles.icon} />
          </div>

          {/* Botón de enviar */}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterFoodPage

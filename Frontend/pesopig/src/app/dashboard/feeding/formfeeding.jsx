"use client"

import { useState, useEffect } from "react"
import styles from "./page.module.css"
import axiosInstance from "@/lib/axiosInstance"
import {
  FaUtensils,
  FaClipboardList,
  FaWeightHanging,
  FaUser,
  FaPiggyBank,
  FaAppleAlt,
  FaCalendarAlt,
} from "react-icons/fa"
import { Button } from "@/components/ui/button"

async function SendData(body, isEditing = false) {
  if (isEditing) {
    const response = await axiosInstance.put("/api/Feeding/UpdateFeeding", body)
    return response
  } else {
    const response = await axiosInstance.post("/api/Feeding/CreateFeeding", body)
    return response
  }
}

function RegisterFeedingPage({ refreshData, feedingToEdit, onCancelEdit, closeModal }) {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [Corrals, setCorrals] = useState([])
  const [foods, setFoods] = useState([])

  const [formData, setFormData] = useState({
    Can_Food: "",
    Obc_Feeding: "",
    Sum_Food: "",
    id_Users: "",
    Dat_Feeding: "",
    id_Corral: "",
    id_Food: "",
  })

  const isEditing = !!feedingToEdit

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, CorralsRes, foodsRes] = await Promise.all([
          axiosInstance.get("/api/User/ConsultAllUser"),
          axiosInstance.get("/api/Food/ConsultAllFoods"),
          axiosInstance.get("/api/Corral/ConsultAllCorrales"),
        ])
        setUsers(usersRes.data)
        setCorrals(CorralsRes.data)
        setFoods(foodsRes.data)
      } catch (error) {
        console.error("Error al obtener datos:", error)
        alert("No se pudieron cargar las opciones necesarias.")
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (isEditing && feedingToEdit) {
      setFormData({
        Can_Food: feedingToEdit.Can_Food?.toString() || "",
        Obc_Feeding: feedingToEdit.Obc_Feeding || "",
        Sum_Food: feedingToEdit.Sum_Food?.toString() || "",
        id_Users: feedingToEdit.id_Users?.toString() || "",
        Dat_Feeding: feedingToEdit.Dat_Feeding?.split("T")[0] || "",
        id_Corral: feedingToEdit.id_Corral?.toString() || "",
        id_Food: feedingToEdit.id_Food?.toString() || "",
      });
    } else {
      setFormData({
        Can_Food: "",
        Obc_Feeding: "",
        Sum_Food: "",
        id_Users: "",
        Dat_Feeding: "",
        id_Corral: "",
        id_Food: "",
      })
    }
  }, [feedingToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handlerSubmit(event) {
    event.preventDefault()
    const { Can_Food, Obc_Feeding, Sum_Food, id_Users, Dat_Feeding, id_Corral, id_Food } = formData

    if (!Can_Food || !Obc_Feeding || !Sum_Food || !id_Users || !Dat_Feeding || !id_Corral || !id_Food) {
      alert("Todos los campos son requeridos.")
      return
    }

    const body = {
      Can_Food: parseFloat(Can_Food),
      Obc_Feeding: Obc_Feeding.trim(),
      Sum_Food: parseFloat(Sum_Food),
      id_Users: parseInt(id_Users),
      Dat_Feeding,
      id_Corral: parseInt(id_Corral),
      id_Food: parseInt(id_Food),
    }

    if (isEditing && feedingToEdit?.id_Feeding) {
      body.id_Feeding = feedingToEdit.id_Feeding
    }

    try {
      setLoading(true)
      const response = await SendData(body, isEditing)
      alert(response.data.message || (isEditing ? "Alimentación actualizada con éxito." : "Alimentación registrada con éxito."))
      setFormData({
        Can_Food: "",
        Obc_Feeding: "",
        Sum_Food: "",
        id_Users: "",
        Dat_Feeding: "",
        id_Corral: "",
        id_Food: "",
      })
      if (closeModal) closeModal()
      if (typeof refreshData === "function") refreshData()
    } catch (error) {
      console.error("Error completo:", error)
      const errorMessage = error.response?.data || "Error desconocido"
      alert(`Error al ${isEditing ? "actualizar" : "registrar"} la alimentación: ${JSON.stringify(errorMessage)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={`col-md-6 ${styles.form_box} d-flex align-items-center justify-content-center`}>
        <form className={styles.form} onSubmit={handlerSubmit}>
          <h1 className={styles.title}>{isEditing ? "Actualizar Alimentación" : "Registrar Alimentación"}</h1>

          {/* Corral */}
          <div className={styles.input_box}>
            <select
              name="id_Corral"
              className={styles.select}
              value={formData.id_Corral}
              onChange={handleChange}
            >
              <option value="">Selecciona el corral</option>
              {Corrals.filter(c => c.id_Corral != null).map((corral) => (
                <option key={corral.id_Corral} value={corral.id_Corral}>
                  {corral.des_Corral}
                </option>
              ))}
            </select>
            <FaPiggyBank className={styles.icon} />
          </div>

          {/* Cantidad */}
          <div className={styles.input_box}>
            <input
              type="number"
              name="Can_Food"
              placeholder="Cantidad de alimentación (kg)"
              value={formData.Can_Food}
              onChange={handleChange}
            />
            <FaUtensils className={styles.icon} />
          </div>

          {/* Observación */}
          <div className={styles.input_box}>
            <input
              type="text"
              name="Obc_Feeding"
              placeholder="Observación"
              value={formData.Obc_Feeding}
              onChange={handleChange}
            />
            <FaClipboardList className={styles.icon} />
          </div>

          {/* Consumo promedio */}
          <div className={styles.input_box}>
            <input
              type="number"
              name="Sum_Food"
              placeholder="Consumo promedio (kg)"
              value={formData.Sum_Food}
              onChange={handleChange}
            />
            <FaWeightHanging className={styles.icon} />
          </div>

          {/* Usuario */}
          <div className={styles.input_box}>
            <select
              name="id_Users"
              className={styles.select}
              value={formData.id_Users}
              onChange={handleChange}
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id_Users} value={user.id_Users}>
                  {user.nom_Users}
                </option>
              ))}
            </select>
            <FaUser className={styles.icon} />
          </div>

          {/* Fecha */}
          <div className={styles.input_box}>
            <input
              type={formData.Dat_Feeding ? "date" : "text"}
              name="Dat_Feeding"
              placeholder="Fecha de la Alimentación"
              value={formData.Dat_Feeding}
              onFocus={(e) => {
                e.target.type = "date"
                e.target.showPicker?.()
              }}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text"
              }}
              onChange={handleChange}
            />
            <FaCalendarAlt className={styles.icon} />
          </div>

          {/* Alimento */}
          <div className={styles.input_box}>
            <select
              name="id_Food"
              className={styles.select}
              value={formData.id_Food}
              onChange={handleChange}
            >
              <option value="">Selecciona un alimento</option>
              {foods.map((food) => (
                <option key={food.id_Food} value={food.id_Food}>
                  {food.nam_Food}
                </option>
              ))}
            </select>
            <FaAppleAlt className={styles.icon} />
          </div>

          {/* Botón */}
          <Button type="submit" disabled={loading} className={styles.button}>
            {loading
              ? isEditing
                ? "Actualizando..."
                : "Registrando..."
              : isEditing
              ? "Actualizar"
              : "Registrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default RegisterFeedingPage

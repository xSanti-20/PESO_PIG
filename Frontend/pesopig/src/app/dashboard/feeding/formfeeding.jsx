"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"

import {
  FaUtensils,
  FaClipboardList,
  FaWeightHanging,
  FaUser,
  FaPiggyBank,
  FaAppleAlt,
} from "react-icons/fa"

// Enviar datos al backend
async function SendData(body) {
  const response = await axiosInstance.post("/api/Feeding/CreateFeeding", body)
  return response
}

function RegisterFeedingPage({ refreshData }) {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [piglets, setPiglets] = useState([])
  const [foods, setFoods] = useState([])
  

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, pigletsRes, foodsRes] = await Promise.all([
          axiosInstance.get("/api/User/ConsultAllUser"),
          axiosInstance.get("/api/Piglet/ConsultAllPiglets"),
          axiosInstance.get("/api/Food/ConsultAllFoods"),
        ]);
        setUsers(usersRes.data)
        setPiglets(pigletsRes.data)
        setFoods(foodsRes.data)
      } catch (error) {
        console.error("Error al obtener datos:", error)
        alert("No se pudieron cargar las opciones necesarias.")
      }
    }

    fetchData()
  }, [])

  async function handlerSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    const can_Feeding = form.get("can_Feeding")
    const des_Feeding = form.get("des_Feeding")?.trim()
    const con_Average = form.get("con_Average")
    const id_Users = form.get("id_Users")
    const id_Piglet = form.get("id_Piglet")
    const id_Food = form.get("id_Food")

    if (!can_Feeding || !des_Feeding || !con_Average || !id_Users || !id_Piglet || !id_Food) {
      alert("Todos los campos son requeridos.")
      return
    }

    const body = {
      can_Feeding: parseFloat(can_Feeding),
      des_Feeding,
      con_Average: parseFloat(con_Average),
      id_Users: parseInt(id_Users),
      id_Piglet: parseInt(id_Piglet),
      id_Food: parseInt(id_Food),
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
      const errorMessage = error.response?.data || "Error desconocido"
      alert("Ocurrió un error al registrar la alimentación: " + JSON.stringify(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handlerSubmit}>
          <h1>Registrar Alimentación</h1>

          {/* Cantidad */}
          <div>
            <input
              type="number"
              name="can_Feeding"
              placeholder="Cantidad de alimentación (kg)"
              step="0.01"
            />
            <FaUtensils />
          </div>

          {/* Descripción */}
          <div>
            <input type="text" name="des_Feeding" placeholder="Descripción de alimentación" />
            <FaClipboardList />
          </div>

          {/* Consumo Promedio */}
          <div>
            <input
              type="number"
              name="con_Average"
              placeholder="Consumo promedio (kg)"
              step="0.01"
            />
            <FaWeightHanging />
          </div>

          {/* Usuario */}
          <div>
            <select name="id_Users">
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id_Users} value={user.id_Users}>
                  {user.nom_Users}
                </option>
              ))}
            </select>
            <FaUser />
          </div>

          {/* Animal */}
          <div>
            <select name="id_Piglet">
              <option value="">Selecciona un animal</option>
              {piglets.map((piglet) => (
                <option key={piglet.id_Piglet} value={piglet.id_Piglet}>
                  {piglet.name_Piglet}
                </option>
              ))}
            </select>
            <FaPiggyBank />
          </div>

          {/* Alimento */}
          <div>
            <select name="id_Food">
              <option value="">Selecciona un alimento</option>
              {foods.map((food) => (
                <option key={food.id_Food} value={food.id_Food}>
                  {food.name_Food || `Alimento ${food.id_Food}`}
                </option>
              ))}
            </select>
            <FaAppleAlt />
          </div>

          {/* Botón */}
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterFeedingPage

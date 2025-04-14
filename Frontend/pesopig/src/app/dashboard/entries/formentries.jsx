"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css"; // Usamos tu nuevo archivo de estilos
import axiosInstance from "@/lib/axiosInstance";
import { FaUtensils, FaCalendarAlt, FaWarehouse, FaMoneyBillWave } from "react-icons/fa";

async function SendData(body) {
  console.log("Enviando datos al backend:", body);
  const response = await axiosInstance.post("/api/Entries/CreateEntries", body);
  return response;
}

function RegisterEntryPage({ refreshData }) {
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await axiosInstance.get("/api/Food/ConsultAllFoods");
        setFoods(response.data);
      } catch (error) {
        console.error("Error al obtener alimentos:", error);
        alert("No se pudieron cargar los alimentos.");
      }
    }

    fetchFoods();
  }, []);

  async function handlerSubmit(event) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const Vlr_Entries = form.get("Vlr_Entries");
    const Fec_Entries = form.get("Fec_Entries");
    const Fec_Expiration = form.get("Fec_Expiration");
    const Can_Food = form.get("Can_Food");
    const Id_Food = form.get("Id_Food");

    if (!Vlr_Entries || !Fec_Entries || !Fec_Expiration || !Can_Food || !Id_Food) {
      setError("Todos los campos son requeridos.");
      alert("Todos los campos son requeridos.");
      return;
    }

    const body = {
      Vlr_Entries: parseInt(Vlr_Entries),
      Fec_Entries,
      Fec_Expiration,
      Can_Food: parseInt(Can_Food),
      Id_Food: parseInt(Id_Food),
    };

    try {
      setLoading(true);
      const response = await SendData(body);
      alert(response.data.message || "Entrada registrada exitosamente");
      event.target.reset();

      if (typeof refreshData === "function") {
        refreshData();
      }
    } catch (error) {
      console.error("Error completo:", error);
      if (error.response) {
        const errorMessage =
          typeof error.response.data === "object"
            ? JSON.stringify(error.response.data, null, 2)
            : error.response.data;
        setError(`Error ${error.response.status}: ${errorMessage}`);
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        setError("No se recibió respuesta del servidor");
        alert("No se recibió respuesta del servidor");
      } else {
        setError(`Error: ${error.message}`);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.form_box}>
        <form className={styles.form} onSubmit={handlerSubmit}>
          <h1 className={styles.title}>Registrar Entrada</h1>

          {error && <div className={styles.error_message}>{error}</div>}

          <div className={styles.input_box}>
            <input type="number" id="Vlr_Entries" name="Vlr_Entries" placeholder="Valor de la Entrada" step="1" />
            <FaMoneyBillWave className={styles.icon} />
          </div>

          <div className={styles.input_box}>
            <input type="date" id="Fec_Entries" name="Fec_Entries" placeholder="Fecha de Entradad" />
            <FaCalendarAlt className={styles.icon} />
          </div>

          <div className={styles.input_box}>
            <input type="date" id="Fec_Expiration" name="Fec_Expiration" placeholder="Fecha de Vencimiento" />
            <FaCalendarAlt className={styles.icon} />
          </div>

          <div className={styles.input_box}>
            <input type="number" id="Can_Food" name="Can_Food" placeholder="Cantidad de Alimento" step="1" />
            <FaWarehouse className={styles.icon} />
          </div>

          <div className={styles.input_box}>
            <select id="Id_Food" name="Id_Food">
              <option value="">Selecciona un alimento</option>
              {foods.map((food) => (
                <option key={food.id_Food} value={food.id_Food}>
                  {food.nam_Food}
                </option>
              ))}
            </select>
            <FaUtensils className={styles.icon} />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Registrando..." : "Registrar Entrada"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterEntryPage;

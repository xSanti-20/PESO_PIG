"use client";
import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./Stage.Module.css";
import { FaFileAlt, FaCalendarAlt, FaRegClock } from "react-icons/fa";

async function sendData(body) {
  return await axiosInstance.post("api/Stage/CreateStage", body);
}

function StageForm() {
  const [formData, setFormData] = useState({
    Name_Stage: "",
    Weight_From: "",
    Weight_Upto: "",
    Tot_Weeks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Name_Stage, Weight_From, Weight_Upto, Tot_Weeks } = formData;

    if (!Name_Stage || !Weight_From || !Weight_Upto|| !Tot_Weeks ) {
      setErrorMessage("Todos los campos son requeridos.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await sendData({ Name_Stage, Weight_From, Weight_Upto, Tot_Weeks, });
      alert(response.data.message);
      setFormData({ Name_Stage: "", Weight_From: "", Weight_Upto: "", Tot_Weeks: "", });
    } catch (error) {
      const { errors, status } = error.response?.data || {};
      if (status === 400) {
        setErrorMessage("Error de validación: " + JSON.stringify(errors));
      } else {
        setErrorMessage("Ocurrió un error al registrar la etapa.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="wrapper">
      <div className="form_box">
        <h2 className="title">Registrar Etapa</h2>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          
          {/* Nombre Etapa */}
          <div className="input_box">
            <input
              type="text"
              name="Name_Stage"
              placeholder="Nombre Etapa"
              value={formData.Name_Stage}
              onChange={handleChange}
            />
            <FaFileAlt className="icon" /> {/* Icono para el nombre */}
          </div>

          {/* Peso del Lechon Desde */}
          <div className="input_box">
            <input
              type="number"
              name="Weight_From"
              placeholder="Peso Desde"
              value={formData.Weight_From}
              onChange={handleChange}
            />
            <FaCalendarAlt className="icon" /> {/* Icono para la fecha */}
          </div>

          {/* Peso del Lechon Hasta */}
          <div className="input_box">
            <input
              type="number"
              name="Weight_Upto"
              placeholder="Peso Hasta"
              value={formData.Weight_Upto}
              onChange={handleChange}
            />
            <FaCalendarAlt className="icon" /> {/* Icono para la fecha */}
          </div>

          {/* Total de semanas de la Etapa */}
          <div className="input_box">
            <input
              type="number"
              name="Tot_Weeks"
              placeholder="Semanas"
              value={formData.Week_Stage}
              onChange={handleChange}
            />
            <FaRegClock className="icon" /> {/* Icono para la semana */}
          </div>

          <button className="enviar" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default StageForm;
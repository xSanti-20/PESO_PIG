"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import axiosInstance from "@/lib/axiosInstance";
import {
    FaPiggyBank,
    FaCalendarAlt,
    FaWeightHanging,
    FaVenusMars,
    FaWarehouse,
} from "react-icons/fa";

// Función para enviar datos al backend
async function SendData(body) {
    const response = await axiosInstance.post("api/Piglet/CreatePiglet", body);
    return response;
}

function RegisterPigletPage({ refreshData }) {  // ✅ Recibir refreshData como prop
    const [loading, setLoading] = useState(false);
    const [races, setRaces] = useState([]);
    const [stages, setStages] = useState([]);
    const [corrals, setCorrals] = useState([]);

    // Obtener razas, etapas y corrales desde el backend
    useEffect(() => {
        async function fetchData() {
            try {
                const [racesResponse, stagesResponse, corralsResponse] = await Promise.all([
                    axiosInstance.get("/api/Race/ConsultAllRaces"),
                    axiosInstance.get("/api/Stage/ConsultAllStages"),
                    axiosInstance.get("/api/Corral/ConsultAllCorrales"),
                ]);

                setRaces(racesResponse.data);
                setStages(stagesResponse.data);
                setCorrals(corralsResponse.data);
            } catch (error) {
                console.error("Error al obtener datos:", error);
                alert("No se pudieron cargar las opciones necesarias.");
            }
        }

        fetchData();
    }, []);

    // Manejador del envío del formulario
    async function handlerSubmit(event) {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const Name_Piglet = form.get("Name_Piglet").trim();
        const Fec_Birth = form.get("Fec_Birth");
        const Weight_Initial = parseInt(form.get("Weight_Initial"));
        const Sex_Piglet = form.get("Sex_Piglet");
        const raceId = form.get("race");
        const stageId = form.get("stage");
        const corralId = form.get("corral");

        // Validación de campos vacíos
        if (!Name_Piglet || !Fec_Birth || !Weight_Initial || !Sex_Piglet || !raceId || !stageId || !corralId) {
            alert("Todos los campos son requeridos.");
            return;
        }

        // Crear el objeto con los nombres exactos que espera el backend
        const body = {
            Name_Piglet,
            Fec_Birth,
            Weight_Initial,
            Sex_Piglet,
            Acum_Weight: Weight_Initial,
            Id_Race: parseInt(raceId),
            Id_Stage: parseInt(stageId),
            Id_Corral: parseInt(corralId)
        };

        try {
            setLoading(true);
            const response = await SendData(body);
            alert(response.data.message || "Registro exitoso");
            event.target.reset(); // Limpiar el formulario

            // ✅ Llamar a refreshData() si está disponible para actualizar la tabla
            if (typeof refreshData === "function") {
                refreshData();
            } else {
                console.warn("⚠ refreshData no está definido o no es una función.");
            }

        } catch (error) {
            console.error("Error completo:", error);
            const errorMessage = error.response?.data || "Error desconocido";
            alert("Ocurrió un error al registrar el lechón: " + JSON.stringify(errorMessage));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={`col-md-6 ${styles.form_box} d-flex align-items-center justify-content-center`}>
                <form className={styles.form} onSubmit={handlerSubmit}>
                    <h1 className={styles.title}>Registrar Lechón</h1>

                    {/* Nombre del lechón */}
                    <div className={styles.input_box}>
                        <input type="text" id="Name_Piglet" name="Name_Piglet" placeholder="Nombre del lechón" />
                        <FaPiggyBank className={styles.icon} />
                    </div>

                    {/* Fecha de nacimiento */}
                    <div className={styles.input_box}>
                        <input type="date" id="Fec_Birth" name="Fec_Birth" placeholder="Fecha de nacimiento" />
                    </div>

                    {/* Peso inicial */}
                    <div className={styles.input_box}>
                        <input type="number" id="Weight_Initial" name="Weight_Initial" placeholder="Peso inicial (kg)" step="0.01" />
                        <FaWeightHanging className={styles.icon} />
                    </div>

                    {/* Sexo del lechón */}
                    <div className={styles.input_box}>
                        <select id="Sex_Piglet" name="Sex_Piglet" className={styles.select}>
                            <option value="">Selecciona el sexo</option>
                            <option value="Macho">Macho</option>
                            <option value="Hembra">Hembra</option>
                        </select>
                        <FaVenusMars className={styles.icon} />
                    </div>

                    {/* Selección de Raza */}
                    <div className={styles.input_box}>
                        <select id="race" name="race" className={styles.select}>
                            <option value="">Selecciona una raza</option>
                            {races.map((race) => (
                                <option key={race.id_Race} value={race.id_Race}>{race.nam_Race}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selección de Etapa */}
                    <div className={styles.input_box}>
                        <select id="stage" name="stage" className={styles.select}>
                            <option value="">Selecciona una etapa</option>
                            {stages.map((stage) => (
                                <option key={stage.id_Stage} value={stage.id_Stage}>{stage.name_Stage}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selección de Corral */}
                    <div className={styles.input_box}>
                        <select id="corral" name="corral" className={styles.select}>
                            <option value="">Selecciona un corral</option>
                            {corrals.map((corral) => (
                                <option key={corral.id_Corral} value={corral.id_Corral}>
                                    {corral.name_Corral || `Corral ${corral.id_Corral}`}
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
    );
}

export default RegisterPigletPage;

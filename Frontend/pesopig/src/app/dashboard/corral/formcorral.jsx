"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import axiosInstance from "@/lib/axiosInstance";
import { FaWarehouse, FaListOl } from "react-icons/fa";

// Función para enviar datos al backend
async function SendData(body) {
    const response = await axiosInstance.post("api/Corral/CreateCorral", body);
    return response;
}


function RegisterCorral({ refreshData }) {  // ✅ Recibir refreshData como prop
    const [loading, setLoading] = useState(false);

    // Manejador del envío del formulario
    async function handlerSubmit(event) {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const Des_Corral = form.get("Des_Corral").trim();
        const Tot_Animal = parseInt(form.get("Tot_Animal"));

        // Validación de campos vacíos
        if (!Des_Corral || isNaN(Tot_Animal) || Tot_Animal < 0) {
            alert("Todos los campos son requeridos y el total de animales debe ser un número válido.");
            return;
        }

        // Crear el objeto con los nombres exactos que espera el backend
        const body = {
            Des_Corral,
            Tot_Animal
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
            alert("Ocurrió un error al registrar el corral: " + JSON.stringify(errorMessage));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={`col-md-6 ${styles.form_box} d-flex align-items-center justify-content-center`}>
                <form className={styles.form} onSubmit={handlerSubmit}>
                    <h1 className={styles.title}>Registrar Corral</h1>

                    {/* Descripción del corral */}
                    <div className={styles.input_box}>
                        <input type="text" id="Des_Corral" name="Des_Corral" placeholder="Descripción del corral" />
                        <FaWarehouse className={styles.icon} />
                    </div>

                    {/* Total de animales */}
                    <div className={styles.input_box}>
                        <input type="number" id="Tot_Animal" name="Tot_Animal" placeholder="Total de animales" min="0" />
                        <FaListOl className={styles.icon} />
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

export default RegisterCorral;

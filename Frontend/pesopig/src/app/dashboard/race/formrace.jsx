"use client";
import React from "react";
import "./page.Module.css";
import axiosInstance from "@/lib/axiosInstance";
import { FaDna } from "react-icons/fa";

// Función para enviar datos al backend
async function SendData(body) {
    const response = await axiosInstance.post("/api/Race/CreateRace", body);
    return response;
}

function RegisterRace() {
    // Manejador del envío del formulario
    async function handlerSubmit(event) {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const Nam_Race = form.get("Nam_Race");

        // Validación de campos vacíos
        if (!Nam_Race) {
            alert("El nombre de la raza es requerido.");
            return;
        }

        const body = {
            Nam_Race,
        };

        try {
            const response = await SendData(body);
            console.log(response);
            alert(response.data.message || "Raza registrada con éxito.");
        } catch (error) {
            console.log(error);
            const { errors, status } = error.response?.data || {};

            if (status === 400) {
                alert("Error de validación: " + JSON.stringify(errors));
            } else {
                alert("Ocurrió un error al registrar la raza.");
            }
        }
    }

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <form className="register-form" onSubmit={handlerSubmit}>
                    <h1 className="register-title">Registrar Raza</h1>
                    <div className="register-input-box">
                        <input
                            type="text"
                            id="Nam_Race"
                            name="Nam_Race"
                            placeholder="Nombre de la raza"
                        />
                        <FaDna className="register-icon" />
                    </div>
                    <button type="submit" className="register-button">Registrar Raza</button>
                </form>
            </div>
        </div>


    );
}

export default RegisterRace;

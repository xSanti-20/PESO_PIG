"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import axiosInstance from "@/lib/axiosInstance";
import PrivateNav from "@/components/nav/PrivateNav";
import { FaWeightHanging, FaCalendarAlt, FaUser, FaPiggyBank } from "react-icons/fa";

// Función para enviar datos al backend
async function SendData(body) {
    const response = await axiosInstance.post("/api/Weighing/CreateWeighing", body);
    return response;
}

function RegisterWeighingPage({ refreshData }) {
    const [piglets, setPiglets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const pigletResponse = await axiosInstance.get("/api/Piglet/ConsultAllPiglets");
                setPiglets(pigletResponse.data);

                const userResponse = await axiosInstance.get("/api/User/ConsultAllUser");
                console.log("Usuarios recibidos:", userResponse.data);
                setUsers(userResponse.data);
            } catch (error) {
                console.error("Error al cargar datos: ", error);
            }
        }
        fetchData();
    }, []);

    async function handlerSubmit(event) {
        event.preventDefault();
        setLoading(true);

        const form = new FormData(event.currentTarget);
        const Weight_Current = form.get("Weight_Current");
        const Weight_Gain = form.get("Weight_Gain");
        const Fec_Weight = form.get("Fec_Weight");
        const Id_Piglet = form.get("Id_Piglet");  // Capturar ID en lugar de nombre
        const Id_Users = form.get("Id_Users");    // Capturar ID en lugar de nombre

        if (!Weight_Current || !Weight_Gain || !Fec_Weight || !Id_Piglet || !Id_Users) {
            alert("Todos los campos son requeridos.");
            setLoading(false);
            return;
        }

        const body = {
            Weight_Current: parseInt(Weight_Current),
            Weight_Gain: parseInt(Weight_Gain),
            Fec_Weight,
            Id_Piglet: parseInt(Id_Piglet),  // Enviar ID
            Id_Users: parseInt(Id_Users)     // Enviar ID
        };

        try {
            await SendData(body);
            alert("Pesaje registrado exitosamente.");
            event.target.reset();
            refreshData();
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al registrar el pesaje.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={`col-md-6 ${styles.form_box} d-flex align-items-center justify-content-center`}>
                <form className={styles.form} onSubmit={handlerSubmit}>
                    <h1 className={styles.title}>Registrar Pesaje</h1>

                    {/* Peso actual */}
                    <div className={styles.input_box}>
                        <input type="number" id="Weight_Current" name="Weight_Current" placeholder="Peso actual (kg)" min="1" max="1000" />
                        <FaWeightHanging className={styles.icon} />
                    </div>

                    {/* Aumento de peso */}
                    <div className={styles.input_box}>
                        <input type="number" id="Weight_Gain" name="Weight_Gain" placeholder="Aumento de peso (kg)" min="0" max="1000" />
                        <FaWeightHanging className={styles.icon} />
                    </div>

                    {/* Fecha de pesaje */}
                    <div className={styles.input_box}>
                        <input type="date" id="Fec_Weight" name="Fec_Weight" placeholder="Fecha de pesaje" />
                    </div>

                    {/* Selección de Animal */}
                    <div className={styles.input_box}>
                        <select id="Id_Piglet" name="Id_Piglet" className={styles.select}>
                            <option value="">Selecciona un animal</option>
                            {piglets.map((piglet) => (
                                <option key={piglet.id_Piglet} value={piglet.id_Piglet}>
                                    {piglet.name_Piglet}
                                </option>
                            ))}
                        </select>
                        <FaPiggyBank className={styles.icon} />
                    </div>

                    {/* Selección de Usuario */}
                    <div className={styles.input_box}>
                        <select id="Id_Users" name="Id_Users" className={styles.select}>
                            <option value="">Selecciona un usuario</option>
                            {users.map((user) => (
                                <option key={user.id_Users} value={user.id_Users}>
                                    {user.nom_Users}
                                </option>
                            ))}
                        </select>
                        <FaUser className={styles.icon} />
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

export default RegisterWeighingPage;

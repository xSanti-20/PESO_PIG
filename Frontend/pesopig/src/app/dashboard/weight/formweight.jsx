"use client"

import { useState, useEffect } from "react"
import styles from "./page.module.css"
import axiosInstance from "@/lib/axiosInstance"
import { FaWeightHanging, FaCalendarAlt, FaUser, FaPiggyBank, FaCalculator } from "react-icons/fa"

// Función para enviar datos al backend
async function SendData(body, isEditing = false) {
    if (isEditing) {
        const response = await axiosInstance.put("/api/Weighing/UpdateWeighing", body)
        return response
    } else {
        const response = await axiosInstance.post("/api/Weighing/CreateWeighing", body)
        return response
    }
}

function RegisterWeighingPage({ refreshData, weighingToEdit, onCancelEdit, closeModal, showAlert }) {
    const [piglets, setPiglets] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedPiglet, setSelectedPiglet] = useState(null)
    const [weightCurrent, setWeightCurrent] = useState("")
    const [weightGain, setWeightGain] = useState("")
    const [isCalculating, setIsCalculating] = useState(false)
    const [fechaPesaje, setFechaPesaje] = useState("")
    const [idUsuario, setIdUsuario] = useState("")
    const [showDate, setShowDate] = useState(false)

    const isEditing = !!weighingToEdit

    // Cargar datos del pesaje a editar cuando cambia weighingToEdit
    useEffect(() => {
        if (weighingToEdit) {
            // Formatear la fecha para el input date (YYYY-MM-DD)
            const formatDate = (dateString) => {
                if (!dateString) return ""
                const date = new Date(dateString)
                return date.toISOString().split("T")[0]
            }

            setWeightCurrent(weighingToEdit.weight_Current || "")
            setWeightGain(weighingToEdit.weight_Gain || "")
            setFechaPesaje(formatDate(weighingToEdit.fec_Weight))
            setIdUsuario(weighingToEdit.id_Users?.toString() || "")

            // Importante: Esperar a que los piglets se carguen antes de intentar seleccionar uno
            if (weighingToEdit.id_Piglet && piglets.length > 0) {
                const piglet = piglets.find((p) => p.id_Piglet == weighingToEdit.id_Piglet)
                if (piglet) {
                    setSelectedPiglet(piglet)
                } else {
                    console.warn("No se encontró el lechón con ID:", weighingToEdit.id_Piglet)
                }
            }
        } else {
            // Resetear el formulario si no hay pesaje para editar
            setWeightCurrent("")
            setWeightGain("")
            setFechaPesaje("")
            setIdUsuario("")
            setSelectedPiglet(null)
        }
    }, [weighingToEdit, piglets])

    useEffect(() => {
        async function fetchData() {
            try {
                const pigletResponse = await axiosInstance.get("/api/Piglet/ConsultAllPiglets")
                setPiglets(pigletResponse.data)

                const userResponse = await axiosInstance.get("/api/User/ConsultAllUser")
                console.log("Usuarios recibidos:", userResponse.data)
                setUsers(userResponse.data)

                // Ya no establecemos la fecha actual automáticamente
            } catch (error) {
                console.error("Error al cargar datos: ", error)
                if (showAlert) {
                    showAlert("Error al cargar los datos necesarios", "error")
                }
            }
        }
        fetchData()
    }, [showAlert])

    // Cuando se selecciona un lechón, obtener sus datos
    const handlePigletChange = async (e) => {
        const pigletId = e.target.value
        if (!pigletId) {
            setSelectedPiglet(null)
            setWeightGain("")
            return
        }

        try {
            // Buscar el lechón en la lista ya cargada
            const piglet = piglets.find((p) => p.id_Piglet == pigletId)
            setSelectedPiglet(piglet)

            // Si hay un peso actual ingresado, calcular la ganancia
            if (weightCurrent) {
                calculateWeightGain(weightCurrent, piglet)
            }
        } catch (error) {
            console.error("Error al obtener datos del lechón:", error)
            if (showAlert) {
                showAlert("Error al obtener datos del lechón", "error")
            }
        }
    }

    // Cuando cambia el peso actual, calcular la ganancia de peso
    const handleWeightCurrentChange = (e) => {
        const newWeightCurrent = e.target.value
        setWeightCurrent(newWeightCurrent)

        if (selectedPiglet && newWeightCurrent) {
            calculateWeightGain(newWeightCurrent, selectedPiglet)
        } else {
            setWeightGain("")
        }
    }

    // Función para calcular la ganancia de peso
    const calculateWeightGain = (currentWeight, piglet) => {
        if (!piglet || !currentWeight) return

        setIsCalculating(true)

        // Convertir a números para el cálculo
        const weightCurrentNum = Number.parseFloat(currentWeight)
        const lastWeight = Number.parseFloat(piglet.acum_Weight || piglet.weight_Initial)

        // Calcular la ganancia como la diferencia entre el peso actual y el último peso registrado
        const gain = weightCurrentNum - lastWeight

        setWeightGain(gain.toFixed(2))
        setIsCalculating(false)

        console.log("Cálculo de ganancia:", {
            pesoActualMedido: weightCurrentNum,
            ultimoPesoRegistrado: lastWeight,
            ganancia: gain,
        })
    }

    // Función para mostrar un diálogo de confirmación personalizado
    const showConfirmDialog = (message) => {
        return new Promise((resolve) => {
            if (showAlert) {
                // Por ahora, usamos el confirm nativo
                resolve(confirm(message))
            } else {
                resolve(confirm(message))
            }
        })
    }

    async function handlerSubmit(event) {
        event.preventDefault()
        setLoading(true)

        // Validar que todos los campos estén completos
        if (!weightCurrent || !weightGain || !fechaPesaje || !selectedPiglet || !idUsuario) {
            if (showAlert) {
                showAlert("Todos los campos son requeridos.", "error")
            } else {
                alert("Todos los campos son requeridos.")
            }
            setLoading(false)
            return
        }

        const body = {
            weight_Current: Number.parseFloat(weightCurrent),
            weight_Gain: Number.parseFloat(weightGain),
            fec_Weight: fechaPesaje,
            id_Piglet: Number.parseInt(selectedPiglet.id_Piglet),
            id_Users: Number.parseInt(idUsuario),
        }

        // Si estamos editando, añadir el ID del pesaje
        if (isEditing) {
            body.id_Weighings = weighingToEdit.id_Weighing || weighingToEdit.id_Weighings
        }

        try {
            const response = await SendData(body, isEditing)

            if (showAlert) {
                showAlert(isEditing ? "Pesaje actualizado exitosamente." : "Pesaje registrado exitosamente.", "success")
            } else {
                alert(isEditing ? "Pesaje actualizado exitosamente." : "Pesaje registrado exitosamente.")
            }

            // Limpiar el formulario y cerrar el modal
            handleReset()
        } catch (error) {
            console.error(error)

            if (showAlert) {
                showAlert(`Ocurrió un error al ${isEditing ? "actualizar" : "registrar"} el pesaje.`, "error")
            } else {
                alert(`Ocurrió un error al ${isEditing ? "actualizar" : "registrar"} el pesaje.`)
            }
        } finally {
            setLoading(false)
        }
    }

    // Función para resetear el formulario y cerrar el modal
    const handleReset = () => {
        // Resetear el formulario
        setWeightCurrent("")
        setWeightGain("")
        setFechaPesaje("")
        setIdUsuario("")
        setSelectedPiglet(null)

        // Cerrar el modal
        if (closeModal) {
            closeModal()
        }

        // Actualizar la tabla
        if (typeof refreshData === "function") {
            refreshData()
        } else {
            console.warn("⚠ refreshData no está definido o no es una función.")
        }
    }

    return (
        <div className={styles.container}>
            <div className={`col-md-6 ${styles.form_box} d-flex align-items-center justify-content-center`}>
                <form className={styles.form} onSubmit={handlerSubmit}>
                    <h1 className={styles.title}>{isEditing ? "Actualizar Pesaje" : "Registrar Pesaje"}</h1>

                    {/* Selección de Animal - Debe ser lo primero para poder calcular la ganancia */}
                    <div className={styles.input_box}>
                        <select
                            id="Id_Piglet"
                            name="Id_Piglet"
                            className={styles.select}
                            onChange={handlePigletChange}
                            value={selectedPiglet?.id_Piglet || ""}
                        >
                            <option value="">Selecciona un animal</option>
                            {piglets.map((piglet) => (
                                <option key={piglet.id_Piglet} value={piglet.id_Piglet}>
                                    {piglet.name_Piglet}
                                </option>
                            ))}
                        </select>
                        <FaPiggyBank className={styles.icon} />
                    </div>

                    {/* Mostrar información del lechón seleccionado */}
                    {selectedPiglet && (
                        <div className={styles.piglet_info || "mb-4 p-2 bg-gray-50 rounded text-sm"}>
                            <p>
                                <strong>Peso inicial:</strong> {selectedPiglet.weight_Initial} kg
                            </p>
                            <p>
                                <strong>Peso acumulado actual:</strong> {selectedPiglet.acum_Weight} kg
                            </p>
                        </div>
                    )}

                    {/* Peso actual */}
                    <div className={styles.input_box}>
                        <input
                            type="number"
                            id="Weight_Current"
                            name="Weight_Current"
                            placeholder="Peso actual (kg)"
                            min="1"
                            max="1000"
                            step="0.01"
                            value={weightCurrent}
                            onChange={handleWeightCurrentChange}
                        />
                        <FaWeightHanging className={styles.icon} />
                    </div>

                    {/* Aumento de peso - Ahora calculado automáticamente */}
                    <div className={styles.input_box}>
                        <input
                            type="number"
                            id="Weight_Gain"
                            name="Weight_Gain"
                            placeholder="Ganancia de peso (kg)"
                            min="-100"
                            max="1000"
                            step="0.01"
                            value={weightGain}
                            readOnly
                            className={`${styles.calculated_field || ""} bg-gray-100`}
                        />
                        <FaCalculator className={styles.icon} />
                        {isCalculating && <span className={styles.calculating || "text-xs text-gray-500"}>Calculando...</span>}
                    </div>

                    {/* Fecha de pesaje */}
                    <div className={styles.input_box}>
                        <input
                            type={showDate ? "date" : "text"}
                            id="Fec_Weight"
                            name="Fec_Weight"
                            placeholder="Fecha de pesaje"
                            value={fechaPesaje}
                            onChange={(e) => setFechaPesaje(e.target.value)}
                            onFocus={() => setShowDate(true)}
                            onBlur={() => !fechaPesaje && setShowDate(false)}
                        />
                        <FaCalendarAlt className={styles.icon} />
                    </div>

                    {/* Selección de Usuario */}
                    <div className={styles.input_box}>
                        <select
                            id="Id_Users"
                            name="Id_Users"
                            className={styles.select}
                            value={idUsuario}
                            onChange={(e) => setIdUsuario(e.target.value)}
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

                    {/* Botón de enviar */}
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading || !selectedPiglet || !weightCurrent || !weightGain}
                    >
                        {loading ? (isEditing ? "Actualizando..." : "Registrando...") : isEditing ? "Actualizar" : "Registrar"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RegisterWeighingPage

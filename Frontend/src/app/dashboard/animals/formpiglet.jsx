"use client"
import { useState, useEffect } from "react"
import styles from "./page.module.css"
import axiosInstance from "@/lib/axiosInstance"
import { FaPiggyBank, FaWeightHanging, FaVenusMars, FaWarehouse, FaIdCard } from "react-icons/fa"
import { Button } from "@/components/ui/button"

// Función para enviar datos al backend
async function SendData(body, isEditing = false) {
    if (isEditing) {
        const response = await axiosInstance.put("api/Piglet/UpdatePiglet", body)
        return response
    } else {
        const response = await axiosInstance.post("api/Piglet/CreatePiglet", body)
        return response
    }
}

function RegisterPigletPage({ refreshData, pigletToEdit, onCancelEdit, closeModal, showAlert, closeAlert }) {
    const [loading, setLoading] = useState(false)
    const [races, setRaces] = useState([])
    const [stages, setStages] = useState([])
    const [corrals, setCorrals] = useState([])
    const [showDate, setShowDate] = useState(false)
    const [weighingRecords, setWeighingRecords] = useState([])
    const [isLoadingWeighings, setIsLoadingWeighings] = useState(false)
    const [originalWeightInitial, setOriginalWeightInitial] = useState(null)
    const [formData, setFormData] = useState({
        Name_Piglet: "",
        Fec_Birth: "",
        Weight_Initial: "",
        Sex_Piglet: "",
        race: "",
        stage: "",
        corral: "",
        Placa_Sena: "",
    })

    const isEditing = !!pigletToEdit

    // Obtener razas, etapas y corrales desde el backend
    useEffect(() => {
        async function fetchData() {
            try {
                const [racesResponse, stagesResponse, corralsResponse] = await Promise.all([
                    axiosInstance.get("/api/Race/ConsultAllRaces"),
                    axiosInstance.get("/api/Stage/ConsultAllStages"),
                    axiosInstance.get("/api/Corral/ConsultAllCorrales"),
                ])

                setRaces(racesResponse.data)
                setStages(stagesResponse.data)
                setCorrals(corralsResponse.data)
            } catch (error) {
                console.error("Error al obtener datos:", error)
                if (showAlert) {
                    showAlert("No se pudieron cargar las opciones necesarias.", "error")
                }
            }
        }

        fetchData()
    }, [showAlert])

    // Cargar datos del lechón a editar cuando cambia pigletToEdit
    useEffect(() => {
        if (pigletToEdit) {
            // Formatear la fecha para el input date (YYYY-MM-DD)
            const formatDate = (dateString) => {
                if (!dateString) return ""
                const date = new Date(dateString)
                return date.toISOString().split("T")[0]
            }

            // Asegurarse de que los valores de los select sean strings
            setFormData({
                Name_Piglet: pigletToEdit.name_Piglet || "",
                Fec_Birth: formatDate(pigletToEdit.fec_Birth),
                Weight_Initial: pigletToEdit.weight_Initial || "",
                Sex_Piglet: pigletToEdit.sex_Piglet || "",
                race: pigletToEdit.id_Race?.toString() || "",
                stage: pigletToEdit.id_Stage?.toString() || "",
                corral: pigletToEdit.id_Corral?.toString() || "",
                Placa_Sena: pigletToEdit.placa_Sena || "",
            })

            // Guardar el peso inicial original para comparar si cambia
            setOriginalWeightInitial(pigletToEdit.weight_Initial)

            // Si estamos editando, cargar los registros de pesaje
            if (pigletToEdit.id_Piglet) {
                fetchWeighingRecords(pigletToEdit.id_Piglet)
            }
        } else {
            // Resetear el formulario si no hay lechón para editar
            setFormData({
                Name_Piglet: "",
                Fec_Birth: "",
                Weight_Initial: "",
                Sex_Piglet: "",
                race: "",
                stage: "",
                corral: "",
                Placa_Sena: "",
            })
            setWeighingRecords([])
            setOriginalWeightInitial(null)
        }
    }, [pigletToEdit])

    // Función para cargar los registros de pesaje de un lechón
    const fetchWeighingRecords = async (pigletId) => {
        try {
            setIsLoadingWeighings(true)
            const response = await axiosInstance.get(`/api/Weighing/GetWeighingsByPiglet?id_Piglet=${pigletId}`)
            if (response.status === 200) {
                console.log("Registros de pesaje:", response.data)
                setWeighingRecords(response.data || [])
            }
        } catch (error) {
            if (error.response?.status === 404) {
                // Es normal si no hay registros
                console.log("No hay registros de pesaje para este lechón")
                setWeighingRecords([])
            } else {
                console.error("Error al obtener registros de pesaje:", error)
            }
        } finally {
            setIsLoadingWeighings(false)
        }
    }

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Función para mostrar un diálogo de confirmación personalizado
    const showConfirmDialog = (message) => {
        return new Promise((resolve) => {
            if (showAlert) {
                // Guardamos la función de cierre actual
                const originalOnClose = closeAlert

                // Creamos dos nuevas funciones de cierre para manejar "Sí" y "No"
                const handleYes = () => {
                    resolve(true)
                    showAlert("", "", null) // Cerramos el diálogo
                }

                const handleNo = () => {
                    resolve(false)
                    showAlert("", "", null) // Cerramos el diálogo
                }

                // Mostramos un diálogo personalizado con botones Sí/No
                // Esto requeriría modificar el componente AlertModal para soportar múltiples botones
                // Por ahora, usamos el confirm nativo
                resolve(confirm(message))
            } else {
                resolve(confirm(message))
            }
        })
    }

    // Manejador del envío del formulario
    async function handlerSubmit(event) {
        event.preventDefault()

        const Name_Piglet = formData.Name_Piglet.trim()
        const Fec_Birth = formData.Fec_Birth
        const Weight_Initial = Number.parseFloat(formData.Weight_Initial)
        const Sex_Piglet = formData.Sex_Piglet
        const raceId = formData.race
        const stageId = formData.stage
        const corralId = formData.corral
        const Placa_Sena = formData.Placa_Sena

        // Validación de campos vacíos
        if (
            !Name_Piglet ||
            !Fec_Birth ||
            !Weight_Initial ||
            !Sex_Piglet ||
            !raceId ||
            !stageId ||
            !corralId ||
            !Placa_Sena
        ) {
            if (showAlert) {
                showAlert("Todos los campos son requeridos.", "error")
            }
            return
        }

        // Crear el objeto con los nombres exactos que espera el backend
        const body = {
            Name_Piglet,
            Fec_Birth,
            Weight_Initial,
            Sex_Piglet,
            Id_Race: Number.parseInt(raceId, 10),
            Id_Stage: Number.parseInt(stageId, 10),
            Id_Corral: Number.parseInt(corralId, 10),
            Placa_Sena,
        }

        // Si estamos editando, añadir el ID del lechón
        if (isEditing) {
            body.Id_Piglet = pigletToEdit.id_Piglet

            // Si el peso inicial cambió y hay registros de pesaje, preguntar si desea recalcular
            if (originalWeightInitial !== Weight_Initial && weighingRecords.length > 0) {
                const shouldRecalculate = await showConfirmDialog(
                    "Has cambiado el peso inicial y este lechón tiene registros de pesaje. " +
                    "¿Deseas recalcular el peso acumulado y las ganancias de peso basadas en el nuevo peso inicial?",
                )

                if (shouldRecalculate) {
                    try {
                        setLoading(true)
                        // Primero actualizar el lechón
                        const response = await SendData(body, isEditing)

                        // Luego recalcular los pesos
                        await axiosInstance.post(
                            `/api/Weighing/RecalculatePigletWeight?id_Piglet=${pigletToEdit.id_Piglet}&newInitialWeight=${Weight_Initial}`,
                        )

                        if (showAlert) {
                            showAlert("Lechón actualizado y pesos recalculados correctamente.", "success")
                        }
                        handleReset()
                        return
                    } catch (error) {
                        console.error("Error al actualizar y recalcular:", error)
                        if (showAlert) {
                            showAlert("Ocurrió un error al actualizar el lechón y recalcular los pesos.", "error")
                        }
                        setLoading(false)
                        return
                    }
                }
            }

            // Si no se recalcula, mantener el peso acumulado actual
            body.Acum_Weight = pigletToEdit.acum_Weight
        } else {
            // Para nuevos registros, el peso acumulado inicial es igual al peso inicial
            body.Acum_Weight = Weight_Initial
        }

        try {
            setLoading(true)
            const response = await SendData(body, isEditing)

            if (showAlert) {
                showAlert(response.data.message || (isEditing ? "Actualización exitosa" : "Registro exitoso"), "success")
            }

            // Resetear el formulario
            handleReset()
        } catch (error) {
            console.error("Error completo:", error)
            const errorMessage = error.response?.data || "Error desconocido"

            if (showAlert) {
                showAlert(
                    `Ocurrió un error al ${isEditing ? "actualizar" : "registrar"} el lechón: ` + JSON.stringify(errorMessage),
                    "error",
                )
            }
        } finally {
            setLoading(false)
        }
    }

    // Función para resetear el formulario y cerrar el modal
    const handleReset = () => {
        // Resetear el formulario
        setFormData({
            Name_Piglet: "",
            Fec_Birth: "",
            Weight_Initial: "",
            Sex_Piglet: "",
            race: "",
            stage: "",
            corral: "",
            Placa_Sena: "",
        })

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
                    <h1 className={styles.title}>{isEditing ? "Actualizar Lechón" : "Registrar Lechón"}</h1>

                    {/* Selección de Raza */}
                    <div className={styles.input_box}>
                        <select id="race" name="race" className={styles.select} value={formData.race} onChange={handleChange}>
                            <option value="">Selecciona una raza</option>
                            {races.map((race) => (
                                <option key={race.id_Race} value={race.id_Race}>
                                    {race.nam_Race}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selección de Etapa */}
                    <div className={styles.input_box}>
                        <select id="stage" name="stage" className={styles.select} value={formData.stage} onChange={handleChange}>
                            <option value="">Selecciona una etapa</option>
                            {stages.map((stage) => (
                                <option key={stage.id_Stage} value={stage.id_Stage}>
                                    {stage.name_Stage}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selección de Corral */}
                    <div className={styles.input_box}>
                        <select id="corral" name="corral" className={styles.select} value={formData.corral} onChange={handleChange}>
                            <option value="">Selecciona un corral</option>
                            {corrals.map((corral) => (
                                <option key={corral.id_Corral} value={corral.id_Corral}>
                                    {corral.des_Corral || `Corral ${corral.id_Corral}`}
                                </option>
                            ))}
                        </select>
                        <FaWarehouse className={styles.icon} />
                    </div>

                    {/* Nombre del lechón */}
                    <div className={styles.input_box}>
                        <input
                            type="text"
                            id="Name_Piglet"
                            name="Name_Piglet"
                            placeholder="Nombre del lechón"
                            value={formData.Name_Piglet}
                            onChange={handleChange}
                        />
                        <FaPiggyBank className={styles.icon} />
                    </div>

                    {/* Placa SENA */}
                    <div className={styles.input_box}>
                        <input
                            type="text"
                            id="Placa_Sena"
                            name="Placa_Sena"
                            placeholder="Placa SENA"
                            value={formData.Placa_Sena}
                            onChange={handleChange}
                        />
                        <FaIdCard className={styles.icon} />
                    </div>

                    {/* Fecha de nacimiento */}
                    <div className={styles.input_box}>
                        <input
                            type={showDate ? "date" : "text"}
                            id="Fec_Birth"
                            name="Fec_Birth"
                            placeholder="Fecha de nacimiento"
                            value={formData.Fec_Birth}
                            onFocus={() => setShowDate(true)}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Peso inicial */}
                    <div className={styles.input_box}>
                        <input
                            type="number"
                            id="Weight_Initial"
                            name="Weight_Initial"
                            placeholder="Peso inicial (kg)"
                            step="0.01"
                            value={formData.Weight_Initial}
                            onChange={handleChange}
                        />
                        <FaWeightHanging className={styles.icon} />
                        {isEditing && weighingRecords.length > 0 && formData.Weight_Initial !== originalWeightInitial && (
                            <div className="text-xs text-orange-500 mt-1">
                                Cambiar el peso inicial afectará los cálculos de ganancia de peso.
                            </div>
                        )}
                    </div>

                    {/* Sexo del lechón */}
                    <div className={styles.input_box}>
                        <select
                            id="Sex_Piglet"
                            name="Sex_Piglet"
                            className={styles.select}
                            value={formData.Sex_Piglet}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el sexo</option>
                            <option value="Macho">Macho</option>
                            <option value="Hembra">Hembra</option>
                        </select>
                        <FaVenusMars className={styles.icon} />
                    </div>

                    {/* Mostrar registros de pesaje si estamos editando */}
                    {isEditing && (
                        <div className="mb-4 border-t pt-2">
                            <h3 className="text-sm font-semibold mb-2">Registros de Pesaje</h3>
                            {isLoadingWeighings ? (
                                <p className="text-xs text-gray-500">Cargando registros...</p>
                            ) : weighingRecords.length > 0 ? (
                                <div className="text-xs max-h-32 overflow-y-auto">
                                    {weighingRecords.map((record) => (
                                        <div key={record.id_Weighings} className="mb-1 pb-1 border-b border-gray-100">
                                            <span className="font-medium">{new Date(record.fec_Weight).toLocaleDateString()}</span>: Peso:{" "}
                                            {record.weight_Current} kg, Ganancia: {record.weight_Gain} kg
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500">No hay registros de pesaje para este lechón.</p>
                            )}
                        </div>
                    )}

                    {/* Botones */}
                    <Button type="submit" disabled={loading} className={styles.button || ""}>
                        {loading ? (isEditing ? "Actualizando..." : "Registrando...") : isEditing ? "Actualizar" : "Registrar"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default RegisterPigletPage

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosInstance from "@/lib/axiosInstance"
import {
    FaWeightHanging,
    FaCalendarAlt,
    FaUser,
    FaPiggyBank,
    FaCalculator,
    FaInfoCircle,
    FaExclamationTriangle,
} from "react-icons/fa"

async function SendData(body, isEditing = false) {
    if (isEditing) {
        return await axiosInstance.put("/api/Weighing/UpdateWeighing", body)
    } else {
        return await axiosInstance.post("/api/Weighing/CreateWeighing", body)
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
    const [pigletWeighings, setPigletWeighings] = useState([])
    const [weightValidation, setWeightValidation] = useState(null)

    const isEditing = !!weighingToEdit

    useEffect(() => {
        if (weighingToEdit) {
            const formatDate = (dateString) => {
                if (!dateString) return ""
                const date = new Date(dateString)
                return date.toISOString().split("T")[0]
            }

            setWeightCurrent(weighingToEdit.weight_Current || "")
            setWeightGain(weighingToEdit.weight_Gain || "")
            setFechaPesaje(formatDate(weighingToEdit.fec_Weight))
            setIdUsuario(weighingToEdit.id_Users?.toString() || "")

            if (weighingToEdit.id_Piglet && piglets.length > 0) {
                const piglet = piglets.find((p) => p.id_Piglet == weighingToEdit.id_Piglet)
                if (piglet) {
                    setSelectedPiglet(piglet)
                    loadPigletWeighings(weighingToEdit.id_Piglet)
                }
            }
        } else {
            setWeightCurrent("")
            setWeightGain("")
            setFechaPesaje("")
            setIdUsuario("")
            setSelectedPiglet(null)
            setPigletWeighings([])
            setWeightValidation(null)
        }
    }, [weighingToEdit, piglets])

    useEffect(() => {
        async function fetchData() {
            try {
                const pigletResponse = await axiosInstance.get("/api/Piglet/ConsultAllPiglets")
                setPiglets(pigletResponse.data)

                const userResponse = await axiosInstance.get("/api/User/ConsultAllUser")
                setUsers(userResponse.data)
            } catch (error) {
                console.error("Error al cargar datos: ", error)
                if (showAlert) showAlert("Error al cargar los datos necesarios", "error")
            }
        }
        fetchData()
    }, [showAlert])

    const loadPigletWeighings = async (pigletId) => {
        try {
            const response = await axiosInstance.get(`/api/Weighing/GetWeighingsByPiglet?id_Piglet=${pigletId}`)
            setPigletWeighings(response.data || [])
        } catch (error) {
            console.error("Error al cargar pesajes del lechón:", error)
            setPigletWeighings([])
        }
    }

    const validateWeight = (currentWeight, piglet, weighings) => {
        if (!currentWeight || !piglet) {
            setWeightValidation(null)
            return
        }

        const weightNum = Number.parseFloat(currentWeight)
        const lastWeight = weighings.length > 0 ? weighings[weighings.length - 1].weight_Current : piglet.weight_Initial

        const expectedGain = weightNum - lastWeight
        const isWeightLoss = expectedGain < 0
        const isSignificantGain = expectedGain > 5 // Más de 5kg de ganancia
        const isVeryLowGain = expectedGain < 0.1 && expectedGain > 0 // Menos de 100g de ganancia

        let validation = {
            isValid: true,
            type: "success",
            message: `Ganancia normal: +${expectedGain.toFixed(2)} kg`,
        }

        if (isWeightLoss) {
            validation = {
                isValid: false,
                type: "error",
                message: `⚠️ Pérdida de peso detectada: ${expectedGain.toFixed(2)} kg. Verifica el peso ingresado.`,
            }
        } else if (isSignificantGain) {
            validation = {
                isValid: false,
                type: "warning",
                message: `⚠️ Ganancia muy alta: +${expectedGain.toFixed(2)} kg. Verifica el peso ingresado.`,
            }
        } else if (isVeryLowGain) {
            validation = {
                isValid: true,
                type: "info",
                message: `ℹ️ Ganancia muy baja: +${expectedGain.toFixed(2)} kg. Esto es normal en algunos casos.`,
            }
        }

        setWeightValidation(validation)
    }

    const handlePigletChange = async (e) => {
        const pigletId = e.target.value
        if (!pigletId) {
            setSelectedPiglet(null)
            setWeightGain("")
            setPigletWeighings([])
            setWeightValidation(null)
            return
        }

        const piglet = piglets.find((p) => p.id_Piglet == pigletId)
        setSelectedPiglet(piglet)

        // Cargar pesajes del lechón
        await loadPigletWeighings(pigletId)

        if (weightCurrent) {
            calculateWeightGain(weightCurrent, piglet)
        }
    }

    const handleWeightCurrentChange = (e) => {
        const newWeightCurrent = e.target.value
        setWeightCurrent(newWeightCurrent)

        if (selectedPiglet && newWeightCurrent) {
            calculateWeightGain(newWeightCurrent, selectedPiglet)
            validateWeight(newWeightCurrent, selectedPiglet, pigletWeighings)
        } else {
            setWeightGain("")
            setWeightValidation(null)
        }
    }

    const calculateWeightGain = (currentWeight, piglet) => {
        if (!piglet || !currentWeight) return

        setIsCalculating(true)

        const weightCurrentNum = Number.parseFloat(currentWeight)

        // Usar el último pesaje si existe, sino el peso inicial
        const lastWeight =
            pigletWeighings.length > 0 ? pigletWeighings[pigletWeighings.length - 1].weight_Current : piglet.weight_Initial

        const gain = weightCurrentNum - lastWeight
        setWeightGain(gain.toFixed(2))
        setIsCalculating(false)
    }

    async function handlerSubmit(event) {
        event.preventDefault()
        setLoading(true)

        if (!weightCurrent || !fechaPesaje || !selectedPiglet || !idUsuario) {
            showAlert?.("Todos los campos son requeridos.", "error")
            setLoading(false)
            return
        }

        if (isNaN(Number.parseFloat(weightCurrent))) {
            showAlert?.("El peso actual debe ser un valor válido.", "error")
            setLoading(false)
            return
        }

        // Validar peso si hay problemas detectados
        if (weightValidation && !weightValidation.isValid && weightValidation.type === "error") {
            const confirmProceed = window.confirm(
                `${weightValidation.message}\n\n¿Estás seguro de que deseas continuar con este peso?`,
            )
            if (!confirmProceed) {
                setLoading(false)
                return
            }
        }

        const body = {
            weight_Current: Number.parseFloat(weightCurrent),
            fec_Weight: fechaPesaje,
            id_Piglet: Number.parseInt(selectedPiglet.id_Piglet),
            id_Users: Number.parseInt(idUsuario),
        }

        // No enviamos weight_Gain porque se calcula automáticamente en el backend
        if (isEditing) {
            body.id_Weighings = weighingToEdit.id_Weighing || weighingToEdit.id_Weighings
        }

        try {
            const response = await SendData(body, isEditing)
            const successMessage =
                response.data?.message || (isEditing ? "Pesaje actualizado exitosamente." : "Pesaje registrado exitosamente.")

            showAlert?.(successMessage, "success")
            handleReset()
        } catch (error) {
            console.error(error)
            const errorMessage =
                error.response?.data?.message || `Ocurrió un error al ${isEditing ? "actualizar" : "registrar"} el pesaje.`
            showAlert?.(errorMessage, "error")
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setWeightCurrent("")
        setWeightGain("")
        setFechaPesaje("")
        setIdUsuario("")
        setSelectedPiglet(null)
        setPigletWeighings([])
        setWeightValidation(null)

        closeModal?.()
        refreshData?.()
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {isEditing ? "Actualizar Pesaje" : "Registrar Pesaje"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlerSubmit} className="space-y-6">
                        {/* Animal */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                <FaPiggyBank className="inline mr-2" />
                                Animal *
                            </label>
                            <select
                                id="Id_Piglet"
                                name="Id_Piglet"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={handlePigletChange}
                                value={selectedPiglet?.id_Piglet || ""}
                                disabled={isEditing} // No permitir cambiar el lechón al editar
                                required
                            >
                                <option value="">Selecciona un animal</option>
                                {piglets.map((piglet) => (
                                    <option key={piglet.id_Piglet} value={piglet.id_Piglet}>
                                        {piglet.name_Piglet}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Info del lechón */}
                        {selectedPiglet && (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                        <FaInfoCircle className="mr-2" />
                                        Información del Lechón
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <p>
                                            <strong>Peso inicial:</strong> {selectedPiglet.weight_Initial} kg
                                        </p>
                                        <p>
                                            <strong>Peso acumulado:</strong> {selectedPiglet.acum_Weight} kg
                                        </p>
                                        <p>
                                            <strong>Etapa actual:</strong> {selectedPiglet.name_Stage}
                                        </p>
                                        <p>
                                            <strong>Total pesajes:</strong> {pigletWeighings.length}
                                        </p>
                                    </div>
                                </div>

                                {pigletWeighings.length > 0 && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h5 className="font-semibold text-blue-700 mb-2">Último Pesaje</h5>
                                        <div className="text-sm text-blue-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p>
                                                <strong>Peso:</strong> {pigletWeighings[pigletWeighings.length - 1].weight_Current} kg
                                            </p>
                                            <p>
                                                <strong>Fecha:</strong>{" "}
                                                {new Date(pigletWeighings[pigletWeighings.length - 1].fec_Weight).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-sm text-green-700 flex items-start">
                                        <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
                                        <strong>Nota:</strong> La ganancia se calcula automáticamente basada en el{" "}
                                        {pigletWeighings.length > 0 ? "último pesaje" : "peso inicial"}.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Peso actual */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                <FaWeightHanging className="inline mr-2" />
                                Peso Actual (kg) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="Weight_Current"
                                name="Weight_Current"
                                placeholder="Ingresa el peso actual en kg"
                                value={weightCurrent}
                                onChange={handleWeightCurrentChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Validación de peso */}
                        {weightValidation && (
                            <div
                                className={`p-3 rounded-md text-sm ${weightValidation.type === "error"
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : weightValidation.type === "warning"
                                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                            : weightValidation.type === "info"
                                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : "bg-green-50 text-green-700 border border-green-200"
                                    }`}
                            >
                                <div className="flex items-start">
                                    {weightValidation.type === "error" && <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />}
                                    {weightValidation.type === "warning" && (
                                        <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                                    )}
                                    {weightValidation.type === "info" && <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />}
                                    {weightValidation.type === "success" && <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />}
                                    <span>{weightValidation.message}</span>
                                </div>
                            </div>
                        )}

                        {/* Ganancia de peso */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                <FaCalculator className="inline mr-2" />
                                Ganancia de Peso (kg)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="Weight_Gain"
                                name="Weight_Gain"
                                placeholder="Se calcula automáticamente"
                                value={weightGain}
                                readOnly
                                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                            />
                            {isCalculating && <span className="text-xs text-gray-500">Calculando...</span>}
                        </div>

                        {/* Fecha */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                <FaCalendarAlt className="inline mr-2" />
                                Fecha de Pesaje *
                            </label>
                            <input
                                type="date"
                                id="Fec_Weight"
                                name="Fec_Weight"
                                value={fechaPesaje}
                                onChange={(e) => setFechaPesaje(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Usuario */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                <FaUser className="inline mr-2" />
                                Usuario *
                            </label>
                            <select
                                id="Id_Users"
                                name="Id_Users"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={idUsuario}
                                onChange={(e) => setIdUsuario(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un usuario</option>
                                {users.map((user) => (
                                    <option key={user.id_Users} value={user.id_Users}>
                                        {user.nom_Users}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Información adicional */}
                        {!isEditing && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">🎯 Sistema Automático</h4>
                                <ul className="text-green-700 space-y-1 text-sm">
                                    <li>• La ganancia de peso se calcula automáticamente</li>
                                    <li>• Se actualizará el peso acumulado del lechón</li>
                                    <li>• Se verificará automáticamente si debe cambiar de etapa</li>
                                    <li>• Se actualizarán las estadísticas del corral</li>
                                </ul>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            {isEditing && (
                                <Button
                                    type="button"
                                    onClick={onCancelEdit}
                                    variant="outline"
                                    disabled={loading}
                                    className="w-full sm:w-auto"
                                >
                                    Cancelar
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={loading || !selectedPiglet || !weightCurrent || !fechaPesaje || !idUsuario}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? (isEditing ? "Actualizando..." : "Registrando...") : isEditing ? "Actualizar" : "Registrar"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterWeighingPage

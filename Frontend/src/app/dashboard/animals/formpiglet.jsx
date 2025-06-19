"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axiosInstance"
import { FaInfoCircle, FaClock, FaWeight, FaExclamationTriangle } from "react-icons/fa"

function RegisterPiglet({ refreshData, pigletToEdit, onCancelEdit, closeModal, showAlert }) {
    const [formData, setFormData] = useState({
        name_Piglet: "",
        weight_Initial: "",
        fec_Birth: "",
        sex_Piglet: "",
        placa_Sena: "",
        id_Race: "",
        id_Corral: "",
        id_Stage: "",
    })

    const [races, setRaces] = useState([])
    const [corrals, setCorrals] = useState([])
    const [stages, setStages] = useState([])
    const [stageDefinitions, setStageDefinitions] = useState({})
    const [loading, setLoading] = useState(false)
    const [stageValidation, setStageValidation] = useState(null)

    useEffect(() => {
        fetchRaces()
        fetchCorrals()
        fetchStages()
        fetchStageDefinitions()
    }, [])

    useEffect(() => {
        if (pigletToEdit) {
            setFormData({
                id_Piglet: pigletToEdit.id_Piglet || pigletToEdit.Id_Piglet,
                name_Piglet: pigletToEdit.name_Piglet || pigletToEdit.Name_Piglet || "",
                weight_Initial: pigletToEdit.weight_Initial || pigletToEdit.Weight_Initial || "",
                fec_Birth: pigletToEdit.fec_Birth
                    ? new Date(pigletToEdit.fec_Birth).toISOString().split("T")[0]
                    : pigletToEdit.Fec_Birth
                        ? new Date(pigletToEdit.Fec_Birth).toISOString().split("T")[0]
                        : "",
                sex_Piglet: pigletToEdit.sex_Piglet || pigletToEdit.Sex_Piglet || "",
                placa_Sena: pigletToEdit.placa_Sena || pigletToEdit.Placa_Sena || "",
                id_Race: pigletToEdit.id_Race || pigletToEdit.Id_Race || "",
                id_Corral: pigletToEdit.id_Corral || pigletToEdit.Id_Corral || "",
                id_Stage: pigletToEdit.id_Stage || pigletToEdit.Id_Stage || "",
            })
        }
    }, [pigletToEdit])

    // Validar etapa cuando cambie el peso o la etapa seleccionada
    useEffect(() => {
        if (formData.weight_Initial && formData.id_Stage) {
            validateStageSelection()
        }
    }, [formData.weight_Initial, formData.id_Stage, stageDefinitions, stages])

    const validateStageSelection = () => {
        const weight = Number.parseFloat(formData.weight_Initial)
        if (!weight || !formData.id_Stage || !stages.length) {
            setStageValidation(null)
            return
        }

        const selectedStage = stages.find((s) => s.id_Stage == formData.id_Stage)
        if (!selectedStage) {
            setStageValidation(null)
            return
        }

        const stageKey = getStageKeyFromName(selectedStage.name_Stage)
        if (!stageKey || !stageDefinitions[stageKey]) {
            setStageValidation(null)
            return
        }

        const stageDef = stageDefinitions[stageKey]
        const isWeightInRange = weight >= stageDef.WeightMin && weight <= stageDef.WeightMax
        const suggestedStage = getSuggestedStageByWeight(weight)

        setStageValidation({
            isValid: isWeightInRange,
            currentStage: selectedStage.name_Stage,
            suggestedStage: suggestedStage?.name_Stage,
            weightRange: `${stageDef.WeightMin} - ${stageDef.WeightMax} kg`,
            message: isWeightInRange
                ? "El peso está dentro del rango para esta etapa"
                : `El peso ${weight} kg no está en el rango de ${selectedStage.name_Stage} (${stageDef.WeightMin} - ${stageDef.WeightMax} kg)`,
        })
    }

    const fetchStageDefinitions = async () => {
        try {
            const response = await axiosInstance.get("/api/Piglet/GetStageDefinitions")
            setStageDefinitions(response.data)
        } catch (error) {
            console.error("Error al cargar definiciones de etapas:", error)
        }
    }

    const fetchRaces = async () => {
        try {
            const response = await axiosInstance.get("/api/Race/ConsultAllRaces")
            setRaces(response.data)
        } catch (error) {
            console.error("Error al cargar razas:", error)
        }
    }

    const fetchCorrals = async () => {
        try {
            const response = await axiosInstance.get("/api/Corral/ConsultAllCorrals")
            setCorrals(response.data)
        } catch (error) {
            console.error("Error al cargar corrales:", error)
        }
    }

    const fetchStages = async () => {
        try {
            const response = await axiosInstance.get("/api/Stage/ConsultAllStages")
            setStages(response.data)
        } catch (error) {
            console.error("Error al cargar etapas:", error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Validar que el peso esté en el rango correcto para la etapa seleccionada
        if (stageValidation && !stageValidation.isValid && !pigletToEdit) {
            const confirmProceed = window.confirm(
                `${stageValidation.message}. ¿Deseas continuar de todos modos? Se recomienda seleccionar la etapa ${stageValidation.suggestedStage}.`,
            )
            if (!confirmProceed) {
                setLoading(false)
                return
            }
        }

        const body = {
            ...formData,
            weight_Initial: Number.parseFloat(formData.weight_Initial),
        }

        try {
            if (pigletToEdit) {
                await axiosInstance.put("/api/Piglet/UpdatePiglet", body)
                showAlert("Lechón actualizado correctamente. La etapa ha sido verificada automáticamente.", "success")
            } else {
                await axiosInstance.post("/api/Piglet/CreatePiglet", body)
                showAlert(
                    "Lechón registrado correctamente. El conteo de días para esta etapa inicia ahora y se verificará automáticamente.",
                    "success",
                )
            }

            setFormData({
                name_Piglet: "",
                weight_Initial: "",
                fec_Birth: "",
                sex_Piglet: "",
                placa_Sena: "",
                id_Race: "",
                id_Corral: "",
                id_Stage: "",
            })

            refreshData()
            closeModal()
        } catch (error) {
            console.error("Error al procesar lechón:", error)
            const errorMessage = error.response?.data?.message || "Error al procesar el lechón"
            showAlert(errorMessage, "error")
        } finally {
            setLoading(false)
        }
    }

    const getSelectedStageInfo = () => {
        if (!formData.id_Stage || !stages.length) return null
        const selectedStage = stages.find((stage) => stage.id_Stage == formData.id_Stage)
        if (!selectedStage) return null
        const stageKey = getStageKeyFromName(selectedStage.name_Stage)
        if (stageKey && stageDefinitions[stageKey]) {
            return {
                ...selectedStage,
                definition: stageDefinitions[stageKey],
            }
        }
        return selectedStage
    }

    const getStageKeyFromName = (stageName) => {
        if (!stageName) return null
        const upperName = stageName.toUpperCase()
        if (upperName.includes("PRE") && upperName.includes("INICIACION")) return "PRE_INICIACION"
        if (upperName.includes("INICIACION") && !upperName.includes("PRE")) return "INICIACION"
        if (upperName.includes("LEVANTE")) return "LEVANTE"
        if (upperName.includes("ENGORDE")) return "ENGORDE"
        return null
    }

    const getSuggestedStageByWeight = (weight) => {
        if (!weight || !stages.length) return null
        const weightNum = Number.parseFloat(weight)
        if (weightNum >= 6.5 && weightNum < 17.5) return stages.find((s) => s.name_Stage.toUpperCase().includes("PRE"))
        if (weightNum >= 17.5 && weightNum < 30)
            return stages.find(
                (s) => s.name_Stage.toUpperCase().includes("INICIACION") && !s.name_Stage.toUpperCase().includes("PRE"),
            )
        if (weightNum >= 30 && weightNum < 60) return stages.find((s) => s.name_Stage.toUpperCase().includes("LEVANTE"))
        if (weightNum >= 60) return stages.find((s) => s.name_Stage.toUpperCase().includes("ENGORDE"))
        return null
    }

    const selectedStageInfo = getSelectedStageInfo()
    const suggestedStage = getSuggestedStageByWeight(formData.weight_Initial)

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {pigletToEdit ? "Editar Lechón" : "Registrar Nuevo Lechón"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Columna izquierda */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Información Básica</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Lechón *</label>
                            <input
                                type="text"
                                name="name_Piglet"
                                value={formData.name_Piglet}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Peso Actual (kg) *</label>
                            <input
                                type="number"
                                step="0.1"
                                name="weight_Initial"
                                value={formData.weight_Initial}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {suggestedStage && (
                                <p className="text-xs text-blue-600 mt-1 flex items-center">
                                    <FaInfoCircle className="mr-1" />
                                    Etapa sugerida por peso: {suggestedStage.name_Stage}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                            <input
                                type="date"
                                name="fec_Birth"
                                value={formData.fec_Birth}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                            <select
                                name="sex_Piglet"
                                value={formData.sex_Piglet}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar sexo</option>
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Placa SENA</label>
                            <input
                                type="text"
                                name="placa_Sena"
                                value={formData.placa_Sena}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Clasificación</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Raza *</label>
                            <select
                                name="id_Race"
                                value={formData.id_Race}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar raza</option>
                                {races.map((race) => (
                                    <option key={race.id_Race} value={race.id_Race}>
                                        {race.nam_Race}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Corral *</label>
                            <select
                                name="id_Corral"
                                value={formData.id_Corral}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar corral</option>
                                {corrals.map((corral) => (
                                    <option key={corral.id_Corral} value={corral.id_Corral}>
                                        {corral.des_Corral || `Corral ${corral.id_Corral}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Etapa Actual *
                                <span className="text-xs text-gray-500 ml-2">(El conteo de días iniciará desde el registro)</span>
                            </label>
                            <select
                                name="id_Stage"
                                value={formData.id_Stage}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar etapa actual</option>
                                {stages.map((stage) => (
                                    <option key={stage.id_Stage} value={stage.id_Stage}>
                                        {stage.name_Stage}
                                    </option>
                                ))}
                            </select>

                            {/* Validación de etapa */}
                            {stageValidation && (
                                <div
                                    className={`mt-2 p-2 rounded-md text-sm ${stageValidation.isValid
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                        }`}
                                >
                                    <div className="flex items-center">
                                        {stageValidation.isValid ? (
                                            <FaInfoCircle className="mr-2" />
                                        ) : (
                                            <FaExclamationTriangle className="mr-2" />
                                        )}
                                        <span>{stageValidation.message}</span>
                                    </div>
                                    {!stageValidation.isValid && stageValidation.suggestedStage && (
                                        <div className="mt-1 text-xs">Etapa recomendada: {stageValidation.suggestedStage}</div>
                                    )}
                                </div>
                            )}

                            {!pigletToEdit && formData.id_Stage && (
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <FaClock className="mr-1" />
                                    El conteo de días para esta etapa comenzará al registrar el lechón
                                </p>
                            )}
                        </div>

                        {selectedStageInfo && selectedStageInfo.definition && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                    <FaInfoCircle className="mr-2" />
                                    {selectedStageInfo.name_Stage}
                                </h4>
                                <div className="text-sm text-blue-600 space-y-1">
                                    <div className="flex items-center">
                                        <FaWeight className="mr-2" />
                                        <strong>Rango de peso:</strong> {selectedStageInfo.definition.WeightMin} -{" "}
                                        {selectedStageInfo.definition.WeightMax} kg
                                    </div>
                                    <div className="flex items-center">
                                        <FaClock className="mr-2" />
                                        <strong>Duración máxima:</strong> {selectedStageInfo.definition.MaxDays} días
                                    </div>
                                    {selectedStageInfo.definition.NextStage && (
                                        <div>
                                            <strong>Siguiente etapa:</strong> {selectedStageInfo.definition.NextStage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!pigletToEdit && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-semibold text-yellow-800 mb-2">📋 Información Importante</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• El lechón se registrará en la etapa que selecciones</li>
                            <li>• El conteo de días para esa etapa comenzará desde el momento del registro</li>
                            <li>• El sistema verificará automáticamente si debe cambiar de etapa por peso o días</li>
                            <li>• Se recomienda seleccionar la etapa apropiada según el peso actual</li>
                        </ul>
                    </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button type="button" onClick={onCancelEdit} variant="outline" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading ? "Procesando..." : pigletToEdit ? "Actualizar" : "Registrar"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterPiglet

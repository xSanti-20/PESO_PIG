"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Hexagon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; 


function FormHive({buttonForm, hive, onDataUpdated  }) {
  const router = useRouter();
  const [estado, setEstado] = useState("");
  const [descripcion, setDescripcion] = useState(""); // Nuevo campo Des_Hive
  const [Ncuadro, setNcuadro] = useState("");
  const [Nalza, setNalza] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [msSuccess, setMsSuccess] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [id_Hive, setIdHive] = useState(null);


  async function handlerSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    if (!estado || !descripcion || !Ncuadro || !Nalza) {
      setError("Por favor, complete todos los campos.");
      setSubmitting(false);
      return;
    }

    console.log("handler", buttonForm)
    console.log(hive)
    try {
        if (buttonForm == "Actualizar") {
            const updateHive = {
                id_Hive: id_Hive,
                des_Hive: descripcion,
                est_Hive: estado,
                numCua_Hive: Ncuadro,
                numAlz_Hive: Nalza,
            }
            console.log(updateHive);

            const response = await axiosInstance.put(`/Api/Hive/UpdateHive/${id_Hive}`, updateHive  )
            setDataHiveForUpdate();
            if (response.status === 200) {
                window.alert(response.data.message);
                setModalOpen(true);
                onDataUpdated(); // <<-- Aquí se notifica al padre
            }
        } else if (buttonForm === "Registrar") {
            const response = await axiosInstance.post("/Api/Hive/CreateHive", {
              id_Hive: id_Hive,
              des_Hive: descripcion,
              est_Hive: estado,
              numCua_Hive: Ncuadro,
              numAlz_Hive: Nalza
            });


            if (response.status === 200) {
                window.alert(response.data.registrado);
                setModalOpen(true);
                alert(response.data.registrado);
                // router.push("");
                onDataUpdated(); // <<-- Aquí se notifica al padre
            }
        }
    } catch (error) {
        console.log("Error:", error.response || error.message);
        // setModalMessage(error.response?.data?.message || "Error al conectar con el servidor.");
    }
    finally {
        setSubmitting(false);
    }
}


  const setDataHiveForUpdate = () => {
    setDescripcion(hive.des_Hive);
    setEstado(hive.est_Hive);
    setNcuadro(hive.numCua_Hive);
    setNalza(hive.numAlz_Hive);
    setIdHive(hive.id_Hive);

  }

  useEffect(() => {
    setDataHiveForUpdate()
  }, [hive]);

  return (
    <>
      <form
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
        onSubmit={handlerSubmit}
      >
        {/* Título */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#e87204] rounded-full flex items-center justify-center text-white">
              <Hexagon className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-bold text-gray-900">Colmena</h2>
              <p className="text-xs text-gray-500">Ingrese los datos de la colmena</p>
            </div>
          </div>
        </div>

        {/* Mensajes de error o éxito */}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {msSuccess && <p className="text-green-500 mb-4 text-sm">{msSuccess}</p>}

        <div className="space-y-4">
          {/* Descripción */}
          <div className="space-y-1">
            <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-[#e87204] text-sm"
              id="descripcion"
              placeholder="Ingrese una descripción (máximo 50 caracteres)"
              required
              maxLength={50}
              name="descripcion"
              value={descripcion || ""}
              onChange={(event) => setDescripcion(event.target.value)}
            />
          </div>

          {/* Estado y Número de cuadro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="estado" className="text-sm font-medium text-gray-700">
                Estado de la colmena
              </label>
              <select
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-[#e87204] text-sm"
                id="estado"
                required
                name="estado"
                value={estado || ""}
                onChange={(event) => setEstado(event.target.value)}
              >
                <option value="">Seleccione el estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="Ncuadro" className="text-sm font-medium text-gray-700">
                Número de cuadro
              </label>
              <input
                type="number"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-[#e87204] text-sm"
                id="Ncuadro"
                placeholder="Ingrese N° cuadros"
                required
                name="Ncuadro"
                value={Ncuadro || ""}
                onChange={(event) => setNcuadro(event.target.value)}
              />
            </div>
          </div>

          {/* Número de Alzas */}
          <div className="space-y-1">
            <label htmlFor="Nalza" className="text-sm font-medium text-gray-700">
              Número de Alzas
            </label>
            <input
              type="number"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-[#e87204] text-sm"
              id="Nalza"
              placeholder="Ingrese N° alzas"
              required
              name="Nalza"
              value={Nalza || ""}
              onChange={(event) => setNalza(event.target.value)}
            />
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end pt-3">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="bg-[#e87204] text-white px-6 py-2 text-sm rounded-lg hover:bg-[#030712] focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 transition-colors"
            >
              {isSubmitting ? "Guardando..." : buttonForm}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default FormHive;
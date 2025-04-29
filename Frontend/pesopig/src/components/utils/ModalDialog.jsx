"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "../ui/button"

function ModalDialog({ TitlePage, FormPage, isOpen, setIsOpen }) {
    // Si se proporcionan isOpen y setIsOpen como props, úsalos; de lo contrario, usa el estado local
    const [localIsOpen, setLocalIsOpen] = useState(false)

    const open = isOpen !== undefined ? isOpen : localIsOpen
    const setOpen = setIsOpen || setLocalIsOpen

    // Determinar si estamos en modo edición basado en las props del FormPage
    const isEditing = FormPage && FormPage().props && FormPage().props.pigletToEdit

    // Función para abrir el modal para crear un nuevo registro
    const handleOpenForCreate = () => {
        // Si hay una función para limpiar el estado de edición, llámala
        if (FormPage && FormPage().props && FormPage().props.onCancelEdit) {
            FormPage().props.onCancelEdit()
        }

        // Luego abre el modal
        setOpen(true)
    }

    return (
        <>
            <Button onClick={handleOpenForCreate}>Agregar {TitlePage}</Button>
            <Dialog
                open={open}
                onOpenChange={(newOpen) => {
                    setOpen(newOpen)
                    // Si se está cerrando el modal y hay una función para limpiar el estado de edición, llámala
                    if (!newOpen && FormPage && FormPage().props && FormPage().props.onCancelEdit) {
                        FormPage().props.onCancelEdit()
                    }
                }}
            >
                <DialogContent className="max-w-4xl w-[60vw] overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Actualizar" : "Agregar"} {TitlePage}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-x-auto py-2">{FormPage && FormPage()}</div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ModalDialog

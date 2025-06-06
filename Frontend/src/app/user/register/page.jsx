"use client"
import { useState } from "react"
import styles from "./page.module.css"
import axiosInstance from "@/lib/axiosInstance"
import PublicNav from "@/components/nav/PublicNav"
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"
import AlertModal from "@/components/AlertModal"

async function SendData(body) {
    const response = await axiosInstance.post("api/User/CreateUser", body)
    return response
}

function RegisterPage() {
    const [alertInfo, setAlertInfo] = useState({
        isOpen: false,
        message: "",
        type: "success",
    })

    const closeAlert = () => {
        setAlertInfo({
            ...alertInfo,
            isOpen: false,
        })
    }

    async function handlerSubmit(event) {
        event.preventDefault()

        const form = new FormData(event.currentTarget)
        const nom_Users = form.get("nom_Users")
        const email = form.get("email")
        const hashed_Password = form.get("hashed_Password")
        const confirm_Password = form.get("confirm_Password")

        // Verificar campos vacíos
        let emptyFields = false
        form.forEach((element) => {
            if (element === "") {
                emptyFields = true
            }
        })

        if (emptyFields) {
            setAlertInfo({
                isOpen: true,
                message: "Todos los campos son requeridos",
                type: "error",
            })
            return
        }

        // Verificar contraseñas
        if (hashed_Password !== confirm_Password) {
            setAlertInfo({
                isOpen: true,
                message: "La contraseña y la confirmación no coinciden",
                type: "error",
            })
            return
        }

        const body = {
            email: email,
            nom_Users: nom_Users,
            hashed_Password: hashed_Password,
            confirm_Password: confirm_Password,
        }

        try {
            const response = await SendData(body)
            console.log(response)
            setAlertInfo({
                isOpen: true,
                message: response.data.message || "¡Registro exitoso!",
                type: "success",
            })
        } catch (error) {
            console.log(error)

            let errorMessage = "Ha ocurrido un error durante el registro"

            if (error.response) {
                const { errors, status } = error.response.data

                if (status === 400) {
                    errorMessage = "Error en el formulario. Por favor revise los datos ingresados."
                }

                if (errors) {
                    errorMessage = Object.values(errors).flat().join(", ")
                }
            }

            setAlertInfo({
                isOpen: true,
                message: errorMessage,
                type: "error",
            })
        }
    }

    return (
        <>
            <PublicNav />
            <div className={styles.wrapper}>
                <div className={`col-md-6 ${styles.form_box} d-flex align-items-center justify-content-center`}>
                    <form className={styles.form} onSubmit={handlerSubmit}>
                        <h1 className={styles.title}>Registrarse</h1>
                        <div className={styles.input_box}>
                            <input type="text" id="nom_Users" name="nom_Users" placeholder="Usuario" />
                            <FaUser className={styles.icon} />
                        </div>
                        <div className={styles.input_box}>
                            <input type="email" id="email" name="email" placeholder="Correo" />
                            <FaEnvelope className={styles.icon} />
                        </div>
                        <div className={styles.input_box}>
                            <input type="password" id="hashed_Password" name="hashed_Password" placeholder="Contraseña" />
                            <FaLock className={styles.icon} />
                        </div>
                        <div className={styles.input_box}>
                            <input type="password" id="confirm_Password" name="confirm_Password" placeholder="Confirmar Contraseña" />
                            <FaLock className={styles.icon} />
                        </div>
                        <button type="submit" className={styles.button}>
                            Registrarse
                        </button>
                        <div className={styles.login_link}>
                            <p>
                                Ya tiene una Cuenta? <a href="/user/login">Ingresar</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <AlertModal
                isOpen={alertInfo.isOpen}
                message={alertInfo.message}
                type={alertInfo.type}
                onClose={closeAlert}
                redirectUrl={alertInfo.type === "success" ? "/user/login" : undefined}
            />
        </>
    )
}

export default RegisterPage

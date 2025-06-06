"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import PublicNav from "@/components/nav/PublicNav";
import axiosInstance from "@/lib/axiosInstance";
import styles from "./Page.Module.css";

import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from "@/components/ui/toast";

async function Login(credentials) {
    try {
        const response = await axiosInstance.post("/api/User/Login", credentials);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Error al iniciar sesión.");
        } else {
            throw new Error("No se pudo conectar con el servidor.");
        }
    }
}

function LoginPage() {
    const router = useRouter();
    const [toast, setToast] = useState(null);

    function showToast(title, description, type) {
        setToast({ title, description, type });
        setTimeout(() => setToast(null), 3000);
    }
    async function handlerSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        // resto del código...
    }


    async function handlerSubmit(event) {
        event.preventDefault();
        const formlogin = new FormData(event.currentTarget);
        const email = formlogin.get("email");
        const password = formlogin.get("Hashed_Password");

        const credentials = { email, password };

        try {
            const data = await Login(credentials);
            showToast("Inicio de sesión exitoso", "Redirigiendo al dashboard...", "success");

            // ✅ Guardamos los datos en localStorage
            // localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);

            setTimeout(() => router.push("/dashboard"), 2000);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }

    return (
        <ToastProvider>
            <PublicNav />
            <div className="wrapper">
                {toast && (
                    <Toast className={`flex items-center gap-4 p-3 ${toast.type === "error" ? "bg-red-500 text-black" : "bg-green-500 text-black"}`}>
                        <img src="/assets/img/pesopig.png" alt="Peso Pig" className="w-8 h-8" />
                        <div className="flex flex-col items-center text-center w-full">
                            <ToastTitle className="text-sm font-semibold">{toast.title}</ToastTitle>
                            <ToastDescription className="text-xs">{toast.description}</ToastDescription>
                        </div>
                    </Toast>
                )}

                <div className="form_box">
                    <form onSubmit={handlerSubmit}>
                        <img src="/assets/img/pesopig.png" alt="PesoPig" width="65" height="60" />
                        <h1 className="title">Iniciar Sesión</h1>
                        <div className="input_box">
                            <input type="email" id="email" name="email" placeholder="Correo" required />
                            <FaUser className="icon" />
                        </div>
                        <div className="input_box">
                            <input type="password" id="Hashed_Password" name="Hashed_Password" placeholder="Contraseña" required />
                            <FaLock className="icon" />
                        </div>
                        <button type="submit">Ingresar</button>
                        <div className="remember_forgot">
                            <a href="/user/password">¿Olvidó su Contraseña?</a>
                        </div>
                        <div className="register_link">
                            <p>
                                ¿No tiene una Cuenta? <a href="/user/register">Regístrese</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <ToastViewport />
        </ToastProvider>
    );
}

export default LoginPage;

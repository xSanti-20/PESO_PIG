"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isTokenValid, setIsTokenValid] = useState(null); // Estado para verificar el token
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        console.log("Token capturado:", token); // Verifica el token en consola
        if (!token) {
            setError("Token inválido");
            setTimeout(() => router.push("/user/login"), 3000);
            return;
        }

        // Validar el token en el backend
        async function validateToken() {
            try {
                const response = await axiosInstance.post("/api/User/validatepass", { Token: token });
                if (response.data.message === "Token valido") {
                    setIsTokenValid(true);
                } else {
                    setError("Token invalido o expirado");
                    setTimeout(() => router.push("/user/login"), 3000);
                }
            } catch (error) {
                setError("Token invalido o expirado");
                setTimeout(() => router.push("/user/login"), 3000);
            }
        }

        validateToken();
    }, [token, router]);

    async function handleSubmit(event) {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            await axiosInstance.post("/api/User/ResetPasswordConfirm", { token, newPassword: password });
            setSuccess("Contraseña actualizada correctamente. Redirigiendo...");
            setTimeout(() => router.push("/user/login"), 3000);
        } catch (error) {
            setError(error.response?.data?.message || "Error al actualizar la contraseña");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Restablecer Contraseña</h2>
                {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-2 text-center">{success}</p>}

                {isTokenValid === null ? (
                    <p className="text-center text-gray-500">Validando token...</p>
                ) : isTokenValid ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Nueva Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Confirmar Contraseña</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Actualizar Contraseña
                        </button>
                    </form>
                ) : (
                    <p className="text-red-500 text-center">Token inválido o expirado.</p>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;

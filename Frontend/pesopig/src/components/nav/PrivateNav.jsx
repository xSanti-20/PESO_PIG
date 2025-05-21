"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, User, LogOut } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

function NavPrivada({ children, title }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const router = useRouter()

    const menuItems = [
        { title: "Home", path: "/dashboard", icon: "📍" },
        { title: "Animales", path: "/dashboard/animals", icon: "🐷" },
        { title: "Alimento", path: "/dashboard/food", icon: "🌾" },
        { title: "Alimentación", path: "/dashboard/feeding", icon: "🍽️" },
        { title: "Pesaje", path: "/dashboard/weight", icon: "⚖️" },
        { title: "Etapa", path: "/dashboard/stage", icon: "📈" },
        { title: "Entradas", path: "/dashboard/entries", icon: "📝" },
        { title: "Raza", path: "/dashboard/race", icon: "🐽" },
        { title: "Corrales", path: "/dashboard/corral", icon: "🏠" },
    ]

    useEffect(() => {
        const storedUsername = localStorage.getItem("username")
        const storedEmail = localStorage.getItem("email")
        if (storedUsername) setUsername(storedUsername)
        if (storedEmail) setEmail(storedEmail)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("email")
        router.push("/user/login")
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div
                className={`nav-sidebar transition-all duration-300 relative ${isOpen ? "w-64" : "w-16"}`}
                style={{
                    background: "linear-gradient(to bottom, var(--bg-color-primary), var(--bg-color-rosado))",
                    boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
                    height: "100vh",
                    zIndex: 10,
                }}
            >
                <div className="h-full flex flex-col relative pt-4">
                    {/* Logo */}
                    <div className="flex justify-center items-center mb-8 pt-2">
                        <img
                            src="/assets/img/pesopig.png"
                            alt="PesoPig"
                            width={isOpen ? "65" : "40"}
                            height={isOpen ? "60" : "35"}
                        />
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-lg w-6 h-6 flex items-center justify-center text-sm border border-gray-200"
                    >
                        {isOpen ? "◀" : "▶"}
                    </button>

                    {/* Menu */}
                    <div className="flex-1 flex-col justify-center overflow-y-auto">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                className="flex items-center px-4 py-3 text-white hover:bg-white/20 transition-colors font-bold"
                                style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", whiteSpace: "nowrap" }}
                            >
                                <span className="text-xl min-w-[24px] text-center">{item.icon}</span>
                                {isOpen && <span className="ml-3">{item.title}</span>}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-col flex-1 overflow-hidden">
                <nav className="navbar bg-nav-public shadow-lg z-50 h-20 flex items-center">
                    <div className="container mx-auto flex items-center justify-between px-4">
                        {/* Título */}
                        <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "Arial, sans-serif" }}>
                            PESO PIG
                        </h1>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center text-white hover:bg-white/20 px-3 py-2 rounded-lg"
                            >
                                <User className="mr-2" size={20} />
                                <span className="mr-2">{username || "Usuario"}</span>
                                <ChevronDown size={16} />
                            </button>

                            {isUserMenuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50"
                                    style={{ position: "absolute", top: "calc(100% + 8px)" }}
                                >
                                    <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                                        {username || "Usuario"}
                                        <span className="block text-xs text-gray-500">{email || "email@demo.com"}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        <LogOut className="mr-2" size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Página con ScrollArea */}
                <div className="flex-1 overflow-hidden">
                    {title && <div className="px-4 pt-4">{title}</div>}
                    <ScrollArea className="h-[calc(100vh-5rem)]">
                        <main className="p-4">{children}</main>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

// Estilos globales para asegurar que los estilos del NavPrivada no sean sobrescritos
const navStyles = `
  .nav-sidebar {
    background: linear-gradient(to bottom, var(--bg-color-primary), var(--bg-color-rosado)) !important;
  }
  
  .navbar.bg-nav-public {
    background-color: var(--bg-color-primary) !important;
  }
`

// Inyectar estilos globales
if (typeof document !== "undefined") {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = navStyles
    document.head.appendChild(styleElement)
}

export default NavPrivada

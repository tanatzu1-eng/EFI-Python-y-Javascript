import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import { LogoEspacio, Boton } from './ui'

export default function Navbar({ toggleSidebar }) {
    const { usuario, logout, esAdmin } = useAuth()
    const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
    const [busqueda, setBusqueda] = useState('')
    const navigate = useNavigate()
    const contenedorUsuarioRef = useRef(null)

    const manejarBusqueda = (e) => {
        e.preventDefault()
        if (busqueda.trim()) {
            navigate(`/eventos?q=${encodeURIComponent(busqueda.trim())}`)
        } else {
            navigate('/eventos')
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm transition-colors duration-200">
            <div className="h-full max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
                {/* Lado izquierdo: Hamburguesa + Logo */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label="Abrir o cerrar menú lateral"
                        className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                        {/* Icono de hamburguesa */}
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    <Link
                        to="/"
                        className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100 font-bold text-lg sm:text-xl tracking-tight group"
                    >
                        {/* Espacio reservado para version cuadrada redondeada */}
                        <LogoEspacio
                            tipo="cuadrado-redondeado"
                            className="group-hover:scale-105 transition duration-150"
                        />

                        <span className="hidden min-[420px]:inline">El Imaginario</span>
                    </Link>
                </div>

                {/* Centro: Barra de busqueda estilo Classroom */}
                <form
                    onSubmit={manejarBusqueda}
                    role="search"
                    className="flex-1 max-w-md mx-2"
                >
                    <label htmlFor="barra-busqueda" className="sr-only">
                        Buscar lugares o eventos
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                            🔍
                        </span>
                        <input
                            id="barra-busqueda"
                            type="search"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar lugares o eventos culturales…"
                            className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                        />
                    </div>
                </form>

                {/* Extremo derecho: Logo de usuario con recuadro emergente */}
                <div className="relative shrink-0" ref={contenedorUsuarioRef}>
                    <button
                        type="button"
                        onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                        aria-label="Cuenta de usuario"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold text-sm hover:ring-4 hover:ring-indigo-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                        {usuario ? (
                            usuario.nombre.charAt(0).toUpperCase()
                        ) : (
                            <span className="text-base">👤</span>
                        )}
                    </button>

                    {/* Recuadro emergente de cuenta de usuario (Estilo Classroom) */}
                    {menuUsuarioAbierto && (
                        <div
                            role="dialog"
                            aria-label="Panel de cuenta"
                            className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-5 z-50 text-slate-900 dark:text-slate-100 animate-in fade-in duration-150"
                        >
                            {usuario ? (
                                <div className="text-center space-y-3">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                                        {usuario.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base leading-tight text-slate-900 dark:text-slate-100">
                                            {usuario.nombre}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            {usuario.email}
                                        </p>
                                        <span className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                            esAdmin
                                                ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                                                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                        }`}>
                                            {esAdmin ? 'Admin' : (usuario.rol || 'Usuario')}
                                        </span>
                                    </div>

                                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                                        <Link
                                            to="/perfil"
                                            onClick={() => setMenuUsuarioAbierto(false)}
                                            className="w-full text-center py-2 px-3 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                        >
                                            Ver mi perfil
                                        </Link>

                                        <Boton
                                            variante="secundario"
                                            onClick={() => {
                                                logout()
                                                setMenuUsuarioAbierto(false)
                                                navigate('/')
                                            }}
                                            className="w-full text-xs"
                                        >
                                            Cerrar sesión
                                        </Boton>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-3">
                                    <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-2xl">
                                        👤
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                                            Acceso de Usuario
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Inicia sesión para suscribirte y comprar entradas.
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setMenuUsuarioAbierto(false)}
                                        >
                                            <Boton variante="primario" className="w-full">
                                                Iniciar sesión
                                            </Boton>
                                        </Link>
                                        <Link
                                            to="/registro"
                                            onClick={() => setMenuUsuarioAbierto(false)}
                                        >
                                            <Boton variante="secundario" className="w-full">
                                                Crear cuenta nueva
                                            </Boton>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

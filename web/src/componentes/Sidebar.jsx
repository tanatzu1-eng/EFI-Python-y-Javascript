import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

export default function Sidebar({ abierto, cerrarEnMovil }) {
    const { esAdmin } = useAuth()

    const estiloLink = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition duration-150 ${
            isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`

    if (!abierto) {
        return null
    }

    return (
        <aside
            aria-label="Menú principal de navegación"
            className="fixed top-16 left-0 bottom-0 w-64 z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto transition-colors duration-200"
        >
            <nav className="space-y-1">
                <NavLink
                    to="/"
                    end
                    onClick={cerrarEnMovil}
                    className={estiloLink}
                >
                    <span className="text-lg">🏛️</span>
                    <span>Organizaciones</span>
                </NavLink>

                <NavLink
                    to="/eventos"
                    onClick={cerrarEnMovil}
                    className={estiloLink}
                >
                    <span className="text-lg">🎟️</span>
                    <span>Todos los eventos</span>
                </NavLink>

                <NavLink
                    to="/suscripciones"
                    onClick={cerrarEnMovil}
                    className={estiloLink}
                >
                    <span className="text-lg">🔔</span>
                    <span>Suscripciones</span>
                </NavLink>

                <NavLink
                    to="/ajustes"
                    onClick={cerrarEnMovil}
                    className={estiloLink}
                >
                    <span className="text-lg">⚙️</span>
                    <span>Ajustes</span>
                </NavLink>

                {esAdmin && (
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Administración
                        </span>
                        <div className="mt-2">
                            <NavLink
                                to="/admin"
                                onClick={cerrarEnMovil}
                                className={estiloLink}
                            >
                                <span className="text-lg">🛠️</span>
                                <span>Panel de Control</span>
                            </NavLink>
                        </div>
                    </div>
                )}
            </nav>

            <div className="mt-8 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-400">
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                    Agenda Cultural Río IV
                </p>
                <p className="mt-1">
                    Encuentra espacios artísticos, teatros, murgas y bibliotecas de la ciudad.
                </p>
            </div>
        </aside>
    )
}

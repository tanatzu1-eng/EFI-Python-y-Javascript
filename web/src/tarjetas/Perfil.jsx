import { Link, Navigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexto/AuthContext'
import { useFetch } from '../carga_datos'
import { Boton, Estado, Tarjeta, Titulo } from '../componentes/ui'

export default function Perfil() {
    const { usuario, logout } = useAuth()
    const { data, loading, error, reload } = useFetch(
        () => (usuario ? api.usuarios.get(usuario.id) : Promise.resolve(null)),
        [usuario?.id]
    )

    if (!usuario) {
        return <Navigate to="/login" replace />
    }

    const cancelarSuscripcion = async (idSuscripcion) => {
        try {
            await api.suscripciones.remove(idSuscripcion)
            reload()
        } catch (e) {
            alert('Error al cancelar suscripción: ' + e.message)
        }
    }

    return (
        <section aria-labelledby="titulo-perfil" className="max-w-3xl mx-auto space-y-6">
            <Titulo id="titulo-perfil">Mi Perfil</Titulo>

            <Estado loading={loading} error={error}>
                {/* Datos del usuario */}
                <Tarjeta className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                                {data?.nombre ? data.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {data?.nombre}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {data?.email}
                                </p>
                                <span className="mt-1 inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    Rol: {data?.rol}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Boton variante="secundario" onClick={logout} className="text-xs">
                                Cerrar sesión
                            </Boton>
                        </div>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-400">
                        <div>
                            <dt className="text-slate-400">Fecha de nacimiento:</dt>
                            <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                {data?.fecha_nacimiento || 'No informada'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-slate-400">Identificador de cuenta:</dt>
                            <dd className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                #{data?.id}
                            </dd>
                        </div>
                    </dl>
                </Tarjeta>

                {/* Organizaciones suscritas */}
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Mis organizaciones suscritas
                    </h3>

                    {data?.suscripcion && data.suscripcion.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {data.suscripcion.map((sub) => (
                                <Tarjeta
                                    key={sub.id}
                                    className="flex items-center justify-between p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">🏛️</span>
                                        <div>
                                            <Link
                                                to={`/organizaciones/${sub.organizacion?.id}`}
                                                className="font-semibold text-sm text-indigo-500 hover:underline block"
                                            >
                                                {sub.organizacion?.nombre}
                                            </Link>
                                            <span className="text-[11px] text-slate-400">
                                                Notificaciones activas
                                            </span>
                                        </div>
                                    </div>
                                    <Boton
                                        variante="secundario"
                                        onClick={() => cancelarSuscripcion(sub.id)}
                                        className="text-xs py-1 px-2.5"
                                    >
                                        Anular
                                    </Boton>
                                </Tarjeta>
                            ))}
                        </div>
                    ) : (
                        <Tarjeta className="text-center py-8">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                No estás suscrito a ninguna organización cultural todavía.
                            </p>
                            <Link to="/" className="inline-block mt-3">
                                <Boton variante="primario" className="text-xs">
                                    Explorar organizaciones
                                </Boton>
                            </Link>
                        </Tarjeta>
                    )}
                </div>
            </Estado>
        </section>
    )
}

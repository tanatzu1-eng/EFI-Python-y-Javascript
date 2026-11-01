import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexto/AuthContext'
import { fmtFecha, fmtPrecio, useFetch } from '../carga_datos'
import { Boton, Estado, Tarjeta, Volver } from '../componentes/ui'

export default function OrganizacionDetalle() {
    const { id } = useParams()
    const { usuario } = useAuth()
    const [mensaje, setMensaje] = useState(null)

    const { data, loading, error, reload } = useFetch(async () => {
        const org = await api.organizaciones.get(id)
        let suscripcionId = null

        if (usuario) {
            const perfil = await api.usuarios.get(usuario.id)
            const encontrada = perfil.suscripcion?.find(
                (s) => s.organizacion_id === Number(id)
            )
            suscripcionId = encontrada ? encontrada.id : null
        }

        return { org, suscripcionId }
    }, [id, usuario?.id])

    const alternarSuscripcion = async () => {
        setMensaje(null)
        try {
            if (data.suscripcionId) {
                await api.suscripciones.remove(data.suscripcionId)
            } else {
                await api.suscripciones.create(usuario.id, Number(id))
            }
            reload()
        } catch (e) {
            setMensaje(e.message)
        }
    }

    // Filtrar y ordenar eventos: maximo 5 eventos (los mas recientes o proximos)
    const eventos = (data?.org?.evento || [])
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 5)

    return (
        <section aria-labelledby="titulo-organizacion" className="space-y-6">
            <Volver to="/">Volver al listado de organizaciones</Volver>

            <Estado loading={loading} error={error}>
                {/* Cabecera de la Organizacion */}
                <header className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Espacio reservado para logo redondo */}
                            <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-2xl shrink-0">
                                🏛️
                            </div>
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                                    Organización Cultural
                                </span>
                                <h1
                                    id="titulo-organizacion"
                                    className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100"
                                >
                                    {data?.org?.nombre}
                                </h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Río Cuarto, Córdoba · Espacio de difusión y arte
                                </p>
                            </div>
                        </div>

                        {/* Boton de suscripcion estilo YouTube (sin campanita) */}
                        <div>
                            {usuario ? (
                                <Boton
                                    variante={data?.suscripcionId ? 'youtubeSuscrito' : 'youtube'}
                                    onClick={alternarSuscripcion}
                                    className="px-6 py-2.5 rounded-full"
                                >
                                    {data?.suscripcionId ? 'Suscrito' : 'Suscribirse'}
                                </Boton>
                            ) : (
                                <Link to="/login">
                                    <Boton variante="youtube" className="px-5 py-2 rounded-full">
                                        Suscribirse
                                    </Boton>
                                </Link>
                            )}
                        </div>
                    </div>

                    {mensaje && (
                        <aside className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            {mensaje}
                        </aside>
                    )}
                </header>

                {/* Seccion de eventos de la organizacion (limite de 5) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            Próximos eventos (Máximo 5)
                        </h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {eventos.length} de {data?.org?.evento?.length || 0} disponibles
                        </span>
                    </div>

                    {eventos.length === 0 ? (
                        <Tarjeta className="text-center py-10">
                            <p className="text-slate-500 dark:text-slate-400">
                                Esta organización no tiene eventos programados en este momento.
                            </p>
                        </Tarjeta>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {eventos.map((ev) => (
                                <Link
                                    key={ev.id}
                                    to={`/eventos/${ev.id}`}
                                    className="block group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl"
                                >
                                    <Tarjeta className="h-full flex flex-col justify-between cursor-pointer group-hover:border-indigo-500/50">
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition">
                                                    {ev.nombre}
                                                </h3>
                                                <span
                                                    className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                        ev.disponible
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                    }`}
                                                >
                                                    {ev.disponible ? 'Disponible' : 'Agotado'}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <span>📅</span>
                                                <time>{fmtFecha(ev.fecha)}</time>
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <span>📍</span>
                                                <span>{ev.lugar}</span>
                                            </p>

                                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pt-1">
                                                {ev.descripcion}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                            <span className="text-sm font-bold text-indigo-500 dark:text-indigo-400">
                                                {fmtPrecio(ev.precio_entrada)}
                                            </span>
                                            <span className="text-xs text-slate-400 group-hover:text-indigo-400 transition">
                                                Ver detalle →
                                            </span>
                                        </div>
                                    </Tarjeta>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </Estado>
        </section>
    )
}

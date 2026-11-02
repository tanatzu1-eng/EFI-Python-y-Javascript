import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { fmtFecha, fmtPrecio, useFetch } from '../carga_datos'
import { Estado, Tarjeta, Titulo, Boton } from '../componentes/ui'

export default function Eventos() {
    const [searchParams, setSearchParams] = useSearchParams()
    const queryParam = searchParams.get('q') || ''
    const [limiteVisible, setLimiteVisible] = useState(9)

    const { data, loading, error } = useFetch(async () => {
        const [eventos, orgs] = await Promise.all([
            api.eventos.list(),
            api.organizaciones.list(),
        ])
        const mapaOrgs = {}
        for (const o of orgs) {
            mapaOrgs[o.id] = o.nombre
        }
        return { eventos, orgs: mapaOrgs }
    })

    const [soloDisponibles, setSoloDisponibles] = useState(false)

    const manejarCambioBusqueda = (e) => {
        const valor = e.target.value
        setSearchParams(valor ? { q: valor } : {})
        setLimiteVisible(9) // Reiniciar a 9 al cambiar busqueda
    }

    const alternarDisponibles = (e) => {
        setSoloDisponibles(e.target.checked)
        setLimiteVisible(9)
    }

    const eventosFiltrados = (data?.eventos || [])
        .filter((ev) => !soloDisponibles || ev.disponible)
        .filter((ev) => {
            const texto = `${ev.nombre} ${ev.lugar} ${data?.orgs[ev.organizacion_id] || ''}`.toLowerCase()
            return texto.includes(queryParam.toLowerCase())
        })
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

    // Limitar a un maximo de 9 cards inicialmente
    const eventosMostrados = eventosFiltrados.slice(0, limiteVisible)

    const mostrarMas = () => {
        setLimiteVisible((prev) => prev + 9)
    }

    return (
        <section aria-labelledby="titulo-cartelera" className="space-y-6">
            <Titulo id="titulo-cartelera">
                Cartelera de Eventos Culturales
            </Titulo>

            {/* Barra de filtros */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                    <input
                        type="search"
                        value={queryParam}
                        onChange={manejarCambioBusqueda}
                        placeholder="Buscar por evento, lugar u organización…"
                        className="w-full px-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-slate-700 dark:text-slate-300">
                    <input
                        type="checkbox"
                        checked={soloDisponibles}
                        onChange={alternarDisponibles}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Mostrar solo con entradas disponibles</span>
                </label>
            </div>

            <Estado loading={loading} error={error}>
                {eventosFiltrados.length === 0 ? (
                    <Tarjeta className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400">
                            No se encontraron eventos para los criterios seleccionados.
                        </p>
                    </Tarjeta>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {eventosMostrados.map((ev) => (
                                <Link
                                    key={ev.id}
                                    to={`/eventos/${ev.id}`}
                                    className="block group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl"
                                >
                                    <Tarjeta className="h-full flex flex-col justify-between cursor-pointer group-hover:border-indigo-500/50">
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition">
                                                    {ev.nombre}
                                                </h2>
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

                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                <span>📅</span>
                                                <time>{fmtFecha(ev.fecha)}</time>
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                <span>📍</span>
                                                <span>{ev.lugar}</span>
                                            </p>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                <span>🏛️</span>
                                                <span>{data?.orgs[ev.organizacion_id] || 'Organización'}</span>
                                            </p>

                                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pt-1">
                                                {ev.descripcion}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                            <span className="text-sm font-bold text-indigo-500 dark:text-indigo-400">
                                                {fmtPrecio(ev.precio_entrada)}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition">
                                                Ver detalles →
                                            </span>
                                        </div>
                                    </Tarjeta>
                                </Link>
                            ))}
                        </div>

                        {/* Boton Mostrar mas si hay mas eventos que el limite actual */}
                        {limiteVisible < eventosFiltrados.length && (
                            <div className="pt-6 text-center">
                                <Boton
                                    variante="secundario"
                                    onClick={mostrarMas}
                                    className="px-6 py-2.5 text-sm font-semibold"
                                >
                                    Mostrar más
                                </Boton>
                            </div>
                        )}
                    </>
                )}
            </Estado>
        </section>
    )
}

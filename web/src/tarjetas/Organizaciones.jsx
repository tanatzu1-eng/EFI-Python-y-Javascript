import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useFetch } from '../carga_datos'
import { Estado, Tarjeta, Titulo, LogoEspacio, Boton } from '../componentes/ui'

export default function Organizaciones() {
    const { data, loading, error } = useFetch(() => api.organizaciones.list())
    const [filtro, setFiltro] = useState('')
    const [limiteVisible, setLimiteVisible] = useState(9)

    const listaCompleta = (data || []).filter((org) =>
        org.nombre.toLowerCase().includes(filtro.toLowerCase())
    )

    // Mostrar unicamente hasta el limite actual (9 cards inicialmente)
    const listaMostrada = listaCompleta.slice(0, limiteVisible)

    const manejarFiltro = (e) => {
        setFiltro(e.target.value)
        setLimiteVisible(9) // Reiniciar a 9 al buscar
    }

    const mostrarMas = () => {
        setLimiteVisible((prev) => prev + 9)
    }

    return (
        <section aria-labelledby="titulo-organizaciones" className="space-y-6">
            <Titulo id="titulo-organizaciones">
                Espacios y Organizaciones Culturales
            </Titulo>

            {/* Espacio reservado para version rectangular tipo banner */}
            <div className="mb-6">
                <LogoEspacio
                    tipo="banner"
                    texto="Cartelera Cultural Río Cuarto"
                    className="h-28 sm:h-36"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Explora centros culturales, teatros, murgas y bibliotecas populares de Río Cuarto.
                </p>

                <div className="w-full sm:w-72">
                    <input
                        type="search"
                        value={filtro}
                        onChange={manejarFiltro}
                        placeholder="Filtrar organizaciones…"
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                </div>
            </div>

            <Estado loading={loading} error={error}>
                {listaCompleta.length === 0 ? (
                    <Tarjeta className="text-center py-12">
                        <p className="text-base text-slate-500 dark:text-slate-400">
                            No se encontraron organizaciones culturales disponibles.
                        </p>
                    </Tarjeta>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {listaMostrada.map((org) => (
                                <Link
                                    key={org.id}
                                    to={`/organizaciones/${org.id}`}
                                    className="block group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl"
                                >
                                    <Tarjeta className="h-full flex flex-col justify-between cursor-pointer group-hover:border-indigo-500/50">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                {/* Espacio reservado para version cuadrada redondeada */}
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition duration-150">
                                                    🏛️
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                                                        Centro Cultural
                                                    </span>
                                                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-indigo-400 transition">
                                                        {org.nombre}
                                                    </h2>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                                Haz click en esta tarjeta para ver su información y cartelera de eventos.
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-indigo-500 font-medium">
                                            <span>Ver cartelera de eventos</span>
                                            <span className="group-hover:translate-x-1 transition duration-150">
                                                →
                                            </span>
                                        </div>
                                    </Tarjeta>
                                </Link>
                            ))}
                        </div>

                        {/* Boton Mostrar mas si hay mas organizaciones que el limite actual */}
                        {limiteVisible < listaCompleta.length && (
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

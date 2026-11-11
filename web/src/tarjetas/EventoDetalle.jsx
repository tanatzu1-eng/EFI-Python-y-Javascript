import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexto/AuthContext'
import { fmtFecha, fmtPrecio, useFetch } from '../carga_datos'
import { Boton, Estado, Volver } from '../componentes/ui'

export default function EventoDetalle() {
    const { id } = useParams()
    const { usuario } = useAuth()
    const [modalCompra, setModalCompra] = useState(false)
    const [compraExitosa, setCompraExitosa] = useState(false)
    const [cantidadEntradas, setCantidadEntradas] = useState(1)
    const [mensajeSuscripcion, setMensajeSuscripcion] = useState(null)

    const { data, loading, error, reload } = useFetch(async () => {
        const evento = await api.eventos.get(id)
        let suscripcionId = null

        if (usuario && evento.organizacion_id) {
            const perfil = await api.usuarios.get(usuario.id)
            const encontrada = perfil.suscripcion?.find(
                (s) => s.organizacion_id === evento.organizacion_id
            )
            suscripcionId = encontrada ? encontrada.id : null
        }

        return { evento, suscripcionId }
    }, [id, usuario?.id])

    const e = data?.evento

    // Calculo del 10% adicional
    const precioBase = Number(e?.precio_entrada || 0)
    const recargoDiezPorciento = precioBase * 0.10
    const precioConRecargo = precioBase + recargoDiezPorciento
    const totalCompra = precioConRecargo * cantidadEntradas

    // Generar enlace directo a Google Maps para la direccion
    const enlaceMaps = e?.lugar
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              e.lugar + ', Río Cuarto, Córdoba, Argentina'
          )}`
        : '#'

    const alternarSuscripcion = async () => {
        if (!usuario) {
            return
        }
        setMensajeSuscripcion(null)
        try {
            if (data.suscripcionId) {
                await api.suscripciones.remove(data.suscripcionId)
            } else {
                await api.suscripciones.create(usuario.id, e.organizacion_id)
            }
            reload()
        } catch (err) {
            setMensajeSuscripcion(err.message)
        }
    }

    const simularCompra = (ev) => {
        ev.preventDefault()
        setCompraExitosa(true)
        setTimeout(() => {
            setModalCompra(false)
            setCompraExitosa(false)
        }, 2500)
    }

    return (
        <article aria-labelledby="nombre-evento" className="space-y-6 max-w-4xl mx-auto">
            <Volver to={e?.organizacion_id ? `/organizaciones/${e.organizacion_id}` : '/'}>
                Volver a la organización
            </Volver>

            <Estado loading={loading} error={error}>
                {/* Cabecera del evento */}
                <header className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Logo de la organizacion */}
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-2xl font-bold shrink-0">
                                🎭
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                        Evento Cultural
                                    </span>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                            e?.disponible
                                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                                : 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30'
                                        }`}
                                    >
                                        {e?.disponible ? 'Disponible' : 'Agotado'}
                                    </span>
                                </div>
                                <h1
                                    id="nombre-evento"
                                    className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100"
                                >
                                    {e?.nombre}
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Organizado por:{' '}
                                    {e?.organizacion ? (
                                        <Link
                                            to={`/organizaciones/${e.organizacion.id}`}
                                            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            {e.organizacion.nombre}
                                        </Link>
                                    ) : (
                                        'Organización de Río Cuarto'
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Boton de suscripcion estilo YouTube (sin campanita) */}
                        {e?.organizacion_id && (
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
                        )}
                    </div>

                    {mensajeSuscripcion && (
                        <p className="text-xs text-red-600 dark:text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                            {mensajeSuscripcion}
                        </p>
                    )}
                </header>

                {/* Seccion principal: Ubicacion en Maps, Precio y Compra */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Tarjeta de compra y precio */}
                    <aside
                        aria-label="Información de entradas y compra"
                        className="md:col-span-1 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 p-5 shadow-sm flex flex-col justify-between gap-4"
                    >
                        <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                                Entrada al evento
                            </span>
                            <div className="mt-2 space-y-1">
                                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 pt-1">
                                    {fmtPrecio(precioConRecargo)}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 space-y-2">
                            {usuario ? (
                                <Boton
                                    variante="primario"
                                    onClick={() => setModalCompra(true)}
                                    disabled={!e?.disponible}
                                    className="w-full py-3 text-base font-semibold"
                                >
                                    {e?.disponible ? 'Comprar entrada' : 'Entradas agotadas'}
                                </Boton>
                            ) : (
                                <div className="space-y-2">
                                    <Link to="/login" className="block">
                                        <Boton variante="primario" className="w-full">
                                            Ingresar para comprar
                                        </Boton>
                                    </Link>
                                    <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                                        Debes estar registrado para comprar tickets
                                    </p>
                                </div>
                            )}

                            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                                Entradas vendidas hasta el momento: {e?.entradas_vendidas || 0}
                            </p>
                        </div>
                    </aside>

                    {/* Ubicacion y mapa de Google Maps */}
                    <section
                        aria-label="Ubicación del evento"
                        className="md:col-span-2 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 p-5 shadow-sm space-y-4"
                    >
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <span>📍</span> Ubicación y cómo llegar
                        </h2>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div>
                                <strong className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {e?.lugar}
                                </strong>
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                    Río Cuarto, Provincia de Córdoba
                                </span>
                            </div>

                            {/* Enlace directo a Google Maps */}
                            <div>
                                <a
                                    href={enlaceMaps}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow hover:scale-105 active:scale-95 transition cursor-pointer"
                                >
                                    <span>🗺️</span>
                                    <span>Ver ubicación en Google Maps</span>
                                    <span>↗</span>
                                </a>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Detalle completo de la informacion del evento */}
                <section
                    aria-labelledby="titulo-info-detallada"
                    className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 p-6 shadow-sm space-y-6"
                >
                    <h2
                        id="titulo-info-detallada"
                        className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700/60 pb-3"
                    >
                        Información completa del evento
                    </h2>

                    <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                            <dt className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                📅 Fecha y hora
                            </dt>
                            <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                {e && fmtFecha(e.fecha)}
                            </dd>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                            <dt className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                🎭 Temática
                            </dt>
                            <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                Cultural / Artístico / Recreativo
                            </dd>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                            <dt className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                🎪 Actividad
                            </dt>
                            <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                Presentación en vivo, exhibición y encuentro comunitario
                            </dd>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                            <dt className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                🌟 Anfitrión/es y participantes
                            </dt>
                            <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                Artistas locales y elenco de {e?.organizacion?.nombre || 'Río Cuarto'}
                            </dd>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                            <dt className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                🏷️ Descuentos
                            </dt>
                            <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                20% para estudiantes y jubilados en boletería
                            </dd>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                            <dt className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                🔞 Clasificación de edad
                            </dt>
                            <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                Apto para todo público (ATP)
                            </dd>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                            <dt className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                ☎️ Contacto de soporte
                            </dt>
                            <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                PuntoCulturalRioIV@gmail.com · 011-11111111
                            </dd>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                            <dt className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                🌐 Redes y web oficial
                            </dt>
                            <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                Instagram: @PuntoCultural_RioIV
                            </dd>
                        </div>
                    </dl>

                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Descripción personalizada del evento
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                            {e?.descripcion}
                        </p>
                    </div>
                </section>
            </Estado>

            {/* Modal de simulación de compra (Placeholder con cálculo del +10%) */}
            {modalCompra && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
                >
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                        {compraExitosa ? (
                            <div className="text-center py-6 space-y-3">
                                <span className="text-5xl">🎉</span>
                                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                    ¡Compra confirmada!
                                </h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    Hemos reservado tus entradas para <strong>{e?.nombre}</strong>.
                                    Recibirás un comprobante digital en {usuario?.email}.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={simularCompra} className="space-y-4">
                                <h3 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-900 dark:text-slate-100">
                                    Comprar entradas
                                </h3>

                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{e?.nombre}</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{e?.lugar}</p>
                                </div>

                                <label className="block text-sm">
                                    <span className="font-semibold text-xs text-slate-600 dark:text-slate-400 block mb-1">
                                        Cantidad de entradas
                                    </span>
                                    <select
                                        value={cantidadEntradas}
                                        onChange={(e) => setCantidadEntradas(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                                    >
                                        <option value="1">1 entrada</option>
                                        <option value="2">2 entradas</option>
                                        <option value="3">3 entradas</option>
                                        <option value="4">4 entradas</option>
                                        <option value="5">5 entradas</option>
                                    </select>
                                </label>

                                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs space-y-1 border border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between text-slate-700 dark:text-slate-300">
                                        <span>Precio por entrada (+10% servicio):</span>
                                        <span className="font-semibold">{fmtPrecio(precioConRecargo)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">
                                        <span>Total a abonar:</span>
                                        <span>{fmtPrecio(totalCompra)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Boton type="submit" variante="primario" className="flex-1">
                                        Confirmar compra
                                    </Boton>
                                    <Boton
                                        type="button"
                                        variante="secundario"
                                        onClick={() => setModalCompra(false)}
                                    >
                                        Cancelar
                                    </Boton>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </article>
    )
}

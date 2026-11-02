import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexto/AuthContext'
import { useFetch } from '../carga_datos'
import { Boton, Estado, Tarjeta, Titulo } from '../componentes/ui'

export default function Suscripciones() {
    const { usuario } = useAuth()
    const [limiteVisible, setLimiteVisible] = useState(9)

    const { data, loading, error, reload } = useFetch(
        () => (usuario ? api.usuarios.get(usuario.id) : Promise.resolve(null)),
        [usuario?.id]
    )

    const cancelarSuscripcion = async (idSuscripcion) => {
        try {
            await api.suscripciones.remove(idSuscripcion)
            reload()
        } catch (e) {
            alert('No se pudo cancelar la suscripción: ' + e.message)
        }
    }

    if (!usuario) {
        return (
            <section aria-labelledby="titulo-suscripciones" className="max-w-2xl mx-auto py-6">
                <Titulo id="titulo-suscripciones">Mis suscripciones</Titulo>
                <Tarjeta className="text-center py-10 space-y-4">
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                        Inicia sesión para gestionar tus organizaciones favoritas
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Al suscribirte a un centro cultural u organización, podrás ver rápidamente sus actividades y novedades.
                    </p>
                    <div className="pt-2">
                        <Link to="/login">
                            <Boton variante="primario">Ingresar a mi cuenta</Boton>
                        </Link>
                    </div>
                </Tarjeta>
            </section>
        )
    }

    const lista = data?.suscripcion || []
    const listaMostrada = lista.slice(0, limiteVisible)

    const mostrarMas = () => {
        setLimiteVisible((prev) => prev + 9)
    }

    return (
        <section aria-labelledby="titulo-suscripciones" className="max-w-4xl mx-auto py-4">
            <Titulo id="titulo-suscripciones">Mis organizaciones suscritas</Titulo>

            <Estado loading={loading} error={error}>
                {lista.length === 0 ? (
                    <Tarjeta className="text-center py-10">
                        <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                            Aún no te has suscrito a ninguna organización cultural.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Explora el catálogo de Río Cuarto y suscríbete con un click.
                        </p>
                        <div className="mt-4">
                            <Link to="/">
                                <Boton variante="primario">Ver organizaciones</Boton>
                            </Link>
                        </div>
                    </Tarjeta>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {listaMostrada.map((sub) => (
                                <Tarjeta
                                    key={sub.id}
                                    className="flex flex-col justify-between gap-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                                            🏛️
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                                                {sub.organizacion?.nombre || 'Organización'}
                                            </h2>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                Suscripción activa
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60">
                                        <Link
                                            to={`/organizaciones/${sub.organizacion?.id}`}
                                            className="text-sm font-medium text-indigo-500 hover:text-indigo-400 hover:underline"
                                        >
                                            Ver eventos →
                                        </Link>
                                        <Boton
                                            variante="secundario"
                                            onClick={() => cancelarSuscripcion(sub.id)}
                                            className="text-xs py-1.5 px-3"
                                        >
                                            Anular suscripción
                                        </Boton>
                                    </div>
                                </Tarjeta>
                            ))}
                        </div>

                        {/* Boton Mostrar mas si hay mas suscripciones que el limite actual */}
                        {limiteVisible < lista.length && (
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

import { Titulo, Tarjeta } from '../componentes/ui'
import { useTema } from '../contexto/TemaContext'

export default function Ajustes() {
    const { tema, alternarTema } = useTema()

    return (
        <section aria-labelledby="titulo-ajustes" className="max-w-2xl mx-auto">
            <Titulo id="titulo-ajustes">Ajustes del sistema</Titulo>

            <Tarjeta className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        Apariencia y tema
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Personaliza cómo se ve El Imaginario en tu dispositivo. Por defecto el tema es oscuro.
                    </p>

                    <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <legend className="sr-only">Seleccionar tema</legend>

                        <label
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition duration-150 ${
                                tema === 'oscuro'
                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-2 ring-indigo-500/20'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                        >
                            <input
                                type="radio"
                                name="tema"
                                value="oscuro"
                                checked={tema === 'oscuro'}
                                onChange={() => alternarTema('oscuro')}
                                className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                                <span className="block font-medium text-slate-900 dark:text-slate-100">
                                    🌙 Modo Oscuro (Por defecto)
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Colores oscuros para descansar la vista
                                </span>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition duration-150 ${
                                tema === 'claro'
                                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 ring-2 ring-indigo-500/20'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                        >
                            <input
                                type="radio"
                                name="tema"
                                value="claro"
                                checked={tema === 'claro'}
                                onChange={() => alternarTema('claro')}
                                className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                                <span className="block font-medium text-slate-900 dark:text-slate-100">
                                    ☀️ Modo Claro
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Fondo claro con alto contraste
                                </span>
                            </div>
                        </label>
                    </fieldset>
                </div>
            </Tarjeta>
        </section>
    )
}

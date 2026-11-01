export default function Footer() {
    return (
        <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur-sm py-12 px-4 transition-colors duration-200">
            <div className="mx-auto max-w-6xl grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-sm">
                {/* Informacion institucional */}
                <section aria-labelledby="footer-info">
                    <h3 id="footer-info" className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">EI</span>
                        El Imaginario
                    </h3>
                    <p className="text-slate-700 dark:text-slate-400 text-xs leading-relaxed mb-3">
                        Plataforma cultural para aglomerar y difundir los establecimientos, espectáculos y eventos recreativos de la ciudad de Río Cuarto.
                    </p>
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} El Imaginario. Todos los derechos reservados.
                    </p>
                </section>

                {/* Desarrolladores del sitio web */}
                <section aria-labelledby="footer-devs">
                    <h3 id="footer-devs" className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
                        Desarrolladores del sitio web
                    </h3>
                    <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-400">
                        <li className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <strong className="block text-slate-900 dark:text-slate-100 font-semibold">
                                Lucas Ezequiel Lorenzoni Brown
                            </strong>
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                Lógica JS y ciberseguridad
                            </span>
                        </li>
                        <li className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <strong className="block text-slate-900 dark:text-slate-100 font-semibold">
                                Noel Rüegger Albert
                            </strong>
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                Gestor de Base de Datos, diseñador gráfico, API y Front End
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Datos de contacto de la empresa */}
                <section aria-labelledby="footer-contacto">
                    <h3 id="footer-contacto" className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
                        Contacto y redes
                    </h3>
                    <address className="not-italic space-y-2 text-xs text-slate-700 dark:text-slate-400">
                        <p className="flex items-center gap-2">
                            <span>📍</span>
                            <span><strong className="text-slate-900 dark:text-slate-200">Domicilio:</strong> Calle Falsa 123, Río Cuarto</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span>📞</span>
                            <span><strong className="text-slate-900 dark:text-slate-200">Teléfono:</strong> 011-11111111</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span>✉️</span>
                            <span><strong className="text-slate-900 dark:text-slate-200">Mail:</strong> PuntoCulturalRioIV@gmail.com</span>
                        </p>
                        <div className="pt-2 flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800">
                            <p className="flex items-center gap-2">
                                <span>📸</span>
                                <span><strong className="text-slate-900 dark:text-slate-200">Instagram:</strong> @PuntoCultural_RioIV</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>👥</span>
                                <span><strong className="text-slate-900 dark:text-slate-200">Facebook:</strong> PuntoCultural_RioIV</span>
                            </p>
                        </div>
                    </address>
                </section>
            </div>
        </footer>
    )
}

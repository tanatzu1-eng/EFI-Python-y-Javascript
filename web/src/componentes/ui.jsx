import { Link } from 'react-router-dom'
import logo_pagina from '../../img/logo_pagina.png'

export function Estado({ loading, error, children }) {
    if (loading) {
        return (
            <div className="py-12 text-center text-slate-400">
                <p className="animate-pulse text-base">Cargando información…</p>
            </div>
        )
    }

    if (error) {
        return (
            <aside className="my-6 rounded-xl bg-red-500/10 p-4 text-red-400 border border-red-500/30">
                <p className="text-sm font-medium">{error}</p>
            </aside>
        )
    }

    return children
}

export function Boton({ variante = 'primario', className = '', ...props }) {
    const estilos = {
        primario: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow-md',
        secundario: 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
        peligro: 'bg-red-600 hover:bg-red-500 text-white shadow-sm hover:shadow-md',
        youtube: 'bg-red-600 hover:bg-red-700 text-white uppercase tracking-wider text-xs font-bold shadow',
        youtubeSuscrito: 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs font-bold',
    }

    return (
        <button
            className={`rounded-xl px-4 py-2 text-sm font-medium transition duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer ${estilos[variante]} ${className}`}
            {...props}
        />
    )
}

export function Campo({ label, ...props }) {
    return (
        <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
                {label}
            </span>
            <input
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 outline-none transition duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                {...props}
            />
        </label>
    )
}

export function Tarjeta({ children, className = '', ...props }) {
    return (
        <article
            className={`rounded-2xl bg-white dark:bg-slate-800/90 p-5 shadow-sm hover:shadow-xl hover:scale-[1.01] border border-slate-200 dark:border-slate-700/60 transition duration-200 ease-out ${className}`}
            {...props}
        >
            {children}
        </article>
    )
}

export function Titulo({ children, extra }) {
    return (
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {children}
            </h1>
            {extra}
        </header>
    )
}

export function Volver({ to, children }) {
    return (
        <nav aria-label="Volver" className="mb-4">
            <Link
                to={to}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-400 hover:underline transition"
            >
                ← {children}
            </Link>
        </nav>
    )
}

// Espacio reservado para las distintas versiones del logo
export function LogoEspacio({ src = logo_pagina, tipo = 'cuadrado-redondeado', className = '' }) {
    const tipos = {
        'cuadrado': 'w-12 h-12 rounded-none',
        'cuadrado-redondeado': 'w-10 h-10 rounded-xl',
        'redondo': 'w-10 h-10 rounded-full',
        'banner': 'w-full h-32 rounded-2xl',
    }

    return (
        <img
            src={src}
            alt="Logo"
            className={`object-cover ${tipos[tipo]} ${className}`}
        />
    )
}

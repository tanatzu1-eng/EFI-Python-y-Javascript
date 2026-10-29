import { Link } from 'react-router-dom'

export function Estado({ loading, error, children }) {
  if (loading) return <p className="py-10 text-center text-slate-500">Cargando…</p>
  if (error)
    return (
      <p className="my-4 rounded-lg bg-red-50 p-4 text-red-700 ring-1 ring-red-200">{error}</p>
    )
  return children
}

export function Boton({ variante = 'primario', className = '', ...props }) {
  const estilos = {
    primario: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secundario: 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100',
    peligro: 'bg-red-600 text-white hover:bg-red-700',
  }
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${estilos[variante]} ${className}`}
      {...props}
    />
  )
}

export function Campo({ label, ...props }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        {...props}
      />
    </label>
  )
}

export function Tarjeta({ children, className = '' }) {
  return (
    <div className={`rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>
      {children}
    </div>
  )
}

export function Titulo({ children, extra }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">{children}</h1>
      {extra}
    </div>
  )
}

export function Volver({ to, children }) {
  return (
    <Link to={to} className="mb-4 inline-block text-sm text-indigo-600 hover:underline">
      ← {children}
    </Link>
  )
}
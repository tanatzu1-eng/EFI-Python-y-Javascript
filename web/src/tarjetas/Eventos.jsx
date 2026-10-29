import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { fmtFecha, fmtPrecio, useFetch } from '../carga_datos'
import { Estado, Tarjeta, Titulo } from '../componentes/ui'

export default function Eventos() {
  const { data, loading, error } = useFetch(async () => {
    const [eventos, orgs] = await Promise.all([api.eventos.list(), api.organizaciones.list()])
    return { eventos, orgs: Object.fromEntries(orgs.map((o) => [o.id, o.nombre])) }
  })
  const [q, setQ] = useState('')
  const [soloDisp, setSoloDisp] = useState(false)

  // Mientras carga, data es null: por eso se usa (data?.eventos ?? [])
  const lista = (data?.eventos ?? [])
    .filter((e) => !soloDisp || e.disponible)
    .filter((e) => `${e.nombre} ${e.lugar}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

  return (
    <>
      <Titulo>Eventos</Titulo>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o lugar…"
          className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={soloDisp} onChange={(e) => setSoloDisp(e.target.checked)} />
          Solo disponibles
        </label>
      </div>

      <Estado loading={loading} error={error}>
        {lista.length === 0 ? (
          <p className="py-10 text-center text-slate-500">No hay eventos para mostrar.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((e) => (
              <Link key={e.id} to={`/eventos/${e.id}`}>
                <Tarjeta className="h-full transition hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h2 className="font-semibold">{e.nombre}</h2>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                        e.disponible ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {e.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">📅 {fmtFecha(e.fecha)}</p>
                  <p className="text-sm text-slate-500">📍 {e.lugar}</p>
                  <p className="text-sm text-slate-500">🏢 {data.orgs[e.organizacion_id] ?? '—'}</p>
                  <p className="mt-3 font-semibold text-indigo-600">{fmtPrecio(e.precio_entrada)}</p>
                </Tarjeta>
              </Link>
            ))}
          </div>
        )}
      </Estado>
    </>
  )
}
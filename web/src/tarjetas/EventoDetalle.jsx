import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { fmtFecha, fmtPrecio, useFetch } from '../carga_datos'
import { Estado, Tarjeta, Volver } from '../componentes/ui'

export default function EventoDetalle() {
  const { id } = useParams()
  const { data: e, loading, error } = useFetch(() => api.eventos.get(id), [id])

  return (
    <>
      <Volver to="/">Volver a eventos</Volver>
      <Estado loading={loading} error={error}>
        <Tarjeta>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{e?.nombre}</h1>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                e?.disponible ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {e?.disponible ? 'Disponible' : 'Agotado'}
            </span>
          </div>
          <p className="mb-4 text-slate-600">{e?.descripcion}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div><dt className="text-slate-500">Fecha</dt><dd>{e && fmtFecha(e.fecha)}</dd></div>
            <div><dt className="text-slate-500">Lugar</dt><dd>{e?.lugar}</dd></div>
            <div><dt className="text-slate-500">Precio de entrada</dt><dd className="font-semibold">{e && fmtPrecio(e.precio_entrada)}</dd></div>
            <div><dt className="text-slate-500">Entradas vendidas</dt><dd>{e?.entradas_vendidas}</dd></div>
            <div>
              <dt className="text-slate-500">Organiza</dt>
              <dd>
                {e?.organizacion ? (
                  <Link className="text-indigo-600 hover:underline" to={`/organizaciones/${e.organizacion.id}`}>
                    {e.organizacion.nombre}
                  </Link>
                ) : '—'}
              </dd>
            </div>
          </dl>
        </Tarjeta>
      </Estado>
    </>
  )
}
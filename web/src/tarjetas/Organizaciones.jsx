import { Link } from 'react-router-dom'
import { api } from '../api'
import { useFetch } from '../carga_datos'
import { Estado, Tarjeta, Titulo } from '../componentes/ui'

export default function Organizaciones() {
  const { data, loading, error } = useFetch(() => api.organizaciones.list())
  return (
    <>
      <Titulo>Organizaciones</Titulo>
      <Estado loading={loading} error={error}>
        {data?.length === 0 && <p className="text-slate-500">Todavía no hay organizaciones.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((o) => (
            <Link key={o.id} to={`/organizaciones/${o.id}`}>
              <Tarjeta className="transition hover:shadow-md">
                <h2 className="font-semibold">🏢 {o.nombre}</h2>
              </Tarjeta>
            </Link>
          ))}
        </div>
      </Estado>
    </>
  )
}
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexto/AuthContext'
import { fmtFecha, fmtPrecio, useFetch } from '../carga_datos'
import { Boton, Estado, Tarjeta, Volver } from '../componentes/ui'

export default function OrganizacionDetalle() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const [msg, setMsg] = useState(null)

  const { data, loading, error, reload } = useFetch(async () => {
    const org = await api.organizaciones.get(id)
    let suscripcionId = null
    if (usuario) {
      const u = await api.usuarios.get(usuario.id)
      suscripcionId = u.suscripcion?.find((s) => s.organizacion_id === Number(id))?.id ?? null
    }
    return { org, suscripcionId }
  }, [id, usuario?.id])

  const alternar = async () => {
    setMsg(null)
    try {
      if (data.suscripcionId) await api.suscripciones.remove(data.suscripcionId)
      else await api.suscripciones.create(usuario.id, Number(id))
      reload()
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <>
      <Volver to="/organizaciones">Volver a organizaciones</Volver>
      <Estado loading={loading} error={error}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">🏢 {data?.org.nombre}</h1>
          {usuario ? (
            <Boton variante={data?.suscripcionId ? 'secundario' : 'primario'} onClick={alternar}>
              {data?.suscripcionId ? 'Cancelar suscripción' : 'Suscribirme'}
            </Boton>
          ) : (
            <Link to="/login" className="text-sm text-indigo-600 hover:underline">
              Ingresá para suscribirte
            </Link>
          )}
        </div>
        {msg && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{msg}</p>}

        <h2 className="mb-3 font-semibold">Eventos</h2>
        {data?.org.evento?.length ? (
          <div className="grid gap-3">
            {data.org.evento.map((e) => (
              <Link key={e.id} to={`/eventos/${e.id}`}>
                <Tarjeta className="flex flex-wrap items-center justify-between gap-2 transition hover:shadow-md">
                  <div>
                    <p className="font-medium">{e.nombre}</p>
                    <p className="text-sm text-slate-500">{fmtFecha(e.fecha)} · {e.lugar}</p>
                  </div>
                  <span className="font-semibold text-indigo-600">{fmtPrecio(e.precio_entrada)}</span>
                </Tarjeta>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">Esta organización no tiene eventos todavía.</p>
        )}
      </Estado>
    </>
  )
}
import { Link, Navigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexto/AuthContext'
import { useFetch } from '../carga_datos'
import { Boton, Estado, Tarjeta, Titulo } from '../componentes/ui'

export default function Perfil() {
  const { usuario } = useAuth()
  const { data, loading, error, reload } = useFetch(
    () => (usuario ? api.usuarios.get(usuario.id) : Promise.resolve(null)),
    [usuario?.id],
  )
  if (!usuario) return <Navigate to="/login" replace />

  const cancelar = async (id) => {
    await api.suscripciones.remove(id)
    reload()
  }

  return (
    <>
      <Titulo>Mi perfil</Titulo>
      <Estado loading={loading} error={error}>
        <Tarjeta className="mb-6">
          <p><b>Nombre:</b> {data?.nombre}</p>
          <p><b>Email:</b> {data?.email}</p>
          <p><b>Nacimiento:</b> {data?.fecha_nacimiento}</p>
          <p><b>Rol:</b> {data?.rol}</p>
        </Tarjeta>

        <h2 className="mb-3 font-semibold">Mis suscripciones</h2>
        {data?.suscripcion?.length ? (
          <div className="grid gap-3">
            {data.suscripcion.map((s) => (
              <Tarjeta key={s.id} className="flex items-center justify-between">
                <Link className="font-medium text-indigo-600 hover:underline" to={`/organizaciones/${s.organizacion?.id}`}>
                  🏢 {s.organizacion?.nombre}
                </Link>
                <Boton variante="secundario" onClick={() => cancelar(s.id)}>Cancelar</Boton>
              </Tarjeta>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">
            No estás suscripto a ninguna organización. <Link to="/organizaciones" className="text-indigo-600 hover:underline">Ver organizaciones</Link>
          </p>
        )}
      </Estado>
    </>
  )
}

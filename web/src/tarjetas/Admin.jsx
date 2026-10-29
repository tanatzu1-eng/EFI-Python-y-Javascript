import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexto/AuthContext'
import { aInputLocal, aIsoUtc, fmtFecha, useFetch } from '../carga_datos'
import { Boton, Campo, Estado, Tarjeta, Titulo } from '../componentes/ui'

const VACIO_EVENTO = {
  nombre: '', descripcion: '', lugar: '', fecha: '', precio_entrada: '', disponible: true, organizacion_id: '',
}

function Fila({ children, onEditar, onBorrar }) {
  return (
    <Tarjeta className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm">{children}</div>
      <div className="flex gap-2">
        {onEditar && <Boton variante="secundario" onClick={onEditar}>Editar</Boton>}
        <Boton variante="peligro" onClick={onBorrar}>Borrar</Boton>
      </div>
    </Tarjeta>
  )
}

function Eventos() {
  const { data, loading, error, reload } = useFetch(async () => {
    const [eventos, orgs] = await Promise.all([api.eventos.list(), api.organizaciones.list()])
    return { eventos, orgs }
  })
  const [form, setForm] = useState(VACIO_EVENTO)
  const [editId, setEditId] = useState(null)
  const [err, setErr] = useState(null)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const guardar = async (ev) => {
    ev.preventDefault()
    setErr(null)
    const body = {
      ...form,
      fecha: aIsoUtc(form.fecha),
      precio_entrada: Number(form.precio_entrada),
      organizacion_id: Number(form.organizacion_id),
    }
    try {
      if (editId) await api.eventos.update(editId, body)
      else await api.eventos.create(body)
      setForm(VACIO_EVENTO)
      setEditId(null)
      reload()
    } catch (e) {
      setErr(e.message)
    }
  }

  const editar = (e) => {
    setEditId(e.id)
    setForm({ ...e, fecha: aInputLocal(e.fecha), precio_entrada: String(e.precio_entrada) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const borrar = async (id) => {
    if (!confirm('¿Borrar este evento?')) return
    try { await api.eventos.remove(id); reload() } catch (e) { setErr(e.message) }
  }

  return (
    <Estado loading={loading} error={error}>
      <Tarjeta className="mb-6">
        <h2 className="mb-4 font-semibold">{editId ? `Editando evento #${editId}` : 'Nuevo evento'}</h2>
        <form onSubmit={guardar} className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre" required value={form.nombre} onChange={set('nombre')} />
          <Campo label="Lugar" required value={form.lugar} onChange={set('lugar')} />
          <Campo label="Fecha y hora" type="datetime-local" required value={form.fecha} onChange={set('fecha')} />
          <Campo label="Precio de entrada" type="number" min="0" step="0.01" required value={form.precio_entrada} onChange={set('precio_entrada')} />
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Organización</span>
            <select
              required
              value={form.organizacion_id}
              onChange={set('organizacion_id')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Elegir…</option>
              {data?.orgs.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 pt-6 text-sm">
            <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.checked })} />
            Disponible
          </label>
          <div className="sm:col-span-2">
            <Campo label="Descripción" required value={form.descripcion} onChange={set('descripcion')} />
          </div>
          {err && <p className="text-sm text-red-600 sm:col-span-2">{err}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <Boton type="submit">{editId ? 'Guardar cambios' : 'Crear evento'}</Boton>
            {editId && (
              <Boton type="button" variante="secundario" onClick={() => { setEditId(null); setForm(VACIO_EVENTO) }}>
                Cancelar
              </Boton>
            )}
          </div>
        </form>
      </Tarjeta>

      <div className="grid gap-3">
        {data?.eventos.map((e) => (
          <Fila key={e.id} onEditar={() => editar(e)} onBorrar={() => borrar(e.id)}>
            <p className="font-medium">{e.nombre}</p>
            <p className="text-slate-500">{fmtFecha(e.fecha)} · {e.lugar} · ${e.precio_entrada}</p>
          </Fila>
        ))}
        {data?.eventos.length === 0 && <p className="text-slate-500">No hay eventos cargados.</p>}
      </div>
    </Estado>
  )
}

function Organizaciones() {
  const { data, loading, error, reload } = useFetch(() => api.organizaciones.list())
  const [nombre, setNombre] = useState('')
  const [editId, setEditId] = useState(null)
  const [err, setErr] = useState(null)

  const guardar = async (ev) => {
    ev.preventDefault()
    setErr(null)
    try {
      if (editId) await api.organizaciones.update(editId, { nombre })
      else await api.organizaciones.create({ nombre })
      setNombre(''); setEditId(null); reload()
    } catch (e) { setErr(e.message) }
  }

  const borrar = async (o) => {
    if (!confirm(`¿Borrar "${o.nombre}"? También se borran sus eventos y suscripciones.`)) return
    try { await api.organizaciones.remove(o.id); reload() } catch (e) { setErr(e.message) }
  }

  return (
    <Estado loading={loading} error={error}>
      <Tarjeta className="mb-6">
        <form onSubmit={guardar} className="flex flex-wrap items-end gap-3">
          <div className="min-w-60 flex-1">
            <Campo label={editId ? `Editando organización #${editId}` : 'Nueva organización'} required minLength={3} maxLength={50} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <Boton type="submit">{editId ? 'Guardar' : 'Crear'}</Boton>
          {editId && <Boton type="button" variante="secundario" onClick={() => { setEditId(null); setNombre('') }}>Cancelar</Boton>}
        </form>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </Tarjeta>
      <div className="grid gap-3">
        {data?.map((o) => (
          <Fila key={o.id} onEditar={() => { setEditId(o.id); setNombre(o.nombre) }} onBorrar={() => borrar(o)}>
            <p className="font-medium">{o.nombre}</p>
          </Fila>
        ))}
      </div>
    </Estado>
  )
}

function Usuarios() {
  const { usuario } = useAuth()
  const { data, loading, error, reload } = useFetch(() => api.usuarios.list())
  const [err, setErr] = useState(null)

  const borrar = async (u) => {
    if (!confirm(`¿Borrar al usuario "${u.nombre}"?`)) return
    try { await api.usuarios.remove(u.id); reload() } catch (e) { setErr(e.message) }
  }

  return (
    <Estado loading={loading} error={error}>
      {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
      <div className="grid gap-3">
        {data?.map((u) => (
          <Fila key={u.id} onBorrar={() => (u.id === usuario.id ? alert('No podés borrarte a vos mismo') : borrar(u))}>
            <p className="font-medium">{u.nombre} <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">{u.rol}</span></p>
            <p className="text-slate-500">{u.email}</p>
          </Fila>
        ))}
      </div>
    </Estado>
  )
}

const TABS = { eventos: ['Eventos', Eventos], organizaciones: ['Organizaciones', Organizaciones], usuarios: ['Usuarios', Usuarios] }

export default function Admin() {
  const { esAdmin } = useAuth()
  const [tab, setTab] = useState('eventos')
  if (!esAdmin) return <Navigate to="/" replace />
  const Contenido = TABS[tab][1]

  return (
    <>
      <Titulo>Panel de administración</Titulo>
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        {Object.entries(TABS).map(([k, [label]]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === k ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <Contenido />
    </>
  )
}
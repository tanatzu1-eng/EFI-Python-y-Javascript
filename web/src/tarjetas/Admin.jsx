import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexto/AuthContext'
import { aInputLocal, aIsoUtc, fmtFecha, useFetch } from '../carga_datos'
import { Boton, Campo, Estado, Tarjeta, Titulo } from '../componentes/ui'

const FORMULARIO_EVENTO_INICIAL = {
    nombre: '',
    descripcion: '',
    lugar: '',
    fecha: '',
    precio_entrada: '',
    disponible: true,
    organizacion_id: '',
}

const FORMULARIO_USUARIO_INICIAL = {
    nombre: '',
    email: '',
    fecha_nacimiento: '',
    contrasenia: '',
    rol: 'Admin',
}

function FilaItem({ children, onEditar, onBorrar, extraAccion }) {
    return (
        <Tarjeta className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="text-sm">{children}</div>
            <div className="flex items-center gap-2">
                {extraAccion}
                {onEditar && (
                    <Boton variante="secundario" onClick={onEditar} className="text-xs py-1.5 px-3">
                        Editar
                    </Boton>
                )}
                {onBorrar && (
                    <Boton variante="peligro" onClick={onBorrar} className="text-xs py-1.5 px-3">
                        Borrar
                    </Boton>
                )}
            </div>
        </Tarjeta>
    )
}

function AdministrarEventos() {
    const { data, loading, error, reload } = useFetch(async () => {
        const [eventos, orgs] = await Promise.all([
            api.eventos.list(),
            api.organizaciones.list(),
        ])
        return { eventos, orgs }
    })

    const [form, setForm] = useState(FORMULARIO_EVENTO_INICIAL)
    const [editId, setEditId] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    const cambiarCampo = (campo) => (e) => {
        setForm({ ...form, [campo]: e.target.value })
    }

    const guardar = async (ev) => {
        ev.preventDefault()
        setErrorMsg(null)
        const cuerpo = {
            ...form,
            fecha: aIsoUtc(form.fecha),
            precio_entrada: Number(form.precio_entrada),
            organizacion_id: Number(form.organizacion_id),
        }
        try {
            if (editId) {
                await api.eventos.update(editId, cuerpo)
            } else {
                await api.eventos.create(cuerpo)
            }
            setForm(FORMULARIO_EVENTO_INICIAL)
            setEditId(null)
            reload()
        } catch (e) {
            setErrorMsg(e.message)
        }
    }

    const editar = (evento) => {
        setEditId(evento.id)
        setForm({
            ...evento,
            fecha: aInputLocal(evento.fecha),
            precio_entrada: String(evento.precio_entrada),
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const borrar = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este evento?')) {
            return
        }
        try {
            await api.eventos.remove(id)
            reload()
        } catch (e) {
            setErrorMsg(e.message)
        }
    }

    return (
        <Estado loading={loading} error={error}>
            <Tarjeta className="mb-6">
                <header className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {editId ? `Editar evento cultural #${editId}` : 'Publicar nuevo evento'}
                    </h2>
                </header>

                <form onSubmit={guardar} className="grid gap-4 sm:grid-cols-2">
                    <Campo
                        label="Nombre del evento"
                        required
                        value={form.nombre}
                        onChange={cambiarCampo('nombre')}
                    />

                    <Campo
                        label="Lugar o dirección"
                        required
                        value={form.lugar}
                        onChange={cambiarCampo('lugar')}
                    />

                    <Campo
                        label="Fecha y hora de inicio"
                        type="datetime-local"
                        required
                        value={form.fecha}
                        onChange={cambiarCampo('fecha')}
                    />

                    <Campo
                        label="Precio de entrada ($ ARS)"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.precio_entrada}
                        onChange={cambiarCampo('precio_entrada')}
                    />

                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
                            Organización anfitriona
                        </span>
                        <select
                            required
                            value={form.organizacion_id}
                            onChange={cambiarCampo('organizacion_id')}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-indigo-500"
                        >
                            <option value="">Selecciona una organización…</option>
                            {data?.orgs.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex items-center gap-2 pt-6 text-sm cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={form.disponible}
                            onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                            Entradas disponibles para la venta
                        </span>
                    </label>

                    <div className="sm:col-span-2">
                        <Campo
                            label="Descripción detallada del evento"
                            required
                            value={form.descripcion}
                            onChange={cambiarCampo('descripcion')}
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-sm text-red-400 sm:col-span-2 bg-red-500/10 p-2 rounded-lg">
                            {errorMsg}
                        </p>
                    )}

                    <div className="flex gap-2 sm:col-span-2 pt-2">
                        <Boton type="submit" variante="primario">
                            {editId ? 'Guardar cambios' : 'Publicar evento'}
                        </Boton>
                        {editId && (
                            <Boton
                                type="button"
                                variante="secundario"
                                onClick={() => {
                                    setEditId(null)
                                    setForm(FORMULARIO_EVENTO_INICIAL)
                                }}
                            >
                                Cancelar edición
                            </Boton>
                        )}
                    </div>
                </form>
            </Tarjeta>

            <div className="grid gap-3">
                {data?.eventos.map((e) => (
                    <FilaItem
                        key={e.id}
                        onEditar={() => editar(e)}
                        onBorrar={() => borrar(e.id)}
                    >
                        <p className="font-bold text-slate-900 dark:text-slate-100">{e.nombre}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {fmtFecha(e.fecha)} · {e.lugar} · ${e.precio_entrada}
                        </p>
                    </FilaItem>
                ))}
                {data?.eventos.length === 0 && (
                    <p className="text-slate-500 text-center py-6">No hay eventos cargados.</p>
                )}
            </div>
        </Estado>
    )
}

function AdministrarOrganizaciones() {
    const { data, loading, error, reload } = useFetch(() => api.organizaciones.list())
    const [nombre, setNombre] = useState('')
    const [editId, setEditId] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    const guardar = async (ev) => {
        ev.preventDefault()
        setErrorMsg(null)
        try {
            if (editId) {
                await api.organizaciones.update(editId, { nombre })
            } else {
                await api.organizaciones.create({ nombre })
            }
            setNombre('')
            setEditId(null)
            reload()
        } catch (e) {
            setErrorMsg(e.message)
        }
    }

    const borrar = async (org) => {
        if (!confirm(`¿Borrar "${org.nombre}"? Se borrarán sus eventos y suscripciones vinculadas.`)) {
            return
        }
        try {
            await api.organizaciones.remove(org.id)
            reload()
        } catch (e) {
            setErrorMsg(e.message)
        }
    }

    return (
        <Estado loading={loading} error={error}>
            <Tarjeta className="mb-6">
                <form onSubmit={guardar} className="flex flex-wrap items-end gap-3">
                    <div className="min-w-64 flex-1">
                        <Campo
                            label={
                                editId
                                    ? `Editando organización #${editId}`
                                    : 'Agregar nueva organización cultural'
                            }
                            required
                            minLength={3}
                            maxLength={50}
                            placeholder="Nombre del centro o espacio…"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <Boton type="submit" variante="primario">
                        {editId ? 'Guardar' : 'Agregar organización'}
                    </Boton>
                    {editId && (
                        <Boton
                            type="button"
                            variante="secundario"
                            onClick={() => {
                                setEditId(null)
                                setNombre('')
                            }}
                        >
                            Cancelar
                        </Boton>
                    )}
                </form>
                {errorMsg && (
                    <p className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">
                        {errorMsg}
                    </p>
                )}
            </Tarjeta>

            <div className="grid gap-3">
                {data?.map((org) => (
                    <FilaItem
                        key={org.id}
                        onEditar={() => {
                            setEditId(org.id)
                            setNombre(org.nombre)
                        }}
                        onBorrar={() => borrar(org)}
                    >
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                            🏛️ {org.nombre}
                        </p>
                    </FilaItem>
                ))}
            </div>
        </Estado>
    )
}

function AdministrarUsuarios() {
    const { usuario } = useAuth()
    const { data, loading, error, reload } = useFetch(() => api.usuarios.list())
    const [formUser, setFormUser] = useState(FORMULARIO_USUARIO_INICIAL)
    const [errorMsg, setErrorMsg] = useState(null)
    const [exitoMsg, setExitoMsg] = useState(null)

    const cambiarCampo = (campo) => (e) => {
        setFormUser({ ...formUser, [campo]: e.target.value })
    }

    const crearUsuario = async (ev) => {
        ev.preventDefault()
        setErrorMsg(null)
        setExitoMsg(null)
        try {
            await api.usuarios.create(formUser)
            setExitoMsg(`Usuario "${formUser.nombre}" creado exitosamente con rol ${formUser.rol}.`)
            setFormUser(FORMULARIO_USUARIO_INICIAL)
            reload()
        } catch (e) {
            setErrorMsg(e.message)
        }
    }

    const borrar = async (u) => {
        if (!confirm(`¿Eliminar al usuario "${u.nombre}"?`)) {
            return
        }
        try {
            await api.usuarios.remove(u.id)
            reload()
        } catch (e) {
            setErrorMsg(e.message)
        }
    }

    return (
        <Estado loading={loading} error={error}>
            {/* Formulario para crear nuevo usuario / administrador */}
            <Tarjeta className="mb-6">
                <header className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Crear nuevo usuario o Administrador
                    </h2>
                </header>

                <form onSubmit={crearUsuario} className="grid gap-4 sm:grid-cols-2">
                    <Campo
                        label="Nombre de usuario"
                        required
                        placeholder="Ej: Noel Ruegger Albert"
                        value={formUser.nombre}
                        onChange={cambiarCampo('nombre')}
                    />

                    <Campo
                        label="Correo electrónico"
                        type="email"
                        required
                        placeholder="usuario@gmail.com"
                        value={formUser.email}
                        onChange={cambiarCampo('email')}
                    />

                    <Campo
                        label="Fecha de nacimiento"
                        type="date"
                        required
                        value={formUser.fecha_nacimiento}
                        onChange={cambiarCampo('fecha_nacimiento')}
                    />

                    <Campo
                        label="Contraseña"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formUser.contrasenia}
                        onChange={cambiarCampo('contrasenia')}
                    />

                    <label className="block text-sm sm:col-span-2">
                        <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
                            Rol asignado
                        </span>
                        <select
                            value={formUser.rol}
                            onChange={cambiarCampo('rol')}
                            className="w-full sm:w-64 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-indigo-500"
                        >
                            <option value="Admin">Admin (Permisos para crear y editar)</option>
                            <option value="Usuario">Usuario (Solo lectura y suscripción)</option>
                        </select>
                    </label>

                    {errorMsg && (
                        <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl sm:col-span-2">
                            {errorMsg}
                        </p>
                    )}

                    {exitoMsg && (
                        <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl sm:col-span-2">
                            {exitoMsg}
                        </p>
                    )}

                    <div className="sm:col-span-2 pt-2">
                        <Boton type="submit" variante="primario">
                            Crear usuario con rol {formUser.rol}
                        </Boton>
                    </div>
                </form>
            </Tarjeta>

            <div className="grid gap-3">
                {data?.map((u) => (
                    <FilaItem
                        key={u.id}
                        onBorrar={() => {
                            if (u.id === usuario.id) {
                                alert('No puedes eliminar tu propia cuenta en sesión')
                            } else {
                                borrar(u)
                            }
                        }}
                    >
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                            {u.nombre}{' '}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {u.email}
                        </p>
                    </FilaItem>
                ))}
            </div>
        </Estado>
    )
}

const PESTANIAS = {
    eventos: ['Eventos Culturales', AdministrarEventos],
    organizaciones: ['Organizaciones', AdministrarOrganizaciones],
    usuarios: ['Usuarios y Roles', AdministrarUsuarios],
}

export default function Admin() {
    const { esAdmin } = useAuth()
    const [pestaniaActiva, setPestaniaActiva] = useState('eventos')

    if (!esAdmin) {
        return <Navigate to="/" replace />
    }

    const ComponenteActivo = PESTANIAS[pestaniaActiva][1]

    return (
        <section aria-labelledby="titulo-admin" className="space-y-6">
            <Titulo id="titulo-admin">Panel de Administración</Titulo>

            <nav aria-label="Secciones del panel" className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                {Object.entries(PESTANIAS).map(([clave, [etiqueta]]) => (
                    <button
                        key={clave}
                        onClick={() => setPestaniaActiva(clave)}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition duration-150 cursor-pointer ${
                            pestaniaActiva === clave
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        {etiqueta}
                    </button>
                ))}
            </nav>

            <ComponenteActivo />
        </section>
    )
}

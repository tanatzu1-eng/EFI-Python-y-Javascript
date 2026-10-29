import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import { Boton, Campo, Tarjeta } from '../componentes/ui'

export default function Registro() {
  const { registrar } = useAuth()
  const navigate = useNavigate()
  const [f, setF] = useState({ nombre: '', email: '', fecha_nacimiento: '', contrasenia: '' })
  const [error, setError] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const enviar = async (ev) => {
    ev.preventDefault()
    setError(null)
    try {
      await registrar(f)
      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <Tarjeta className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-bold">Crear cuenta</h1>
      <form onSubmit={enviar} className="space-y-4">
        <Campo label="Nombre de usuario" required value={f.nombre} onChange={set('nombre')} />
        <Campo label="Email" type="email" required value={f.email} onChange={set('email')} />
        <Campo label="Fecha de nacimiento" type="date" required value={f.fecha_nacimiento} onChange={set('fecha_nacimiento')} />
        <Campo label="Contraseña" type="password" required value={f.contrasenia} onChange={set('contrasenia')} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Boton type="submit" className="w-full">Registrarme</Boton>
      </form>
    </Tarjeta>
  )
}
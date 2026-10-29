import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import { Boton, Campo, Tarjeta } from '../componentes/ui'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(null)

  const enviar = async (ev) => {
    ev.preventDefault()
    setError(null)
    try {
      await login(email, clave)
      navigate('/')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <Tarjeta className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-bold">Ingresar</h1>
      <form onSubmit={enviar} className="space-y-4">
        <Campo label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Campo label="Contraseña" type="password" required value={clave} onChange={(e) => setClave(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Boton type="submit" className="w-full">Ingresar</Boton>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        ¿No tenés cuenta? <Link to="/registro" className="text-indigo-600 hover:underline">Registrate</Link>
      </p>
    </Tarjeta>
  )
}
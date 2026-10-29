import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

export default function Navbar() {
  const { usuario, logout, esAdmin } = useAuth()
  const navigate = useNavigate()

  const link = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-sm font-medium ${
      isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'
    }`

  return (
    <header className="bg-indigo-600">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="mr-4 text-lg font-bold text-white">
            🎟️ Eventos
          </Link>
          <NavLink to="/" end className={link}>Eventos</NavLink>
          <NavLink to="/organizaciones" className={link}>Organizaciones</NavLink>
          {esAdmin && <NavLink to="/admin" className={link}>Admin</NavLink>}
        </div>
        <div className="flex items-center gap-2">
          {usuario ? (
            <>
              <NavLink to="/perfil" className={link}>👤 {usuario.nombre}</NavLink>
              <button
                onClick={() => { logout(); navigate('/') }}
                className="rounded-md px-3 py-1.5 text-sm text-indigo-100 hover:bg-indigo-500"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={link}>Ingresar</NavLink>
              <NavLink to="/registro" className={link}>Registrarme</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
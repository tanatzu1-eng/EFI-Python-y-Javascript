import { createContext, useContext, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

// La sesión vive solo en memoria: el usuario sale siempre de la base de datos
// (POST /usuarios/login) y nada se guarda en el navegador. Al recargar la página
// hay que volver a ingresar.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  const login = async (email, contrasenia) => {
    setUsuario(await api.usuarios.login(email.trim(), contrasenia))
  }

  const registrar = async (datos) => {
    await api.usuarios.create(datos)
    // después de crear la cuenta, validamos contra la base como cualquier login
    await login(datos.email, datos.contrasenia)
  }

  const logout = () => setUsuario(null)

  return (
    <AuthContext.Provider
      value={{ usuario, login, registrar, logout, esAdmin: usuario?.rol === 'Admin' }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
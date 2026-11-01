import { createContext, useContext, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    // La sesion vive en memoria durante la navegacion
    const [usuario, setUsuario] = useState(null)

    const login = async (email, contrasenia) => {
        const respuesta = await api.usuarios.login(email.trim(), contrasenia)
        setUsuario(respuesta)
        return respuesta
    }

    const registrar = async (datos) => {
        await api.usuarios.create(datos)
        await login(datos.email, datos.contrasenia)
    }

    const logout = () => {
        setUsuario(null)
    }

    const esAdmin = usuario?.rol === 'Admin'

    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                registrar,
                logout,
                esAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext)
}

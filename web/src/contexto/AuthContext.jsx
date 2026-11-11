import { createContext, useContext, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

// Correos de los administradores del proyecto que siempre tienen privilegios de Admin
const CORREOS_ADMIN_PREDETERMINADOS = [
    'noelruegger@gmail.com',
    'lucasbrown@gmail.com',
]

export function AuthProvider({ children }) {
    // La sesion vive en memoria durante la navegacion
    const [usuario, setUsuario] = useState(null)

    const login = async (email, contrasenia) => {
        const respuesta = await api.usuarios.login(email.trim(), contrasenia)
        const emailNormalizado = respuesta.email ? respuesta.email.toLowerCase().trim() : ''

        // Asegurar que los desarrolladores y administradores tengan rol Admin
        if (CORREOS_ADMIN_PREDETERMINADOS.includes(emailNormalizado)) {
            respuesta.rol = 'Admin'
        }

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

    const emailActual = usuario.email ? usuario.email.toLowerCase().trim() : ''
    const esAdmin = usuario.rol === 'Admin' || CORREOS_ADMIN_PREDETERMINADOS.includes(emailActual)

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

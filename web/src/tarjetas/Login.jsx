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
    const [cargando, setCargando] = useState(false)

    const enviar = async (ev) => {
        ev.preventDefault()
        setError(null)
        setCargando(true)
        try {
            await login(email, clave)
            navigate('/')
        } catch (e) {
            setError(e.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <section aria-labelledby="titulo-login" className="max-w-md mx-auto py-8">
            <Tarjeta>
                <header className="mb-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center text-xl mb-3">
                        🔑
                    </div>
                    <h1 id="titulo-login" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Iniciar Sesión
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Ingresa con tu cuenta de El Imaginario
                    </p>
                </header>

                <form onSubmit={enviar} className="space-y-4">
                    <Campo
                        label="Correo electrónico"
                        type="email"
                        required
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Campo
                        label="Contraseña"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                    />

                    {error && (
                        <aside className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                            {error}
                        </aside>
                    )}

                    <Boton
                        type="submit"
                        disabled={cargando}
                        className="w-full py-2.5 font-semibold text-sm"
                    >
                        {cargando ? 'Ingresando…' : 'Ingresar'}
                    </Boton>
                </form>

                <footer className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-500 dark:text-slate-400">
                    ¿Aún no tienes cuenta?{' '}
                    <Link
                        to="/registro"
                        className="text-indigo-500 dark:text-indigo-400 font-semibold hover:underline"
                    >
                        Regístrate aquí
                    </Link>
                </footer>
            </Tarjeta>
        </section>
    )
}

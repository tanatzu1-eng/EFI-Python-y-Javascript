import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import { Boton, Campo, Tarjeta } from '../componentes/ui'

export default function Registro() {
    const { registrar } = useAuth()
    const navigate = useNavigate()
    const [formulario, setFormulario] = useState({
        nombre: '',
        email: '',
        fecha_nacimiento: '',
        contrasenia: '',
    })
    const [error, setError] = useState(null)
    const [cargando, setCargando] = useState(false)

    const cambiarCampo = (campo) => (e) => {
        setFormulario({ ...formulario, [campo]: e.target.value })
    }

    const enviar = async (ev) => {
        ev.preventDefault()
        setError(null)
        setCargando(true)
        try {
            await registrar(formulario)
            navigate('/')
        } catch (e) {
            setError(e.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <section aria-labelledby="titulo-registro" className="max-w-md mx-auto py-6">
            <Tarjeta>
                <header className="mb-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center text-xl mb-3">
                        ✨
                    </div>
                    <h1 id="titulo-registro" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Crear una cuenta
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Únete a El Imaginario para suscribirte a eventos y comprar entradas
                    </p>
                </header>

                <form onSubmit={enviar} className="space-y-4">
                    <Campo
                        label="Nombre completo"
                        required
                        placeholder="Ej: Noel Rüegger"
                        value={formulario.nombre}
                        onChange={cambiarCampo('nombre')}
                    />

                    <Campo
                        label="Correo electrónico"
                        type="email"
                        required
                        placeholder="tu@email.com"
                        value={formulario.email}
                        onChange={cambiarCampo('email')}
                    />

                    <Campo
                        label="Fecha de nacimiento"
                        type="date"
                        required
                        value={formulario.fecha_nacimiento}
                        onChange={cambiarCampo('fecha_nacimiento')}
                    />

                    <Campo
                        label="Contraseña"
                        type="password"
                        required
                        placeholder="Mínimo 6 caracteres"
                        value={formulario.contrasenia}
                        onChange={cambiarCampo('contrasenia')}
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
                        {cargando ? 'Registrando cuenta…' : 'Crear mi cuenta'}
                    </Boton>
                </form>

                <footer className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-500 dark:text-slate-400">
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        to="/login"
                        className="text-indigo-500 dark:text-indigo-400 font-semibold hover:underline"
                    >
                        Inicia sesión aquí
                    </Link>
                </footer>
            </Tarjeta>
        </section>
    )
}

import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexto/AuthContext'
import { TemaProvider } from './contexto/TemaContext'
import Navbar from './componentes/Navbar'
import Sidebar from './componentes/Sidebar'
import Footer from './componentes/Footer'
import Organizaciones from './tarjetas/Organizaciones'
import OrganizacionDetalle from './tarjetas/OrganizacionDetalle'
import Eventos from './tarjetas/Eventos'
import EventoDetalle from './tarjetas/EventoDetalle'
import Suscripciones from './tarjetas/Suscripciones'
import Ajustes from './tarjetas/Ajustes'
import Login from './tarjetas/Login'
import Registro from './tarjetas/registro'
import Perfil from './tarjetas/Perfil'
import Admin from './tarjetas/Admin'

export default function App() {
    // Al igual que Google Classroom, por default el sidebar esta desplegado
    const [sidebarAbierto, setSidebarAbierto] = useState(true)

    const toggleSidebar = () => {
        setSidebarAbierto(!sidebarAbierto)
    }

    // En pantallas chicas se cierra automaticamente al tocar un enlace
    const cerrarEnMovil = () => {
        if (window.innerWidth < 768) {
            setSidebarAbierto(false)
        }
    }

    return (
        <BrowserRouter>
            <TemaProvider>
                <AuthProvider>
                    <div className="min-h-screen flex flex-col justify-between transition-colors duration-200">
                        {/* Header fixeado estilo Classroom */}
                        <Navbar toggleSidebar={toggleSidebar} />

                        {/* Menu lateral de hamburguesa estilo Classroom */}
                        <Sidebar
                            abierto={sidebarAbierto}
                            cerrarEnMovil={cerrarEnMovil}
                        />

                        {/* Seccion Main de la aplicacion */}
                        <main
                            className={`flex-1 pt-20 px-4 sm:px-8 pb-12 transition-all duration-200 ${
                                sidebarAbierto ? 'md:ml-64' : 'ml-0'
                            }`}
                        >
                            <div className="max-w-6xl mx-auto">
                                <Routes>
                                    {/* La pagina principal muestra las organizaciones en cards */}
                                    <Route path="/" element={<Organizaciones />} />
                                    <Route
                                        path="/organizaciones/:id"
                                        element={<OrganizacionDetalle />}
                                    />

                                    {/* Seccion de eventos */}
                                    <Route path="/eventos" element={<Eventos />} />
                                    <Route path="/eventos/:id" element={<EventoDetalle />} />

                                    {/* Secciones del menu lateral de Classroom */}
                                    <Route
                                        path="/suscripciones"
                                        element={<Suscripciones />}
                                    />
                                    <Route path="/ajustes" element={<Ajustes />} />

                                    {/* Autenticacion y perfiles */}
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/registro" element={<Registro />} />
                                    <Route path="/perfil" element={<Perfil />} />

                                    {/* Vista del Administrador */}
                                    <Route path="/admin" element={<Admin />} />

                                    {/* Pagina no encontrada */}
                                    <Route
                                        path="*"
                                        element={
                                            <section className="py-16 text-center">
                                                <h1 className="text-3xl font-bold">404</h1>
                                                <p className="mt-2 text-slate-400">
                                                    Página no encontrada en El Imaginario
                                                </p>
                                            </section>
                                        }
                                    />
                                </Routes>
                            </div>
                        </main>

                        {/* Footer institucional con derechos y datos de contacto */}
                        <div
                            className={`transition-all duration-200 ${
                                sidebarAbierto ? 'md:ml-64' : 'ml-0'
                            }`}
                        >
                            <Footer />
                        </div>
                    </div>
                </AuthProvider>
            </TemaProvider>
        </BrowserRouter>
    )
}

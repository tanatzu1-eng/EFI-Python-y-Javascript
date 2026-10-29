import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexto/AuthContext'
import Navbar from './componentes/Navbar'
import Eventos from './tarjetas/Eventos'
import EventoDetalle from './tarjetas/EventoDetalle'
import Organizaciones from './tarjetas/Organizaciones'
import OrganizacionDetalle from './tarjetas/OrganizacionDetalle'
import Login from './tarjetas/Login'
import Registro from './tarjetas/Registro'
import Perfil from './tarjetas/Perfil'
import Admin from './tarjetas/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="mx-auto max-w-5xl p-4 py-8">
          <Routes>
            <Route path="/" element={<Eventos />} />
            <Route path="/eventos/:id" element={<EventoDetalle />} />
            <Route path="/organizaciones" element={<Organizaciones />} />
            <Route path="/organizaciones/:id" element={<OrganizacionDetalle />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<p className="py-10 text-center">Página no encontrada</p>} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}

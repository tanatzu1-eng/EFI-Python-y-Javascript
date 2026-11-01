import { createContext, useContext, useState } from 'react'

const TemaContext = createContext(null)

export function TemaProvider({ children }) {
    // Por default el tema es oscuro
    const [tema, setTema] = useState('oscuro')

    const alternarTema = (nuevoTema) => {
        setTema(nuevoTema)
    }

    const esOscuro = tema === 'oscuro'

    return (
        <TemaContext.Provider value={{ tema, alternarTema, esOscuro }}>
            <div className={esOscuro ? 'dark bg-slate-900 text-slate-100 min-h-screen' : 'bg-slate-50 text-slate-900 min-h-screen'}>
                {children}
            </div>
        </TemaContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTema() {
    return useContext(TemaContext)
}

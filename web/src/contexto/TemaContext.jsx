import { createContext, useContext, useState, useEffect } from 'react'

const TemaContext = createContext(null)

export function TemaProvider({ children }) {
    // Por default el tema es oscuro
    const [tema, setTema] = useState('oscuro')

    useEffect(() => {
        const raiz = document.documentElement
        if (tema === 'oscuro') {
            raiz.classList.add('dark')
            raiz.style.colorScheme = 'dark'
            document.body.className = 'bg-slate-900 text-slate-100 min-h-screen transition-colors duration-200'
        } else {
            raiz.classList.remove('dark')
            raiz.style.colorScheme = 'light'
            document.body.className = 'bg-slate-100 text-slate-900 min-h-screen transition-colors duration-200'
        }
    }, [tema])

    const alternarTema = (nuevoTema) => {
        setTema(nuevoTema)
    }

    const esOscuro = tema === 'oscuro'

    return (
        <TemaContext.Provider value={{ tema, alternarTema, esOscuro }}>
            <div className={esOscuro ? 'dark text-slate-100' : 'text-slate-900'}>
                {children}
            </div>
        </TemaContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTema() {
    return useContext(TemaContext)
}

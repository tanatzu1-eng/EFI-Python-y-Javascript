import { useEffect, useState } from 'react'

// Carga datos de la API y expone { data, error, loading, reload }
export function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [tick, setTick] = useState(0) 

  useEffect(() => {
    let activo = true
    fn()
      .then((data) => activo && setState({ data, error: null, loading: false }))
      .catch((e) => activo && setState({ data: null, error: e.message, loading: false }))
    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = () => setTick((t) => t + 1)

  return { ...state, reload }
}

export const fmtFecha = (iso) =>
  new Date(iso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

export const fmtPrecio = (n) =>
  n === 0 ? 'Gratis' : n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })

// La API exige fechas con zona horaria: del <input datetime-local> a ISO UTC y viceversa
export const aIsoUtc = (local) => new Date(local).toISOString()

export const aInputLocal = (iso) => {
  const d = new Date(iso)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}
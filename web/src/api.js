// Cliente de la API de FastAPI. Todas las llamadas pasan por request().
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con la API. ¿Está corriendo en ' + BASE + '?')
  }

  if (!res.ok) {
    let msg = `Error ${res.status}`
    try {
      const data = await res.json()
      if (typeof data.detail === 'string') msg = data.detail
      else if (Array.isArray(data.detail))
        msg = data.detail.map((d) => `${d.loc?.slice(1).join('.')}: ${d.msg}`).join(' | ')
    } catch { /* sin cuerpo JSON */ }
    throw new Error(msg)
  }
  return res.json()
}

const get = (p) => request(p)
const post = (p, body) => request(p, { method: 'POST', body })
const put = (p, body) => request(p, { method: 'PUT', body })
const del = (p) => request(p, { method: 'DELETE' })

export const api = {
  eventos: {
    list: () => get('/eventos/'),
    get: (id) => get(`/eventos/${id}`),
    create: (d) => post('/eventos/', d),
    update: (id, d) => put(`/eventos/${id}`, d),
    remove: (id) => del(`/eventos/${id}`),
  },
  organizaciones: {
    list: () => get('/organizaciones/'),
    get: (id) => get(`/organizaciones/${id}`),
    create: (d) => post('/organizaciones/', d),
    update: (id, d) => put(`/organizaciones/${id}`, d),
    remove: (id) => del(`/organizaciones/${id}`),
  },
  usuarios: {
    list: () => get('/usuarios/'),
    get: (id) => get(`/usuarios/${id}`),
    create: (d) => post('/usuarios/', d),
    login: (email, contrasenia) => post('/usuarios/login', { email, contrasenia }),
    remove: (id) => del(`/usuarios/${id}`),
  },
  suscripciones: {
    list: () => get('/suscripciones/'),
    create: (usuario_id, organizacion_id) => post('/suscripciones/', { usuario_id, organizacion_id }),
    remove: (id) => del(`/suscripciones/${id}`),
  },
}
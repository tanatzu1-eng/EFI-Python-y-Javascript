// Cliente de conexion con la API de FastAPI.
const BASE = import.meta.env.VITE_API_URL ?? 'https://efi-de-python-y-javascript.fastapicloud.dev'

async function request(path, options = {}) {
    let res
    try {
        res = await fetch(`${BASE}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
            body: options.body ? JSON.stringify(options.body) : undefined,
        })
    } catch {
        throw new Error('No se pudo conectar con el servidor.')
    }

    if (!res.ok) {
        let mensaje = 'Error ' + res.status
        try {
            const data = await res.json()
            if (typeof data.detail === 'string') {
                mensaje = data.detail
            } else if (Array.isArray(data.detail)) {
                mensaje = data.detail.map((d) => d.msg).join(' - ')
            }
        } catch {
            // Sin cuerpo json
        }
        throw new Error(mensaje)
    }

    return res.json()
}

const get = (path) => request(path)
const post = (path, body) => request(path, { method: 'POST', body })
const put = (path, body) => request(path, { method: 'PUT', body })
const del = (path) => request(path, { method: 'DELETE' })

// Funcion auxiliar para desarmar la paginacion si viene { items: [...] }
async function getLista(path) {
    const data = await get(path)
    if (data && Array.isArray(data.items)) {
        return data.items
    }
    if (Array.isArray(data)) {
        return data
    }
    return []
}

export const api = {
    eventos: {
        list: () => getLista('/eventos/?size=100'),
        get: (id) => get(`/eventos/${id}`),
        create: (datos) => post('/eventos/', datos),
        update: (id, datos) => put(`/eventos/${id}`, datos),
        remove: (id) => del(`/eventos/${id}`),
    },
    organizaciones: {
        list: () => getLista('/organizaciones/?size=100'),
        get: (id) => get(`/organizaciones/${id}`),
        create: (datos) => post('/organizaciones/', datos),
        update: (id, datos) => put(`/organizaciones/${id}`, datos),
        remove: (id) => del(`/organizaciones/${id}`),
    },
    usuarios: {
        list: () => getLista('/usuarios/?size=100'),
        get: (id) => get(`/usuarios/${id}`),
        create: (datos) => post('/usuarios/', datos),
        login: (email, contrasenia) => post('/usuarios/login', { email, contrasenia }),
        remove: (id) => del(`/usuarios/${id}`),
    },
    suscripciones: {
        list: () => getLista('/suscripciones/?size=100'),
        create: (usuario_id, organizacion_id) => post('/suscripciones/', { usuario_id, organizacion_id }),
        remove: (id) => del(`/suscripciones/${id}`),
    },
}

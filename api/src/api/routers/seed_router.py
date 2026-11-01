# ROUTER TEMPORAL - BORRAR DESPUÉS DEL SEED
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..database import get_db
from ..models import organizacion_modelo, evento_modelo, usuario_modelo
from datetime import datetime, timezone

router = APIRouter(prefix="/seed", tags=["seed"])


@router.get("/status")
def status(db: Session = Depends(get_db)):
    orgs   = len(db.exec(select(organizacion_modelo.Organizacion)).all())
    evs    = len(db.exec(select(evento_modelo.Evento)).all())
    users  = db.exec(select(usuario_modelo.Usuario)).all()
    return {
        "organizaciones": orgs,
        "eventos": evs,
        "usuarios": [{"id": u.id, "nombre": u.nombre, "email": u.email, "rol": u.rol} for u in users],
    }

ORGANIZACIONES = [
    "Fundación por la Cultura",
    "Asociación Riocuartense de Plásticos (ARP)",
    "Camerata Vocal Arsis",
    "Río Cuarto Tango Club",
    "Amigos por la Música",
    "SADE Río Cuarto",
    "Murga Pateando Sapos",
    "Asociación Biblioteca Popular Mariano Moreno",
    "Centro Cultural Leonardo Favio",
    "Centro Cultural Ojo de Barro",
    "Centro Cultural del Andino",
    "Centro Cultural Viejo Mercado",
    "Sala Mascaviento",
    "Casa de la Cultura",
    "Teatro Municipal",
    "Teatrino de la Trapalanda",
    "Museo Histórico Regional",
    "Museo Municipal Héroes de Malvinas",
    "Museo Municipal de Bellas Artes",
    "Museo del Riel",
    "Tintorería Japonesa",
    "Biblioteca Popular Mariano Moreno",
    "Biblioteca Popular Domingo Faustino Sarmiento",
    "Biblioteca Central Juan Filloy (UNRC)",
    "Casa de la Memoria",
]

EVENTOS = [
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 1},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 2},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 3},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 4},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 5},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 6},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 7},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 8},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 9},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 10},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 11},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 12},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 13},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 14},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 15},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 16},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 17},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 18},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 19},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 20},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 21},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 22},
    {"nombre": "Evento Ficticio",    "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-20T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 23},
    {"nombre": "Evento Ficticio 2",  "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-21T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio 3",  "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-22T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio 4",  "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-24T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio 5",  "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-25T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio 6",  "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-26T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio 7",  "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-27T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio 8",  "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-28T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio 9",  "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-29T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
    {"nombre": "Evento Ficticio 10", "precio_entrada": 10000.0, "disponible": True, "descripcion": "string", "fecha": "2026-11-30T22:10:20.921000Z", "lugar": "Lugar Ficticio", "org_idx": 0},
]

ADMINS = ["noelruegger@gmail.com", "lucabrown@gmail.com"]


@router.get("/")
def seed(db: Session = Depends(get_db)):
    resultados = {"organizaciones": 0, "eventos": 0, "admins_actualizados": 0}

    # 1. Organizaciones (solo las que no existen)
    org_ids = []
    for nombre in ORGANIZACIONES:
        existente = db.exec(
            select(organizacion_modelo.Organizacion).where(
                organizacion_modelo.Organizacion.nombre == nombre
            )
        ).first()
        if existente:
            org_ids.append(existente.id)
        else:
            nueva = organizacion_modelo.Organizacion(nombre=nombre)
            db.add(nueva)
            db.commit()
            db.refresh(nueva)
            org_ids.append(nueva.id)
            resultados["organizaciones"] += 1

    # 2. Eventos (solo si no hay ninguno todavía)
    total_eventos = len(db.exec(select(evento_modelo.Evento)).all())
    if total_eventos == 0:
        for e in EVENTOS:
            nuevo = evento_modelo.Evento(
                nombre=e["nombre"],
                precio_entrada=e["precio_entrada"],
                disponible=e["disponible"],
                descripcion=e["descripcion"],
                fecha=datetime.fromisoformat(e["fecha"].replace("Z", "+00:00")),
                lugar=e["lugar"],
                organizacion_id=org_ids[e["org_idx"]],
            )
            db.add(nuevo)
        db.commit()
        resultados["eventos"] = len(EVENTOS)

    # 3. Usuarios (crear si no existen, con el rol correcto)
    USUARIOS = [
        {"nombre": "Noel Ruegger Albert",  "email": "noelruegger@gmail.com",     "fecha_nacimiento": "2004-11-07", "contrasenia": "skubidubidu12", "rol": "Admin"},
        {"nombre": "Luca Brown",           "email": "lucabrown@gmail.com",        "fecha_nacimiento": "2002-10-10", "contrasenia": "12",            "rol": "Admin"},
        {"nombre": "Francisco Sbarra",     "email": "franciscosbarra@gmail.com",  "fecha_nacimiento": "2004-10-10", "contrasenia": "12",            "rol": "Usuario"},
    ]
    for datos in USUARIOS:
        u = db.exec(select(usuario_modelo.Usuario).where(usuario_modelo.Usuario.email == datos["email"])).first()
        if u:
            if u.rol != datos["rol"]:
                u.rol = datos["rol"]
                db.add(u)
                resultados["admins_actualizados"] += 1
        else:
            nuevo_u = usuario_modelo.Usuario(
                nombre=datos["nombre"],
                email=datos["email"],
                fecha_nacimiento=datos["fecha_nacimiento"],
                contrasenia=datos["contrasenia"],
                rol=datos["rol"],
            )
            db.add(nuevo_u)
            resultados["admins_actualizados"] += 1
    db.commit()

    return {"ok": True, "insertados": resultados}

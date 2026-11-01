from fastapi import FastAPI
from sqlmodel import SQLModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination

# deploy:
from alembic.config import Config
from alembic import command
from contextlib import asynccontextmanager
from pathlib import Path

from .routers.usuario_router import router as usuario_router
from .routers.organizacion_router import router as organizacion_router
from .routers.evento_router import router as evento_router
from .routers.suscripcion_router import router as suscripcion_router
from .routers.seed_router import router as seed_router
from .database import engine
from .models import anidados, evento_modelo, organizacion_modelo, suscripcion_modelo, usuario_modelo


BASE_DIR = Path(__file__).resolve().parent.parent.parent

def run_migrations():
    ini_path = BASE_DIR / "alembic.ini"
    alembic_dir = BASE_DIR / "alembic"

    if not ini_path.exists():
        raise FileNotFoundError(f'no se encontro alembic.ini en: {ini_path}')

    alembic_cfg = Config(str(ini_path))

    alembic_cfg.set_main_option('script_location', str(alembic_dir))

    command.upgrade(alembic_cfg, 'head')

@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    yield


app = FastAPI(lifespan = lifespan)

app.title = "EFI Segundo anio - Python y Javascript"

app.description = "En esta EFI tenemos como objetivo crear una pagina web desde cero, incluyendo la API, la logica JS y el Front."

app.include_router(usuario_router)
app.include_router(organizacion_router)
app.include_router(evento_router)
app.include_router(suscripcion_router)
app.include_router(seed_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # siendo un entorno de pruebas, habilito cualquier puerto
    allow_credentials = False,
    allow_methods=["*"],
    allow_headers=["*"]
)


add_pagination(app)


SQLModel.metadata.create_all(bind = engine)

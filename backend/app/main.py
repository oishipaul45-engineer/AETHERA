from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routers.universe import router as universe_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="AETHERA API",
    description="The persistence engine for The Living Universe.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "PUT"],
    allow_headers=["Content-Type"],
)

app.include_router(universe_router)


@app.get("/")
def root():
    return {
        "application": "AETHERA",
        "message": "The Living Universe API",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "application": "AETHERA",
        "database": "SQLite",
    }

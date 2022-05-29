import logging
from fastapi import FastAPI
from server.server_routes import server_router
from server.database import model_registry
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

logging.basicConfig(
    format="%(name)s - %(levelname)s - %(asctime)s - %(message)s",
    level=logging.DEBUG,
)

Logger = logging.getLogger(__name__)

origins = ["*"]

# Middleware to allow for Cross Origin Requests while developing
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    """Startup Configuration runs before api starts"""

    await model_registry.create_all()
    Logger.info("Database and tables created")


app.include_router(server_router)

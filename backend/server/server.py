import logging
from server.server_routes import server_router
from server.database import model_registry
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

logging.basicConfig(
    format="%(name)s - %(levelname)s - %(asctime)s - %(message)s",
    level=logging.DEBUG,
    filename="log.txt"
)

logger = logging.getLogger(__name__)

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
    logger.info("Database and tables created")


@app.get("/")
def index():
    return "Hello World"


app.include_router(server_router)

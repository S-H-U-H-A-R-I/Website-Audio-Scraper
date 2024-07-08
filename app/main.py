from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .routes import web_routes, api_routes

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")

app.include_router(web_routes.router)
app.include_router(api_routes.router)
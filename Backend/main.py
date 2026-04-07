from fastapi import FastAPI
from App.routers import users_route
from App.routers import candidate_documents_route
import uvicorn
from App.config.db_connection import engine
from App.model.Base import Base

app= FastAPI()

@app.on_event("startup")
def _create_tables() -> None:
    Base.metadata.create_all(bind=engine)

app.include_router(users_route.router)
app.include_router(candidate_documents_route.router)

if __name__ == "__main__":
   uvicorn.run(app, host="0.0.0.0", port=8000)
   Base.metadata.create_all(bind=engine)
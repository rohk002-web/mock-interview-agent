from fastapi import FastAPI
from App.routers import users_route
from App.routers import candidate_documents_route
from App.routers import candidate_interview_details
from App.routers import start_interview
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from App.config.db_connection import engine
from App.model.Base import Base
from dotenv import load_dotenv
import os

app= FastAPI()

load_dotenv()
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _create_tables() -> None:
    Base.metadata.create_all(bind=engine)

app.include_router(users_route.router)
app.include_router(candidate_documents_route.router)
app.include_router(candidate_interview_details.router)
app.include_router(start_interview.router)


if __name__ == "__main__":
   uvicorn.run(app, host="0.0.0.0", port=8000)
from fastapi import FastAPI
from App.routers import users_route
from App.routers import candidate_documents_route
from App.routers import candidate_interview_details
from App.routers import start_interview
import uvicorn
from App.config.db_connection import engine
from App.model.Base import Base

app= FastAPI()

@app.on_event("startup")
def _create_tables() -> None:
    Base.metadata.create_all(bind=engine)

app.include_router(users_route.router)
app.include_router(candidate_documents_route.router)
app.include_router(candidate_interview_details.router)
app.include_router(start_interview.router)
if __name__ == "__main__":
   uvicorn.run(app, host="0.0.0.0", port=8000)
   Base.metadata.create_all(bind=engine)
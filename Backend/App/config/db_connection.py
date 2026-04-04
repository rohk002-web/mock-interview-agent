from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise ValueError("Database url is not avalailable in env file.")


engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, bind=engine)

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()



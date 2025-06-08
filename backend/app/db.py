from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency que se usa en FastAPI para obtener la sesión DB por request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import FastAPI
from .db import Base, engine
from .email_reader import check_emails

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API is running"}

@app.post("/run-email-check")
def run_email_reader():
    check_emails()
    return {"status": "Email script executed"}
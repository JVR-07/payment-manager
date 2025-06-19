from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db import get_db, engine
from app import models, schemas
from app.models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create User
@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        return db_user
    db_user = models.User(email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get Clients by User
@app.get("/users/{user_id}/clients", response_model=list[schemas.ClientOut])
def get_clients_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Client).filter(models.Client.user_id == user_id).all()

# Create Client
@app.post("/clients/", response_model=schemas.ClientOut)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    if db.query(models.Client).filter(models.Client.name == client.name).first():
        raise HTTPException(status_code=400, detail="Ya existe un cliente con ese nombre")
    if db.query(models.Client).filter(models.Client.alias == client.alias).first():
        raise HTTPException(status_code=400, detail="Ya existe un cliente con ese alias")
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

# Delete Client
@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
    return {"detail": "Client deleted"}

# Get Payments by Client
@app.get("/clients/{client_id}/payments", response_model=list[schemas.PaymentOut])
def get_payments_by_client(client_id: int, db: Session = Depends(get_db)):
    return db.query(models.Payment).filter(models.Payment.client_id == client_id).all()
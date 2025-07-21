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

@app.get("/")
def root():
    return {"message": "API funcionando"}

@app.post("/clients/", response_model=schemas.ClientOut)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    if db.query(models.Client).filter(models.Client.name == client.name).first():
        raise HTTPException(status_code=400, detail="Ya existe un cliente con ese nombre")
    if db.query(models.Client).filter(models.Client.alias == client.alias).first():
        raise HTTPException(status_code=400, detail="Ya existe un cliente con ese alias")
    db_client = models.Client(
        name=client.name,
        alias=client.alias,
        creation_date=client.creation_date,
        email=client.email,
        phone=client.phone
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/clients/", response_model=list[schemas.ClientOut])
def get_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
    return {"detail": "Client deleted"}


@app.post("/contracts/", response_model=schemas.ContractOut)
def create_contract(contract: schemas.ContractCreate, db: Session = Depends(get_db)):
    db_contract = models.Contract(
        first_payment_date=contract.first_payment_date,
        total_amount=contract.total_amount,
        total_payments=contract.total_payments,
        client_id=contract.client_id,
        status=contract.status
    )
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

@app.get("/clients/{client_id}/contracts", response_model=list[schemas.ContractOut])
def get_contracts_by_client(client_id: int, db: Session = Depends(get_db)):
    return db.query(models.Contract).filter(models.Contract.client_id == client_id).all()


@app.post("/payments/", response_model=schemas.PaymentOut)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    db_payment = models.Payment(
        payment_date=payment.payment_date,
        payment_amount=payment.payment_amount,
        status=payment.status or "Pending",
        contract_id=payment.contract_id
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@app.get("/contracts/{contract_id}/payments", response_model=list[schemas.PaymentOut])
def get_payments_by_contract(contract_id: int, db: Session = Depends(get_db)):
    return db.query(models.Payment).filter(models.Payment.contract_id == contract_id).all()
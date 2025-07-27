from fastapi import FastAPI, Depends, HTTPException, Body, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db import get_db, engine
from app import models, schemas
from app.models import Base
from pydantic import BaseModel
from bs4 import BeautifulSoup
import os
import requests
import base64
import re

class TokenRequest(BaseModel):
    access_token: str
    refresh_token: str = None

Base.metadata.create_all(bind=engine)

app = FastAPI()

router = APIRouter()

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

@app.get("/clients/{alias}", response_model=schemas.ClientOut)
def get_client_by_alias(alias: str, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Clients.alias == alias).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

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

@app.put("/payments/{payment_id}", response_model=schemas.PaymentOut)
def update_payment(payment_id: int, updated_data: schemas.PaymentUpdate, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if updated_data.payment_date is not None:
        payment.payment_date = updated_data.payment_date
    if updated_data.payment_amount is not None:
        payment.payment_amount = updated_data.payment_amount
    if updated_data.status is not None:
        payment.status = updated_data.status
    
    db.commit()
    db.refresh(payment)
    return payment

@app.get("/contracts/{contract_id}/payments", response_model=list[schemas.PaymentOut])
def get_payments_by_contract(contract_id: int, db: Session = Depends(get_db)):
    return db.query(models.Payment).filter(models.Payment.contract_id == contract_id).order_by(models.Payment.id).all()

@app.post("/movements/", response_model=schemas.MovementOut)
def create_movement(movement: schemas.MovementCreate, db: Session = Depends(get_db)):
    db_movement = models.Movement(
        amount=movement.amount,
        concept=movement.concept,
        movement_date=movement.movement_date,
        cdr=movement.cdr,
        status = movement.status or "Unassigned",
        payment_id=movement.payment_id
    )
    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)
    return db_movement

@app.get("/movements/", response_model=list[schemas.MovementOut])
def get_movements(db: Session = Depends(get_db)):
    return db.query(models.Movement).all()

@app.put("/movements/{cdr}", response_model=schemas.MovementOut)
def update_movement(cdr: int, updated_data: schemas.MovementUpdate, db: Session = Depends(get_db)):
    movement = db.query(models.Movement).filter(models.Movement.cdr == cdr).first()
    if not movement:
        raise HTTPException(status_code=404, detail="Movement not found")

    if updated_data.amount is not None:
        movement.amount = updated_data.amount
    if updated_data.concept is not None:
        movement.concept = updated_data.concept
    if updated_data.movement_date is not None:
        movement.movement_date = updated_data.movement_date
    if updated_data.status is not None:
        movement.status = updated_data.status
    if updated_data.payment_id is not None:
        movement.payment_id = updated_data.payment_id

    db.commit()
    db.refresh(movement)
    return movement

@app.get("/systemutils/{key}", response_model=schemas.SystemUtilsOut)
def get_system_value(key: str, db: Session = Depends(get_db)):
    item = db.query(models.SystemUtils).filter(models.SystemUtils.key == key).first()
    if not item:
        raise HTTPException(status_code=404, detail="Key not found")
    return item

@app.post("/systemutils/", response_model=schemas.SystemUtilsOut)
def set_system_value(data: schemas.SystemUtilsCreate, db: Session = Depends(get_db)):
    item = db.query(models.SystemUtils).filter(models.SystemUtils.key == data.key).first()
    if item:
        item.value = data.value
    else:
        item = models.SystemUtils(key=data.key, value=data.value)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item

@app.post("/google/exchange-code/")
def exchange_code(data: dict = Body(...)):
    code = data.get("code")
    redirect_uri = data.get("redirectUri")
    code_verifier = data.get("codeVerifier")
    client_id = os.getenv("GOOGLE_CLIENT_ID_WEB")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET_WEB")
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
        "code_verifier": code_verifier
    }
    res = requests.post(token_url, data=payload)
    return res.json()

#Router
@router.post("/get-emails/")
def get_gmail_emails(data: dict = Body(...), db: Session = Depends(get_db)):
    access_token = data.get("accessToken")
    if not access_token:
        raise HTTPException(status_code=400, detail="Access token required")

    email_address = os.getenv("EMAIL_ADDRESS")
    if not email_address:
        raise HTTPException(status_code=500, detail="EMAIL_ADDRESS not set in .env")

    headers = {"Authorization": f"Bearer {access_token}"}
    query = f'from:{email_address} subject:Recibiste'
    list_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages"
    list_params = {"q": query}

    list_res = requests.get(list_url, headers=headers, params=list_params)
    if list_res.status_code != 200:
        raise HTTPException(status_code=list_res.status_code, detail=list_res.text)

    messages = list_res.json().get("messages", [])
    emails = []

    for msg in messages:
        msg_id = msg["id"]
        msg_url = f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}"
        msg_res = requests.get(msg_url, headers=headers)

        if msg_res.status_code == 200:
            msg_data = msg_res.json()
            headers_data = msg_data.get("payload", {}).get("headers", [])
            snippet = msg_data.get("snippet", "")
            payload = msg_data.get("payload", {})

            subject = next((h["value"] for h in headers_data if h["name"] == "Subject"), "(Sin asunto)")
            from_email = next((h["value"] for h in headers_data if h["name"] == "From"), "(Desconocido)")
            date = next((h["value"] for h in headers_data if h["name"] == "Date"), "(Sin fecha)")

            body = ""
            parts = payload.get("parts", [])
            
            saved_count = 0
            
            for part in parts:
                if part.get("mimeType") == "text/html":
                    data = part.get("body", {}).get("data")
                    if data:
                        decoded_bytes = base64.urlsafe_b64decode(data + '==')
                        body = decoded_bytes.decode("utf-8")
                        break

            _amount, _concept, _cdr = parse_email_body(body)
            _cdr = _cdr[3:]

            if not _cdr:
                continue
            existing = db.query(models.Movement).filter(models.Movement.cdr == _cdr).first()
            if existing:
                continue

            db_movement = models.Movement(
                amount=_amount,
                concept=_concept,
                movement_date=date,
                cdr=_cdr,
                payment_id=None
            )
            db.add(db_movement)
            db.commit()
            db.refresh(db_movement)
            
            emails.append({
                "subject": subject,
                "from": from_email,
                "date": date,
                "snippet": snippet,
                "monto": _amount,
                "concepto": _concept,
                "cdr": _cdr,
            })
        saved_count += 1    

    return {"message": "Sync completed", "saved_count": saved_count}

def parse_email_body(html_body):
    soup = BeautifulSoup(html_body, "html.parser")

    monto = None
    concepto = None
    cdr = None

    monto_label = soup.find(text=re.compile(r'Monto', re.I))
    if monto_label:
        next_node = monto_label.find_next()
        if next_node:
            monto_text = next_node.get_text(strip=True)
            monto = re.sub(r"[^\d\.]", "", monto_text)

    concepto_label = soup.find(text=re.compile(r'Concepto', re.I))
    if concepto_label:
        next_node = concepto_label.find_next()
        if next_node:
            concepto = next_node.get_text(strip=True)

    cdr_label = soup.find(text=re.compile(r'Clave de rastreo', re.I))
    if cdr_label:
        next_node = cdr_label.find_next()
        if next_node:
            cdr = next_node.get_text(strip=True)

    return monto, concepto, cdr


# end
app.include_router(router)
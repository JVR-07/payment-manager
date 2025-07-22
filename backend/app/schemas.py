from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

class ClientCreate(BaseModel):
    name: str
    alias: str
    creation_date: date
    email: Optional[str] = None
    phone: Optional[str] = None

class ClientOut(BaseModel):
    id: int
    name: str
    alias: str
    creation_date: date
    email: Optional[str]
    phone: Optional[str]

    class Config:
        orm_mode = True

class ContractCreate(BaseModel):
    first_payment_date: date
    total_amount: float
    total_payments: int
    client_id: int
    status: str

class ContractOut(BaseModel):
    id: int
    first_payment_date: date
    total_amount: float
    total_payments: int
    client_id: int
    status: str

    class Config:
        orm_mode = True

class PaymentCreate(BaseModel):
    payment_date: date
    payment_amount: float
    status: Optional[str] = "Pending"
    contract_id: int

class PaymentOut(BaseModel):
    id: int
    payment_date: date
    payment_amount: float
    status: str
    contract_id: int

    class Config:
        orm_mode = True

class MovementCreate(BaseModel):
    amount: float
    concept: str
    movement_date: date
    cdr: str
    payment_id: Optional[int] = None

class MovementOut(BaseModel):
    id: int
    amount: float
    concept: str
    movement_date: date
    cdr: str
    payment_id: Optional[int]

    class Config:
        orm_mode = True

class SystemUtilsOut(BaseModel):
    id: int
    key: str
    value: Optional[str]

    class Config:
        orm_mode = True

class SystemUtilsCreate(BaseModel):
    key: str
    value: Optional[str]
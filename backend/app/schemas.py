from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class AuthorizedUsersOut(BaseModel):
    id: int
    email: str
    movadmin: bool

    class Config:
        orm_mode = True

class ClientCreate(BaseModel):
    name: str
    creation_date: date
    email: Optional[str] = None
    phone: str

class ClientOut(BaseModel):
    id: int
    name: str
    creation_date: date
    email: Optional[str]
    phone: str

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
    
class PaymentUpdate(BaseModel):
    payment_date: Optional[date] = None
    payment_amount: Optional[float] = None
    status: Optional[str] = None

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
    movement_date: datetime
    cdr: str
    status: Optional[str] = "Unnasigned"
    payment_id: Optional[int] = None
    
class MovementUpdate(BaseModel):
    amount: Optional[float] = None
    concept: Optional[str] = None
    movement_date: Optional[datetime] = None
    status: Optional[str] = None
    payment_id: Optional[int] = None

class MovementOut(BaseModel):
    id: int
    amount: float
    concept: str
    movement_date: datetime
    cdr: str
    status: str
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
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User
class UserCreate(BaseModel):
    email: EmailStr

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True

# Client
class ClientCreate(BaseModel):
    name: str
    alias: str
    amount_due: float
    due_day: int
    email: Optional[str] = None
    phone: Optional[str] = None
    user_id: int

class ClientOut(BaseModel):
    id: int
    name: str
    alias: str
    amount_due: float
    due_day: int
    email: Optional[str]
    phone: Optional[str]

    class Config:
        orm_mode = True

# Payment
class PaymentOut(BaseModel):
    id: int
    amount: float
    concept: Optional[str]
    timestamp: datetime

    class Config:
        orm_mode = True

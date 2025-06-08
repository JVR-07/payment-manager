from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    alias = Column(String, nullable=False)
    amount_due = Column(Numeric(10,2), nullable=False)
    due_day = Column(Integer, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    payments = relationship("Payment", back_populates="client")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    amount = Column(Numeric(10,2), nullable=False)
    description = Column(String, nullable=True)

    client = relationship("Client", back_populates="payments")
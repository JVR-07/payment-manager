from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Client(Base):
    __tablename__ = "clients"
    id = Column("ClientID", Integer, primary_key=True, index=True)
    name = Column("Name", String(80), nullable=False)
    alias = Column("Alias", String(20), nullable=False)
    creation_date = Column("CreationDate", Date, nullable=False)
    email = Column("Email", String(100), nullable=True)
    phone = Column("Phone", String(20), nullable=True)
    contracts = relationship("Contract", back_populates="client")

class Contract(Base):
    __tablename__ = "contracts"
    id = Column("ContractID", Integer, primary_key=True, index=True)
    first_payment_date = Column("FirstPaymentDate", Date, nullable=False)
    total_amount = Column("TotalAmount", Numeric(10, 2), nullable=False)
    total_payments = Column("TotalPayments", SmallInteger, nullable=False)
    client_id = Column("ClientID", Integer, ForeignKey("clients.ClientID"), nullable=False)
    client = relationship("Client", back_populates="contracts")
    payments = relationship("Payment", back_populates="contract")

class Payment(Base):
    __tablename__ = "payments"
    id = Column("PaymentID", Integer, primary_key=True, index=True)
    payment_date = Column("PaymentDate", Date, nullable=False)
    payment_amount = Column("PaymentAmount", Numeric(10, 2), nullable=False)
    contract_id = Column("ContractID", Integer, ForeignKey("contracts.ContractID"), nullable=False)
    contract = relationship("Contract", back_populates="payments")
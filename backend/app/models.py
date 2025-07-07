from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Client(Base):
    __tablename__ = "clients"
    id = Column("clientid", Integer, primary_key=True, index=True)
    name = Column("name", String(80), nullable=False)
    alias = Column("alias", String(20), nullable=False)
    creation_date = Column("creationdate", Date, nullable=False)
    email = Column("email", String(100), nullable=True)
    phone = Column("phone", String(20), nullable=True)
    contracts = relationship("Contract", back_populates="client")

class Contract(Base):
    __tablename__ = "contracts"
    id = Column("contractid", Integer, primary_key=True, index=True)
    first_payment_date = Column("firstpaymentdate", Date, nullable=False)
    total_amount = Column("totalamount", Numeric(10, 2), nullable=False)
    total_payments = Column("totalpayments", SmallInteger, nullable=False)
    client_id = Column("clientid", Integer, ForeignKey("clients.clientid"), nullable=False)
    client = relationship("Client", back_populates="contracts")
    payments = relationship("Payment", back_populates="contract")

class Payment(Base):
    __tablename__ = "payments"
    id = Column("paymentid", Integer, primary_key=True, index=True)
    payment_date = Column("paymentdate", Date, nullable=False)
    payment_amount = Column("paymentamount", Numeric(10, 2), nullable=False)
    contract_id = Column("contractid", Integer, ForeignKey("contracts.contractid"), nullable=False)
    contract = relationship("Contract", back_populates="payments")
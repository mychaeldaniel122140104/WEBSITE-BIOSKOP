from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.types import JSON
from .meta import Base

class Ticket(Base):
    __tablename__ = 'tickets'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    thumbnail = Column(String(255), nullable=False)
    showtimes = Column(MutableList.as_mutable(JSON), nullable=False)  # simpan array waktu tayang
    date = Column(String(100), nullable=False)
    price = Column(String(50), nullable=False)
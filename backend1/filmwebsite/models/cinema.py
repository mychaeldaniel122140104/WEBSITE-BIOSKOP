from sqlalchemy import Column, Integer, String
from .meta import Base

class Cinema(Base):
    __tablename__ = 'cinemas'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    address = Column(String)
    phone = Column(String)
    image = Column(String, default='default.jpg')  # 👈 default image
    price_weekday = Column(String)
    price_weekend = Column(String)

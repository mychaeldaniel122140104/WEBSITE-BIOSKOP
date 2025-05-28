# models.py
from sqlalchemy import Column, Integer, String
from .meta import Base

class HargaMakanan(Base):
    __tablename__ = 'harga_makanan'
    id = Column(Integer, primary_key=True)
    popcorn_caramel = Column(Integer)
    popcorn_keju = Column(Integer)
    sosis_bakar = Column(Integer)
    cola_dingin = Column(Integer)
    es_teh_manis = Column(Integer)
    milkshake_coklat = Column(Integer)

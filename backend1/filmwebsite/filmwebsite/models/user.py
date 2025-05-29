from sqlalchemy import Column, Integer, String
from .meta import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)  # nanti bisa di-hash
    role = Column(Integer, nullable=False, default=2)  # 1 = admin, 2 = user

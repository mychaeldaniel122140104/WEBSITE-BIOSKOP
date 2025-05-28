from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from .meta import Base

class SeatReservation(Base):
    __tablename__ = 'seat_reservations'

    id = Column(Integer, primary_key=True)
    movie_title = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    seat_id = Column(String, nullable=False)  # contoh: 'S1', 'S2', dll

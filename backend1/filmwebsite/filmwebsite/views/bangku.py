from pyramid.view import view_config
from pyramid.response import Response
import json
from datetime import datetime
from ..models import SeatReservation
import transaction

from pyramid.view import view_config
from pyramid.response import Response
import json
from datetime import datetime
from ..models import SeatReservation

@view_config(route_name='get_seats', renderer='json', request_method='GET')
def get_seats(request):
    title = request.params.get('title')
    date_str = request.params.get('date')
    time_str = request.params.get('time')

    # Jika tidak ada parameter, tampilkan contoh usage
    if not any([title, date_str, time_str]):
        return {
            "error": "Missing parameters",
            "usage": "GET /api/seats?title=MovieTitle&date=YYYY-MM-DD&time=HH:MM",
            "example": "/api/seats?title=Avengers&date=2024-01-15&time=19:30",
            "description": "Get reserved seats for specific movie, date, and time"
        }

    # Jika ada parameter tapi tidak lengkap
    if not all([title, date_str, time_str]):
        missing = []
        if not title:
            missing.append("title")
        if not date_str:
            missing.append("date")
        if not time_str:
            missing.append("time")
        
        return {
            "error": f"Missing required parameters: {', '.join(missing)}",
            "received": {
                "title": title,
                "date": date_str,
                "time": time_str
            }
        }

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        time = datetime.strptime(time_str, '%H:%M').time()
    except ValueError as e:
        return {
            "error": "Invalid date or time format",
            "details": str(e),
            "expected_formats": {
                "date": "YYYY-MM-DD (e.g., 2024-01-15)",
                "time": "HH:MM (e.g., 19:30)"
            }
        }

    try:
        seats = request.dbsession.query(SeatReservation).filter_by(
            movie_title=title,
            date=date,
            time=time
        ).all()

        seat_list = [{"seat_id": seat.seat_id} for seat in seats]
        
        return {
            "movie_title": title,
            "date": date_str,
            "time": time_str,
            "reserved_seats": seat_list,
            "total_reserved": len(seat_list)
        }
        
    except Exception as e:
        return {
            "error": "Database error",
            "details": str(e)
        }


@view_config(route_name='get_all_reservations', renderer='json', request_method='GET')
def get_all_reservations(request):
    """Endpoint untuk melihat semua reservasi (untuk debugging)"""
    try:
        all_reservations = request.dbsession.query(SeatReservation).all()
        
        reservations_data = []
        for reservation in all_reservations:
            reservations_data.append({
                "id": reservation.id,
                "movie_title": reservation.movie_title,
                "date": reservation.date.strftime('%Y-%m-%d'),
                "time": reservation.time.strftime('%H:%M'),
                "seat_id": reservation.seat_id
            })
        
        return {
            "total_reservations": len(reservations_data),
            "reservations": reservations_data
        }
        
    except Exception as e:
        return {
            "error": "Database error",
            "details": str(e)
        }

@view_config(route_name='reserve_seats', renderer='json', request_method='POST')
def reserve_seats_view(request):
    session = request.dbsession
    
    try:
        data = request.json_body
        title = data['title']
        date_str = data['date']
        time_str = data['time']
        seats = data['seats']
        
        # Parse date and time (with multiple format support)
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        time = datetime.strptime(time_str, '%H:%M').time()
        
        # Begin explicit transaction
        session.begin()
        
        # Check existing seats
        existing_seats = session.query(SeatReservation).filter(
            SeatReservation.movie_title == title,
            SeatReservation.date == date,
            SeatReservation.time == time,
            SeatReservation.seat_id.in_(seats)
        ).all()

        if existing_seats:
            session.rollback()
            return {"error": "Some seats already reserved"}, 409

        # Save reservations
        for seat_id in seats:
            seat_reservation = SeatReservation(
                movie_title=title,
                date=date,
                time=time,
                seat_id=seat_id
            )
            session.add(seat_reservation)

        # Commit transaction
        session.commit()
        
        return {"message": "Seats reserved successfully"}
        
    except Exception as e:
        session.rollback()
        print(f"Error in reserve_seats_view: {e}")
        return {"error": str(e)}, 500
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

    if not all([title, date_str, time_str]):
        return {"error": "Missing parameters"}, 400

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        time = datetime.strptime(time_str, '%H:%M').time()
    except ValueError:
        return {"error": "Invalid date or time format"}, 400

    seats = request.dbsession.query(SeatReservation).filter_by(
        movie_title=title,
        date=date,
        time=time
    ).all()

    seat_list = [{"seat_id": seat.seat_id} for seat in seats]
    return seat_list


@view_config(route_name='reserve_seats', renderer='json', request_method='POST')
def reserve_seats_view(request):
    try:
        data = request.json_body
        title = data['title']
        date_str = data['date']
        time_str = data['time']
        seats = data['seats']  # list kursi yang dipesan
    except (KeyError, json.JSONDecodeError):
        return {"error": "Invalid request data"}, 400

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        time = datetime.strptime(time_str, '%H:%M').time()
    except ValueError:
        return {"error": "Invalid date or time format"}, 400

    # Cek kursi yang sudah terisi untuk mencegah double booking
    existing_seats = request.dbsession.query(SeatReservation).filter(
        SeatReservation.movie_title == title,
        SeatReservation.date == date,
        SeatReservation.time == time,
        SeatReservation.seat_id.in_(seats)
    ).all()

    if existing_seats:
        return {"error": "Some seats already reserved"}, 409

    # Simpan reservasi
    for seat_id in seats:
        seat_reservation = SeatReservation(
            movie_title=title,
            date=date,
            time=time,
            seat_id=seat_id
        )
        request.dbsession.add(seat_reservation)

    return {"message": "Seats reserved successfully"}

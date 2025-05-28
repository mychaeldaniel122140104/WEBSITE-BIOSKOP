
from pyramid.view import view_config
from pyramid.response import Response
from ..models.ticket import Ticket
import json
import logging
log = logging.getLogger(__name__)


@view_config(route_name='tickets', request_method='GET', renderer='json')
def get_tickets(request):
    session = request.dbsession
    from ..models.ticket import Ticket
    tickets = session.query(Ticket).all()
    return [{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "thumbnail": t.thumbnail,
        "showtimes": t.showtimes,
        "date":  str(t.date),  
        "price": t.price
    } for t in tickets]

@view_config(route_name='tickets', request_method='POST', renderer='json')
def create_ticket(request):
    try:
        data = request.json_body
        log.info(f"Received data: {data}")

        # cek tipe showtimes
        showtimes = data.get('showtimes')
        if not isinstance(showtimes, list):
            log.warning(f"showtimes should be a list, got {type(showtimes)}")

        session = request.dbsession

        ticket = Ticket(
            title=data['title'],
            description=data['description'],
            thumbnail=data['thumbnail'],
            showtimes=showtimes,
            date=data['date'],
            price=data['price'],
        )

        session.add(ticket)
        # Jangan commit, Pyramid yg urus commit/rollback

        log.info(f"Ticket created (not committed yet) with ID: {ticket.id}")

        return {'status': 'success', 'id': ticket.id}
    except Exception as e:
        log.error(f"Error saving ticket: {e}")
        request.response.status = 500
        return {'status': 'error', 'message': str(e)}

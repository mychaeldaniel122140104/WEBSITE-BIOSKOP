from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError
from ..models.user import User
import json

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    dbsession = request.dbsession
    try:
        data = request.json_body
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return Response(json.dumps({'message': 'Username dan password harus diisi'}),
                            content_type='application/json; charset=utf-8',
                            status=400)

        user = dbsession.query(User).filter_by(username=username).first()

        if not user:
            return Response(json.dumps({'message': 'Username tidak ditemukan'}),
                            content_type='application/json; charset=utf-8',
                            status=401)

        if user.password != password:
            return Response(json.dumps({'message': 'Password salah'}),
                            content_type='application/json; charset=utf-8',
                            status=401)

        request.session['user_id'] = user.id
        
        return Response(json.dumps({'message': 'Login berhasil'}),
                        content_type='application/json; charset=utf-8')

    except DBAPIError as e:
        return Response(json.dumps({'error': str(e)}),
                        content_type='application/json; charset=utf-8',
                        status=500)


@view_config(route_name='profile', renderer='json', request_method='GET')
def profile_view(request):
    try:
        user_id = request.session.get('user_id')  # Ambil dari session login

        if not user_id:
            # Kembalikan dict dan set status manual
            request.response.status = 401
            return {'message': 'Unauthorized'}

        user = request.dbsession.query(User).filter_by(id=user_id).first()

        if not user:
            request.response.status = 404
            return {'message': 'User tidak ditemukan'}

        return {
            'username': user.username,
            'email': user.email,
        }

    except Exception as e:
        request.response.status = 500
        return {'message': 'Server error', 'error': str(e)}


@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    dbsession = request.dbsession
    try:
        data = request.json_body
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return Response(json.dumps({'message': 'Username, email dan password harus diisi'}),
                            content_type='application/json; charset=utf-8',
                            status=400)

        existing_user = dbsession.query(User).filter_by(username=username).first()
        if existing_user:
            return Response(json.dumps({'message': 'Username sudah digunakan'}),
                            content_type='application/json; charset=utf-8',
                            status=400)

        new_user = User(username=username, email=email, password=password)
        dbsession.add(new_user)

        return Response(json.dumps({'message': 'Registrasi berhasil'}),
                        content_type='application/json; charset=utf-8')

    except DBAPIError as e:
        return Response(json.dumps({'error': str(e)}),
                        content_type='application/json; charset=utf-8',
                        status=500)
        
@view_config(route_name='get_users', renderer='json', request_method='GET')
def get_users(request):
    dbsession = request.dbsession
    users = dbsession.query(User).all()
    return [{"id": u.id, "username": u.username, "email": u.email} for u in users]

@view_config(route_name='create_user', renderer='json', request_method='POST')
def create_user(request):
    dbsession = request.dbsession
    try:
        data = request.json_body
        user = User(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password')  # nanti bisa di-hash
        )
        dbsession.add(user)
        dbsession.flush()
        # Cukup return dict, Pyramid yang urus JSON dan content type
        return {'message': 'User created'}
    except DBAPIError as e:
        request.response.status = 500
        return {'error': str(e)}

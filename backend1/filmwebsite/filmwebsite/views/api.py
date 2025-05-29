from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError
from sqlalchemy.exc import IntegrityError
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
        user_id = request.session.get('user_id')

        if not user_id:
            request.response.status = 401
            return {'message': 'Unauthorized'}

        user = request.dbsession.query(User).filter_by(id=user_id).first()

        if not user:
            request.response.status = 404
            return {'message': 'User tidak ditemukan'}

        return {
            'username': user.username,
            'email': user.email,
            'role': user.role
        }

    except Exception as e:
        request.response.status = 500
        return {'message': 'Server error', 'error': str(e)}


@view_config(route_name='get_users', renderer='json', request_method='GET')
def get_users(request):
    dbsession = request.dbsession
    try:
        users = dbsession.query(User).all()
        return [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
            }
            for u in users
        ]
    except DBAPIError as e:
        request.response.status = 500
        return {'error': str(e)}

    
@view_config(route_name='current_user', renderer='json', request_method='GET')
def get_current_user(request):
    # Asumsi Anda punya sistem session/auth
    # Ganti dengan logic authentication Anda
    user_id = request.session.get('user_id')  # atau dari JWT token
    
    if not user_id:
        request.response.status = 401
        return {'error': 'Not authenticated'}
    
    dbsession = request.dbsession
    try:
        user = dbsession.query(User).filter(User.id == user_id).first()
        if not user:
            request.response.status = 404
            return {'error': 'User not found'}
            
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "role_name": "Admin" if user.role == 1 else "User"
        }
    except DBAPIError as e:
        request.response.status = 500
        return {'error': str(e)}

# 1. ENDPOINT LAMA (jika masih ada) - beri nama berbeda
@view_config(route_name='create_user', renderer='json', request_method='POST')
def create_user(request):
    print("=== ENDPOINT LAMA DIPANGGIL ===")
    return {'message': 'Endpoint LAMA dipanggil'}

from sqlalchemy.orm import sessionmaker
from ..models.meta import Base
from sqlalchemy import create_engine

@view_config(route_name='register', renderer='json', request_method='POST') 
def register_user(request):
    print("=== ENDPOINT REGISTER DIPANGGIL ===")
    
    # Tambahkan CORS headers
    request.response.headers['Access-Control-Allow-Origin'] = '*'
    request.response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    request.response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    
    # Create a new session instead of using request.dbsession
    engine = request.registry.settings['sqlalchemy.url']
    Session = sessionmaker()
    engine = create_engine(engine)
    Session.configure(bind=engine)
    session = Session()
    
    try:
        # Validasi content type
        if not hasattr(request, 'json_body'):
            request.response.status = 400
            return {'message': 'Content-Type harus application/json'}
        
        data = request.json_body
        print(f"Data diterima: {data}")
        
        # Validasi field wajib
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        role_raw = data.get('role', 2)
        
        # Validasi input kosong
        if not username:
            request.response.status = 400
            return {'message': 'Username tidak boleh kosong'}
            
        if not email:
            request.response.status = 400
            return {'message': 'Email tidak boleh kosong'}
            
        if not password:
            request.response.status = 400
            return {'message': 'Password tidak boleh kosong'}
        
        # Validasi panjang password
        if len(password) < 3:
            request.response.status = 400
            return {'message': 'Password minimal 3 karakter'}
        
        print(f"Role raw: {role_raw}, type: {type(role_raw)}")
        
        # Konversi role dengan validasi
        try:
            role = int(role_raw)
            if role not in [1, 2]:
                role = 2
        except (ValueError, TypeError):
            role = 2
            
        print(f"Role final: {role}")
        
        # Cek apakah username sudah ada
        existing_user = session.query(User).filter_by(username=username).first()
        if existing_user:
            session.close()
            request.response.status = 409
            return {'message': 'Username sudah digunakan'}
        
        # Cek apakah email sudah ada
        existing_email = session.query(User).filter_by(email=email).first()
        if existing_email:
            session.close()
            request.response.status = 409
            return {'message': 'Email sudah digunakan'}

        # Buat user baru
        user = User(
            username=username,
            email=email,
            password=password,
            role=role
        )

        session.add(user)
        session.commit()
        
        print(f"User created successfully with ID: {user.id}, role: {user.role}")
        
        user_id = user.id
        user_role = user.role
        
        session.close()
        
        request.response.status = 201
        return {
            'message': 'Registrasi berhasil!',
            'user_id': user_id,
            'role_saved': user_role
        }

    except IntegrityError as e:
        print(f"Integrity Error: {e}")
        session.rollback()
        session.close()
        request.response.status = 409
        return {'message': 'Username atau email sudah digunakan'}
        
    except Exception as e:
        print(f"Unexpected Error: {e}")
        session.rollback()
        session.close()
        request.response.status = 500
        return {'message': 'Terjadi kesalahan server'}        


# 3. TEST ENDPOINT - untuk memastikan route bekerja
@view_config(route_name='test_register', renderer='json', request_method='GET')
def test_register(request):
    return {
        'message': 'Route register berfungsi!',
        'endpoint': '/api/register'
    }
import os
import uuid
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from sqlalchemy.exc import DBAPIError
from ..models import Cinema

UPLOAD_DIR = "static/uploads"

# Pastikan folder upload ada
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


def safe_get_post_data(request, key, default=''):
    """Safely get POST data and convert to string"""
    try:
        value = request.POST.get(key, default)
        if value is None:
            return default
        return str(value).strip()
    except:
        return default


def validate_required_fields(data_dict):
    """Validate required fields"""
    required_fields = ['name', 'address', 'phone', 'price_weekday', 'price_weekend']
    missing_fields = []
    
    for field in required_fields:
        if field not in data_dict or not data_dict[field] or data_dict[field].strip() == '':
            missing_fields.append(field)
    
    return missing_fields


@view_config(route_name='add_cinema', request_method='POST', renderer='json')
def add_cinema(request):
    try:
        print("=== ADD CINEMA REQUEST ===")
        print(f"Request method: {request.method}")
        print(f"Content type: {request.content_type}")
        print(f"POST data keys: {list(request.POST.keys())}")
        
        # Ambil data dari form dengan safe method
        data = {
            'name': safe_get_post_data(request, 'name'),
            'address': safe_get_post_data(request, 'address'),
            'phone': safe_get_post_data(request, 'phone'),
            'price_weekday': safe_get_post_data(request, 'price_weekday'),
            'price_weekend': safe_get_post_data(request, 'price_weekend')
        }
        
        print(f"Extracted data: {data}")
        
        # Validasi field wajib
        missing_fields = validate_required_fields(data)
        if missing_fields:
            error_msg = f"Field berikut wajib diisi: {', '.join(missing_fields)}"
            print(f"Validation error: {error_msg}")
            return HTTPBadRequest(json_body={'error': error_msg})

        # Handle file upload
        image_file = request.POST.get('image')
        filename = 'default.jpg'  # default
        
        if image_file is not None and hasattr(image_file, 'file') and hasattr(image_file, 'filename'):
            try:
                print(f"Processing image: {image_file.filename}")
                # Generate unique filename
                file_extension = 'jpg'
                if image_file.filename and '.' in image_file.filename:
                    file_extension = image_file.filename.split('.')[-1].lower()
                
                filename = f"{uuid.uuid4()}.{file_extension}"
                image_path = os.path.join(UPLOAD_DIR, filename)
                
                # Save file
                with open(image_path, 'wb') as f:
                    image_file.file.seek(0)
                    content = image_file.file.read()
                    f.write(content)
                
                print(f"Image saved successfully: {image_path}")
                
            except Exception as e:
                print(f"Error saving image: {str(e)}")
                filename = 'default.jpg'  # fallback to default

        # Create new Cinema object
        try:
            new_cinema = Cinema(
                name=data['name'],
                address=data['address'],
                phone=data['phone'],
                price_weekday=data['price_weekday'],
                price_weekend=data['price_weekend'],
                image=filename
            )
            
            print(f"Creating cinema object: {new_cinema}")
            
        except Exception as e:
            print(f"Error creating cinema object: {str(e)}")
            return HTTPBadRequest(json_body={'error': f'Error creating cinema: {str(e)}'})

        # Save to database
        try:
            request.dbsession.add(new_cinema)
            request.dbsession.flush()
            cinema_id = new_cinema.id
            
            print(f"Cinema saved with ID: {cinema_id}")
            return {'message': 'Cinema berhasil ditambahkan', 'id': cinema_id}
            
        except DBAPIError as db_error:
            print(f"Database error: {str(db_error)}")
            request.dbsession.rollback()
            return Response(
                json_body={'error': f'Database error: {str(db_error)}'}, 
                status=500
            )

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            json_body={'error': f'Server error: {str(e)}'}, 
            status=500
        )


@view_config(route_name='edit_cinema', request_method='POST', renderer='json')
def edit_cinema(request):
    try:
        print("=== EDIT CINEMA REQUEST ===")
        
        # Get cinema ID
        cinema_id_str = safe_get_post_data(request, 'id')
        if not cinema_id_str:
            return HTTPBadRequest(json_body={'error': 'ID cinema diperlukan'})
        
        try:
            cinema_id = int(cinema_id_str)
        except ValueError:
            return HTTPBadRequest(json_body={'error': 'ID cinema tidak valid'})
        
        # Find cinema
        cinema = request.dbsession.get(Cinema, cinema_id)
        if not cinema:
            return HTTPNotFound(json_body={'error': 'Cinema tidak ditemukan'})

        # Update data
        updates = {}
        for field in ['name', 'address', 'phone', 'price_weekday', 'price_weekend']:
            value = safe_get_post_data(request, field)
            if value:  # Only update if value is provided
                updates[field] = value
                setattr(cinema, field, value)

        print(f"Updates applied: {updates}")

        # Handle image update
        image_file = request.POST.get('image')
        if image_file is not None and hasattr(image_file, 'file') and hasattr(image_file, 'filename'):
            try:
                # Delete old image if exists and not default
                if cinema.image and cinema.image != 'default.jpg':
                    old_image_path = os.path.join(UPLOAD_DIR, cinema.image)
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)

                # Save new image
                file_extension = 'jpg'
                if image_file.filename and '.' in image_file.filename:
                    file_extension = image_file.filename.split('.')[-1].lower()
                
                filename = f"{uuid.uuid4()}.{file_extension}"
                image_path = os.path.join(UPLOAD_DIR, filename)
                
                with open(image_path, 'wb') as f:
                    image_file.file.seek(0)
                    f.write(image_file.file.read())
                
                cinema.image = filename
                print(f"Image updated: {filename}")
                
            except Exception as e:
                print(f"Error updating image: {str(e)}")

        # Save changes
        request.dbsession.flush()
        return {'message': 'Cinema berhasil diubah'}

    except Exception as e:
        print(f"Error in edit_cinema: {str(e)}")
        import traceback
        traceback.print_exc()
        request.dbsession.rollback()
        return Response(
            json_body={'error': f'Server error: {str(e)}'}, 
            status=500
        )


@view_config(route_name='delete_cinema', request_method='POST', renderer='json')
def delete_cinema(request):
    try:
        print("=== DELETE CINEMA REQUEST ===")
        
        cinema_id_str = safe_get_post_data(request, 'id')
        if not cinema_id_str:
            return HTTPBadRequest(json_body={'error': 'ID cinema diperlukan'})
        
        try:
            cinema_id = int(cinema_id_str)
        except ValueError:
            return HTTPBadRequest(json_body={'error': 'ID cinema tidak valid'})
        
        cinema = request.dbsession.get(Cinema, cinema_id)
        if not cinema:
            return HTTPNotFound(json_body={'error': 'Cinema tidak ditemukan'})

        # Delete image file
        if cinema.image and cinema.image != 'default.jpg':
            image_path = os.path.join(UPLOAD_DIR, cinema.image)
            if os.path.exists(image_path):
                try:
                    os.remove(image_path)
                    print(f"Image deleted: {image_path}")
                except Exception as e:
                    print(f"Warning: Could not delete image: {str(e)}")

        # Delete from database
        request.dbsession.delete(cinema)
        request.dbsession.flush()
        
        return {'message': 'Cinema berhasil dihapus'}

    except Exception as e:
        print(f"Error in delete_cinema: {str(e)}")
        request.dbsession.rollback()
        return Response(
            json_body={'error': f'Server error: {str(e)}'}, 
            status=500
        )


@view_config(route_name='list_cinemas', request_method='GET', renderer='json')
def list_cinemas(request):
    try:
        print("=== LIST CINEMAS REQUEST ===")
        
        cinemas = request.dbsession.query(Cinema).all()
        result = []
        
        for cinema in cinemas:
            # Safe image URL handling
            image_url = "/static/uploads/default.jpg"  # default
            
            if cinema.image:
                if cinema.image == 'default.jpg':
                    image_url = "/static/uploads/default.jpg"
                else:
                    # Check if image file exists
                    image_path = os.path.join(UPLOAD_DIR, cinema.image)
                    if os.path.exists(image_path):
                        image_url = f"/static/uploads/{cinema.image}"
                    else:
                        print(f"Warning: Image file not found: {image_path}")
            
            result.append({
                'id': cinema.id,
                'name': cinema.name or '',
                'address': cinema.address or '',
                'phone': cinema.phone or '',
                'image': image_url,
                'price_weekday': cinema.price_weekday or '',
                'price_weekend': cinema.price_weekend or '',
            })
        
        print(f"Returning {len(result)} cinemas")
        return result
        
    except Exception as e:
        print(f"Error in list_cinemas: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            json_body={'error': f'Server error: {str(e)}'}, 
            status=500
        )
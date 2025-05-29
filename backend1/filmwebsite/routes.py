def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('get_users', '/api/users')
    config.add_route('login', '/api/login')
    config.add_route('register', '/api/register')
    config.add_route('create_user', '/api/create_user')
    config.add_route('test_register', '/api/test_register') 
    config.add_route('profile', '/api/profile')
    config.add_route('tickets', '/api/tickets')
    config.add_route('add_cinema', '/cinema/add')
    config.add_route('edit_cinema', '/cinema/edit')
    config.add_route('delete_cinema', '/cinema/delete')
    config.add_route('list_cinemas', '/cinemas')
    config.add_route('get_pesanan_api', '/api/get_pesanan_api')
    config.add_route('pesanan_api', '/api/pesanan_api')
    config.add_route('update_pesanan_api', '/api/update_pesanan/{key}')
    config.add_route('delete_pesanan_api', '/api/delete_pesanan/{key}')
    config.add_route('get_seats', '/api/seats')
    config.add_route('reserve_seats', '/api/seats/reserve')
     # Tambahan untuk debugging
    config.add_route('get_all_reservations', '/api/seats/all')  # Untuk melihat semua data
    config.add_route('api_status', '/api/status')  #
    config.add_route('current_user', '/api/current-user')




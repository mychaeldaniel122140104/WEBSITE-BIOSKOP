from pyramid.config import Configurator
from pyramid.session import SignedCookieSessionFactory

from .cors import cors_tween_factory  # import cors_tween_factory dari cors.py

def main(global_config, **settings):
    my_session_factory = SignedCookieSessionFactory(
        'supersecretkey',
        httponly=True,
        secure=False,
        samesite='Lax'
    )
    with Configurator(settings=settings) as config:
        config.set_session_factory(my_session_factory)
        config.add_static_view(name='uploads', path='static/uploads', cache_max_age=3600)
        config.add_tween('filmwebsite.cors.cors_tween_factory')  # gunakan path yang benar
        # lainnya ...
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')
        config.scan('filmwebsite.views')
        return config.make_wsgi_app()

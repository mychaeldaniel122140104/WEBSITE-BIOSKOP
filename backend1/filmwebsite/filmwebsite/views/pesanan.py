# views.py
from pyramid.view import view_config
from pyramid.response import Response
import json
from ..models import HargaMakanan

@view_config(route_name='pesanan_api', renderer='json', request_method='POST')
def pesanan_api(request):
    data = request.json_body
    print("DATA DITERIMA:", data) 
    # Data langsung berupa dict dengan kunci item

    popcorn_caramel = data.get('popcorn_caramel', 0)
    popcorn_keju = data.get('popcorn_keju', 0)
    sosis_bakar = data.get('sosis_bakar', 0)
    cola_dingin = data.get('cola_dingin', 0)
    es_teh_manis = data.get('es_teh_manis', 0)
    milkshake_coklat = data.get('milkshake_coklat', 0)

    if not any([popcorn_caramel, popcorn_keju, sosis_bakar, cola_dingin, es_teh_manis, milkshake_coklat]):
        return {'message': 'tidak ada isi pesanan'}

    makanan = HargaMakanan(
        popcorn_caramel=popcorn_caramel,
        popcorn_keju=popcorn_keju,
        sosis_bakar=sosis_bakar,
        cola_dingin=cola_dingin,
        es_teh_manis=es_teh_manis,
        milkshake_coklat=milkshake_coklat
    )

    # Simpan ke database
    request.dbsession.add(makanan)

    return {"message": "Pesanan berhasil disimpan"}

@view_config(route_name='update_pesanan_api', renderer='json', request_method='PUT')
def update_pesanan(request):
    key = request.matchdict.get('key')  # nama item, contoh: 'popcorn_caramel'
    data = request.json_body
    new_jumlah = data.get('jumlah', None)

    if new_jumlah is None or new_jumlah < 1:
        return {"status": "error", "message": "Jumlah tidak valid"}

    session = request.dbsession
    try:
        # Cari record pesanan (misal berdasarkan id, tapi kamu perlu sesuaikan)
        # Karena struktur db kamu menyimpan semua item dalam satu record,
        # jadi mungkin kamu ingin update record terakhir atau tertentu
        pesanan = session.query(HargaMakanan).order_by(HargaMakanan.id.desc()).first()
        if not pesanan:
            return {"status": "error", "message": "Pesanan tidak ditemukan"}

        # Update properti sesuai key
        if hasattr(pesanan, key):
            setattr(pesanan, key, new_jumlah)
            session.flush()
            return {"status": "success", "message": f"Jumlah {key} berhasil diupdate"}
        else:
            return {"status": "error", "message": f"Item {key} tidak ditemukan"}

    except Exception as e:
        return {"status": "error", "message": str(e)}


@view_config(route_name='delete_pesanan_api', renderer='json', request_method='DELETE')
def delete_pesanan(request):
    key = request.matchdict.get('key')  # nama item

    session = request.dbsession
    try:
        # Cari record pesanan terakhir (sesuaikan dengan kebutuhan)
        pesanan = session.query(HargaMakanan).order_by(HargaMakanan.id.desc()).first()
        if not pesanan:
            return {"status": "error", "message": "Pesanan tidak ditemukan"}

        if hasattr(pesanan, key):
            setattr(pesanan, key, 0)  # reset jumlah item jadi 0 = hapus item
            session.flush()
            return {"status": "success", "message": f"Item {key} berhasil dihapus"}
        else:
            return {"status": "error", "message": f"Item {key} tidak ditemukan"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    
@view_config(route_name='get_pesanan_api', renderer='json', request_method='GET')
def get_pesanan(request):
    try:
        session = request.dbsession
        pesanan = session.query(HargaMakanan).all()

        hasil = []
        for item in pesanan:
            hasil.append({
                "id": item.id,
                "Popcorn Caramel": item.popcorn_caramel,
                "Popcorn Keju": item.popcorn_keju,
                "Sosis Bakar": item.sosis_bakar,
                "Cola Dingin": item.cola_dingin,
                "Es Teh Manis": item.es_teh_manis,
                "Milkshake Coklat": item.milkshake_coklat
            })

        return {"status": "success", "data": hasil}

    except Exception as e:
        return {"status": "error", "message": "Terjadi kesalahan server"}

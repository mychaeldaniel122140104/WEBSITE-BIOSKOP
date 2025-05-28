import React, { useState, useEffect } from 'react';
import './artpages/BioskopPage.css';
import { Link } from 'react-router-dom';

function AddCinemaModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        image: '',
        imageRaw: null,
        priceWeekday: '',
        priceWeekend: ''
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setFormData({ ...formData, image: imageURL, imageRaw: file });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validasi form
        if (!formData.name || !formData.address || !formData.phone || !formData.priceWeekday || !formData.priceWeekend) {
            alert('Harap isi semua field yang diperlukan');
            return;
        }
        onAdd(formData);
    };

    const handleClose = (e) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
            <div className="modal-content">
                <h3>Tambah Bioskop</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nama"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Alamat"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="No. Telepon"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Harga Weekday"
                        value={formData.priceWeekday}
                        onChange={e => setFormData({ ...formData, priceWeekday: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Harga Weekend"
                        value={formData.priceWeekend}
                        onChange={e => setFormData({ ...formData, priceWeekend: e.target.value })}
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {formData.image && (
                        <div className="image-preview">
                            <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        </div>
                    )}
                    <div className="modal-buttons">
                        <button type="submit">Tambah</button>
                        <button type="button" onClick={handleClose}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditCinemaModal({ cinema, onClose, onEdit, onDelete }) {
    const [formData, setFormData] = useState({
        name: cinema.name,
        address: cinema.address,
        phone: cinema.phone,
        image: cinema.image,
        imageRaw: null,
        priceWeekday: cinema.price_weekday,
        priceWeekend: cinema.price_weekend,
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setFormData({ ...formData, image: imageURL, imageRaw: file });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit(cinema.id, formData);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (window.confirm('Apakah Anda yakin ingin menghapus bioskop ini?')) {
            onDelete(cinema.id);
        }
    };

    const handleClose = (e) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
            <div className="modal-content">
                <h3>Edit Bioskop</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nama"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Alamat"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="No. Telepon"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Harga Weekday"
                        value={formData.priceWeekday}
                        onChange={e => setFormData({ ...formData, priceWeekday: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Harga Weekend"
                        value={formData.priceWeekend}
                        onChange={e => setFormData({ ...formData, priceWeekend: e.target.value })}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {formData.image && (
                        <div className="image-preview">
                            <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        </div>
                    )}
                    <div className="modal-buttons">
                        <button type="submit">Simpan Perubahan</button>
                        <button type="button" onClick={handleDelete} className="delete-button">Hapus Bioskop</button>
                        <button type="button" onClick={handleClose}>Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Profile() {
    const [cinemas, setCinemas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'add' or 'edit'
    const [editingCinema, setEditingCinema] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCinemas();
    }, []);

    const fetchCinemas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:6543/cinemas', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCinemas(data);
        } catch (error) {
            console.error('Gagal mengambil data bioskop:', error);
            setError('Gagal mengambil data bioskop: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (formData) => {
        const form = new FormData();
        form.append('name', formData.name);
        form.append('address', formData.address);
        form.append('phone', formData.phone);
        form.append('price_weekday', formData.priceWeekday);
        form.append('price_weekend', formData.priceWeekend);
        if (formData.imageRaw) {
            form.append('image', formData.imageRaw);
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:6543/cinema/add', {
                method: 'POST',
                credentials: 'include',
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            setModalOpen(false);
            setModalType(null);
            await fetchCinemas();
            alert('Bioskop berhasil ditambahkan!');
        } catch (error) {
            console.error('Error saat tambah:', error);
            alert('Gagal menambah bioskop: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id, formData) => {
        const form = new FormData();
        form.append('id', id);
        form.append('name', formData.name);
        form.append('address', formData.address);
        form.append('phone', formData.phone);
        form.append('price_weekday', formData.priceWeekday);
        form.append('price_weekend', formData.priceWeekend);
        if (formData.imageRaw) {
            form.append('image', formData.imageRaw);
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:6543/cinema/edit', {
                method: 'POST',
                credentials: 'include',
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            setModalOpen(false);
            setModalType(null);
            setEditingCinema(null);
            await fetchCinemas();
            alert('Bioskop berhasil diubah!');
        } catch (error) {
            console.error('Error saat edit:', error);
            alert('Gagal mengubah bioskop: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const form = new FormData();
        form.append('id', id);

        try {
            setLoading(true);
            const response = await fetch('http://localhost:6543/cinema/delete', {
                method: 'POST',
                credentials: 'include',
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            setModalOpen(false);
            setModalType(null);
            setEditingCinema(null);
            await fetchCinemas();
            alert('Bioskop berhasil dihapus!');
        } catch (error) {
            console.error('Error saat hapus:', error);
            alert('Gagal menghapus bioskop: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = (e) => {
        e.preventDefault();
        console.log('Add button clicked'); // Debug log
        setModalType('add');
        setModalOpen(true);
    };

    const handleEditClick = (cinema, e) => {
        e.preventDefault();
        console.log('Edit button clicked for:', cinema.name); // Debug log
        setModalType('edit');
        setEditingCinema(cinema);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
        setEditingCinema(null);
    };

    if (loading && cinemas.length === 0) {
        return <div className="profile-container"><p>Loading...</p></div>;
    }

    return (
        <div className="profile-container">
            <div className="header-row">
                <h2 className="profile-title">Daftar Bioskop</h2>
                <button
                    className="add-button"
                    onClick={handleAddClick}
                    disabled={loading}
                    style={{
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    + Tambah Bioskop
                </button>
            </div>

            {error && (
                <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                    {error}
                </div>
            )}

            <table className="cinema-table">
                <thead>
                    <tr>
                        <th>Gambar</th>
                        <th>Nama</th>
                        <th>Alamat</th>
                        <th>Telepon</th>
                        <th>Harga Weekday</th>
                        <th>Harga Weekend</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {cinemas.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                {loading ? 'Loading...' : 'Belum ada data bioskop'}
                            </td>
                        </tr>
                    ) : (
                        cinemas.map((cinema, index) => (
                            <tr key={cinema.id || index}>
                                <td>
                                    <img
                                        src={cinema.image}
                                        alt={cinema.name}
                                        className="table-image"
                                        onError={(e) => {
                                            e.target.src = '/static/placeholder.jpg'; // fallback image
                                        }}
                                    />
                                </td>
                                <td>{cinema.name}</td>
                                <td>{cinema.address}</td>
                                <td>{cinema.phone}</td>
                                <td>Rp {cinema.price_weekday}</td>
                                <td>Rp {cinema.price_weekend}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Link to="/news">
                                        <button className="access-button">Access</button>
                                    </Link>
                                    <button
                                        className="edit-button"
                                        onClick={(e) => handleEditClick(cinema, e)}
                                        disabled={loading}
                                    >
                                    ✎
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {modalOpen && modalType === 'add' && (
                <AddCinemaModal
                    onClose={closeModal}
                    onAdd={handleAdd}
                />
            )}

            {modalOpen && modalType === 'edit' && editingCinema && (
                <EditCinemaModal
                    cinema={editingCinema}
                    onClose={closeModal}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}

export default Profile;
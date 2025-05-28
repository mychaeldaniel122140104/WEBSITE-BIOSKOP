import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import './artpages/HalamanBayar.css'; // opsional

function EditModal({ show, onClose, currentJumlah, onSave }) {
    const [jumlah, setJumlah] = React.useState(currentJumlah);

    React.useEffect(() => {
        setJumlah(currentJumlah);
    }, [currentJumlah]);

    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Edit Jumlah</h3>
                <input type="number" min="1" value={jumlah} onChange={e => setJumlah(+e.target.value)} />
                <button onClick={() => onSave(jumlah)}>Simpan</button>
                <button onClick={onClose}>Batal</button>
            </div>
        </div>
    );
}

export default function HalamanBayar() {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);
    const [, setPesananId] = useState(null);
    const [pesanan, setPesanan] = useState([]);
    const [showQR, setShowQR] = useState(false);
    const navigate = useNavigate();

    // Fungsi buka modal (pindah keluar useEffect)
    const openEditModal = (item) => {
        setItemEdit(item);
        setEditModalOpen(true);
    };

    // Fungsi tutup modal
    const closeEditModal = () => {
        setEditModalOpen(false);
        setItemEdit(null);
    };

    // Fungsi fetch data pesanan terbaru
    const fetchPesanan = async () => {
        try {
            const res = await fetch("http://127.0.0.1:6543/api/get_pesanan_api");
            const data = await res.json();
            if (data.status === "success" && data.data.length > 0) {
                const dataTerakhir = data.data[data.data.length - 1];
                setPesananId(dataTerakhir.id);
                const keyMapping = {
                    "Popcorn Caramel": "popcorn_caramel",
                    "Popcorn Keju": "popcorn_keju",
                    "Sosis Bakar": "sosis_bakar",
                    "Cola Dingin": "cola_dingin",
                    "Es Teh Manis": "es_teh_manis",
                    "Milkshake Coklat": "milkshake_coklat"
                };
                const hargaMakanan = {
                    popcorn_caramel: 20000,
                    popcorn_keju: 25000,
                    sosis_bakar: 15000,
                    cola_dingin: 10000,
                    es_teh_manis: 8000,
                    milkshake_coklat: 18000,
                };

                const pesananDisplay = Object.entries(dataTerakhir)
                    .filter(([key, val]) => key !== "id" && keyMapping[key] && val > 0)
                    .map(([key, jumlah]) => {
                        const keySnake = keyMapping[key];
                        return {
                            nama: key,
                            harga: hargaMakanan[keySnake],
                            jumlah,
                            total: hargaMakanan[keySnake] * jumlah,
                            keySnake,
                            key: keySnake,  // tambahkan key untuk React key prop
                        };
                    });
                setPesanan(pesananDisplay);
            } else {
                setPesanan([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setPesanan([]);
        }
    };

    // Panggil fetchPesanan saat komponen mount
    useEffect(() => {
        fetchPesanan();
    }, []);

    // Fungsi simpan edit jumlah
    const saveEdit = async (newJumlah) => {
        try {
            const response = await fetch(`http://localhost:6543/api/update_pesanan/${itemEdit.keySnake}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jumlah: newJumlah }),
            });
            if (!response.ok) throw new Error('Gagal update data pesanan');

            // Setelah update, fetch ulang data terbaru
            await fetchPesanan();

            closeEditModal();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleHapus = async (keySnake) => {
        if (!window.confirm("Yakin ingin menghapus item ini?")) return;

        try {
            const response = await fetch(`http://localhost:6543/api/delete_pesanan/${keySnake}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Gagal hapus data pesanan');

            // Fetch ulang data setelah hapus supaya data tetap sinkron
            await fetchPesanan();

        } catch (error) {
            alert(error.message);
        }
    };

    const handleBayar = () => {
        const pilihan = window.confirm("Pilih OK untuk Bayar di Tempat, Cancel untuk QRIS");
        if (pilihan) {
            alert("Silakan ke kasir untuk membayar.");
            navigate("/menu");
        } else {
            setShowQR(true);
        }
    };

    const totalBayar = pesanan.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="struk-container">
            <h1>Struk Pembayaran</h1>
            <table className="table-pesanan">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Jumlah</th>
                        <th>Total</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {pesanan.map(item => (
                        <tr key={item.key}>
                            <td>{item.nama}</td>
                            <td>Rp {item.harga.toLocaleString()}</td>
                            <td>{item.jumlah}</td>
                            <td>Rp {item.total.toLocaleString()}</td>
                            <td>
                                <button
                                    className="btn-edit"
                                    onClick={() => openEditModal(item)}>Edit</button>
                                <button
                                    className="btn-hapus"
                                    onClick={() => handleHapus(item.keySnake)}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="total-bayar">Total Bayar: Rp {totalBayar.toLocaleString()}</h2>

            {!showQR ? (
                <button className="btn-bayar" onClick={handleBayar}>Bayar</button>
            ) : (
                <div className="qris-section">
                    <h3>Silakan Scan QRIS di bawah ini:</h3>
                    <img src="/images/avengers.jpg" alt="QRIS" className="qris-img" />
                    <div className="qris-section">
                        <button className="btn-bayar" onClick={() => navigate("/menu")}>Selesai</button>
                    </div>
                </div>

            )}

            {/* Modal edit */}
            <EditModal
                show={editModalOpen}
                currentJumlah={itemEdit?.jumlah || 1}
                onClose={closeEditModal}
                onSave={saveEdit}
            />

        </div>
    );
}

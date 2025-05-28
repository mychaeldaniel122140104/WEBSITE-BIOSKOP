import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import './artpages/MenuMakanan.css';

const menuItems = [
    {
        id: 1,
        name: "Popcorn Caramel",
        category: "Makanan", // sebelumnya 'type'
        price: 15000,
        image: "/images/popcorn_caramel.jpg",
        description: "Popcorn rasa caramel manis dan renyah"
    },
    {
        id: 2,
        name: "Popcorn Keju",
        category: "Makanan",
        price: 17000,
        image: "/images/popcorn_keju.jpg",
        description: "Popcorn dengan taburan keju gurih"
    },
    {
        id: 3,
        name: "Sosis Bakar",
        category: "Makanan",
        price: 20000,
        image: "/images/sosis.jpg",
        description: "Sosis bakar dengan bumbu khas"
    },
    {
        id: 4,
        name: "Cola Dingin",
        category: "Minuman",
        price: 10000,
        image: "/images/cola.jpg",
        description: "Minuman cola segar dingin"
    },
    {
        id: 5,
        name: "Es Teh Manis",
        category: "Minuman",
        price: 8000,
        image: "/images/esteh.jpg",
        description: "Es teh manis segar"
    },
    {
        id: 6,
        name: "Milkshake Coklat",
        category: "Minuman",
        price: 18000,
        image: "/images/milkshake.jpg",
        description: "Milkshake coklat lembut dan dingin"
    },
];

export default function MenuMakanan() {
    const navigate = useNavigate();

    const [jumlah, setJumlah] = useState(
        menuItems.reduce((acc, item) => {
            acc[item.id] = 0;
            return acc;
        }, {})
    );

    const [filterCategory, setFilterCategory] = useState("Semua"); // gunakan "category" untuk filter

    const handleJumlahChange = (id, value) => {
        // Cek hanya angka positif atau kosong
        if (value === "" || /^[0-9\b]+$/.test(value)) {
            setJumlah((prev) => ({
                ...prev,
                [id]: value === "" ? 0 : parseInt(value)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataPesanan = {
            popcorn_caramel: parseInt(jumlah[1]) || 0,
            popcorn_keju: parseInt(jumlah[2]) || 0,
            sosis_bakar: parseInt(jumlah[3]) || 0,
            cola_dingin: parseInt(jumlah[4]) || 0,
            es_teh_manis: parseInt(jumlah[5]) || 0,
            milkshake_coklat: parseInt(jumlah[6]) || 0,
        };

        // Cek kalau semua nilai 0
        const totalJumlah = Object.values(dataPesanan).reduce((a, b) => a + b, 0);
        if (totalJumlah === 0) {
            alert("Silakan masukkan jumlah minimal 1 pada salah satu item.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:6543/api/pesanan_api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataPesanan),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Gagal menyimpan pesanan.");
                return;
            }

            alert(result.message || "Pesanan berhasil disimpan!");
            setJumlah(menuItems.reduce((acc, item) => {
                acc[item.id] = 0;
                return acc;
            }, {}));
            navigate('/bayar');
        } catch (error) {
            alert("Terjadi kesalahan saat menghubungi server.");
            console.error(error);
        }
    };

    // Filter menuItems berdasarkan filterCategory terbaru
    const filteredItems = filterCategory === "Semua"
        ? menuItems
        : menuItems.filter(item => item.category === filterCategory);

    return (
        <div className="menu-container">
            <h1>Menu Makanan & Minuman</h1>

            <div className="filter-container">
                <label>
                    <input
                        type="radio"
                        name="filterCategory"
                        value="Semua"
                        checked={filterCategory === "Semua"}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    />
                    Semua
                </label>
                <label>
                    <input
                        type="radio"
                        name="filterCategory"
                        value="Makanan"
                        checked={filterCategory === "Makanan"}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    />
                    Makanan
                </label>
                <label>
                    <input
                        type="radio"
                        name="filterCategory"
                        value="Minuman"
                        checked={filterCategory === "Minuman"}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    />
                    Minuman
                </label>
            </div>

            <form onSubmit={handleSubmit} className="menu-form">
                {filteredItems.map((item) => (
                    <div key={item.id} className="menu-row">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="menu-image"
                        />
                        <div className="menu-info">
                            <span className="menu-name">{item.name}</span>
                            <span className="menu-description">{item.description}</span>
                            <span className="menu-category">{item.category}</span>
                            <span className="menu-price">Rp {item.price.toLocaleString()}</span>
                        </div>
                        <div className="menu-input">
                            <input
                                type="number"
                                min="0"
                                value={jumlah[item.id]}
                                onChange={(e) => handleJumlahChange(item.id, e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>
                ))}

                <button type="submit" className="submit-btn">Submit Pesanan</button>
            </form>
        </div>
    );
}

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './artpages/SeatSelection.css'; // opsional, kalau kamu punya styling terpisah

function SeatSelection() {
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);

  const availableSeats = useMemo(() => {
    const allSeats = Array.from({ length: 30 }, (_, i) => `S${i + 1}`);
    return allSeats.map(seat => ({
      id: seat,
      taken: Math.random() < 0.3 // Simulasi kursi sudah terisi
    }));
  }, []);

  const handleTimeSelect = () => {
    if (time) {
      document.getElementById('seat-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSeatClick = (seat) => {
    if (!seat.taken) {
      setSelectedSeat(seat.id);
    }
  };

  const handleNext = () => {
    if (selectedSeat && time) {
      // Simpan ke localStorage untuk diakses di halaman Checkout
      localStorage.setItem('ticketSeat', selectedSeat);
      localStorage.setItem('ticketTime', time);
      navigate('/checkout');
    }
  };

  return (
    <div className="seat-selection-container">
      <div className="seat-selection-card">
        <h2 className="section-title">🎬 Pilih Jam Tayang</h2>
        <div className="time-picker">
          <select value={time} onChange={e => setTime(e.target.value)}>
            <option value="">-- Pilih Jam --</option>
            <option value="14:00">14:00</option>
            <option value="17:00">17:00</option>
            <option value="20:00">20:00</option>
          </select>
          <button className="buy-button" onClick={handleTimeSelect}>Pilih Waktu</button>
        </div>
  
        {time && (
          <div id="seat-container">
            <h3 className="section-title">🎟️ Pilih Kursi untuk Jam {time}</h3>
            <div className="seats">
              {availableSeats.map(seat => (
                <button
                  key={seat.id}
                  className={`seat-button ${seat.taken ? 'taken' : ''} ${selectedSeat === seat.id ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.taken}>
                  {seat.id}
                </button>
              ))}
            </div>
  
            <div className="seat-legend">
              <span className="seat-box taken"></span> Terisi
              <span className="seat-box available"></span> Tersedia
            </div>
  
            {selectedSeat && <p className="selected-info">Anda memilih bangku nomor <strong>{selectedSeat}</strong></p>}
  
            <button className="buy-button" onClick={handleNext} disabled={!selectedSeat}>
              Lanjut ke Pembayaran
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatSelection;

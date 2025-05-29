import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './artpages/SeatSelection.css';

function SeatSelection() {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);  // ✅ perbaiki nama
  const [showSeats, setShowSeats] = useState(false);
  const [availableSeats, setAvailableSeats] = useState([]);
  const title = localStorage.getItem('ticketMovieTitle');
  const description = localStorage.getItem('ticketMovieDescription');
  const thumbnail = localStorage.getItem('ticketMovieThumbnail');
  const showtimes = JSON.parse(localStorage.getItem('ticketMovieShowtimes') || '[]');
  const date = localStorage.getItem('ticketMovieDate');
  const pricePerSeat = 50000;
  const handleTimeSelect = async (time) => {
    setSelectedTime(time);
    setShowSeats(true);
    setSelectedSeats([]);

    // Generate seed berdasarkan kombinasi judul, tanggal, dan jam agar berbeda-beda
    const seed = `${title}-${date}-${time}`;

    // Fungsi pseudo-random dengan seed
    const seededRandom = (seed) => {
      let h = 0;
      for (let i = 0; i < seed.length; i++) {
        h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
      }
      return () => {
        h ^= h >>> 13;
        h ^= h << 17;
        h ^= h >>> 5;
        return (h >>> 0) / 4294967295;
      };
    };

    const rand = seededRandom(seed);

    const allSeats = Array.from({ length: 30 }, (_, i) => `S${i + 1}`);

    // Tentukan berapa banyak yang di-mark sebagai 'taken'
    const takenCount = Math.floor(rand() * 10) + 5; // Antara 5 sampai 15 kursi terisi
    const shuffled = [...allSeats].sort(() => rand() - 0.5);
    const takenSeats = shuffled.slice(0, takenCount);

    const seatMap = allSeats.map(seat => ({
      id: seat,
      taken: takenSeats.includes(seat)
    }));

    setAvailableSeats(seatMap);
  };

  const handleSeatClick = (seat) => {
    if (seat.taken) return;

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(prev => prev.filter(id => id !== seat.id));
    } else {
      setSelectedSeats(prev => [...prev, seat.id]);
    }
  };
  const handleNext = async () => {
    if (selectedSeats.length === 0 || !selectedTime) return;

    const seatPayload = {
      title,
      date,
      time: selectedTime,
      seats: selectedSeats,
      price: selectedSeats.length * pricePerSeat
    };

    // Debug: Log data yang akan dikirim
    console.log('Sending seat payload:', seatPayload);
    console.log('Date format:', date);
    console.log('Time format:', selectedTime);
    console.log('Seats:', selectedSeats);

    const ticketPayload = {
      title,
      description,
      thumbnail,
      showtimes,
      date,
      price: selectedSeats.length * pricePerSeat
    };

    try {
      const res1 = await fetch('http://127.0.0.1:6543/api/seats/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seatPayload)
      });

      console.log('Response status:', res1.status);

      const responseData = await res1.json();
      console.log('Response data:', responseData);

      if (!res1.ok) {
        console.error('Server error:', responseData);
        throw new Error(responseData.error || 'Gagal reservasi kursi');
      }

      localStorage.setItem('ticketSeat', selectedSeats.join(', '));
      localStorage.setItem('ticketTime', selectedTime);
      navigate('/checkout');
    } catch (err) {
      console.error("Error:", err);
      alert(`Terjadi kesalahan: ${err.message}`);
    }
  };
  
  return (
    <div className="seat-selection-container">
      <div className="movie-detail-card">
        <h2>{title}</h2>
        <div className="movie-detail-layout">
          <img src={thumbnail} alt={title} className="movie-thumbnail" />
          <div className="movie-info-section">
            <p>{description}</p>
            <p><strong>Harga per kursi:</strong> Rp {pricePerSeat.toLocaleString()}</p>
            <p><strong>Tanggal Tayang:</strong> {date}</p>

            <div className="showtime-options">
              <p><strong>Pilih Jam Tayang:</strong></p>
              {showtimes.map((time, index) => (
                <button
                  key={index}
                  className={`showtime-button ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTime && (
              <p className="selected-time-info">
                Anda memilih jam <strong>{selectedTime}</strong>
              </p>
            )}
          </div>
        </div>

        {showSeats && (
          <div className="seat-section">
            <h3>🎟️ Pilih Kursi</h3>
            <div className="seats">
              {availableSeats.map(seat => (
                <button
                  key={seat.id}
                  className={`seat-button ${seat.taken ? 'taken' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.taken}
                >
                  {seat.id}
                </button>
              ))}
            </div>

            <div className="seat-legend">
              <span className="seat-box taken"></span> Terisi
              <span className="seat-box available"></span> Tersedia
              <span className="seat-box selected"></span> Dipilih
            </div>

            {selectedSeats.length > 0 && (
              <p className="selected-info">
                Anda memilih kursi: <strong>{selectedSeats.join(", ")}</strong><br />
                Total: <strong>Rp {(selectedSeats.length * pricePerSeat).toLocaleString()}</strong>
              </p>
            )}

            <button
              className="buy-button"
              onClick={handleNext}
              disabled={selectedSeats.length === 0}
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatSelection;

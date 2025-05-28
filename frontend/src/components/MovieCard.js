import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [randomTimes, setRandomTimes] = useState([]);
  const [showDate, setShowDate] = useState('');

  useEffect(() => {
    const generateTime = () => {
      const times = [];
      for (let i = 0; i < 3; i++) {
        const hour = Math.floor(Math.random() * (22 - 14)) + 14; // Jam 14 - 21
        const minute = Math.random() > 0.5 ? '00' : '30';
        times.push(`${hour.toString().padStart(2, '0')}:${minute}`);
      }
      // Hapus duplikat jika ada
      return [...new Set(times)];
    };

    const generateDate = () => {
      const start = new Date('2025-05-26');
      const end = new Date('2025-06-05');
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return randomDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    setRandomTimes(generateTime());
    setShowDate(generateDate());
  }, []);

  const handleOrderClick = async () => {
    console.log('Data yang akan dikirim:', {
      title: movie.title,
      description: movie.description,
      thumbnail: movie.thumbnail,
      showtimes: randomTimes,
      date: showDate,
      price: 'Rp 50.000',
    });

    if (randomTimes.length === 0 || !showDate) {
      alert('Data waktu tayang atau tanggal belum tersedia, coba refresh halaman.');
      return;
    }

    const dataToSend = {
      title: movie.title,
      description: movie.description,
      thumbnail: movie.thumbnail,
      showtimes: randomTimes,
      date: showDate,
      price: 'Rp 50.000',
    };

    try {
      const response = await fetch('http://localhost:6543/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log('Response status:', response.status);
      console.log('Response body:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save ticket data');
      }

      // Sukses
      localStorage.setItem('ticketMovieTitle', movie.title);
      localStorage.setItem('ticketMovieDescription', movie.description);
      localStorage.setItem('ticketMovieThumbnail', movie.thumbnail);
      localStorage.setItem('ticketMovieShowtimes', JSON.stringify(randomTimes));
      localStorage.setItem('ticketMovieDate', showDate);

      navigate('/seat');
    } catch (error) {
      console.error('Error saving ticket:', error);
      alert('Gagal memesan tiket, coba lagi nanti.');
    }
  };


  return (
    <div className="movie-card">
      <img src={movie.thumbnail} alt={movie.title} className="movie-image" />

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.description.substring(0, 100)}...</p>
        <div className="movie-actions">
          <div className="showtimes">
            {randomTimes.map((time, index) => (
              <span key={index}>
                🕒 {time}
                {index < randomTimes.length - 1 ? ' | ' : ''}
              </span>
            ))}
          </div>
          <button className="buy-button" onClick={handleOrderClick}>
            Pesan
          </button>
        </div>
        <p className="movie-date">Tayang: {showDate}</p>
        <p className="movie-price">Rp 50.000</p>
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }).isRequired,
};

export default MovieCard;

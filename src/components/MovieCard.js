import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    localStorage.setItem('ticketMovieTitle', movie.title);
    localStorage.setItem('ticketMovieDescription', movie.description);
    localStorage.setItem('ticketMovieThumbnail', movie.thumbnail);
    navigate('/seat');
  };

  return (
    <div className="movie-card">
      <img src={movie.thumbnail} alt={movie.title} className="movie-image" />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.description.substring(0, 100)}...</p>
        <div className="movie-actions">
          <div className="showtimes">
            <span>🕒 14:00</span> | <span>17:00</span> | <span>20:00</span>
          </div>
          <button className="buy-button" onClick={handleOrderClick}>
            Pesan
          </button>
        </div>
        <p className="movie-date">Tayang: {movie.date}</p>
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
    date: PropTypes.string
  }).isRequired,
};

export default MovieCard;

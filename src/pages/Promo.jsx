import React, { useState, useEffect } from 'react';
import './artpages/PromoPage.css';

function Promo() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=3c4e121c0f63185e174097425cc409c5&language=en-US&page=1`
        );
        if (!response.ok) {
          throw new Error('Gagal memuat promo film');
        }
        const data = await response.json();

        const formattedPromos = data.results.slice(0, 8).map((movie) => {
          const originalPrice = Math.floor(Math.random() * 20000 + 50000); // Rp50rb - Rp70rb
          const discount = Math.floor(Math.random() * 10000 + 5000);       // Rp5rb - Rp15rb
          const discountedPrice = originalPrice - discount;

          return {
            title: movie.title,
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            originalPrice,
            discountedPrice,
          };
        });

        setPromos(formattedPromos);
      } catch (error) {
        console.error('Error loading promos:', error);
      }
    };

    fetchPromos();
  }, []);

  return (
    <div className="promo-container">
      <h2 className="promo-title">Promo & Diskon Film</h2>
      <div className="promo-grid">
        {promos.map((movie, index) => (
          <div key={index} className="promo-card">
            <div className="promo-poster">
              <img src={movie.image} alt={movie.title} className="promo-img" />
            </div>
            <h3>{movie.title}</h3>
            <p className="price-line">
              <span className="original">Rp {movie.originalPrice.toLocaleString()}</span>
              <span className="discounted">Rp {movie.discountedPrice.toLocaleString()}</span>
            </p>
            <p className="coin-info">Diskon berlaku dengan penggunaan coin</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Promo;

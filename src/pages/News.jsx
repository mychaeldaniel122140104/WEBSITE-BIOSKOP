import React, { useState, useEffect } from 'react';
import './artpages/news.css';

function generateStars(count) {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

function News() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          'https://api.themoviedb.org/3/movie/top_rated?api_key=3c4e121c0f63185e174097425cc409c5&language=en-US&page=1'
        );
        const data = await res.json();
        const topMovies = data.results.slice(0, 8);

        const generatedNews = topMovies.map(movie => {
          const randomRating = Math.floor(Math.random() * 3) + 3;
          const fakeNews = `${movie.title} mendapat pujian tinggi dari para kritikus dan penonton global.`;
          return {
            title: movie.title,
            thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            rating: randomRating,
            news: fakeNews
          };
        });

        setNewsData(generatedNews);
      } catch (err) {
        console.error('Gagal memuat berita film:', err);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-page">
      <h2 className="news-title">Berita Film Terbaru</h2>
      <div className="news-grid">
        {newsData.map((item, index) => (
          <div key={index} className="news-card">
            <img src={item.thumbnail} alt={item.title} className="news-img" />
            <h3>{item.title}</h3>
            <p className="news-rating">Rating: {generateStars(item.rating)}</p>
            <p className="news-description">{item.news}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;

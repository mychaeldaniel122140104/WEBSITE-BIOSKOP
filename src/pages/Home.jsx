import React, { useState, useEffect } from 'react';
import MovieGrid from '../components/MovieGrid';
import ErrorMessage from '../components/ErrorMessage';
import './artpages/Home.css'; 


function Home() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=3c4e121c0f63185e174097425cc409c5&language=en-US&page=1`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();

        // Format hasil dari TMDB supaya cocok dengan struktur movie kamu
        const formattedMovies = data.results.slice(0, 8).map((movie) => ({
          id: movie.id,
          title: movie.title,
          description: movie.overview,
          thumbnail: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          time: ['14:00', '17:00', '20:00'], // jam tayang tetap dummy
          date: '7 April 2025' // tanggal tayang tetap dummy
        }));

        setMovies(formattedMovies);
      } catch (err) {
        setError('Gagal memuat daftar film');
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="home-page">
      <h2>🎬 Daftar Film Tersedia</h2>
      {error && <ErrorMessage message={error} />}
      <MovieGrid movies={movies} />
    </div>
  );
}

export default Home;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import './components/MovieGrid.css';

import Header from './components/Header';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import Promo from './pages/Promo';
import News from './pages/News';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import SeatSelection from './pages/SeatSelection';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import { MovieProvider } from './context/MovieContext';

function App() {
  return (
    <MovieProvider>
      <Routes>
        {/* Saat buka "/", arahkan ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Semua halaman utama dibungkus Header */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/promo" element={<Promo />} />
                <Route path="/news" element={<News />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/seat" element={<SeatSelection />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </MovieProvider>
  );
}

export default App;

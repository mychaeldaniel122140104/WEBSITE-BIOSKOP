import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import './components/MovieGrid.css';

import Header from './components/Header';
import ErrorMessage from './components/ErrorMessage';
import MovieGrid from './components/MovieGrid';

import Home from './pages/Home';
import Promo from './pages/Promo';
import News from './pages/News';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import SeatSelection from './pages/SeatSelection';
import NotFound from './pages/NotFound';

// Import MovieProvider
import { MovieProvider } from './context/MovieContext';

function useCountdown(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return timeLeft;
}

function App() {
  return (
    <MovieProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/news" element={<News />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/seat" element={<SeatSelection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MovieProvider>
  );
}

export default App;

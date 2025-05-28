import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState('Memuat lokasi...');

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          setLocation(data.address.city || data.address.town || data.address.village || 'Lokasi tidak diketahui');
        } catch {
          setLocation('Gagal memuat lokasi');
        }
      },
      () => setLocation('Izin lokasi ditolak')
    );
  }, []);

  return (
    <header className="custom-header">
      <div className="top-header">
        <div className="logo-location">
          <div className="logo-text">mychaelfilm</div>
          <div className="location-badge">📍 {location}</div>
        </div>
        <div className="top-right">
          <Link to="/news" className="top-link">News</Link>
          <Link to="/Profile">
            <FaUserCircle className="icon" title="Profile" />
          </Link>
          <Link to="/login">
            <FaSignOutAlt className="icon" title="Sign Out" />
          </Link>
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
        <Link to="/news">News</Link>
        <Link to="/Profile">Profile</Link>
        <Link to="/">Sign Out</Link>
      </div>

      <div className="bottom-header">
        <h1 className="slogan">SILAHKAN MENONTON</h1>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Cari film atau bioskop" />
        </div>
        <div className="feature-icons">
          <Link to="/bioskop">
            <div><img src="/images/bioskop.png" alt="Bioskop" /><span>Bioskop</span></div>
          </Link>
          <Link to="/home">
            <div><img src="/images/movie.png" alt="Film" /><span>Film</span></div>
          </Link>
          <Link to="/menu">
            <div><img src="/images/makanan.png" alt="m.food" /><span>food</span></div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

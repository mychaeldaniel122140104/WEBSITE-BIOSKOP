import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Header.css';
import { FaBars, FaSearch, FaTimes } from 'react-icons/fa';

function Header({ title }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="custom-header">
      <div className="logo-area">
        <div className="logo-text">filmmychael</div>
      </div>

      <div className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
        <Link to="/home" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
        <Link to="/promo" onClick={() => setMobileMenuOpen(false)}>Promo</Link>
        <Link to="/news" onClick={() => setMobileMenuOpen(false)}>Rating & News</Link>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Sign Out</Link>
      </div>

      <div className="header-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for movies or TV shows" />
        </div>
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

Header.defaultProps = {
  title: 'filmmychael',
};

export default Header;

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Header.css';
import { FaBars, FaSearch } from 'react-icons/fa';

function Header({ title }) {
  return (
    <header className="custom-header">
      <div className="logo">{title}</div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/promo">Promo</Link>
        <Link to="/news">Rating & News</Link>
      </nav>

      <div className="header-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for movies or TV shows" />
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

Header.defaultProps = {
  title: 'MychaelFilm',
};

export default Header;

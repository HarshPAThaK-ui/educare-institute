import React, { useState } from 'react'
import './header.css';
import { Link } from 'react-router-dom';
import { MdClose, MdMenu } from 'react-icons/md';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <div className="logo">
        <Link to="/" aria-label="Educare Institute home">
          <span className="logo-mark">Educare Institute</span>
          <span className="logo-submark">Offline coaching with structure and care</span>
        </Link>
      </div>

      <button
        type="button"
        className="mobile-menu-btn"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link className="nav-link" to="/courses" onClick={() => setIsMenuOpen(false)}>Courses</Link>
        <Link className="nav-link" to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link className="nav-link" to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
        <Link className="cta-link" to="/register" onClick={() => setIsMenuOpen(false)}>Enroll Now</Link>
      </nav>
    </header>
  )
}

export default Header

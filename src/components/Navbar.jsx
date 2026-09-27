import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { UtensilsCrossed, CalendarDays, BookOpen, Home as HomeIcon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon-wrapper">
            <UtensilsCrossed className="brand-icon" size={22} />
          </div>
          <span className="brand-name">DineEase</span>
        </Link>

        {/* Mobile menu hamburger toggle */}
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu} 
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <HomeIcon size={16} className="nav-icon" />
            <span>Home</span>
          </NavLink>
          
          <NavLink 
            to="/restaurants" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <BookOpen size={16} className="nav-icon" />
            <span>Restaurants</span>
          </NavLink>
          
          <NavLink 
            to="/booking" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <CalendarDays size={16} className="nav-icon" />
            <span>Book a Table</span>
          </NavLink>
          
          <NavLink 
            to="/reservations" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span>My Reservations</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

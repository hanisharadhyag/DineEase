import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Booking from './pages/Booking';
import Reservations from './pages/Reservations';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/reservations" element={<Reservations />} />
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <span className="footer-logo">🍽️ DineEase</span>
              <p>Simple & seamless dine-in restaurant table reservations.</p>
            </div>
            <div className="footer-copy">
              &copy; {new Date().getFullYear()} DineEase — College Academic Project.
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

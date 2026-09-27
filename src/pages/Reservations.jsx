import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  MapPin, 
  Armchair, 
  User, 
  Phone, 
  FileText, 
  RefreshCw,
  PlusCircle,
  Utensils
} from 'lucide-react';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('reservations')
        .select('*')
        .order('id', { ascending: false });

      if (err) throw err;
      setReservations(data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to fetch your reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="reservations-page section-container">
      <div className="reservations-header-flex">
        <div>
          <h1 className="page-title">My Reservations</h1>
          <p className="page-subtitle">
            View all confirmed table bookings across participating restaurants.
          </p>
        </div>

        <div className="reservations-actions">
          <button 
            onClick={fetchReservations} 
            className="btn btn-secondary btn-icon-only"
            title="Refresh reservations"
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
          <Link to="/booking" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Book New Table</span>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your reservations...</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={fetchReservations} className="btn btn-outline" style={{ marginTop: '0.75rem' }}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && reservations.length === 0 && (
        <div className="empty-state">
          <Utensils size={52} className="empty-icon" />
          <h3>No reservations yet.</h3>
          <p>You haven't booked any dining tables yet. Explore our restaurant partners and reserve your spot today!</p>
          <Link to="/booking" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            <span>Make Your First Reservation</span>
          </Link>
        </div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="reservations-grid">
          {reservations.map((res) => (
            <div key={res.id} className="reservation-card">
              <div className="reservation-card-header">
                <div>
                  <span className="booking-badge">Confirmed</span>
                  <h3 className="reservation-restaurant">{res.restaurant}</h3>
                </div>
                <div className="table-tag">
                  <Armchair size={15} />
                  <span>{res.table_number}</span>
                </div>
              </div>

              <div className="reservation-details-grid">
                <div className="detail-item">
                  <User size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Customer Name</span>
                    <span className="detail-val">{res.customer_name}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Phone size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Phone</span>
                    <span className="detail-val">{res.phone}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <CalendarDays size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Date</span>
                    <span className="detail-val">{res.date}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Clock size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Time</span>
                    <span className="detail-val">{res.time}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Users size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Guests</span>
                    <span className="detail-val">
                      {res.guests} {res.guests === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <Armchair size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Seating Area</span>
                    <span className="detail-val">{res.table_number}</span>
                  </div>
                </div>
              </div>

              {res.special_request && (
                <div className="special-request-box">
                  <FileText size={15} className="special-icon" />
                  <div>
                    <span className="special-label">Special Request:</span>
                    <span className="special-text">"{res.special_request}"</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

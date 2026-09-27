import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import { Star, MapPin, Utensils, Calendar, ArrowLeft, Clock, Users, ShieldCheck } from 'lucide-react';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRestaurantDetails() {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();

        if (err) throw err;
        setRestaurant(data);
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        setError('Could not find restaurant details.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRestaurantDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="section-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="section-container">
        <div className="error-banner">
          <p>{error || 'Restaurant not found.'}</p>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/restaurants" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Back to Restaurants</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-details-page section-container">
      {/* Breadcrumb / Back Link */}
      <div className="details-navigation">
        <Link to="/restaurants" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to All Restaurants</span>
        </Link>
      </div>

      <div className="details-card">
        {/* Restaurant Header Image Banner */}
        <div className="details-image-wrapper">
          <img 
            src={restaurant.image_url} 
            alt={restaurant.name} 
            className="details-image"
          />
        </div>

        {/* Restaurant Information Content */}
        <div className="details-info-content">
          <div className="details-main-info">
            <h1 className="details-title">{restaurant.name}</h1>
            
            <div className="details-meta-row">
              <div className="meta-item">
                <Utensils size={18} className="meta-icon" />
                <span>{restaurant.cuisine}</span>
              </div>
              <div className="meta-item">
                <MapPin size={18} className="meta-icon" />
                <span>{restaurant.location}</span>
              </div>
              <div className="meta-item">
                <Clock size={18} className="meta-icon" />
                <span>Open: 12:00 PM – 11:30 PM</span>
              </div>
            </div>

            <div className="details-description-box">
              <h3>About the Restaurant</h3>
              <p>{restaurant.description}</p>
            </div>

            {/* Highlights */}
            <div className="details-features">
              <div className="feature-item">
                <ShieldCheck size={20} className="feature-icon" />
                <div>
                  <strong>Instant Confirmation</strong>
                  <p>Guaranteed reservation upon booking submission.</p>
                </div>
              </div>
              <div className="feature-item">
                <Users size={20} className="feature-icon" />
                <div>
                  <strong>Flexible Seating</strong>
                  <p>Choice of Window, Outdoor, Balcony, or Booth tables.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Action Box */}
          <div className="details-action-sidebar">
            <div className="action-card">
              <h3>Reserve Your Table</h3>
              <p>Experience exquisite dining at {restaurant.name}. Tables fill up fast on weekends.</p>
              
              <Link 
                to={`/booking?restaurant=${encodeURIComponent(restaurant.name)}`}
                className="btn btn-primary btn-block btn-lg"
              >
                <Calendar size={18} />
                <span>Book a Table</span>
              </Link>

              <div className="card-guarantee">
                ✓ No booking charges &bull; Instant table confirmation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

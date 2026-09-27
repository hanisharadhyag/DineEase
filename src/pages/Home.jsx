import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import RestaurantCard from '../components/RestaurantCard';
import { Utensils, CalendarCheck, Smile, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from('restaurants')
          .select('*')
          .order('rating', { ascending: false })
          .limit(3);

        if (err) throw err;
        setFeaturedRestaurants(data || []);
      } catch (err) {
        console.error('Error fetching featured restaurants:', err);
        setError('Failed to load featured restaurants.');
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Effortless Dining Reservations</span>
          </div>
          <h1 className="hero-title">
            Find your table.<br />
            <span className="text-highlight">Enjoy your meal.</span>
          </h1>
          <p className="hero-subtitle">
            Discover top-rated dining spots, explore curated culinary spaces, and reserve your table in just a few clicks with DineEase.
          </p>
          <div className="hero-buttons">
            <Link to="/restaurants" className="btn btn-primary btn-lg">
              <span>Explore Restaurants</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/booking" className="btn btn-secondary btn-lg">
              <span>Book a Table</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Restaurants</h2>
            <p className="section-subtitle">Handpicked culinary gems with exceptional ambience and flavours</p>
          </div>
          <Link to="/restaurants" className="section-link">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading featured restaurants...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && featuredRestaurants.length > 0 && (
          <div className="restaurant-grid">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header center">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Reserving your dining experience takes under a minute</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon-box">
                <Utensils size={28} />
              </div>
              <h3 className="step-title">Choose a Restaurant</h3>
              <p className="step-description">
                Explore our curated collection of premier restaurants, view ratings, menus, and ambience.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon-box">
                <CalendarCheck size={28} />
              </div>
              <h3 className="step-title">Book Your Table</h3>
              <p className="step-description">
                Pick your preferred date, time slot, party size, and table seating area instantly.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon-box">
                <Smile size={28} />
              </div>
              <h3 className="step-title">Enjoy Your Meal</h3>
              <p className="step-description">
                Arrive at your reserved table, skip the waiting queues, and savor an unforgettable meal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready for an exceptional dining experience?</h2>
          <p className="cta-text">
            Skip the waiting line and secure your preferred table at your favorite restaurant now.
          </p>
          <Link to="/booking" className="btn btn-primary btn-lg">
            <span>Book Your Table Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

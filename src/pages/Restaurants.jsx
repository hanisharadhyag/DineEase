import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import RestaurantCard from '../components/RestaurantCard';
import { Utensils } from 'lucide-react';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from('restaurants')
          .select('*')
          .order('id', { ascending: true });

        if (err) throw err;
        setRestaurants(data || []);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to fetch restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  return (
    <div className="restaurants-page section-container">
      <div className="page-header">
        <h1 className="page-title">Explore Restaurants</h1>
        <p className="page-subtitle">
          Find and reserve tables at top-rated dine-in restaurants across the city.
        </p>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading available restaurants...</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && restaurants.length === 0 && (
        <div className="empty-state">
          <Utensils size={48} className="empty-icon" />
          <h3>No restaurants found</h3>
          <p>We couldn't find any restaurants at this moment.</p>
        </div>
      )}

      {!loading && !error && restaurants.length > 0 && (
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="restaurant-card">
      <div className="card-image-container">
        <img 
          src={restaurant.image_url} 
          alt={restaurant.name} 
          className="card-image"
          loading="lazy"
        />
      </div>

      <div className="card-content">
        <h3 className="card-title">{restaurant.name}</h3>

        <div className="card-location">
          <MapPin size={14} className="location-icon" />
          <span>{restaurant.location}</span>
        </div>

        <p className="card-description">{restaurant.description}</p>

        <div className="card-actions">
          <Link 
            to={`/restaurant/${restaurant.id}`} 
            className="btn btn-outline"
          >
            <span>View Details</span>
          </Link>
          <Link 
            to={`/booking?restaurant=${encodeURIComponent(restaurant.name)}`} 
            className="btn btn-primary"
          >
            <Calendar size={15} />
            <span>Book Table</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

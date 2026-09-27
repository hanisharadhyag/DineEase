import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  Armchair, 
  MessageSquare,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const TABLE_OPTIONS = [
  'Table 1 (Window Side)',
  'Table 2 (Center Hall)',
  'Table 3 (Cozy Corner)',
  'Table 4 (Outdoor Garden)',
  'Table 5 (Rooftop / Balcony)',
  'Table 6 (Private Booth)'
];

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '07:00 PM', '07:30 PM', '08:00 PM',
  '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
];

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Restaurants list for dropdown
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    restaurant: searchParams.get('restaurant') || '',
    customer_name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    table_number: '',
    special_request: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedReservation, setSubmittedReservation] = useState(null);

  // Fetch available restaurants from Supabase for dropdown
  useEffect(() => {
    async function loadRestaurants() {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setRestaurants(data || []);

        // If URL param specified a restaurant, make sure it's selected
        const paramRestaurant = searchParams.get('restaurant');
        if (paramRestaurant) {
          setFormData((prev) => ({ ...prev, restaurant: paramRestaurant }));
        }
      } catch (err) {
        console.error('Error loading restaurants for dropdown:', err);
      } finally {
        setLoadingRestaurants(false);
      }
    }

    loadRestaurants();
  }, [searchParams]);

  // Handle controlled input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? (value === '' ? '' : parseInt(value, 10)) : value
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.restaurant.trim()) {
      newErrors.restaurant = 'Please select a restaurant.';
    }

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Please enter your full name.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter a contact phone number.';
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a reservation date.';
    } else {
      // Validate that date is not in the past
      const selected = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = 'Reservation date cannot be in the past.';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Please select a reservation time slot.';
    }

    if (!formData.guests || Number(formData.guests) < 1) {
      newErrors.guests = 'Number of guests must be at least 1.';
    } else if (Number(formData.guests) > 20) {
      newErrors.guests = 'For parties larger than 20, please contact the restaurant directly.';
    }

    if (!formData.table_number) {
      newErrors.table_number = 'Please select a seating table.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate inputs
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationPayload = {
        restaurant: formData.restaurant,
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        table_number: formData.table_number,
        special_request: formData.special_request.trim() || null
      };

      // Perform Supabase INSERT
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationPayload])
        .select();

      if (error) throw error;

      // Set confirmed reservation details to display success screen
      setSubmittedReservation(data && data[0] ? data[0] : reservationPayload);
    } catch (err) {
      console.error('Error submitting reservation:', err);
      setSubmitError(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedReservation(null);
    setFormData({
      restaurant: '',
      customer_name: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      table_number: '',
      special_request: ''
    });
    setErrors({});
    setSubmitError(null);
  };

  // Get today's date in YYYY-MM-DD for min date picker constraint
  const todayString = new Date().toISOString().split('T')[0];

  // Render Confirmation Screen when submitted
  if (submittedReservation) {
    return (
      <div className="section-container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} className="success-icon" />
            </div>
            <h1 className="confirmation-title">Reservation Confirmed!</h1>
            <p className="confirmation-subtitle">
              Your table has been successfully booked. We've notified the restaurant!
            </p>
          </div>

          <div className="confirmation-details-box">
            <h3 className="summary-heading">Booking Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Restaurant</span>
                <span className="summary-value highlight">{submittedReservation.restaurant}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Customer Name</span>
                <span className="summary-value">{submittedReservation.customer_name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Phone</span>
                <span className="summary-value">{submittedReservation.phone}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Date</span>
                <span className="summary-value">{submittedReservation.date}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Time</span>
                <span className="summary-value">{submittedReservation.time}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Guests</span>
                <span className="summary-value">{submittedReservation.guests} {submittedReservation.guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Table</span>
                <span className="summary-value">{submittedReservation.table_number}</span>
              </div>
              {submittedReservation.special_request && (
                <div className="summary-item full-width">
                  <span className="summary-label">Special Request</span>
                  <span className="summary-value italic">"{submittedReservation.special_request}"</span>
                </div>
              )}
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/reservations" className="btn btn-primary btn-lg">
              <span>View My Reservations</span>
              <ArrowRight size={18} />
            </Link>
            <button 
              type="button" 
              onClick={handleResetForm} 
              className="btn btn-secondary btn-lg"
            >
              <span>Book Another Table</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page section-container">
      <div className="page-header text-center">
        <h1 className="page-title">Reserve a Table</h1>
        <p className="page-subtitle">
          Fill in your details below to confirm your dine-in table reservation.
        </p>
      </div>

      <div className="booking-form-wrapper">
        {submitError && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form" noValidate>
          <div className="form-grid">
            {/* Restaurant Selection */}
            <div className="form-group full-width">
              <label htmlFor="restaurant" className="form-label">
                Restaurant <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <select
                  id="restaurant"
                  name="restaurant"
                  value={formData.restaurant}
                  onChange={handleChange}
                  className={`form-select ${errors.restaurant ? 'input-error' : ''}`}
                  disabled={loadingRestaurants}
                >
                  <option value="">-- Choose a Restaurant --</option>
                  {restaurants.map((rest) => (
                    <option key={rest.id} value={rest.name}>
                      {rest.name}
                    </option>
                  ))}
                  {/* Fallback default options if Supabase restaurants still loading */}
                  {restaurants.length === 0 && (
                    <>
                      <option value="Karavalli">Karavalli</option>
                      <option value="Farmlore">Farmlore</option>
                      <option value="LUPA">LUPA</option>
                      <option value="Rim Naam">Rim Naam</option>
                      <option value="Shiro Bengaluru">Shiro Bengaluru</option>
                      <option value="Bombay Brasserie">Bombay Brasserie</option>
                      <option value="The 13th Floor">The 13th Floor</option>
                      <option value="Spice Terrace">Spice Terrace</option>
                    </>
                  )}
                </select>
              </div>
              {errors.restaurant && <span className="field-error">{errors.restaurant}</span>}
            </div>

            {/* Customer Name */}
            <div className="form-group">
              <label htmlFor="customer_name" className="form-label">
                Customer Name <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className={`form-input icon-padded ${errors.customer_name ? 'input-error' : ''}`}
                />
              </div>
              {errors.customer_name && <span className="field-error">{errors.customer_name}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Phone size={18} className="field-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input icon-padded ${errors.phone ? 'input-error' : ''}`}
                />
              </div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={18} className="field-icon" />
                <input
                  type="date"
                  id="date"
                  name="date"
                  min={todayString}
                  value={formData.date}
                  onChange={handleChange}
                  className={`form-input icon-padded ${errors.date ? 'input-error' : ''}`}
                />
              </div>
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>

            {/* Time */}
            <div className="form-group">
              <label htmlFor="time" className="form-label">
                Time <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Clock size={18} className="field-icon" />
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`form-select icon-padded ${errors.time ? 'input-error' : ''}`}
                >
                  <option value="">-- Select Time Slot --</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              {errors.time && <span className="field-error">{errors.time}</span>}
            </div>

            {/* Number of Guests */}
            <div className="form-group">
              <label htmlFor="guests" className="form-label">
                Number of Guests <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Users size={18} className="field-icon" />
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  min="1"
                  max="20"
                  value={formData.guests}
                  onChange={handleChange}
                  className={`form-input icon-padded ${errors.guests ? 'input-error' : ''}`}
                />
              </div>
              {errors.guests && <span className="field-error">{errors.guests}</span>}
            </div>

            {/* Table Selection */}
            <div className="form-group">
              <label htmlFor="table_number" className="form-label">
                Table Selection <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Armchair size={18} className="field-icon" />
                <select
                  id="table_number"
                  name="table_number"
                  value={formData.table_number}
                  onChange={handleChange}
                  className={`form-select icon-padded ${errors.table_number ? 'input-error' : ''}`}
                >
                  <option value="">-- Choose a Table --</option>
                  {TABLE_OPTIONS.map((table) => (
                    <option key={table} value={table}>
                      {table}
                    </option>
                  ))}
                </select>
              </div>
              {errors.table_number && <span className="field-error">{errors.table_number}</span>}
            </div>

            {/* Special Request */}
            <div className="form-group full-width">
              <label htmlFor="special_request" className="form-label">
                Special Request (Optional)
              </label>
              <textarea
                id="special_request"
                name="special_request"
                rows="3"
                placeholder="e.g. Anniversary celebration, high chair needed, dietary restrictions, quiet corner..."
                value={formData.special_request}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="form-footer">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block btn-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-inline"></span>
                  <span>Confirming Reservation...</span>
                </>
              ) : (
                <>
                  <Calendar size={18} />
                  <span>Reserve Table</span>
                </>
              )}
            </button>
            <p className="form-disclaimer">
              🔒 Instant confirmation. No pre-payment or credit card required.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

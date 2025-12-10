import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Booking.css';

const Booking = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000), // Tomorrow
    adults: 1,
    children: 0,
    roomType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    specialRequests: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchItem();
  }, [type, id]);

  useEffect(() => {
    if (item && formRef.current) {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }, [item]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const endpoint = type === 'hotel' ? `/api/hotels/${id}` : `/api/packages/${id}`;
      const response = await axios.get(endpoint);
      setItem(response.data);

      if (type === 'hotel' && response.data.rooms.length > 0) {
        setFormData(prev => ({
          ...prev,
          roomType: response.data.rooms[0].type
        }));
      }

      setError(null);
    } catch (err) {
      setError('Failed to load booking details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date
    });

    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (formData.checkOut <= formData.checkIn) {
      errors.checkOut = 'Check-out must be after check-in';
    }

    if (formData.adults < 1) {
      errors.adults = 'At least 1 adult is required';
    }

    if (type === 'hotel' && !formData.roomType) {
      errors.roomType = 'Please select a room type';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotalPrice = () => {
    if (!item) return 0;

    const days = Math.ceil((formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24));

    if (type === 'hotel') {
      const room = item.rooms.find(r => r.type === formData.roomType);
      return room ? room.price * days : 0;
    } else {
      const totalGuests = formData.adults + formData.children;
      return item.price * totalGuests;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.keys(validationErrors)[0];
      document.getElementsByName(firstError)[0]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        type: type,
        [type]: id,
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          specialRequests: formData.specialRequests
        },
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: {
          adults: parseInt(formData.adults),
          children: parseInt(formData.children)
        },
        roomType: formData.roomType,
        totalPrice: calculateTotalPrice()
      };

      const response = await axios.post('/api/bookings', bookingData);

      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          navigate(`/confirmation/${response.data.booking._id}`);
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error(err);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (error && !item) {
    return <div className="error">{error}</div>;
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Complete Your Booking</h1>

        {error && <div className="error">{error}</div>}

        <div className="booking-grid" ref={formRef}>
          <div className="booking-form">
            <form onSubmit={handleSubmit}>
              <section className="form-section">
                <h2>Guest Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={validationErrors.firstName ? 'error' : ''}
                    />
                    {validationErrors.firstName && (
                      <span className="error-message">{validationErrors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={validationErrors.lastName ? 'error' : ''}
                    />
                    {validationErrors.lastName && (
                      <span className="error-message">{validationErrors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={validationErrors.email ? 'error' : ''}
                    />
                    {validationErrors.email && (
                      <span className="error-message">{validationErrors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={validationErrors.phone ? 'error' : ''}
                    />
                    {validationErrors.phone && (
                      <span className="error-message">{validationErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </section>

              <section className="form-section">
                <h2>Booking Details</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Check-In *</label>
                    <DatePicker
                      selected={formData.checkIn}
                      onChange={(date) => handleDateChange(date, 'checkIn')}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      className={validationErrors.checkIn ? 'error' : ''}
                    />
                  </div>

                  <div className="form-group">
                    <label>Check-Out *</label>
                    <DatePicker
                      selected={formData.checkOut}
                      onChange={(date) => handleDateChange(date, 'checkOut')}
                      minDate={formData.checkIn}
                      dateFormat="MMMM d, yyyy"
                      className={validationErrors.checkOut ? 'error' : ''}
                    />
                    {validationErrors.checkOut && (
                      <span className="error-message">{validationErrors.checkOut}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Adults *</label>
                    <input
                      type="number"
                      name="adults"
                      min="1"
                      value={formData.adults}
                      onChange={handleChange}
                      className={validationErrors.adults ? 'error' : ''}
                    />
                    {validationErrors.adults && (
                      <span className="error-message">{validationErrors.adults}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Children</label>
                    <input
                      type="number"
                      name="children"
                      min="0"
                      value={formData.children}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {type === 'hotel' && item.rooms && (
                  <div className="form-group">
                    <label>Room Type *</label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className={validationErrors.roomType ? 'error' : ''}
                    >
                      {item.rooms.map((room, index) => (
                        <option key={index} value={room.type}>
                          {room.type} - ${room.price}/night (Capacity: {room.capacity})
                        </option>
                      ))}
                    </select>
                    {validationErrors.roomType && (
                      <span className="error-message">{validationErrors.roomType}</span>
                    )}
                  </div>
                )}
              </section>

              <section className="form-section">
                <h2>Special Requests (Optional)</h2>
                <div className="form-group">
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </section>

              <button
                type="submit"
                className="btn btn-primary btn-large btn-block"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : `Book Now - $${totalPrice}`}
              </button>
            </form>
          </div>

          <div className="booking-summary">
            <div className="summary-card">
              <h2>Booking Summary</h2>

              <div className="summary-item-header">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/300x200'}
                  alt={item.name}
                />
                <h3>{item.name}</h3>
                <p className="item-location">📍 {item.region}</p>
              </div>

              <div className="summary-details">
                <div className="detail-row">
                  <span>Check-In:</span>
                  <strong>{formData.checkIn.toLocaleDateString()}</strong>
                </div>
                <div className="detail-row">
                  <span>Check-Out:</span>
                  <strong>{formData.checkOut.toLocaleDateString()}</strong>
                </div>
                <div className="detail-row">
                  <span>Guests:</span>
                  <strong>{formData.adults} Adults, {formData.children} Children</strong>
                </div>
                {type === 'hotel' && formData.roomType && (
                  <div className="detail-row">
                    <span>Room Type:</span>
                    <strong>{formData.roomType}</strong>
                  </div>
                )}
              </div>

              <div className="summary-total">
                <span>Total Price:</span>
                <strong>${totalPrice}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

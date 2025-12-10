import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const confirmationRef = useRef(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (booking && confirmationRef.current) {
      gsap.from(confirmationRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }
  }, [booking]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings/${bookingId}`);
      setBooking(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch booking details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading booking confirmation...</div>;
  }

  if (error || !booking) {
    return (
      <div className="container">
        <div className="error">{error || 'Booking not found'}</div>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    );
  }

  const item = booking.hotel || booking.package;
  const itemType = booking.type;

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-content" ref={confirmationRef}>
          <div className="success-icon">✓</div>

          <h1>Booking Confirmed!</h1>
          <p className="confirmation-message">
            Thank you for your booking. A confirmation email has been sent to{' '}
            <strong>{booking.guestInfo.email}</strong>
          </p>

          <div className="confirmation-card">
            <div className="card-header">
              <h2>Booking Details</h2>
              <span className={`status ${booking.status}`}>{booking.status}</span>
            </div>

            <div className="booking-info">
              <div className="info-section">
                <h3>{itemType === 'hotel' ? 'Hotel Information' : 'Package Information'}</h3>
                <div className="item-details">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/400x200'}
                    alt={item.name}
                  />
                  <div>
                    <h4>{item.name}</h4>
                    <p className="location">📍 {item.region}</p>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Guest Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name:</label>
                    <span>{booking.guestInfo.firstName} {booking.guestInfo.lastName}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{booking.guestInfo.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{booking.guestInfo.phone}</span>
                  </div>
                  {booking.guestInfo.country && (
                    <div className="info-item">
                      <label>Country:</label>
                      <span>{booking.guestInfo.country}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-section">
                <h3>Stay Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Check-In:</label>
                    <span>{new Date(booking.checkIn).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="info-item">
                    <label>Check-Out:</label>
                    <span>{new Date(booking.checkOut).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="info-item">
                    <label>Guests:</label>
                    <span>{booking.guests.adults} Adults, {booking.guests.children} Children</span>
                  </div>
                  {booking.roomType && (
                    <div className="info-item">
                      <label>Room Type:</label>
                      <span>{booking.roomType}</span>
                    </div>
                  )}
                </div>
              </div>

              {booking.guestInfo.specialRequests && (
                <div className="info-section">
                  <h3>Special Requests</h3>
                  <p className="special-requests">{booking.guestInfo.specialRequests}</p>
                </div>
              )}

              <div className="info-section total-section">
                <div className="total-price">
                  <span>Total Price:</span>
                  <strong>${booking.totalPrice}</strong>
                </div>
                <div className="payment-status">
                  <span>Payment Status:</span>
                  <span className={`status ${booking.paymentStatus}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="booking-reference">
              <p><strong>Booking Reference:</strong> {booking._id}</p>
              <p className="note">Please save this reference number for your records</p>
            </div>
          </div>

          <div className="action-buttons">
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
            <Link to={itemType === 'hotel' ? '/hotels' : '/packages'} className="btn btn-secondary">
              Browse More {itemType === 'hotel' ? 'Hotels' : 'Packages'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

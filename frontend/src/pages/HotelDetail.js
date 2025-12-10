import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import GoogleMap from '../components/GoogleMap';
import './HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchHotel();
  }, [id]);

  useEffect(() => {
    if (hotel && contentRef.current) {
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }
  }, [hotel]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/hotels/${id}`);
      setHotel(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hotel details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading hotel details...</div>;
  }

  if (error || !hotel) {
    return <div className="error">{error || 'Hotel not found'}</div>;
  }

  const mapLocations = [{
    name: hotel.name,
    coordinates: hotel.location.coordinates,
    address: hotel.address,
    price: hotel.pricePerNight
  }];

  return (
    <div className="hotel-detail-page">
      <div className="container">
        <div className="detail-content" ref={contentRef}>
          <div className="detail-header">
            <h1>{hotel.name}</h1>
            <div className="header-info">
              <span className="rating">⭐ {hotel.rating}</span>
              <span className="location">📍 {hotel.region}</span>
            </div>
          </div>

          <div className="detail-image">
            <img
              src={hotel.images[0] || 'https://via.placeholder.com/800x400'}
              alt={hotel.name}
            />
          </div>

          <div className="detail-grid">
            <div className="detail-main">
              <section className="detail-section">
                <h2>About This Hotel</h2>
                <p>{hotel.description}</p>
              </section>

              <section className="detail-section">
                <h2>Address</h2>
                <p>{hotel.address}</p>
              </section>

              <section className="detail-section">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      ✓ {amenity}
                    </div>
                  ))}
                </div>
              </section>

              <section className="detail-section">
                <h2>Room Types</h2>
                <div className="rooms-list">
                  {hotel.rooms.map((room, index) => (
                    <div key={index} className="room-card">
                      <div className="room-info">
                        <h3>{room.type}</h3>
                        <p>Capacity: {room.capacity} guests</p>
                        <p className="availability">
                          {room.available > 0 ? `${room.available} rooms available` : 'Sold out'}
                        </p>
                      </div>
                      <div className="room-price">
                        <span className="price">${room.price}</span>
                        <span className="period">/night</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="detail-section">
                <h2>Location</h2>
                <GoogleMap
                  locations={mapLocations}
                  center={{
                    lat: hotel.location.coordinates[1],
                    lng: hotel.location.coordinates[0]
                  }}
                  zoom={14}
                />
              </section>
            </div>

            <div className="detail-sidebar">
              <div className="booking-card">
                <div className="booking-price">
                  <span className="from">From</span>
                  <span className="amount">${hotel.pricePerNight}</span>
                  <span className="period">/night</span>
                </div>
                <Link
                  to={`/booking/hotel/${hotel._id}`}
                  className="btn btn-primary btn-block"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import SearchBar from '../components/SearchBar';
import './Hotels.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (hotels.length > 0) {
      gsap.fromTo(cardsRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out'
        }
      );
    }
  }, [hotels]);

  const fetchHotels = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/hotels?${queryParams}`);
      setHotels(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hotels. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    fetchHotels(filters);
  };

  if (loading) {
    return <div className="loading">Loading hotels...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="hotels-page">
      <div className="container">
        <h1 className="page-title">Find Your Perfect Hotel</h1>

        <SearchBar onSearch={handleSearch} type="hotel" />

        {hotels.length === 0 ? (
          <div className="no-results">
            <p>No hotels found. Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid">
            {hotels.map((hotel, index) => (
              <div
                key={hotel._id}
                className="card hotel-card"
                ref={el => cardsRef.current[index] = el}
              >
                <div className="hotel-image">
                  <img
                    src={hotel.images[0] || 'https://via.placeholder.com/400x250'}
                    alt={hotel.name}
                  />
                  <div className="hotel-rating">⭐ {hotel.rating}</div>
                </div>
                <div className="hotel-content">
                  <h3>{hotel.name}</h3>
                  <p className="hotel-region">📍 {hotel.region}</p>
                  <p className="hotel-description">{hotel.description.substring(0, 100)}...</p>

                  <div className="hotel-amenities">
                    {hotel.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>

                  <div className="hotel-footer">
                    <div className="hotel-price">
                      <span className="price-label">From</span>
                      <span className="price-value">${hotel.pricePerNight}</span>
                      <span className="price-period">/night</span>
                    </div>
                    <Link to={`/hotels/${hotel._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;

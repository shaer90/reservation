import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import SearchBar from '../components/SearchBar';
import './Packages.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (packages.length > 0) {
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
  }, [packages]);

  const fetchPackages = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/packages?${queryParams}`);
      setPackages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch packages. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    fetchPackages(filters);
  };

  if (loading) {
    return <div className="loading">Loading packages...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="packages-page">
      <div className="container">
        <h1 className="page-title">Explore Tour Packages</h1>

        <SearchBar onSearch={handleSearch} type="package" />

        {packages.length === 0 ? (
          <div className="no-results">
            <p>No packages found. Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="card package-card"
                ref={el => cardsRef.current[index] = el}
              >
                <div className="package-image">
                  <img
                    src={pkg.images[0] || 'https://via.placeholder.com/400x250'}
                    alt={pkg.name}
                  />
                  <div className="package-badge">{pkg.duration} Days</div>
                  <div className="package-rating">⭐ {pkg.rating}</div>
                </div>
                <div className="package-content">
                  <h3>{pkg.name}</h3>
                  <p className="package-region">📍 {pkg.region}</p>
                  <p className="package-description">{pkg.description.substring(0, 120)}...</p>

                  <div className="package-details">
                    <span className="detail-item">
                      👥 Max {pkg.maxGroupSize} people
                    </span>
                    <span className={`difficulty ${pkg.difficulty.toLowerCase()}`}>
                      {pkg.difficulty}
                    </span>
                  </div>

                  <div className="package-footer">
                    <div className="package-price">
                      <span className="price-value">${pkg.price}</span>
                      <span className="price-period">/person</span>
                    </div>
                    <Link to={`/packages/${pkg._id}`} className="btn btn-primary">
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

export default Packages;

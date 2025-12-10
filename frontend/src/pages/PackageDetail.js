import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import GoogleMap from '../components/GoogleMap';
import './PackageDetail.css';

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchPackage();
  }, [id]);

  useEffect(() => {
    if (pkg && contentRef.current) {
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }
  }, [pkg]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/packages/${id}`);
      setPkg(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch package details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading package details...</div>;
  }

  if (error || !pkg) {
    return <div className="error">{error || 'Package not found'}</div>;
  }

  const mapLocations = pkg.destinations.map(dest => ({
    name: dest.name,
    coordinates: dest.location.coordinates
  }));

  const mapCenter = mapLocations.length > 0 ? {
    lat: mapLocations[0].coordinates[1],
    lng: mapLocations[0].coordinates[0]
  } : null;

  return (
    <div className="package-detail-page">
      <div className="container">
        <div className="detail-content" ref={contentRef}>
          <div className="detail-header">
            <h1>{pkg.name}</h1>
            <div className="header-info">
              <span className="rating">⭐ {pkg.rating}</span>
              <span className="duration">⏱️ {pkg.duration} Days</span>
              <span className="location">📍 {pkg.region}</span>
              <span className={`difficulty ${pkg.difficulty.toLowerCase()}`}>
                {pkg.difficulty}
              </span>
            </div>
          </div>

          <div className="detail-image">
            <img
              src={pkg.images[0] || 'https://via.placeholder.com/800x400'}
              alt={pkg.name}
            />
          </div>

          <div className="detail-grid">
            <div className="detail-main">
              <section className="detail-section">
                <h2>About This Package</h2>
                <p>{pkg.description}</p>
              </section>

              <section className="detail-section">
                <h2>Package Details</h2>
                <div className="package-info-grid">
                  <div className="info-item">
                    <strong>Duration:</strong> {pkg.duration} days
                  </div>
                  <div className="info-item">
                    <strong>Max Group Size:</strong> {pkg.maxGroupSize} people
                  </div>
                  <div className="info-item">
                    <strong>Difficulty:</strong> {pkg.difficulty}
                  </div>
                </div>
              </section>

              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <section className="detail-section">
                  <h2>Itinerary</h2>
                  <div className="itinerary-list">
                    {pkg.itinerary.map((day, index) => (
                      <div key={index} className="itinerary-day">
                        <div className="day-number">Day {day.day}</div>
                        <div className="day-content">
                          <h3>{day.title}</h3>
                          <div className="activities">
                            <strong>Activities:</strong>
                            <ul>
                              {day.activities.map((activity, i) => (
                                <li key={i}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                          {day.meals && day.meals.length > 0 && (
                            <p className="meals">
                              <strong>Meals:</strong> {day.meals.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="detail-section">
                <div className="inclusions-exclusions">
                  <div className="list-column">
                    <h3>✓ What's Included</h3>
                    <ul>
                      {pkg.inclusions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="list-column">
                    <h3>✗ What's Not Included</h3>
                    <ul>
                      {pkg.exclusions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {mapLocations.length > 0 && (
                <section className="detail-section">
                  <h2>Destinations</h2>
                  <GoogleMap
                    locations={mapLocations}
                    center={mapCenter}
                    zoom={10}
                  />
                </section>
              )}
            </div>

            <div className="detail-sidebar">
              <div className="booking-card">
                <div className="booking-price">
                  <span className="amount">${pkg.price}</span>
                  <span className="period">/person</span>
                </div>
                <div className="booking-info">
                  <p>👥 Max {pkg.maxGroupSize} people</p>
                  <p>⏱️ {pkg.duration} days</p>
                </div>
                <Link
                  to={`/booking/package/${pkg._id}`}
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

export default PackageDetail;

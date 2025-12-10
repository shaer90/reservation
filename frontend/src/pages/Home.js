import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './Home.css';

const Home = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      delay: 0.5
    });
  }, []);

  return (
    <div className="home">
      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Adventure</h1>
          <p className="hero-subtitle">
            Book amazing hotels and explore curated travel packages
          </p>
          <div className="hero-buttons">
            <Link to="/hotels" className="btn btn-primary btn-large">
              Browse Hotels
            </Link>
            <Link to="/packages" className="btn btn-secondary btn-large">
              View Packages
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="feature-grid">
            <div className="feature-card" ref={el => cardsRef.current[0] = el}>
              <div className="feature-icon">🏨</div>
              <h3>Best Hotels</h3>
              <p>Handpicked accommodations with the best ratings and amenities</p>
            </div>

            <div className="feature-card" ref={el => cardsRef.current[1] = el}>
              <div className="feature-icon">🗺️</div>
              <h3>Amazing Locations</h3>
              <p>Explore destinations with interactive maps and local insights</p>
            </div>

            <div className="feature-card" ref={el => cardsRef.current[2] = el}>
              <div className="feature-icon">💰</div>
              <h3>Great Prices</h3>
              <p>Competitive rates and exclusive deals on hotels and packages</p>
            </div>

            <div className="feature-card" ref={el => cardsRef.current[3] = el}>
              <div className="feature-icon">⭐</div>
              <h3>Easy Booking</h3>
              <p>Simple and secure booking process with instant confirmation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Start Planning Your Journey Today</h2>
          <p>Find the perfect hotel or package for your next adventure</p>
          <Link to="/hotels" className="btn btn-primary btn-large">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

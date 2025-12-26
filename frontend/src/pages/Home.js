import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // FASTER animations - reduced duration and complexity
    const tl = gsap.timeline();

    // Animate hero elements - FASTER
    tl.fromTo(titleRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(buttonsRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    );

    // Simple card animations without ScrollTrigger for better performance
    const cards = document.querySelectorAll('.feature-card');
    if (cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.6
        }
      );
    }
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content" ref={heroRef}>
          <h1 className="hero-title" ref={titleRef}>Discover Your Next Adventure</h1>
          <p className="hero-subtitle" ref={subtitleRef}>
            Book amazing hotels and explore curated travel packages
          </p>
          <div className="hero-buttons" ref={buttonsRef}>
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
        <div className="container" ref={ctaRef}>
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

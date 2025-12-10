import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Packages from './pages/Packages';
import HotelDetail from './pages/HotelDetail';
import PackageDetail from './pages/PackageDetail';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/booking/:type/:id" element={<Booking />} />
          <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = ({ onSearch, type = 'hotel' }) => {
  const [regions, setRegions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    minPrice: '',
    maxPrice: '',
    rating: ''
  });

  useEffect(() => {
    fetchRegions();
  }, [type]);

  const fetchRegions = async () => {
    try {
      const endpoint = type === 'hotel' ? '/api/hotels/regions/list' : '/api/packages/regions/list';
      const response = await axios.get(endpoint);
      setRegions(response.data);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      region: '',
      minPrice: '',
      maxPrice: '',
      rating: ''
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-row">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder={`Search ${type}s...`}
            className="search-input"
          />

          <select
            name="region"
            value={filters.region}
            onChange={handleChange}
            className="search-select"
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min Price"
            className="search-input small"
          />

          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max Price"
            className="search-input small"
          />

          <select
            name="rating"
            value={filters.rating}
            onChange={handleChange}
            className="search-select small"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.8">4.8+ Stars</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Search
          </button>

          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const Form = ({ getWeather }) => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-3">Search Location</h4>
      
      <div className="form-group">
        <div className="input-group">
          <span className="input-group-text">
            <FaMapMarkerAlt />
          </span>
          <input 
            type="text" 
            className="form-control" 
            name="City" 
            id="city"
            placeholder="Enter city name..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <div className="input-group">
          <span className="input-group-text">
            <FaMapMarkerAlt />
          </span>
          <input 
            type="text" 
            className="form-control" 
            name="Country" 
            id="country"
            placeholder="Enter country name or code..." 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <small className="form-text text-muted">
          You can use country codes like US, UK, IN, etc.
        </small>
      </div>
      
      <button type="submit" className="btn btn-primary btn-block">
        <FaSearch className="me-2" /> Search Weather
      </button>
    </form>
  );
};

export default Form;

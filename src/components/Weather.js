import React from "react";
import { FaThermometerHalf, FaTint, FaWind, FaMapMarkerAlt, FaLocationArrow, FaCompass, FaCloudRain, FaCloud } from 'react-icons/fa';

const Weather = ({ 
  temperature, 
  humidity, 
  city, 
  country, 
  description, 
  error, 
  icon, 
  feels_like, 
  wind_speed,
  loading
}) => {
  console.log("Weather component props:", { 
    temperature, humidity, city, country, description, error, icon, feels_like, wind_speed, loading
  });

  const hasWeatherData = city && country && temperature;

  // Get weather icon based on description
  const getWeatherIcon = (description) => {
    if (!description) return <FaCloud />;
    
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return <FaCloudRain />;
    if (desc.includes('cloud')) return <FaCloud />;
    return <FaCloud />;
  };

  return (
    <div className="weather__info">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {hasWeatherData ? (
        <>
          <div className="weather-card">
            <div className="weather-header">
              <div>
                <h2 className="weather-location">
                  <FaMapMarkerAlt className="me-2" />
                  {city}, {country}
                </h2>
                {description && (
                  <p className="weather-description">{description}</p>
                )}
              </div>
              {icon && (
                <img 
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
                  alt={description || 'weather icon'} 
                  className="weather-icon-img"
                />
              )}
            </div>
            
            <div className="weather-temp">
              {temperature}°C
            </div>
          </div>
          
          <div className="weather-details">
            {feels_like !== undefined && (
              <div className="weather-detail-item">
                <div className="detail-label">
                  <FaThermometerHalf className="me-2" /> Feels Like
                </div>
                <div className="detail-value">{feels_like}°C</div>
              </div>
            )}
            
            {humidity !== undefined && (
              <div className="weather-detail-item">
                <div className="detail-label">
                  <FaTint className="me-2" /> Humidity
                </div>
                <div className="detail-value">{humidity}%</div>
              </div>
            )}
            
            {wind_speed !== undefined && (
              <div className="weather-detail-item">
                <div className="detail-label">
                  <FaWind className="me-2" /> Wind Speed
                </div>
                <div className="detail-value">{wind_speed} m/s</div>
              </div>
            )}
            
            {description !== undefined && (
              <div className="weather-detail-item">
                <div className="detail-label">
                  <FaCompass className="me-2" /> Conditions
                </div>
                <div className="detail-value">{description}</div>
              </div>
            )}
          </div>
        </>
      ) : !error ? (
        <div className="alert alert-info" role="alert">
          <FaLocationArrow className="me-2" />
          {loading ? "Getting your current location weather..." : "No weather data available. Please search for a location."}
        </div>
      ) : null}
    </div>
  );
};

export default Weather;

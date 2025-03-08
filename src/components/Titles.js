import React from "react";
import { FaCloudSun } from 'react-icons/fa';

const Titles = () => {
  return (
    <div className="text-center">
      <FaCloudSun className="mb-4" style={{ fontSize: '4rem', color: 'var(--accent-color)' }} />
      <h1 className="title-container__title">Weather Finder</h1>
      <h3 className="title-container__subtitle">
        Get real-time weather information for any location
      </h3>
      <div className="mt-4">
        <p>Find out temperature, humidity, wind speed and more...</p>
      </div>
    </div>
  );
};

export default Titles;

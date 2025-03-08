import React from "react";
import { FaNewspaper, FaExternalLinkAlt } from 'react-icons/fa';

const LocalNews = ({ newsData, city, loading, error }) => {
  return (
    <div className="local-news">
      <div className="news-header">
        <h3>
          <FaNewspaper className="me-2" />
          Local News for {city}
        </h3>
      </div>
      
      {error && (
        <div className="alert alert-info" role="alert">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="loader">
          <div className="loader-spinner"></div>
          <p className="mt-3 text-center">Loading news...</p>
        </div>
      ) : newsData && newsData.length > 0 ? (
        <div className="news-list">
          {newsData.map((news, index) => (
            <div key={index} className="news-item">
              <a 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="news-link-wrapper"
              >
                <div className="news-content">
                  {news.urlToImage && (
                    <div className="news-image-container">
                      <img 
                        src={news.urlToImage} 
                        alt={news.title} 
                        className="news-image" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="news-text">
                    <h4 className="news-title">{news.title}</h4>
                    <p className="news-description">{news.description}</p>
                    <div className="news-footer">
                      <span className="news-source">{news.source}</span>
                      <span className="news-date">{formatDate(news.publishedAt)}</span>
                    </div>
                    <div className="read-more">
                      Read More <FaExternalLinkAlt className="ms-1" />
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      ) : !error ? (
        <div className="alert alert-info" role="alert">
          No news available for {city}. Try another location.
        </div>
      ) : null}
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default LocalNews; 
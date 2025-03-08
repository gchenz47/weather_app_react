import React, { useState, useEffect } from "react";
import Titles from "./components/Titles";
import Form from "./components/Form";
import Weather from "./components/Weather";
import LocalNews from "./components/LocalNews";
import { FaMoon, FaSun, FaLocationArrow } from 'react-icons/fa';

const API_KEY = "bd5e378503939ddaee76f12ad7a97608";
// Using a free news API that doesn't require authentication
const NEWS_API_BASE_URL = "https://raw.githubusercontent.com/SauravKanchan/NewsAPI/master/top-headlines";

const App = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: undefined,
    humidity: undefined,
    description: undefined,
    city: undefined,
    country: undefined,
    error: undefined,
    icon: undefined,
    feels_like: undefined,
    wind_speed: undefined
  });
  const [newsData, setNewsData] = useState({
    articles: [],
    loading: false,
    error: undefined
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(true);
  const [geoLocationAvailable, setGeoLocationAvailable] = useState(true);

  useEffect(() => {
    // Check for user's preferred color scheme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
    
    // Apply dark mode class if needed
    if (prefersDarkMode) {
      document.body.classList.add('dark-mode');
    }

    // Validate API key on component mount
    validateApiKey();

    // Get user's current location and fetch weather data
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setGeoLocationAvailable(false);
          setLoading(false);
        }
      );
    } else {
      setGeoLocationAvailable(false);
      setLoading(false);
    }
  };

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
      setWeatherData(prev => ({ ...prev, error: undefined }));
      
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
      console.log('Fetching from:', apiUrl);
      
      const api_call = await fetch(apiUrl);
      
      if (!api_call.ok) {
        throw new Error(`HTTP error! Status: ${api_call.status}`);
      }
      
      const data = await api_call.json();
      console.log('API response:', data);
      
      if (data.cod !== '404' && data.cod !== 404) {
        const weatherInfo = {
          temperature: Math.round((data.main.temp - 273.15) * 10) / 10,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          city: data.name,
          country: data.sys.country,
          error: undefined,
          icon: data.weather[0].icon,
          feels_like: Math.round((data.main.feels_like - 273.15) * 10) / 10,
          wind_speed: data.wind.speed
        };
        
        console.log('Setting weather data:', weatherInfo);
        setWeatherData(weatherInfo);
        
        // Fetch news for the city
        fetchLocalNews(data.name);
      } else {
        setWeatherData({
          temperature: undefined,
          humidity: undefined,
          description: undefined,
          city: undefined,
          country: undefined,
          error: 'Location not found. Please check your city and country names.',
          icon: undefined,
          feels_like: undefined,
          wind_speed: undefined
        });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const validateApiKey = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${API_KEY}`);
      if (response.status === 401) {
        setApiKeyValid(false);
      }
    } catch (error) {
      console.error('API validation error:', error);
    }
  };

  const getWeather = async (e) => {
    e.preventDefault();
    
    if (!apiKeyValid) {
      setWeatherData(prev => ({
        ...prev,
        error: 'Invalid API key. Please check your OpenWeatherMap API key.'
      }));
      return;
    }
    
    const city = e.target.elements.City.value;
    const country = e.target.elements.Country.value;
    
    if (city && country) {
      try {
        setLoading(true);
        setWeatherData(prev => ({ ...prev, error: undefined }));
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&appid=${API_KEY}`;
        console.log('Fetching from:', apiUrl);
        
        const api_call = await fetch(apiUrl);
        
        if (!api_call.ok) {
          throw new Error(`HTTP error! Status: ${api_call.status}`);
        }
        
        const data = await api_call.json();
        console.log('API response:', data);
        
        if (data.cod !== '404' && data.cod !== 404) {
          const weatherInfo = {
            temperature: Math.round((data.main.temp - 273.15) * 10) / 10,
            humidity: data.main.humidity,
            description: data.weather[0].description,
            city: data.name,
            country: data.sys.country,
            error: undefined,
            icon: data.weather[0].icon,
            feels_like: Math.round((data.main.feels_like - 273.15) * 10) / 10,
            wind_speed: data.wind.speed
          };
          
          console.log('Setting weather data:', weatherInfo);
          setWeatherData(weatherInfo);
          
          // Fetch news for the city
          fetchLocalNews(data.name);
        } else {
          setWeatherData({
            temperature: undefined,
            humidity: undefined,
            description: undefined,
            city: undefined,
            country: undefined,
            error: 'Location not found. Please check your city and country names.',
            icon: undefined,
            feels_like: undefined,
            wind_speed: undefined
          });
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    } else {
      setWeatherData({
        temperature: undefined,
        humidity: undefined,
        description: undefined,
        city: undefined,
        country: undefined,
        error: 'Please enter both city and country',
        icon: undefined,
        feels_like: undefined,
        wind_speed: undefined
      });
    }
  };

  const fetchLocalNews = async (city) => {
    if (!city) return;
    
    setNewsData(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      // First try to get country-specific news
      // Map common countries to their ISO codes
      const countryMap = {
        'United States': 'us',
        'USA': 'us',
        'US': 'us',
        'United Kingdom': 'gb',
        'UK': 'gb',
        'India': 'in',
        'Australia': 'au',
        'Russia': 'ru',
        'France': 'fr'
      };
      
      // Try to determine country from the city's country
      let countryCode = 'us'; // Default to US
      if (weatherData.country) {
        // Convert country code to lowercase
        const lowerCountryCode = weatherData.country.toLowerCase();
        // Check if it's one of our supported countries
        if (['us', 'gb', 'in', 'au', 'ru', 'fr'].includes(lowerCountryCode)) {
          countryCode = lowerCountryCode;
        } else if (countryMap[weatherData.country]) {
          countryCode = countryMap[weatherData.country];
        }
      }
      
      // Fetch news from the GitHub-hosted API
      const newsUrl = `${NEWS_API_BASE_URL}/${countryCode}.json`;
      console.log('Fetching news from:', newsUrl);
      
      const response = await fetch(newsUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('News API response:', data);
      
      if (data.articles && data.articles.length > 0) {
        // Format and filter the news data
        // Try to find articles related to the city or general news
        const cityLower = city.toLowerCase();
        
        // First try to find articles mentioning the city
        let relevantArticles = data.articles.filter(article => 
          article.title.toLowerCase().includes(cityLower) || 
          (article.description && article.description.toLowerCase().includes(cityLower))
        );
        
        // If we don't have enough city-specific articles, add some general ones
        if (relevantArticles.length < 5) {
          const generalArticles = data.articles
            .filter(article => 
              !relevantArticles.some(a => a.title === article.title)
            )
            .slice(0, 5 - relevantArticles.length);
          
          relevantArticles = [...relevantArticles, ...generalArticles];
        }
        
        // Take the first 5 articles
        const formattedNews = relevantArticles.slice(0, 5).map(article => ({
          title: article.title,
          description: article.description || 'No description available',
          url: article.url,
          source: article.source.name || 'Unknown Source',
          publishedAt: article.publishedAt || new Date().toISOString(),
          urlToImage: article.urlToImage
        }));
        
        setNewsData({
          articles: formattedNews,
          loading: false,
          error: undefined
        });
      } else {
        // If no articles found, fall back to mock data
        const mockNewsData = generateMockNews(city);
        setNewsData({
          articles: mockNewsData,
          loading: false,
          error: undefined
        });
      }
    } catch (error) {
      console.error('Error fetching news data:', error);
      // Fall back to mock data on error
      const mockNewsData = generateMockNews(city);
      setNewsData({
        articles: mockNewsData,
        loading: false,
        error: undefined
      });
    }
  };
  
  // Function to generate mock news data as a fallback
  const generateMockNews = (city) => {
    const topics = ['weather', 'local', 'business', 'sports', 'culture'];
    
    return topics.map((topic, index) => ({
      title: `${city} ${topic.charAt(0).toUpperCase() + topic.slice(1)}: Latest Updates`,
      description: `The latest ${topic} news and updates from ${city} and surrounding areas. Stay informed about local ${topic} developments.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`${city} ${topic} news`)}`,
      source: `${city} ${topic.charAt(0).toUpperCase() + topic.slice(1)} News`,
      publishedAt: new Date().toISOString()
    }));
  };

  const handleApiError = (error) => {
    // Check if it's an API key issue
    if (error.message.includes('401')) {
      setApiKeyValid(false);
      setWeatherData({
        temperature: undefined,
        humidity: undefined,
        description: undefined,
        city: undefined,
        country: undefined,
        error: 'Invalid API key. Please check your OpenWeatherMap API key.',
        icon: undefined,
        feels_like: undefined,
        wind_speed: undefined
      });
    } else if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
      // Network error
      setWeatherData({
        temperature: undefined,
        humidity: undefined,
        description: undefined,
        city: undefined,
        country: undefined,
        error: 'Network error. Please check your internet connection and try again.',
        icon: undefined,
        feels_like: undefined,
        wind_speed: undefined
      });
    } else {
      setWeatherData({
        temperature: undefined,
        humidity: undefined,
        description: undefined,
        city: undefined,
        country: undefined,
        error: `Error: ${error.message || 'An error occurred while fetching weather data. Please try again.'}`,
        icon: undefined,
        feels_like: undefined,
        wind_speed: undefined
      });
    }
  };

  return (
    <div>
      <div className="wrapper">
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode} 
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        
        <div className="main">
          <div className="app-header">
            <div className="app-title">
              <h1>Weather Finder</h1>
              <p>Get real-time weather information for any location</p>
            </div>
            
            <div className="search-container">
              <Form getWeather={getWeather} />
              
              <button 
                className="btn btn-secondary location-btn"
                onClick={() => getCurrentLocationWeather()}
                disabled={loading}
              >
                <FaLocationArrow className="me-2" /> Use My Current Location
              </button>
            </div>
          </div>
          
          {!apiKeyValid && (
            <div className="alert alert-danger mx-3 mt-3" role="alert">
              <strong>API Key Error:</strong> The OpenWeatherMap API key appears to be invalid. 
              <p className="mt-2">To fix this issue:</p>
              <ol>
                <li>Sign up for a free API key at <a href="https://home.openweathermap.org/users/sign_up" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></li>
                <li>After signing up, get your API key from your account page</li>
                <li>Replace the API_KEY constant in the App.js file with your new key</li>
              </ol>
            </div>
          )}
          
          {!geoLocationAvailable && (
            <div className="alert alert-warning mx-3 mt-3" role="alert">
              <strong>Location Access:</strong> We couldn't access your location. 
              Please enable location services in your browser or search manually.
            </div>
          )}
          
          <div className="content-container">
            <div className="weather-container">
              {loading ? (
                <div className="loader">
                  <div className="loader-spinner"></div>
                  <p className="mt-3 text-center">Loading weather data...</p>
                </div>
              ) : (
                <Weather
                  temperature={weatherData.temperature}
                  humidity={weatherData.humidity}
                  city={weatherData.city}
                  country={weatherData.country}
                  description={weatherData.description}
                  error={weatherData.error}
                  icon={weatherData.icon}
                  feels_like={weatherData.feels_like}
                  wind_speed={weatherData.wind_speed}
                  loading={loading}
                />
              )}
            </div>
            
            {weatherData.city && (
              <div className="news-container">
                <LocalNews
                  newsData={newsData.articles}
                  city={weatherData.city}
                  loading={newsData.loading}
                  error={newsData.error}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

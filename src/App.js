import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = (latitude, longitude) => {
    const apiKey = 'NNQBR2KFTKWGHWDTYXWJQNJ66'; // Replace with your Visual Crossing API key
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=${apiKey}&unitGroup=metric`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setWeatherData(data))
      .catch(error => console.error('Error fetching weather data:', error));
  };

  useEffect(() => {
    const getWeatherByLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeatherData(latitude, longitude);
          },
          error => {
            console.error('Error getting location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getWeatherByLocation();
  }, []); // Empty dependency array ensures this effect runs once on mount

  const renderCurrentConditions = () => {
    if (!weatherData || !weatherData.currentConditions) {
      return null;
    }

    const currentConditions = weatherData.currentConditions;
    const temperatureClass = getTemperatureClass(currentConditions.temp);

    return (
      <div className={`weather-container ${temperatureClass}`}>
        <h2>Current Conditions</h2>
        <p>Temperature: {currentConditions.temp}°C</p>
        <p>Humidity: {currentConditions.humidity}%</p>
        <p>Conditions: {currentConditions.conditions}</p>
        {/* Add more information as needed */}
      </div>
    );
  };

  const getTemperatureClass = (temperature) => {
    if (temperature < 15) {
      return 'cold';
    } else if (temperature >= 15 && temperature < 25) {
      return 'mild';
    } else {
      return 'hot';
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Weather App</h1>
      </div>
      {weatherData && renderCurrentConditions()}
    </div>
  );
}

export default App;

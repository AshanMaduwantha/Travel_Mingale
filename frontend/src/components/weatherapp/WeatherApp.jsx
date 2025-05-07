import React, { useState, useEffect } from 'react';
import {
  Search,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Cloud,
  Sun,
  Loader2,
  CloudLightning,
  Snowflake,
  Eye
} from 'lucide-react';

const API_KEY = '27981ac19354bda01216eb6a960337e8'; // OpenWeatherMap API key

const fetchWeather = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error('City not found');

    const currentWeather = await response.json();

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!forecastResponse.ok) throw new Error('Forecast data not available');

    const forecastData = await forecastResponse.json();

    const weatherData = {
      city: currentWeather.name,
      country: currentWeather.sys.country,
      temperature: Math.round(currentWeather.main.temp),
      condition: currentWeather.weather[0].main,
      description: currentWeather.weather[0].description,
      humidity: currentWeather.main.humidity,
      windSpeed: Math.round(currentWeather.wind.speed * 3.6), // m/s to km/h
      pressure: currentWeather.main.pressure, // Atmospheric pressure in hPa
      visibility: currentWeather.visibility / 1000, // Visibility in km
      feelsLike: Math.round(currentWeather.main.feels_like),
      forecast: processForecastData(forecastData.list)
    };

    return weatherData;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch weather data');
  }
};

const processForecastData = (forecastList) => {
  const dailyForecasts = {};

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });

    if (date.getDate() === new Date().getDate()) return;

    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        temps: [],
        conditions: []
      };
    }

    dailyForecasts[day].temps.push(item.main.temp);
    dailyForecasts[day].conditions.push(item.weather[0].main);
  });

  return Object.keys(dailyForecasts)
    .slice(0, 3)
    .map((day) => {
      const temps = dailyForecasts[day].temps;
      const conditions = dailyForecasts[day].conditions;

      const conditionCounts = {};
      let maxCount = 0;
      let mostCommonCondition = '';

      conditions.forEach((condition) => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
        if (conditionCounts[condition] > maxCount) {
          maxCount = conditionCounts[condition];
          mostCommonCondition = condition;
        }
      });

      return {
        day,
        temp: Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length),
        condition: mostCommonCondition
      };
    });
};

const WeatherApp = ({ initialCity = '' }) => {
  const [city, setCity] = useState(initialCity);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCity) {
      fetchWeatherData(initialCity);
    }
  }, [initialCity]);

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchWeather(cityName);
      setWeatherData(data);
    } catch (err) {
      console.error('Weather API error:', err);
      setError(`Could not find weather for "${cityName}". Please check the city name and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return <CloudRain className="text-blue-600" size={28} />;
      case 'clouds':
        return <Cloud className="text-gray-600" size={28} />;
      case 'clear':
        return <Sun className="text-yellow-400" size={28} />;
      case 'thunderstorm':
        return <CloudLightning className="text-purple-600" size={28} />;
      case 'snow':
        return <Snowflake className="text-blue-300" size={28} />;
      case 'wind':
        return <Wind className="text-gray-600" size={28} />;
      default:
        return <Thermometer className="text-red-500" size={28} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-md overflow-hidden p-6">

      {/* Search Form */}
      <div className="flex mb-4 gap-3">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="flex-grow p-3 text-sm rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* Error */}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-sm">{error}</div>}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="animate-spin text-blue-500" size={36} />
        </div>
      )}

      {/* Weather Display */}
      {weatherData && !loading && (
        <div className="bg-white rounded-lg overflow-hidden shadow grid grid-cols-3 gap-4">

          {/* Left: Current Weather */}
          <div className="p-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white flex flex-col justify-between">
            <div className="flex items-center mb-4">
              <div className="mr-3">{getWeatherIcon(weatherData.condition)}</div>
              <div>
                <h3 className="font-semibold text-lg">
                  {weatherData.city}, {weatherData.country}
                </h3>
                <p className="text-sm capitalize">{weatherData.description}</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-center">{weatherData.temperature}°C</div>
          </div>

          {/* Middle: Details */}
          <div className="p-4 border-l border-r">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Details</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Droplets size={18} className="text-blue-600" />
                <span className="text-sm">Humidity: {weatherData.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind size={18} className="text-blue-600" />
                <span className="text-sm">Wind: {weatherData.windSpeed} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer size={18} className="text-red-500" />
                <span className="text-sm">Feels Like: {weatherData.feelsLike}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-gray-600" />
                <span className="text-sm">Visibility: {weatherData.visibility} km</span>
              </div>
            </div>
          </div>

          {/* Right: Forecast */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">3-Day Forecast</h4>
            <div className="flex flex-col gap-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium w-1/3">{day.day}</div>
                  <div className="w-1/3 flex justify-center">{getWeatherIcon(day.condition)}</div>
                  <div className="text-sm w-1/3 text-right">{day.temp}°C</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder */}
      {!weatherData && !loading && !error && (
        <div className="bg-white bg-opacity-80 rounded-lg p-6 text-center">
          <p className="text-gray-600">Enter a city name to get the weather forecast</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;

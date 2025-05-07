// weatherService.js - API integration example
const API_KEY = '27981ac19354bda01216eb6a960337e8'; // Replace with your actual API key

export const fetchWeather = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('City not found');
    }
    
    const currentWeather = await response.json();
    
    // Get 5-day forecast (separate API call)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error('Forecast data not available');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Process and format the data
    const weatherData = {
      city: currentWeather.name,
      temperature: Math.round(currentWeather.main.temp),
      condition: currentWeather.weather[0].main,
      humidity: currentWeather.main.humidity,
      windSpeed: Math.round(currentWeather.wind.speed * 3.6), // Convert m/s to km/h
      forecast: processForecastData(forecastData.list)
    };
    
    return weatherData;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch weather data');
  }
};

// Helper function to process forecast data
function processForecastData(forecastList) {
  // Group forecasts by day
  const dailyForecasts = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Skip today
    if (date.getDate() === new Date().getDate()) {
      return;
    }
    
    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        temps: [],
        conditions: []
      };
    }
    
    dailyForecasts[day].temps.push(item.main.temp);
    dailyForecasts[day].conditions.push(item.weather[0].main);
  });
  
  // Process each day's data
  return Object.keys(dailyForecasts).slice(0, 3).map(day => {
    const temps = dailyForecasts[day].temps;
    const conditions = dailyForecasts[day].conditions;
    
    // Find the most common condition
    const conditionCounts = {};
    let maxCount = 0;
    let mostCommonCondition = '';
    
    conditions.forEach(condition => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      if (conditionCounts[condition] > maxCount) {
        maxCount = conditionCounts[condition];
        mostCommonCondition = condition;
      }
    });
    
    return {
      day: day,
      temp: Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length),
      condition: mostCommonCondition
    };
  });
}
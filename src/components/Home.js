import React, { useState } from "react";
import latinize from "latinize"; // Kutubxonani import qilamiz

const Home = () => {
  const [city, setCity] = useState(""); // Qidirilayotgan shahar nomi
  const [weatherData, setWeatherData] = useState(null); // Ob-havo ma'lumotlari
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (selectedCity) => {
    const apiKey = "6XEZHUVFWSCHRDSYJGZ2TXYX4"; // Sizning API kalitingiz

    // Lotin tilidagi shahar nomini transliteratsiya qilamiz
    const formattedCity = latinize(selectedCity).toLowerCase();

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${formattedCity}?unitGroup=metric&key=${apiKey}&contentType=json&days=7`;

    try {
      setLoading(true);
      setError(null); // Xatolikni tozalash
      setWeatherData(null); // Avvalgi ma'lumotlarni tozalash

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("API'dan ma'lumot olib bo'lmadi. Shahar nomini tekshiring!");
      }

      const data = await response.json();
      if (data.days) {
        setWeatherData(data.days); // 7 kunlik prognoz ma'lumotlarini saqlash
      } else {
        throw new Error("Ma'lumotlar topilmadi!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeather(city); // Qidirilgan shahar uchun ob-havo ma'lumotlarini olish
    } else {
      setError("Shahar nomini kiriting!");
    }
  };

  return (
    <div className="container">
      <h1 className="title">7 Kunlik Ob-havo Ma'lumotlari</h1>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Shahar nomini kiriting"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input-field"
        />
        <button
          onClick={handleSearch}
          className="search-button"
        >
          Qidirish
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="loading">⏳ Ma'lumotlar yuklanmoqda...</p>}

      {/* Error */}
      {error && <p className="error">{`❌ ${error}`}</p>}

      {/* 7 Kunlik Weather Information */}
      {weatherData && (
        <div className="weather-grid">
          {weatherData.map((day, index) => (
            <div key={index} className="weather-card">
              <h2 className="weather-date">{new Date(day.datetime).toLocaleDateString()}</h2>
              <p className="weather-temp">🌡 Harorat: {day.temp}°C</p>
              <p className="weather-wind">💨 Shamol: {day.windspeed} km/h</p>
              <p className="weather-humidity">💧 Namlik: {day.humidity}%</p>
              <p className="weather-condition">🌥 Holat: {day.conditions}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

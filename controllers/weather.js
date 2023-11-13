const axios = require("axios");
require('dotenv').config();

exports.getWeather = async (req, res) => {
  try {
    const location = req.params.location;
    const weatherKey = process.env.WEATHER_KEY
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${weatherKey}=${location}&aqi=no`
    );

    const { location: weatherLocation, current } = response.data;
    const { name, region } = weatherLocation;
    const { temp_c, feelslike_c, condition, wind_kph } = current;
    
    const customWeatherData = {
      location: {
        name,
        region,
      },
      current: {
        temp_c,
        feelslike_c,
        condition,
        wind_kph
      },
    };

    res.json(customWeatherData);
  } catch (error) {
    console.error("Weather API request error", error.message);
    res.status(500).send("Internal server error");
  }
};


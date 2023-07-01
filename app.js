const asyncRequest = require("async-request");

const getWeather = async (location) => {
  const token = "20d207ae1281f443c23f0a602608254c";
  const url = `http://api.weatherstack.com/current?access_key=${token}&query=${location}`;
  try {
    const res = await asyncRequest(url);
    const data = JSON.parse(res.body);
    const weather = {
      isSearch: true,
      region: data.location.region,
      country: data.location.country,
      temperature: data.current.temperature,
      wind_speed: data.current.wind_speed,
      precip: data.current.precip,
      cloudcover: data.current.cloudcover,
    };
    return weather;
  } catch (error) {
    return {
      isSearch: true,
      error,
    };
  }
};

// getWeather("tokyo")

const express = require("express");
const app = express();
const path = require("path");

const pathPublic = path.join(__dirname, "./public");
app.use(express.static(pathPublic));
app.set("view engine", "hbs");
console.log(pathPublic);

app.get("/", async (req, res) => {
  const { address } = req.query;
  if (address) {
    const {
      success,
      temperature,
      wind_speed,
      precip,
      cloudcover,
      country,
      region,
    } = await getWeather(address);
    res.render("weather", {
      isSearch: true,
      success,
      temperature: temperature,
      wind_speed,
      precip,
      cloudcover,
      country,
      region,
    });
  } else {
    res.render("weather", {
      isSearch: false,
    });
  }
});

const port = 7000;
app.listen(port, () => {
  console.log(`app run on port ${port}`);
});

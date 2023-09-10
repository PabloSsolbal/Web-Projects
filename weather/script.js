/**
 * ? This code is a weather app that allows users to search for weather information of a specific city.
 * * Users can enter the city name in the search input and click the "Search" button to fetch the weather data from the OpenWeatherMap API.
 * * The API key for the OpenWeatherMap API is retrieved from a global variable called "window.key".
 * * If the search is successful, the app displays the weather information for the city, including temperature, weather description, humidity, and wind speed, along with corresponding weather icons.
 * * If the city is not found or there is an error with the API request, it displays a "Not Found" message.
 * TODO: Implement a feature to toggle between Celsius and Fahrenheit temperature units.
 * TODO: Improve the user interface with more detailed weather information and additional weather icons.
 * TODO: Add error handling for cases where the API request fails or the weather data is incomplete.
 * TODO: Add caching mechanism to store weather data for previously searched cities and avoid redundant API requests.
 */

// ? elements for the app
const search = document.querySelector(".location-search");
const searchBtn = document.querySelector(".search-btn");

// ? API key for the API
APIKey = window.key;

// ? variables for the weather data
/**
 * * location
 * * temperature
 * * weather description
 * * humidity
 * * wind speed
 */
let city = null;
let temperature = null;
let weatherDescp = null;
let humidity = null;
let windSpeed = null;

// ? weather function
/**
 * @description - Gets the weather for the specified city
 * * Gets the city from the search input
 * * Makes a request to the OpenWeatherMap API
 * * Check if the response is successful
 * * Formats the response data
 * * Updates the weather display
 */

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  city = search.value;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("location not found");
        } else {
          throw new Error("error");
        }
      }
      return response.json();
    })
    .then((data) => {
      const weather = data.weather[0].main;
      temperature = data.main.temp;
      weatherDescp = data.weather[0].description;
      humidity = data.main.humidity;
      windSpeed = data.wind.speed;

      updateWeather(weather);
    })

    .catch((error) => {
      updateWeather(404);
      console.log(error);
    });
});

// ? function updateWeather
/**
 * @description - Updates the weather display
 * * Gets the weather data from the OpenWeatherMap API
 * * Check if the weather is 404
 * * Get the image for the weather
 * * Updates the weather container and weather details container with the weather data
 */
const updateWeather = (weather) => {
  let img;

  const weatherBox = document.querySelector(".weather-container");
  const notFoundContainer = document.querySelector(".not-found-container");
  const weatherDetails = document.querySelector(".weather-dtls");

  if (weather == 404) {
    weatherBox.style.display = "none";
    notFoundContainer.style.display = "flex";

    weatherDetails.innerHTML = `<div class="humidity">
    <i class="fa-solid fa-water dtls-icon"></i>
    <div class="text">
        <span>-</span>
        <p>Humidity</p>
    </div>
</div>

<div class="wind">
    <i class="fa-solid fa-wind dtls-icon"></i>
    <div class="text">
        <span>-</span>
        <p>Wind Speed</p>
    </div>`;
  } else {
    notFoundContainer.style.display = "none";
    weatherBox.style.display = "flex";

    switch (weather) {
      case "Clear":
        img = "images/sun.png";
        break;
      case "Rain":
        img = "images/rain.png";
        break;
      case "Clouds":
        img = `images/clouds.png`;
        break;
      case "Haze":
        img = `images/haze.png`;
        break;
      case "Snow":
        img = "images/snowy.png";
        break;
    }
    weatherBox.innerHTML = `<img src="${img}" alt="">
    <p class="temperature">${temperature}°C</p>
    <p class="w-description">${weatherDescp}</p>`;
    weatherDetails.innerHTML = `<div class="humidity">
    <i class="fa-solid fa-water dtls-icon"></i>
    <div class="text">
        <span>${humidity}%</span>
        <p>Humidity</p>
    </div>
</div>

<div class="wind">
    <i class="fa-solid fa-wind dtls-icon"></i>
    <div class="text">
        <span>${windSpeed} m/s</span>
        <p>Wind Speed</p>
    </div>`;
  }
};

// ? cleant he search input when the user wants to search for a new city
search.addEventListener("focus", () => {
  search.value = "";
});

// ! Geolocalitation functions
// ? variables for the geolocation -latitude and longitude-
let lat = null;
let lon = null;

// ? Function to get the user's location coords
/**
 * * Create a success callback function.
 * * Get the latitude and longitude of the user's location.
 * * Call the byCoords function with the latitude and longitude.
 *
 * * Create an error callback function.
 * * Update the weather with the error code 404.
 *
 * * Get the user's location.
 */
const getLocation = () => {
  const success = (position) => {
    let positionCoord = position.coords;
    lat = positionCoord.latitude;
    lon = positionCoord.longitude;

    byCoords(lat, lon);
  };
  const error = (err) => {
    console.log(err);
    updateWeather(404);
  };
  navigator.geolocation.getCurrentPosition(success, error);
};

// ? Function to get the weather by coordinates
/**
 *
 * @param latitude - latitude of the user's location
 * @param longitude - longitude of the user's location
 *
 * * Make a request to the OpenWeatherMap API with the coordinates.
 * * Get the weather data from the response.
 * * Await the weather data.
 * * Set the search input value to the city name.
 * * Get the weather information from the data.
 * * Update the weather display.
 */
const byCoords = (lat, lon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      search.value = data.name;
      const weather = data.weather[0].main;
      temperature = data.main.temp;
      weatherDescp = data.weather[0].description;
      humidity = data.main.humidity;
      windSpeed = data.wind.speed;

      updateWeather(weather);
    });
};

// ? Start the app with the user's location by default
getLocation();

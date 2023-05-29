//este codigo realiza una llamada a la API de openweathermap para crear un widget del clima
//construimos los dos elementos principales para desencadenar los eventos del widget; el boton de buscar y el input para ingresar la localizacion
const search = document.querySelector(".location-search");
const searchBtn = document.querySelector(".search-btn");
//creamos nuestras variables que se usaran como parametros al llamar a la API de openweathermap
//asiganmos la API key para autenticar la solicitud
APIKey = "55f91e3d4de8d2cbed6ea17e435045e4";
let city = null;
//creamos las variables para guardar la informacion relevante de la API; la temperatura, la descripcion del clima, el porcentaje de humedad y la velocidad del tiempo
let temperature = null;
let weatherDescp = null;
let humidity = null;
let windSpeed = null;

//agregamos una escucha para el boton de buscar que hara la llamada a la API al hacer click
searchBtn.addEventListener("click", (e) => {
  //evitamos que el evento predeterminado se ejecute
  e.preventDefault();
  //obtenemos la ciudad que el usuario ingreso para buscar el clima
  city = search.value;
  //llamamos a la API con los parametros solicitados (APIKey & city) los datos se obtienen en formato JSON
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    //tomamos la respuesta de la API
    .then((response) => {
      if (!response.ok) {
        //verificamos si el codigo de la respuesta es 404 para lanzar un error
        if (response.status === 404) {
          throw new Error("location not found");
        } else {
          //si la respuesta no es exitosa pero no es un error 404 lanzamos un error generico
          throw new Error("error");
        }
      }
      //si la respuesta es exitosa extraemos los datos JSON y devolvemos una promesa
      return response.json();
    })
    .then((data) => {
      //procesamos los datos JSON y extraemos los valores que necesitamos, luego los asignamos a las variables correspondientes
      // tambien creamos la variable clima
      const weather = data.weather[0].main;
      temperature = data.main.temp;
      weatherDescp = data.weather[0].description;
      humidity = data.main.humidity;
      windSpeed = data.wind.speed;
      //luego llamamos a la funcion para actualizar el widget y le pasamos el clima como parametro
      updateWeather(weather);
    })
    //capturamos cualquier error que pase durante la solicitud
    .catch((error) => {
      //llamamos a la funcion updateWeather y le pasamos 404 para que muestre un mensaje de ubicacion no encontrada
      updateWeather(404);
      //tambien registramos el error en consola
      console.log(error);
    });
});

//funcion para actualizar el clima en el widget segun la ubicacion ingresada por el usuario que recibe el clima como parametro
const updateWeather = (weather) => {
  //creamos la variable para la imagen del widget
  let img;
  //creamos los elementos contenedores del widget, el contenedor del clima, el de error 404, y el de los detalles
  const weatherBox = document.querySelector(".weather-container");
  const notFoundContainer = document.querySelector(".not-found-container");
  const weatherDetails = document.querySelector(".weather-dtls");
  //segun el valor de weather manipulamos el widget
  if (weather == 404) {
    //si el valor es 404 construimos el mensaje de error
    //primero ocultamos el contenedor del clima
    weatherBox.style.display = "none";
    //luego mostramos el contenedor de error
    notFoundContainer.style.display = "flex";
    //cambiamos el contenedor de detalles
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
    //si el valor es un clima y no un error construimos un 'clima'
    //primero ocultamos el contenedor de error si hubiera uno
    notFoundContainer.style.display = "none";
    //luego mostramos el contenedor del clima
    weatherBox.style.display = "flex";
    //luego hacemos switch el valor del clima para cambiar la imagen segun el tipo de clima que nos devuelva la API
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
    //pasamos el valor de img y construimos el contenedor con los valores que guardamos de la API
    weatherBox.innerHTML = `<img src="${img}" alt="">
    <p class="temperature">${temperature}°C</p>
    <p class="w-description">${weatherDescp}</p>`;
    //tambien cambiamos los valores del contenedor de detalles con los datos guardados
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

//por ultimo creamos una escucha para el input search para que se limpie cuando se vuelve a hacer focus para que el usuario pueda solamente escribrir de nuevo sin tener que borrar manualmente
search.addEventListener("focus", () => {
  search.value = "";
});

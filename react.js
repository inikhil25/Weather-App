const apiKey = "c52b690d9e02e153e1f091d337b70df2"; // Replace with your OpenWeatherMap API key
let map; // Global map variable

// Function to fetch current weather
function getWeather() {
    let city = document.getElementById("city").value;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let weatherInfo = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
            document.getElementById("weatherResult").innerHTML = weatherInfo;
        })
        .catch(() => {
            document.getElementById("weatherResult").innerHTML = "<p>City not found!</p>";
        });
}

// Function to fetch 5-day forecast
function getForecast() {
    let city = document.getElementById("forecastCity").value;
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let forecastHTML = "<h2>5-Day Forecast</h2>";
            data.list.forEach((forecast, index) => {
                if (index % 8 === 0) {
                    forecastHTML += `
                        <p>${forecast.dt_txt}: ${forecast.main.temp}°C, ${forecast.weather[0].description}</p>
                    `;
                }
            });
            document.getElementById("forecastResult").innerHTML = forecastHTML;
        });
}

// Function to load the map
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("map")) {
        // Remove existing map instance if already initialized
        if (map !== undefined) {
            map.remove();
        }

        // Initialize Leaflet Map
        map = L.map("map").setView([20, 78], 4);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        // Weather Layers from OpenWeatherMap
        let cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${apiKey}`);
        let tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${apiKey}`);
        let windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid=${apiKey}`);

        // Layer Control
        let weatherLayers = {
            "Clouds": cloudsLayer,
            "Temperature": tempLayer,
            "Wind Speed": windLayer
        };
        L.control.layers(weatherLayers).addTo(map);

        // Default Weather Layer
        tempLayer.addTo(map);

        // Click event to get weather info
        map.on("click", function (e) {
            let lat = e.latlng.lat;
            let lon = e.latlng.lng;
            getWeatherByCoords(lat, lon);
        });
    }
});

// Function to get weather by coordinates (on map click)
function getWeatherByCoords(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let weatherInfo = `
                <h2>Weather at (${lat.toFixed(2)}, ${lon.toFixed(2)})</h2>
                <p><strong>Location:</strong> ${data.name || "Unknown"}</p>
                <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            `;

            // Show weather info in the bottom div
            document.getElementById("mapWeather").innerHTML = weatherInfo;
        })
        .catch(() => {
            document.getElementById("mapWeather").innerHTML = "<p>Weather data not available!</p>";
        });
}

const apiKey = '2b4f361c00d470023eb54d2498b1b90d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';

function searchCity(city) {
    let url = `${apiUrl}${city}&units=metric&appid=${apiKey}`;
    
    axios.get(url)
        .then(response => {
            displayWeather(response.data);
            displayForecast(city); // Added call to display the forecast
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            alert("City not found. Please try again.");
        });
}

function displayWeather(data) {
    const city = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;

    document.getElementById('city').innerHTML = city;
    document.getElementById('temperature').innerHTML = `${temperature}°C`;
    document.getElementById('condition').innerHTML = `Humidity: ${humidity}%, Wind: ${windSpeed} km/h`;
    document.getElementById('day').innerHTML = `${description}`;
    
    // Set the weather icon (not used here as the icon is in the temperature span)
    // document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${icon}.png`;
}

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let city = document.getElementById('search').value;
    searchCity(city);
});

const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';

function displayForecast(city) {
    let url = `${forecastApiUrl}${city}&units=metric&appid=${apiKey}`;
    
    axios.get(url)
        .then(response => {
            let forecastElement = document.querySelector("#forecast");
            let forecastHtml = "";
            
            response.data.list.slice(0, 5).forEach(function (day) {
                let dayName = new Date(day.dt * 1000).toLocaleString('en-US', { weekday: 'short' });
                let icon = day.weather[0].icon;
                let maxTemp = Math.round(day.main.temp_max);
                let minTemp = Math.round(day.main.temp_min);
                
                forecastHtml += `
                    <div class="forecast">
                        <div class="weather-forecast-day">${dayName}</div>
                        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="" class="weather-forecast-icon">
                        <div class="weather-forecast-temperatures">
                            <strong>${maxTemp}°</strong> <span>${minTemp}°</span>
                        </div>
                    </div>
                `;
            });
            
            forecastElement.innerHTML = forecastHtml;
        })
        .catch(error => {
            console.error('Error fetching forecast: ', error);
        });
}

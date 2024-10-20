const apiKey = '2b4f361c00d470023eb54d2498b1b90d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';

function searchCity(city) {
    let url = `${apiUrl}${city}&units=metric&appid=${apiKey}`;
    
    axios.get(url)
        .then(response => {
            displayWeather(response.data);
            displayForecast(city); 
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
    document.getElementById('temperature').innerHTML = `<span class="emoji">${getWeatherEmoji(icon)}</span>${temperature}°C`;
    document.getElementById('condition').innerHTML = `Humidity: ${humidity}%, Wind: ${windSpeed} km/h`;
    document.getElementById('day').innerHTML = `${new Date().toLocaleString('en-US', { weekday: 'long' })}, ${description}`;
}

function getWeatherEmoji(icon) {
    const weatherEmojis = {
        '01d': '☀️', '01n': '🌙', '02d': '🌤️', '02n': '🌑',
        '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
        '11d': '🌩️', '11n': '🌩️', '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return weatherEmojis[icon] || '🌥️';
}

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let city = document.getElementById('search').value;
    searchCity(city);
});

function displayForecast(city) {
    let url = `${forecastApiUrl}${city}&units=metric&appid=${apiKey}`;
    
    axios.get(url)
        .then(response => {
            let forecastElement = document.querySelector("#forecast");
            let forecastHtml = "";
            let forecastData = {};

            // Organize forecast data by day
            response.data.list.forEach(function (entry) {
                let date = new Date(entry.dt * 1000);
                let day = date.toLocaleString('en-US', { weekday: 'short' });
                
                if (!forecastData[day]) {
                    forecastData[day] = { maxTemp: -Infinity, minTemp: Infinity, icon: entry.weather[0].icon };
                }

                let tempMax = Math.round(entry.main.temp_max);
                let tempMin = Math.round(entry.main.temp_min);
                
                // Update max and min temperatures for the day
                if (tempMax > forecastData[day].maxTemp) {
                    forecastData[day].maxTemp = tempMax;
                }
                if (tempMin < forecastData[day].minTemp) {
                    forecastData[day].minTemp = tempMin;
                }
            });

            // Generate the forecast HTML
            for (let day in forecastData) {
                forecastHtml += `
                    <div class="forecast">
                        <span class="emoji">${getWeatherEmoji(forecastData[day].icon)}</span>${day}
                        <span>${forecastData[day].maxTemp}°</span>
                        <span>${forecastData[day].minTemp}°</span>
                    </div>
                `;
            }

            forecastElement.innerHTML = forecastHtml;
        })
        .catch(error => {
            console.error('Error fetching forecast: ', error);
        });
}

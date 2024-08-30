document.querySelector('.searchButton').addEventListener('click', function() {
    const location = document.getElementById('location').value.trim();
    const apiKey = 'd827a09fee59464d962174638242808';
    
    if (!location) {
        alert('Please enter a valid city name');
        return;
    }

    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`;

    // Show loading indicator
    document.getElementById('loading-indicator').style.display = 'block';
    const weatherDashboard = document.querySelector('.weather-dashboard');

    // hide the dashboard before fetching new data
    weatherDashboard.classList.remove('show');
    weatherDashboard.style.display = 'none';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update the current weather
            document.getElementById('cityname-label').innerText = data.location.name;
            document.getElementById('temperature-label').innerText = `${data.current.temp_c}°C`;
            document.querySelector('.humidity-label').innerText = `Humidity: ${data.current.humidity}%`;
            document.querySelector('.wind').innerText = `Wind speed: ${data.current.wind_kph} km/h`;
            document.querySelector('.weather-label').innerText = data.current.condition.text;
            document.querySelector('.current-weather img').src = data.current.condition.icon;

            // Change the background gradient based on current weather 
            changeBackgroundGradient(data.current.condition.text);

            // Update 7-day weather forecast
            const forecastDays = data.forecast.forecastday;

            forecastDays.forEach((day, index) => {
                if (index < 7) {
                    const dayContainer = document.querySelectorAll('.day')[index];
                    dayContainer.querySelector('.dayname').innerText = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
                    dayContainer.querySelector('.temperatureday').innerText = `${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C`;
                    dayContainer.querySelector('.description').innerText = day.day.condition.text;
                    dayContainer.querySelector('.humidity').innerText = `Humidity: ${day.day.avghumidity}%`;
                    dayContainer.querySelector('.wind').innerText = `Wind speed: ${day.day.maxwind_kph} km/h`;
                    dayContainer.querySelector('img').src = day.day.condition.icon;
                }
            });

            // Hide loading indicator
            document.getElementById('loading-indicator').style.display = 'none';

            // Show weather dashboard with smooth transition
            weatherDashboard.style.display = 'grid';
            setTimeout(() => {
                weatherDashboard.classList.add('show');
            }, 50); 
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            // Hide the loading indicator if an error occurs
            document.getElementById('loading-indicator').style.display = 'none';
        });
});

// Change the background gradient based on weather condition
function changeBackgroundGradient(weatherCondition) {
    const body = document.body;
    let gradient;

    switch (weatherCondition.toLowerCase()) {
        case 'sunny':
        case 'clear':
            gradient = 'linear-gradient(90deg, #ecb84f 0%, #f7f779 100%)'; 
            break;
        case 'partly cloudy':
        case 'cloudy':
        case 'overcast':
            gradient = 'linear-gradient(90deg, #757f9a 0%, #d7dde8 100%)'; 
            break;
        case 'rain':
        case 'light rain':
        case 'moderate rain':
            gradient = 'linear-gradient(90deg, #4b79a1 0%, #283e51 100%)'; 
            break;
        case 'snow':
        case 'light snow':
            gradient = 'linear-gradient(90deg, #e6dada 0%, #274046 100%)'; 
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(90deg, #232526 0%, #414345 100%)'; 
            break;
        default:
            gradient = 'linear-gradient(90deg, #3491c0 0%, #1c92d2 100%)'; 
      }

      body.style.background = gradient;  
}

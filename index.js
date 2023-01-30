// create button element
const getForecast = document.getElementById("get-forecast")
// create entry element
let zip = document.getElementById("location")
// create forecast list element
let forecast = document.getElementById("forecast-el")

// "listen" for button to be clicked
getForecast.addEventListener("click", function() {
    // console.log(coor.value)
    // let coorSplit = coor.value.split(",") 
    forecast.innerText = ""
    // call weather api given latitude and longitude
    let coorlink = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip.value},US&appid=` + GEOCODE_API_KEY
    fetch(coorlink)
        .then(res => res.json())
        // get location data from json
        .then(data => getLocation(data))
})

// get location based on coordinates from geocoding API
function getLocation(coor){
    console.log(coor, coor.lat, coor.lon)
    // display location name
    let name = document.createElement("li")
    name.innerText = coor.name + " Forecast:"
    forecast.appendChild(name)

    // create link to weather api
    let link = `https://api.weather.gov/points/${coor.lat},${coor.lon}`
    console.log(link)
    fetch(link)
        .then(res => res.json())
        // get data from json
        .then(data => locationForecast(data))
}

// get forecast from weather json
function locationForecast(location) {
    let url = location.properties.forecast
    console.log(url)
    fetch(url)
    .then(res => res.json())
    .then(data => renderForecast(data.properties))
}

// render forecast to html
function renderForecast(element) {
    for(let i = 0; i < 14; i++){
        let li = document.createElement("li")
        let forecastItem = `${element.periods[i].name}: ${element.periods[i].detailedForecast}`
        li.innerText = forecastItem
        forecast.appendChild(li)
    }
}

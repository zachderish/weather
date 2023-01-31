// create button element
const getForecast = document.getElementById("get-forecast")
// create entry element
let zip = document.getElementById("location")
// create forecast list element
let forecast = document.getElementById("forecast-name")

// get table element
let table = document.getElementById("table")

// "listen" for button to be clicked
getForecast.addEventListener("click", function() {
    // console.log(coor.value)
    // let coorSplit = coor.value.split(",") 
    table.innerText = ""
    // call weather api given latitude and longitude
    let coorlink = `https://api.openweathermap.org/geo/1.0/zip?zip=${zip.value},US&appid=f8bd836d48cae527758b009597acbc65`
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

// render forecast table to html
function renderForecast(element) {
    // create table header
    let row = table.insertRow(0)
    headers = ["Day", "High", "Low", "Precipitation"]

    // create header row
    for(let i = 0; i < headers.length; i++){
        let header = document.createElement("th")
        header.innerHTML = headers[i]
        row.appendChild(header)
    }

    // create table data
    // if only one period left in day
    if(element.periods[0].isDaytime == false){
        // 
        let row = table.insertRow(1)
        let td1 = row.insertCell(0)
        td1.innerHTML = element.periods[0].name
        let td2 = row.insertCell(1)
        td2.innerHTML = "--"
        let td3 = row.insertCell(2)
        td3.innerHTML = element.periods[0].temperature + "°F"
        let td4 = row.insertCell(3)
        td4.innerHTML = element.periods[0].shortForecast

        
        // get remaining period
        let rowCounter = 2
        for(let i = 2; i < 14; i=i+2){
            let row = table.insertRow(rowCounter)
            let td1 = row.insertCell(0)
            td1.innerHTML = element.periods[i-1].name
            let td2 = row.insertCell(1)
            td2.innerHTML = element.periods[i-1].temperature + "°F"
            let td3 = row.insertCell(2)
            td3.innerHTML = element.periods[i].temperature + "°F"
            rowCounter+=1
            let td4 = row.insertCell(3)
            td4.innerHTML = element.periods[i].shortForecast
        }

    }
    else{
        let rowCounter = 1
        for(let i = 0; i < 14; i=i+2){
            let row = table.insertRow(rowCounter)
            let td1 = row.insertCell(0)
            td1.innerHTML = element.periods[i].name
            let td2 = row.insertCell(1)
            td2.innerHTML = element.periods[i].temperature + "°F"
            let td3 = row.insertCell(2)
            td3.innerHTML = element.periods[i+1].temperature + "°F"
            rowCounter+=1
            let td4 = row.insertCell(3)
            td4.innerHTML = element.periods[i].shortForecast
        }
    }
}

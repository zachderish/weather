// create button element
const getForecast = document.getElementById("get-forecast");
// create entry element
let zipCode = document.getElementById("zipCode");
// create forecast list element
let cityName = document.getElementById("city-name");

// get table element
let table = document.getElementById("table")

// "listen" for button to be clicked
getForecast.addEventListener("click", function() {
    table.innerText = "";
    cityName.innerText = "";
    // call weather api given latitude and longitude
    let coorlink = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode.value},US&appid=f8bd836d48cae527758b009597acbc65`;
    fetch(coorlink)
        .then(res => res.json())
        // get location data from json
        .then(data => getLocation(data))
})

// Execute a function when the user presses a key on the keyboard
zipCode.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("get-forecast").click();
    }
  });


// get location based on coordinates from geocoding API
function getLocation(coor){
    console.log(coor, coor.lat, coor.lon)
    // display location name
    let name = document.createElement("li");
    name.innerText = coor.name + " Forecast:";
    cityName.appendChild(name);

    // create link to weather api
    let link = `https://api.weather.gov/points/${coor.lat},${coor.lon}`
    console.log(link)
    fetch(link)
        .then(res => res.json())
        // get data from json
        .then(data => locationForecast(data))
}

// get forecast from weather json
function locationForecast(cityName) {
    let url = cityName.properties.forecast;
    console.log(url);
    fetch(url)
    .then(res => res.json())
    .then(data => renderForecast(data.properties))
}

// render forecast table to html
function renderForecast(element) {
    // create table header
    let row = table.insertRow(0);
    headers = ["Day", "High", "Low", "Wind", "Precipitation", ""];

    // create header row
    for(let i = 0; i < headers.length; i++){
        let header = document.createElement("th");
        header.innerHTML = headers[i];
        row.appendChild(header);
    }

    // create table data
    // if only one period left in day (night)
    if(element.periods[0].isDaytime == false){
        // create first row for first period
        let row = table.insertRow(1);
        let td1 = row.insertCell(0);
        td1.innerHTML = element.periods[0].name;
        let td2 = row.insertCell(1);
        td2.innerHTML = "--";
        let td3 = row.insertCell(2);
        td3.innerHTML = element.periods[0].temperature + "°F";
        let td4 = row.insertCell(3);
        td4.innerHTML = element.periods[0].windSpeed + " " + element.periods[0].windDirection;
        let td5 = row.insertCell(4);
        td5.innerHTML = element.periods[0].shortForecast;
        let td6 = row.insertCell(5);
        let img = document.createElement("img");
        img.src = element.periods[0].icon;
        td6.appendChild(img);

        
        // get remaining periods, inserts every other period from 2-14
        let rowCounter = 2;
        for(let i = 2; i < 14; i=i+2){
            let row = table.insertRow(rowCounter);
            let td1 = row.insertCell(0);
            td1.innerHTML = element.periods[i-1].name;
            let td2 = row.insertCell(1);
            td2.innerHTML = element.periods[i-1].temperature + "°F";
            let td3 = row.insertCell(2);
            td3.innerHTML = element.periods[i].temperature + "°F";
            rowCounter+=1;
            let td4 = row.insertCell(3);
            td4.innerHTML = element.periods[i].windSpeed + " " + element.periods[i].windDirection;
            let td5 = row.insertCell(4);
            td5.innerHTML = element.periods[i].shortForecast;
            let td6 = row.insertCell(5);
            let img = document.createElement("img");
            img.src = element.periods[i].icon;
            td6.appendChild(img);
        }

    }
    else{
        // insert every other period 0-14
        let rowCounter = 1;
        for(let i = 0; i < 14; i=i+2){
            let row = table.insertRow(rowCounter);
            let td1 = row.insertCell(0);
            td1.innerHTML = `<b>${element.periods[i].name}</b>`;
            let td2 = row.insertCell(1);
            td2.innerHTML = element.periods[i].temperature + "°F";
            let td3 = row.insertCell(2);
            td3.innerHTML = element.periods[i+1].temperature + "°F";
            rowCounter+=1;
            let td4 = row.insertCell(3);
            td4.innerHTML = element.periods[i].windSpeed + " " + element.periods[i].windDirection;
            let td5 = row.insertCell(4);
            td5.innerHTML = element.periods[i].shortForecast;
            let td6 = row.insertCell(5);
            let img = document.createElement("img");
            img.src = element.periods[i].icon;
            td6.appendChild(img);
        }
    }
}

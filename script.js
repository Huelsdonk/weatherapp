let cities = [];
var theCity;
getStoredCities();

function showWeather() {
    $("#currentweather").empty();
    $(".card-deck").empty();
    $(".infobucket").removeAttr("id");
    
    if ($(this).attr("data-name") !== undefined){
        theCity = $(this).attr("data-name");
    } else {
        theCity = cities[cities.length - 1];
    }
    var apiKey = "&appid=8c3306b9fa9b361b4fc2acc41db11ddd"
    var dayIndex = 1;

    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${theCity}&units=imperial${apiKey}`;
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${theCity}&units=imperial${apiKey}`;

    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {
        var weatherHeader = $("<h5>");
        weatherHeader.addClass("card-title current-weather");
        weatherHeader.html(`<b>${response.name}:</b> ${moment().format('MMMM Do YYYY, h:mm:ss a')} <img src='http://openweathermap.org/img/w/${response.weather[0].icon}.png'>`);
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var tempP = $("<p>");
        var windP = $("<p>");
        var humidP = $("<p>");
        tempP.text("Temperature: " + response.main.temp + " °F")
        windP.text("Wind: " + response.wind.speed + " mph")
        humidP.text("Relative Humidity: " + response.main.humidity + " %")
        $("#currentweather").append(weatherHeader, tempP, windP, humidP);
        

        var uvUrl = `https://api.openweathermap.org/data/2.5/uvi?${apiKey}&lat=${latitude}&lon=${longitude}`;
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function (response2) {
            var theIndex = parseFloat(response2.value);
            var uvP = $("<p>");
            var uvBadge =$("<span>");
            uvBadge.attr('class','badge');
            uvBadge.text(theIndex)
            uvP.html("UV Index: ")
            // getting the badge color and icon to show up wound up being a bit fiddly...
            if (theIndex < 3){
                uvBadge.addClass("badge-success");
                
            } else if (theIndex > 3 && theIndex < 8) {
                uvBadge.addClass("badge-warning");
            } else {
                uvBadge.addClass("badge-danger");

            }  
            uvP.append(uvBadge);
            $("#currentweather").append(uvP);

            
        })
    })
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response3) {
        for (let i = 7; i < response3.list.length; i = i + 8) {
            
            var newCard = $("<div class='card'>");
            var newHeader = $("<div class='card-header'>");
            var newBody = $("<div class='card-body'>");
            var newTitle = $("<h5 class='card-title'>");
            var newTempP = $("<p>");
            var newHumP = $("<p>");
            newHeader.text(moment().add(dayIndex, 'days').format("dddd"));
            newTitle.html(`<img src='http://openweathermap.org/img/w/${response3.list[i].weather[0].icon}.png'>`);
            newTempP.text(`Temp: ${response3.list[i].main.temp} °F`)
            newHumP.text(`Humidity: ${response3.list[i].main.humidity} %`)
            newBody.append(newTitle, newTempP, newHumP);
            newCard.append(newHeader, newBody);
            $(".card-deck").append(newCard);
            dayIndex++;
        }
        
    })


}

function getStoredCities() {
    
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    if (storedCities !== null) {
      cities = storedCities;
    }
    addCities();
  }

function addCities() {
    $("#citybucket").empty();
    for (var i = 0; i < cities.length; i++) {
        var newA = $("<a>");
        newA.addClass("list-group-item list-group-item-action");
        newA.attr("data-name", cities[i]);
        newA.text(cities[i]);
        $(".list-group").append(newA);
        
    }
    storeCities();

}

function storeCities() {
    
    localStorage.setItem("cities", JSON.stringify(cities));
}

$("#city-input").on("submit", function (event) {
    event.preventDefault();
    

    var city = $("#add-city").val().trim();
    cities.push(city);
    addCities();
    showWeather();
});


$(document).on("click", ".list-group-item", showWeather);
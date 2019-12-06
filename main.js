$(document).ready(function(){
    $("button").on("click", getWeatherData);
})

function getWeatherData(){
    var zip = $(".zipcode").val();
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast",
        method: "GET",
        data: {
            APPID: "e41600df5a54dc35fc4a1b2fd4b91136",
            units: "imperial",
            zip: zip
        },
        success: makeFiveDayForecast
    })
}

function makeFiveDayForecast(response){
    var weatherData = response.list;
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    $(".city-name").text(response.city.name)

    var weatherByDay = {};
    var currentDay = new Date(weatherData[0].dt*1000).getDay();

    for(var i = 0; i < weatherData.length; i++){
        var dayNum = new Date(weatherData[i].dt*1000).getDay();
        if(!weatherByDay[dayNum]){
            var weatherIconUrl = getWeatherIconUrl(weatherData[i].weather[0].icon);
            weatherByDay[dayNum] = {
                tempList: [weatherData[i].main.temp],
                weatherIcon: `http://openweathermap.org/img/wn/${weatherIconUrl}@2x.png`
            }
        } else {
            weatherByDay[dayNum].tempList.push(weatherData[i].main.temp)
        }
    }

    $(".weather-container").empty()
    for(var dayIndex = 0; dayIndex < 5; dayIndex++){
        var avgDayTemp = `${parseInt(avgArray(weatherByDay[currentDay].tempList))}°F`
        makeWeatherItem(daysOfWeek[currentDay], weatherByDay[currentDay].weatherIcon, avgDayTemp);
        currentDay = moveToNextDay(currentDay);
    }
}

function getWeatherIconUrl(iconCode){
    return iconCode.slice(0, iconCode.length-1) + "d";
}

function moveToNextDay(dayNum){
    return (dayNum + 1) % 7;
}

function makeWeatherItem(day, image, temp){
    var weatherItem = $("<div>").addClass("day-weather");
    var dateElem = $("<p>").addClass("date").text(day);
    var weatherIcon = $("<img>").addClass("weather-icon").attr("src", image);
    var tempElem = $("<p>").addClass("temp").text(temp);
    weatherItem.append(dateElem, weatherIcon, tempElem);
    $(".weather-container").append(weatherItem)
}

function avgArray(arr){
    return arr.reduce((total,item) => total + item) / arr.length;
}

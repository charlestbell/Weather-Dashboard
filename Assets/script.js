//A variable that holds which city was searched last
//Giant Array of objects.
// Top level is city. With the right parameters, it willretern 5 days.
//One section that gets appended to store the UV
//Api that gets the weather (and the lat-long)
//Api that gets the UV index (using the lat long)
//

var cityName = "";
let queryUrlLatLong = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=abf76a69e67fc664083162f1310bc36e`;

let queryUrlForcast =
  "https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,minutely&appid=abf76a69e67fc664083162f1310bc36e";

function getWeather() {
  console.log(cityName);
  $.ajax({
    url: queryUrlLatLong,
    method: "GET",
  }).then(function (responseLatLong) {
    console.log(responseLatLong);
    $.ajax({
      url: queryUrlForcast,
      method: "GET",
    }).then(function (responseForcast) {
      let latitude = response.city.coord.lat;
      console.log(responseForcast);
      console.log(latitude);
    });
  });
}

$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  cityName = $("#cityInput").val();
  getWeather();
});

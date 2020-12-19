//A variable that holds which city was searched last
//Giant Array of objects.
// Top level is city. With the right parameters, it willretern 5 days.
//One section that gets appended to store the UV
//Api that gets the weather (and the lat-long)
//Api that gets the UV index (using the lat long)
//

var cityName;

// $.ajax({
//   url: queryUrlLatLong,
//   method: "GET",
// }).then(function (responseLatLong) {
//   console.log(responseLatLong);
//   $.ajax({
//     url: queryUrlForcast,
//     method: "GET",
//   }).then(function (responseForcast) {
//     let latitude = response.city.coord.lat;
//     console.log(responseForcast);
//     console.log(latitude);
//   });
// });

$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  if ($("#cityInput").val() !== "") {
    cityName = $("#cityInput").val();
    console.log(cityName);
    let queryUrlLatLong = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=abf76a69e67fc664083162f1310bc36e`;
    //Get Weather
    $.ajax({
      url: queryUrlLatLong,
      method: "GET",
    }).then(function (responseLatLong) {
      //Write City Name to screen
      $("#cityTitleMain").text(responseLatLong.city.name);
      //Use the returned lat and long to get 7 day weather
      console.log(responseLatLong);
      let latitude = responseLatLong.city.coord.lat;
      let longitude = responseLatLong.city.coord.lon;
      let queryUrlForcast = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=abf76a69e67fc664083162f1310bc36e`;
      let queryUrlUV = `http://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=abf76a69e67fc664083162f1310bc36e`;
      $.ajax({
        url: queryUrlForcast,
        method: "GET",
      }).then(function (responseForcast) {
        console.log(responseForcast);
        $("#TemperatureMain").text(responseForcast.current.temp);
        $("#HumidityMain").text(responseForcast.current.humidity);
        $("#WindSpeedMain").text(responseForcast.current.wind_speed);
      });
      $.ajax({
        url: queryUrlUV,
        method: "GET",
      }).then(function (responseUV) {
        console.log("responseUV");
        console.log(responseUV);

        $("#TemperatureMain").text(responseForcast.current.temp);
      });
    });
    //write the weathe to the screen
  }
});

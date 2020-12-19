//A variable that holds which city was searched last
//Giant Array of objects.
// Top level is city. With the right parameters, it willretern 5 days.
//One section that gets appended to store the UV
//Api that gets the weather (and the lat-long)
//Api that gets the UV index (using the lat long)
//

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
      const cityName = responseLatLong.city.name;
      console.log(cityName);
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
        $("#cityTitleMain").text(`${cityName}`);
        $("#iconMain")
          .removeAttr("src")
          .attr(
            "src",
            `http://openweathermap.org/img/wn/${responseForcast.current.weather[0].icon}@2x.png`
          );
        $("#TemperatureMain").text(responseForcast.current.temp);
        $("#HumidityMain").text(responseForcast.current.humidity);
        $("#WindSpeedMain").text(responseForcast.current.wind_speed);
        $("#fiveDayCards").html("");
        //Create day weather cards
        for (let i = 0; i < 5; i++) {
          const dayObj = responseForcast.daily[i];
          let col = $("<div>").addClass("col");
          let card = $("<div>").addClass("card text-white bg-primary mb-3");
          let cardBody = $("<div>").addClass("card-body");
          let cardTitle = $("<h5>").addClass("card-title");
          let cardIcon = $("<i>").addClass("card-title");

          $("#cardDate1").text(dayjs.unix(dayObj.dt).format("M / D / YYYY"));
        }
      });
      $.ajax({
        url: queryUrlUV,
        method: "GET",
      }).then(function (responseUV) {
        console.log("responseUV");
        console.log(responseUV);

        $("#uvIndexMain").text(responseUV.value);
      });
    });
    //write the weather to the screen
  }
});

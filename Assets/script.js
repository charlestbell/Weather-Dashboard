$(document).ready(function () {
  //get get weather and write it to the screen
  function getWeather(cityName) {
    if ($("#cityInput").val() !== "") {
      let queryUrlLatLong = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=abf76a69e67fc664083162f1310bc36e`;
      //Get Weather
      $.ajax({
        url: queryUrlLatLong,
        method: "GET",
      }).then(function (responseLatLong) {
        //Write City Name to screen
        const cityName = responseLatLong.city.name;

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
            //create card elements
            let col = $("<div>", { class: "col" });
            let card = $("<div>", {
              class: "card text-white bg-primary mb-3",
              css: { "max-width": "10rem;" },
            });
            let cardBody = $("<div>", { class: "card-body" });
            let cardTitle = $("<h5>", { class: "card-title" }).text(
              dayjs.unix(dayObj.dt).format("M / D / YYYY")
            );
            let cardIcon = $("<img>", {
              class: "card-Icon",
              alt: "weather icon",
              src: `http://openweathermap.org/img/wn/${dayObj.weather[0].icon}@2x.png`,
            });
            let cardTemp = $("<p>", { class: `card-text mb-2` }).text(
              `Temp: ${dayObj.temp.day}`
            );
            let cardHumidity = $("<p>", { class: `card-text` }).text(
              `Humidity: ${dayObj.humidity}`
            );
            col.append(card);
            card.append(cardBody);
            cardBody.append(cardTitle, cardIcon, cardTemp, cardHumidity);
            $("#fiveDayCards").append(col);
          }
        });
        $.ajax({
          url: queryUrlUV,
          method: "GET",
        }).then(function (responseUV) {
          $("#uvIndexMain").text(responseUV.value);
        });
      });
    }
  }

  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    cityName = $("#cityInput").val();
    getWeather(cityName);
  });

  //end of document ready
});

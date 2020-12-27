$(document).ready(function () {
  var cityHistory = [];

  if (localStorage.getItem("lastSearched") !== null) {
    let cityName = localStorage.getItem("lastSearched");
    getWeather(cityName);
  }

  //A function that renders the City History
  function renderCityHistory() {
    $("#cityHistoryList").html("");
    $(cityHistory).each(function (i) {
      cityListEl = $("<a>", {
        class: "list-group-item list-group-item-action",
      }).text(cityHistory[i]);
      $("#cityHistoryList").append(cityListEl);
    });
  }

  //get get weather and write it to the screen
  function getWeather(cityName) {
    if (cityName !== "") {
      localStorage.setItem("lastSearched", cityName);

      let queryUrlLatLong = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=abf76a69e67fc664083162f1310bc36e`;
      //Get Weather
      $.ajax({
        url: queryUrlLatLong,
        method: "GET",
      }).then(function (responseLatLong) {
        //Write City Name to screen
        let cityName = responseLatLong.city.name;

        //Use the returned lat and long to get 7 day weather
        let latitude = responseLatLong.city.coord.lat;
        let longitude = responseLatLong.city.coord.lon;
        let queryUrlForcast = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=abf76a69e67fc664083162f1310bc36e`;
        let queryUrlUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=abf76a69e67fc664083162f1310bc36e`;
        $.ajax({
          url: queryUrlForcast,
          method: "GET",
        }).then(function (responseForcast) {
          $("#cityTitleMain").text(
            `${cityName} ${dayjs
              .unix(responseForcast.current.dt)
              .format("M/D/YYYY")}`
          );
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
          //show the current weather
          $("#welcome").addClass("d-none");
          $("#cityData").removeClass("d-none").addClass("d-block");
          //Create 5 day forcast
          for (let i = 0; i < 5; i++) {
            const dayObj = responseForcast.daily[i];

            let col = $("<div>", { class: "col" });
            let card = $("<div>", {
              class: "card text-white color-teal mb-3 shadow",
              css: { "max-width": "10rem" },
            });
            let cardBody = $("<div>", { class: "card-body" });
            let cardTitle = $("<h5>", { class: "card-title" }).text(
              dayjs.unix(dayObj.dt).format("M/D/YYYY")
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
            //Render 5 day forcast
            col.append(card);
            card.append(cardBody);
            cardBody.append(cardTitle, cardIcon, cardTemp, cardHumidity);
            $("#fiveDayCards").append(col);
          }
        });
        //get UV index and render it.
        $.ajax({
          url: queryUrlUV,
          method: "GET",
        }).then(function (responseUV) {
          uvIndex = responseUV.value;
          if (uvIndex <= 2) {
            $("#uvIndexMain").removeClass().addClass("btn btn-success");
          }
          if (uvIndex > 2 && uvIndex <= 5) {
            $("#uvIndexMain").removeClass().addClass("btn btn-warning");
          }
          if (uvIndex > 5 && uvIndex <= 7) {
            $("#uvIndexMain").removeClass().addClass("btn btn-orange");
          }
          if (uvIndex > 7 && uvIndex <= 10) {
            $("#uvIndexMain").removeClass().addClass("btn btn-danger");
          }
          if (uvIndex > 10) {
            $("#uvIndexMain").removeClass().addClass("btn btn-purple");
          }
          $("#uvIndexMain").text(uvIndex);
        });
      });
    }
  }

  //Get my weather! (and also add the city to the list)
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    cityName = $("#cityInput").val();
    cityHistory.unshift(cityName);
    renderCityHistory();
    getWeather(cityName);
  });

  //Get weather on Enter
  $(document).keypress(function (e) {
    if (e.which == 13) {
      cityName = $("#cityInput").val();
      cityHistory.unshift(cityName);
      renderCityHistory();
      getWeather(cityName);
    }
  });

  //Make City History clickable
  $("#cityHistoryList").on("click", function (event) {
    getWeather(event.target.text);
  });

  //end of document ready
});

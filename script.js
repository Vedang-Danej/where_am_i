"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const text = document.querySelector(".city");

///////////////////////////////////////
const renderCountry = function (data, neighbour = "") {
  // console.log(data);
  const html = `<article class="country ${neighbour}">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
  <h3 class="country__name">${data.name}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${
    +data.population > 999999999
      ? `${(+data.population / 1000000000).toFixed(1)}B`
      : `${(+data.population / 1000000).toFixed(1)}M`
  } People</p>
  <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
  <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
  </article>`;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};
const whereAmI = function (lat, lng) {
  // const lat = 22.0814706;
  // const lng = 81.1485254;
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  )
    .then((response) => {
      if (response.status === 403) throw new Error("Limit exceeded.");
      return response.json();
    })
    .then((data) => {
      console.log(data);
      text.textContent = `You are in ${
        data.localityInfo.administrative[2].name.split(" ")[0]
      }, ${data.countryName}.`;
      return fetch(`https://restcountries.eu/rest/v2/name/${data.countryName}`);
    })
    .then((response) => {
      if (!response.ok) throw new Error(`Couldn't fetch the country`);
      return response.json();
    })
    .then((data) => {
      const i = data.length - 1;
      renderCountry(data[i]);
    })
    .catch((err) =>
      countriesContainer.insertAdjacentText("beforeend", `${err.message}`)
    )
    .finally(() => (countriesContainer.style.opacity = 1));
};
navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude, longitude } = position.coords;

    btn.addEventListener("click", function () {
      whereAmI(latitude, longitude);
      btn.style.opacity = 0;
    });
  },
  function () {
    alert("Location could not be obtained. Please, allow access.");
  }
);

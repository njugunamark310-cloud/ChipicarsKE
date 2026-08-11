console.log("ChipicarsKE JavaScript is working!");

// =====================================
// FAVOURITE BUTTONS
// =====================================

let favouriteCount = 0;

const favouriteButtons = document.querySelectorAll(".card-favourite");
const favouriteNumber = document.getElementById("favoriteCount");

favouriteButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (button.textContent.trim() === "♡") {

            button.textContent = "♥";
            favouriteCount++;

        } else {

            button.textContent = "♡";
            favouriteCount--;

        }

        if (favouriteNumber) {
            favouriteNumber.textContent = favouriteCount;
        }

    });

});


// =====================================
// BROWSE CARS BUTTON
// =====================================

const browseButton = document.querySelector(".hero .primary-button");

if (browseButton) {

    browseButton.addEventListener("click", function () {

        const browseSection = document.getElementById("browse");

        if (browseSection) {
            browseSection.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

}


// =====================================
// SEARCH CARS
// =====================================

const searchButton = document.getElementById("searchButton");

const make = document.getElementById("make");
const model = document.getElementById("model");
const price = document.getElementById("price");
const locationFilter = document.getElementById("location");

const cars = document.querySelectorAll(".car-card");


if (searchButton) {

    searchButton.addEventListener("click", function () {

        let foundCars = 0;

        cars.forEach(function (car) {

            let showCar = true;

            const carMake = car.dataset.make;
            const carModel = car.dataset.model;
            const carPrice = Number(car.dataset.price);
            const carLocation = car.dataset.location;


            // MAKE FILTER
            if (
                make &&
                make.value !== "" &&
                make.value !== carMake
            ) {
                showCar = false;
            }


            // MODEL FILTER
            if (
                model &&
                model.value !== "" &&
                model.value !== carModel
            ) {
                showCar = false;
            }


            // PRICE FILTER
            if (
                price &&
                price.value !== "" &&
                carPrice > Number(price.value) * 1000000
            ) {
                showCar = false;
            }


            // LOCATION FILTER
            if (
                locationFilter &&
                locationFilter.value !== "" &&
                locationFilter.value !== carLocation
            ) {
                showCar = false;
            }


            // SHOW / HIDE CAR
            if (showCar) {

                car.style.display = "";
                foundCars++;

            } else {

                car.style.display = "none";

            }

        });


        if (foundCars === 0) {

            alert("No cars found. Try different filters.");

        }

    });

}


// =====================================
// SELL BUTTONS
// =====================================

const sellButtons = document.querySelectorAll(
    ".sell-button, .secondary-button"
);

sellButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const sellSection = document.getElementById("sell");

        if (sellSection) {

            sellSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// =====================================
// FAVOURITES MENU BUTTON
// =====================================

const favouriteMenu = document.querySelector(".favourite-button");

if (favouriteMenu) {

    favouriteMenu.addEventListener("click", function () {

        const garageSection = document.getElementById("garage");

        if (garageSection) {

            garageSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}
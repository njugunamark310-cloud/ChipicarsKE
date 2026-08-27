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
/* =========================================================
   CHIPICARSKE - COMPARE PAGE
   Complete Comparison JavaScript
   Cars + Motorcycles
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SETTINGS
       ===================================================== */

    const MAX_COMPARE = 3;
    const STORAGE_KEY = "chipicarsCompare";


    /* =====================================================
       VEHICLE DATABASE
       ===================================================== */

    const vehicles = {

        /* ================= CARS ================= */

        toyotaHarrier: {
            id: "toyotaHarrier",
            type: "Car",
            name: "Toyota Harrier",
            price: "KSh 4,850,000",
            year: "2021",
            mileage: "42,000 km",
            engine: "2.0L",
            fuel: "Petrol",
            transmission: "Automatic",
            location: "Nairobi",
            image: "images/harrier.jpg"
        },

        mazdaCx5: {
            id: "mazdaCx5",
            type: "Car",
            name: "Mazda CX-5",
            price: "KSh 3,950,000",
            year: "2020",
            mileage: "51,000 km",
            engine: "2.5L",
            fuel: "Petrol",
            transmission: "Automatic",
            location: "Nairobi",
            image: "images/cx5.jpg"
        },

        toyotaPrado: {
            id: "toyotaPrado",
            type: "Car",
            name: "Toyota Land Cruiser Prado",
            price: "KSh 7,200,000",
            year: "2022",
            mileage: "35,000 km",
            engine: "2.8L",
            fuel: "Diesel",
            transmission: "Automatic",
            location: "Mombasa",
            image: "images/prado.jpg"
        },

        toyotaAxio: {
            id: "toyotaAxio",
            type: "Car",
            name: "Toyota Axio",
            price: "KSh 1,450,000",
            year: "2018",
            mileage: "76,000 km",
            engine: "1.5L",
            fuel: "Petrol",
            transmission: "Automatic",
            location: "Nairobi",
            image: "images/axio.jpg"
        },

        subaruForester: {
            id: "subaruForester",
            type: "Car",
            name: "Subaru Forester",
            price: "KSh 3,200,000",
            year: "2019",
            mileage: "62,000 km",
            engine: "2.0L",
            fuel: "Petrol",
            transmission: "Automatic",
            location: "Kiambu",
            image: "images/forester.jpg"
        },

        nissanXtrail: {
            id: "nissanXtrail",
            type: "Car",
            name: "Nissan X-Trail",
            price: "KSh 2,850,000",
            year: "2019",
            mileage: "68,000 km",
            engine: "2.0L",
            fuel: "Petrol",
            transmission: "Automatic",
            location: "Nairobi",
            image: "images/xtrail.jpg"
        },


        /* ================= MOTORCYCLES ================= */

        yamahaR15: {
            id: "yamahaR15",
            type: "Motorcycle",
            name: "Yamaha R15",
            price: "KSh 520,000",
            year: "2023",
            mileage: "8,500 km",
            engine: "155cc",
            fuel: "Petrol",
            transmission: "Manual",
            location: "Nairobi",
            image: "images/yamaha-r15.jpg"
        },

        hondaCb500: {
            id: "hondaCb500",
            type: "Motorcycle",
            name: "Honda CB500",
            price: "KSh 780,000",
            year: "2022",
            mileage: "12,000 km",
            engine: "471cc",
            fuel: "Petrol",
            transmission: "Manual",
            location: "Nairobi",
            image: "images/honda-cb500.jpg"
        },

        ktmDuke390: {
            id: "ktmDuke390",
            type: "Motorcycle",
            name: "KTM Duke 390",
            price: "KSh 650,000",
            year: "2023",
            mileage: "7,200 km",
            engine: "373cc",
            fuel: "Petrol",
            transmission: "Manual",
            location: "Nakuru",
            image: "images/duke390.jpg"
        },

        boxer150: {
            id: "boxer150",
            type: "Motorcycle",
            name: "Bajaj Boxer 150",
            price: "KSh 185,000",
            year: "2022",
            mileage: "18,000 km",
            engine: "144cc",
            fuel: "Petrol",
            transmission: "Manual",
            location: "Nairobi",
            image: "images/boxer.jpg"
        }
    };


    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const selectors =
        document.getElementById("comparisonSelectors");

    const comparisonTableWrapper =
        document.getElementById("comparisonTableWrapper");

    const comparisonEmpty =
        document.getElementById("comparisonEmpty");

    const favoriteCount =
        document.getElementById("favoriteCount");


    /* =====================================================
       LOAD SAVED COMPARISON
       ===================================================== */

    let compareVehicles = loadComparison();


    function loadComparison() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(STORAGE_KEY)
                );

            if (!Array.isArray(saved)) {
                return [];
            }

            /*
             * Only keep vehicles that still exist
             * in the database.
             */

            return saved
                .filter(vehicle => vehicle && vehicle.id)
                .map(vehicle => {

                    if (vehicles[vehicle.id]) {
                        return vehicles[vehicle.id];
                    }

                    return vehicle;

                })
                .slice(0, MAX_COMPARE);

        } catch (error) {

            console.error(
                "Could not load comparison:",
                error
            );

            return [];
        }
    }


    /* =====================================================
       SAVE COMPARISON
       ===================================================== */

    function saveComparison() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(compareVehicles)
        );
    }


    /* =====================================================
       ADD VEHICLE
       ===================================================== */

    window.addToCompare = function (vehicleId) {

        const vehicle = vehicles[vehicleId];

        if (!vehicle) {

            console.error(
                "Vehicle not found:",
                vehicleId
            );

            return;
        }


        /* Prevent duplicates */

        const alreadyAdded =
            compareVehicles.some(
                item => item.id === vehicle.id
            );

        if (alreadyAdded) {

            alert(
                `${vehicle.name} is already in your comparison.`
            );

            return;
        }


        /* Maximum limit */

        if (compareVehicles.length >= MAX_COMPARE) {

            alert(
                "You can compare a maximum of 3 vehicles."
            );

            return;
        }


        compareVehicles.push(vehicle);

        saveComparison();

        renderPage();
    };


    /* =====================================================
       REMOVE VEHICLE
       ===================================================== */

    window.removeFromCompare = function (vehicleId) {

        const originalLength =
            compareVehicles.length;


        compareVehicles =
            compareVehicles.filter(
                vehicle => vehicle.id !== vehicleId
            );


        /*
         * Only save/render if something was actually removed.
         */

        if (
            compareVehicles.length !==
            originalLength
        ) {

            saveComparison();

            renderPage();
        }
    };


    /* =====================================================
       CLEAR EVERYTHING
       ===================================================== */

    window.clearComparison = function () {

        if (compareVehicles.length === 0) {
            return;
        }


        const confirmed =
            confirm(
                "Remove all vehicles from comparison?"
            );


        if (!confirmed) {
            return;
        }


        compareVehicles = [];

        saveComparison();

        renderPage();
    };


    /* =====================================================
       RENDER SELECTION SLOTS
       ===================================================== */

    function renderSelectors() {

        if (!selectors) {
            return;
        }


        const slots =
            selectors.querySelectorAll(
                ".comparison-slot"
            );


        slots.forEach((slot, index) => {

            const vehicle =
                compareVehicles[index];


            /* EMPTY SLOT */

            if (!vehicle) {

                const isMotorcycleSlot =
                    index === 2;


                slot.innerHTML = `

                    <div class="comparison-slot-icon">
                        +
                    </div>

                    <h3>
                        ${isMotorcycleSlot
                            ? "Add Motorcycle"
                            : "Add Vehicle"}
                    </h3>

                    <p>
                        ${isMotorcycleSlot
                            ? "Choose a motorcycle to compare."
                            : "Choose a vehicle to compare."}
                    </p>

                    <a
                        href="cars.html"
                        class="outline-button"
                    >
                        ${isMotorcycleSlot
                            ? "Browse Motorcycles"
                            : "Browse Cars"}
                    </a>
                `;

                return;
            }


            /* SELECTED VEHICLE */

            slot.innerHTML = `

                <div class="comparison-selected">

                    <div class="comparison-selected-image">

                        ${
                            vehicle.image
                            ? `
                                <img
                                    src="${vehicle.image}"
                                    alt="${vehicle.name}"
                                    onerror="
                                        this.style.display='none'
                                    "
                                >
                            `
                            : ""
                        }

                    </div>

                    <span class="vehicle-type">
                        ${vehicle.type}
                    </span>

                    <h3>
                        ${vehicle.name}
                    </h3>

                    <p>
                        ${vehicle.year}
                        ·
                        ${vehicle.mileage}
                    </p>

                    <strong class="comparison-price">
                        ${vehicle.price}
                    </strong>

                    <button
                        type="button"
                        class="remove-comparison"
                        onclick="
                            removeFromCompare('${vehicle.id}')
                        "
                    >
                        Remove
                    </button>

                </div>
            `;
        });
    }


    /* =====================================================
       RENDER COMPARISON TABLE
       
       IMPORTANT:
       The specification list remains visible.
       JavaScript only fills the cells.
       ===================================================== */

    function renderTable() {

        if (!comparisonTableWrapper) {
            return;
        }


        const fields = [
            "vehicleName",
            "price",
            "year",
            "mileage",
            "engine",
            "fuel",
            "transmission",
            "location"
        ];


        for (
            let index = 0;
            index < MAX_COMPARE;
            index++
        ) {

            const vehicle =
                compareVehicles[index];


            /*
             * Header
             */

            const header =
                document.getElementById(
                    `vehicleHeader${index}`
                );


            /*
             * No vehicle in this column
             */

            if (!vehicle) {

                if (header) {

                    header.innerHTML = `
                        Vehicle ${index + 1}
                    `;
                }


                fields.forEach(field => {

                    const cell =
                        document.getElementById(
                            `${field}${index}`
                        );

                    if (cell) {
                        cell.textContent = "—";
                    }
                });


                continue;
            }


            /*
             * Vehicle header
             */

            if (header) {

                header.innerHTML = `

                    <div class="table-vehicle-header">

                        <span
                            class="table-vehicle-type"
                        >
                            ${vehicle.type}
                        </span>

                        <strong>
                            ${vehicle.name}
                        </strong>

                        <button
                            type="button"
                            class="table-remove-button"
                            onclick="
                                removeFromCompare(
                                    '${vehicle.id}'
                                )
                            "
                        >
                            Remove
                        </button>

                    </div>
                `;
            }


            /*
             * Vehicle name
             */

            setCell(
                `vehicleName${index}`,
                vehicle.name
            );


            /*
             * Price
             */

            setCell(
                `price${index}`,
                vehicle.price
            );


            /*
             * Year
             */

            setCell(
                `year${index}`,
                vehicle.year
            );


            /*
             * Mileage
             */

            setCell(
                `mileage${index}`,
                vehicle.mileage
            );


            /*
             * Engine

             */

            setCell(
                `engine${index}`,
                vehicle.engine
            );


            /*
             * Fuel
             */

            setCell(
                `fuel${index}`,
                vehicle.fuel
            );


            /*
             * Transmission
             */

            setCell(
                `transmission${index}`,
                vehicle.transmission
            );


            /*
             * Location
             */

            setCell(
                `location${index}`,
                vehicle.location
            );
        }


        /*
         * Update table title depending
         * on selected vehicle type.
         */

        updateTableTitle();
    }


    /* =====================================================
       SET TABLE CELL
       ===================================================== */

    function setCell(id, value) {

        const cell =
            document.getElementById(id);

        if (cell) {

            cell.textContent =
                value || "—";
        }
    }


    /* =====================================================
       UPDATE TABLE TITLE
       ===================================================== */

    function updateTableTitle() {

        const tableLabel =
            comparisonTableWrapper.querySelector(
                ".section-label"
            );

        const tableTitle =
            comparisonTableWrapper.querySelector(
                ".comparison-table-header h2"
            );

        const hasMotorcycle =
            compareVehicles.some(
                vehicle =>
                    vehicle.type === "Motorcycle"
            );


        if (hasMotorcycle) {

            if (tableLabel) {
                tableLabel.textContent =
                    "MOTORCYCLE COMPARISON";
            }

            if (tableTitle) {
                tableTitle.textContent =
                    "Compare Motorcycles";
            }

        } else {

            if (tableLabel) {
                tableLabel.textContent =
                    "VEHICLE COMPARISON";
            }

            if (tableTitle) {
                tableTitle.textContent =
                    "Compare Vehicles";
            }
        }
    }


    /* =====================================================
       EMPTY STATE
       ===================================================== */

    function renderEmptyState() {

        if (!comparisonEmpty) {
            return;
        }


        if (compareVehicles.length === 0) {

            comparisonEmpty.style.display =
                "block";

        } else {

            comparisonEmpty.style.display =
                "none";
        }
    }


    /* =====================================================
       FAVOURITE COUNT
       ===================================================== */

    function updateFavoriteCount() {

        if (!favoriteCount) {
            return;
        }


        try {

            const favorites =
                JSON.parse(
                    localStorage.getItem(
                        "chipicarsFavorites"
                    )
                ) || [];


            favoriteCount.textContent =
                favorites.length;

        } catch (error) {

            favoriteCount.textContent = "0";
        }
    }


    /* =====================================================
       URL VEHICLE SUPPORT
       
       Example:
       compare.html?vehicle=toyotaHarrier
       ===================================================== */

    function loadVehicleFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const vehicleId =
            params.get("vehicle");


        if (!vehicleId) {
            return;
        }


        const vehicle =
            vehicles[vehicleId];


        if (!vehicle) {
            return;
        }


        const alreadyAdded =
            compareVehicles.some(
                item => item.id === vehicle.id
            );


        if (
            !alreadyAdded &&
            compareVehicles.length < MAX_COMPARE
        ) {

            compareVehicles.push(vehicle);

            saveComparison();
        }


        /*
         * Clean the URL after processing it.
         */

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }


    /* =====================================================
       PUBLIC FUNCTION FOR CARDS
       
       You can use:
       
       addVehicleToCompare("toyotaHarrier")
       
       or:
       
       addToCompare("toyotaHarrier")
       ===================================================== */

    window.addVehicleToCompare =
        function (vehicleId) {

            window.addToCompare(vehicleId);
        };


    /* =====================================================
       MAIN RENDER
       ===================================================== */

    function renderPage() {

        renderSelectors();

        renderTable();

        renderEmptyState();

        updateFavoriteCount();
    }


    /* =====================================================
       START PAGE
       ===================================================== */

    loadVehicleFromURL();

    renderPage();

});
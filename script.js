/* =========================================================
   CHIPICARSKE - MASTER JAVASCRIPT
   =========================================================

   Features:
   ✓ Smooth navigation
   ✓ Hero interactions
   ✓ Search and filtering
   ✓ Vehicle sorting
   ✓ Favourites
   ✓ Garage
   ✓ Compare system
   ✓ Contact form
   ✓ Animated statistics
   ✓ Scroll reveal effects
   ✓ Button feedback
   ✓ LocalStorage
   ✓ Notifications

   Designed to work across:
   index.html
   cars.html
   compare.html
   motorcycle.html
   garage.html
   sell.html
   ========================================================= */


/* =========================================================
   1. CONFIGURATION
   ========================================================= */

const CHIPICARSKE = {

    storage: {
        favourites: "chipicarskeFavourites",
        comparison: "chipicarskeComparison",
        motorcycles: "chipicarskeMotorcycleComparison"
    },

    comparisonLimit: 3

};


/* =========================================================
   2. APPLICATION START
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "🚗 ChipicarsKE application started."
    );


    initializeFavourites();

    initializeSearch();

    initializeSorting();

    initializeComparisonButtons();

    initializeNavigation();

    initializeContactForm();

    initializeScrollEffects();

    initializeAnimatedStats();

    initializeGarage();

    initializeHeroEffects();

    initializeCardEffects();

    updateFavouriteCount();

    updateComparisonCount();

});


/* =========================================================
   3. LOCAL STORAGE
   ========================================================= */

function getStorage(key) {

    try {

        const stored =
            localStorage.getItem(key);

        if (!stored) {

            return [];

        }

        const data =
            JSON.parse(stored);

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            "Storage error:",
            error
        );

        return [];

    }

}


function saveStorage(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    } catch (error) {

        console.error(
            "Could not save data:",
            error
        );

    }

}


/* =========================================================
   4. VEHICLE DATA
   ========================================================= */

function getVehicleFromCard(card) {

    if (!card) return null;


    const image =
        card.querySelector("img");


    const title =
        card.querySelector("h3");


    const details =
        card.querySelectorAll(
            ".car-info p"
        );


    const price =
        card.dataset.price ||
        extractNumber(
            card.querySelector(
                ".car-price"
            )?.textContent
        );


    let year = "";

    let engine = "";

    let fuel = "";

    let transmission = "";


    if (details[0]) {

        const text =
            details[0].textContent.trim();


        const yearMatch =
            text.match(
                /\b(19|20)\d{2}\b/
            );


        const engineMatch =
            text.match(
                /[\d.]+\s*L/i
            );


        const fuelMatch =
            text.match(
                /Petrol|Diesel|Hybrid|Electric/i
            );


        const transmissionMatch =
            text.match(
                /Automatic|Manual|CVT|DCT/i
            );


        if (yearMatch) {

            year =
                yearMatch[0];

        }


        if (engineMatch) {

            engine =
                engineMatch[0];

        }


        if (fuelMatch) {

            fuel =
                fuelMatch[0];

        }


        if (transmissionMatch) {

            transmission =
                transmissionMatch[0];

        }

    }


    return {

        id:
            card.dataset.id ||
            createVehicleId(
                title?.textContent,
                card.dataset.location
            ),

        name:
            title?.textContent.trim() ||
            "Unknown Vehicle",

        make:
            card.dataset.make || "",

        model:
            card.dataset.model || "",

        price:
            Number(price) || 0,

        location:
            card.dataset.location || "",

        year,

        engine,

        fuel,

        transmission,

        image:
            image?.src || "",

        type:
            card.dataset.type || "car"

    };

}


/* =========================================================
   5. CREATE VEHICLE ID
   ========================================================= */

function createVehicleId(
    name = "",
    location = ""
) {

    return (

        `${name}-${location}`

    )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-|-$/g,
            ""
        );

}


/* =========================================================
   6. NUMBER EXTRACTION
   ========================================================= */

function extractNumber(value) {

    if (!value) {

        return 0;

    }


    const number =
        String(value)
            .replace(
                /[^0-9.]/g,
                ""
            );


    return Number(number) || 0;

}


/* =========================================================
   7. FAVOURITES
   ========================================================= */

function initializeFavourites() {

    const buttons =
        document.querySelectorAll(
            ".card-favourite, .vehicle-favourite"
        );


    const favourites =
        getStorage(
            CHIPICARSKE.storage.favourites
        );


    buttons.forEach(function (button) {

        const card =
            button.closest(
                ".car-card, .vehicle-card"
            );


        if (!card) return;


        const vehicle =
            getVehicleFromCard(card);


        const exists =
            favourites.some(
                function (item) {

                    return (
                        item.id ===
                        vehicle.id
                    );

                }
            );


        updateFavouriteButton(
            button,
            exists
        );


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                toggleFavourite(
                    vehicle,
                    button
                );

            }
        );

    });

}


/* =========================================================
   8. TOGGLE FAVOURITE
   ========================================================= */

function toggleFavourite(
    vehicle,
    button
) {

    let favourites =
        getStorage(
            CHIPICARSKE.storage.favourites
        );


    const index =
        favourites.findIndex(
            function (item) {

                return (
                    item.id ===
                    vehicle.id
                );

            }
        );


    if (index >= 0) {

        favourites.splice(
            index,
            1
        );


        updateFavouriteButton(
            button,
            false
        );


        showNotification(
            `${vehicle.name} removed from your garage.`,
            "info"
        );

    } else {

        favourites.push(
            vehicle
        );


        updateFavouriteButton(
            button,
            true
        );


        showNotification(
            `${vehicle.name} saved to your garage.`,
            "success"
        );

    }


    saveStorage(
        CHIPICARSKE.storage.favourites,
        favourites
    );


    updateFavouriteCount();

    updateGaragePreview();

}


/* =========================================================
   9. FAVOURITE BUTTON
   ========================================================= */

function updateFavouriteButton(
    button,
    active
) {

    if (!button) return;


    button.textContent =
        active ? "♥" : "♡";


    button.classList.toggle(
        "active",
        active
    );


    button.setAttribute(
        "aria-pressed",
        active
    );

}


/* =========================================================
   10. FAVOURITE COUNTER
   ========================================================= */

function updateFavouriteCount() {

    const counter =
        document.getElementById(
            "favoriteCount"
        );


    if (!counter) return;


    const favourites =
        getStorage(
            CHIPICARSKE.storage.favourites
        );


    counter.textContent =
        favourites.length;

}


/* =========================================================
   11. SEARCH
   ========================================================= */

function initializeSearch() {

    const searchButton =
        document.getElementById(
            "searchButton"
        );


    if (!searchButton) return;


    searchButton.addEventListener(
        "click",
        function () {

            const make =
                document.getElementById(
                    "make"
                )?.value;


            const model =
                document.getElementById(
                    "model"
                )?.value;


            const price =
                document.getElementById(
                    "price"
                )?.value;


            const location =
                document.getElementById(
                    "location"
                )?.value;


            const cards =
                document.querySelectorAll(
                    ".car-card"
                );


            let visibleCars = 0;


            cards.forEach(function (card) {

                const cardMake =
                    card.dataset.make || "";


                const cardModel =
                    card.dataset.model || "";


                const cardPrice =
                    Number(
                        card.dataset.price || 0
                    );


                const cardLocation =
                    card.dataset.location || "";


                let visible = true;


                if (
                    make &&
                    cardMake !== make
                ) {

                    visible = false;

                }


                /*
                   Model matching is made flexible
                   so "7 Series" and "BMW7"
                   can still be handled later.
                */

                if (
                    model &&
                    cardModel !== model
                ) {

                    visible = false;

                }


                if (
                    price &&
                    cardPrice >
                    Number(price) * 1000000
                ) {

                    visible = false;

                }


                if (
                    location &&
                    cardLocation !== location
                ) {

                    visible = false;

                }


                card.classList.toggle(
                    "search-hidden",
                    !visible
                );


                if (visible) {

                    visibleCars++;

                }

            });


            if (visibleCars === 0) {

                showNotification(
                    "No vehicles match your search.",
                    "warning"
                );

            } else {

                showNotification(
                    `${visibleCars} vehicle${visibleCars === 1 ? "" : "s"} found.`,
                    "success"
                );

            }


            document
                .getElementById("browse")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================================================
   12. SORTING
   ========================================================= */

function initializeSorting() {

    const sort =
        document.getElementById(
            "sortVehicles"
        );


    const grid =
        document.getElementById(
            "vehicleGrid"
        );


    if (!sort || !grid) return;


    sort.addEventListener(
        "change",
        function () {

            const cards =
                Array.from(
                    grid.querySelectorAll(
                        ".vehicle-card"
                    )
                );


            cards.sort(
                function (a, b) {

                    const priceA =
                        Number(
                            a.dataset.price || 0
                        );


                    const priceB =
                        Number(
                            b.dataset.price || 0
                        );


                    if (
                        sort.value === "low"
                    ) {

                        return (
                            priceA - priceB
                        );

                    }


                    if (
                        sort.value === "high"
                    ) {

                        return (
                            priceB - priceA
                        );

                    }


                    return 0;

                }
            );


            cards.forEach(
                function (card) {

                    grid.appendChild(
                        card
                    );

                }
            );

        }
    );

}


/* =========================================================
   13. COMPARE BUTTONS
   ========================================================= */

function initializeComparisonButtons() {

    const cards =
        document.querySelectorAll(
            ".car-card, .vehicle-card"
        );


    cards.forEach(function (card) {

        if (
            card.querySelector(
                ".compare-button"
            )
        ) {

            return;

        }


        const vehicle =
            getVehicleFromCard(card);


        const info =
            card.querySelector(
                ".car-info, .vehicle-info"
            );


        if (!info) return;


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "compare-button";


        button.innerHTML =
            "⇄ Compare";


        button.addEventListener(
            "click",
            function () {

                addToComparison(
                    vehicle
                );

            }
        );


        info.appendChild(
            button
        );

    });

}


/* =========================================================
   14. ADD TO COMPARISON
   ========================================================= */

function addToComparison(
    vehicle
) {

    let comparison =
        getStorage(
            CHIPICARSKE.storage.comparison
        );


    const exists =
        comparison.some(
            function (item) {

                return (
                    item.id ===
                    vehicle.id
                );

            }
        );


    if (exists) {

        showNotification(
            `${vehicle.name} is already being compared.`,
            "warning"
        );

        return;

    }


    if (
        comparison.length >=
        CHIPICARSKE.comparisonLimit
    ) {

        showNotification(
            "You can compare a maximum of 3 vehicles.",
            "warning"
        );

        return;

    }


    comparison.push(
        vehicle
    );


    saveStorage(
        CHIPICARSKE.storage.comparison,
        comparison
    );


    updateComparisonCount();


    showNotification(
        `${vehicle.name} added to comparison.`,
        "success"
    );


    /*
       Ask user whether they want
       to see the comparison.
    */

    setTimeout(function () {

        const notification =
            document.querySelector(
                ".chipicars-notification"
            );


        if (notification) {

            const link =
                document.createElement(
                    "a"
                );


            link.href =
                "compare.html";


            link.textContent =
                " View Comparison";


            link.className =
                "notification-link";


            notification.appendChild(
                link
            );

        }

    }, 50);

}


/* =========================================================
   15. COMPARISON COUNT
   ========================================================= */

function updateComparisonCount() {

    const comparison =
        getStorage(
            CHIPICARSKE.storage.comparison
        );


    const counters =
        document.querySelectorAll(
            "#comparisonCount"
        );


    counters.forEach(
        function (counter) {

            counter.textContent =
                comparison.length;

        }
    );

}


/* =========================================================
   16. REMOVE COMPARISON
   ========================================================= */

function removeFromComparison(
    vehicleId
) {

    let comparison =
        getStorage(
            CHIPICARSKE.storage.comparison
        );


    comparison =
        comparison.filter(
            function (vehicle) {

                return (
                    vehicle.id !==
                    vehicleId
                );

            }
        );


    saveStorage(
        CHIPICARSKE.storage.comparison,
        comparison
    );


    updateComparisonCount();


    /*
       If comparison page exists,
       refresh it.
    */

    if (
        typeof renderComparisonPage ===
        "function"
    ) {

        renderComparisonPage();

    }


    showNotification(
        "Vehicle removed from comparison.",
        "info"
    );

}


/* =========================================================
   17. CLEAR COMPARISON
   ========================================================= */

function clearComparison() {

    saveStorage(
        CHIPICARSKE.storage.comparison,
        []
    );


    updateComparisonCount();


    if (
        typeof renderComparisonPage ===
        "function"
    ) {

        renderComparisonPage();

    }


    showNotification(
        "Comparison cleared.",
        "success"
    );

}


/* =========================================================
   18. GARAGE
   ========================================================= */

function initializeGarage() {

    updateGaragePreview();

}


/* =========================================================
   19. GARAGE PREVIEW
   ========================================================= */

function updateGaragePreview() {

    const garage =
        document.querySelector(
            ".garage-preview"
        );


    if (!garage) return;


    const favourites =
        getStorage(
            CHIPICARSKE.storage.favourites
        );


    if (
        favourites.length === 0
    ) {

        garage.innerHTML = `

            <span class="garage-heart">
                ♡
            </span>

            <h3>
                Your Garage
            </h3>

            <p>
                No saved cars yet.
            </p>

            <a
                href="#browse"
                class="garage-link"
            >
                Browse Cars →
            </a>

        `;

        return;

    }


    garage.innerHTML = `

        <span class="garage-heart">
            ♥
        </span>

        <h3>
            Your Garage
        </h3>

        <p>
            You have
            <strong>${favourites.length}</strong>
            saved vehicle${favourites.length === 1 ? "" : "s"}.
        </p>

        <button
            type="button"
            class="garage-link"
            id="viewGarageButton"
        >
            View Saved Cars →
        </button>

    `;


    document
        .getElementById(
            "viewGarageButton"
        )
        ?.addEventListener(
            "click",
            function () {

                window.location.href =
                    "garage.html";

            }
        );

}


/* =========================================================
   20. NAVIGATION
   ========================================================= */

function initializeNavigation() {

    /*
       Browse Cars
    */

    document
        .querySelectorAll(
            ".hero .primary-button"
        )
        .forEach(function (button) {

            if (
                button.textContent
                    .toLowerCase()
                    .includes("browse")
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        document
                            .getElementById(
                                "browse"
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth"
                            });

                    }
                );

            }

        });


    /*
       Hero Sell button
    */

    document
        .querySelectorAll(
            ".hero .secondary-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .getElementById(
                            "sell"
                        )
                        ?.scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }
            );

        });


    /*
       Sell My Car navigation button
    */

    document
        .querySelectorAll(
            ".sell-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .getElementById(
                            "sell"
                        )
                        ?.scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }
            );

        });


    /*
       Favourite button
    */

    const favouriteButton =
        document.querySelector(
            ".favourite-button"
        );


    if (favouriteButton) {

        favouriteButton.addEventListener(
            "click",
            function () {

                const garage =
                    document.getElementById(
                        "garage"
                    );


                if (garage) {

                    garage.scrollIntoView({
                        behavior:
                            "smooth"
                    });

                } else {

                    window.location.href =
                        "garage.html";

                }

            }
        );

    }


    /*
       Compare section
    */

    document
        .querySelectorAll(
            ".Feature-selection .primary-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "compare.html";

                }
            );

        });

}


/* =========================================================
   21. CONTACT FORM
   ========================================================= */

function initializeContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                )?.value.trim();


            const email =
                document.getElementById(
                    "email"
                )?.value.trim();


            const subject =
                document.getElementById(
                    "subject"
                )?.value;


            const message =
                document.getElementById(
                    "message"
                )?.value.trim();


            const feedback =
                document.getElementById(
                    "contactMessage"
                );


            if (
                !name ||
                !email ||
                !message
            ) {

                if (feedback) {

                    feedback.textContent =
                        "Please complete all required fields.";

                    feedback.className =
                        "contact-message error";

                }


                showNotification(
                    "Please complete the required fields.",
                    "warning"
                );


                return;

            }


            if (feedback) {

                feedback.textContent =
                    `Thanks ${name}! Your message has been received.`;

                feedback.className =
                    "contact-message success";

            }


            showNotification(
                "Message sent successfully!",
                "success"
            );


            form.reset();

        }
    );

}


/* =========================================================
   22. SCROLL REVEAL
   ========================================================= */

function initializeScrollEffects() {

    const elements =
        document.querySelectorAll(
            ".car-card, " +
            ".benefit-card, " +
            ".brands span, " +
            ".stats > div, " +
            ".garage-preview, " +
            ".contact-container > div"
        );


    if (!elements.length) return;


    elements.forEach(
        function (element) {

            element.classList.add(
                "scroll-reveal"
            );

        }
    );


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   23. ANIMATED STATISTICS
   ========================================================= */

function initializeAnimatedStats() {

    const stats =
        document.querySelectorAll(
            ".stats h2"
        );


    if (!stats.length) return;


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) return;


                        const element =
                            entry.target;


                        const original =
                            element.textContent.trim();


                        const match =
                            original.match(
                                /[\d,]+/
                            );


                        if (!match) return;


                        const target =
                            Number(
                                match[0]
                                    .replace(
                                        /,/g,
                                        ""
                                    )
                            );


                        animateNumber(
                            element,
                            target,
                            original
                                .includes("+")
                        );


                        observer.unobserve(
                            element
                        );

                    }
                );

            },
            {
                threshold: 0.5
            }
        );


    stats.forEach(
        function (stat) {

            observer.observe(
                stat
            );

        }
    );

}


/* =========================================================
   24. NUMBER ANIMATION
   ========================================================= */

function animateNumber(
    element,
    target,
    plus
) {

    let current = 0;


    const duration = 1200;

    const start =
        performance.now();


    function update(time) {

        const progress =
            Math.min(
                (time - start) /
                duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        current =
            Math.floor(
                target * eased
            );


        element.textContent =
            current.toLocaleString() +
            (plus ? "+" : "");


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   25. HERO EFFECTS
   ========================================================= */

function initializeHeroEffects() {

    const heroCar =
        document.querySelector(
            ".hero-car img"
        );


    if (!heroCar) return;


    heroCar.addEventListener(
        "mouseenter",
        function () {

            heroCar.classList.add(
                "hero-car-active"
            );

        }
    );


    heroCar.addEventListener(
        "mouseleave",
        function () {

            heroCar.classList.remove(
                "hero-car-active"
            );

        }
    );


    /*
       Subtle mouse movement
    */

    const hero =
        document.querySelector(
            ".hero"
        );


    if (!hero) return;


    hero.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                hero.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width -
                0.5;


            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height -
                0.5;


            heroCar.style.transform =
                `
                translate(
                    ${x * 10}px,
                    ${y * 10}px
                )
                `;

        }
    );


    hero.addEventListener(
        "mouseleave",
        function () {

            heroCar.style.transform =
                "";

        }
    );

}


/* =========================================================
   26. VEHICLE CARD EFFECTS
   ========================================================= */

function initializeCardEffects() {

    const cards =
        document.querySelectorAll(
            ".car-card, .vehicle-card"
        );


    cards.forEach(
        function (card) {

            card.addEventListener(
                "mouseenter",
                function () {

                    card.classList.add(
                        "card-active"
                    );

                }
            );


            card.addEventListener(
                "mouseleave",
                function () {

                    card.classList.remove(
                        "card-active"
                    );

                }
            );

        }
    );

}


/* =========================================================
   27. NOTIFICATION SYSTEM
   ========================================================= */

function showNotification(
    message,
    type = "info"
) {

    const existing =
        document.querySelector(
            ".chipicars-notification"
        );


    if (existing) {

        existing.remove();

    }


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        `chipicars-notification ${type}`;


    const icon =
        type === "success"
            ? "✓"
            : type === "warning"
                ? "!"
                : "i";


    notification.innerHTML = `

        <span class="notification-icon">
            ${icon}
        </span>

        <span class="notification-text">
            ${escapeHTML(message)}
        </span>

    `;


    document.body.appendChild(
        notification
    );


    requestAnimationFrame(
        function () {

            notification.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        function () {

            notification.classList.remove(
                "show"
            );


            setTimeout(
                function () {

                    notification.remove();

                },
                300
            );

        },
        3500
    );

}


/* =========================================================
   28. ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   29. GLOBAL FUNCTIONS
   ========================================================= */

window.addToComparison =
    addToComparison;


window.removeFromComparison =
    removeFromComparison;


window.clearComparison =
    clearComparison;


window.showNotification =
    showNotification;


/* =========================================================
   30. READY
   ========================================================= */

console.log(
    "🚘 ChipicarsKE is ready."
);

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderGaragePage();

        initializeGarageActions();

    }
);


/* =====================================================
   RENDER GARAGE
   ===================================================== */

function renderGaragePage() {

    const garageGrid =
        document.getElementById(
            "garageGrid"
        );

    const emptyGarage =
        document.getElementById(
            "garageEmpty"
        );

    const subtitle =
        document.getElementById(
            "garageSubtitle"
        );


    if (!garageGrid) return;


    const favourites =
        getStorage(
            CHIPICARSKE.storage.favourites
        );


    garageGrid.innerHTML = "";


    if (
        favourites.length === 0
    ) {

        emptyGarage.style.display =
            "flex";

        subtitle.textContent =
            "You haven't saved any vehicles yet.";

        return;

    }


    emptyGarage.style.display =
        "none";


    subtitle.textContent =
        `${favourites.length} vehicle${favourites.length === 1 ? "" : "s"} saved in your garage.`;


    favourites.forEach(
        function (vehicle) {

            const card =
                createGarageCard(
                    vehicle
                );


            garageGrid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   CREATE GARAGE CARD
   ===================================================== */

function createGarageCard(
    vehicle
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "garage-car-card";


    card.innerHTML = `

        <div class="garage-car-image">

            <img
                src="${escapeHTML(vehicle.image)}"
                alt="${escapeHTML(vehicle.name)}"
                loading="lazy"
            >

            <button
                type="button"
                class="garage-remove-button"
                aria-label="Remove ${escapeHTML(vehicle.name)}"
            >
                ♥
            </button>

        </div>


        <div class="garage-car-info">

            <span class="garage-location">
                📍 ${escapeHTML(vehicle.location)}
            </span>

            <h3>
                ${escapeHTML(vehicle.name)}
            </h3>

            <p class="garage-specs">

                ${escapeHTML(vehicle.year || "Year N/A")}

                ${vehicle.engine
                    ? ` • ${escapeHTML(vehicle.engine)}`
                    : ""
                }

                ${vehicle.fuel
                    ? ` • ${escapeHTML(vehicle.fuel)}`
                    : ""
                }

                ${vehicle.transmission
                    ? ` • ${escapeHTML(vehicle.transmission)}`
                    : ""
                }

            </p>


            <div class="garage-card-bottom">

                <strong>
                    ${formatPrice(vehicle.price)}
                </strong>

                <button
                    type="button"
                    class="garage-compare-button"
                >
                    ⇄ Compare
                </button>

            </div>

        </div>

    `;


    /* =================================================
       REMOVE BUTTON
       ================================================= */

    const removeButton =
        card.querySelector(
            ".garage-remove-button"
        );


    removeButton.addEventListener(
        "click",
        function () {

            removeFavouriteFromGarage(
                vehicle.id
            );

        }
    );


    /* =================================================
       COMPARE BUTTON
       ================================================= */

    const compareButton =
        card.querySelector(
            ".garage-compare-button"
        );


    compareButton.addEventListener(
        "click",
        function () {

            addToComparison(
                vehicle
            );

        }
    );


    return card;

}


/* =====================================================
   REMOVE FAVOURITE
   ===================================================== */

function removeFavouriteFromGarage(
    vehicleId
) {

    let favourites =
        getStorage(
            CHIPICARSKE.storage.favourites
        );


    const vehicle =
        favourites.find(
            function (item) {

                return (
                    item.id ===
                    vehicleId
                );

            }
        );


    favourites =
        favourites.filter(
            function (item) {

                return (
                    item.id !==
                    vehicleId
                );

            }
        );


    saveStorage(
        CHIPICARSKE.storage.favourites,
        favourites
    );


    updateFavouriteCount();


    renderGaragePage();


    showNotification(
        vehicle
            ? `${vehicle.name} removed from your garage.`
            : "Vehicle removed from your garage.",
        "info"
    );

}


/* =====================================================
   CLEAR GARAGE
   ===================================================== */

function initializeGarageActions() {

    const clearButton =
        document.getElementById(
            "clearGarageButton"
        );


    if (!clearButton) return;


    clearButton.addEventListener(
        "click",
        function () {

            const favourites =
                getStorage(
                    CHIPICARSKE.storage.favourites
                );


            if (
                favourites.length === 0
            ) {

                showNotification(
                    "Your garage is already empty.",
                    "info"
                );

                return;

            }


            const confirmed =
                confirm(
                    "Are you sure you want to remove all saved vehicles?"
                );


            if (!confirmed) return;


            saveStorage(
                CHIPICARSKE.storage.favourites,
                []
            );


            updateFavouriteCount();


            renderGaragePage();


            showNotification(
                "Your garage has been cleared.",
                "success"
            );

        }
    );

}


/* =====================================================
   PRICE FORMATTER
   ===================================================== */

function formatPrice(
    price
) {

    const amount =
        Number(price) || 0;


    if (
        amount >= 1000000
    ) {

        return (
            "KSh " +
            (amount / 1000000)
                .toFixed(1)
                .replace(
                    ".0",
                    ""
                ) +
            "M"
        );

    }


    if (
        amount >= 1000
    ) {

        return (
            "KSh " +
            Math.round(
                amount / 1000
            ) +
            "K"
        );

    }


    return (
        "KSh " +
        amount.toLocaleString()
    );

}
 /*=====================================================
     SELL PAGE JAVASCRIPT
     ===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {

        populateYears();

        setupSellPreview();

        setupSellForm();

    }
);


/* =====================================================
   YEAR DROPDOWN
   ===================================================== */

function populateYears() {

    const yearSelect =
        document.getElementById(
            "sellYear"
        );

    const currentYear =
        new Date().getFullYear();


    for (
        let year = currentYear;
        year >= 1990;
        year--
    ) {

        const option =
            document.createElement(
                "option"
            );

        option.value = year;

        option.textContent = year;

        yearSelect.appendChild(
            option
        );

    }

}


/* =====================================================
   LIVE LISTING PREVIEW
   ===================================================== */

function setupSellPreview() {

    const fields = {

        make:
            document.getElementById(
                "sellMake"
            ),

        model:
            document.getElementById(
                "sellModel"
            ),

        year:
            document.getElementById(
                "sellYear"
            ),

        engine:
            document.getElementById(
                "sellEngine"
            ),

        fuel:
            document.getElementById(
                "sellFuel"
            ),

        transmission:
            document.getElementById(
                "sellTransmission"
            ),

        location:
            document.getElementById(
                "sellLocation"
            ),

        price:
            document.getElementById(
                "sellPrice"
            ),

        image:
            document.getElementById(
                "sellImage"
            )

    };


    Object.values(fields).forEach(
        function (field) {

            field.addEventListener(
                "input",
                updatePreview
            );

            field.addEventListener(
                "change",
                updatePreview
            );

        }
    );


    updatePreview();

}


/* =====================================================
   UPDATE PREVIEW
   ===================================================== */

function updatePreview() {

    const make =
        document.getElementById(
            "sellMake"
        ).value;

    const model =
        document.getElementById(
            "sellModel"
        ).value;

    const year =
        document.getElementById(
            "sellYear"
        ).value;

    const engine =
        document.getElementById(
            "sellEngine"
        ).value;

    const fuel =
        document.getElementById(
            "sellFuel"
        ).value;

    const transmission =
        document.getElementById(
            "sellTransmission"
        ).value;

    const location =
        document.getElementById(
            "sellLocation"
        ).value;

    const price =
        document.getElementById(
            "sellPrice"
        ).value;

    const image =
        document.getElementById(
            "sellImage"
        ).value;


    const previewName =
        document.getElementById(
            "previewName"
        );

    const previewSpecs =
        document.getElementById(
            "previewSpecs"
        );

    const previewLocation =
        document.getElementById(
            "previewLocation"
        );

    const previewPrice =
        document.getElementById(
            "previewPrice"
        );

    const previewImage =
        document.getElementById(
            "previewImage"
        );


    previewName.textContent =
        make && model
            ? `${make} ${model}`
            : "Your Vehicle";


    previewSpecs.textContent =
        [
            year,
            engine,
            fuel,
            transmission
        ]
        .filter(Boolean)
        .join(" • ")
        ||
        "Year • Engine • Fuel • Transmission";


    previewLocation.textContent =
        location
            ? `📍 ${location}`
            : "📍 Location";


    previewPrice.textContent =
        price
            ? formatSellPrice(price)
            : "KSh 0";


    if (image) {

        previewImage.src =
            image;

    } else {

        previewImage.removeAttribute(
            "src"
        );

    }

}


/* =====================================================
   PRICE FORMAT
   ===================================================== */

function formatSellPrice(
    value
) {

    const number =
        Number(value);


    if (
        number >= 1000000
    ) {

        return (
            "KSh " +
            (number / 1000000)
                .toFixed(1)
                .replace(
                    ".0",
                    ""
                ) +
            "M"
        );

    }


    return (
        "KSh " +
        number.toLocaleString()
    );

}


/* =====================================================
   FORM SUBMISSION
   ===================================================== */

function setupSellForm() {

    const form =
        document.getElementById(
            "sellCarForm"
        );


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const listing = {

                id:
                    "listing-" +
                    Date.now(),

                make:
                    document.getElementById(
                        "sellMake"
                    ).value,

                model:
                    document.getElementById(
                        "sellModel"
                    ).value,

                year:
                    document.getElementById(
                        "sellYear"
                    ).value,

                mileage:
                    document.getElementById(
                        "sellMileage"
                    ).value,

                engine:
                    document.getElementById(
                        "sellEngine"
                    ).value,

                fuel:
                    document.getElementById(
                        "sellFuel"
                    ).value,

                transmission:
                    document.getElementById(
                        "sellTransmission"
                    ).value,

                drive:
                    document.getElementById(
                        "sellDrive"
                    ).value,

                price:
                    document.getElementById(
                        "sellPrice"
                    ).value,

                location:
                    document.getElementById(
                        "sellLocation"
                    ).value,

                description:
                    document.getElementById(
                        "sellDescription"
                    ).value,

                image:
                    document.getElementById(
                        "sellImage"
                    ).value,

                seller:
                    {
                        name:
                            document.getElementById(
                                "sellerName"
                            ).value,

                        phone:
                            document.getElementById(
                                "sellerPhone"
                            ).value,

                        email:
                            document.getElementById(
                                "sellerEmail"
                            ).value
                    },

                createdAt:
                    new Date().toISOString()

            };


            saveListing(
                listing
            );


            const message =
                document.getElementById(
                    "sellMessage"
                );


            message.className =
                "sell-message success";


            message.textContent =
                "✓ Your vehicle listing has been created successfully!";


            form.reset();


            updatePreview();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =====================================================
   SAVE LISTING
   ===================================================== */

function saveListing(
    listing
) {

    const listings =
        JSON.parse(
            localStorage.getItem(
                "chipicarskeListings"
            )
        ) || [];


    listings.push(
        listing
    );


    localStorage.setItem(
        "chipicarskeListings",
        JSON.stringify(
            listings
        )
    );

}


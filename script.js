
/* =========================================================

CONFIGURATION
========================================================= */

const CHIPICARSKE = {

storage: {
    favourites: "chipicarskeFavourites",
    comparison: "chipicarskeComparison",
    motorcycleComparison: "chipicarskeMotorcycleComparison",
    listings: "chipicarskeListings",
    messages: "chipicarskeContactMessages"
},

comparisonLimit: 3,

selectors: {
    vehicleCards: ".car-card, .vehicle-card"
}

};

/* =========================================================
2. APPLICATION START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

console.log("🚗 ChipicarsKE application started.");

initializeFavourites();
initializeSearch();
initializeSorting();
initializeComparisonButtons();
initializeNavigation();

initializeContactForm();
initializeContactPage();

initializeScrollEffects();
initializeAnimatedStats();

initializeGarage();
initializeGarageActions();

initializeHeroEffects();
initializeCardEffects();

initializeSellPage();

updateFavouriteCount();
updateComparisonCount();

console.log("🚘 ChipicarsKE is ready.");

});

/* =========================================================
3. LOCAL STORAGE
========================================================= */

function getStorage(key) {

try {

    const stored = localStorage.getItem(key);

    if (!stored) {
        return [];
    }

    const data = JSON.parse(stored);

    return Array.isArray(data) ? data : [];

} catch (error) {

    console.error("ChipicarsKE storage error:", error);

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
        "ChipicarsKE could not save data:",
        error
    );

}

}

/* =========================================================
4. VEHICLE DATA
========================================================= */

function getVehicleFromCard(card) {

if (!card) {
    return null;
}

const image = card.querySelector("img");
const title = card.querySelector("h3");

const details = card.querySelectorAll(
    ".car-info p, .vehicle-info p"
);

const price =
    card.dataset.price ||
    extractNumber(
        card.querySelector(".car-price, .vehicle-price")
            ?.textContent
    );

let year = "";
let engine = "";
let fuel = "";
let transmission = "";

const detailText = Array.from(details)
    .map(item => item.textContent.trim())
    .join(" ");

const yearMatch = detailText.match(
    /\b(19|20)\d{2}\b/
);

const engineMatch = detailText.match(
    /\b\d+(?:\.\d+)?\s*L\b/i
);

const fuelMatch = detailText.match(
    /\b(Petrol|Diesel|Hybrid|Electric)\b/i
);

const transmissionMatch = detailText.match(
    /\b(Automatic|Manual|CVT|DCT)\b/i
);

if (yearMatch) {
    year = yearMatch[0];
}

if (engineMatch) {
    engine = engineMatch[0];
}

if (fuelMatch) {
    fuel = fuelMatch[0];
}

if (transmissionMatch) {
    transmission = transmissionMatch[0];
}

const name =
    title?.textContent.trim() ||
    "Unknown Vehicle";

return {

    id:
        card.dataset.id ||
        createVehicleId(
            name,
            card.dataset.location,
            card.dataset.price
        ),

    name,

    make:
        card.dataset.make ||
        "",

    model:
        card.dataset.model ||
        "",

    price:
        Number(price) || 0,

    location:
        card.dataset.location ||
        "",

    year,

    engine,

    fuel,

    transmission,

    image:
        image?.src ||
        "",

    type:
        card.dataset.type ||
        "car"

};

}

/* =========================================================
5. CREATE VEHICLE ID
========================================================= */

function createVehicleId(
name = "",
location = "",
price = ""
) {

return `${name}-${location}-${price}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}

/* =========================================================
6. NUMBER EXTRACTION
========================================================= */

function extractNumber(value) {

if (!value) {
    return 0;
}

const number = String(value)
    .replace(/,/g, "")
    .replace(/[^0-9.]/g, "");

return Number(number) || 0;

}

/* =========================================================
7. FAVOURITES
========================================================= */

function initializeFavourites() {

const buttons = document.querySelectorAll(
    ".card-favourite, .vehicle-favourite"
);

const favourites = getStorage(
    CHIPICARSKE.storage.favourites
);

buttons.forEach(button => {

    const card = button.closest(
        ".car-card, .vehicle-card"
    );

    if (!card) {
        return;
    }

    const vehicle = getVehicleFromCard(card);

    if (!vehicle) {
        return;
    }

    const exists = favourites.some(
        item => item.id === vehicle.id
    );

    updateFavouriteButton(
        button,
        exists
    );

    if (button.dataset.favouriteInitialized) {
        return;
    }

    button.dataset.favouriteInitialized = "true";

    button.addEventListener("click", event => {

        event.preventDefault();
        event.stopPropagation();

        toggleFavourite(
            vehicle,
            button
        );

    });

});

}

/* =========================================================
8. TOGGLE FAVOURITE
========================================================= */

function toggleFavourite(
vehicle,
button
) {

let favourites = getStorage(
    CHIPICARSKE.storage.favourites
);

const index = favourites.findIndex(
    item => item.id === vehicle.id
);

if (index >= 0) {

    favourites.splice(index, 1);

    updateFavouriteButton(
        button,
        false
    );

    showNotification(
        `${vehicle.name} removed from your garage.`,
        "info"
    );

} else {

    favourites.push(vehicle);

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

if (!button) {
    return;
}

button.textContent =
    active ? "♥" : "♡";

button.classList.toggle(
    "active",
    active
);

button.setAttribute(
    "aria-pressed",
    String(active)
);

button.setAttribute(
    "title",
    active
        ? "Remove from favourites"
        : "Add to favourites"
);

}

/* =========================================================
10. FAVOURITE COUNTER
========================================================= */

function updateFavouriteCount() {

const counter = document.getElementById(
    "favoriteCount"
);

if (!counter) {
    return;
}

const favourites = getStorage(
    CHIPICARSKE.storage.favourites
);

counter.textContent = favourites.length;

}

/* =========================================================
11. SEARCH
========================================================= */

function initializeSearch() {

const searchButton = document.getElementById(
    "searchButton"
);

if (!searchButton) {
    return;
}

if (searchButton.dataset.searchInitialized) {
    return;
}

searchButton.dataset.searchInitialized = "true";

searchButton.addEventListener("click", () => {

    const make =
        document.getElementById("make")
            ?.value.trim()
            .toLowerCase() || "";

    const model =
        document.getElementById("model")
            ?.value.trim()
            .toLowerCase() || "";

    const price =
        document.getElementById("price")
            ?.value || "";

    const location =
        document.getElementById("location")
            ?.value.trim()
            .toLowerCase() || "";

    const cards = document.querySelectorAll(
        ".car-card"
    );

    let visibleCars = 0;

    cards.forEach(card => {

        const cardMake =
            (card.dataset.make || "")
                .toLowerCase();

        const cardModel =
            (card.dataset.model || "")
                .toLowerCase();

        const cardLocation =
            (card.dataset.location || "")
                .toLowerCase();

        const cardPrice =
            Number(card.dataset.price || 0);

        let visible = true;

        /* Make */

        if (
            make &&
            !cardMake.includes(make)
        ) {
            visible = false;
        }

        /* Model */

        if (
            model &&
            !cardModel.includes(model)
        ) {
            visible = false;
        }

        /* Price */

        if (
            price &&
            cardPrice > Number(price)
        ) {
            visible = false;
        }

        /* Location */

        if (
            location &&
            !cardLocation.includes(location)
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

});

}

/* =========================================================
12. SORTING
========================================================= */

function initializeSorting() {

const sort = document.getElementById(
    "sortVehicles"
);

const grid = document.getElementById(
    "vehicleGrid"
);

if (!sort || !grid) {
    return;
}

if (sort.dataset.sortInitialized) {
    return;
}

sort.dataset.sortInitialized = "true";

sort.addEventListener("change", () => {

    const cards = Array.from(
        grid.querySelectorAll(
            ".vehicle-card, .car-card"
        )
    );

    cards.sort((a, b) => {

        const priceA =
            Number(a.dataset.price || 0);

        const priceB =
            Number(b.dataset.price || 0);

        const yearA =
            Number(a.dataset.year || 0);

        const yearB =
            Number(b.dataset.year || 0);

        switch (sort.value) {

            case "low":
                return priceA - priceB;

            case "high":
                return priceB - priceA;

            case "newest":
                return yearB - yearA;

            case "oldest":
                return yearA - yearB;

            default:
                return 0;

        }

    });

    cards.forEach(card => {
        grid.appendChild(card);
    });

});

}

/* =========================================================
13. COMPARE BUTTONS
========================================================= */

function initializeComparisonButtons() {

const cards = document.querySelectorAll(
    CHIPICARSKE.selectors.vehicleCards
);

cards.forEach(card => {

    const info = card.querySelector(
        ".car-info, .vehicle-info"
    );

    if (!info) {
        return;
    }

    if (
        info.querySelector(".compare-button")
    ) {
        return;
    }

    const vehicle = getVehicleFromCard(card);

    if (!vehicle) {
        return;
    }

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "compare-button";

    button.innerHTML =
        "⇄ Compare";

    button.setAttribute(
        "aria-label",
        `Compare ${vehicle.name}`
    );

    button.addEventListener(
        "click",
        () => {
            addToComparison(vehicle);
        }
    );

    info.appendChild(button);

});

}

/* =========================================================
14. ADD TO COMPARISON
========================================================= */

function addToComparison(vehicle) {

if (!vehicle) {
    return;
}

let comparison = getStorage(
    CHIPICARSKE.storage.comparison
);

const exists = comparison.some(
    item => item.id === vehicle.id
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

comparison.push(vehicle);

saveStorage(
    CHIPICARSKE.storage.comparison,
    comparison
);

updateComparisonCount();

showNotification(
    `${vehicle.name} added to comparison.`,
    "success"
);

}

/* =========================================================
15. COMPARISON COUNT
========================================================= */

function updateComparisonCount() {

const comparison = getStorage(
    CHIPICARSKE.storage.comparison
);

const counters = document.querySelectorAll(
    "#comparisonCount"
);

counters.forEach(counter => {

    counter.textContent =
        comparison.length;

});

}

/* =========================================================
16. REMOVE COMPARISON
========================================================= */

function removeFromComparison(vehicleId) {

let comparison = getStorage(
    CHIPICARSKE.storage.comparison
);

comparison = comparison.filter(
    vehicle => vehicle.id !== vehicleId
);

saveStorage(
    CHIPICARSKE.storage.comparison,
    comparison
);

updateComparisonCount();

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

if (
    document.getElementById("garageGrid")
) {
    renderGaragePage();
}

}

/* =========================================================
19. GARAGE PREVIEW
========================================================= */

function updateGaragePreview() {

const garage =
    document.querySelector(
        ".garage-preview"
    );

if (!garage) {
    return;
}

const favourites = getStorage(
    CHIPICARSKE.storage.favourites
);

if (favourites.length === 0) {

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
    .getElementById("viewGarageButton")
    ?.addEventListener("click", () => {

        window.location.href =
            "garage.html";

    });

}

/* =========================================================
20. GARAGE PAGE
========================================================= */

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

if (!garageGrid) {
    return;
}

const favourites = getStorage(
    CHIPICARSKE.storage.favourites
);

garageGrid.innerHTML = "";

if (favourites.length === 0) {

    if (emptyGarage) {
        emptyGarage.style.display = "flex";
    }

    if (subtitle) {
        subtitle.textContent =
            "You haven't saved any vehicles yet.";
    }

    return;
}

if (emptyGarage) {
    emptyGarage.style.display = "none";
}

if (subtitle) {

    subtitle.textContent =
        `${favourites.length} vehicle${favourites.length === 1 ? "" : "s"} saved in your garage.`;

}

favourites.forEach(vehicle => {

    const card =
        createGarageCard(vehicle);

    garageGrid.appendChild(card);

});

}

/* =========================================================
21. CREATE GARAGE CARD
========================================================= */

function createGarageCard(vehicle) {

const card =
    document.createElement("article");

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
            📍 ${escapeHTML(vehicle.location || "Kenya")}
        </span>

        <h3>
            ${escapeHTML(vehicle.name)}
        </h3>

        <p class="garage-specs">

            ${escapeHTML(vehicle.year || "Year N/A")}

            ${
                vehicle.engine
                    ? ` • ${escapeHTML(vehicle.engine)}`
                    : ""
            }

            ${
                vehicle.fuel
                    ? ` • ${escapeHTML(vehicle.fuel)}`
                    : ""
            }

            ${
                vehicle.transmission
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

const removeButton =
    card.querySelector(
        ".garage-remove-button"
    );

removeButton.addEventListener(
    "click",
    () => {

        removeFavouriteFromGarage(
            vehicle.id
        );

    }
);

const compareButton =
    card.querySelector(
        ".garage-compare-button"
    );

compareButton.addEventListener(
    "click",
    () => {

        addToComparison(vehicle);

    }
);

return card;

}

/* =========================================================
22. REMOVE FAVOURITE FROM GARAGE
========================================================= */

function removeFavouriteFromGarage(
vehicleId
) {

let favourites = getStorage(
    CHIPICARSKE.storage.favourites
);

const vehicle = favourites.find(
    item => item.id === vehicleId
);

favourites = favourites.filter(
    item => item.id !== vehicleId
);

saveStorage(
    CHIPICARSKE.storage.favourites,
    favourites
);

updateFavouriteCount();
updateGaragePreview();
renderGaragePage();

showNotification(
    vehicle
        ? `${vehicle.name} removed from your garage.`
        : "Vehicle removed from your garage.",
    "info"
);

}

/* =========================================================
23. CLEAR GARAGE
========================================================= */

function initializeGarageActions() {

const clearButton =
    document.getElementById(
        "clearGarageButton"
    );

if (!clearButton) {
    return;
}

if (clearButton.dataset.initialized) {
    return;
}

clearButton.dataset.initialized = "true";

clearButton.addEventListener(
    "click",
    () => {

        const favourites = getStorage(
            CHIPICARSKE.storage.favourites
        );

        if (favourites.length === 0) {

            showNotification(
                "Your garage is already empty.",
                "info"
            );

            return;
        }

        const confirmed = confirm(
            "Are you sure you want to remove all saved vehicles?"
        );

        if (!confirmed) {
            return;
        }

        saveStorage(
            CHIPICARSKE.storage.favourites,
            []
        );

        updateFavouriteCount();
        updateGaragePreview();
        renderGaragePage();

        showNotification(
            "Your garage has been cleared.",
            "success"
        );

    }
);

}

/* =========================================================
24. PRICE FORMATTER
========================================================= */

function formatPrice(price) {

const amount =
    Number(price) || 0;

if (amount >= 1000000) {

    return (
        "KSh " +
        (amount / 1000000)
            .toFixed(1)
            .replace(".0", "") +
        "M"
    );

}

if (amount >= 1000) {

    return (
        "KSh " +
        Math.round(amount / 1000) +
        "K"
    );

}

return (
    "KSh " +
    amount.toLocaleString()
);

}

/* =========================================================
25. NAVIGATION
========================================================= */

function initializeNavigation() {

/* Browse Cars */

document
    .querySelectorAll(
        ".hero .primary-button"
    )
    .forEach(button => {

        if (
            button.dataset.navigationInitialized
        ) {
            return;
        }

        if (
            button.textContent
                .toLowerCase()
                .includes("browse")
        ) {

            button.dataset.navigationInitialized =
                "true";

            button.addEventListener(
                "click",
                event => {

                    const browse =
                        document.getElementById(
                            "browse"
                        );

                    if (browse) {

                        event.preventDefault();

                        browse.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }
            );

        }

    });


/* Hero Sell Button */

document
    .querySelectorAll(
        ".hero .secondary-button"
    )
    .forEach(button => {

        if (
            button.dataset.navigationInitialized
        ) {
            return;
        }

        button.dataset.navigationInitialized =
            "true";

        button.addEventListener(
            "click",
            event => {

                const sell =
                    document.getElementById(
                        "sell"
                    );

                if (sell) {

                    event.preventDefault();

                    sell.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });


/* Sell My Car */

document
    .querySelectorAll(".sell-button")
    .forEach(button => {

        if (
            button.dataset.navigationInitialized
        ) {
            return;
        }

        button.dataset.navigationInitialized =
            "true";

        button.addEventListener(
            "click",
            event => {

                const sell =
                    document.getElementById(
                        "sell"
                    );

                if (sell) {

                    event.preventDefault();

                    sell.scrollIntoView({
                        behavior: "smooth"
                    });

                } else {

                    window.location.href =
                        "sell.html";

                }

            }
        );

    });


/* Favourite Navigation */

const favouriteButton =
    document.querySelector(
        ".favourite-button"
    );

if (favouriteButton) {

    favouriteButton.addEventListener(
        "click",
        () => {

            const garage =
                document.getElementById(
                    "garage"
                );

            if (garage) {

                garage.scrollIntoView({
                    behavior: "smooth"
                });

            } else {

                window.location.href =
                    "garage.html";

            }

        }
    );

}


/* Compare Navigation */

document
    .querySelectorAll(
        ".Feature-selection .primary-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                window.location.href =
                    "compare.html";

            }
        );

    });

}

/* =========================================================
26. CONTACT FORM
========================================================= */

function initializeContactForm() {

const form =
    document.getElementById(
        "contactForm"
    );

if (!form) {
    return;
}

if (form.dataset.initialized) {
    return;
}

form.dataset.initialized = "true";

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name =
            document.getElementById(
                "name"
            )?.value.trim() || "";

        const email =
            document.getElementById(
                "email"
            )?.value.trim() || "";

        const subject =
            document.getElementById(
                "subject"
            )?.value.trim() || "";

        const message =
            document.getElementById(
                "message"
            )?.value.trim() || "";

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

        if (!isValidEmail(email)) {

            showNotification(
                "Please enter a valid email address.",
                "warning"
            );

            return;
        }

        const contactMessage = {

            id:
                "message-" +
                Date.now(),

            name,

            email,

            subject,

            message,

            createdAt:
                new Date().toISOString()

        };

        const messages =
            getStorage(
                CHIPICARSKE.storage.messages
            );

        messages.push(
            contactMessage
        );

        saveStorage(
            CHIPICARSKE.storage.messages,
            messages
        );

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
27. CONTACT PAGE
========================================================= */

function initializeContactPage() {

const form =
    document.getElementById(
        "contactForm"
    );

const message =
    document.getElementById(
        "contactMessage"
    );

const counter =
    document.getElementById(
        "messageCounter"
    );

const formMessage =
    document.getElementById(
        "contactFormMessage"
    );

if (!form || !message) {
    return;
}

/* Message Counter */

if (counter) {

    const updateCounter = () => {

        counter.textContent =
            `${message.value.length} / 500 characters`;

    };

    message.addEventListener(
        "input",
        updateCounter
    );

    updateCounter();

}

/* Dedicated Contact Form */

if (
    form.dataset.contactPageInitialized
) {
    return;
}

form.dataset.contactPageInitialized =
    "true";

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const name =
            document.getElementById(
                "contactName"
            )?.value.trim() || "";

        const email =
            document.getElementById(
                "contactEmail"
            )?.value.trim() || "";

        const phone =
            document.getElementById(
                "contactPhone"
            )?.value.trim() || "";

        const subject =
            document.getElementById(
                "contactSubject"
            )?.value.trim() || "";

        const messageText =
            message.value.trim();

        if (
            !name ||
            !email ||
            !subject ||
            !messageText
        ) {

            showContactMessage(
                "Please complete all required fields.",
                "error"
            );

            return;
        }

        if (!isValidEmail(email)) {

            showContactMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }

        if (
            messageText.length < 10
        ) {

            showContactMessage(
                "Please provide a little more detail in your message.",
                "error"
            );

            return;
        }

        const contactMessage = {

            id:
                "message-" +
                Date.now(),

            name,

            email,

            phone,

            subject,

            message:
                messageText,

            createdAt:
                new Date().toISOString()

        };

        const savedMessages =
            getStorage(
                CHIPICARSKE.storage.messages
            );

        savedMessages.push(
            contactMessage
        );

        saveStorage(
            CHIPICARSKE.storage.messages,
            savedMessages
        );

        showContactMessage(
            `✓ Thanks ${name}! Your message has been received. We'll get back to you soon.`,
            "success"
        );

        form.reset();

        if (counter) {
            counter.textContent =
                "0 / 500 characters";
        }

        showNotification(
            "Message sent successfully!",
            "success"
        );

    }
);

}

/* =========================================================
28. CONTACT MESSAGE DISPLAY
========================================================= */

function showContactMessage(
text,
type
) {

const formMessage =
    document.getElementById(
        "contactFormMessage"
    );

if (!formMessage) {
    return;
}

formMessage.textContent =
    text;

formMessage.className =
    `contact-form-message ${type}`;

formMessage.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
});

}

/* =========================================================
29. EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

}

/* =========================================================
30. SCROLL REVEAL
========================================================= */

function initializeScrollEffects() {

const elements =
    document.querySelectorAll(
        `
        .car-card,
        .vehicle-card,
        .benefit-card,
        .brands span,
        .stats > div,
        .garage-preview,
        .contact-container > div
        `
    );

if (!elements.length) {
    return;
}

elements.forEach(element => {

    element.classList.add(
        "scroll-reveal"
    );

});

if (
    !("IntersectionObserver" in window)
) {

    elements.forEach(element => {
        element.classList.add("visible");
    });

    return;
}

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

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

            });

        },
        {
            threshold: 0.12
        }
    );

elements.forEach(element => {

    observer.observe(element);

});

}

/* =========================================================
31. ANIMATED STATISTICS
========================================================= */

function initializeAnimatedStats() {

const stats =
    document.querySelectorAll(
        ".stats h2"
    );

if (!stats.length) {
    return;
}

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    !entry.isIntersecting
                ) {
                    return;
                }

                const element =
                    entry.target;

                if (
                    element.dataset.animated
                ) {
                    return;
                }

                const original =
                    element.textContent.trim();

                const match =
                    original.match(
                        /[\d,]+/
                    );

                if (!match) {
                    return;
                }

                const target =
                    Number(
                        match[0]
                            .replace(/,/g, "")
                    );

                element.dataset.animated =
                    "true";

                animateNumber(
                    element,
                    target,
                    original.includes("+")
                );

                observer.unobserve(
                    element
                );

            });

        },
        {
            threshold: 0.5
        }
    );

stats.forEach(stat => {

    observer.observe(stat);

});

}

/* =========================================================
32. NUMBER ANIMATION
========================================================= */

function animateNumber(
element,
target,
plus = false
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

    if (progress < 1) {

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
33. HERO EFFECTS
========================================================= */

function initializeHeroEffects() {

const hero =
    document.querySelector(
        ".hero"
    );

const heroCar =
    document.querySelector(
        ".hero-car img"
    );

if (!hero || !heroCar) {
    return;
}

/* Hover */

heroCar.addEventListener(
    "mouseenter",
    () => {

        heroCar.classList.add(
            "hero-car-active"
        );

    }
);

heroCar.addEventListener(
    "mouseleave",
    () => {

        heroCar.classList.remove(
            "hero-car-active"
        );

    }
);


/* Mouse Movement */

hero.addEventListener(
    "mousemove",
    event => {

        const rect =
            hero.getBoundingClientRect();

        const x =
            (event.clientX -
                rect.left) /
                rect.width -
            0.5;

        const y =
            (event.clientY -
                rect.top) /
                rect.height -
            0.5;

        heroCar.style.transform =
            `translate(${x * 10}px, ${y * 10}px)`;

    }
);


hero.addEventListener(
    "mouseleave",
    () => {

        heroCar.style.transform =
            "";

    }
);

}

/* =========================================================
34. VEHICLE CARD EFFECTS
========================================================= */

function initializeCardEffects() {

const cards =
    document.querySelectorAll(
        CHIPICARSKE.selectors.vehicleCards
    );

cards.forEach(card => {

    card.addEventListener(
        "mouseenter",
        () => {

            card.classList.add(
                "card-active"
            );

        }
    );

    card.addEventListener(
        "mouseleave",
        () => {

            card.classList.remove(
                "card-active"
            );

        }
    );

});

}

/* =========================================================
35. NOTIFICATION SYSTEM
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
    document.createElement("div");

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

    <button
        type="button"
        class="notification-close"
        aria-label="Close notification"
    >
        ×
    </button>

`;

document.body.appendChild(
    notification
);

requestAnimationFrame(() => {

    notification.classList.add(
        "show"
    );

});

const closeButton =
    notification.querySelector(
        ".notification-close"
    );

closeButton.addEventListener(
    "click",
    () => {

        removeNotification(
            notification
        );

    }
);

const timeout =
    setTimeout(
        () => {

            removeNotification(
                notification
            );

        },
        3500
    );

notification.dataset.timeout =
    timeout;

}

/* =========================================================
36. REMOVE NOTIFICATION
========================================================= */

function removeNotification(
notification
) {

if (!notification) {
    return;
}

notification.classList.remove(
    "show"
);

setTimeout(() => {

    if (notification) {
        notification.remove();
    }

}, 300);

}

/* =========================================================
37. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* =========================================================
38. SELL PAGE
========================================================= */

function initializeSellPage() {

const form =
    document.getElementById(
        "sellCarForm"
    );

if (!form) {
    return;
}

populateYears();
setupSellPreview();
setupSellForm();

}

/* =========================================================
39. YEAR DROPDOWN
========================================================= */

function populateYears() {

const yearSelect =
    document.getElementById(
        "sellYear"
    );

if (!yearSelect) {
    return;
}

if (yearSelect.options.length > 1) {
    return;
}

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

    option.value =
        year;

    option.textContent =
        year;

    yearSelect.appendChild(
        option
    );

}

}

/* =========================================================
40. SELL PREVIEW
========================================================= */

function setupSellPreview() {

const fields = [

    "sellMake",
    "sellModel",
    "sellYear",
    "sellEngine",
    "sellFuel",
    "sellTransmission",
    "sellLocation",
    "sellPrice",
    "sellImage"

];

const availableFields =
    fields
        .map(id =>
            document.getElementById(id)
        )
        .filter(Boolean);

if (!availableFields.length) {
    return;
}

availableFields.forEach(field => {

    field.addEventListener(
        "input",
        updatePreview
    );

    field.addEventListener(
        "change",
        updatePreview
    );

});

updatePreview();

}

/* =========================================================
41. UPDATE SELL PREVIEW
========================================================= */

function updatePreview() {

const make =
    document.getElementById(
        "sellMake"
    )?.value || "";

const model =
    document.getElementById(
        "sellModel"
    )?.value || "";

const year =
    document.getElementById(
        "sellYear"
    )?.value || "";

const engine =
    document.getElementById(
        "sellEngine"
    )?.value || "";

const fuel =
    document.getElementById(
        "sellFuel"
    )?.value || "";

const transmission =
    document.getElementById(
        "sellTransmission"
    )?.value || "";

const location =
    document.getElementById(
        "sellLocation"
    )?.value || "";

const price =
    document.getElementById(
        "sellPrice"
    )?.value || "";

const image =
    document.getElementById(
        "sellImage"
    )?.value || "";

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

if (previewName) {

    previewName.textContent =
        make && model
            ? `${make} ${model}`
            : "Your Vehicle";

}

if (previewSpecs) {

    previewSpecs.textContent =
        [
            year,
            engine,
            fuel,
            transmission
        ]
        .filter(Boolean)
        .join(" • ") ||
        "Year • Engine • Fuel • Transmission";

}

if (previewLocation) {

    previewLocation.textContent =
        location
            ? `📍 ${location}`
            : "📍 Location";

}

if (previewPrice) {

    previewPrice.textContent =
        price
            ? formatSellPrice(price)
            : "KSh 0";

}

if (previewImage) {

    if (image) {

        previewImage.src =
            image;

    } else {

        previewImage.removeAttribute(
            "src"
        );

    }

}

}

/* =========================================================
42. SELL PRICE FORMAT
========================================================= */

function formatSellPrice(value) {

const number =
    Number(value) || 0;

if (number >= 1000000) {

    return (
        "KSh " +
        (number / 1000000)
            .toFixed(1)
            .replace(".0", "") +
        "M"
    );

}

return (
    "KSh " +
    number.toLocaleString()
);

}

/* =========================================================
43. SELL FORM
========================================================= */

function setupSellForm() {

const form =
    document.getElementById(
        "sellCarForm"
    );

if (!form) {
    return;
}

if (form.dataset.initialized) {
    return;
}

form.dataset.initialized =
    "true";

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const getValue =
            id =>
                document.getElementById(
                    id
                )?.value.trim() || "";

        const listing = {

            id:
                "listing-" +
                Date.now(),

            make:
                getValue("sellMake"),

            model:
                getValue("sellModel"),

            year:
                getValue("sellYear"),

            mileage:
                getValue("sellMileage"),

            engine:
                getValue("sellEngine"),

            fuel:
                getValue("sellFuel"),

            transmission:
                getValue("sellTransmission"),

            drive:
                getValue("sellDrive"),

            price:
                Number(
                    getValue("sellPrice")
                ) || 0,

            location:
                getValue("sellLocation"),

            description:
                getValue("sellDescription"),

            image:
                getValue("sellImage"),

            seller: {

                name:
                    getValue("sellerName"),

                phone:
                    getValue("sellerPhone"),

                email:
                    getValue("sellerEmail")

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

        if (message) {

            message.className =
                "sell-message success";

            message.textContent =
                "✓ Your vehicle listing has been created successfully!";

        }

        showNotification(
            "Your vehicle listing has been created.",
            "success"
        );

        form.reset();

        updatePreview();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);

}

/* =========================================================
44. SAVE LISTING
========================================================= */

function saveListing(listing) {

const listings =
    getStorage(
        CHIPICARSKE.storage.listings
    );

listings.push(listing);

saveStorage(
    CHIPICARSKE.storage.listings,
    listings
);

}

/* =========================================================
45. GLOBAL FUNCTIONS
========================================================= */

window.addToComparison =
addToComparison;

window.removeFromComparison =
removeFromComparison;

window.clearComparison =
clearComparison;

window.showNotification =
showNotification;

window.toggleFavourite =
toggleFavourite;

window.removeFavouriteFromGarage =
removeFavouriteFromGarage;

window.renderGaragePage =
renderGaragePage;

window.formatPrice =
formatPrice;

/* =========================================================
END OF CHIPICARSKE MASTER JAVASCRIPT
========================================================= */

console.log(
"🚘 ChipicarsKE Master JavaScript loaded successfully."
);

// ============================================================
// CHIPICARSKE — COMPARISON PAGE
// ============================================================

function renderComparisonPage() {
    const comparisonTable = document.getElementById("comparisonTableWrapper");
    const motorcycleTable = document.getElementById("motorcycleComparisonTableWrapper");
    const emptyState = document.getElementById("comparisonEmpty");
    const selectors = document.getElementById("comparisonSelectors");

    // If we're not on compare.html, stop
    if (!comparisonTable && !motorcycleTable) {
        return;
    }

    const carComparison = getStorage(CHIPICARSKE.storage.comparison);
    const motorcycleComparison = getStorage(
        CHIPICARSKE.storage.motorcycleComparison
    );

    // --------------------------------------------------------
    // RESET EVERYTHING
    // --------------------------------------------------------

    document.querySelectorAll("[data-compare]").forEach(cell => {
        cell.textContent = "—";
    });

    document.querySelectorAll("[data-motorcycle-compare]").forEach(cell => {
        cell.textContent = "—";
    });

    for (let i = 0; i < 3; i++) {
        const carHeader = document.getElementById(`compareHeader${i}`);
        const bikeHeader = document.getElementById(`motorcycleHeader${i}`);

        if (carHeader) {
            carHeader.textContent = `Vehicle ${i + 1}`;
        }

        if (bikeHeader) {
            bikeHeader.textContent = `Motorcycle ${i + 1}`;
        }
    }

    // --------------------------------------------------------
    // RENDER CAR COMPARISON
    // --------------------------------------------------------

    if (carComparison.length > 0) {
        comparisonTable.style.display = "block";

        carComparison.slice(0, 3).forEach((vehicle, index) => {

            const values = {
                name:
                    vehicle.name ||
                    `${vehicle.make || ""} ${vehicle.model || ""}`.trim() ||
                    "Vehicle",

                price:
                    vehicle.price
                        ? formatPrice(vehicle.price)
                        : "—",

                year:
                    vehicle.year || "—",

                mileage:
                    vehicle.mileage || "—",

                engine:
                    vehicle.engine || "—",

                fuel:
                    vehicle.fuel || "—",

                transmission:
                    vehicle.transmission || "—",

                location:
                    vehicle.location || "—"
            };

            // Header
            const header = document.getElementById(`compareHeader${index}`);

            if (header) {
                header.innerHTML = `
                    <div class="compare-header-content">
                        <strong>${escapeHTML(values.name)}</strong>
                        <button
                            type="button"
                            class="compare-remove-button"
                            onclick="removeComparisonVehicle('${vehicle.id}', 'car')"
                        >
                            ×
                        </button>
                    </div>
                `;
            }

            // Table cells
            Object.keys(values).forEach(spec => {
                const cell = document.querySelector(
                    `[data-compare="${spec}"][data-slot="${index}"]`
                );

                if (cell) {
                    cell.textContent = values[spec];
                }
            });
        });
    } else {
        comparisonTable.style.display = "none";
    }

    // --------------------------------------------------------
    // RENDER MOTORCYCLE COMPARISON
    // --------------------------------------------------------

    if (motorcycleComparison.length > 0) {
        motorcycleTable.style.display = "block";

        motorcycleComparison.slice(0, 3).forEach((vehicle, index) => {

            const values = {
                name:
                    vehicle.name ||
                    `${vehicle.make || ""} ${vehicle.model || ""}`.trim() ||
                    "Motorcycle",

                price:
                    vehicle.price
                        ? formatPrice(vehicle.price)
                        : "—",

                year:
                    vehicle.year || "—",

                mileage:
                    vehicle.mileage || "—",

                engine:
                    vehicle.engine || "—",

                fuel:
                    vehicle.fuel || "—",

                transmission:
                    vehicle.transmission || "—",

                location:
                    vehicle.location || "—"
            };

            const header = document.getElementById(
                `motorcycleHeader${index}`
            );

            if (header) {
                header.innerHTML = `
                    <div class="compare-header-content">
                        <strong>${escapeHTML(values.name)}</strong>
                        <button
                            type="button"
                            class="compare-remove-button"
                            onclick="removeComparisonVehicle('${vehicle.id}', 'motorcycle')"
                        >
                            ×
                        </button>
                    </div>
                `;
            }

            Object.keys(values).forEach(spec => {
                const cell = document.querySelector(
                    `[data-motorcycle-compare="${spec}"][data-slot="${index}"]`
                );

                if (cell) {
                    cell.textContent = values[spec];
                }
            });
        });
    } else {
        motorcycleTable.style.display = "none";
    }

    // --------------------------------------------------------
    // EMPTY STATE
    // --------------------------------------------------------

    const hasCars = carComparison.length > 0;
    const hasMotorcycles = motorcycleComparison.length > 0;

    if (!hasCars && !hasMotorcycles) {
        if (emptyState) {
            emptyState.style.display = "block";
        }

        if (selectors) {
            selectors.style.display = "grid";
        }
    } else {
        if (emptyState) {
            emptyState.style.display = "none";
        }

        if (selectors) {
            selectors.style.display = "grid";
        }
    }
}


// ============================================================
// REMOVE ONE VEHICLE FROM COMPARISON
// ============================================================

function removeComparisonVehicle(vehicleId, type = "car") {

    const storageKey =
        type === "motorcycle"
            ? CHIPICARSKE.storage.motorcycleComparison
            : CHIPICARSKE.storage.comparison;

    let vehicles = getStorage(storageKey);

    vehicles = vehicles.filter(vehicle => {
        return String(vehicle.id) !== String(vehicleId);
    });

    saveStorage(storageKey, vehicles);

    renderComparisonPage();
    updateComparisonCount();

    showNotification("Vehicle removed from comparison", "success");
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}


// ============================================================
// INITIALIZE COMPARISON PAGE
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    if (
        document.getElementById("comparisonTableWrapper") ||
        document.getElementById("motorcycleComparisonTableWrapper")
    ) {
        renderComparisonPage();
    }

});
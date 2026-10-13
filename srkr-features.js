/* =========================================================
   SRKR GO — FEATURE SYSTEM
   STEP 1: Feature launcher + shared panel system
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       SAFETY
       ===================================================== */

    function ready(callback) {

        if (
            document.readyState ===
            "loading"
        ) {
            document.addEventListener(
                "DOMContentLoaded",
                callback
            );
        } else {
            callback();
        }

    }


    /* =====================================================
       FEATURE DEFINITIONS
       ===================================================== */

    const SRKR_FEATURES = [

        {
            id: "near-me",
            icon: "📍",
            label: "What's Near Me",
            title: "What's Near Me",
            subtitle:
                "Find useful places around your current location."
        },

        {
            id: "explore-campus",
            icon: "🧭",
            label: "Explore Campus",
            title: "Explore Campus",
            subtitle:
                "Browse SRKR by category and discover places."
        },

        {
            id: "block-info",
            icon: "🏢",
            label: "Block Info",
            title: "Block Information",
            subtitle:
                "View verified information about campus blocks."
        },

        {
            id: "find-classroom",
            icon: "🔎",
            label: "Find Classroom",
            title: "Find My Classroom",
            subtitle:
                "Search classrooms and rooms from the campus directory."
        },

        {
            id: "freshers",
            icon: "🎓",
            label: "Freshers Mode",
            title: "I'm New Here",
            subtitle:
                "A simple starting guide for new students."
        },

        {
            id: "favorites",
            icon: "⭐",
            label: "Favorites",
            title: "Favorites",
            subtitle:
                "Keep your frequently used places nearby."
        },

        {
            id: "recent",
            icon: "🕘",
            label: "Recent",
            title: "Recent Destinations",
            subtitle:
                "Quickly return to places you recently navigated to."
        },

        {
            id: "alerts",
            icon: "🚧",
            label: "Campus Alerts",
            title: "Campus Alerts",
            subtitle:
                "Important temporary campus information."
        },

        {
            id: "go-fan",
            icon: "📸",
            label: "GO FAN",
            title: "GO FAN",
            subtitle:
                "Share your SRKR campus moments."
        }

    ];


    /* =====================================================
       STATE
       ===================================================== */

    let activeFeatureId = null;

    let featureOverlay = null;
    let featurePanel = null;
    let featurePanelTitle = null;
    let featurePanelSubtitle = null;
    let featurePanelBody = null;


    /* =====================================================
       SMALL HELPERS
       ===================================================== */

    function escapeHTML(value) {

        return String(
            value === undefined ||
            value === null
                ? ""
                : value
        )
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


    function getFeatureById(id) {

        return SRKR_FEATURES.find(
            function (feature) {

                return (
                    feature.id === id
                );

            }
        );

    }


    /* =====================================================
       CREATE OVERLAY
       ===================================================== */

    function createFeatureOverlay() {

        if (
            document.getElementById(
                "srkrFeatureOverlay"
            )
        ) {

            featureOverlay =
                document.getElementById(
                    "srkrFeatureOverlay"
                );

            featurePanel =
                featureOverlay.querySelector(
                    ".srkr-feature-panel"
                );

            featurePanelTitle =
                document.getElementById(
                    "srkrFeaturePanelTitle"
                );

            featurePanelSubtitle =
                document.getElementById(
                    "srkrFeaturePanelSubtitle"
                );

            featurePanelBody =
                document.getElementById(
                    "srkrFeaturePanelBody"
                );

            return;

        }


        featureOverlay =
            document.createElement(
                "div"
            );

        featureOverlay.id =
            "srkrFeatureOverlay";

        featureOverlay.className =
            "srkr-feature-overlay";

        featureOverlay.setAttribute(
            "aria-hidden",
            "true"
        );


        featureOverlay.innerHTML = `

            <section
                class="srkr-feature-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="srkrFeaturePanelTitle"
            >

                <header
                    class="srkr-feature-panel-header"
                >

                    <div
                        class="srkr-feature-panel-title-wrap"
                    >

                        <h2
                            id="srkrFeaturePanelTitle"
                            class="srkr-feature-panel-title"
                        ></h2>

                        <p
                            id="srkrFeaturePanelSubtitle"
                            class="srkr-feature-panel-subtitle"
                        ></p>

                    </div>


                    <button
                        type="button"
                        class="srkr-feature-close"
                        id="srkrFeatureClose"
                        aria-label="Close"
                    >
                        ×
                    </button>

                </header>


                <div
                    id="srkrFeaturePanelBody"
                    class="srkr-feature-panel-body"
                ></div>

            </section>

        `;


        document.body.appendChild(
            featureOverlay
        );


        featurePanel =
            featureOverlay.querySelector(
                ".srkr-feature-panel"
            );

        featurePanelTitle =
            document.getElementById(
                "srkrFeaturePanelTitle"
            );

        featurePanelSubtitle =
            document.getElementById(
                "srkrFeaturePanelSubtitle"
            );

        featurePanelBody =
            document.getElementById(
                "srkrFeaturePanelBody"
            );


        document
            .getElementById(
                "srkrFeatureClose"
            )
            .addEventListener(
                "click",
                closeFeaturePanel
            );


        featureOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    featureOverlay
                ) {

                    closeFeaturePanel();

                }

            }
        );


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    activeFeatureId
                ) {

                    closeFeaturePanel();

                }

            }
        );

    }


    /* =====================================================
       OPEN PANEL
       ===================================================== */

    function openFeaturePanel(
        featureId
    ) {

        const feature =
            getFeatureById(
                featureId
            );

        if (!feature) {
            return;
        }


        createFeatureOverlay();


        activeFeatureId =
            featureId;


        featurePanelTitle.textContent =
            feature.icon +
            " " +
            feature.title;


        featurePanelSubtitle.textContent =
            feature.subtitle;


        featurePanelBody.innerHTML = "";


        renderFeatureContent(
            featureId
        );


        featureOverlay.classList.add(
            "is-open"
        );

        featureOverlay.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
    "srkr-feature-modal-open"
);

document.documentElement.classList.add(
    "srkr-feature-scroll-lock"
);

document.body.classList.add(
    "srkr-feature-scroll-lock"
);
    }


    /* =====================================================
       CLOSE PANEL
       ===================================================== */

    function closeFeaturePanel() {

        if (!featureOverlay) {
            return;
        }


        featureOverlay.classList.remove(
            "is-open"
        );

        featureOverlay.setAttribute(
            "aria-hidden",
            "true"
        );


        activeFeatureId = null;


        document.body.classList.remove(
    "srkr-feature-modal-open"
);

document.documentElement.classList.remove(
    "srkr-feature-scroll-lock"
);

document.body.classList.remove(
    "srkr-feature-scroll-lock"
);

    }


    /* =====================================================
       FEATURE CONTENT ROUTER
       ===================================================== */

    function renderFeatureContent(
        featureId
    ) {

        switch (featureId) {

            case "near-me":

                renderNearMe();

                break;


            case "explore-campus":

                renderExploreCampus();

                break;


            case "block-info":

                renderBlockInfo();

                break;


            case "find-classroom":

                renderFindClassroom();

                break;


            case "freshers":

                renderFreshersMode();

                break;


            case "favorites":

                renderFavorites();

                break;


            case "recent":

                renderRecent();

                break;


            case "alerts":

                renderCampusAlerts();

                break;


            case "go-fan":

                renderGoFan();

                break;


            default:

                featurePanelBody.innerHTML = `

                    <div
                        class="srkr-feature-empty"
                    >
                        This feature is not available yet.
                    </div>

                `;

        }

    }


    /* =====================================================
       TEMPORARY FEATURE PLACEHOLDERS
       ===================================================== */

   
function isNearMeGeofenceUnlocked() {
    try {
        return (
            typeof navigationGeofenceConfirmed !== "undefined" &&
            navigationGeofenceConfirmed === true &&
            typeof currentUserPosition !== "undefined" &&
            Array.isArray(currentUserPosition) &&
            currentUserPosition.length >= 2 &&
            Number.isFinite(currentUserPosition[0]) &&
            Number.isFinite(currentUserPosition[1]) &&
            typeof isInsideSRKR === "function" &&
            isInsideSRKR(
                currentUserPosition[0],
                currentUserPosition[1]
            )
        );
    } catch (error) {
        console.warn("SRKR Go: geofence check failed.", error);
        return false;
    }
}

function renderNearMe() {
    if (!featurePanelBody) return;

    // Never request an independent GPS position to bypass
    // the main SRKR geofence confirmation.
    if (!isNearMeGeofenceUnlocked()) {
        featurePanelBody.innerHTML = `
            <div class="srkr-feature-card">
                <h3 class="srkr-feature-card-title">
                    📍 What's Near Me
                </h3>
                <p class="srkr-feature-card-text">
                    This feature is available only inside
                    SRKR campus after your location is confirmed.
                </p>
                <div class="srkr-feature-empty">
    <strong>Campus location not confirmed</strong>
    <p>
        Use the main SRKR Go location control first.
        Once your location is confirmed inside campus,
        reopen What's Near Me.
    </p>
</div>
            </div>
        `;
        return;
    }

    featurePanelBody.innerHTML = `
        <div class="srkr-feature-card">
            <h3 class="srkr-feature-card-title">
                📍 Nearby Places
            </h3>
            <p class="srkr-feature-card-text">
                Useful places around your confirmed campus location.
            </p>
            <div
                id="srkrNearMeResults"
                class="srkr-feature-list"
            >
                <div class="srkr-feature-loading">
                    Finding nearby places...
                </div>
            </div>
        </div>
    `;

    showNearbyPlaces(currentUserPosition);
}


/* =========================================================
   WHAT'S NEAR ME — CALCULATE RESULTS
   ========================================================= */

function showNearbyPlaces(
    userPosition
) {

    const results =
        document.getElementById(
            "srkrNearMeResults"
        );


    if (!results) {
        return;
    }

    // Second security check: block direct calls and stale GPS.
    if (
        !isNearMeGeofenceUnlocked() ||
        !Array.isArray(userPosition) ||
        userPosition[0] !== currentUserPosition[0] ||
        userPosition[1] !== currentUserPosition[1]
    ) {
        results.replaceChildren();

        const message = document.createElement("div");
        message.className = "srkr-feature-empty";
        message.textContent =
            "📍 Nearby places are available only inside SRKR campus.";

        results.appendChild(message);
        return;
    }


    /*
     * campusLocations is the existing
     * SRKR Go source of truth.
     */

    if (
        typeof campusLocations ===
            "undefined" ||
        !campusLocations ||
        typeof campusLocations !==
            "object"
    ) {

        results.innerHTML = `

            <div class="srkr-feature-empty">

                Campus location data is
                unavailable right now.

            </div>

        `;

        return;

    }


    const nearby = [];


    Object.entries(
        campusLocations
    ).forEach(
        function ([id, location]) {

            if (!location) {
                return;
            }


            /*
             * Only point destinations have
             * a direct position.
             *
             * Areas are skipped here because
             * "nearest place" should not invent
             * a point inside an area.
             */

            if (
                location.type !==
                "point"
            ) {

                return;

            }


            const latitude =
                Number(
                    location.latitude
                );

            const longitude =
                Number(
                    location.longitude
                );


            if (
                !Number.isFinite(
                    latitude
                ) ||
                !Number.isFinite(
                    longitude
                )
            ) {

                return;

            }


            const destinationPosition = [

                latitude,

                longitude

            ];


            let distance;


            /*
             * Reuse the existing distance
             * calculation when available.
             */

            if (
                typeof distanceBetween ===
                "function"
            ) {

                distance =
                    distanceBetween(
                        userPosition,
                        destinationPosition
                    );

            } else {

                distance =
                    calculateFeatureDistance(
                        userPosition,
                        destinationPosition
                    );

            }


            if (
                !Number.isFinite(
                    distance
                )
            ) {

                return;

            }


            nearby.push({

                id,

                location,

                position:
                    destinationPosition,

                distance

            });

        }
    );


    nearby.sort(
        function (a, b) {

            return (
                a.distance -
                b.distance
            );

        }
    );


    /*
     * Don't flood the mobile screen.
     *
     * Show the closest 12 useful
     * destinations.
     */

    const visiblePlaces =
        nearby.slice(
            0,
            12
        );


    if (
        !visiblePlaces.length
    ) {

        results.innerHTML = `

            <div class="srkr-feature-empty">

                No nearby destinations
                were found.

            </div>

        `;

        return;

    }


    results.innerHTML =
        visiblePlaces.map(
            function (item) {

                const location =
                    item.location;


                const category =
                    location.category ||
                    "Campus";


                return `

                    <button
                        type="button"
                        class="srkr-feature-list-item"
                        data-nearby-id="${escapeHTML(item.id)}"
                    >

                        <span
                            class="srkr-feature-list-icon"
                        >
                            ${getNearbyIcon(
                                item.id,
                                category
                            )}
                        </span>


                        <span
                            class="srkr-feature-list-content"
                        >

                            <span
                                class="srkr-feature-list-name"
                            >
                                ${escapeHTML(
                                    location.name ||
                                    item.id
                                )}
                            </span>


                            <span
                                class="srkr-feature-list-meta"
                            >
                                ${formatFeatureDistance(
                                    item.distance
                                )}
                                ·
                                ${escapeHTML(
                                    category
                                )}
                            </span>

                        </span>


                        <span
                            class="srkr-feature-badge"
                        >
                            Navigate
                        </span>

                    </button>

                `;

            }
        ).join("");


    results
        .querySelectorAll(
            "[data-nearby-id]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const destinationId =
                            button.dataset.nearbyId;


                        closeFeaturePanel();


                        /*
                         * Reuse the existing
                         * navigation engine.
                         */

 startFeatureNavigation(destinationId);



                    }
                );

            }
        );

}


/* =========================================================
   LIVE GEO-FENCE EXIT HANDLER
   ========================================================= */

document.addEventListener(
    "srkr:geofence-exited",
    function () {
        if (activeFeatureId === "near-me") {
            renderNearMe();
        }
    }
);

/* =========================================================
   DISTANCE FALLBACK
   ========================================================= */

function calculateFeatureDistance(
    pointA,
    pointB
) {

    const earthRadius =
        6371000;


    const lat1 =
        pointA[0] *
        Math.PI /
        180;

    const lat2 =
        pointB[0] *
        Math.PI /
        180;


    const deltaLat =
        (
            pointB[0] -
            pointA[0]
        ) *
        Math.PI /
        180;


    const deltaLng =
        (
            pointB[1] -
            pointA[1]
        ) *
        Math.PI /
        180;


    const a =
        Math.sin(
            deltaLat / 2
        ) ** 2 +

        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(
            deltaLng / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return (
        earthRadius *
        c
    );

}


/* =========================================================
   NEARBY ICONS
   ========================================================= */

function getNearbyIcon(
    id,
    category
) {

    const icons = {

        "cse": "💻",
        "it": "🖥️",
        "ece": "📡",
        "eee": "⚡",
        "civil": "🏗️",
        "mech": "⚙️",

        "s-block": "🏫",
        "n-block": "🏫",
        "w-block": "🏫",

        "technological-centre": "🧠",

        "admin": "🏢",
        "library": "📚",

        "canteen": "🍽️",
        "cafeteria-snacks-counter": "🍿",
        "nescafe": "☕",

        "water-refill-civil": "💧",
        "civil-washroom": "🚻",

        "sbi-srkr": "🏦",
        "sbi-atm": "💳",

        "gym": "🏋️",
        "badminton": "🏸",
        "basketball-court": "🏀",
        "cricket-ground": "🏏",
        "volleyball-courts": "🏐",

        "main-gate": "🚪",
        "second-gate": "🚪",

        "srujana-vatika": "🌿",

        "ev-charging-point": "🔋"

    };


    if (
        icons[id]
    ) {

        return icons[id];

    }


    if (
        category ===
        "Academic"
    ) {

        return "🏫";

    }


    if (
        category ===
        "Food & Refreshments"
    ) {

        return "🍽️";

    }


    if (
        category ===
        "Sports & Recreation"
    ) {

        return "🏃";

    }


    if (
        category ===
        "Campus Facilities"
    ) {

        return "📍";

    }


    return "📍";

}


/* =========================================================
   DISTANCE FORMAT
   ========================================================= */

function formatFeatureDistance(
    distance
) {

    if (
        !Number.isFinite(
            distance
        )
    ) {

        return "Distance unavailable";

    }


    if (
        distance < 1000
    ) {

        return (
            Math.round(
                distance
            ) +
            " m away"
        );

    }


    return (
        (
            distance / 1000
        ).toFixed(1) +
        " km away"
    );

}
/* =========================================================
   SRKR FEATURE NAVIGATION BRIDGE
   ---------------------------------------------------------
   All new features use this function to start navigation.

   IMPORTANT:
   The original GPS, geo-fence and route engine remain
   authoritative.
   ========================================================= */

function startFeatureNavigation(destinationId) {

    if (!destinationId) {
        return;
    }


    /*
     * Connect the feature destination to the
     * existing main navigation selector.
     */

    if (
        typeof destinationSelect !==
        "undefined" &&
        destinationSelect
    ) {

        destinationSelect.value =
            destinationId;

    }


    /*
     * Reset existing navigation state.
     */

    if (
        typeof navigationCompleted !==
        "undefined"
    ) {

        navigationCompleted = false;

    }


    if (
        typeof activeDestinationId !==
        "undefined"
    ) {

        activeDestinationId =
            destinationId;

    }


    if (
        typeof navigationPending !==
        "undefined"
    ) {

        navigationPending = true;

    }


    /*
     * Keep the existing orientation system.
     */

    if (
        typeof startNavigationOrientation ===
        "function"
    ) {

        startNavigationOrientation();

    }


    /*
     * If GPS has already confirmed that the
     * user is inside SRKR, route immediately.
     */

    if (
        typeof navigationGeofenceConfirmed !==
            "undefined" &&
        navigationGeofenceConfirmed &&
        typeof currentUserPosition !==
            "undefined" &&
        Array.isArray(
            currentUserPosition
        ) &&
        currentUserPosition.length >= 2 &&
        typeof isInsideSRKR ===
            "function" &&
        isInsideSRKR(
            currentUserPosition[0],
            currentUserPosition[1]
        )
    ) {

        navigationPending = false;


   buildLiveRoute(
    destinationId,
    {
        fitMap: false,
        force: true,
        liveReroute: true
    }
);

        return;

    }


    /*
     * Otherwise let the EXISTING GPS tracker
     * confirm the campus geo-fence.
     */

    if (
        typeof startLocationTracking ===
        "function"
    ) {

        startLocationTracking();

    }

}

    function renderExploreCampus() {

    const locations =
        typeof campusLocations !== "undefined"
            ? campusLocations
            : null;


    if (
        !locations ||
        typeof locations !== "object"
    ) {

        featurePanelBody.innerHTML = `

            <div class="srkr-feature-empty">
                Campus location data is unavailable.
            </div>

        `;

        return;

    }


    const categoryOrder = [

        "Academic",
        "Administration",
        "Campus Facilities",
        "Food & Refreshments",
        "Sports & Recreation",
        "Student Activities",
        "Research & Development",
        "Campus Services",
        "Campus Entrance",
        "Campus Landmark",
        "Parking & Transport"

    ];


    const categoryIcons = {

        "Academic": "🏫",

        "Administration": "🏢",

        "Campus Facilities": "📍",

        "Food & Refreshments": "🍽️",

        "Sports & Recreation": "🏃",

        "Student Activities": "🎓",

        "Research & Development": "🔬",

        "Campus Services": "🛠️",

        "Campus Entrance": "🚪",

        "Campus Landmark": "📌",

        "Parking & Transport": "🅿️"

    };


    const groups = {};


    Object.entries(
        locations
    ).forEach(
        function ([id, location]) {

            if (!location) {
                return;
            }


            const category =
                location.category ||
                "Other";


            if (!groups[category]) {

                groups[category] = [];

            }


            groups[category].push({

                id,

                location

            });

        }
    );


    Object.keys(groups).forEach(
        function (category) {

            groups[category].sort(
                function (a, b) {

                    return String(
                        a.location.name ||
                        a.id
                    ).localeCompare(
                        String(
                            b.location.name ||
                            b.id
                        )
                    );

                }
            );

        }
    );


    const categories =
        Object.keys(groups).sort(
            function (a, b) {

                const indexA =
                    categoryOrder.indexOf(a);

                const indexB =
                    categoryOrder.indexOf(b);


                if (
                    indexA === -1 &&
                    indexB === -1
                ) {

                    return a.localeCompare(b);

                }


                if (indexA === -1) {
                    return 1;
                }


                if (indexB === -1) {
                    return -1;
                }


                return indexA - indexB;

            }
        );


    if (!categories.length) {

        featurePanelBody.innerHTML = `

            <div class="srkr-feature-empty">
                No campus destinations found.
            </div>

        `;

        return;

    }


    featurePanelBody.innerHTML = `

        <div class="srkr-feature-card">

            <h3 class="srkr-feature-card-title">
                🧭 Explore SRKR Campus
            </h3>

            <p class="srkr-feature-card-text">
                Browse verified campus destinations
                by category.
            </p>

        </div>


        <div
            id="srkrExploreCategories"
            class="srkr-feature-grid"
        ></div>

    `;


    const container =
        document.getElementById(
            "srkrExploreCategories"
        );


    if (!container) {
        return;
    }


    categories.forEach(
        function (category) {

            const items =
                groups[category];


            const categoryCard =
                document.createElement(
                    "div"
                );

            categoryCard.className =
                "srkr-feature-card";


            const icon =
                categoryIcons[category] ||
                "📍";


            categoryCard.innerHTML = `

                <h3
                    class="srkr-feature-card-title"
                >
                    ${icon}
                    ${escapeHTML(category)}
                </h3>


                <p
                    class="srkr-feature-card-text"
                >
                    ${items.length}
                    destination${items.length === 1 ? "" : "s"}
                </p>


                <div
                    class="srkr-feature-list"
                ></div>

            `;


            const list =
                categoryCard.querySelector(
                    ".srkr-feature-list"
                );


            /*
             * Keep the category card compact.
             * On very large categories we don't
             * create a huge wall of buttons.
             */

            items.forEach(
                function (item) {

                    const location =
                        item.location;


                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "srkr-feature-list-item";


                    button.innerHTML = `

                        <span
                            class="srkr-feature-list-icon"
                        >
                            ${getNearbyIcon(
                                item.id,
                                category
                            )}
                        </span>


                        <span
                            class="srkr-feature-list-content"
                        >

                            <span
                                class="srkr-feature-list-name"
                            >
                                ${escapeHTML(
                                    location.name ||
                                    item.id
                                )}
                            </span>


                            <span
                                class="srkr-feature-list-meta"
                            >
                                ${location.type === "area"
                                    ? "Campus area"
                                    : "Campus destination"}
                            </span>

                        </span>


                        <span
                            class="srkr-feature-badge"
                        >
                            View
                        </span>

                    `;


                    button.addEventListener(
                        "click",
                        function () {

                            openExploreDestination(
                                item.id
                            );

                        }
                    );


                    list.appendChild(
                        button
                    );

                }
            );


            container.appendChild(
                categoryCard
            );

        }
    );

}


/* =========================================================
   EXPLORE — DESTINATION ACTIONS
   ========================================================= */

function openExploreDestination(
    destinationId
) {

    const location =
        typeof campusLocations !==
        "undefined"
            ? campusLocations[
                destinationId
            ]
            : null;


    if (!location) {
        return;
    }


    featurePanelBody.innerHTML = `

        <div class="srkr-feature-card">

            <button
                type="button"
                id="srkrExploreBack"
                class="srkr-feature-button"
            >
                ← Back to Explore
            </button>


            <h3
                class="srkr-feature-card-title"
                style="margin-top:16px;"
            >
                ${getNearbyIcon(
                    destinationId,
                    location.category
                )}
                ${escapeHTML(
                    location.name ||
                    destinationId
                )}
            </h3>


            <p
                class="srkr-feature-card-text"
            >
                ${escapeHTML(
                    location.category ||
                    "Campus destination"
                )}
            </p>


            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:8px;
                    margin-top:14px;
                "
            >

                <button
    type="button"
    id="srkrExploreNavigate"
    class="srkr-feature-button primary"
>
    🧭 Start Navigation
</button>

<button
    type="button"
    id="srkrExploreFavorite"
    class="srkr-feature-button"
>
    ${isSRKRFavorite(destinationId)
        ? "★ Remove from Favorites"
        : "☆ Add to Favorites"}
</button>

            </div>

        </div>

    `;


    const backButton =
        document.getElementById(
            "srkrExploreBack"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                renderExploreCampus();

            }
        );

    }


    const navigateButton =
        document.getElementById(
            "srkrExploreNavigate"
        );
const favoriteButton =
    document.getElementById(
        "srkrExploreFavorite"
    );

if (favoriteButton) {

    favoriteButton.addEventListener(
        "click",
        function () {

            if (
                isSRKRFavorite(
                    destinationId
                )
            ) {

                removeSRKRFavorite(
                    destinationId
                );

                favoriteButton.textContent =
                    "☆ Add to Favorites";

            } else {

                addSRKRFavorite(
                    destinationId
                );

                favoriteButton.textContent =
                    "★ Remove from Favorites";

            }

        }
    );

}

    


if (navigateButton) {
    navigateButton.addEventListener(
        "click",
        function () {
            closeFeaturePanel();
            startFeatureNavigation(destinationId);
        }
    );
}

}

           
    



    function renderBlockInfo() {

    /*
     * The block list is derived from the existing
     * campus data rather than being hard-coded
     * as separate destination records.
     */

    const blockIds = [

        "s-block",
        "n-block",
        "mech",
        "it",
        "cse",
        "technological-centre",
        "civil",
        "ece",
        "eee",
        "silver-jubilee",
        "admin"

    ];


    const availableBlocks = [];


    blockIds.forEach(
        function (blockId) {

            if (
                typeof getBlockFloorData !==
                "function"
            ) {
                return;
            }


            const data =
                getBlockFloorData(
                    blockId
                );


            if (!data) {
                return;
            }


            availableBlocks.push({

                id: blockId,

                data

            });

        }
    );


    if (!availableBlocks.length) {

        featurePanelBody.innerHTML = `

            <div class="srkr-feature-empty">

                No block information is
                currently available.

            </div>

        `;

        return;

    }


    /*
     * Sort according to the existing
     * block title.
     */

    availableBlocks.sort(
        function (a, b) {

            return String(
                a.data.title ||
                a.id
            ).localeCompare(
                String(
                    b.data.title ||
                    b.id
                )
            );

        }
    );


    featurePanelBody.innerHTML = `

        <div class="srkr-feature-card">

            <h3
                class="srkr-feature-card-title"
            >
                🏢 Campus Blocks
            </h3>

            <p
                class="srkr-feature-card-text"
            >
                Select a block to view its
                verified floors, rooms and
                facilities.
            </p>

        </div>


        <div
            id="srkrBlockList"
            class="srkr-feature-list"
        ></div>

    `;


    const blockList =
        document.getElementById(
            "srkrBlockList"
        );


    if (!blockList) {
        return;
    }


    availableBlocks.forEach(
        function (block) {

            const data =
                block.data;


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "srkr-feature-list-item";


            const floorCount =
                data.floors &&
                typeof data.floors ===
                    "object"
                    ? Object.keys(
                        data.floors
                    ).length
                    : 0;


            const facilityCount =
                Array.isArray(
                    data.commonFacilities
                )
                    ? data.commonFacilities.length
                    : 0;


            button.innerHTML = `

                <span
                    class="srkr-feature-list-icon"
                >
                    🏢
                </span>


                <span
                    class="srkr-feature-list-content"
                >

                    <span
                        class="srkr-feature-list-name"
                    >
                        ${escapeHTML(
                            data.title ||
                            block.id
                        )}
                    </span>


                    <span
                        class="srkr-feature-list-meta"
                    >
                        ${floorCount}
                        floor${floorCount === 1 ? "" : "s"}
                        ·
                        ${facilityCount}
                        facilit${facilityCount === 1 ? "y" : "ies"}
                    </span>

                </span>


                <span
                    class="srkr-feature-badge"
                >
                    View
                </span>

            `;


            button.addEventListener(
                "click",
                function () {

                    openBlockInformation(
                        block.id
                    );

                }
            );


            blockList.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   BLOCK INFORMATION — DETAIL VIEW
   ========================================================= */

function openBlockInformation(
    blockId
) {

    if (
        typeof getBlockFloorData !==
        "function"
    ) {

        return;

    }


    const data =
        getBlockFloorData(
            blockId
        );


    if (!data) {

        return;

    }


    const floors =
        data.floors &&
        typeof data.floors ===
            "object"
            ? data.floors
            : {};


    const floorNames =
        Object.keys(
            floors
        );


    featurePanelBody.innerHTML = `

        <div class="srkr-feature-card">

            <button
                type="button"
                id="srkrBlockBack"
                class="srkr-feature-button"
            >
                ← All Blocks
            </button>


            <h3
                class="srkr-feature-card-title"
                style="margin-top:16px;"
            >
                🏢
                ${escapeHTML(
                    data.title ||
                    blockId
                )}
            </h3>


            <p
                class="srkr-feature-card-text"
            >
                ${floorNames.length}
                floor${floorNames.length === 1 ? "" : "s"}
                in the campus directory.
            </p>

        </div>


        <div
            id="srkrBlockDetails"
            class="srkr-feature-grid"
        ></div>

    `;


    const backButton =
        document.getElementById(
            "srkrBlockBack"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                renderBlockInfo();

            }
        );

    }


    const details =
        document.getElementById(
            "srkrBlockDetails"
        );


    if (!details) {
        return;
    }


    /*
     * Floors
     */

    floorNames.forEach(
        function (floorName) {

            const rooms =
                Array.isArray(
                    floors[floorName]
                )
                    ? floors[floorName]
                    : [];


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "srkr-feature-card";


            card.innerHTML = `

                <h3
                    class="srkr-feature-card-title"
                >
                    ${escapeHTML(
                        floorName
                    )}
                </h3>


                <p
                    class="srkr-feature-card-text"
                >
                    ${rooms.length}
                    room entr${rooms.length === 1 ? "y" : "ies"}
                </p>


                <div
                    class="srkr-feature-list"
                ></div>

            `;


            const roomList =
                card.querySelector(
                    ".srkr-feature-list"
                );


            rooms.forEach(
                function (entry) {

                    let roomName = "";
                    let detail = "";


                    if (
                        typeof entry ===
                        "string"
                    ) {

                        detail =
                            entry;

                        roomName =
                            entry;

                    } else if (
                        entry &&
                        typeof entry ===
                        "object"
                    ) {

                        roomName =
                            entry.room ||
                            entry.name ||
                            "Room";

                        detail =
                            entry.detail ||
                            "";

                    }


                    const room =
                        document.createElement(
                            "div"
                        );


                    room.className =
                        "srkr-feature-list-item";


                    room.style.cursor =
                        "default";


                    room.innerHTML = `

                        <span
                            class="srkr-feature-list-icon"
                        >
                            📚
                        </span>


                        <span
                            class="srkr-feature-list-content"
                        >

                            <span
                                class="srkr-feature-list-name"
                            >
                                ${escapeHTML(
                                    roomName
                                )}
                            </span>


                            <span
                                class="srkr-feature-list-meta"
                            >
                                ${escapeHTML(
                                    detail
                                )}
                            </span>

                        </span>

                    `;


                    roomList.appendChild(
                        room
                    );

                }
            );


            if (!rooms.length) {

                roomList.innerHTML = `

                    <div
                        class="srkr-feature-empty"
                    >
                        No room entries listed
                        for this floor.
                    </div>

                `;

            }


            details.appendChild(
                card
            );

        }
    );


    /*
     * Common facilities
     */

    if (
        Array.isArray(
            data.commonFacilities
        ) &&
        data.commonFacilities.length
    ) {

        const facilitiesCard =
            document.createElement(
                "div"
            );


        facilitiesCard.className =
            "srkr-feature-card";


        facilitiesCard.innerHTML = `

            <h3
                class="srkr-feature-card-title"
            >
                🛠️ Common Facilities
            </h3>


            <div
                class="srkr-feature-list"
            ></div>

        `;


        const facilityList =
            facilitiesCard.querySelector(
                ".srkr-feature-list"
            );


        data.commonFacilities.forEach(
            function (facility) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "srkr-feature-list-item";


                item.style.cursor =
                    "default";


                item.innerHTML = `

                    <span
                        class="srkr-feature-list-icon"
                    >
                        ✓
                    </span>


                    <span
                        class="srkr-feature-list-content"
                    >

                        <span
                            class="srkr-feature-list-name"
                        >
                            ${escapeHTML(
                                facility
                            )}
                        </span>

                    </span>

                `;


                facilityList.appendChild(
                    item
                );

            }
        );


        details.appendChild(
            facilitiesCard
        );

    }


    /*
     * Navigation action
     */

    const location =
        typeof campusLocations !==
        "undefined"
            ? campusLocations[
                blockId
            ]
            : null;


    if (location) {

        const navigationCard =
            document.createElement(
                "div"
            );


        navigationCard.className =
            "srkr-feature-card";


        navigationCard.innerHTML = `

            <h3
                class="srkr-feature-card-title"
            >
                🧭 Navigate
            </h3>


            <p
                class="srkr-feature-card-text"
            >
                Start navigation to this
                block using the existing
                SRKR Go route engine.
            </p>


            <button
                type="button"
                id="srkrBlockNavigate"
                class="srkr-feature-button primary"
                style="margin-top:12px;"
            >
                🧭 Start Navigation
            </button>

        `;


        details.appendChild(
            navigationCard
        );


        const navigateButton =
            document.getElementById(
                "srkrBlockNavigate"
            );


        if (navigateButton) {
    navigateButton.addEventListener(
        "click",
        function () {
            closeFeaturePanel();
            startFeatureNavigation(blockId);
        }
    );
}

    }

}


    function renderFindClassroom() {

    featurePanelBody.innerHTML = `

        <div class="srkr-feature-card">

            <h3 class="srkr-feature-card-title">
                🔎 Find My Classroom
            </h3>

            <p class="srkr-feature-card-text">
                Search classrooms and rooms from
                the verified SRKR campus directory.
            </p>

            <input
                type="search"
                id="srkrClassroomSearch"
                class="srkr-feature-search"
                placeholder="Search room, classroom or lab..."
                autocomplete="off"
                spellcheck="false"
                aria-label="Search classroom"
            >

        </div>


        <div
            id="srkrClassroomResults"
            class="srkr-feature-list"
        >

            <div class="srkr-feature-empty">
                Start typing to search the campus directory.
            </div>

        </div>

    `;


    const searchInput =
        document.getElementById(
            "srkrClassroomSearch"
        );


    const results =
        document.getElementById(
            "srkrClassroomResults"
        );


    if (
        !searchInput ||
        !results
    ) {
        return;
    }


    /*
     * Build the room database from the
     * existing block-floor data.
     */

    const rooms =
        buildClassroomSearchIndex();


    function updateResults() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        if (!query) {

            results.innerHTML = `

                <div class="srkr-feature-empty">
                    Start typing to search the
                    campus directory.
                </div>

            `;

            return;

        }


        const matches =
            rooms.filter(
                function (room) {

                    const searchableText =
                        (
                            room.room +
                            " " +
                            room.detail +
                            " " +
                            room.floor +
                            " " +
                            room.blockName
                        ).toLowerCase();


                    return searchableText.includes(
                        query
                    );

                }
            );


        if (!matches.length) {

            results.innerHTML = `

                <div class="srkr-feature-empty">

                    No matching classroom or room
                    was found in the current
                    campus directory.

                </div>

            `;

            return;

        }


        /*
         * Keep the result list compact,
         * especially on phones.
         */

        const visibleMatches =
            matches.slice(
                0,
                30
            );


        results.innerHTML =
            visibleMatches.map(
                function (room) {

                    return `

                        <button
                            type="button"
                            class="srkr-feature-list-item"
                            data-classroom-index="${room.index}"
                        >

                            <span
                                class="srkr-feature-list-icon"
                            >
                                📚
                            </span>


                            <span
                                class="srkr-feature-list-content"
                            >

                                <span
                                    class="srkr-feature-list-name"
                                >
                                    ${escapeHTML(
                                        room.room
                                    )}
                                </span>


                                <span
                                    class="srkr-feature-list-meta"
                                >
                                    ${escapeHTML(
                                        room.blockName
                                    )}
                                    ·
                                    ${escapeHTML(
                                        room.floor
                                    )}
                                </span>

                            </span>


                            <span
                                class="srkr-feature-badge"
                            >
                                View
                            </span>

                        </button>

                    `;

                }
            ).join("");


        results
            .querySelectorAll(
                "[data-classroom-index]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const index =
                                Number(
                                    button.dataset
                                        .classroomIndex
                                );


                            const room =
                                rooms[index];


                            if (!room) {
                                return;
                            }


                            openClassroomResult(
                                room
                            );

                        }
                    );

                }
            );

    }


    searchInput.addEventListener(
        "input",
        updateResults
    );

}


/* =========================================================
   CLASSROOM SEARCH INDEX
   ========================================================= */

function buildClassroomSearchIndex() {

    const blockIds = [

        "s-block",
        "n-block",
        "mech",
        "it",
        "cse",
        "technological-centre",
        "civil",
        "ece",
        "eee",
        "silver-jubilee",
        "admin"

    ];


    const rooms = [];


    blockIds.forEach(
        function (blockId) {

            if (
                typeof getBlockFloorData !==
                "function"
            ) {
                return;
            }


            const data =
                getBlockFloorData(
                    blockId
                );


            if (
                !data ||
                !data.floors
            ) {
                return;
            }


            Object.entries(
                data.floors
            ).forEach(
                function ([floorName, entries]) {

                    if (
                        !Array.isArray(
                            entries
                        )
                    ) {
                        return;
                    }


                    entries.forEach(
                        function (entry) {

                            let room = "";
                            let detail = "";


                            if (
                                typeof entry ===
                                "string"
                            ) {

                                room =
                                    entry;

                                detail =
                                    entry;

                            } else if (
                                entry &&
                                typeof entry ===
                                "object"
                            ) {

                                room =
                                    entry.room ||
                                    entry.name ||
                                    "";

                                detail =
                                    entry.detail ||
                                    "";

                            }


                            if (
                                !room &&
                                !detail
                            ) {
                                return;
                            }


                            rooms.push({

                                index:
                                    rooms.length,

                                blockId,

                                blockName:
                                    data.title ||
                                    blockId,

                                floor:
                                    floorName,

                                room,

                                detail

                            });

                        }
                    );

                }
            );

        }
    );


    return rooms;

}


/* =========================================================
   CLASSROOM RESULT DETAIL
   ========================================================= */

function openClassroomResult(
    room
) {

    featurePanelBody.innerHTML = `

        <div class="srkr-feature-card">

            <button
                type="button"
                id="srkrClassroomBack"
                class="srkr-feature-button"
            >
                ← Back to Search
            </button>


            <h3
                class="srkr-feature-card-title"
                style="margin-top:16px;"
            >
                📚
                ${escapeHTML(
                    room.room
                )}
            </h3>


            <p
                class="srkr-feature-card-text"
            >
                ${escapeHTML(
                    room.blockName
                )}
                ·
                ${escapeHTML(
                    room.floor
                )}
            </p>


            ${
                room.detail
                    ? `
                        <div
                            class="srkr-feature-card"
                            style="margin-top:12px;"
                        >
                            <p
                                class="srkr-feature-card-text"
                            >
                                ${escapeHTML(
                                    room.detail
                                )}
                            </p>
                        </div>
                    `
                    : ""
            }


            <button
                type="button"
                id="srkrClassroomNavigate"
                class="srkr-feature-button primary"
                style="margin-top:12px;"
            >
                🧭 Navigate to ${escapeHTML(
                    room.blockName
                )}
            </button>

        </div>

    `;


    const backButton =
        document.getElementById(
            "srkrClassroomBack"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                renderFindClassroom();

            }
        );

    }


    const navigateButton =
        document.getElementById(
            "srkrClassroomNavigate"
        );


    
if (navigateButton) {
    navigateButton.addEventListener(
        "click",
        function () {
            const destinationId = room.blockId;

            if (
                !destinationId ||
                typeof campusLocations === "undefined" ||
                !campusLocations ||
                !campusLocations[destinationId]
            ) {
                console.warn(
                    "Classroom navigation destination missing:",
                    destinationId
                );

                alert(
                    "Navigation to this block is not available yet."
                );

                return;
            }

            closeFeaturePanel();
            startFeatureNavigation(destinationId);
        }
    );
}


}


   function renderFreshersMode() {

    featurePanelBody.innerHTML = `

        <div class="srkr-feature-card">

            <div
                class="srkr-feature-badge success"
                style="margin-bottom:10px;"
            >
                🎓 FRESHERS MODE
            </div>

            <h3 class="srkr-feature-card-title">
                Welcome to SRKR
            </h3>

            <p class="srkr-feature-card-text">
                New to campus? Start with the
                places students commonly need
                first.
            </p>

        </div>


        <div
            id="srkrFreshersGuide"
            class="srkr-feature-grid"
        ></div>

    `;


    const guide =
        document.getElementById(
            "srkrFreshersGuide"
        );


    if (!guide) {
        return;
    }


    /*
     * These are only entry points into the
     * existing campus database.
     *
     * We do NOT invent new destinations.
     */

    const fresherDestinations = [

        {
            id: "main-gate",
            icon: "🚪",
            title: "Main Gate",
            description:
                "Start here when entering campus."
        },

        {
            id: "admin",
            icon: "🏢",
            title: "Administration",
            description:
                "Find the main administration block."
        },
{
    id: "s-block",
    icon: "🏫",
    title: "S Block",
    description: "Navigate to S Block and its academic facilities."
},
        {
            id: "library",
            icon: "📚",
            title: "Library",
            description:
                "Find the campus library."
        },

        {
            id: "canteen",
            icon: "🍽️",
            title: "Canteen",
            description:
                "Find the main campus food area."
        },

        {
            id: "dispensary",
            icon: "🩺",
            title: "Dispensary",
            description:
                "Find the campus medical facility."
        },

        {
            id: "gym",
            icon: "🏋️",
            title: "Gym",
            description:
                "Find the campus gym."
        },

        {
            id: "srujana-vatika",
            icon: "🌿",
            title: "Srujana Vatika",
            description:
                "Explore one of the campus landmarks."
        }

    ];


    fresherDestinations.forEach(
        function (item) {

            const location =
                typeof campusLocations !==
                "undefined"
                    ? campusLocations[
                        item.id
                    ]
                    : null;


            /*
             * If a destination isn't present
             * in the current dataset, don't
             * show a broken card.
             */

            if (!location) {
                return;
            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "srkr-feature-card";


            card.innerHTML = `

                <div
                    class="srkr-feature-list-icon"
                    style="margin-bottom:10px;"
                >
                    ${item.icon}
                </div>


                <h3
                    class="srkr-feature-card-title"
                >
                    ${escapeHTML(
                        location.name ||
                        item.title
                    )}
                </h3>


                <p
                    class="srkr-feature-card-text"
                >
                    ${escapeHTML(
                        item.description
                    )}
                </p>


                <button
                    type="button"
                    class="srkr-feature-button primary"
                    data-fresher-destination="${escapeHTML(
                        item.id
                    )}"
                    style="margin-top:12px;"
                >
                    🧭 Navigate
                </button>

            `;


            guide.appendChild(
                card
            );

        }
    );


    /*
     * If none of the verified destinations
     * exists, show a proper empty state.
     */

    if (!guide.children.length) {

        guide.innerHTML = `

            <div class="srkr-feature-empty">

                Fresher destinations are not
                available in the current campus
                dataset.

            </div>

        `;

        return;

    }


    guide
        .querySelectorAll(
            "[data-fresher-destination]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const destinationId =
                            button.dataset
                                .fresherDestination;


                        /*
                         * IMPORTANT:
                         *
                         * Navigation is handed to
                         * the existing navigation
                         * engine.
                         *
                         * Therefore existing GPS,
                         * route validation and
                         * campus geofence behavior
                         * remain in control.
                         */

                        closeFeaturePanel();


                        if (
                            typeof buildLiveRoute ===
                            "function"
                        ) {

                            startFeatureNavigation(destinationId);

                        }

                    }
                );

            }
        );

}


    function renderFavorites() {

    const favorites =
        getSRKRFavorites();


    featurePanelBody.innerHTML = `

        <div class="srkr-feature-card">

            <h3 class="srkr-feature-card-title">
                ⭐ Favorites
            </h3>

            <p class="srkr-feature-card-text">
                Save places you use often for
                quick access.
            </p>

        </div>


        <div
            id="srkrFavoritesList"
            class="srkr-feature-list"
        ></div>

    `;


    const list =
        document.getElementById(
            "srkrFavoritesList"
        );


    if (!list) {
        return;
    }


    if (!favorites.length) {

        list.innerHTML = `

            <div class="srkr-feature-empty">

                ⭐ No favorites yet.

                <br><br>

                Add places from Explore Campus
                to find them quickly here.

            </div>

        `;

        return;

    }


    favorites.forEach(
        function (destinationId) {

            const location =
                typeof campusLocations !==
                "undefined"
                    ? campusLocations[
                        destinationId
                    ]
                    : null;


            /*
             * If a location was removed from
             * the main dataset, don't show a
             * broken favorite.
             */

            if (!location) {
                return;
            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "srkr-feature-list-item";


            item.innerHTML = `

                <span
                    class="srkr-feature-list-icon"
                >
                    ⭐
                </span>


                <span
                    class="srkr-feature-list-content"
                >

                    <span
                        class="srkr-feature-list-name"
                    >
                        ${escapeHTML(
                            location.name ||
                            destinationId
                        )}
                    </span>


                    <span
                        class="srkr-feature-list-meta"
                    >
                        ${escapeHTML(
                            location.category ||
                            "Campus"
                        )}
                    </span>

                </span>


                <span
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:6px;
                        flex:0 0 auto;
                    "
                >

                    <button
                        type="button"
                        class="srkr-feature-button primary"
                        data-favorite-navigate="${escapeHTML(
                            destinationId
                        )}"
                    >
                        Navigate
                    </button>


                    <button
                        type="button"
                        class="srkr-feature-button"
                        data-favorite-remove="${escapeHTML(
                            destinationId
                        )}"
                        aria-label="Remove favorite"
                    >
                        Remove
                    </button>

                </span>

            `;


            list.appendChild(
                item
            );

        }
    );


    /*
     * Navigate
     */

    list
        .querySelectorAll(
            "[data-favorite-navigate]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const destinationId =
                            button.dataset
                                .favoriteNavigate;


                        closeFeaturePanel();


                        if (
                            typeof buildLiveRoute ===
                            "function"
                        ) {

                            startFeatureNavigation(destinationId);

                        }

                    }
                );

            }
        );


    /*
     * Remove
     */

    list
        .querySelectorAll(
            "[data-favorite-remove]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const destinationId =
                            button.dataset
                                .favoriteRemove;


                        removeSRKRFavorite(
                            destinationId
                        );


                        renderFavorites();

                    }
                );

            }
        );

}


/* =========================================================
   FAVORITES STORAGE
   ========================================================= */

const SRKR_FAVORITES_STORAGE_KEY =
    "srkrGoFavorites";
const SRKR_RECENT_STORAGE_KEY = "srkrGoRecentDestinations";
const SRKR_RECENT_LIMIT = 10;

function getSRKRFavorites() {

    try {

        const saved =
            localStorage.getItem(
                SRKR_FAVORITES_STORAGE_KEY
            );


        if (!saved) {
            return [];
        }


        const parsed =
            JSON.parse(
                saved
            );


        if (
            !Array.isArray(
                parsed
            )
        ) {

            return [];

        }


        /*
         * Remove duplicates and invalid
         * empty IDs.
         */

        return [
            ...new Set(
                parsed.filter(
                    function (id) {

                        return (
                            typeof id ===
                            "string" &&
                            id.trim()
                        );

                    }
                )
            )
        ];

    } catch (error) {

        console.warn(
            "SRKR Go: Unable to read favorites.",
            error
        );

        return [];

    }

}


function saveSRKRFavorites(
    favorites
) {

    try {

        localStorage.setItem(
            SRKR_FAVORITES_STORAGE_KEY,
            JSON.stringify(
                favorites
            )
        );

    } catch (error) {

        console.warn(
            "SRKR Go: Unable to save favorites.",
            error
        );

    }

}


function addSRKRFavorite(
    destinationId
) {

    if (
        !destinationId ||
        typeof campusLocations ===
            "undefined" ||
        !campusLocations[
            destinationId
        ]
    ) {

        return false;

    }


    const favorites =
        getSRKRFavorites();


    if (
        favorites.includes(
            destinationId
        )
    ) {

        return true;

    }


    favorites.push(
        destinationId
    );


    saveSRKRFavorites(
        favorites
    );


    return true;

}


function removeSRKRFavorite(
    destinationId
) {

    const favorites =
        getSRKRFavorites();


    const updated =
        favorites.filter(
            function (id) {

                return (
                    id !==
                    destinationId
                );

            }
        );


    saveSRKRFavorites(
        updated
    );

}


function isSRKRFavorite(
    destinationId
) {

    return getSRKRFavorites()
        .includes(
            destinationId
        );

}


/* =========================================================
   PUBLIC FAVORITES API
   ========================================================= */

window.SRKRFavorites = {

    get:
        getSRKRFavorites,

    add:
        addSRKRFavorite,

    remove:
        removeSRKRFavorite,

    has:
        isSRKRFavorite

};
/* =========================================================
   RECENT DESTINATIONS
   ========================================================= */

function getSRKRRecentDestinations() {

    try {

        const stored =
            localStorage.getItem(
                SRKR_RECENT_STORAGE_KEY
            );

        const parsed =
            stored
                ? JSON.parse(stored)
                : [];

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(function (destinationId) {

            return (
                typeof destinationId === "string" &&
                campusLocations &&
                campusLocations[destinationId]
            );

        });

    } catch (error) {

        return [];

    }
}


function saveSRKRRecentDestinations(
    destinations
) {

    try {

        localStorage.setItem(
            SRKR_RECENT_STORAGE_KEY,
            JSON.stringify(destinations)
        );

    } catch (error) {

        /* Ignore localStorage failures. */

    }

}


function addSRKRRecentDestination(
    destinationId
) {

    if (
        !destinationId ||
        !campusLocations ||
        !campusLocations[destinationId]
    ) {
        return;
    }

    let recent =
        getSRKRRecentDestinations();

    recent =
        recent.filter(function (id) {

            return id !== destinationId;

        });

    recent.unshift(destinationId);

    recent =
        recent.slice(
            0,
            SRKR_RECENT_LIMIT
        );

    saveSRKRRecentDestinations(
        recent
    );

}


function clearSRKRRecentDestinations() {

    saveSRKRRecentDestinations([]);

}


window.SRKRRecentDestinations = {

    get:
        getSRKRRecentDestinations,

    add:
        addSRKRRecentDestination,

    clear:
        clearSRKRRecentDestinations

};

    function renderRecent() {

    const recent =
        getSRKRRecentDestinations();

    if (!recent.length) {

        featurePanelBody.innerHTML = `
            <div class="srkr-feature-empty">
                <div class="srkr-feature-empty-icon">🕘</div>

                <h3>No recent destinations</h3>

                <p>
                    Destinations you navigate to will
                    appear here automatically.
                </p>
            </div>
        `;

        return;
    }


    featurePanelBody.innerHTML = `

        <div class="srkr-feature-section-head">

            <div>
                <div class="srkr-feature-section-title">
                    Recently Navigated
                </div>

                <div class="srkr-feature-section-subtitle">
                    Your last ${recent.length} destinations
                </div>
            </div>

            <button
                type="button"
                class="srkr-feature-secondary-button"
                id="srkrClearRecent"
            >
                Clear
            </button>

        </div>

        <div class="srkr-feature-list">

            ${recent.map(function (destinationId) {

                const destination =
                    campusLocations[destinationId];

                if (!destination) {
                    return "";
                }

                return `

                    <div class="srkr-feature-list-item">

                        <div class="srkr-feature-list-icon">
                            ${getNearbyIcon(destination)}
                        </div>

                        <div class="srkr-feature-list-content">

                            <div class="srkr-feature-list-title">
                                ${escapeHTML(
                                    destination.name ||
                                    "Campus Destination"
                                )}
                            </div>

                            <div class="srkr-feature-list-meta">
                                ${escapeHTML(
                                    destination.category ||
                                    "Campus"
                                )}
                            </div>

                        </div>

                        <button
                            type="button"
                            class="srkr-feature-small-button"
                            data-recent-navigate="${escapeHTML(
                                destinationId
                            )}"
                        >
                            Navigate
                        </button>

                    </div>

                `;

            }).join("")}

        </div>

    `;


    const clearButton =
        document.getElementById(
            "srkrClearRecent"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                clearSRKRRecentDestinations();

                renderRecent();

            }
        );

    }


    featurePanelBody
        .querySelectorAll(
            "[data-recent-navigate]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const destinationId =
                        button.dataset
                            .recentNavigate;

                    if (
                        !destinationId ||
                        !campusLocations[
                            destinationId
                        ]
                    ) {
                        return;
                    }

                    closeFeaturePanel();

                    if (
                        typeof buildLiveRoute ===
                        "function"
                    ) {

                        startFeatureNavigation(destinationId);

                    }

                }
            );

        });

}


    
async function renderCampusAlerts() {
    const escape = (value) =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const categories = {
        academic: "Academic Notice",
        event: "Campus Event",
        facility: "Facility Update",
        closure: "Temporary Closure",
        general: "General Notice"
    };

    
featurePanelBody.innerHTML = `
    <section class="srkr-alerts-shell">
        <div class="srkr-alerts-intro">
            <div class="srkr-alerts-heading-row">
                <div>
                    <span class="srkr-alerts-eyebrow">SRKR GO · LIVE UPDATES</span>
                    <h3 class="srkr-alerts-heading">📢 Campus Alerts</h3>
                    <p class="srkr-alerts-description">
                        Official updates and important campus announcements.
                    </p>
                </div>
                <span class="srkr-alerts-live-dot" aria-label="Live feed"></span>
            </div>
        </div>

        <div class="srkr-alerts-toolbar">
            <button type="button"
                class="srkr-alert-button"
                id="srkrAlertRefresh">
                ↻ Refresh alerts
            </button>

            <button type="button"
                class="srkr-alert-button primary"
                id="srkrAlertPublishToggle"
                aria-expanded="false">
                + Publish an alert
            </button>
        </div>

        <form id="srkrAlertPublishForm"
            class="srkr-alerts-form"
            hidden>

            <div class="srkr-alerts-form-heading">
                <h4>Publish campus announcement</h4>
                <p>Only publish verified campus information.</p>
            </div>

            <div class="srkr-alerts-field full-width">
                <label for="srkrAlertTitle">Alert title</label>
                <input id="srkrAlertTitle"
                    maxlength="120"
                    required minlength="3"
                    placeholder="Example: Library closing early">
            </div>

            <div class="srkr-alerts-field full-width">
                <label for="srkrAlertMessage">Announcement details</label>
                <textarea id="srkrAlertMessage"
                    maxlength="2000"
                    required minlength="3"
                    placeholder="Write the announcement..."></textarea>
            </div>

            <div class="srkr-alerts-field">
                <label for="srkrAlertCategory">Category</label>
                <select id="srkrAlertCategory">
                    <option value="general">General Notice</option>
                    <option value="academic">Academic Notice</option>
                    <option value="event">Campus Event</option>
                    <option value="facility">Facility Update</option>
                    <option value="closure">Temporary Closure</option>
                </select>
            </div>

            <div class="srkr-alerts-field">
                <label for="srkrAlertLocation">Location (optional)</label>
                <input id="srkrAlertLocation"
                    maxlength="120"
                    placeholder="Example: Library">
            </div>

            <div class="srkr-alerts-field">
                <label for="srkrAlertExpiry">Alert duration</label>
                <select id="srkrAlertExpiry">
                    <option value="24">24 hours</option>
                    <option value="168">7 days</option>
                    <option value="720">30 days</option>
                    <option value="never">No expiry</option>
                </select>
            </div>

            <div class="srkr-alerts-field">
                <label for="srkrAlertPassword">Host password</label>
                <input id="srkrAlertPassword"
                    type="password"
                    autocomplete="current-password"
                    required>
            </div>

            <p id="srkrAlertFormStatus"
                class="srkr-alerts-status full-width"
                role="status"
                aria-live="polite"></p>

            <div class="srkr-alerts-form-actions full-width">
                <button type="submit"
                    class="srkr-alert-button primary"
                    id="srkrAlertPublishButton">
                    Publish alert
                </button>
            </div>
        </form>
    </section>

    <section class="srkr-alerts-feed-section">
        <div class="srkr-alerts-feed-heading">
            <h4>Latest updates</h4>
            <span>Most recent first</span>
        </div>

        <div id="srkrAlertFeed"
            class="srkr-alerts-feed"
            aria-live="polite">
            <div class="srkr-feature-empty">
                Loading campus alerts...
            </div>
        </div>
    </section>
`;


    const feed = document.getElementById("srkrAlertFeed");
    const form = document.getElementById("srkrAlertPublishForm");
    const status = document.getElementById("srkrAlertFormStatus");
    const publishButton = document.getElementById("srkrAlertPublishButton");

    
document.getElementById("srkrAlertPublishToggle")
    .addEventListener("click", () => {
        form.hidden = !form.hidden;

        const toggle = document.getElementById("srkrAlertPublishToggle");
        toggle.setAttribute("aria-expanded", String(!form.hidden));
        toggle.textContent = form.hidden
            ? "+ Publish an alert"
            : "− Close publish form";

        if (!form.hidden) {
            document.getElementById("srkrAlertTitle").focus();
        }
    });


    async function loadAlerts() {
        feed.innerHTML =
            `<div class="srkr-feature-empty">Loading campus alerts...</div>`;

        try {
            const { data, error } = await supabaseClient
                .from("campus_alerts")
                .select("id,title,message,category,location_name,created_at,expires_at")
                .eq("is_published", true)
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;

            const now = Date.now();
            const alerts = (data || []).filter((alert) =>
                !alert.expires_at ||
                new Date(alert.expires_at).getTime() > now
            );

            if (!alerts.length) {
                feed.innerHTML = `
                    <div class="srkr-feature-empty">
                        📭 No current campus alerts.
                        Check again later.
                    </div>`;
                return;
            }

            feed.innerHTML = alerts.map((alert) => {
                const date = new Date(alert.created_at);
                const dateText = Number.isNaN(date.getTime())
                    ? ""
                    : date.toLocaleString();

                const expiryText = alert.expires_at
                    ? `Expires ${escape(new Date(alert.expires_at).toLocaleString())}`
                    : "No expiry set";

                return `
                    <article class="srkr-feature-card">
                        <div class="srkr-feature-list-meta">
                            ${escape(categories[alert.category] || "Campus Notice")}
                        </div>
                        <h3 class="srkr-feature-card-title">
                            ${escape(alert.title)}
                        </h3>
                        <p class="srkr-feature-card-text">
                            ${escape(alert.message).replace(/\n/g, "<br>")}
                        </p>
                        ${alert.location_name ? `
                            <p class="srkr-feature-list-meta">
                                📍 ${escape(alert.location_name)}
                            </p>` : ""}
                        <p class="srkr-feature-list-meta">
                            Published ${escape(dateText)}
                        </p>
                        <p class="srkr-feature-list-meta">
                            ${expiryText}
                        </p>
                        <button type="button"
                            class="srkr-feature-secondary-button"
                            data-delete-alert="${escape(alert.id)}">
                            Host: Delete alert
                        </button>
                    </article>`;
            }).join("");

            feed.querySelectorAll("[data-delete-alert]")
                .forEach((button) => {
                    button.addEventListener("click", async () => {
                        const password = window.prompt(
                            "Enter the host password to delete this alert:"
                        );
                        if (password === null || !password) return;

                        button.disabled = true;

                        try {
                            const { data, error } = await supabaseClient.rpc(
                                "srkr_host_delete_alert",
                                {
                                    p_password: password,
                                    p_alert_id: Number(button.dataset.deleteAlert)
                                }
                            );

                            if (error) throw error;
                            if (!data?.ok) {
                                throw new Error(data?.message || "Deletion failed.");
                            }

                            await loadAlerts();
                        } catch (error) {
                            console.error("Campus alert deletion failed:", error);
                            window.alert(error.message || "Could not delete the alert.");
                            button.disabled = false;
                        }
                    });
                });
        } catch (error) {
            console.error("Campus alerts loading failed:", error);
            feed.innerHTML = `
                <div class="srkr-feature-empty">
                    Couldn't load alerts. Check your connection and try again.
                </div>`;
        }
    }

    document.getElementById("srkrAlertRefresh")
        .addEventListener("click", loadAlerts);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.textContent = "";

        const title = document.getElementById("srkrAlertTitle").value.trim();
        const message = document.getElementById("srkrAlertMessage").value.trim();
        const category = document.getElementById("srkrAlertCategory").value;
        const location = document.getElementById("srkrAlertLocation").value.trim();
        const password = document.getElementById("srkrAlertPassword").value;
        const expiry = document.getElementById("srkrAlertExpiry").value;

        if (title.length < 3 || message.length < 3 || !password) {
            status.textContent = "Complete the title, details and host password.";
            return;
        }

        const expiresAt = expiry === "never"
            ? null
            : new Date(Date.now() + Number(expiry) * 60 * 60 * 1000).toISOString();

        publishButton.disabled = true;
        status.textContent = "Publishing...";

        try {
            const { data, error } = await supabaseClient.rpc(
                "srkr_host_create_alert",
                {
                    p_password: password,
                    p_title: title,
                    p_message: message,
                    p_category: category,
                    p_location_name: location || null,
                    p_expires_at: expiresAt
                }
            );

            if (error) throw error;
            if (!data?.ok) {
                throw new Error(data?.message || "Publishing failed.");
            }

            form.reset();
            status.textContent = "Alert published successfully.";
            await loadAlerts();
        } catch (error) {
            console.error("Campus alert publishing failed:", error);
            status.textContent = error.message || "Couldn't publish the alert.";
        } finally {
            publishButton.disabled = false;
        }
    });

    await loadAlerts();
}



    

function renderGoFan() {
    if (!featurePanelBody) return;

    const locations = [
        ["main-gate", "Main Gate"],
        ["admin", "Administration"],
        ["library", "Library"],
        ["canteen", "Canteen"],
        ["dispensary", "Dispensary"],
        ["gym", "Gym"],
        ["srujana-vatika", "Srujana Vatika"]
    ];

    const options = locations.map(([id, name]) =>
        `<option value="${id}">${escapeHTML(name)}</option>`
    ).join("");

    featurePanelBody.innerHTML = `
        <div class="srkr-feature-card srkr-go-fan">
            <h3 class="srkr-feature-card-title">📸 GO FAN</h3>
            <p class="srkr-feature-card-text">
                Share your SRKR campus moments.
                Every photo needs host approval.
            </p>

            <form id="srkrGoFanForm" class="srkr-go-fan-form">
                <label for="srkrGoFanImage">Campus photo</label>
                <input id="srkrGoFanImage" type="file"
                    accept="image/jpeg,image/png,image/webp" required>

                <div id="srkrGoFanPreviewWrap" hidden>
                    <img id="srkrGoFanPreview"
                        alt="Photo preview"
                        style="width:100%;max-height:260px;object-fit:cover;border-radius:12px">
                </div>

                <label for="srkrGoFanCaption">Caption</label>
                <textarea id="srkrGoFanCaption" maxlength="240"
                    rows="3" required></textarea>

                <label for="srkrGoFanLocation">Destination</label>
                <select id="srkrGoFanLocation" required>
                    <option value="">Choose destination</option>
                    ${options}
                </select>

                <p id="srkrGoFanStatus" role="status">
                    Select a photo to begin.
                </p>
                <button id="srkrGoFanSubmit"
                    class="srkr-feature-action" type="submit" disabled>
                    Submit for approval
                </button>
            </form>
        </div>

        <div class="srkr-feature-card srkr-go-fan">
            <h3 class="srkr-feature-card-title">Approved Photos</h3>
            <label for="srkrGoFanGalleryLocation">Filter destination</label>
            <select id="srkrGoFanGalleryLocation">
                <option value="">All destinations</option>
                ${options}
            </select>
            <p id="srkrGoFanGalleryStatus" role="status">
                Loading gallery...
            </p>
            <div id="srkrGoFanGallery" class="srkr-feature-grid"></div>
        </div>

        <div class="srkr-feature-card srkr-go-fan">
            <h3 class="srkr-feature-card-title">🔐 Host Approval Panel</h3>
            <p class="srkr-feature-card-text">
                Only authorized hosts can review submissions.
            </p>
            <button id="srkrGoFanHostUnlock"
                class="srkr-feature-action" type="button">
                Open Host Queue
            </button>
            <p id="srkrGoFanHostStatus" role="status">
                Host verification required.
            </p>
            <div id="srkrGoFanQueue" class="srkr-feature-grid"></div>
        </div>
    `;

    const root = featurePanelBody;
    const $ = selector => root.querySelector(selector);

    const form = $("#srkrGoFanForm");
    const image = $("#srkrGoFanImage");
    const caption = $("#srkrGoFanCaption");
    const location = $("#srkrGoFanLocation");
    const preview = $("#srkrGoFanPreview");
    const previewWrap = $("#srkrGoFanPreviewWrap");
    const submit = $("#srkrGoFanSubmit");
    const status = $("#srkrGoFanStatus");
    const gallery = $("#srkrGoFanGallery");
    const galleryFilter = $("#srkrGoFanGalleryLocation");
    const galleryStatus = $("#srkrGoFanGalleryStatus");
    const unlock = $("#srkrGoFanHostUnlock");
    const hostStatus = $("#srkrGoFanHostStatus");
    const queue = $("#srkrGoFanQueue");

    const client = typeof supabaseClient !== "undefined"
        ? supabaseClient : null;

    let previewUrl = null;
    let hostPassword = null;
    let busy = false;

    function validFile(file) {
        return file &&
            ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
            file.size > 0 &&
            file.size <= 5 * 1024 * 1024;
    }

    function updateSubmit() {
        submit.disabled = !client || busy ||
            !validFile(image.files[0]) ||
            !caption.value.trim() || !location.value;
    }

    async function callFunction(body) {
        if (!client?.functions?.invoke) {
            throw new Error("Supabase client is unavailable.");
        }

        const { data, error } = await client.functions.invoke(
            "go-fan", { body }
        );

        if (error) throw error;
        if (!data || data.ok !== true) {
            throw new Error(data?.message || "Request failed.");
        }

        return data;
    }

    image.addEventListener("change", () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = null;
        preview.removeAttribute("src");
        previewWrap.hidden = true;

        const file = image.files[0];

        if (!file) {
            updateSubmit();
            return;
        }

        if (!validFile(file)) {
            image.value = "";
            status.textContent =
                "Choose a JPEG, PNG or WebP photo up to 5 MiB.";
            updateSubmit();
            return;
        }

        previewUrl = URL.createObjectURL(file);
        preview.src = previewUrl;
        previewWrap.hidden = false;
        status.textContent = "Photo preview ready.";
        updateSubmit();
    });

    caption.addEventListener("input", updateSubmit);
    location.addEventListener("change", updateSubmit);

    form.addEventListener("submit", async event => {
        event.preventDefault();
        updateSubmit();
        if (submit.disabled) return;

        busy = true;
        updateSubmit();
        status.textContent = "Uploading...";

        try {
            const payload = new FormData();
            payload.append("action", "submit");
            payload.append("photo", image.files[0]);
            payload.append("caption", caption.value.trim());
            payload.append("location_id", location.value);

            await callFunction(payload);

            status.textContent =
                "Submitted successfully. Waiting for host approval.";
            form.reset();

            if (previewUrl) URL.revokeObjectURL(previewUrl);
            previewUrl = null;
            preview.removeAttribute("src");
            previewWrap.hidden = true;
        } catch (error) {
            console.error("GO FAN upload:", error);
            status.textContent =
                "Upload failed. Check the Edge Function logs.";
        } finally {
            busy = false;
            updateSubmit();
        }
    });

    async function loadGallery() {
        gallery.replaceChildren();
        galleryStatus.textContent = "Loading approved photos...";

        try {
            const data = await callFunction({
                action: "gallery",
                location_id: galleryFilter.value
            });

            const posts = Array.isArray(data.posts) ? data.posts : [];

            galleryStatus.textContent = posts.length
                ? `${posts.length} approved photo(s)`
                : "No approved photos yet.";

            for (const post of posts) {
                const url = post.image_url || post.signed_url;
                if (!url || !url.startsWith("https://")) continue;

                const card = document.createElement("article");
                card.className = "srkr-feature-card";

                const img = document.createElement("img");
                img.src = url;
                img.alt = post.caption || "Campus photo";
                img.loading = "lazy";
                img.style.cssText =
                    "width:100%;max-height:260px;object-fit:cover;border-radius:12px";

                const text = document.createElement("p");
                text.className = "srkr-feature-card-text";
                text.textContent = post.caption || "";

                const place = document.createElement("p");
                place.textContent = post.location_name || "";

                card.append(img, text, place);
                gallery.appendChild(card);
            }
        } catch (error) {
            console.error("GO FAN gallery:", error);
            galleryStatus.textContent = "Gallery could not load.";
        }
    }

    async function loadQueue() {
        queue.replaceChildren();
        hostStatus.textContent = "Loading pending submissions...";

        try {
            const data = await callFunction({
                action: "queue",
                password: hostPassword
            });

            const posts = Array.isArray(data.posts) ? data.posts : [];

            hostStatus.textContent = posts.length
                ? `${posts.length} photo(s) waiting for review.`
                : "No pending submissions.";

            for (const post of posts) {
                const url = post.image_url || post.signed_url;
                const card = document.createElement("article");
                card.className = "srkr-feature-card";

                if (url && url.startsWith("https://")) {
                    const img = document.createElement("img");
                    img.src = url;
                    img.alt = post.caption || "Pending photo";
                    img.style.cssText =
                        "width:100%;max-height:260px;object-fit:cover;border-radius:12px";
                    card.appendChild(img);
                }

                const captionText = document.createElement("p");
                captionText.textContent = post.caption || "";
                const place = document.createElement("p");
                place.textContent = post.location_name || "Campus";
                card.append(captionText, place);

                async function review(decision) {
                    const buttons = card.querySelectorAll("button");
                    buttons.forEach(button => button.disabled = true);

                    try {
                        await callFunction({
                            action: "review",
                            password: hostPassword,
                            post_id: post.id,
                            decision
                        });

                        hostStatus.textContent =
                            decision === "approved"
                                ? "Photo approved."
                                : "Photo rejected.";

                        await loadQueue();
                        await loadGallery();
                    } catch (error) {
                        console.error("GO FAN review:", error);
                        hostStatus.textContent =
                            "Review failed. Check backend logs.";
                        buttons.forEach(button => button.disabled = false);
                    }
                }

                const approve = document.createElement("button");
                approve.type = "button";
                approve.className = "srkr-feature-action";
                approve.textContent = "Approve";
                approve.addEventListener("click", () => review("approved"));

                const reject = document.createElement("button");
                reject.type = "button";
                reject.className = "srkr-feature-secondary-button";
                reject.textContent = "Reject";
                reject.addEventListener("click", () => review("rejected"));

                const remove = document.createElement("button");
                remove.type = "button";
                remove.className = "srkr-feature-secondary-button";
                remove.textContent = "Delete permanently";
                remove.addEventListener("click", async () => {
                    if (!confirm("Permanently delete this photo?")) return;

                    remove.disabled = true;
                    try {
                        await callFunction({
                            action: "delete",
                            password: hostPassword,
                            post_id: post.id
                        });
                        await loadQueue();
                        await loadGallery();
                    } catch (error) {
                        console.error("GO FAN delete:", error);
                        hostStatus.textContent =
                            "Delete failed. Check backend logs.";
                        remove.disabled = false;
                    }
                });

                card.append(approve, reject, remove);
                queue.appendChild(card);
            }
        } catch (error) {
            console.error("GO FAN host queue:", error);
            hostStatus.textContent =
                "Could not open queue. Verify host password and backend.";
        }
    }

    unlock.addEventListener("click", async () => {
        const password = prompt("Enter the host password:");
        if (!password) return;

        hostPassword = password;
        unlock.disabled = true;

        try {
            await loadQueue();
            unlock.textContent = "Refresh Host Queue";
        } finally {
            unlock.disabled = false;
        }
    });

    galleryFilter.addEventListener("change", loadGallery);

    updateSubmit();
    loadGallery();
}





    /* =====================================================
       FEATURE LAUNCHER
       ===================================================== */

    function createFeatureLauncher() {

        if (
            document.getElementById(
                "srkrFeatureLauncher"
            )
        ) {

            return;

        }


        const launcher =
            document.createElement(
                "section"
            );

        launcher.id =
            "srkrFeatureLauncher";

        launcher.className =
            "srkr-feature-launcher";


        launcher.innerHTML = `

            <div
                class="srkr-feature-launcher-grid"
            >

                ${SRKR_FEATURES.map(
                    function (feature) {

                        return `

                            <button
                                type="button"
                                class="srkr-feature-launcher-button"
                                data-srkr-feature="${escapeHTML(feature.id)}"
                            >

                                <span
                                    class="srkr-feature-launcher-icon"
                                >
                                    ${feature.icon}
                                </span>

                                <span
                                    class="srkr-feature-launcher-label"
                                >
                                    ${escapeHTML(feature.label)}
                                </span>

                            </button>

                        `;

                    }
                ).join("")}

            </div>

        `;


        /*
         * Place the feature launcher after
         * the existing main navigation/map
         * section instead of replacing anything.
         */

        const mapElement =
            document.getElementById(
                "map"
            );


        if (
            mapElement &&
            mapElement.parentElement
        ) {

            mapElement.parentElement.insertAdjacentElement(
                "afterend",
                launcher
            );

        } else {

            document.body.appendChild(
                launcher
            );

        }


        launcher
            .querySelectorAll(
                "[data-srkr-feature]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            openFeaturePanel(
                                button.dataset
                                    .srkrFeature
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    
window.SRKRFeatures = {
    open: openFeaturePanel,
    close: closeFeaturePanel,

    getFeatures: function () {
        return SRKR_FEATURES.slice();
    }
};

// Backward compatibility for scripts that call this by name.
window.openFeaturePanel = openFeaturePanel;



    /* =====================================================
       START
       ===================================================== */

    ready(
        function () {

            createFeatureLauncher();

            createFeatureOverlay();

        }
    );
/* =========================================================
   RECENT DESTINATION TRACKER
   ---------------------------------------------------------
   Watches the existing navigation engine.

   IMPORTANT:
   We do NOT replace buildLiveRoute().
   The original geo-fence + routing engine remains
   completely authoritative.
   ========================================================= */

let srkrLastRecordedDestination = null;


function watchSRKRRecentDestination() {

    if (
    typeof activeDestinationId ===
        "string" &&
    activeDestinationId &&
    typeof campusLocations !==
        "undefined" &&
    campusLocations &&
    campusLocations[
        activeDestinationId
    ]
) {

        if (
            activeDestinationId !==
            srkrLastRecordedDestination
        ) {

            addSRKRRecentDestination(
                activeDestinationId
            );

            srkrLastRecordedDestination =
                activeDestinationId;

        }

    }

}


setInterval(
    watchSRKRRecentDestination,
    500
);

})();
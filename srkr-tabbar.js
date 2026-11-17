/* =========================================================
   SRKR GO — APP TAB BAR (Home · Tools · Alerts · Manual)
   Does not touch GPS, routing or map logic.
========================================================= */
(function () {
    "use strict";

    if (window.SRKRTabs) return;

    var ICONS = {
        home:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
        tools:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
        alerts:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
        manual:
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M6.5 17H20v4H6.5A2.5 2.5 0 0 1 4 18.5"/></svg>'
    };

    var TABS = [
        { id: "home", label: "Home" },
        { id: "tools", label: "Tools" },
        { id: "alerts", label: "Alerts" },
        { id: "manual", label: "Manual" }
    ];

    var QUICK_TOOLS = [
        { id: "faculty", icon: "👨‍🏫", label: "Find Faculty" },
        { id: "quick", icon: "⚡", label: "Quick Facilities" },
        { id: "feedback", icon: "💬", label: "Feedback" },
        { id: "manual", icon: "📖", label: "User Manual" },
        { id: "developer", icon: "🧑‍💻", label: "Developer" }
    ];

    var currentView = "home";
    var manualOpen = false;
    var alertsOpen = false;
    var featureSnapshot = null;

    var bar = null;
    var toolsView = null;

    /* ---------- helpers ---------- */

    function clickIfExists(selector) {
        var element = document.querySelector(selector);

        if (element) {
            element.click();
        }
    }

    function openManual() {
        if (
            window.SRKRManual &&
            typeof window.SRKRManual.open === "function"
        ) {
            window.SRKRManual.open();
        }
    }

    function refreshMap() {
        window.setTimeout(function () {
            try {
                if (typeof map !== "undefined" && map) {
                    map.invalidateSize({ pan: false, animate: false });
                }
            } catch (error) {
                /* map is optional here */
            }
        }, 80);
    }

    function readActiveDestination() {
        try {
            return typeof activeDestinationId !== "undefined"
                ? activeDestinationId
                : null;
        } catch (error) {
            return null;
        }
    }

    function navigationIsPending() {
        try {
            return typeof navigationPending !== "undefined" &&
                navigationPending === true;
        } catch (error) {
            return false;
        }
    }

    /* ---------- active tab highlight ---------- */

    function render() {
        if (!bar) return;

        var activeId = manualOpen
            ? "manual"
            : alertsOpen
                ? "alerts"
                : currentView;

        bar.querySelectorAll("[data-tab]").forEach(function (button) {
            var active = button.dataset.tab === activeId;

            button.classList.toggle("is-active", active);

            if (active) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }
        });
    }

    /* ---------- Home / Tools ---------- */

    function setView(view) {
        if (view !== "home" && view !== "tools") return;

        currentView = view;

        document.body.setAttribute("data-srkr-tab", view);

        render();

        window.scrollTo({ top: 0, behavior: "auto" });

        if (view === "home") {
            refreshMap();
        }
    }

    /* ---------- build the bar ---------- */

    function buildBar() {
        bar = document.createElement("nav");
        bar.className = "srkr-tabbar";
        bar.setAttribute("aria-label", "Main navigation");

        bar.innerHTML =
            '<div class="srkr-tabbar-inner">' +
            TABS.map(function (tab) {
                return (
                    '<button type="button" class="srkr-tab" data-tab="' +
                    tab.id +
                    '">' +
                    ICONS[tab.id] +
                    "<span>" +
                    tab.label +
                    "</span></button>"
                );
            }).join("") +
            "</div>";

        document.body.appendChild(bar);

        bar.addEventListener("click", function (event) {
            var button = event.target.closest("[data-tab]");

            if (!button) return;

            var id = button.dataset.tab;

            if (id === "home") {
                if (currentView === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    setView("home");
                }
                return;
            }

            if (id === "tools") {
                setView("tools");
                return;
            }

            if (id === "alerts") {
                if (
                    window.SRKRFeatures &&
                    typeof window.SRKRFeatures.open === "function"
                ) {
                    window.SRKRFeatures.open("alerts");
                }
                return;
            }

            if (id === "manual") {
                openManual();
            }
        });
    }

    /* ---------- build the Tools page ---------- */

    function buildToolsView() {
        toolsView = document.createElement("section");
        toolsView.id = "srkrToolsView";
        toolsView.className = "srkr-tools-view";
        toolsView.setAttribute("aria-label", "Tools");

        toolsView.innerHTML =
            '<div class="srkr-tools-card">' +
            '<span class="srkr-tools-eyebrow">SRKR GO • TOOLBOARD</span>' +
            "<h2>Everything in one place</h2>" +
            '<p class="srkr-tools-lead">Open a tool below. When you start a route, SRKR Go takes you back to the map.</p>' +
            '<h3 class="srkr-tools-heading">Quick tools</h3>' +
            '<div class="srkr-tools-grid">' +
            QUICK_TOOLS.map(function (tool) {
                return (
                    '<button type="button" class="srkr-feature-launcher-button" data-tool="' +
                    tool.id +
                    '">' +
                    '<span class="srkr-feature-launcher-icon">' +
                    tool.icon +
                    "</span>" +
                    '<span class="srkr-feature-launcher-label">' +
                    tool.label +
                    "</span></button>"
                );
            }).join("") +
            "</div>" +
            '<h3 class="srkr-tools-heading">Campus features</h3>' +
            '<div id="srkrToolsFeatureSlot"></div>' +
            "</div>";

        var main = document.querySelector("main");

        if (main) {
            main.insertAdjacentElement("afterend", toolsView);
        } else {
            document.body.appendChild(toolsView);
        }

        toolsView.addEventListener("click", function (event) {
            var button = event.target.closest("[data-tool]");

            if (!button) return;

            switch (button.dataset.tool) {
                case "faculty":
                    clickIfExists(".faculty-finder-button");
                    break;
                case "quick":
                    clickIfExists(".quick-facilities-button");
                    break;
                case "feedback":
                    clickIfExists(".srkr-feedback-trigger");
                    break;
                case "developer":
                    clickIfExists("#developerProfileButton");
                    break;
                case "manual":
                    openManual();
                    break;
            }
        });

        adoptFeatureLauncher();
    }

    /* Move the existing 9-feature launcher into Tools. */
    function adoptFeatureLauncher() {
        var slot = document.getElementById("srkrToolsFeatureSlot");
        var launcher = document.getElementById("srkrFeatureLauncher");

        if (slot && launcher && launcher.parentElement !== slot) {
            slot.appendChild(launcher);
        }
    }

    /* ---------- cooperation with existing features ---------- */

    function wireEvents() {
        /* Manual open / close */
        document.addEventListener("srkr:popup-opened", function (event) {
            if (event.detail && event.detail.popupId === "manual") {
                manualOpen = true;
                render();
            }
        });

        document.addEventListener("srkr:popup-closed", function (event) {
            if (event.detail && event.detail.popupId === "manual") {
                manualOpen = false;
                render();
            }
        });

        /* Feature panels */
        document.addEventListener("srkr:feature-opened", function (event) {
            alertsOpen = Boolean(
                event.detail && event.detail.featureId === "alerts"
            );

            featureSnapshot = { destination: readActiveDestination() };

            render();
        });

        document.addEventListener("srkr:feature-closed", function () {
            alertsOpen = false;
            render();

            /*
             * If a feature started a route, return to the map.
             * Checked after the closing code finishes.
             */
            window.setTimeout(function () {
                if (
                    currentView !== "home" &&
                    featureSnapshot &&
                    (
                        navigationIsPending() ||
                        readActiveDestination() !== featureSnapshot.destination
                    )
                ) {
                    setView("home");
                }

                featureSnapshot = null;
            }, 0);
        });

        /* Navigation started from the main flow */
        document.addEventListener(
            "srkr:destination-changed",
            function (event) {
                if (
                    event.detail &&
                    event.detail.destinationId &&
                    currentView !== "home"
                ) {
                    setView("home");
                }
            }
        );

        /*
         * Faculty "Show on Map" / "Navigate" and Quick Facilities options
         * need the map visible before they run.
         */
        document.addEventListener(
            "click",
            function (event) {
                if (currentView === "home") return;

                var target =
                    event.target instanceof Element ? event.target : null;

                if (
                    target &&
                    target.closest(
                        ".faculty-map-button, .faculty-route-button, .quick-facility-option"
                    )
                ) {
                    setView("home");
                }
            },
            true
        );
    }

    /* ---------- public API ---------- */

    window.SRKRTabs = {
        current: function () {
            return currentView;
        },
        show: setView
    };

    /* ---------- start ---------- */

    function init() {
        buildBar();
        buildToolsView();
        wireEvents();

        document.body.setAttribute("data-srkr-tab", "home");
        render();

        /* Safety net if the launcher was created late. */
        window.addEventListener("load", adoptFeatureLauncher);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

})();
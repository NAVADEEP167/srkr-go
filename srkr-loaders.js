/* =========================================================
   SRKR GO — LOADERS & NETWORK STATUS
   Skeletons · spinners · pulsing · offline banner ·
   top progress bar · pull-to-refresh.
   Does not touch GPS, routing or map logic.
========================================================= */
(function () {
    "use strict";

    if (window.SRKRLoaders) return;

    /* ---------- state ---------- */

    var inflight = 0;
    var barTimer = null;
    var slowTimer = null;
    var barEl = null;

    var toastEl = null;
    var toastTimer = null;
    var lastErrorToast = 0;
    var lastTileToast = 0;
    var tileErrors = [];

    var offEl = null;
    var offTimer = null;

    var refreshing = false;

    var nativeFetch = window.fetch ? window.fetch.bind(window) : null;

    /* ---------- helpers ---------- */

    function ready(fn) {
        if (document.body) {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        }
    }

    function make(tag, cls, html) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (html != null) node.innerHTML = html;
        return node;
    }

    function esc(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    /* =====================================================
       TOAST
    ===================================================== */

    function toast(message, options) {
        options = options || {};

        ready(function () {
            if (!toastEl) {
                toastEl = make("div", "srkr-toast");
                toastEl.setAttribute("role", "status");
                toastEl.setAttribute("aria-live", "polite");
                document.body.appendChild(toastEl);
            }

            toastEl.className = "srkr-toast tone-" + (options.tone || "info");
            toastEl.dataset.id = options.id || "";

            toastEl.innerHTML =
                '<span class="srkr-toast-dot"></span>' +
                '<span class="srkr-toast-text"></span>' +
                (options.action
                    ? '<button type="button" class="srkr-toast-action"></button>'
                    : "");

            toastEl.querySelector(".srkr-toast-text").textContent = message;

            var actionButton = toastEl.querySelector(".srkr-toast-action");

            if (actionButton) {
                actionButton.textContent = options.label || "Retry";
                actionButton.addEventListener("click", function () {
                    hideToast();
                    options.action();
                });
            }

            void toastEl.offsetWidth;
            toastEl.classList.add("is-open");

            clearTimeout(toastTimer);

            if (!options.sticky) {
                toastTimer = setTimeout(function () {
                    hideToast();
                }, options.ms || 4500);
            }
        });
    }

    function hideToast(id) {
        if (!toastEl) return;
        if (id && toastEl.dataset.id !== id) return;

        toastEl.classList.remove("is-open");
        clearTimeout(toastTimer);
    }

    /* =====================================================
       TOP PROGRESS BAR + REQUEST TRACKING
    ===================================================== */

    function barStart() {
        if (!barEl) {
            barEl = make("div", "srkr-netbar", "<span></span>");
            barEl.setAttribute("aria-hidden", "true");
            document.body.appendChild(barEl);
        }

        var fill = barEl.firstChild;

        barEl.classList.add("is-on");

        fill.style.transition = "none";
        fill.style.width = "0%";
        void fill.offsetWidth;
        fill.style.transition = "width 8s cubic-bezier(.1,.7,.2,1)";
        fill.style.width = "85%";
    }

    function barDone() {
        if (!barEl || !barEl.classList.contains("is-on")) return;

        var fill = barEl.firstChild;

        fill.style.transition = "width .2s ease";
        fill.style.width = "100%";

        setTimeout(function () {
            barEl.classList.remove("is-on");
        }, 260);
    }

    function requestBegin() {
        inflight++;

        if (inflight !== 1) return;

        barTimer = setTimeout(function () {
            if (inflight > 0) ready(barStart);
        }, 400);

        slowTimer = setTimeout(function () {
            if (inflight > 0) {
                toast("Slow connection — still loading…", {
                    sticky: true,
                    tone: "warn",
                    id: "slow"
                });
            }
        }, 7000);
    }

    function requestEnd() {
        inflight = Math.max(0, inflight - 1);

        if (inflight !== 0) return;

        clearTimeout(barTimer);
        clearTimeout(slowTimer);

        barDone();
        hideToast("slow");
    }

    function requestFailed(error) {
        if (error && error.name === "AbortError") return;

        /* The offline banner already explains this case. */
        if (navigator.onLine === false) return;

        var now = Date.now();

        if (now - lastErrorToast < 20000) return;

        lastErrorToast = now;

        toast("Connection problem. Some data couldn't load.", {
            tone: "error",
            action: refreshData,
            label: "Retry"
        });
    }

    /*
     * Wrap fetch so every request (including Supabase and the
     * weather call) shows the progress bar and slow-network notice.
     * This file must load BEFORE script.js.
     */
    if (nativeFetch) {
        window.fetch = function () {
            var promise = nativeFetch.apply(null, arguments);

            requestBegin();

            return promise.then(
                function (response) {
                    requestEnd();
                    return response;
                },
                function (error) {
                    requestEnd();
                    requestFailed(error);
                    throw error;
                }
            );
        };
    }

    /* =====================================================
       OFFLINE / ONLINE BANNER
    ===================================================== */

    function ensureOfflineBanner() {
        if (offEl) return offEl;

        offEl = make(
            "div",
            "srkr-offline",
            '<span class="srkr-offline-dot"></span>' +
            '<span class="srkr-offline-text"></span>' +
            '<button type="button" class="srkr-offline-retry">Retry</button>'
        );

        offEl.setAttribute("role", "status");
        offEl.setAttribute("aria-live", "polite");

        document.body.appendChild(offEl);

        offEl
            .querySelector(".srkr-offline-retry")
            .addEventListener("click", checkConnection);

        return offEl;
    }

    function showOffline() {
        ready(function () {
            ensureOfflineBanner();

            clearTimeout(offTimer);

            offEl.className = "srkr-offline is-open is-off";

            offEl.querySelector(".srkr-offline-text").textContent =
                "You're offline — check your connection";

            document.body.classList.add("srkr-is-offline");
        });
    }

    function showBackOnline() {
        ready(function () {
            ensureOfflineBanner();

            clearTimeout(offTimer);

            offEl.className = "srkr-offline is-open is-on";

            offEl.querySelector(".srkr-offline-text").textContent =
                "Back online";

            document.body.classList.remove("srkr-is-offline");

            offTimer = setTimeout(function () {
                offEl.classList.remove("is-open");
            }, 2400);

            refreshData();
        });
    }

    function checkConnection() {
        if (!nativeFetch) return;

        nativeFetch(location.href.split("#")[0], {
            method: "HEAD",
            cache: "no-store"
        })
            .then(function () {
                showBackOnline();
            })
            .catch(function () {
                toast("Still offline. Check Wi-Fi or mobile data.", {
                    tone: "warn"
                });
            });
    }

    window.addEventListener("offline", showOffline);

    window.addEventListener("online", function () {
        if (offEl && offEl.classList.contains("is-off")) {
            showBackOnline();
        }
    });

    ready(function () {
        if (navigator.onLine === false) {
            showOffline();
        }

        /* One-time hint on very slow networks. */
        try {
            var connection =
                navigator.connection ||
                navigator.mozConnection ||
                navigator.webkitConnection;

            if (
                connection &&
                /(^|-)2g$/.test(String(connection.effectiveType || ""))
            ) {
                toast("Slow network detected — loading may take longer.", {
                    tone: "warn",
                    ms: 5000
                });
            }
        } catch (error) {
            /* optional */
        }
    });

    /* =====================================================
       MAP: SLOW LOADING + TILE FAILURES
    ===================================================== */

    ready(function () {
        setTimeout(function () {
            var overlay = document.getElementById("mapLoading");

            if (
                overlay &&
                !overlay.classList.contains("hidden") &&
                !overlay.querySelector(".srkr-map-retry")
            ) {
                overlay.insertAdjacentHTML(
                    "beforeend",
                    '<div class="srkr-map-retry">' +
                    "<span>Taking longer than usual…</span>" +
                    '<button type="button">Reload</button>' +
                    "</div>"
                );

                overlay
                    .querySelector(".srkr-map-retry button")
                    .addEventListener("click", function () {
                        location.reload();
                    });
            }
        }, 12000);
    });

    /* Image errors don't bubble, so listen in the capture phase. */
    window.addEventListener(
        "error",
        function (event) {
            var target = event.target;

            if (
                !target ||
                target.tagName !== "IMG" ||
                !target.classList ||
                !target.classList.contains("leaflet-tile")
            ) {
                return;
            }

            var now = Date.now();

            tileErrors.push(now);

            tileErrors = tileErrors.filter(function (time) {
                return now - time < 8000;
            });

            if (tileErrors.length >= 6 && now - lastTileToast > 30000) {
                lastTileToast = now;

                toast("Map tiles are slow to load. Check your connection.", {
                    tone: "warn"
                });
            }
        },
        true
    );

    /* =====================================================
       SKELETON LOADERS
    ===================================================== */

    function skeletonRows(count) {
        var html = "";

        for (var i = 0; i < count; i++) {
            html +=
                '<div class="srkr-skel srkr-skel-row">' +
                '<span class="srkr-skel-box"></span>' +
                '<span class="srkr-skel-lines">' +
                '<i class="w60"></i><i class="w85"></i>' +
                "</span></div>";
        }

        return '<div class="srkr-skel-list">' + html + "</div>";
    }

    function skeletonCards(count) {
        var html = "";

        for (var i = 0; i < count; i++) {
            html +=
                '<div class="srkr-skel srkr-skel-card">' +
                '<i class="pill"></i>' +
                '<i class="t w70"></i>' +
                '<i class="w95"></i>' +
                '<i class="w80"></i>' +
                "</div>";
        }

        return '<div class="srkr-skel-list">' + html + "</div>";
    }

    function skeletonFeedback(count) {
        var html = "";

        for (var i = 0; i < count; i++) {
            html +=
                '<div class="srkr-skel srkr-skel-card">' +
                '<i class="pill"></i>' +
                '<i class="w95"></i>' +
                '<i class="w75"></i>' +
                '<i class="votes"></i>' +
                "</div>";
        }

        return '<div class="srkr-skel-list">' + html + "</div>";
    }

    var LOADING_TEXT =
        /^\s*(loading|getting your location|finding places)/i;

    var LOADING_CANDIDATES =
        ".srkr-feature-loading, .srkr-feedback-loading, .srkr-feature-empty";

    function skeletonFor(node) {
        if (node.closest("#srkrAlertFeed")) return skeletonCards(3);
        if (node.closest(".srkr-feedback-feed")) return skeletonFeedback(3);

        return skeletonRows(4);
    }

    function convertLoadingNode(node) {
        if (node.dataset.srkrSkel) return;

        var text = (node.textContent || "").trim();

        if (!LOADING_TEXT.test(text)) return;

        node.dataset.srkrSkel = "1";
        node.classList.add("srkr-skel-holder");
        node.setAttribute("aria-busy", "true");

        node.innerHTML =
            skeletonFor(node) +
            '<span class="srkr-sr-only">' + esc(text) + "</span>";
    }

    function enhanceTree(root) {
        if (!(root instanceof Element)) return;
        if (root.closest && root.closest("#map")) return;

        if (root.matches && root.matches(LOADING_CANDIDATES)) {
            convertLoadingNode(root);
        }

        if (root.querySelectorAll) {
            root
                .querySelectorAll(LOADING_CANDIDATES)
                .forEach(convertLoadingNode);
        }
    }

    /* =====================================================
       PULSING TEXT
    ===================================================== */

    var PULSE_TEXT =
        /^[^a-z]*(loading|uploading|submitting|publishing|finding|checking|getting|verifying|deleting|searching|locating)\b/i;

    var PULSE_TARGETS =
        '[role="status"], [aria-live], #userCount, ' +
        "#activeUserCount, .srkr-feedback-submit-status";

    function pulseCheck(node) {
        if (node && node.nodeType === 3) node = node.parentElement;
        if (!node || node.nodeType !== 1) return;
        if (!node.matches(PULSE_TARGETS)) return;

        var pulsing =
            node.children.length === 0 &&
            PULSE_TEXT.test(node.textContent || "");

        node.classList.toggle("srkr-pulse-text", pulsing);
    }

    /* =====================================================
       BUTTON LOADERS
    ===================================================== */

    var BUTTON_ALWAYS =
        ".srkr-feedback-submit, .srkr-host-post, " +
        ".srkr-host-delete-confirm, #srkrAlertPublishButton, " +
        "[data-delete-alert], .srkr-feedback-vote, " +
        "#srkrGoFanHostUnlock";

    function buttonCheck(button) {
        if (!button || button.tagName !== "BUTTON") return;

        var spinning = false;

        if (button.disabled) {
            if (button.matches(BUTTON_ALWAYS)) {
                spinning = true;
            } else if (/\.\.\.|…/.test(button.textContent || "")) {
                spinning = true;
            } else if (button.id === "srkrGoFanSubmit") {
                var status = document.getElementById("srkrGoFanStatus");

                spinning = Boolean(
                    status && /uploading/i.test(status.textContent || "")
                );
            }
        }

        button.classList.toggle("srkr-btn-loading", spinning);

        if (spinning) {
            button.setAttribute("aria-busy", "true");
        } else {
            button.removeAttribute("aria-busy");
        }
    }

    /* =====================================================
       ONE OBSERVER FOR ALL OF THE ABOVE
    ===================================================== */

    function startObserver() {
        var observer = new MutationObserver(function (records) {
            records.forEach(function (record) {
                if (record.type === "attributes") {
                    buttonCheck(record.target);
                    return;
                }

                if (record.type === "characterData") {
                    pulseCheck(record.target);
                    return;
                }

                pulseCheck(record.target);

                record.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) enhanceTree(node);
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["disabled"]
        });

        /* Upgrade anything already on the page. */
        enhanceTree(document.body);

        document.querySelectorAll(PULSE_TARGETS).forEach(pulseCheck);
    }

    /* =====================================================
       PULSING RADAR WHILE WAITING FOR GPS
    ===================================================== */

    var radarEl = null;
    var radarSince = 0;

    function routeIsWaiting() {
        try {
            return (
                typeof navigationPending !== "undefined" &&
                navigationPending === true &&
                !(
                    typeof navigationActive !== "undefined" &&
                    navigationActive === true
                )
            );
        } catch (error) {
            return false;
        }
    }

    function updateRadar() {
        var mapBox = document.getElementById("map");

        if (!mapBox) return;

        if (routeIsWaiting()) {
            if (!radarEl || !radarEl.isConnected) {
                radarEl = make(
                    "div",
                    "srkr-radar",
                    '<span class="srkr-radar-dot"></span>' +
                    '<span class="srkr-radar-text"></span>'
                );

                radarEl.setAttribute("role", "status");
                mapBox.appendChild(radarEl);

                radarSince = Date.now();
            }

            radarEl.querySelector(".srkr-radar-text").textContent =
                Date.now() - radarSince > 12000
                    ? "Weak GPS signal — try moving to open sky"
                    : "Locating you on campus…";

            return;
        }

        if (radarEl) {
            radarEl.remove();
            radarEl = null;
        }
    }

    /* =====================================================
       REFRESH LIVE DATA
    ===================================================== */

    function refreshData() {
        if (refreshing) return Promise.resolve();

        refreshing = true;

        try {
            var counter = document.getElementById("userCount");

            if (counter) counter.textContent = "Loading...";

            if (typeof updateSRKRGoUserCount === "function") {
                updateSRKRGoUserCount();
            }
        } catch (error) {
            /* optional */
        }

        try {
            if (typeof updateSRKRGoActiveUsers === "function") {
                updateSRKRGoActiveUsers();
            }
        } catch (error) {
            /* optional */
        }

        /* Existing listeners (weather etc.) refresh on visibility. */
        try {
            document.dispatchEvent(new Event("visibilitychange"));
        } catch (error) {
            /* optional */
        }

        document.dispatchEvent(new CustomEvent("srkr:refresh"));

        return new Promise(function (resolve) {
            var started = Date.now();

            (function wait() {
                var elapsed = Date.now() - started;

                if ((elapsed > 900 && inflight === 0) || elapsed > 7000) {
                    refreshing = false;
                    resolve();
                    return;
                }

                setTimeout(wait, 150);
            })();
        });
    }

    /* =====================================================
       PULL TO REFRESH
    ===================================================== */

    var BLOCKED_AREAS =
        "#map, .srkr-feature-overlay, .faculty-overlay, " +
        ".quick-facilities-overlay, .srkr-feedback-overlay, " +
        ".srkr-host-reply-overlay, .srkr-manual-overlay, " +
        ".srkr-checkpoint-overlay, .developer-social-overlay, " +
        ".srkr-fan-destination-overlay, #srkrWelcome, " +
        ".search-suggestions, .srkr-navigation-panel, " +
        ".srkr-tabbar, input, textarea, select";

    var BLOCKED_BODY_CLASSES = [
        "srkr-manual-open",
        "srkr-feature-modal-open",
        "quick-facilities-open",
        "faculty-modal-open",
        "srkr-feedback-modal-open",
        "srkr-location-media-open",
        "srkr-fan-popup-open"
    ];

    function pullIsBlocked(target) {
        if (!(target instanceof Element)) return true;
        if (target.closest(BLOCKED_AREAS)) return true;

        for (var i = 0; i < BLOCKED_BODY_CLASSES.length; i++) {
            if (document.body.classList.contains(BLOCKED_BODY_CLASSES[i])) {
                return true;
            }
        }

        if (
            window.SRKRNavigation &&
            typeof window.SRKRNavigation.isActive === "function" &&
            window.SRKRNavigation.isActive()
        ) {
            return true;
        }

        return false;
    }

    function startPullToRefresh() {
        var indicator = make(
            "div",
            "srkr-ptr",
            '<div class="srkr-ptr-ring">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 5v11M7 12l5 5 5-5"/></svg>' +
            '<span class="srkr-ptr-spin"></span></div>'
        );

        indicator.setAttribute("aria-hidden", "true");
        document.body.appendChild(indicator);

        var THRESHOLD = 70;
        var MAX_PULL = 110;

        var startY = 0;
        var distance = 0;
        var tracking = false;
        var pulling = false;

        function place(amount) {
            indicator.style.transform =
                "translate(-50%, " + (amount - 56) + "px)";

            indicator.style.opacity = String(
                Math.min(1, amount / THRESHOLD)
            );
        }

        function reset() {
            tracking = false;
            pulling = false;
            distance = 0;

            indicator.classList.add("is-animating");
            indicator.classList.remove("is-ready");

            indicator.style.transform = "";
            indicator.style.opacity = "";

            setTimeout(function () {
                indicator.classList.remove("is-animating");
            }, 260);
        }

        document.addEventListener(
            "touchstart",
            function (event) {
                if (refreshing || event.touches.length !== 1) return;
                if (window.scrollY > 2) return;
                if (pullIsBlocked(event.target)) return;

                startY = event.touches[0].clientY;
                tracking = true;
                pulling = false;
                distance = 0;
            },
            { passive: true }
        );

        document.addEventListener(
            "touchmove",
            function (event) {
                if (!tracking) return;

                var delta = event.touches[0].clientY - startY;

                if (delta <= 0) {
                    if (pulling) {
                        reset();
                    } else {
                        tracking = false;
                    }

                    return;
                }

                if (window.scrollY > 2) {
                    tracking = false;
                    return;
                }

                pulling = true;
                distance = Math.min(MAX_PULL, delta * 0.5);

                if (event.cancelable) event.preventDefault();

                indicator.classList.remove("is-animating");
                indicator.classList.toggle("is-ready", distance >= THRESHOLD);

                place(distance);
            },
            { passive: false }
        );

        function finishPull() {
            if (!tracking) return;

            var shouldRefresh = pulling && distance >= THRESHOLD;

            tracking = false;

            if (!shouldRefresh) {
                reset();
                return;
            }

            indicator.classList.add("is-animating", "is-refreshing");
            indicator.classList.remove("is-ready");

            indicator.style.opacity = "1";
            indicator.style.transform = "translate(-50%, 8px)";

            refreshData().then(function () {
                indicator.classList.remove("is-refreshing");

                reset();

                toast("Updated", { ms: 1600 });
            });
        }

        document.addEventListener("touchend", finishPull, {
            passive: true
        });

        document.addEventListener("touchcancel", reset, {
            passive: true
        });
    }

    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.SRKRLoaders = {
        toast: toast,
        refresh: refreshData,

        skeleton: {
            rows: skeletonRows,
            cards: skeletonCards,
            feedback: skeletonFeedback
        },

        /* Manual control for any button: SRKRLoaders.button(btn, true) */
        button: function (button, on) {
            if (!button) return;

            button.classList.toggle("srkr-btn-loading", Boolean(on));
        }
    };

    /* =====================================================
       START
    ===================================================== */

    ready(function () {
        startObserver();
        startPullToRefresh();

        setInterval(updateRadar, 600);
    });

})();
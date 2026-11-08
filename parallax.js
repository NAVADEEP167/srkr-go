
/* =========================================================
   SRKR GO — PARALLAX
   Mouse + phone tilt + intro scroll + page scroll.
   Never touches the map.
========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var STORAGE_KEY = "srkrParallax";

    var userOn = true;
    try {
        userOn = localStorage.getItem(STORAGE_KEY) !== "off";
    } catch (e) {}

    var target = { x: 0, y: 0 };
    var cur = { x: 0, y: 0 };

    window.srkrParallax = { x: 0, y: 0 };

    /* Existing page decorations. */
    var FIXED_LAYERS = [
        { sel: ".glow-one",              depth: 30,  scroll: 0.08 },
        { sel: ".glow-two",              depth: -22, scroll: -0.06 },
        { sel: ".header-decoration-one", depth: 14,  scroll: 0.10 },
        { sel: ".header-decoration-two", depth: -10, scroll: 0.14 },
        { sel: ".header-route-line",     depth: 8,   scroll: 0 },
        { sel: ".srkr-logo-orbit",       depth: 5,   scroll: 0 }
    ];

    var pageLayers = [];
    var introLayers = [];

    var intro = document.getElementById("srkrWelcome");
    var introScroller = document.getElementById("srkrIntroScroll");

    function collect() {
        pageLayers = [];
        introLayers = [];

        FIXED_LAYERS.forEach(function (item) {
            document.querySelectorAll(item.sel).forEach(function (el) {
                pageLayers.push({
                    el: el,
                    depth: item.depth,
                    scroll: item.scroll
                });
            });
        });

        /*
         * Only collect atmospheric elements inside the intro.
         * Never collect map markers or other campus elements.
         */
        if (intro) {
            intro.querySelectorAll("[data-px]").forEach(function (el) {
                introLayers.push({
                    el: el,
                    depth: parseFloat(el.getAttribute("data-px")) || 0
                });
            });
        }
    }

    function isNavigating() {
        return !!document.querySelector(
            ".srkr-navigation-panel.visible"
        );
    }

    function isEnabled() {
        return userOn &&
            !reduceMotion.matches &&
            !document.hidden &&
            !isNavigating();
    }

    function clearLayers(collection) {
        collection.forEach(function (layer) {
            if (layer.el.isConnected) {
                layer.el.style.translate = "";
            }
        });
    }

    function clearAll() {
        cur.x = 0;
        cur.y = 0;

        window.srkrParallax.x = 0;
        window.srkrParallax.y = 0;

        clearLayers(pageLayers);
        clearLayers(introLayers);
    }

    var raf = 0;

    function apply() {
        var pageScrollY = window.scrollY || 0;
        var introScrollY = introScroller
            ? introScroller.scrollTop
            : 0;

        pageLayers = pageLayers.filter(function (layer) {
            return layer.el.isConnected;
        });

        introLayers = introLayers.filter(function (layer) {
            return layer.el.isConnected;
        });

        /* Existing page decorations. */
        pageLayers.forEach(function (layer) {
            var x = cur.x * layer.depth;
            var y = cur.y * layer.depth +
                pageScrollY * layer.scroll;

            layer.el.style.translate =
                x.toFixed(2) + "px " +
                y.toFixed(2) + "px";
        });

        /* New cinematic intro atmosphere. */
        introLayers.forEach(function (layer) {
            var x = cur.x * layer.depth;
            var y = cur.y * layer.depth +
                introScrollY * 0.035;

            layer.el.style.translate =
                x.toFixed(2) + "px " +
                y.toFixed(2) + "px";
        });

        window.srkrParallax.x = cur.x;
        window.srkrParallax.y = cur.y;
    }

    function tick() {
        raf = 0;

        if (!isEnabled()) {
            clearAll();
            return;
        }

        cur.x += (target.x - cur.x) * 0.08;
        cur.y += (target.y - cur.y) * 0.08;

        apply();

        if (
            Math.abs(target.x - cur.x) > 0.002 ||
            Math.abs(target.y - cur.y) > 0.002
        ) {
            raf = requestAnimationFrame(tick);
        }
    }

    function request() {
        if (!raf) {
            raf = requestAnimationFrame(tick);
        }
    }

    function clamp(value) {
        return Math.max(-1, Math.min(1, value));
    }

    /* ---------- Mouse ---------- */
    window.addEventListener("pointermove", function (event) {
        if (event.pointerType !== "mouse") return;

        target.x = (event.clientX / window.innerWidth) * 2 - 1;
        target.y = (event.clientY / window.innerHeight) * 2 - 1;

        request();
    }, { passive: true });

    document.addEventListener("mouseleave", function () {
        target.x = 0;
        target.y = 0;
        request();
    });

    /* ---------- Phone tilt ---------- */
    var base = null;
    var tiltListening = false;

    function onTilt(event) {
        if (event.gamma == null || event.beta == null) return;

        if (!base) {
            base = { g: event.gamma, b: event.beta };
        }

        base.g += (event.gamma - base.g) * 0.01;
        base.b += (event.beta - base.b) * 0.01;

        target.x = clamp((event.gamma - base.g) / 25);
        target.y = clamp((event.beta - base.b) / 25);

        request();
    }

    function startTilt() {
        if (tiltListening) return;

        tiltListening = true;

        window.addEventListener(
            "deviceorientation",
            onTilt,
            { passive: true }
        );
    }

    function enableTilt() {
        if (typeof DeviceOrientationEvent === "undefined") return;

        if (
            typeof DeviceOrientationEvent.requestPermission ===
            "function"
        ) {
            DeviceOrientationEvent.requestPermission()
                .then(function (state) {
                    if (state === "granted") startTilt();
                })
                .catch(function () {});
        } else {
            startTilt();
        }
    }

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission !== "function"
    ) {
        startTilt();
    }

    var startButton = document.getElementById("srkrStartButton");

    if (startButton) {
        startButton.addEventListener("click", enableTilt);
    }

    /* ---------- Page and intro scrolling ---------- */
    window.addEventListener("scroll", request, { passive: true });

    if (introScroller) {
        introScroller.addEventListener(
            "scroll",
            request,
            { passive: true }
        );
    }

    /* ---------- Pause / resume ---------- */
    document.addEventListener("visibilitychange", request);

    if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener("change", request);
    }

    var navWatcher = new MutationObserver(request);

    navWatcher.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
    });

    /* ---------- Motion toggle ---------- */
    function addToggle() {
        var host = document.querySelector("footer .footer-content");

        if (!host || host.querySelector(".px-toggle")) return;

        var button = document.createElement("button");

        button.type = "button";
        button.className = "px-toggle";

        function updateLabel() {
            button.textContent = userOn
                ? "✨ Motion: On"
                : "✨ Motion: Off";

            button.setAttribute(
                "aria-pressed",
                String(userOn)
            );
        }

        button.addEventListener("click", function () {
            userOn = !userOn;

            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    userOn ? "on" : "off"
                );
            } catch (e) {}

            updateLabel();

            if (userOn) {
                request();
            } else {
                clearAll();
            }
        });

        updateLabel();
        host.appendChild(button);
    }

    /* ---------- Init ---------- */
    collect();
    addToggle();
    request();

})();

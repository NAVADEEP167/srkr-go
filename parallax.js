/* =========================================================
   SRKR GO — PARALLAX
   Mouse + phone tilt + scroll. Never touches the map.
========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var STORAGE_KEY = "srkrParallax";

    var userOn = true;
    try { userOn = localStorage.getItem(STORAGE_KEY) !== "off"; } catch (e) {}

    /* Normalised pointer/tilt position, -1 to 1 */
    var target = { x: 0, y: 0 };
    var cur = { x: 0, y: 0 };

    /* Shared with the starfield in script.js */
    window.srkrParallax = { x: 0, y: 0 };

    /* depth = max shift in px. scroll = px per scrolled px. */
    var FIXED_LAYERS = [
        { sel: ".glow-one",              depth: 30,  scroll: 0.08 },
        { sel: ".glow-two",              depth: -22, scroll: -0.06 },
        { sel: ".header-decoration-one", depth: 14,  scroll: 0.10 },
        { sel: ".header-decoration-two", depth: -10, scroll: 0.14 },
        { sel: ".header-route-line",     depth: 8,   scroll: 0 },
        { sel: ".srkr-logo-orbit",       depth: 5,   scroll: 0 },
        { sel: ".srkr-welcome-card",     depth: -8,  scroll: 0 }
    ];

    var layers = [];

    function collect() {
        layers = [];

        FIXED_LAYERS.forEach(function (item) {
            document.querySelectorAll(item.sel).forEach(function (el) {
                layers.push({ el: el, depth: item.depth, scroll: item.scroll });
            });
        });

        document.querySelectorAll("[data-px]").forEach(function (el) {
            layers.push({
                el: el,
                depth: parseFloat(el.getAttribute("data-px")) || 0,
                scroll: 0
            });
        });
    }

    function isNavigating() {
        return !!document.querySelector(".srkr-navigation-panel.visible");
    }

    function isEnabled() {
        return userOn && !reduceMotion.matches && !document.hidden && !isNavigating();
    }

    function clearAll() {
        cur.x = cur.y = 0;
        window.srkrParallax.x = 0;
        window.srkrParallax.y = 0;

        layers.forEach(function (layer) {
            if (layer.el.isConnected) layer.el.style.translate = "";
        });
    }

    var raf = 0;

    function apply() {
        var scrollY = window.scrollY || 0;

        layers = layers.filter(function (layer) { return layer.el.isConnected; });

        layers.forEach(function (layer) {
            var x = cur.x * layer.depth;
            var y = cur.y * layer.depth + scrollY * layer.scroll;
            layer.el.style.translate = x.toFixed(2) + "px " + y.toFixed(2) + "px";
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
        if (!raf) raf = requestAnimationFrame(tick);
    }

    function clamp(v) { return Math.max(-1, Math.min(1, v)); }

    /* ---------- Mouse (desktop) ---------- */
    window.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = (e.clientY / window.innerHeight) * 2 - 1;
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

    function onTilt(e) {
        if (e.gamma == null || e.beta == null) return;

        if (!base) base = { g: e.gamma, b: e.beta };

        /* Baseline slowly follows how the phone is held */
        base.g += (e.gamma - base.g) * 0.01;
        base.b += (e.beta - base.b) * 0.01;

        target.x = clamp((e.gamma - base.g) / 25);
        target.y = clamp((e.beta - base.b) / 25);
        request();
    }

    function startTilt() {
        if (tiltListening) return;
        tiltListening = true;
        window.addEventListener("deviceorientation", onTilt, { passive: true });
    }

    function enableTilt() {
        if (typeof DeviceOrientationEvent === "undefined") return;

        /* iOS needs a permission request from a user tap */
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
            DeviceOrientationEvent.requestPermission()
                .then(function (state) { if (state === "granted") startTilt(); })
                .catch(function () {});
        } else {
            startTilt();
        }
    }

    /* Android / desktop: start straight away. iOS: wait for the tap. */
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

    /* ---------- Scroll ---------- */
    window.addEventListener("scroll", request, { passive: true });

    /* ---------- Pause / resume ---------- */
    document.addEventListener("visibilitychange", request);

    if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener("change", request);
    }

    /* Navigation panel opening/closing (class change) */
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

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "px-toggle";

        function label() {
            btn.textContent = userOn ? "✨ Motion: On" : "✨ Motion: Off";
            btn.setAttribute("aria-pressed", String(userOn));
        }

        btn.addEventListener("click", function () {
            userOn = !userOn;
            try { localStorage.setItem(STORAGE_KEY, userOn ? "on" : "off"); } catch (e) {}
            label();
            if (userOn) request(); else clearAll();
        });

        label();
        host.appendChild(btn);
    }

    /* ---------- Init ---------- */
    collect();
    addToggle();
    request();
})();
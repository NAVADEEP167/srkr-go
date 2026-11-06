/* =========================================================
   SRKR GO — USER MANUAL PANEL
   Independent controller.
   Does not modify navigation logic.
========================================================= */

(function () {

    "use strict";


    function initUserManual() {

        const panel =
            document.getElementById("srkrUserManual");

        const openButton =
            document.getElementById("srkrOpenManual");

        const closeButton =
            document.getElementById("srkrCloseManual");

        const doneButton =
            document.getElementById("srkrManualDone");

        const content =
            document.getElementById("srkrManualContent");


        if (
            !panel ||
            !openButton ||
            !closeButton ||
            !doneButton ||
            !content
        ) {
            return;
        }


        let previousFocus = null;

        const welcomeScreen =
            document.getElementById("srkrWelcome");

        let welcomeWasAriaHidden = null;


        /* =====================================================
           OPEN MANUAL
        ===================================================== */

        function openManual() {
    previousFocus = document.activeElement;

    // Remember that this user has opened the manual.
    try {
        localStorage.setItem("srkrGoManualOpened_v1", "true");
    } catch (error) {
        console.warn("SRKR Go: Could not save manual visit.", error);
    }

            if (welcomeScreen) {

                welcomeWasAriaHidden =
                    welcomeScreen.getAttribute("aria-hidden");

                welcomeScreen.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            panel.hidden = false;

            document.body.classList.add(
                "srkr-manual-open"
            );


            closeButton.focus();

        }


        /* =====================================================
           CLOSE MANUAL
        ===================================================== */

        function closeManual() {

            if (panel.hidden) {
                return;
            }


            panel.hidden = true;

            document.body.classList.remove(
                "srkr-manual-open"
            );


            if (welcomeScreen) {

                if (welcomeWasAriaHidden === null) {

                    welcomeScreen.removeAttribute(
                        "aria-hidden"
                    );

                } else {

                    welcomeScreen.setAttribute(
                        "aria-hidden",
                        welcomeWasAriaHidden
                    );

                }

            }


            if (
                previousFocus &&
                typeof previousFocus.focus === "function"
            ) {

                previousFocus.focus();

            } else {

                openButton.focus();

            }

        }


        /* =====================================================
           BUTTON EVENTS
        ===================================================== */

        openButton.addEventListener(
            "click",
            openManual
        );


        closeButton.addEventListener(
            "click",
            closeManual
        );


        doneButton.addEventListener(
            "click",
            closeManual
        );


        /* =====================================================
           BACKDROP CLICK
        ===================================================== */

        panel
            .querySelectorAll("[data-manual-close]")
            .forEach(function (element) {

                element.addEventListener(
                    "click",
                    closeManual
                );

            });


        /* =====================================================
           SECTION NAVIGATION
        ===================================================== */

        panel
            .querySelectorAll(
                '.srkr-manual-nav a[href^="#"]'
            )
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const target =
                            document.getElementById(
                                link.getAttribute("href").slice(1)
                            );


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({

                            behavior:
                                window.matchMedia(
                                    "(prefers-reduced-motion: reduce)"
                                ).matches
                                    ? "auto"
                                    : "smooth",

                            block: "start"

                        });

                    }
                );

            });


        /* =====================================================
           KEYBOARD CONTROLS
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (panel.hidden) {
                    return;
                }


                // ESCAPE TO CLOSE

                if (event.key === "Escape") {

                    event.preventDefault();

                    closeManual();

                    return;
                }


                // KEEP TAB FOCUS INSIDE THE MANUAL

                if (event.key !== "Tab") {
                    return;
                }


                const focusable = Array.from(
                    panel.querySelectorAll(
                        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
                    )
                ).filter(function (element) {

                    return element.getClientRects().length > 0;

                });


                if (!focusable.length) {
                    return;
                }


                const first = focusable[0];

                const last =
                    focusable[focusable.length - 1];


                if (
                    event.shiftKey &&
                    document.activeElement === first
                ) {

                    event.preventDefault();

                    last.focus();

                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {

                    event.preventDefault();

                    first.focus();

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initUserManual,
            { once: true }
        );

    } else {

        initUserManual();

    }

})();
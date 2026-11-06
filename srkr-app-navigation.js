

/* =========================================================
   SRKR GO — BROWSER BACK CONTROLLER
   STAGE 6: HISTORY TOKEN + LAYER SYNCHRONISATION
========================================================= */

(function () {
    "use strict";

    if (window.__SRKR_BACK_CONTROLLER__) return;
    window.__SRKR_BACK_CONTROLLER__ = true;

    let closingFromPopState = false;
    let expectedUIBackToken = null;
    let exitPromptOpen = false;

    let tokenCounter = 0;

    const popupStack = [];
    const staleHistoryTokens = new Set();

    let featureHistoryToken = null;

    function createToken() {
        tokenCounter += 1;

        return (
            "srkr-" +
            Date.now() +
            "-" +
            tokenCounter
        );
    }

    function getStateToken() {
        return history.state?.srkrGoToken || null;
    }

    let lastKnownToken = getStateToken();

    function pushLayerState(layer, extra = {}) {
        const token = createToken();

        history.pushState(
            {
                srkrGoLayer: layer,
                srkrGoToken: token,
                ...extra
            },
            "",
            location.href
        );

        lastKnownToken = token;

        return token;
    }

    function isCurrentToken(token) {
        return Boolean(
            token &&
            getStateToken() === token
        );
    }

    function getPopupById(popupId) {
        if (popupId === "manual") {
            return window.SRKRManual || null;
        }

        if (popupId === "developer") {
            return window.SRKRDeveloperModal || null;
        }

        return null;
    }

    function getTopmostPopup() {
        while (popupStack.length > 0) {
            const entry =
                popupStack[popupStack.length - 1];

            const popup = getPopupById(entry.id);

            if (popup && popup.isOpen()) {
                return {
                    entry,
                    popup
                };
            }

            popupStack.pop();
        }

        return null;
    }

    function hasOpenFeature() {
        return Boolean(
            window.SRKRFeatures &&
            typeof window.SRKRFeatures.getActiveId === "function" &&
            window.SRKRFeatures.getActiveId()
        );
    }

    function pushRootState() {
    if (
        !history.state ||
        history.state.srkrGoLayer !== "root" ||
        !history.state.srkrGoToken
    ) {
        pushLayerState("root");
    } else {
        lastKnownToken = getStateToken();
    }
}

    function showExitConfirmation() {
        if (exitPromptOpen) return;

        exitPromptOpen = true;

        const shouldExit = window.confirm(
            "Do you want to leave SRKR Go?\n\n" +
            "Press OK to leave or Cancel to stay."
        );

        exitPromptOpen = false;

        if (!shouldExit) {
            pushRootState();
            return;
        }

        try {
            const previousPage = document.referrer
                ? new URL(document.referrer)
                : null;

            if (
                previousPage &&
                previousPage.origin !== location.origin
            ) {
                location.assign(previousPage.href);
                return;
            }
        } catch (error) {
            console.warn(
                "Could not determine previous page.",
                error
            );
        }

        alert(
            "SRKR Go is ready to close. " +
            "You can close this browser tab to exit."
        );

        pushRootState();
    }

    // Initialise the protected root history entry.
    pushRootState();

    /* =========================================
       POPUP OPEN
    ========================================= */

    document.addEventListener(
        "srkr:popup-opened",
        function (event) {
            const popupId = event.detail?.popupId;

            if (!popupId) return;

            // Remove any previous tracking entry
            // for this same popup.
            const existingIndex = popupStack.findIndex(
                entry => entry.id === popupId
            );

            if (existingIndex !== -1) {
                const oldEntry =
                    popupStack.splice(existingIndex, 1)[0];

                staleHistoryTokens.add(oldEntry.token);
            }

            const token = pushLayerState(
                "popup",
                { popupId }
            );

            popupStack.push({
                id: popupId,
                token
            });
        }
    );

    /* =========================================
       POPUP CLOSE
    ========================================= */

    document.addEventListener(
        "srkr:popup-closed",
        function (event) {
            const popupId = event.detail?.popupId;

            if (!popupId) return;

            let index = -1;

for (let i = popupStack.length - 1; i >= 0; i--) {
    if (popupStack[i].id === popupId) {
        index = i;
        break;
    }
}

            if (index === -1) return;

            const wasTopmost =
                index === popupStack.length - 1;

            const [entry] =
                popupStack.splice(index, 1);

            if (closingFromPopState) return;

            if (
                wasTopmost &&
                isCurrentToken(entry.token)
            ) {
                expectedUIBackToken = entry.token;
                history.back();
            } else {
                staleHistoryTokens.add(entry.token);
            }
        }
    );

    /* =========================================
       FEATURE OPEN
    ========================================= */

    document.addEventListener(
        "srkr:feature-opened",
        function () {
            if (featureHistoryToken) {
                staleHistoryTokens.add(
                    featureHistoryToken
                );
            }

            featureHistoryToken =
                pushLayerState("feature");
        }
    );

    /* =========================================
       FEATURE CLOSE
    ========================================= */

    document.addEventListener(
        "srkr:feature-closed",
        function () {
            const token = featureHistoryToken;

            featureHistoryToken = null;

            if (!token || closingFromPopState) return;

            if (isCurrentToken(token)) {
                expectedUIBackToken = token;
                history.back();
            } else {
                staleHistoryTokens.add(token);
            }
        }
    );

    /* =========================================
       BROWSER BACK
    ========================================= */

    window.addEventListener(
        "popstate",
        function (event) {
            const previousToken = lastKnownToken;
            const newToken =
                event.state?.srkrGoToken || null;

            lastKnownToken = newToken;

            // A layer was already closed through
            // its own UI. Synchronise history only.
            if (
                expectedUIBackToken &&
                previousToken === expectedUIBackToken
            ) {
                expectedUIBackToken = null;
                return;
            }

            expectedUIBackToken = null;

            // Skip an outdated history entry.
            if (
                previousToken &&
                staleHistoryTokens.has(previousToken)
            ) {
                staleHistoryTokens.delete(previousToken);
                history.back();
                return;
            }

            // Priority 1: Close the topmost popup.
            const topPopup = getTopmostPopup();

            if (
                topPopup &&
                previousToken === topPopup.entry.token
            ) {
                closingFromPopState = true;

                try {
                    topPopup.popup.close();
                } finally {
                    closingFromPopState = false;
                }

                return;
            }

            // Priority 2: Close the active feature.
            if (
                featureHistoryToken &&
                previousToken === featureHistoryToken &&
                hasOpenFeature()
            ) {
                closingFromPopState = true;

                try {
                    window.SRKRFeatures.close();
                } finally {
                    closingFromPopState = false;
                }

                featureHistoryToken = null;
                return;
            }

            // Priority 3: Protect live navigation.
            if (
                window.SRKRNavigation &&
                window.SRKRNavigation.isActive()
            ) {
                const shouldStop = window.confirm(
                    "Live navigation is currently active.\n\n" +
                    "Do you want to stop navigation and return to the map?"
                );

                if (shouldStop) {
                    window.SRKRNavigation.stop();
                }

                pushRootState();
                return;
            }

            // Priority 4: Main-screen exit confirmation.
            pushRootState();
            showExitConfirmation();
        }
    );

})();
/* =========================================================
   SRKR GO — STAGE 4: REFRESH RECOVERY
========================================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "srkrGoRecovery";

    function saveRecoveryState() {
        try {
            const activeFeature =
                window.SRKRFeatures?.getActiveId?.() || null;

            const navigationActive =
                window.SRKRNavigation?.isActive?.() || false;

            const destinationId =
                window.SRKRNavigation?.getDestinationId?.() || null;

            const previousState = JSON.parse(
                sessionStorage.getItem(STORAGE_KEY) || "{}"
            );

            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    featureId: activeFeature,
                    navigationWasActive: navigationActive,
                    destinationId: destinationId || previousState.destinationId || null
                })
            );
        } catch (error) {
            console.warn("SRKR recovery save failed:", error);
        }
    }

    // Save feature changes immediately.
    document.addEventListener(
        "srkr:feature-opened",
        saveRecoveryState
    );

    document.addEventListener(
        "srkr:feature-closed",
        saveRecoveryState
    );

    // Save destination changes immediately.
    document.addEventListener(
        "srkr:destination-changed",
        saveRecoveryState
    );

    // Save the final state before the page is refreshed or hidden.
    window.addEventListener(
        "pagehide",
        saveRecoveryState
    );

    // Restore the previous session after the page loads.
    function restoreRecoveryState() {
        let savedState;

        try {
            savedState = JSON.parse(
                sessionStorage.getItem(STORAGE_KEY) || "null"
            );
        } catch (error) {
            console.warn("SRKR recovery data could not be read:", error);
            return;
        }

        if (!savedState) return;

        // Restore the last opened feature.
        if (
            savedState.featureId &&
            window.SRKRFeatures &&
            typeof window.SRKRFeatures.open === "function"
        ) {
            window.SRKRFeatures.open(savedState.featureId);
        }

        // Restore the destination and offer to restart navigation.
        if (
            savedState.navigationWasActive &&
            savedState.destinationId &&
            window.SRKRNavigation
        ) {
            const shouldResume = window.confirm(
                "Your previous navigation was interrupted by a page reload.\n\n" +
                "Would you like to restart navigation to your previous destination?"
            );

            if (shouldResume) {
                const resumed =
                    window.SRKRNavigation.resume(
                        savedState.destinationId
                    );

                if (!resumed) {
                    alert(
                        "The previous destination could not be restored. " +
                        "Please select it again from the map."
                    );
                }
            }
        }

        // Clear the old recovery state after processing.
        sessionStorage.removeItem(STORAGE_KEY);
    }

    restoreRecoveryState();

})();
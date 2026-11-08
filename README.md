# SRKR Go 🧭

**Smart campus navigation for Sagi Ramakrishnam Raju Engineering College (SRKR).**

SRKR Go is a student-built campus navigation platform designed to help students and visitors explore SRKR, find classrooms and facilities, locate faculty directory entries, and navigate across campus.

🌐 **Live site:** [https://navadeep167.github.io/srkr-go/](https://navadeep167.github.io/srkr-go/)

## Features

- 🔎 **Smart Search** — Search using aliases, typo-tolerant matching, voice input, and natural-language queries.
- 🗺️ **Interactive Campus Map** — Explore campus blocks, surveyed outlines, and mapped entrances.
- 🧭 **Live Navigation** — Follow turn-by-turn routes across the campus road network, with rerouting support.
- 📍 **Campus Geofence** — Navigation is restricted to the SRKR campus area.
- 🏢 **Campus Directory** — Browse block, floor, classroom, lab, and room information.
- 👨‍🏫 **Faculty Finder** — Search the available faculty directory.
- ⚡ **Quick Facilities** — Find facilities such as water refill points and washrooms.
- 🍽️ **Cafeteria Menu** — View cafeteria menu information.
- 📱 **QR Starting Points** — Open navigation from a predefined location using a QR code (`?start=<location-id>`).
- 📢 **Campus Updates** — Access campus alerts, feedback, and community photos through GO FAN.
- 📱 **Responsive Interface** — Designed for both mobile phones and desktop screens.
- 🌗 **Theme Support** — Light and dark appearance modes.
- 📖 **User Manual** — Built-in guidance for using the platform.

## Built with

- **HTML, CSS, and vanilla JavaScript** — Core application.
- [Leaflet](https://leafletjs.com/) — Interactive map.
- [OpenStreetMap](https://www.openstreetmap.org/copyright) — Map data.
- [Supabase](https://supabase.com/) — Backend services for user counters, alerts, feedback, and GO FAN.

## Project structure

```text
srkr-go/
├── assets/                 # Images and other static assets
├── supabase/               # Supabase-related project files
├── index.html              # Main application page
├── style.css               # Main application styles
├── script.js               # Map, search, routing, and navigation
├── srkr-app-navigation.js  # Application navigation behavior
├── srkr-features.css       # Feature panel styles
├── srkr-features.js        # Campus features and panels
├── parallax.js             # Intro and parallax effects
├── user-manual.css         # User manual styles
├── user-manual.js          # User manual functionality
├── favicon.svg             # Browser icon
├── LICENSE                 # MIT License
└── README.md               # Project documentation
```

## Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/NAVADEEP167/srkr-go.git
   cd srkr-go
   ```

2. Start a local web server. For example, with the VS Code **Live Server** extension, right-click `index.html` and choose **Open with Live Server**. Alternatively, run:

   ```bash
   python -m http.server 8000
   ```

3. Open the local address shown by your server (for Python, usually [http://localhost:8000](http://localhost:8000)).

4. Allow location access when prompted. GPS-based navigation requires a supported browser and access to the SRKR campus area.

> Opening `index.html` directly as a local file may prevent browser location features from working correctly. Use a local server instead.

## Backend

Alerts, feedback, counters, and GO FAN depend on a Supabase project. The backend configuration (including database tables, Row Level Security policies, RPC functions, and the `go-fan` Edge Function) is not fully provisioned by this frontend repository.

To run those features with your own Supabase project, configure the required backend resources and update the project configuration in the application. Without a correctly configured backend, these features may not work.

Any key embedded in the frontend must be a **public/publishable key**, never a service-role or secret key. Protect data and operations with appropriate Supabase Row Level Security policies.

## Data accuracy and privacy

- Campus coordinates and room details are based on manual surveys and may contain errors or become outdated. Please report corrections through the repository's issue tracker.
- The faculty directory displays names and selected professional or departmental details for student reference. It does not publish personal phone numbers or track faculty members' live personal locations.
- Some block, floor, and room details may be incomplete or unverified. Room-level faculty navigation or live faculty-location features should only be introduced after college approval and verification of the relevant data.
- SRKR Go is a student project and is **not an official SRKR Engineering College product**.

## Author

**Kothapalli Navadeep Kumar**  
1st Year B.Tech, Computer Science and Information Technology (CSIT), SRKR

## License

Released under the [MIT License](LICENSE).

The SRKR name and emblem belong to SRKR Engineering College.

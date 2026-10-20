# SRKR Go 🧭

**Smart campus navigation for Sagi Ramakrishnam Raju Engineering College (SRKR).**

SRKR Go helps freshers and students find blocks, classrooms, labs, facilities
and faculty on a large campus, with live turn-by-turn navigation on their phone.

🌐 **Live site:** https://navadeep167.github.io/srkr-go/

## Features

- 🔎 Smart search with aliases, typo tolerance, voice search and natural-language queries
- 🗺️ Interactive campus map with surveyed block outlines and entrances
- 🧭 Live turn-by-turn navigation on the campus road network, with rerouting
- 📍 Campus-only navigation using a geofence around SRKR
- 🏢 Block, floor and room directories
- 👨‍🏫 Faculty finder (static directory)
- ⚡ Quick Facilities (water refill, washrooms)
- 🍽️ Cafeteria menu
- 📱 QR-code starting points (`?start=<location-id>`)
- 📢 Campus alerts, feedback and community photos (GO FAN)
- Works on mobile and desktop

## Built with

- HTML, CSS and vanilla JavaScript
- [Leaflet](https://leafletjs.com/) for the map
- [OpenStreetMap](https://www.openstreetmap.org/copyright) map data
- [Supabase](https://supabase.com/) for the backend (user counters, alerts, feedback, GO FAN)

## Project structure

```text
srkr-go/
├── index.html           # Page structure
├── style.css            # Main styles
├── srkr-features.css    # Feature panel styles
├── script.js            # Map, search, routing and navigation
├── srkr-features.js     # Feature panels (Near Me, Explore, Alerts, GO FAN...)
├── favicon.svg
└── assets/              # Images and videos
```

## Run locally

1. Clone or download this repository.
2. Serve the folder with a local server, for example the VS Code
   "Live Server" extension or `python -m http.server`, then open the
   address it shows. Opening `index.html` directly may block GPS.
3. Allow location access. Navigation only works inside the SRKR campus geofence.

## Backend

Alerts, feedback, counters and GO FAN use a Supabase project (tables, RPC
functions and a `go-fan` Edge Function) that is not included in this repo.
Without your own backend those features will show an error. The Supabase
key in `script.js` is a public (publishable) key; access is controlled by
Row Level Security on the database.

## Notes

- Campus coordinates and room details come from manual surveys and may
  contain mistakes. If you find one, please open an issue.
- This is a student project and is not an official SRKR product.

### Faculty directory and location privacy

The faculty directory displays names and selected professional
and departmental details for student reference. It does not
publish personal phone numbers or track faculty members' live
personal locations.

Listed block, floor, and room details may be incomplete or
unverified. Room-level faculty navigation or any live faculty
location feature will be introduced only after college approval
and verification of the relevant location data.


## Author

**Kothapalli Navadeep Kumar**
1st Year B.Tech, Computer Science and Information Technology (CSIT), SRKR

## License

Released under the [MIT License](LICENSE).
The SRKR name and emblem belong to SRKR Engineering College.
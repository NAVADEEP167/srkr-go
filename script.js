/* =========================================================
   SRKR GO — MASTER SCRIPT
   ---------------------------------------------------------
   Updated: campus locations now use surveyed corner
   coordinates (not just a single pin) for every major
   block, with an explicit "center" point where you gave
   one, and real entrance coordinates wired in as routing
   access points. A few named sub-spots (ATM, washrooms,
   labs, etc.) were added as separate searchable pins.

   Also filled in two functions the UI referenced but that
   weren't defined anywhere (buildLiveRoute, getLocationPosition)
   — without these, "Find My Route" and the Faculty Finder's
   "Navigate" button would throw a JS error when clicked.
========================================================= */
/* =========================================================
   SRKR GO — USER COUNTER
   ========================================================= */

const SUPABASE_URL =
    "https://ztyxinsabvxhpmgnumqf.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_TNl0SmFWyAx1wmkeA7_M7w_ylG47RaN";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


async function updateSRKRGoUserCount() {

    const userCount =
        document.getElementById("userCount");

    if (!userCount) {
        return;
    }

    try {

        const alreadyCounted =
            localStorage.getItem(
                "srkrGoUserCounted"
            );


        if (!alreadyCounted) {

            const { data, error } =
                await supabaseClient.rpc(
                    "increment_site_users"
                );

            if (error) {
                throw error;
            }

            localStorage.setItem(
                "srkrGoUserCounted",
                "true"
            );

            userCount.textContent =
                Number(data).toLocaleString() + "+";

        } else {

            const { data, error } =
                await supabaseClient
                    .from("site_stats")
                    .select("total_users")
                    .eq("id", 1)
                    .single();

            if (error) {
                throw error;
            }

            userCount.textContent =
                Number(
                    data.total_users
                ).toLocaleString() + "+";
        }

    } catch (error) {

        console.error(
            "SRKR Go user counter error:",
            error
        );

        userCount.textContent = "Growing";
    }
}


document.addEventListener(
    "DOMContentLoaded",
    updateSRKRGoUserCount
);

/* =========================================================
   1. CAMPUS LOCATIONS
========================================================= */

const campusLocations = {

    /* ---------------- ACADEMIC BLOCKS ---------------- */

    "cse": {
        name: "CSE Block",
        category: "Academic",
        type: "area",
        corners: [
            [16.543511987018512, 81.49538845137134],
            [16.54323522542944, 81.49537629503341],
            [16.543227942224362, 81.49546898711017],
            [16.543093931201913, 81.49546442848346],
            [16.543072081569864, 81.49573794608708],
            [16.543493138101653, 81.49573445069026]
        ],
        center: [16.543337204331607, 81.49558265819886],
        aliases: ["CSE", "CSE Block", "Computer Science", "Computer Science Engineering"]
    },

    "ece": {
        name: "ECE Block",
        category: "Academic",
        type: "area",
        corners: [
            [16.543663782061294, 81.49677297621028],
            [16.543660947608505, 81.49704648555804],
            [16.54329105116206, 81.49706422670494],
            [16.543300971765657, 81.4969282112455],
            [16.54348991267335, 81.49691352483781],
            [16.543491198261304, 81.49675393340192],
            [16.543667323729984, 81.49676063892443]
        ],
        center: [16.543532337071305, 81.49693431195757],
        aliases: ["ECE", "ECE Block", "Electronics", "Electronics and Communication"]
    },

    "eee": {
        name: "EEE Block",
        category: "Academic",
        type: "area",
        corners: [
            [16.543537074280422, 81.49540758277547],
            [16.543531403313946, 81.49573768785235],
            [16.543757107650908, 81.49574951957553],
            [16.543772986338052, 81.49540994912012]
        ],
        center: [16.543677714195667, 81.49555666248762],
        aliases: ["EEE", "EEE Block", "Electrical", "Electrical and Electronics"]
    },

    "civil": {
        name: "civil Block",
        category: "Academic",
        type: "area",
        corners: [
            [16.544925887377957, 81.49595285816046],
            [16.54439768098174, 81.49591807156418],
            [16.544381674704926, 81.49623810824976],
            [16.544579085362034, 81.4962381082499],
            [16.544665785923446, 81.49632437900863],
            [16.544771160399467, 81.4962408911776],
            [16.54490988114088, 81.49628402655696]
        ],
        center: [16.54468076689641, 81.49614605160053],
        aliases: ["Civil", "Civil Block", "Civil Engineering"]
    },

    "mech": {
    name: "Mechanical Block",
    category: "Academic",
    type: "area",
    customType: "mech-block",
        corners: [
            [16.543696585530828, 81.49596646866938],
            [16.54362217177738, 81.49628428392184],
            [16.543521797781235, 81.49625405868012],
            [16.54352080447211, 81.49618981402337],
            [16.543388694312046, 81.49615665549084],
            [16.54343736648681, 81.49585822869818],
            [16.543701586652055, 81.49587066314754]
        ],
        center: [16.543559543526722, 81.49606650573023],
        aliases: ["Mechanical", "Mechanical Block", "Mech", "Mech Block"]
    },

    "it": {
    name: "IT Block",
    category: "Academic",
    type: "area",
    customType: "it-block",
        corners: [
            [16.543242768970856, 81.49705861092663],
            [16.542965405989634, 81.49702411269952],
            [16.543025145741506, 81.49672698279726],
            [16.543193697084515, 81.4967436754884],
            [16.54327370558188, 81.4969050381694],
            [16.54326943846286, 81.49693285932129]
        ],
        center: [16.543142491628803, 81.49690837670762],
        aliases: ["IT", "IT Block", "Information Technology"]
    },

    "n-block": {
    name: "N Block",
    category: "Academic",
    type: "area",
    customType: "n-block",    
    corners: [
            [16.544091333689746, 81.49590861593775],
            [16.544088762521824, 81.49630424176621],
            [16.543795649154706, 81.4962961951392],
            [16.543784078881078, 81.49591666256477]
        ],
        center: [16.54394734823365, 81.49611246382226],
        aliases: ["N Block", "NBlock"]
    },

    "s-block": {
        name: "S Block",
        category: "Academic",
        type: "area",
        corners: [
            [16.54585639590504, 81.49637559210122],
            [16.545874496119914, 81.49619693854588],
            [16.545878673092325, 81.49603280966984],
            [16.545704632498218, 81.49602845226606],
            [16.545472114019407, 81.49603861954155],
            [16.545466544711093, 81.49619984348175],
            [16.54547629100055, 81.49637268716535],
            [16.5456948862203, 81.49638140197293]
        ],
        center: [16.54569677913799, 81.49619375822975],
        aliases: ["S Block", "SBlock"]
    },

    "technological-centre": {
        name: "Technological Centre (CSD & CSIT Block)",
        category: "Academic",
        type: "area",
        corners: [
            [16.5426626325612, 81.4965455089725],
            [16.54255721386772, 81.4970873151918],
            [16.542345090711507, 81.49706116365405],
            [16.542496148133925, 81.49652203964375]
        ],
        aliases: ["Technological Centre", "Technology Centre", "Tech Centre", "Technological Center", "CSD", "CSD Block", "CSD Department", "CSIT", "CSIT Block", "CSIT Department" ," ideal lab" , "IDEAL LAB"]
    },

    /* ---------------- SUB-LOCATIONS: CIVIL BLOCK ---------------- */

    "civil-washroom": {
        name: "Civil Block Washroom",
        category: "Campus Facilities",
        type: "point",
        latitude: 16.54443007862662,
        longitude: 81.4961768970045,
        aliases: ["Civil Washroom", "Civil Block Toilet"]
    },

    "water-refill-civil": {
        name: "Water Bottle Refill Unit (Civil Block)",
        category: "Campus Facilities",
        type: "point",
        latitude: 16.54435294370931,
        longitude: 81.49619835467648,
        aliases: ["Water Refill", "Water Bottle Refill", "Drinking Water Civil Block"]
    },

    "tea-coffee-civil": {
        name: "Tea/Coffee Unit (Civil Block)",
        category: "Food & Refreshments",
        type: "point",
        latitude: 16.544310519491848,
        longitude: 81.49619835467648,
        aliases: ["Tea Coffee Unit", "Coffee Machine Civil Block"]
    },

    "pickleball-court": {
        name: "Pickleball Court",
        category: "Sports & Recreation",
        type: "point",
        latitude: 16.54427580876153,
        longitude: 81.49603205771807,
        aliases: ["Pickleball", "Pickle Ball Court"]
    },

    /* ---------------- SUB-LOCATIONS: N BLOCK ---------------- */

    "n-block-classrooms": {
        name: "N Block Class Rooms",
        category: "Academic",
        type: "point",
        latitude: 16.54404119590919,
        longitude: 81.49612051044927,
        aliases: ["N Block Classrooms", "N Block Class Room"]
    },

    /* ---------------- SUB-LOCATIONS: CSE BLOCK ---------------- */

    "cse-citi-office": {
        name: "CITI Office (CSE Block)",
        category: "Academic",
        type: "point",
        latitude: 16.54317898067873,
        longitude: 81.49558142643654,
        aliases: ["CITI Office", "CITI"]
    },

    /* ---------------- SUB-LOCATIONS: TECHNOLOGICAL CENTRE ---------------- */

    "sbi-srkr": {
    name: "SBI Bank (Chinna Amiram Branch)",
        category: "Campus Facilities",
        type: "point",
        latitude: 16.542559142258124,
        longitude: 81.49671918200572,
        aliases: ["SBI", "SBI Bank", "Bank"]
    },

    "sbi-atm": {
        name: "SBI ATM",
        category: "Campus Facilities",
        type: "point",
        latitude: 16.542500004917645,
        longitude: 81.49659714149594,
        aliases: ["ATM", "SBI ATM", "Cash Machine"]
    },

    "ideal-lab": {
        name: "Ideal Lab / AICTE Lab",
        category: "Academic",
        type: "point",
        latitude: 16.542511575268293,
        longitude: 81.49698337959288,
        aliases: ["Ideal Lab", "AICTE Lab"]
    },

    /* ---------------- ADMINISTRATION ---------------- */

    "admin": {
        name: "Administrative Block",
        category: "Administration",
        type: "area",
        corners: [
            [16.543195830644883, 81.4966880331846],
            [16.54287259598125, 81.49661681103562],
            [16.542938736451536, 81.49625513606097],
            [16.54325480349954, 81.49628581285752]
        ],
        center: [16.54316352662167, 81.49647222638346],
        aliases: ["Admin", "Administrative", "Administrative Block", "Administration"]
    },

    "ceo-office": {
        name: "CEO Office",
        category: "Administration",
        type: "point",
        latitude: 16.543098059761682,
        longitude: 81.4954163335157,
        aliases: ["CEO", "CEO Office", "CEO Block"]
    },

    /* ---------------- CAMPUS FACILITIES ---------------- */

    "library": {
        name: "Library",
        category: "Campus Facilities",
        type: "area",
        corners: [
            [16.543333224447967, 81.49587543487812],
            [16.54317766811596, 81.49585129499707],
            [16.543103103879275, 81.49619059443637],
            [16.54324708996558, 81.49621339321294],
            [16.543377577263445, 81.49616444289856]
        ],
        center: [16.543285657650138, 81.49603301465672],
        aliases: ["Library"]
    },

    "silver-jubilee": {
        name: "Silver Jubilee",
        category: "Campus Facilities",
        type: "area",
        corners: [
            [16.5440823346021, 81.49655234610127],
            [16.54406947876158, 81.49707001243952],
            [16.543763509504235, 81.49704721366298],
            [16.54377122302088, 81.496847389092],
            [16.543726227502724, 81.49683666025597],
            [16.543727513089095, 81.49676155840379],
            [16.543776365365147, 81.49673607741822],
            [16.543786650053264, 81.49653625284724]
        ],
        center: [16.543970426035568, 81.4967930310331],
        aliases: ["Silver Jubilee", "Silver Jubilee Hall"]
    },

    "i-auditorium": {
        name: "I-Auditorium",
        category: "Campus Facilities",
        type: "point",
        latitude: 16.54516539008655,
        longitude: 81.49580736766806,
        aliases: ["I Auditorium", "I-Auditorium", "IAuditorium"]
    },

    "open-air-auditorium": {
        name: "Open Air Auditorium",
        category: "Campus Facilities",
        type: "area",
        temporaryParking: true,
        corners: [
            [16.543269252733264, 81.49674722689588],
            [16.543635962375912, 81.49672642381847],
            [16.543652580620932, 81.49631036227845],
            [16.543371178145435, 81.49626413321845]
        ],
        aliases: ["Open Air", "Open Air Auditorium", "Open Auditorium", "OAA"]
    },

    "srujana-vatika": {
        name: "Srujana Vatika",
        category: "Campus Facilities",
        type: "area",
        corners: [
            [16.545535348215363, 81.4971637494223],
            [16.545481062472895, 81.49644719899227],
            [16.546316396502043, 81.49638478976101],
            [16.546550156439103, 81.4969857675415]
        ],
        center: [16.546011122907604, 81.49677868044424],
        aliases: ["Vatika", "Srujana Vatika", "Sensory Walks", "Ayurveda Vanam"]
    },

    "srujana-vatika-camp": {
        name: "Srujana Vatika Camp Area",
        category: "Campus Facilities",
        type: "point",
        latitude: 16.545932008419715,
        longitude: 81.49637143233537,
        aliases: ["Vatika Camp"]
    },

    /* ---------------- FOOD & REFRESHMENTS ---------------- */
    "canteen": {
    name: "Cafeteria",
    category: "Food & Refreshments",
    type: "area",
    corners: [
    [16.545473048171985, 81.49586471311774],
    [16.545304983490425, 81.49585497289131],
    [16.54531165272661, 81.49551684788811],
    [16.54551172970494, 81.49551406496627],
    [16.545702469564347, 81.49562538183976],
    [16.545685129584932, 81.4956740829719],
    [16.54548638663249, 81.49566990858914]
],
    center: [16.54539614413021, 81.4956685596389],
    aliases: ["Cafeteria", "Canteen", "Food", "Food Court"]
},


    "cafeteria-snacks-counter": {
        name: "Porsch Snacks Counter",
        category: "Food & Refreshments",
        type: "point",
        latitude: 16.54558927899622,
        longitude: 81.49565771086382,
        aliases: ["Porsch Snacks", "Snacks Counter"]
    },

    "nescafe": {
        name: "Nescafe",
        category: "Food & Refreshments",
        type: "point",
        latitude: 16.544939737209525,
        longitude: 81.49593904596075,
        aliases: ["Nescafe", "Nescafé"]
    },

    /* ---------------- SPORTS ---------------- */

    "cricket-ground": {
        name: "Cricket Ground",
        category: "Sports & Recreation",
        type: "area",
        corners: [
            [16.54432111650873, 81.49628424155529],
            [16.54429231164343, 81.49706897984858],
            [16.545209633519562, 81.4970146607036],
            [16.545183044541467, 81.49647724788107]
        ],
        aliases: ["Cricket", "Cricket Ground"]
    },

    "basketball-court": {
        name: "Basketball Court",
        category: "Sports & Recreation",
        type: "area",
        corners: [
            [16.54532780404979, 81.49644657179452],
            [16.54532928970387, 81.49621874751804],
            [16.54516735334179, 81.4961970499679],
            [16.54499798856076, 81.49619395031789],
            [16.544986103307377, 81.4964295237194],
            [16.545146554166163, 81.49643727284446]
        ],
        center: [16.545153976058348, 81.49632577047294],
        aliases: ["Basketball", "Basketball Court"]
    },

    "basketball-audience": {
        name: "Basketball Court Audience Area",
        category: "Sports & Recreation",
        type: "point",
        latitude: 16.545180653078802,
        longitude: 81.49620471311796,
        aliases: ["Basketball Seating"]
    },

    "badminton": {
        name: "Badminton Court",
        category: "Sports & Recreation",
        type: "area",
        corners: [
            [16.54571716342625, 81.49588175300518],
            [16.545718678418115, 81.49578541146441],
            [16.54571716342625, 81.49567695502712],
            [16.545606833525756, 81.49565130101409],
            [16.545495783577977, 81.49564935813646],
            [16.54547891888545, 81.49577267097162],
            [16.54548325263557, 81.49588611040896],
            [16.545596548934697, 81.49588197098865]
        ],
        center: [16.545601691230303, 81.4957773648374],
        aliases: ["Badminton", "Badminton Court"]
    },

    "gym": {
    name: "Gym",
    category: "Sports & Recreation",
    type: "point",
    latitude: 16.545263268873278,
    longitude: 81.49653313092281,
    aliases: ["Gym", "Fitness"]
},

"w-block": {
    name: "W Block (W1–W5)",
    category: "Academic",
    type: "area",
    corners: [
        [16.545202128544712, 81.49650037842741],
        [16.545230220049433, 81.49701579927613],
        [16.545352500669388, 81.49700890401394],
        [16.545331018944466, 81.4964917593497]
    ],
    center: [16.545288055487454, 81.49684169390582],
    aliases: [
        "W Block",
        "WBlock",
        "W1",
        "W2",
        "W3",
        "W4",
        "W5",
        "W1–W5"
    ]
},

"open-air-gym": {
    name: "Open-Air Gym",
    category: "Sports & Recreation",
    type: "point",
    latitude: 16.54524509202265,
    longitude: 81.49722782858898,
    aliases: [
        "Open Air Gym",
        "Open-Air Gym",
        "Warm Up Gym",
        "Warm-up Gym",
        "Warmup"
    ]
},

"volleyball-courts": {
    name: "Volleyball Courts (2 Courts)",
    category: "Sports & Recreation",
    type: "area",
    corners: [
        [16.545190561455126, 81.4971709426759],
        [16.54459072419478, 81.49720197135575],
        [16.54459072419478, 81.49735366712393],
        [16.545200476104906, 81.49732436225963]
    ],
    aliases: [
        "Volleyball",
        "Volleyball Court",
        "Volleyball Courts",
        "Volley Ball",
        "2 Volleyball Courts"
    ]
},

    /* ---------------- ENTRANCES ---------------- */

    "main-gate": {
        name: "Main Gate",
        category: "Campus Entrance",
        type: "point",
        latitude: 16.542799509704956,
        longitude: 81.49577486466106,
        aliases: ["Main Gate", "Gate 1", "Entrance", "Campus Entrance"]
    },

    "second-gate": {
        name: "Second Gate",
        category: "Campus Entrance",
        type: "point",
        latitude: 16.542322560170955,
        longitude: 81.49712004825126,
        aliases: ["Second Gate", "Gate 2"]
    },

    /* ---------------- LANDMARKS ---------------- */

    "srkr-statue": {
        name: "SRKR Statue",
        category: "Campus Landmark",
        type: "point",
        latitude: 16.542736842623086,
        longitude: 81.49640221356205,
        aliases: ["Statue", "SRKR Statue"]
    },

    "srkr-blueprint": {
        name: "SRKR Blue Print",
        category: "Campus Landmark",
        type: "point",
        latitude: 16.54265505752663,
        longitude: 81.49719613138927,
        aliases: ["SRKR Map", "Map", "Blueprint", "Blue Print", "SRKR Blue Print"]
    },

    /* ---------------- PARKING ---------------- */

    "boys-parking": {
        name: "Boys Parking",
        category: "Parking & Transport",
        type: "area",
        corners: [
            [16.542682072698902, 81.49652070450144],
            [16.54259454948515, 81.49702228980307],
            [16.542719740904975, 81.49702691270907],
            [16.542790645743874, 81.49655999920307]
        ],
        aliases: ["Boys Parking", "Boy Parking", "Boys Car Parking"]
    },

    "girls-parking": {
        name: "Girls Parking",
        category: "Parking & Transport",
        type: "area",
        corners: [
            [16.542833853368453, 81.49627337903024],
            [16.542718633017806, 81.49625488740624],
            [16.54277845897888, 81.49589083355787],
            [16.542889247744483, 81.49591279236137]
        ],
        aliases: ["Girls Parking", "Girl Parking", "Girls Car Parking"]
    },

    "bus-parking": {
        name: "Bus Parking",
        category: "Parking & Transport",
        type: "point",
        latitude: 16.545822962416683,
        longitude: 81.49552641915909,
        aliases: ["Bus Parking", "Bus Stand"]
    }

};


/* =========================================================
   2. CAMPUS GEOFENCE  (unchanged)
========================================================= */

const campusBoundary = [
    [16.542856186085523, 81.4952702798502],
    [16.54221840221042, 81.4973417642981],
    [16.54351009419382, 81.49730972558808],
    [16.543540113290227, 81.49759980545447],
    [16.546726850855418, 81.4971053511366],
    [16.546342928398584, 81.4961774251979],
    [16.54600640315133, 81.49600106982459],
    [16.545943205850207, 81.49567472997367],
    [16.546347668184232, 81.49524290653525],
    [16.545955845307557, 81.49472208131736],
    [16.545466065596546, 81.49529235196556],
    [16.54375498669699, 81.49523136926692]
];
/* =========================================================
   5. REAL SRKR ACCESS POINTS — MASTER DATA
   ---------------------------------------------------------
   These are the latest surveyed access points supplied by
   the SRKR Go project owner.

   IMPORTANT:
   - These points are NOT drawn permanently.
   - They are used only when routing to a destination.
   - For areas without an explicitly surveyed access point,
     the router automatically evaluates the area's corners.
   ========================================================= */

const hiddenAccessPoints = {

    "technological-centre": [
        [16.542482133438167, 81.49708654562001]
    ],

    "boys-parking": [
        [16.542709595237756, 81.49677149713338]
    ],

    "srkr-statue": [
        [16.542810901664485, 81.49642055704777]
    ],

    "girls-parking": [
        [16.542822928156593, 81.49605811333667]
    ],

    "it": [
        [16.542991134924954, 81.49704712630624]
    ],

    "admin": [
        [16.54305612386468, 81.49646089684506]
    ],

    "library": [
        [16.54319757031009, 81.49586868544932]
    ],

    "cse": [
        [16.543390625420198, 81.49573907689478]
    ],

    "ece": [
        [16.543650580518587, 81.49688362013089]
    ],

    "silver-jubilee": [
        [16.543740417859397, 81.49678790919864]
    ],

    "mech": [
        [16.543486197197808, 81.4958926131828]
    ],

    "eee": [
        [16.543663960555893, 81.49574705280573]
    ],

    "civil": [
        [16.5447515629124, 81.49602022775919]
    ],

    "badminton": [
        [16.545676689100826, 81.49589460716075]
    ],

    "s-block": [
        [16.5458143107958, 81.49601823378183]
    ],

    "canteen": [
        [16.54542629381787, 81.49584076976076]
    ],

    "srujana-vatika": [
        [16.545453053634315, 81.49644693899954]
    ]

};
/* =========================================================
   6. LEGACY HIDDEN ROAD POINTS
   ---------------------------------------------------------
   Removed from active routing.

   The new surveyed road network above is now authoritative.
   ========================================================= */
const hiddenRoadPoints = {};
/* =========================================================
   7. LEGACY ROUTING NODES
   ---------------------------------------------------------
   Removed.

   Routing now uses campusRoads exclusively.
   ========================================================= */

const hiddenRoutingNodes = {};
/* =========================================================
   8. LEGACY ROAD CONNECTIONS
   ---------------------------------------------------------
   Removed.

   Connections are generated from the new surveyed roads.
   ========================================================= */

const hiddenRoadConnections = {};


/* =========================================================
   9. S BLOCK INFORMATION
========================================================= */

const sBlockData = {
    commonFacilities: [
        "🛗 Elevator on every floor",
        "🪜 Steps/Stairs on every floor",
        "💧 Water bottle refill units",
        "❄️ Cool drinking water",
        "🩹 First Aid available on every floor"
    ],

    floors: {

        /* =====================================================
           GROUND FLOOR
        ===================================================== */
        "Ground Floor": [

            { room: "101", detail: "Engineering Chemistry Laboratory 1" },

            { room: "102", detail: "Faculty Room" },

            { room: "103", detail: "Professor & HOD — Dr. G.N.V. Kishore" },

            { room: "104", detail: "Office Room" },

            {
                room: "105",
                detail:
                    "Professor & Head of Department of Mathematics and Humanities — Dr. M.N. Varma; " +
                    "Assistant Professor — Sri M. Prudhvy Raju; " +
                    "Assistant Professor — Sri N. Udaya Bhaskara Varma; " +
                    "Assistant Professor — Dr. K. Kiran Kumar Varma"
            },

            {
                room: "106",
                detail:
                    "R&D Cell Coordinator & Professor — Dr. R. Subba Rao; " +
                    "Assistant Professor — Sri B. Srinivasu"
            },

            {
                room: "107",
                detail:
                    "Assistant Professor — Dr. Y. Shobhan Babu; " +
                    "Assistant Professor — Smt. G. Santhi"
            },

            {
                room: "108",
                detail:
                    "Assistant Professor — D. Sridevi; " +
                    "Assistant Professor — Smt. R. Lakshmi Hyma; " +
                    "Assistant Professor — Dr. M. Pushpa Latha"
            },

            {
                room: "109",
                detail:
                    "Professor — Dr. D. Venkatapathi Raju; " +
                    "Assistant Professor — K. V. Rao"
            },

            {
                room: "110",
                detail:
                    "Assistant Professor — Sri A. Kiran Kumar; " +
                    "Assistant Professor — T. Sathish; " +
                    "Assistant Professor — Dr. G. Vidyasagar"
            },

            { room: "111", detail: "Normal Sir Room" },

            {
                room: "112",
                detail:
                    "Library Department of Engineering Mathematics & Humanities; " +
                    "Assistant Professor — T.R.K.D.V. Prasad; " +
                    "Assistant Professor — Dr. S. Ramalingeswar Rao; " +
                    "Assistant Professor — Sri N. Krishna Mohan Raju"
            },

            {
                room: "113",
                detail: "Engineering Chemistry Laboratory 3"
            },

            {
                room: "114",
                detail: "Engineering Chemistry Laboratory 2"
            },

            { room: "115", detail: "Office Room" },

            {
                room: "116",
                detail:
                    "Head of the Department of Engineering Chemistry & Professor — Dr. P. Bhavani"
            },

            {
                room: "117",
                detail:
                    "Assistant Professor — Dr. U. Naga Babu; " +
                    "Assistant Professor — Mr. J. Suresh Kumar"
            },

            {
                room: "118",
                detail:
                    "Assistant Professor — Dr. D. Chandra Shekar; " +
                    "Assistant Professor — Dr. B.S. Diwakar"
            },

            {
                room: "119",
                detail:
                    "Assistant Professor — Mrs. Ch. Lakshmi Prasanna; " +
                    "Assistant Professor — Mrs. K. Tulasi Bhavani"
            },

            {
                room: "120",
                detail:
                    "Assistant Professor — Mrs. K. Balageetha; " +
                    "Assistant Professor — Mrs. U.V. Lakshmi; " +
                    "Assistant Professor — Mrs. S. Prameela Devi"
            },

            {
                room: "—",
                detail:
                    "Dr. C. R. Rao Research Lab — Department of Mathematics & Humanities"
            },

            {
                room: "—",
                detail:
                    "First Aid — available on the floor"
            }
        ],


        /* =====================================================
           FIRST FLOOR
        ===================================================== */
        "First Floor": [

            { room: "201", detail: "Class Room" },

            { room: "202", detail: "Class Room" },

            { room: "203", detail: "Class Room" },

            {
                room: "204",
                detail:
                    "Physics Lab 1 — Smt. SK. Rameeza Begum, Assistant Professor"
            },

            {
                room: "—",
                detail:
                    "Faculty Room — Department of Engineering Mathematics & Humanities"
            },

            {
                room: "206",
                detail:
                    "Head of Department of Engineering Physics & Associate Professor — Dr. M.V. Someswara Rao"
            },

            {
                room: "207",
                detail: "Office Room"
            },

            {
                room: "208",
                detail:
                    "Assistant Professor — Miss G. Anusha; " +
                    "Assistant Professor — Dr. P.V.S. Lakshmi Aparna"
            },

            {
                room: "209",
                detail:
                    "Assistant Professor — Sri Ch. J.N. Pavan Kumar"
            },

            {
                room: "210",
                detail:
                    "Assistant Professor — Sri P.V. Prasanna Kumar; " +
                    "Assistant Professor — Dr. S. Srikanth"
            },

            {
                room: "211",
                detail:
                    "Professor — Dr. K.V. Ramana Murthy; " +
                    "Assistant Professor — Sri N.P.S. Acharyulu"
            },

            {
                room: "212",
                detail: "Staff Washroom"
            },

            {
                room: "—",
                detail:
                    "First Aid — available on the floor"
            }
        ],


        /* =====================================================
           SECOND FLOOR
           Unmentioned rooms = Class Rooms
========================================================= */
        "Second Floor": [

            { room: "301", detail: "Class Room" },
            { room: "302", detail: "Class Room" },
            { room: "303", detail: "Class Room" },
            { room: "304", detail: "Class Room" },
            { room: "305", detail: "Class Room" },
            { room: "306", detail: "Class Room" },
            { room: "307", detail: "Class Room" },

            {
                room: "308",
                detail: "Women Empowerment Cell"
            },

            {
                room: "309",
                detail: "Ladies Waiting Hall"
            },

            {
                room: "—",
                detail: "Girls Washroom"
            },

            {
                room: "—",
                detail:
                    "First Aid — available on the floor"
            }
        ],


        /* =====================================================
           THIRD FLOOR
           Unmentioned rooms = Class Rooms
========================================================= */
        "Third Floor": [

            { room: "401", detail: "Class Room" },
            { room: "402", detail: "Class Room" },
            { room: "403", detail: "Class Room" },
            { room: "404", detail: "Class Room" },
            { room: "405", detail: "Class Room" },
            { room: "406", detail: "Class Room" },
            { room: "407", detail: "Class Room" },

            {
                room: "408",
                detail: "PAIE CALL — Yoga & UHV"
            },

            {
                room: "409",
                detail: "Boys/Gents Waiting Hall"
            },

            {
                room: "—",
                detail: "Boys Washroom"
            },

            {
                room: "—",
                detail:
                    "First Aid — available on the floor"
            }
        ]
    }
};
/* =========================================================
   10. CIVIL BLOCK INFORMATION
========================================================= */

const civilBlockData = {

    commonFacilities: [
        "🚻 Boys Washroom on every floor",
        "🚻 Girls Washroom on every floor",
        "🚰 Drinking Water available on every floor",
        "🩹 First Aid Box available on every floor"
    ],

    floors: {

        /* =====================================================
           GROUND FLOOR
        ===================================================== */
        "Ground Floor": [

            {
                room: "101",
                detail: "Smart Infrastructure Lab"
            },

            {
                room: "102",
                detail: "Class Room"
            },

            {
                room: "104",
                detail: "Class Room"
            },

            {
                room: "106",
                detail: "Environmental Engineering Laboratory"
            },

            {
                room: "107",
                detail:
                    "Sri. V. Venkateswara Raju"
            },

            {
                room: "108",
                detail:
                    "Smt. Bh. Revathi; " +
                    "Smt. G. Sri Satya"
            },

            {
                room: "109",
                detail:
                    "Dr. G. Sasikala"
            },

            {
                room: "110",
                detail:
                    "Dr. A.C.S.V. Prasad"
            },

            {
                room: "—",
                detail:
                    "Head of the Department — Civil Engineering — Dr. G. Sri Bala"
            },

            {
                room: "—",
                detail: "Boys Washroom"
            },

            {
                room: "—",
                detail: "Girls Washroom"
            },

            {
                room: "—",
                detail: "Drinking Water"
            },

            {
                room: "—",
                detail: "First Aid Box"
            }
        ],


        /* =====================================================
           FIRST FLOOR
        ===================================================== */
        "First Floor": [

            {
                room: "201",
                detail: "Class Room"
            },

            {
                room: "202",
                detail: "Class Room"
            },

            {
                room: "203",
                detail: "Class Room"
            },

            {
                room: "204",
                detail: "Seminar Hall"
            },

            {
                room: "205",
                detail: "Department Library"
            },

            {
                room: "207",
                detail:
                    "Centre for Clean and Sustainable Environment (CCSE)"
            },

            {
                room: "208",
                detail:
                    "Dr. E. Ramanjaneya Raju; " +
                    "Sri. G. Sabarish; " +
                    "Sri. G. Lakshmi Ganesh"
            },

            {
                room: "209",
                detail:
                    "Dr. P. V. Rambabu; " +
                    "Sri. S. Srikanth Reddy"
            },

            {
                room: "210",
                detail:
                    "Dr. S. K. V. S. T. Lava Kumar; " +
                    "Sri. T. Edukondalu"
            },

            {
                room: "—",
                detail: "Boys Washroom"
            },

            {
                room: "—",
                detail: "Girls Washroom"
            },

            {
                room: "—",
                detail: "Drinking Water"
            },

            {
                room: "—",
                detail: "First Aid Box"
            }
        ],


        /* =====================================================
           SECOND FLOOR
        ===================================================== */
        "Second Floor": [

            {
                room: "301",
                detail: "Class Room"
            },

            {
                room: "302",
                detail: "Class Room"
            },

            {
                room: "303",
                detail: "Class Room"
            },

            {
                room: "304",
                detail: "Digital Learning Centre"
            },

            {
                room: "305",
                detail: "Class Room"
            },

            {
                room: "306",
                detail:
                    "Sri. G. L. V. Krishna Raju; " +
                    "Sri. P. Raju"
            },

            {
                room: "307",
                detail:
                    "Sri. Bh. Raghu Varma; " +
                    "Sri. D. Prudhvi Raju; " +
                    "Sri. D. Karthik Phani Varma"
            },

            {
                room: "308",
                detail:
                    "Sri. J. N. S. Suryanarayana Raju; " +
                    "Sri. K. Jagadeep"
            },

            {
                room: "309",
                detail:
                    "Sri. M. Venkata Rao; " +
                    "Sri. M. S. K. Chaitanya"
            },

            {
                room: "—",
                detail: "Boys Washroom"
            },

            {
                room: "—",
                detail: "Girls Washroom"
            },

            {
                room: "—",
                detail: "Drinking Water"
            },

            {
                room: "—",
                detail: "First Aid Box"
            }
        ]
    }
};
const eceBlockDataFloorDetails = {

    commonFacilities: [
        "🚻 Washrooms available on every floor",
        "💧 Drinking water available on every floor",
        "🧼 Hand-washing water available on every floor",
        "🪜 Steps / Stairs",
        "🛗 Elevator",
        "🔥 Fire safety facilities"
    ],

    floors: {

        "Ground Floor": [
            { room: "T102", detail: "Class Room" },
            { room: "T103", detail: "G.V.S. Padma Rao — Professor" },
            { room: "T104", detail: "Dr. B. Sanjay — Associate Professor; Sri B. Bhaya Prasad — Assistant Professor" },
            { room: "T105", detail: "Dr. G. Naga Raju — Associate Professor; Dr. K.N.V. Satyanarayan — Assistant Professor" },
            { room: "T107", detail: "Office Room" },
            { room: "T108", detail: "Communications Lab" },
            { room: "T109", detail: "Center of Excellence in Embedded Systems and IoT; Skill Development Center" },
            { room: "T110", detail: "Innovation Centre" },
            { room: "—", detail: "Dr. P. Krishna Kanth Varma — Associate Professor" },
            { room: "—", detail: "Dr. S.S. Mohan Reddy — Professor and Head of the Department" }
        ],

        "First Floor": [
            { room: "T201", detail: "Mrs. G. Prathima — Assistant Professor; Mrs. D.V.N. Bharathi — Assistant Professor" },
            { room: "T202", detail: "Dr. Y. Rama Lakshmana — Associate Professor" },
            { room: "T203", detail: "Center of Excellence in Embedded Systems; Digital ICs Lab; Microprocessors Lab" },
            { room: "T204", detail: "Dr. N. Udaya Kumar — Professor" },
            { room: "T205", detail: "Mrs. B. Revathi — Assistant Professor; Dr. T.V. Hyma Lakshmi — Associate Professor" },
            { room: "T206", detail: "Staff Room — Mrs. K. Lakshmi Devi — Assistant Professor; Dr. V. Nagavalli — Associate Professor" },
            { room: "T207", detail: "Class Room" },
            { room: "T208", detail: "Electronic Lab-1" },
            { room: "T209", detail: "AEC Lab" },
            { room: "T210", detail: "Class Room" }
        ],

        "Second Floor": [
            { room: "T301", detail: "Staff Room" },
            { room: "T302", detail: "Normal Class Room" },
            { room: "T303", detail: "Staff Room — Mrs. P.S.S.N. Mownika — Assistant Professor; Dr. S. Swathi — Assistant Professor" },
            { room: "T304", detail: "Digital Signal Processing Lab" },
            { room: "T305A", detail: "Seminar Hall" },
            { room: "T305B", detail: "Normal Room" },
            { room: "T306", detail: "Class Room" }
        ],

        "Third Floor": [
            { room: "T402", detail: "E-Classroom 1" },
            { room: "T403", detail: "Staff Room" },
            { room: "T404", detail: "ELA Lab — Experimental Learning Activities" },
            { room: "T405", detail: "Electronic Lab-3" },
            { room: "T406", detail: "VLSI & IoT Lab" },
            { room: "T407", detail: "E-Classroom 2" },
            { room: "T420", detail: "Staff Room" }
        ]
    }
};


/* =========================================================
   10. CAFETERIA MENU  (unchanged)
========================================================= */

const cafeteriaMenu = {
    "🍽️ Tiffins": [
        ["Upma", 25], ["Idly (3)", 30], ["Gari (3)", 30], ["Bajji (4)", 30],
        ["Punugu (4)", 30], ["Puri (2)", 35], ["Plain Dosa", 35], ["Onion Dosa", 40],
        ["Pesarattu", 40], ["Ravva Dosa", 40], ["Masala Dosa", 45], ["Egg Dosa", 50],
        ["Sambar Idly", 40], ["Sambar Gari", 40], ["Upma Pesarattu", 50], ["Chapathi", 40],
        ["Parota", 40], ["Egg Chapathi", 50], ["Egg Parota", 50], ["Omelette", 20]
    ],
    "🍜 Fast Food": [
        ["Veg Fried Rice", 60], ["Egg Fried Rice", 70], ["Chicken Fried Rice", 90],
        ["Roast Fried Rice", 120], ["Veg Noodles", 60], ["Egg Noodles", 70], ["Chicken Noodles", 90]
    ],
    "🍛 Meals & Curry": [
        ["Meals", 70], ["Chicken Biryani", 150], ["Veg Curry", 25], ["Chicken Curry", 70]
    ],
    "🫖 Tea & Coffee": [
        ["Tea", 10], ["Tea (Parcel)", 15], ["Coffee", 15], ["Coffee (Parcel)", 20],
        ["Horlicks", 20], ["Horlicks (Parcel)", 25], ["Boost", 20], ["Boost (Parcel)", 25]
    ]
};
/* =========================================================
   10B. PORSCH SNACKS MENU
   ---------------------------------------------------------
   Menu transcribed from the supplied Food Court menu photos.
   Prices are kept according to the visible menu boards.
========================================================= */

const porschSnacksMenu = {

    "🥪 Sandwich": [
        ["Corn Sandwich", 90],
        ["Paneer Sandwich", 100],
        ["Chicken Tikka Sandwich", 100],
        ["Chicken Chettinad Sandwich", 100],
        ["Grilled Chicken Sandwich", 100]
    ],

    "🌯 Frankie": [
        ["Paneer Frankie", 90],
        ["Kaju Paneer Frankie", 100],
        ["Chicken Tikka Frankie", 90],
        ["Chicken Chettinad Frankie", 90],
        ["Kaju Chicken Tikka Frankie", 110],
        ["Kaju Chettinad Frankie", 110]
    ],

    "🍔 Burger": [
        ["Veg Burger", 80],
        ["Chicken Burger", 90]
    ],

    "🍟 Snacks": [
        ["French Fries", 70],
        ["Chicken Nuggets (4)", 80],
        ["Chicken Samosa (4)", 80]
    ],

    "🍕 Pizza": [
        ["Corn Pizza", 120],
        ["Paneer Pizza", 130],
        ["Chicken Pizza", 130],
        ["Kaju Paneer Pizza", 160],
        ["Kaju Chicken Pizza", 160]
    ],

    "🍜 Maggie": [
        ["Corn Maggie", 70],
        ["Egg Maggie", 75],
        ["Double Egg Maggie", 80],
        ["Paneer Maggie", 100],
        ["Chicken Maggie", 100],
        ["Cheese Chicken Maggie", 110]
    ],

    "🍳 Fried Maggie": [
        ["Corn Fried Maggie", 80],
        ["Egg Fried Maggie", 90],
        ["Chicken Fried Maggie", 100]
    ],

    "🍚 Fried Rice": [
        ["Veg Friedrice", 80],
        ["Egg Friedrice", 90],
        ["Chicken Friedrice", 120],
        ["Kaju Veg Friedrice", 120],
        ["Kaju Egg Friedrice", 130],
        ["Kaju Paneer Friedrice", 150],
        ["Kaju Chicken Friedrice", 150],
        ["Butter Garlic Veg Friedrice", 130],
        ["Butter Garlic Egg Friedrice", 150],
        ["Butter Garlic Chicken Friedrice", 170],
        ["Szechwan Veg Friedrice", 90],
        ["Szechwan Egg Friedrice", 110],
        ["Szechwan Chicken Friedrice", 130],
        ["Mangolian Veg Friedrice", 110],
        ["Mangolian Egg Friedrice", 120],
        ["Mangolian Chicken Friedrice", 140],
        ["Veg Manchurian Friedrice", 130],
        ["Special Chicken Friedrice", 200]
    ],

    "🍜 Noodles": [
        ["Veg Noodles", 80],
        ["Egg Noodles", 90],
        ["Paneer Noodles", 110],
        ["Chicken Noodles", 110],
        ["Butter Garlic Veg Noodles", 110],
        ["Butter Garlic Egg Noodles", 130],
        ["Butter Garlic Paneer Noodles", 160],
        ["Butter Garlic Chicken Noodles", 160],
        ["Szechwan Veg Noodles", 90],
        ["Szechwan Egg Noodles", 100],
        ["Szechwan Paneer Noodles", 130],
        ["Szechwan Chicken Noodles", 130]
    ],

    "🍗 Dry Items": [
        ["Veg Manchurian", 80],
        ["Chilli Chicken", 150],
        ["Chicken 65", 150],
        ["Chicken Manchurian", 150],
        ["Chicken Magestic", 180],
        ["Crispy Chicken", 180]
    ],

    "🥤 Juices": [
        ["Pineapple Juice", 60],
        ["Water Melon Juice", 60],
        ["Muskmelon Juice", 70],
        ["Banana Juice", 70],
        ["Grape Juice", 70],
        ["Carrot Juice", 80]
    ],

    "🍹 Mocktails": [
        ["Blue Lagoon Mocktail", 70],
        ["Mint Lime Mocktail", 70],
        ["Greenapple Mocktail", 70],
        ["Bubblegum Mocktail", 80],
        ["Watermelon Mocktail", 80]
    ],

    "🥛 Milkshakes": [
        ["Vanilla Milkshake", 80],
        ["Strawberry Milkshake", 80],
        ["Chocolate Milkshake", 90],
        ["Butter Scotch Milkshake", 90],
        ["Oreo Milkshake", 100],
        ["Kitkat Milkshake", 100],
        ["Blackcurrant Milkshake", 100],
        ["Cold Coffee", 100],
        ["Green Apple Milkshake", 100]
    ],

    "🍨 Ice Cream": [
        ["Vanilla Ice Cream", 60],
        ["Strawberry Ice Cream", 60],
        ["Chocolate Ice Cream", 70],
        ["Butterscotch Ice Cream", 70],
        ["Blackcurrent Ice Cream", 80],
        ["American Nuts Ice Cream", 80]
    ],

    "🍨 Ice Cream Juices": [
        ["Ice Cream Banana", 90],
        ["Ice Cream Muskmelon", 90],
        ["Ice Cream Carrot", 100],
        ["Ice Cream Kaju Banana", 110]
    ],

    "➕ Extras": [
        ["Add Egg", 10],
        ["Add Chicken", 30],
        ["Add Kaju", 30]
    ]

};

/* =========================================================
   11. PAGE INFORMATION  (unchanged)
========================================================= */
/* =========================================================
   SILVER JUBILEE BLOCK INFORMATION
========================================================= */

const silverJubileeBlockData = {

    commonFacilities: [
        "🔥 Fire safety facilities available on every floor",
        "💧 Drinking water available on every floor",
        "🛗 Elevator available on every floor"
    ],

    floors: {

        /* =====================================================
           GROUND FLOOR
        ===================================================== */
        "Ground Floor": [

            {
                room: "U107",
                detail: "DSP Lab / Computer Center"
            },

            {
                room: "U102",
                detail: "Communication Engineering Lab 2"
            },

            {
                room: "—",
                detail: "Training & Placement Cell Room"
            },

            {
                room: "U105",
                detail:
                    "Associate Professor — Dr. R. Krishnam Chaitanya; " +
                    "Assistant Professor — Sri. K.N.V.S. Varma"
            },

            {
                room: "U104",
                detail:
                    "Innovation & Product Development Facility — " +
                    "Associate Professor — Dr. K. Bala Sindhuri"
            },

            {
                room: "U103",
                detail:
                    "Professor — Dr. B.V.S.S.N. Raju"
            },

            {
                room: "U106",
                detail:
                    "Assistant Professor — Sri. T. Venkata Narayana; " +
                    "Professor — Dr. S.S. Mohan Reddy"
            },

            {
                room: "—",
                detail: "Boys & Gent Staff Washrooms"
            }

        ],


        /* =====================================================
           FIRST FLOOR
        ===================================================== */
        "First Floor": [

            {
                room: "—",
                detail: "EEE Seminar Hall"
            },

            {
                room: "U201",
                detail: "Class Room"
            },

            {
                room: "U202",
                detail: "Class Room"
            },

            {
                room: "U203",
                detail: "Class Room"
            },

            {
                room: "U204",
                detail: "Class Room"
            },

            {
                room: "U204",
                detail: "SRKR IEEE Student Branch"
            },

            {
                room: "U207",
                detail:
                    "THE INSTITUTE OF ENGINEER (INDIA) BHIMAVARAM LOCAL CENTER"
            },

            {
                room: "—",
                detail:
                    "Confidential Section — Heart of the College / Treasure of the College"
            },

            {
                room: "—",
                detail: "Nano Technology Research Center Room"
            },

            {
                room: "—",
                detail: "Girls & Lady Staff Washroom"
            }

        ],


        /* =====================================================
           SECOND FLOOR
        ===================================================== */
        "Second Floor": [

            {
                room: "U307",
                detail: "Class Room"
            },

            {
                room: "U308",
                detail: "Class Room"
            },

            {
                room: "U309",
                detail: "Class Room"
            },

            {
                room: "U310",
                detail: "Class Room"
            },

            {
                room: "—",
                detail: "E Class Room"
            },

            {
                room: "—",
                detail: "Some other rooms without numbers"
            },

            {
                room: "—",
                detail: "Boys & Gent Staff Washrooms"
            }

        ],


        /* =====================================================
           THIRD FLOOR
        ===================================================== */
        "Third Floor": [

            {
                room: "—",
                detail: "First Year Girls Waiting Hall"
            },

            {
                room: "U401",
                detail: "Class Room"
            },

            {
                room: "U402",
                detail: "Class Room"
            },

            {
                room: "U403",
                detail: "Class Room"
            },

            {
                room: "U405",
                detail: "Room"
            },

            {
                room: "U406",
                detail:
                    "VISWAKAVI MULTILINGUAL COMMUNICATION SKILL LAB"
            },

            {
                room: "U407",
                detail: "Class Room"
            },

            {
                room: "U408",
                detail: "Class Room"
            },

            {
                room: "U409",
                detail: "Class Room"
            },

            {
                room: "U410",
                detail: "Class Room"
            },

            {
                room: "U411",
                detail: "Class Room"
            },

            {
                room: "—",
                detail: "TOEFL/GRE Test Centre"
            },

            {
                room: "—",
                detail: "Waiting Hall"
            }

        ]

    }
};
const campusDetails = {
        "admin": {
        title: "Administrative Block",
        category: "Administration",
        customType: "admin-block"
    },
        "n-block": {
        title: "N Block",
        category: "Academic Block",
        customType: "n-block"
    },

    "mech": {
        title: "Mechanical Block",
        category: "Academic Block",
        customType: "mech-block"
    },

    "it": {
        title: "IT Block",
        category: "Academic Block",
        customType: "it-block"
    },
    "s-block": {
        title: "S Block",
        category: "Academic Block",
        customType: "s-block",
        sections: {
            "🏫 Block Information": ["Four floors", "Academic and faculty rooms", "Laboratories", "Waiting halls", "Department offices"],
            "🛗 Common Facilities": sBlockData.commonFacilities
        }
    },
        "cse": {
        title: "CSE Block",
        category: "Academic Block",
        customType: "cse-block"
    },
   "technological-centre": {
    title: "Technological Centre (CSD & CSIT Block)",
    category: "Academic Block",
    customType: "technological-centre"
},
    "canteen": {
        title: "Cafeteria",
        category: "Food & Refreshments",
        customType: "cafeteria",
        sections: { "🕐 Timings": ["Flexible / subject to availability"] }
    },
    "gym": {
    title: "Gym",
    category: "Sports & Recreation",
    sections: {
        "🏋️ Facility": [
            "Gym",
            "Located beside W Block"
        ],
        "🕐 Morning": [
            "6:00 AM – 7:30 AM"
        ],
        "🌆 Evening": [
            "4:30 PM – 6:30 PM"
        ]
    }
},

"w-block": {
    title: "W Block (W1–W5)",
    category: "Academic Block",
    sections: {
        "🏢 Block Information": [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5"
        ],
        "📍 Location": [
            "Located beside the Gym"
        ]
    }
},

"open-air-gym": {
    title: "Open-Air Gym",
    category: "Sports & Recreation",
    sections: {
        "🏃 Facility": [
            "Open-air gym",
            "Suitable for warm-up activities"
        ]
    }
},

"volleyball-courts": {
    title: "Volleyball Courts",
    category: "Sports & Recreation",
    sections: {
        "🏐 Facility": [
            "2 Volleyball Courts"
        ]
    }
},
    "badminton": {
        title: "Badminton Court",
        category: "Sports & Recreation",
        sections: { "🌅 Morning": ["5:00 AM – 8:00 AM"], "🌆 Evening": ["5:00 PM – 8:00 PM"] }
    },
    "srujana-vatika": {
        title: "Srujana Vatika",
        category: "Campus Facilities",
        sections: { "🌿 Activities": ["Sensory Walks", "Ayurveda Vanam"] }
    },
   "ece": {
    title: "ECE Block",
    category: "Academic Block",
    customType: "ece-block",

    sections: {
        "🏫 Block Information": [
            "Four floors",
            "Electronics & Communication Engineering Department",
            "Classrooms, faculty rooms, laboratories and seminar facilities"
        ],

        "🚻 Common Facilities": [
            "🚻 Washrooms available on every floor",
            "💧 Drinking water available on every floor",
            "🧼 Hand-washing water available on every floor"
        ]
    }
},

"eee": {
    title: "EEE Block",
    category: "Academic Block",
    customType: "eee-block",

    sections: {
        "🏫 Block Information": [
            "Electrical and Electronics Engineering Department",
            "Ground Floor, First Floor, Second Floor, Third Floor and Top Floor",
            "Classrooms, faculty rooms, laboratories, department office and library facilities"
        ],

         "🚻 Common Facilities": [
    "🚻 Washrooms available on every floor",
    "💧 Drinking water available on every floor",
    "🧼 Hand-washing water available on every floor",
    "🪜 Steps / Stairs",
    "🛗 Elevator",
    "🔥 Fire safety facilities",
    "⚙️ All standard common facilities available like other blocks"
]
    }
},

"silver-jubilee": {
    title: "Silver Jubilee",
    category: "Campus Facilities",
    customType: "silver-jubilee",

    sections: {
        "🏫 Ground Floor": [
            "🚻 Boys & Gent Staff Washrooms",
            "💻 DSP Lab / Computer Center — U107",
            "📡 Communication Engineering Lab 2 — U102",
            "💼 Training & Placement Cell Room",
            "👨‍🏫 U105 — Associate Professor Dr. R. Krishnam Chaitanya & Sri. K.N.V.S. Varma, Assistant Professor",
            "💡 U104 — Innovation & Product Development Facility — Associate Professor Dr. K. Bala Sindhuri",
            "👨‍🏫 U103 — Dr. B.V.S.S.N. Raju, Professor",
            "👨‍🏫 U106 — Assistant Professor Sri. T. Venkata Narayana & Dr. S.S. Mohan Reddy, Professor"
        ],

        "🏫 First Floor": [
            "📢 EEE Seminar Hall",
            "🏫 U204 — Classroom",
            "💻 U204 — SRKR IEEE Student Branch",
            "🏫 U201, U202, U203 — Classrooms",
            "🚻 Girls & Lady Staff Washroom",
            "🏛️ U207 — THE INSTITUTE OF ENGINEER (INDIA) BHIMAVARAM LOCAL CENTER",
            "🔐 Confidential Section — Heart of the College / Treasure of the College",
            "🔬 Nano Technology Research Center Room"
        ],

        "🏫 Second Floor": [
            "🚻 Boys & Gent Staff Washrooms",
            "🏫 U307, U308, U309, U310 — Classrooms",
            "🏫 U309 — Classroom",
            "🏫 E Classroom",
            "🏢 Some other rooms without numbers"
        ],

        "🏫 Third Floor": [
            "👩‍🎓 First Year Girls Waiting Hall",
            "🗣️ U406 — VISWAKAVI MULTILINGUAL COMMUNICATION SKILL LAB",
            "🏢 U405 — Room",
            "🌐 TOEFL/GRE Test Centre",
            "🪑 Waiting Hall",
            "🏫 U401, U402, U403, U407, U408, U409, U410, U411 — Classrooms"
        ],

        "🛗 Common Facilities": [
            "🚻 Common facilities available on every floor",
            "🔥 Fire safety facilities available on every floor",
            "💧 Drinking water available on every floor",
            "🛗 Elevator available",
            "⚙️ Other standard common facilities available on every floor"
        ]
    }
},
"civil": {
        title: "Civil Block",
        category: "Academic Block",
        customType: "civil-block",

        sections: {
            "🏫 Block Information": [
                "Three floors",
                "Civil Engineering Department",
                "Laboratories",
                "Department Library",
                "Seminar Hall",
                "Digital Learning Centre",
                "Centre for Clean and Sustainable Environment (CCSE)"
            ],

            "🚻 Common Facilities":
                civilBlockData.commonFacilities
        }
        },
};


/* =========================================================
   12. SEARCH DATA  (unchanged logic)
========================================================= */

/* =========================================================
   12. SMART SEARCH 2.0
   ---------------------------------------------------------
   Search understands:
   - destination names
   - aliases
   - categories
   - partial words
   - multiple words
   - common natural-language queries
========================================================= */

const smartSearchData =
    Object.entries(
        campusLocations
    ).map(
        ([id, location]) => {

            let type =
                "facility";

            if (
                location.category ===
                "Academic"
            ) {
                type =
                    "building";
            }

            if (
                location.category ===
                "Administration"
            ) {
                type =
                    "administration";
            }

            if (
                location.category ===
                "Campus Entrance"
            ) {
                type =
                    "entrance";
            }

            if (
                location.category ===
                "Campus Landmark"
            ) {
                type =
                    "landmark";
            }

            if (
                location.category ===
                "Food & Refreshments"
            ) {
                type =
                    "food";
            }

            if (
                location.category ===
                "Parking & Transport"
            ) {
                type =
                    "parking";
            }

            if (
                location.category ===
                "Sports & Recreation"
            ) {
                type =
                    "sports";
            }


            const keywords = [

                location.name,

                location.category,

                ...(location.aliases || [])

            ];


            return {

                id,

                type,

                title:
                    location.name,

                subtitle:
                    location.category,

                keywords,

                searchableText:
                    keywords
                        .join(" ")
                        .toLowerCase()

            };

        }
    );

/* =========================================================
   SMART SEARCH 3.0 — INTERNAL CAMPUS PLACES
   ---------------------------------------------------------
   Searches inside block floor directories.

   Examples:
   - Python Lab
   - DBMS
   - DLC
   - Robotics
   - VLSI
   - Smart Infrastructure Lab
   - Power System Laboratory

   Internal places are linked back to their parent
   campus block for navigation.
========================================================= */

const smartSearchBlockSources = [
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


/* ---------------------------------------------------------
   INTERNAL PLACE ACRONYM
   ---------------------------------------------------------
   Example:

   Digital Learning Centre
   ↓
   DLC

   Data Base Management Systems Lab
   ↓
   DBMS
--------------------------------------------------------- */

function getInternalPlaceAcronym(text) {

    const normalized =
        String(text || "")
            .replace(/&/g, " ")
            .replace(/[()\/,\-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    if (!normalized) {
        return "";
    }

    const ignoredWords = new Set([
        "lab",
        "labs",
        "laboratory",
        "laboratories",
        "the",
        "and",
        "of",
        "for",
        "a",
        "an"
    ]);

    const words =
        normalized
            .split(" ")
            .filter(Boolean);

    const acronym =
        words
            .filter(word =>
                !ignoredWords.has(
                    word.toLowerCase()
                )
            )
            .map(word =>
                word.charAt(0)
            )
            .join("")
            .toUpperCase();

    return acronym;
}


/* ---------------------------------------------------------
   INTERNAL PLACE SEARCH KEYWORDS
--------------------------------------------------------- */

function getInternalPlaceSearchKeywords(detail) {

    const original =
        String(detail || "").trim();

    if (!original) {
        return [];
    }

    const keywords = [
        original
    ];

    /*
       Combined entries often contain multiple
       facilities separated by "&".

       Example:
       "Mobile App Development Lab &
        Data Mining Lab"

       We want both pieces independently searchable.
    */

    original
        .split(/\s*&\s*/)
        .map(part => part.trim())
        .filter(Boolean)
        .forEach(part => {

            keywords.push(part);

            const acronym =
                getInternalPlaceAcronym(
                    part
                );

            if (acronym) {
                keywords.push(acronym);
            }

        });


    /*
       Also generate an acronym for the complete
       facility description.
    */

    const fullAcronym =
        getInternalPlaceAcronym(
            original
        );

    if (fullAcronym) {
        keywords.push(fullAcronym);
    }


    return [
        ...new Set(
            keywords
                .filter(Boolean)
        )
    ];
}


/* ---------------------------------------------------------
   IS THIS AN INTERNAL PLACE?
--------------------------------------------------------- */

function isInternalSearchPlace(detail) {

    const original =
        String(detail || "")
            .trim();

    if (!original) {
        return false;
    }


    const normalized =
        normalizeSearchQuery(
            original
        );

    if (!normalized) {
        return false;
    }


    /* =====================================================
       1. ALWAYS EXCLUDE PURE CLASSROOM ENTRIES
    ===================================================== */

    if (
        /\bclass\s*room(s)?\b/i.test(original) ||
        /\bclassroom(s)?\b/i.test(original)
    ) {
        return false;
    }


    /* =====================================================
       2. ALWAYS EXCLUDE FACULTY / STAFF ENTRIES
    ===================================================== */

    if (
        /\bfaculty\s+room\b/i.test(original) ||
        /\bstaff\s+room\b/i.test(original) ||
        /\bprofessor\b/i.test(original) ||
        /\bass(istant)?\s*professor\b/i.test(original) ||
        /\bassociate\s+professor\b/i.test(original) ||
        /\bhead\s+of\s+department\b/i.test(original) ||
        /\bhod\b/i.test(original)
    ) {

        /*
           Some useful places contain faculty names in
           their description.

           Example:
           "Department Library — Professor ..."

           Those must remain searchable.
        */

        const usefulPlaceKeywords = [
            "laboratory",
            "laboratories",
            "lab",
            "labs",
            "library",
            "centre",
            "center",
            "seminar hall",
            "auditorium",
            "office",
            "cell",
            "facility",
            "facilities",
            "innovation",
            "research",
            "skill development",
            "digital learning",
            "test centre",
            "test center",
            "startup",
            "start-up",
            "bank",
            "atm",
            "washroom",
            "toilet",
            "water",
            "first aid",
            "waiting hall",
            "waiting area",
            "discussion room",
            "project room",
            "makers space",
            "design center",
            "design centre",
            "server room",
            "tool room",
            "computer center",
            "computer centre"
        ];

        const containsUsefulPlace =
            usefulPlaceKeywords.some(
                keyword =>
                    normalized.includes(
                        normalizeSearchQuery(
                            keyword
                        )
                    )
            );

        if (!containsUsefulPlace) {
            return false;
        }
    }


    /* =====================================================
       3. REMOVE GENERIC / NON-INFORMATIVE ROOM ENTRIES
    ===================================================== */

    if (
        normalized === "room" ||
        normalized === "rooms" ||
        normalized === "normal room" ||
        normalized === "normal rooms" ||
        normalized === "some other rooms without numbers"
    ) {
        return false;
    }


    /* =====================================================
       4. REMOVE GENERIC BLOCK INFORMATION
    ===================================================== */

    if (
        normalized === "laboratories" ||
        normalized === "laboratory" ||
        normalized === "labs" ||
        normalized === "common facilities" ||
        normalized === "common facility"
    ) {
        return false;
    }


    /* =====================================================
       5. REAL INTERNAL PLACES
       -----------------------------------------------
       Anything containing these terms is definitely
       something a student could search for.
    ===================================================== */

    const placeKeywords = [

        /* Laboratories */
        "lab",
        "labs",
        "laboratory",
        "laboratories",

        /* Research */
        "research",
        "research centre",
        "research center",

        /* Academic facilities */
        "library",
        "seminar hall",
        "digital learning centre",
        "digital learning center",
        "test centre",
        "test center",
        "computer centre",
        "computer center",
        "skill development centre",
        "skill development center",
        "centre of excellence",
        "center of excellence",

        /* Innovation / technology */
        "innovation centre",
        "innovation center",
        "innovation facility",
        "technology centre",
        "technology center",
        "technological centre",
        "technological center",
        "i-hub",
        "ihub",
        "ideal lab",
        "makers space",
        "makerspace",
        "design centre",
        "design center",
        "3d tool room",
        "server room",
        "pcb machine",
        "ai computing",

        /* Student / project facilities */
        "startup",
        "start-up",
        "project discussion",
        "project room",
        "discussion room",
        "student branch",
        "training",
        "placement",
        "alumni house",

        /* Administration */
        "office",
        "management room",
        "board room",
        "management chamber",
        "examination centre",
        "examination center",
        "accounts",
        "scholarship",
        "quality assurance",
        "iqac",
        "cell",

        /* Public/student facilities */
        "bank",
        "atm",
        "washroom",
        "toilet",
        "drinking water",
        "water",
        "first aid",
        "waiting hall",
        "waiting area",
        "lounge",
        "cafeteria",
        "cafe",

        /* Other useful campus places */
        "auditorium",
        "hall",
        "facility",
        "centre",
        "center"
    ];


    if (
        placeKeywords.some(
            keyword =>
                normalized.includes(
                    normalizeSearchQuery(
                        keyword
                    )
                )
        )
    ) {
        return true;
    }


    /* =====================================================
       6. NAMED ADMINISTRATIVE / FUNCTIONAL ROOMS
       -----------------------------------------------
       If an entry is specifically named as a room,
       include it unless it was already excluded above.
    ===================================================== */

    if (
        /\b(management|board|office|chamber|accounts|scholarship|examination|registration|coordinator)\b/i
            .test(original)
    ) {
        return true;
    }


    /* =====================================================
       7. NAMED HALLS / WAITING AREAS
    ===================================================== */

    if (
        /\b(hall|waiting)\b/i.test(original)
    ) {
        return true;
    }


    return false;
}


/* ---------------------------------------------------------
   BUILD INTERNAL SEARCH DATA
--------------------------------------------------------- */

function buildInternalSmartSearchData() {

    const results = [];

    smartSearchBlockSources.forEach(
        function (blockId) {

            const blockData =
                getBlockFloorData(
                    blockId
                );

            if (
                !blockData ||
                !blockData.floors
            ) {
                return;
            }


            const blockLocation =
                campusLocations[
                    blockId
                ];

            const blockAliases =
                blockLocation &&
                Array.isArray(
                    blockLocation.aliases
                )
                    ? blockLocation.aliases
                    : [];


            Object.entries(
                blockData.floors
            ).forEach(
                function (
                    [floorName, entries]
                ) {

                    if (
                        !Array.isArray(
                            entries
                        )
                    ) {
                        return;
                    }


                    entries.forEach(
                        function (entry) {

                            let room = "—";
                            let detail = "";


                            /*
                               Normal room object
                            */

                            if (
                                typeof entry ===
                                "object" &&
                                entry !== null
                            ) {

                                room =
                                    String(
                                        entry.room ||
                                        "—"
                                    );

                                detail =
                                    String(
                                        entry.detail ||
                                        ""
                                    ).trim();

                            } else {

                                /*
                                   Some block data uses
                                   plain strings.
                                */

                                detail =
                                    String(
                                        entry ||
                                        ""
                                    ).trim();

                            }


                            if (
                                !isInternalSearchPlace(
                                    detail
                                )
                            ) {
                                return;
                            }


                            const facilityKeywords =
                                getInternalPlaceSearchKeywords(
                                    detail
                                );


                            const keywords = [
                                detail,
                                ...facilityKeywords,

                                blockData.title ||
                                    "",

                                ...blockAliases,

                                floorName,
                                room,

                                `${blockData.title || ""} ${floorName}`,
                                `${detail} ${blockData.title || ""}`,
                                `${detail} ${floorName}`
                            ]
                                .filter(Boolean);


                            const uniqueKeywords =
                                [
                                    ...new Set(
                                        keywords
                                    )
                                ];


                            results.push({

                                /*
                                   The parent block is the
                                   actual navigation target.
                                */

                                id:
                                    blockId,

                                targetId:
                                    blockId,

                                type:
                                    "lab",

                                isInternalPlace:
                                    true,

                                title:
                                    detail,

                                subtitle:
                                    `${blockData.title} • ${floorName} • Room ${room}`,

                                parentBlock:
                                    blockData.title,

                                floor:
                                    floorName,

                                room,

                                keywords:
                                    uniqueKeywords,

                                searchableText:
                                    uniqueKeywords
                                        .join(" ")
                                        .toLowerCase()

                            });

                        }
                    );

                }
            );

        }
    );


    /*
       Remove exact duplicate internal places.
    */

    const seen =
        new Set();

    return results.filter(
        function (item) {

            const key =
                [
                    item.targetId,
                    item.floor,
                    item.room,
                    item.title
                ]
                    .join("|")
                    .toLowerCase();

            if (
                seen.has(key)
            ) {
                return false;
            }

            seen.add(key);

            return true;

        }
    );
}


let internalSmartSearchData = [];

let enhancedSmartSearchData = [];
/* =========================================================
   SEARCH NORMALIZATION
========================================================= */

function normalizeSearchQuery(
    query
) {

    return query

        .toLowerCase()

        .trim()

        .replace(
            /[^\p{L}\p{N}\s]/gu,
            " "
        )

        .replace(
            /\s+/g,
            " "
        );

}


/* =========================================================
   SEARCH TOKENIZATION
========================================================= */

function getSearchTokens(query) {

    const SEARCH_STOP_WORDS = new Set([
        "where",
        "is",
        "the",
        "at",
        "in",
        "to",
        "near",
        "show",
        "me",
        "find",
        "go",
        "how",
        "can",
        "i",
        "my",
        "location",
        "of"
    ]);

    return normalizeSearchQuery(query)
        .split(" ")
        .filter(function (token) {
            return (
                token.length > 0 &&
                !SEARCH_STOP_WORDS.has(token)
            );
        });
}
/* =========================================================
   SMART SEARCH 2.1 — TYPO TOLERANCE
========================================================= */

function getSearchEditDistance(a, b) {

    a = String(a || "");
    b = String(b || "");

    if (a === b) {
        return 0;
    }

    if (a.length === 0) {
        return b.length;
    }

    if (b.length === 0) {
        return a.length;
    }

    const previousRow =
        Array.from(
            { length: b.length + 1 },
            function (_, index) {
                return index;
            }
        );

    for (let i = 1; i <= a.length; i++) {

        const currentRow = [i];

        for (let j = 1; j <= b.length; j++) {

            const insertion =
                currentRow[j - 1] + 1;

            const deletion =
                previousRow[j] + 1;

            const substitution =
                previousRow[j - 1] +
                (a[i - 1] === b[j - 1] ? 0 : 1);

            currentRow[j] =
                Math.min(
                    insertion,
                    deletion,
                    substitution
                );
        }

        previousRow.splice(
            0,
            previousRow.length,
            ...currentRow
        );
    }

    return previousRow[b.length];
}


function isFuzzySearchMatch(queryToken, candidateWord) {

    const token =
        normalizeSearchQuery(queryToken);

    const candidate =
        normalizeSearchQuery(candidateWord);

    if (!token || !candidate) {
        return false;
    }

    if (token === candidate) {
        return true;
    }

    /*
       Very short words are not fuzzy matched.
       This prevents bad results such as:
       "it" → unrelated words.
    */
    if (token.length < 4 || candidate.length < 4) {
        return false;
    }

    /*
       One typo for normal words.
    */
    if (
        token.length <= 6 ||
        candidate.length <= 6
    ) {
        return getSearchEditDistance(
            token,
            candidate
        ) <= 1;
    }

    /*
       Longer words can tolerate up to two
       character differences.
    */
    return getSearchEditDistance(
        token,
        candidate
    ) <= 2;
}


function doesSearchTokenFuzzyMatch(
    token,
    text
) {

    const words =
        normalizeSearchQuery(text)
            .split(" ")
            .filter(Boolean);

    return words.some(function (word) {
        return isFuzzySearchMatch(
            token,
            word
        );
    });
}


/* =========================================================
   SEARCH SCORE
========================================================= */

function scoreSearchResult(item, query) {

    const normalizedQuery =
        normalizeSearchQuery(query);

    if (!normalizedQuery) {
        return 0;
    }

    const tokens =
        getSearchTokens(normalizedQuery);

    const title =
        normalizeSearchQuery(item.title);

    const subtitle =
        normalizeSearchQuery(item.subtitle);

    const searchableText =
        item.searchableText ||
        normalizeSearchQuery(
            item.keywords.join(" ")
        );

    let score = 0;

    /*
       Exact full-name match
    */
    if (title === normalizedQuery) {
        score += 1000;
    }

    /*
       Exact beginning
    */
    if (title.startsWith(normalizedQuery)) {
        score += 500;
    }

    /*
       Partial title match
    */
    if (title.includes(normalizedQuery)) {
        score += 300;
    }

    /*
       Category match
    */
    if (subtitle.includes(normalizedQuery)) {
        score += 100;
    }

    const titleWords =
        title.split(" ");

    const searchableWords =
        searchableText.split(" ");

    let matchedTokens = 0;

    tokens.forEach(function (token) {

        /*
           Exact title word
        */
        if (
            titleWords.some(function (word) {
                return word === token;
            })
        ) {
            score += 220;
            matchedTokens++;
            return;
        }

        /*
           Partial title match
        */
        if (title.includes(token)) {
            score += 120;
            matchedTokens++;
            return;
        }

        /*
           Exact searchable/alias match
        */
        if (searchableText.includes(token)) {
            score += 80;
            matchedTokens++;
            return;
        }

        /*
           TYPO-TOLERANT MATCH
        */
        const fuzzyTitleMatch =
            titleWords.some(function (word) {
                return isFuzzySearchMatch(
                    token,
                    word
                );
            });

        const fuzzySearchMatch =
            searchableWords.some(function (word) {
                return isFuzzySearchMatch(
                    token,
                    word
                );
            });

        if (fuzzyTitleMatch) {

            score += 90;
            matchedTokens++;

        } else if (fuzzySearchMatch) {

            score += 65;
            matchedTokens++;

        }

    });

    /*
       All meaningful search tokens matched.
    */
    if (
        tokens.length > 0 &&
        matchedTokens === tokens.length
    ) {
        score += 250;
    }

    /*
       Stronger fuzzy confidence when the query
       contains multiple meaningful words.
    */
    if (
        tokens.length > 1 &&
        matchedTokens === tokens.length
    ) {
        score += 100;
    }

    return score;
}


/* =========================================================
   GET SMART SEARCH RESULTS
========================================================= */

function getSmartSearchResults(
    query
) {

    const normalizedQuery =
        normalizeSearchQuery(
            query
        );


    if (
        !normalizedQuery
    ) {

        return [];

    }


    return enhancedSmartSearchData

        .map(
            item => ({

                item,

                score:
                    scoreSearchResult(
                        item,
                        normalizedQuery
                    )

            })
        )

        .filter(
            result =>
                result.score > 0
        )

        .sort(
            (a, b) => {

                if (
                    b.score !==
                    a.score
                ) {

                    return (
                        b.score -
                        a.score
                    );

                }


                return a.item.title
                    .localeCompare(
                        b.item.title
                    );

            }
        )

        .slice(
            0,
            12
        );

}


/* =========================================================
   13. QR START
========================================================= */

function getQRStartLocation() {
    const params = new URLSearchParams(window.location.search);
    const start = params.get("start");
    if (!start || !campusLocations[start]) return null;
    return start;
}

let qrStartLocation = getQRStartLocation();

function getQRStartPosition() {
    if (!qrStartLocation) return null;
    return getDestinationPosition(campusLocations[qrStartLocation]);
}


/* =========================================================
   14. PAGE ELEMENTS
========================================================= */

const searchInput = document.getElementById("destinationSearch");
const destinationSelect = document.getElementById("destination");
const navigateButton = document.getElementById("navigateButton");
const locationButton = document.getElementById("locationButton");
const statusMessage = document.getElementById("statusMessage");
const searchSuggestions = document.getElementById("searchSuggestions");
const locationInfo = document.getElementById("locationInfo");
const mapLoading = document.getElementById("mapLoading");


/* =========================================================
   15. STATE
========================================================= */

let map = null;
let routeLayer = null;
let currentUserPosition = null;
let currentGpsAccuracy = null;
let userLocationMarker = null;
let userAccuracyCircle = null;
let gpsWatchId = null;
let campusOverlaysDrawn = false;
let mapHasLoaded = false;
const markers = {};

// Live navigation state
let navigationActive = false;
let activeDestinationId = null;
let activeRoutePath = [];

/*
 * PRESERVED NAVIGATION ROUTE
 *
 * activeRoutePath is allowed to shrink as the
 * user moves through the route.
 *
 * navigationInstructionRoutePath NEVER shrinks.
 * It is kept specifically for calculating
 * turn-by-turn instruction distances.
 */
let navigationInstructionRoutePath = [];
/*
 * VISUAL ROUTE PROGRESS
 *
 * Stores how far the user has progressed along
 * the verified road route.
 *
 * This value never moves backwards because of
 * small GPS fluctuations.
 */
let navigationVisualProgressDistance = 0;

let activeRouteAccessPoint = null;
let lastRerouteTime = 0;
let lastNavigationMapFollow = 0;
let navigationCompleted = false;
let navigationPending = false;

const NAV_OFF_ROUTE_DISTANCE = 25;

/*
 * GPS-aware off-route tolerance.
 *
 * The route should tolerate normal GPS uncertainty,
 * but not hide genuine route deviations.
 */
function getNavigationOffRouteThreshold() {

    const accuracy =
        Number.isFinite(
            currentGpsAccuracy
        )
            ? currentGpsAccuracy
            : 0;

    return Math.min(
        60,
        Math.max(
            NAV_OFF_ROUTE_DISTANCE,
            accuracy * 1.5
        )
    );
}
const NAV_REROUTE_COOLDOWN = 4000;
const NAV_ARRIVAL_DISTANCE = 20;
const NAV_MAP_FOLLOW_INTERVAL = 1200;

/* =========================================================
   FLAGSHIP GEOFENCE NAVIGATION
   ---------------------------------------------------------
   Navigation is allowed ONLY when the accepted GPS
   position is inside the SRKR campus geofence.
========================================================= */

const NAV_GEOFENCE_TOLERANCE = 20;

/*
 * GPS readings near the boundary can fluctuate.
 * Require the position to remain confidently inside
 * before enabling navigation.
 */
const NAV_GEOFENCE_CONFIRMATIONS_REQUIRED = 2;

let navigationGeofenceConfirmed = false;
let navigationGeofenceConfirmations = 0;

let gpsHistory = [];

let lastRawGpsPosition = null;

let lastRawGpsTimestamp = null;

const GPS_HISTORY_LIMIT = 5;

const GPS_MAX_ACCURACY = 50;

const GPS_MAX_REASONABLE_SPEED = 8;

const GPS_MIN_MOVEMENT = 1.5;

/* =========================================================
   STEP 17. NAVIGATION HEADING / ORIENTATION STATE
========================================================= */

let navigationHeading = null;

let navigationHeadingSource = "none";

let navigationLastHeadingPosition = null;

let navigationPassedInstruction = false;
/*
 * How quickly the map follows the user's heading.
 *
 * Lower = smoother/slower
 * Higher = faster/snappier
 */
/*
 * Minimum movement required before calculating
 * heading from GPS position changes.
 */
const NAV_HEADING_MIN_MOVEMENT = 4;


/*
 * GPS compass heading is only trusted when
 * accuracy is reasonably good.
 */
const NAV_HEADING_MIN_ACCURACY = 60;


/*
 * Maximum allowed difference between the user's
 * movement direction and the direction toward
 * the instruction target before we consider the
 * user poorly oriented.
 */
const NAV_APPROACH_HEADING_TOLERANCE = 70;


/*
 * If the instruction target is this close behind
 * the user, consider that instruction passed.
 */
const NAV_PASSED_TARGET_DISTANCE = 4; 

/* =========================================================
   15b. LIVE NAVIGATION UI
   ---------------------------------------------------------
   Navigation controls are created dynamically so the
   existing HTML structure does not need to be redesigned.
   Mobile responsiveness is handled here as well.
========================================================= */

const navigationStyle = document.createElement("style");

navigationStyle.textContent = `
    .srkr-navigation-panel {
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        z-index: 5000;
        width: min(420px, calc(100vw - 28px));
        box-sizing: border-box;
        background: rgba(255,255,255,0.97);
        border: 1px solid rgba(79,70,229,0.15);
        border-radius: 18px;
        padding: 15px;
        box-shadow: 0 14px 40px rgba(15,23,42,0.20);
        backdrop-filter: blur(12px);
        display: none;
    }

    .srkr-navigation-panel.visible {
        display: block;
    }

    .srkr-navigation-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
    }

    .srkr-navigation-label {
        font-size: 11px;
        font-weight: 800;
        color: #6366f1;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 4px;
    }

    .srkr-navigation-destination {
        font-size: 18px;
        line-height: 1.25;
        font-weight: 800;
        color: #0f172a;
        word-break: break-word;
    }

    .srkr-navigation-icon {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: #eef2ff;
        font-size: 21px;
    }

    .srkr-navigation-distance {
        margin-top: 13px;
        font-size: 26px;
        line-height: 1;
        font-weight: 900;
        color: #111827;
    }

    .srkr-navigation-distance-label {
        margin-top: 5px;
        font-size: 12px;
        color: #64748b;
    }

    .srkr-navigation-status {
        margin-top: 11px;
        padding: 9px 11px;
        border-radius: 10px;
        background: #f8fafc;
        color: #475569;
        font-size: 12px;
        line-height: 1.4;
    }

    .srkr-navigation-stop {
        width: 100%;
        margin-top: 11px;
        padding: 11px 14px;
        border: none;
        border-radius: 11px;
        background: #0f172a;
        color: white;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease;
    }

    .srkr-navigation-stop:hover {
        opacity: 0.92;
    }

    .srkr-navigation-stop:active {
        transform: scale(0.98);
    }

    .srkr-navigation-panel.arrived {
        border-color: rgba(22,163,74,0.22);
    }

    .srkr-navigation-panel.arrived .srkr-navigation-icon {
        background: #dcfce7;
    }

    .srkr-navigation-panel.warning {
        border-color: rgba(245,158,11,0.28);
    }

    .srkr-navigation-panel.warning .srkr-navigation-icon {
        background: #fef3c7;
    }

    @media (max-width: 600px) {
        .srkr-navigation-panel {
            bottom: 12px;
            width: calc(100vw - 20px);
            padding: 13px;
            border-radius: 16px;
        }

        .srkr-navigation-destination {
            font-size: 16px;
        }

        .srkr-navigation-distance {
            font-size: 24px;
        }
    }

    @media (max-width: 350px) {
        .srkr-navigation-panel {
            bottom: 8px;
            width: calc(100vw - 14px);
        }

        .srkr-navigation-distance {
            font-size: 22px;
        }
    }
        .srkr-navigation-instruction {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px;
    margin-bottom: 12px;
    border-radius: 13px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.srkr-navigation-instruction-icon {
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #eef2ff;
    font-size: 24px;
}

.srkr-navigation-instruction-content {
    min-width: 0;
    flex: 1;
}

.srkr-navigation-instruction-text {
    font-size: 15px;
    line-height: 1.25;
    font-weight: 800;
    color: #0f172a;
}

.srkr-navigation-instruction-distance {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 700;
    color: #6366f1;
}
    /* =========================================================
   STEP 19. VISUAL HEADING ARROW
========================================================= */

.srkr-navigation-heading {
    width: 58px;
    height: 58px;
    margin: 0 auto 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background: rgba(255,255,255,0.96);

    box-shadow:
        0 4px 14px rgba(15,23,42,0.16);

    overflow: hidden;
    position: relative;
    flex-shrink: 0;

    transition: opacity 0.25s ease;
}

.srkr-navigation-heading::before {
    content: "N";

    position: absolute;
    top: 4px;
    left: 50%;

    transform: translateX(-50%);

    font-size: 8px;
    font-weight: 900;
    color: #64748b;

    z-index: 2;
}

.srkr-navigation-heading-arrow {
    width: 0;
    height: 0;

    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 30px solid #4f46e5;

    transform-origin: 50% 65%;
    position: relative;

    transition: transform 0.35s ease;
}

.srkr-navigation-heading-arrow::after {
    content: "";

    position: absolute;

    width: 8px;
    height: 8px;

    border-radius: 50%;

    background: #4f46e5;

    left: -4px;
    top: 22px;
}

@media (max-width: 600px) {

    .srkr-navigation-instruction {
        padding: 10px;
        gap: 10px;
    }

    .srkr-navigation-instruction-icon {
        width: 42px;
        height: 42px;
        flex-basis: 42px;
        font-size: 21px;
    }

    .srkr-navigation-instruction-text {
        font-size: 14px;
    }
}
`;
navigationStyle.textContent += `

/* =========================================================
   DESTINATION NAVIGATION ACTION
========================================================= */

.srkr-destination-navigation {

    margin-top: 18px;
    padding-top: 16px;

    border-top:
        1px solid
        rgba(15, 23, 42, 0.10);
}


.srkr-destination-navigate {

    width: 100%;

    display: flex;
    align-items: center;

    gap: 12px;

    padding: 14px 16px;

    border: 0;
    border-radius: 16px;

    background:
        linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
        );

    color: #ffffff;

    font-family: inherit;

    text-align: left;

    cursor: pointer;

    box-shadow:
        0 8px 22px
        rgba(37, 99, 235, 0.25);

    transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
}


.srkr-destination-navigate:hover {

    transform:
        translateY(-1px);

    box-shadow:
        0 10px 26px
        rgba(37, 99, 235, 0.32);
}


.srkr-destination-navigate:active {

    transform:
        translateY(1px)
        scale(0.99);
}


.srkr-destination-navigate-icon {

    width: 42px;
    height: 42px;

    flex:
        0 0 42px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 12px;

    background:
        rgba(255,255,255,0.16);

    font-size: 22px;
}


.srkr-destination-navigate-content {

    min-width: 0;

    display: flex;

    flex-direction: column;

    gap: 2px;
}


.srkr-destination-navigate-content strong {

    font-size: 15px;
    font-weight: 800;
}


.srkr-destination-navigate-content small {

    font-size: 12px;

    opacity: 0.88;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}


.srkr-destination-navigate-arrow {

    margin-left: auto;

    font-size: 22px;

    font-weight: 700;

    opacity: 0.9;
}


@media (max-width: 600px) {

    .srkr-destination-navigate {

        padding:
            13px 14px;

    }

    .srkr-destination-navigate-icon {

        width: 40px;
        height: 40px;

        flex-basis: 40px;

    }

}

`;
document.head.appendChild(navigationStyle);


const navigationPanel =
    document.createElement("div");

navigationPanel.className =
    "srkr-navigation-panel";

navigationPanel.innerHTML = `
    <div class="srkr-navigation-top">

        <div>
            <div class="srkr-navigation-label">
                Live Navigation
            </div>

            <div
                class="srkr-navigation-destination"
                id="srkrNavigationDestination"
            >
                Select destination
            </div>
        </div>

        <div
            class="srkr-navigation-icon"
            id="srkrNavigationIcon"
        >
            🧭
        </div>

    </div>

    <div
        class="srkr-navigation-distance"
        id="srkrNavigationDistance"
    >
        -- m
    </div>

    <div class="srkr-navigation-distance-label">
        remaining
    </div>

    <div
        class="srkr-navigation-status"
        id="srkrNavigationStatus"
    >
        Waiting for GPS...
    </div>

    <button
        type="button"
        class="srkr-navigation-stop"
        id="srkrNavigationStop"
    >
        🛑 Stop Navigation
    </button>
`;

document.body.appendChild(navigationPanel);


const srkrNavigationDestination =
    document.getElementById(
        "srkrNavigationDestination"
    );

const srkrNavigationIcon =
    document.getElementById(
        "srkrNavigationIcon"
    );

const srkrNavigationDistance =
    document.getElementById(
        "srkrNavigationDistance"
    );

const srkrNavigationStatus =
    document.getElementById(
        "srkrNavigationStatus"
    );

const srkrNavigationStop =
    document.getElementById(
        "srkrNavigationStop"
    );


function showNavigationPanel() {

    navigationPanel.classList.add(
        "visible"
    );

    navigationPanel.classList.remove(
        "arrived",
        "warning"
    );
}


function hideNavigationPanel() {

    navigationPanel.classList.remove(
        "visible",
        "arrived",
        "warning"
    );
}

/* =========================================================
   SRKR GO — GPS STATUS FORMATTER
========================================================= */

function getGPSStatusText(accuracy) {

    if (
        !Number.isFinite(accuracy) ||
        accuracy <= 0
    ) {
        return "📍 Locating your position...";
    }

    const roundedAccuracy =
        Math.round(accuracy);

    if (roundedAccuracy <= 10) {

        return `🟢 GPS signal good · ±${roundedAccuracy} m`;

    }

    if (roundedAccuracy <= 25) {

        return `🟡 GPS signal fair · ±${roundedAccuracy} m`;

    }

    return `🟠 GPS signal weak · ±${roundedAccuracy} m`;
}
function updateNavigationPanel(
    destinationName,
    distance,
    status,
    icon = "🧭"
) {

    if (!navigationPanel) return;

    showNavigationPanel();

    srkrNavigationDestination.textContent =
        destinationName;

    srkrNavigationDistance.textContent =
        distance;

    srkrNavigationStatus.textContent =
        status;

    srkrNavigationIcon.textContent =
        icon;
}
/* =========================================================
   WALKING ETA
   ---------------------------------------------------------
   Estimate walking time from route distance.

   This is intentionally a simple campus walking estimate,
   not a promise of exact arrival time.
========================================================= */

const SRKR_WALKING_SPEED_MPS = 1.35;

function formatWalkingETA(distanceMeters) {

    if (
        !Number.isFinite(distanceMeters) ||
        distanceMeters < 0
    ) {
        return "Calculating walk time...";
    }

    const totalMinutes =
        Math.max(
            1,
            Math.ceil(
                distanceMeters /
                SRKR_WALKING_SPEED_MPS /
                60
            )
        );

    if (totalMinutes < 60) {

        return `🚶 ~${totalMinutes} min walk`;

    }

    const hours =
        Math.floor(totalMinutes / 60);

    const minutes =
        totalMinutes % 60;

    if (minutes === 0) {

        return `🚶 ~${hours} hr walk`;

    }

    return `🚶 ~${hours} hr ${minutes} min walk`;
}


function updateNavigationPanelWarning(
    destinationName,
    message
) {

    if (!navigationPanel) return;

    showNavigationPanel();

    navigationPanel.classList.add(
        "warning"
    );

    srkrNavigationDestination.textContent =
        destinationName;

    srkrNavigationDistance.textContent =
        "…";

    srkrNavigationStatus.textContent =
        message;

    srkrNavigationIcon.textContent =
        "⚠️";
}


function showNavigationArrived(
    destinationName
) {

    if (!navigationPanel) return;

    showNavigationPanel();

    navigationPanel.classList.add(
        "arrived"
    );

    srkrNavigationDestination.textContent =
        destinationName;

    srkrNavigationDistance.textContent =
        "ARRIVED";

    srkrNavigationStatus.textContent =
        "You have reached your destination.";

    srkrNavigationIcon.textContent =
        "🏁";
}


srkrNavigationStop.addEventListener(
    "click",
    function () {

        navigationActive = false;

resetNavigationMapRotation();

navigationCompleted = false;
        activeDestinationId = null;
        activeRoutePath = [];
        navigationInstructionRoutePath = [];
        activeRouteAccessPoint = null;

        if (routeLayer) {

            map.removeLayer(
                routeLayer
            );

            routeLayer = null;
        }

        hideNavigationPanel();

        statusMessage.textContent =
            "🛑 Navigation stopped.";

        if (
            gpsWatchId !== null
        ) {

            navigator.geolocation.clearWatch(
                gpsWatchId
            );

            gpsWatchId = null;
        }

        locationButton.disabled = false;

        locationButton.textContent =
            "📍 Use My Location";
    }
);

/* =========================================================
   15c. TURN-BY-TURN NAVIGATION STATE
========================================================= */

let navigationInstructions = [];
let currentNavigationInstruction = 0;
let nextNavigationTarget = null;

const NAV_TURN_TRIGGER_DISTANCE = 18;
const NAV_STRAIGHT_ANGLE = 25;
const NAV_TURN_ANGLE = 35;

/* =========================================================
   15d. TURN INSTRUCTION DISPLAY
========================================================= */

const srkrNavigationInstruction =
    document.createElement("div");

srkrNavigationInstruction.className =
    "srkr-navigation-instruction";

srkrNavigationInstruction.innerHTML = `
    <div
        id="srkrNavigationHeading"
        class="srkr-navigation-heading"
        aria-label="Current heading"
    >
        <div
            id="srkrNavigationHeadingArrow"
            class="srkr-navigation-heading-arrow"
        ></div>
    </div>

    <div
        id="srkrNavigationInstructionIcon"
        class="srkr-navigation-instruction-icon"
    >
        🧭
    </div>

    <div class="srkr-navigation-instruction-content">

        <div
            id="srkrNavigationInstructionText"
            class="srkr-navigation-instruction-text"
        >
            Follow the route
        </div>

        <div
            id="srkrNavigationInstructionDistance"
            class="srkr-navigation-instruction-distance"
        >
            --
        </div>

    </div>
`;


navigationPanel.insertBefore(
    srkrNavigationInstruction,
    navigationPanel.firstChild
);


const srkrNavigationInstructionIcon =
    document.getElementById(
        "srkrNavigationInstructionIcon"
    );

const srkrNavigationInstructionText =
    document.getElementById(
        "srkrNavigationInstructionText"
    );

const srkrNavigationInstructionDistance =
    document.getElementById(
        "srkrNavigationInstructionDistance"
    );
   const srkrNavigationHeading =
    document.getElementById(
        "srkrNavigationHeading"
    );

const srkrNavigationHeadingArrow =
    document.getElementById(
        "srkrNavigationHeadingArrow"
    ); 
/* =========================================================
   STEP 18. HEADING INDICATOR
========================================================= */

function getNavigationHeadingIcon() {

    if (
        !Number.isFinite(
            navigationHeading
        )
    ) {

        return "🧭";
    }


    /*
     * Convert heading into a simple directional
     * indicator.
     */

    const heading =
        (
            navigationHeading +
            360
        ) % 360;


    if (
        heading >= 337.5 ||
        heading < 22.5
    ) {

        return "⬆️";
    }


    if (
        heading < 67.5
    ) {

        return "↗️";
    }


    if (
        heading < 112.5
    ) {

        return "➡️";
    }


    if (
        heading < 157.5
    ) {

        return "↘️";
    }


    if (
        heading < 202.5
    ) {

        return "⬇️";
    }


    if (
        heading < 247.5
    ) {

        return "↙️";
    }


    if (
        heading < 292.5
    ) {

        return "⬅️";
    }


    return "↖️";
}
/* =========================================================
   STEP 19. VISUAL HEADING ARROW
   ---------------------------------------------------------
   Rotates the visual arrow using the existing
   navigationHeading value.

   navigationHeading is already calculated by
   the existing Step 17 heading system.
========================================================= */

function updateNavigationHeadingArrow() {

    if (
        !srkrNavigationHeading ||
        !srkrNavigationHeadingArrow
    ) {
        return;
    }


    /*
     * No usable heading yet.
     */
    if (
        !Number.isFinite(
            navigationHeading
        )
    ) {

        srkrNavigationHeading.style.opacity =
            "0.45";

        srkrNavigationHeadingArrow.style.transform =
            "rotate(0deg)";

        return;
    }


    /*
     * Normalize heading to
     * 0–359 degrees.
     */
    const heading =
        (
            navigationHeading +
            360
        ) % 360;


    /*
     * Make the arrow point in the
     * user's current direction.
     */
    srkrNavigationHeading.style.opacity =
        "1";

    srkrNavigationHeadingArrow.style.transform =
        `rotate(${heading}deg)`;
}
/* =========================================================
   STEP 19B. GOOGLE-MAPS STYLE MAP ROTATION
   ---------------------------------------------------------
   Rotates the entire Leaflet map pane while keeping
   navigation controls/UI upright.
========================================================= */


/*
 * Normalize a compass bearing to 0–359°.
 */
function normalizeNavigationBearing(
    bearing
) {

    return (
        bearing + 360
    ) % 360;
}
/*
 * Create the rotation wrapper around Leaflet's
 * map pane.
 *
 * Leaflet continuously changes the map pane's
 * transform internally, so we NEVER overwrite
 * Leaflet's own transform.
 *
 * Instead:
 *
 * map container
 *      ↓
 * rotation wrapper
 *      ↓
 * Leaflet map pane
 */
/*
 * Apply the current navigation bearing.
 */
function ensureNavigationMapRotationWrapper() {

    if (!map) {
        return null;
    }

    const mapContainer =
        map.getContainer();

    if (!mapContainer) {
        return null;
    }

    const mapPane =
        map.getPanes()
            ?.mapPane;

    if (!mapPane) {
        return null;
    }

    if (
        navigationMapRotationWrapper &&
        navigationMapRotationWrapper.isConnected
    ) {
        return navigationMapRotationWrapper;
    }

    let wrapper =
        mapContainer.querySelector(
            ".srkr-map-rotation-wrapper"
        );

    if (!wrapper) {

        wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "srkr-map-rotation-wrapper";

        mapPane.parentNode.insertBefore(
            wrapper,
            mapPane
        );

        wrapper.appendChild(
            mapPane
        );
    }

    wrapper.style.position =
        "absolute";

    wrapper.style.inset =
        "0";

    wrapper.style.width =
        "100%";

    wrapper.style.height =
        "100%";

    wrapper.style.transformOrigin =
        "50% 50%";

    wrapper.style.overflow =
        "visible";

    wrapper.style.pointerEvents =
        "none";

    mapPane.style.pointerEvents =
        "auto";

    navigationMapRotationWrapper =
        wrapper;

    return wrapper;
}
function applyNavigationMapRotation() {

    const wrapper =
        ensureNavigationMapRotationWrapper();

    if (!wrapper) {
        return;
    }

    const bearing =
        normalizeNavigationBearing(
            navigationMapBearing
        );

    wrapper.style.transform =
        `rotate(${-bearing}deg)`;
}
/*
 * Reset the map to normal north-up mode.
 */
/* =========================================================
   STEP 15. DYNAMIC NAVIGATION INSTRUCTION WORDING

   The route and instruction targets stay unchanged.
   Only the visible wording changes as the user gets
   closer to the current instruction target.
========================================================= */

function getDynamicInstructionText(
    instruction,
    distance
) {

    if (!instruction) {
        return "Follow the route";
    }


    const safeDistance =
        Number.isFinite(distance)
            ? Math.max(0, distance)
            : Infinity;


    /*
     * DESTINATION GUIDANCE
     *
     * The final destination gets special wording
     * instead of normal turn instructions.
     */

    if (
        instruction.type === "destination"
    ) {

        const destinationName =
            instruction.text
                .replace(
                    /^Arrive at\s+/i,
                    ""
                )
                .trim();


        if (
            safeDistance <= 8
        ) {

            return `🏁 Arrive at ${destinationName}`;
        }


        if (
            safeDistance <= 25
        ) {

            return `You're almost there — ${destinationName}`;
        }


        if (
            safeDistance <= 60
        ) {

            return `Continue to ${destinationName}`;
        }


        return `Continue toward ${destinationName}`;
    }


    /*
     * STARTING GUIDANCE
     */

    if (
        instruction.type === "start"
    ) {

        return "Head toward the route";
    }


    /*
     * NORMAL TURN TYPES
     */

    const turnNameMap = {

        right:
            "Turn right",

        left:
            "Turn left",

        straight:
            "Continue straight",

        turn:
            "Make the turn"
    };


    const turnName =
        turnNameMap[
            instruction.type
        ] ||
        instruction.text ||
        "Follow the route";


    /*
     * FAR FROM JUNCTION
     *
     * Example:
     * Turn right in 82 m
     */

    if (
        safeDistance > 60
    ) {

        return (
            `${turnName} in ` +
            `${formatNavigationDistance(
                safeDistance
            )}`
        );
    }


    /*
     * MEDIUM DISTANCE
     *
     * Example:
     * Turn right in 43 m
     */

    if (
        safeDistance > 25
    ) {

        return (
            `${turnName} in ` +
            `${Math.max(
                1,
                Math.round(
                    safeDistance
                )
            )} m`
        );
    }


    /*
     * CLOSE TO JUNCTION
     *
     * Example:
     * Get ready to turn right
     */

    if (
        safeDistance > 8
    ) {

        if (
            instruction.type === "straight"
        ) {

            return (
                "Continue straight ahead"
            );
        }


        if (
            instruction.type === "turn"
        ) {

            return (
                "Get ready for the turn"
            );
        }


        return (
            `Get ready to ${
                instruction.type === "right"
                    ? "turn right"
                    : "turn left"
            }`
        );
    }


    /*
     * VERY CLOSE
     *
     * Example:
     * Turn right now
     */

    if (
        instruction.type === "straight"
    ) {

        return (
            "Continue straight now"
        );
    }


    if (
        instruction.type === "turn"
    ) {

        return (
            "Make the turn now"
        );
    }


    return (
        `${
            instruction.type === "right"
                ? "Turn right"
                : "Turn left"
        } now`
    );
}


/* =========================================================
   FORMAT NAVIGATION DISTANCE
========================================================= */

function formatNavigationDistance(
    distance
) {

    if (
        !Number.isFinite(distance)
    ) {

        return "the next junction";
    }


    if (
        distance >= 1000
    ) {

        return (
            `${(
                distance / 1000
            ).toFixed(1)} km`
        );
    }


    return (
        `${Math.max(
            1,
            Math.round(
                distance
            )
        )} m`
    );
}


/* =========================================================
   UPDATE LIVE TURN INSTRUCTION
========================================================= */

function updateTurnInstruction() {

    if (
        !navigationActive ||
        navigationInstructions.length === 0
    ) {

        return;
    }


    const instruction =
        navigationInstructions[
            currentNavigationInstruction
        ];


    if (!instruction) {
        return;
    }


    /*
     * IMPORTANT:
     *
     * This uses the route-aware distance.
     * It is NOT simply the straight-line GPS
     * distance to the junction.
     */

    const distance =
        getNavigationInstructionDistance(
            instruction
        );


    /*
     * Keep the original navigation icon.
     */

    srkrNavigationInstructionIcon.textContent =
        instruction.icon;


    /*
     * STEP 15:
     *
     * Dynamically change the wording according
     * to the user's distance from the instruction.
     */

    /* =========================================================
   STEP 17. ORIENTATION-AWARE INSTRUCTION
========================================================= */

const orientation =
    getOrientationStatus(
        instruction
    );
const headingIcon =
    getNavigationHeadingIcon();

/*
 * If the user is moving away from the current
 * instruction, show a useful orientation message.
 *
 * Otherwise keep the normal dynamic instruction.
 */

if (
    orientation.text ===
    "Reorient toward the route"
) {

    srkrNavigationInstructionText.textContent =
        orientation.text;

} else if (
    orientation.text ===
    "Junction passed — updating guidance"
) {

    srkrNavigationInstructionText.textContent =
        orientation.text;

} else {

    srkrNavigationInstructionText.textContent =
        getDynamicInstructionText(
            instruction,
            distance
        );
}


    /*
     * Keep the numeric distance indicator.
     */

    if (
        distance >= 1000
    ) {

        srkrNavigationInstructionDistance.textContent =
            `${(
                distance / 1000
            ).toFixed(1)} km`;

    } else {

        srkrNavigationInstructionDistance.textContent =
            `${Math.round(
                Math.max(
                    0,
                    distance
                )
            )} m`;
    }


    /*
     * Preserve the existing target.
     */

    nextNavigationTarget =
    instruction.target;

updateNavigationHeadingArrow();
}


function advanceNavigationInstruction() {

    if (
        !navigationActive ||
        !currentUserPosition ||
        navigationInstructions.length === 0
    ) {

        return;
    }


    /*
     * Advance through any instruction targets
     * that the user has already reached.
     *
     * A small loop handles GPS updates that
     * jump across more than one instruction.
     */
    let instructionAdvanced = false;

    while (
        currentNavigationInstruction <
        navigationInstructions.length - 1
    ) {

        const instruction =
            navigationInstructions[
                currentNavigationInstruction
            ];


        const distance =
            getNavigationInstructionDistance(
                instruction
            );


        if (
            !Number.isFinite(distance) ||
            distance >
            NAV_TURN_TRIGGER_DISTANCE
        ) {

            break;
        }


        currentNavigationInstruction++;

        instructionAdvanced = true;
    }


    if (instructionAdvanced) {

        updateTurnInstruction();
    }
}


/* =========================================================
   16. DISTANCE  (unchanged)
========================================================= */

function distanceBetween(pointA, pointB) {
    const R = 6371000;
    const lat1 = pointA[0] * Math.PI / 180;
    const lat2 = pointB[0] * Math.PI / 180;
    const dLat = (pointB[0] - pointA[0]) * Math.PI / 180;
    const dLng = (pointB[1] - pointA[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function isValidGPSReading(position, accuracy, timestamp) {

    // Basic position validation
    if (
        !Array.isArray(position) ||
        position.length !== 2 ||
        !Number.isFinite(position[0]) ||
        !Number.isFinite(position[1])
    ) {
        return false;
    }

    // Invalid GPS accuracy
    if (
        !Number.isFinite(accuracy) ||
        accuracy <= 0
    ) {
        return false;
    }

    // First GPS reading:
    // accept it because there is no previous position to compare against.
    if (
        !lastRawGpsPosition ||
        !lastRawGpsTimestamp
    ) {
        return true;
    }

    // Calculate time between GPS readings
    const elapsedSeconds = Math.max(
        (timestamp - lastRawGpsTimestamp) / 1000,
        0.1
    );

    // Calculate physical movement between readings
    const movement = distanceBetween(
        lastRawGpsPosition,
        position
    );

    // Ignore extremely tiny GPS movement.
    // GPS naturally fluctuates even when standing still.
    if (movement < GPS_MIN_MOVEMENT) {
        return true;
    }

    // Calculate apparent speed
    const speed = movement / elapsedSeconds;

    // Reject an implausible GPS jump
    if (speed > GPS_MAX_REASONABLE_SPEED) {
        console.warn(
            "GPS reading rejected: implausible movement",
            {
                movement,
                elapsedSeconds,
                speed,
                accuracy
            }
        );

        return false;
    }

    // If accuracy becomes very poor while we already have
    // a reliable position, ignore this reading.
    if (
        accuracy > GPS_MAX_ACCURACY &&
        lastRawGpsPosition
    ) {
        console.warn(
            "GPS reading rejected: poor accuracy",
            accuracy
        );

        return false;
    }

    return true;
}
function getSmoothedGPSPosition() {

    if (!gpsHistory.length) {
        return null;
    }

    let totalLatitude = 0;
    let totalLongitude = 0;
    let totalWeight = 0;

    gpsHistory.forEach((reading, index) => {

        if (
            !reading ||
            !Array.isArray(reading.position) ||
            reading.position.length !== 2
        ) {
            return;
        }

        /*
         * Newer GPS readings receive more weight.
         * This reduces small GPS jumps while still
         * allowing the position to follow the user.
         */
        const weight = index + 1;

        totalLatitude +=
            reading.position[0] * weight;

        totalLongitude +=
            reading.position[1] * weight;

        totalWeight += weight;
    });

    if (totalWeight === 0) {
        return null;
    }

    return [
        totalLatitude / totalWeight,
        totalLongitude / totalWeight
    ];
}

/* =========================================================
   17. POINT INSIDE POLYGON  (unchanged)
========================================================= */

function isPointInsidePolygon(latitude, longitude, polygon) {
    let inside = false;
    const x = longitude;
    const y = latitude;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][1], yi = polygon[i][0];
        const xj = polygon[j][1], yj = polygon[j][0];
        const intersects = (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi) / (yj - yi)) + xi;
        if (intersects) inside = !inside;
    }
    return inside;
}


/* =========================================================
   18. POINT TO SEGMENT  (unchanged)
========================================================= */

function distancePointToSegment(point, segmentStart, segmentEnd) {
    const latScale = 111320;
    const lngScale = 111320 * Math.cos(point[0] * Math.PI / 180);
    const px = point[1] * lngScale, py = point[0] * latScale;
    const ax = segmentStart[1] * lngScale, ay = segmentStart[0] * latScale;
    const bx = segmentEnd[1] * lngScale, by = segmentEnd[0] * latScale;
    const abx = bx - ax, aby = by - ay;
    const squared = abx * abx + aby * aby;
    if (squared === 0) return Math.sqrt((px - ax) ** 2 + (py - ay) ** 2);
    let t = ((px - ax) * abx + (py - ay) * aby) / squared;
    t = Math.max(0, Math.min(1, t));
    const closestX = ax + t * abx, closestY = ay + t * aby;
    return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
}


/* =========================================================
   19. GEOFENCE  (unchanged)
========================================================= */

const GPS_BOUNDARY_TOLERANCE = 20;

function isInsideSRKR(latitude, longitude) {
    if (isPointInsidePolygon(latitude, longitude, campusBoundary)) return true;
    const position = [latitude, longitude];
    for (let i = 0; i < campusBoundary.length; i++) {
        const next = (i + 1) % campusBoundary.length;
        if (distancePointToSegment(position, campusBoundary[i], campusBoundary[next]) <= GPS_BOUNDARY_TOLERANCE) return true;
    }
    return false;
}
/* =========================================================
   FLAGSHIP NAVIGATION GEOFENCE
   ---------------------------------------------------------
   Returns true only after the user's GPS position has been
   confirmed inside SRKR for multiple accepted readings.

   This prevents a single noisy GPS reading near the
   boundary from activating navigation accidentally.
========================================================= */

function confirmNavigationGeofence(
    latitude,
    longitude,
    accuracy = Infinity
) {

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        navigationGeofenceConfirmations = 0;
        navigationGeofenceConfirmed = false;
        return false;
    }

    /*
     * Do not allow very poor GPS readings to unlock
     * navigation.
     */
    if (
        !Number.isFinite(accuracy) ||
        accuracy > GPS_MAX_ACCURACY
    ) {
        navigationGeofenceConfirmations = 0;
        navigationGeofenceConfirmed = false;
        return false;
    }

    const inside =
        isInsideSRKR(
            latitude,
            longitude
        );

    if (!inside) {

        navigationGeofenceConfirmations = 0;
        navigationGeofenceConfirmed = false;

        return false;
    }

    navigationGeofenceConfirmations++;

    if (
        navigationGeofenceConfirmations >=
        NAV_GEOFENCE_CONFIRMATIONS_REQUIRED
    ) {
        navigationGeofenceConfirmed = true;
    }

    return navigationGeofenceConfirmed;
}

/* =========================================================
   20. DESTINATION POSITION
   ---------------------------------------------------------
   Now prefers an explicit "center" you surveyed over the
   bounding-box center Leaflet would otherwise compute —
   more accurate for irregular (non-rectangular) buildings.
========================================================= */

function getDestinationPosition(location) {
    if (!location) return null;
    if (location.type === "point") return [location.latitude, location.longitude];
    if (location.type === "area") {
        if (location.center) return location.center;
        const bounds = L.latLngBounds(location.corners);
        const center = bounds.getCenter();
        return [center.lat, center.lng];
    }
    return null;
}

function getLocationPosition(location) {
    return getDestinationPosition(location);
}


/* =========================================================
   21. BEST ACCESS POINT
   ---------------------------------------------------------
   Choose the destination entrance using ACTUAL
   surveyed-road routing distance.
========================================================= */

/* =========================================================
   DESTINATION ACCESS POINT RESOLVER
   ---------------------------------------------------------
   Priority:
   1. Explicit surveyed access points
   2. Area corners
   3. Point location itself

   For multiple candidates, choose the candidate with the
   shortest REAL ROAD ROUTE from the user's current position.
   ========================================================= */

function getDestinationAccessCandidates(
    destinationId
) {

    const location =
        campusLocations[
            destinationId
        ];

    if (!location) {
        return [];
    }

    /*
     * 1. Explicitly surveyed access point
     */
    const explicitPoints =
        hiddenAccessPoints[
            destinationId
        ];

    if (
        Array.isArray(explicitPoints) &&
        explicitPoints.length > 0
    ) {
        return explicitPoints.map(
            point => [
                point[0],
                point[1]
            ]
        );
    }

    /*
     * 2. For areas without a supplied access point,
     *    use their actual surveyed corners.
     */
    if (
        location.type === "area" &&
        Array.isArray(location.corners) &&
        location.corners.length > 0
    ) {
        return location.corners.map(
            corner => [
                corner[0],
                corner[1]
            ]
        );
    }

    /*
     * 3. Normal point destination.
     */
    const position =
        getDestinationPosition(
            location
        );

    return position
        ? [position]
        : [];
}


function getBestAccessPoint(
    destinationId,
    startPosition
) {

    const candidates =
        getDestinationAccessCandidates(
            destinationId
        );

    if (
        candidates.length === 0
    ) {
        return null;
    }

    /*
     * Only one candidate.
     */
    if (
        candidates.length === 1
    ) {
        return candidates[0];
    }

    /*
     * Evaluate every candidate using
     * the actual surveyed road network.
     */
    let bestPoint = null;
    let shortestDistance = Infinity;

    candidates.forEach(
        point => {

            const route =
                findShortestRoadPath(
                    startPosition,
                    point
                );

            if (
                route &&
                Number.isFinite(
                    route.distance
                ) &&
                route.distance <
                    shortestDistance
            ) {

                shortestDistance =
                    route.distance;

                bestPoint =
                    point;
            }
        }
    );

    /*
     * If no candidate is reachable yet,
     * choose the geographically nearest candidate.
     */
    if (!bestPoint) {

        bestPoint =
            candidates.reduce(
                (
                    best,
                    point
                ) => {

                    if (!best) {
                        return point;
                    }

                    return (
                        distanceBetween(
                            startPosition,
                            point
                        ) <
                        distanceBetween(
                            startPosition,
                            best
                        )
                    )
                        ? point
                        : best;
                },
                null
            );
    }

    return bestPoint;
}
/* =========================================================
   21B. CURRENT AREA PEDESTRIAN CONNECTOR
   ---------------------------------------------------------
   Detects whether the user's GPS position is INSIDE a
   surveyed campus area such as:

   - Cafeteria
   - CSE Block
   - Library
   - S Block
   - Mechanical Block
   - etc.

   If the user is inside such an area, the road router
   should NOT pretend that the user is already on a road.

   Instead:

       GPS position
            ↓
       area's access point
            ↓
       surveyed road network

   This creates the first pedestrian connector layer.
========================================================= */

function getCurrentAreaAccessPoint(
    position,
    excludedDestinationId = null
) {

    if (
        !Array.isArray(position) ||
        position.length !== 2
    ) {
        return null;
    }

    const containingAreas = [];

    Object.entries(
        campusLocations
    ).forEach(
        function ([locationId, location]) {

            /*
             * Do not treat point locations as areas.
             */
            if (
                !location ||
                location.type !== "area" ||
                !Array.isArray(location.corners) ||
                location.corners.length < 3
            ) {
                return;
            }

            /*
             * Do not use the destination itself as the
             * current-area connector.
             */
            if (
                locationId ===
                excludedDestinationId
            ) {
                return;
            }

            /*
             * Check whether the live GPS position is
             * physically inside this surveyed area.
             */
            if (
                isPointInsidePolygon(
                    position[0],
                    position[1],
                    location.corners
                )
            ) {

                const candidates =
                    getDestinationAccessCandidates(
                        locationId
                    );

                if (
                    candidates.length === 0
                ) {
                    return;
                }

                /*
                 * Pick the closest valid access point
                 * to the user's actual GPS position.
                 */
                let bestPoint = null;
                let bestDistance = Infinity;

                candidates.forEach(
                    function (candidate) {

                        const distance =
                            distanceBetween(
                                position,
                                candidate
                            );

                        if (
                            distance <
                            bestDistance
                        ) {

                            bestDistance =
                                distance;

                            bestPoint =
                                candidate;
                        }
                    }
                );

                if (bestPoint) {

                    containingAreas.push({
                        locationId,
                        location,
                        accessPoint:
                            bestPoint,
                        distance:
                            bestDistance
                    });
                }
            }
        }
    );

    /*
     * No surveyed area contains the user.
     *
     * Normal road routing should continue.
     */
    if (
        containingAreas.length === 0
    ) {
        return null;
    }

    /*
     * If areas overlap slightly, use the area whose
     * access point is closest to the user's position.
     */
    containingAreas.sort(
        function (a, b) {

            return (
                a.distance -
                b.distance
            );
        }
    );

    const selected =
        containingAreas[0];

    return {
        areaId:
            selected.locationId,

        areaName:
            selected.location.name,

        accessPoint:
            selected.accessPoint,

        distance:
            selected.distance
    };
}
/* =========================================================
   22. REAL SRKR ROAD NETWORK — MASTER DATA
   ---------------------------------------------------------
   IMPORTANT:
   This is the NEW road dataset.

   Previous road coordinates are intentionally removed.

   All roads are treated as:
   - pedestrian accessible
   - bidirectional
   - real physical campus roads

   Road coordinates represent the road centreline.
   Visual rendering is intentionally subtle.
   ========================================================= */

const campusRoads = {

    /*
     * MAIN WEST ↔ NORTH ROAD
     */
    mainNorthRoad: [
        [16.545837247732706, 81.49595243251528],
        [16.542845865459974, 81.49577895644991]
    ],

    /*
     * NORTH ↕ SOUTH ROAD
     */
    northSouthRoad: [
        [16.545414825323963, 81.49592252284889],
        [16.54541864815534, 81.49711093359332]
    ],

    /*
     * EAST-SIDE LONG ROAD
     */
    eastSideRoad: [
        [16.54541864815534, 81.49711093359332],
        [16.54235844734003, 81.49711492155042]
    ],

    /*
     * WEST INTERNAL CONNECTOR
     */
    westInternalRoad: [
        [16.54275793913939, 81.49714084326129],
        [16.542970109088806, 81.49580288418491]
    ],

    /*
     * LOWER INTERNAL ROAD
     */
    lowerInternalRoad: [
        [16.54284013112946, 81.49666428257684],
        [16.54321286180772, 81.4967101440653]
    ],

    /*
     * LOWER WEST ROAD
     */
    lowerWestRoad: [
        [16.542920411644097, 81.49620566769225],
        [16.54329123073048, 81.49625352315847]
    ],

    /*
     * CENTRAL DIAGONAL CONNECTOR
     */
    centralDiagonalRoad: [
        [16.54321286180772, 81.4967101440653],
        [16.54329123073048, 81.49625352315847]
    ],

    /*
     * CENTRAL ↔ WEST ROAD
     */
    centralWestRoad: [
        [16.5436849863169, 81.49712887939496],
        [16.5437346835664, 81.49583478782826]
    ],

    /*
     * UPPER INTERNAL ROAD
     */
    upperInternalRoad: [
        [16.54415902108753, 81.49586669147237],
        [16.544103589663138, 81.49712289746064]
    ],

    /*
     * SOUTH-WEST BUS/ROAD CONNECTION
     */
    southWestRoad: [
        [16.545212519010548, 81.49590355605272],
        [16.54534058395476, 81.49526747714756]
    ],

    /*
     * OUTER SOUTH-WEST CONNECTION
     */
    outerSouthWestRoad: [
        [16.54534058395476, 81.49526747714756],
        [16.54578212065535, 81.49559050154433]
    ]

};
/* =========================================================
   REAL ROAD ROUTING CONSTANTS
========================================================= */

const ROAD_CONNECTION_TOLERANCE_METERS = 6;
const ROAD_ENDPOINT_SNAP_TOLERANCE_METERS = 6;

const ROAD_NODE_MERGE_TOLERANCE_METERS = 3;

const ROAD_NODE_PREFIX = "ROAD_NODE_";


/* =========================================================
   ROAD GEOMETRY HELPERS
========================================================= */

function clampRoadFraction(value) {
    return Math.max(
        0,
        Math.min(1, value)
    );
}


function projectPointOntoRoadSegment(
    point,
    segmentStart,
    segmentEnd
) {

    const referenceLatitude =
        point[0];

    const p =
        navigationPointToXY(
            point,
            referenceLatitude
        );

    const a =
        navigationPointToXY(
            segmentStart,
            referenceLatitude
        );

    const b =
        navigationPointToXY(
            segmentEnd,
            referenceLatitude
        );

    const dx =
        b.x - a.x;

    const dy =
        b.y - a.y;

    const lengthSquared =
        dx * dx +
        dy * dy;

    if (
        lengthSquared <=
        0.000001
    ) {

        return {
            point: [
                segmentStart[0],
                segmentStart[1]
            ],
            distance:
                distanceBetween(
                    point,
                    segmentStart
                ),
            fraction: 0
        };
    }

    let fraction =
        (
            (p.x - a.x) * dx +
            (p.y - a.y) * dy
        ) /
        lengthSquared;

    fraction =
        clampRoadFraction(
            fraction
        );

    const projectedX =
        a.x +
        fraction * dx;

    const projectedY =
        a.y +
        fraction * dy;

    const projectedLat =
        segmentStart[0] +
        fraction *
        (
            segmentEnd[0] -
            segmentStart[0]
        );

    const projectedLng =
        segmentStart[1] +
        fraction *
        (
            segmentEnd[1] -
            segmentStart[1]
        );

    const distance =
        Math.sqrt(
            (
                p.x -
                projectedX
            ) ** 2 +
            (
                p.y -
                projectedY
            ) ** 2
        );

    return {
        point: [
            projectedLat,
            projectedLng
        ],
        distance,
        fraction
    };
}


/* =========================================================
   FIND NEAREST REAL ROAD
========================================================= */

function findNearestRoad(
    position
) {

    if (
        !position ||
        !Array.isArray(position)
    ) {
        return null;
    }

    let best = null;

    Object.entries(
        campusRoads
    ).forEach(
        ([roadId, road]) => {

            if (
                !Array.isArray(road) ||
                road.length < 2
            ) {
                return;
            }

            for (
                let i = 1;
                i < road.length;
                i++
            ) {

                const segmentStart =
                    road[i - 1];

                const segmentEnd =
                    road[i];

                const projection =
                    projectPointOntoRoadSegment(
                        position,
                        segmentStart,
                        segmentEnd
                    );

                if (
                    !projection
                ) {
                    continue;
                }

                if (
                    !best ||
                    projection.distance <
                    best.distance
                ) {

                    best = {
                        roadId,
                        segmentIndex:
                            i - 1,
                        fraction:
                            projection.fraction,
                        point:
                            projection.point,
                        distance:
                            projection.distance
                    };
                }
            }
        }
    );

    return best;
}


/* =========================================================
   SEGMENT INTERSECTION
========================================================= */
/* =========================================================
   ROAD / NAVIGATION COORDINATE PROJECTION
   ---------------------------------------------------------
   Converts latitude/longitude into a local metre-based
   coordinate system for campus-scale geometry calculations.
========================================================= */

function navigationPointToXY(
    point,
    referenceLatitude
) {

    const METERS_PER_DEGREE_LAT =
        111320;

    const METERS_PER_DEGREE_LNG =
        111320 *
        Math.cos(
            referenceLatitude *
            Math.PI /
            180
        );

    return {
        x:
            point[1] *
            METERS_PER_DEGREE_LNG,

        y:
            point[0] *
            METERS_PER_DEGREE_LAT
    };
}
function findRoadSegmentIntersection(
    a,
    b,
    c,
    d
) {

    const referenceLatitude =
        (
            a[0] +
            b[0] +
            c[0] +
            d[0]
        ) / 4;

    const A =
        navigationPointToXY(
            a,
            referenceLatitude
        );

    const B =
        navigationPointToXY(
            b,
            referenceLatitude
        );

    const C =
        navigationPointToXY(
            c,
            referenceLatitude
        );

    const D =
        navigationPointToXY(
            d,
            referenceLatitude
        );

    const denominator =
        (
            A.x - B.x
        ) *
        (
            C.y - D.y
        ) -
        (
            A.y - B.y
        ) *
        (
            C.x - D.x
        );

    if (
        Math.abs(
            denominator
        ) < 0.000001
    ) {
        return null;
    }

    const t =
        (
            (
                A.x - C.x
            ) *
            (
                C.y - D.y
            ) -
            (
                A.y - C.y
            ) *
            (
                C.x - D.x
            )
        ) /
        denominator;

    const u =
        -(
            (
                A.x - B.x
            ) *
            (
                A.y - C.y
            ) -
            (
                A.y - B.y
            ) *
            (
                A.x - C.x
            )
        ) /
        denominator;

    if (
        t < -0.000001 ||
        t > 1.000001 ||
        u < -0.000001 ||
        u > 1.000001
    ) {
        return null;
    }

    return [
        a[0] +
            t *
            (
                b[0] -
                a[0]
            ),

        a[1] +
            t *
            (
                b[1] -
                a[1]
            )
    ];
}


/* =========================================================
   BUILD REAL ROAD GRAPH
========================================================= */

function buildCampusRoadGraph() {

    const nodes = [];
    const edges = [];

    function addNode(
    point,
    roadId,
    segmentIndex,
    fraction
) {

    /*
     * Reuse an existing node only when:
     *
     * 1. It is very close to this point.
     * 2. It already belongs to the SAME surveyed road.
     *
     * Different roads are allowed to share a node only
     * through the explicit intersection-detection logic below.
     */
    const existing =
        nodes.find(node => {

            const nearby =
                distanceBetween(
                    node.point,
                    point
                ) <= 3;

            if (!nearby) {
                return false;
            }

            return Array.isArray(node.roadRefs) &&
                node.roadRefs.some(
                    ref =>
                        ref.roadId === roadId
                );
        });

    if (existing) {

        const alreadyReferenced =
            existing.roadRefs.some(
                ref =>
                    ref.roadId === roadId &&
                    ref.segmentIndex === segmentIndex
            );

        if (!alreadyReferenced) {
            existing.roadRefs.push({
                roadId,
                segmentIndex,
                fraction
            });
        }

        return existing;
    }

    const node = {
        id:
            ROAD_NODE_PREFIX +
            nodes.length,

        point: [
            point[0],
            point[1]
        ],

        roadRefs: [{
            roadId,
            segmentIndex,
            fraction
        }]
    };

    nodes.push(node);

    return node;
}




    /*
     * Start with every surveyed road
     * vertex.
     */

    Object.entries(
        campusRoads
    ).forEach(
        ([roadId, road]) => {

            for (
                let i = 0;
                i < road.length;
                i++
            ) {

                const fraction =
                    road.length === 1
                        ? 0
                        : i /
                          (
                              road.length -
                              1
                          );

                addNode(
                    road[i],
                    roadId,
                    Math.max(
                        0,
                        i - 1
                    ),
                    fraction
                );
            }
        }
    );


    /*
     * Add actual intersections between
     * surveyed road segments.
     */

    const roadEntries =
        Object.entries(
            campusRoads
        );

    roadEntries.forEach(
        (
            [roadAId, roadA],
            indexA
        ) => {

            for (
                let i = 1;
                i < roadA.length;
                i++
            ) {

                const a =
                    roadA[i - 1];

                const b =
                    roadA[i];

                roadEntries.forEach(
                    (
                        [roadBId, roadB],
                        indexB
                    ) => {

                        if (
                            indexB <
                            indexA
                        ) {
                            return;
                        }

                        const startSegment =
                            indexA === indexB
                                ? i
                                : 1;

                        for (
                            let j =
                                startSegment;
                            j <
                            roadB.length;
                            j++
                        ) {

                            if (
                                indexA ===
                                    indexB &&
                                Math.abs(
                                    i - j
                                ) <= 1
                            ) {
                                continue;
                            }

                            const c =
                                roadB[j - 1];

                            const d =
                                roadB[j];

                            const intersection =
                                findRoadSegmentIntersection(
                                    a,
                                    b,
                                    c,
                                    d
                                );

                            if (
                                !intersection
                            ) {
                                continue;
                            }

                            const roadAFraction =
                                projectPointOntoRoadSegment(
                                    intersection,
                                    a,
                                    b
                                ).fraction;

                            const roadBFraction =
                                projectPointOntoRoadSegment(
                                    intersection,
                                    c,
                                    d
                                ).fraction;

                           const intersectionNodeA =
    addNode(
        intersection,
        roadAId,
        i - 1,
        roadAFraction
    );

const intersectionNodeB =
    addNode(
        intersection,
        roadBId,
        j - 1,
        roadBFraction
    );

if (
    intersectionNodeA &&
    intersectionNodeB &&
    intersectionNodeA.id !== intersectionNodeB.id
) {
    const intersectionWeight =
        distanceBetween(
            intersectionNodeA.point,
            intersectionNodeB.point
        );

    edges.push({
        from: intersectionNodeA.id,
        to: intersectionNodeB.id,
        weight: intersectionWeight
    });

    edges.push({
        from: intersectionNodeB.id,
        to: intersectionNodeA.id,
        weight: intersectionWeight
    });
}
                        }
                    }
                );
            }
        }
    );

/* =========================================================
   SURVEYED ROAD ENDPOINT CONNECTIONS
   ---------------------------------------------------------
   Some real campus roads meet at junction areas where the
   supplied survey endpoints are slightly separated.

   Connect a road endpoint to another surveyed road when
   the endpoint is within the configured snap tolerance.

   This does NOT create arbitrary building-crossing routes.
   It only joins the surveyed road network near its endpoints.
   ========================================================= */

const roadEndpointCandidates = [];

Object.entries(
    campusRoads
).forEach(
    ([roadId, road]) => {

        if (
            !Array.isArray(road) ||
            road.length < 2
        ) {
            return;
        }

        roadEndpointCandidates.push({
            roadId,
            point: road[0],
            endIndex: 0
        });

        roadEndpointCandidates.push({
            roadId,
            point: road[
                road.length - 1
            ],
            endIndex:
                road.length - 1
        });
    }
);


/*
 * Connect endpoint → nearest point on another
 * surveyed road when sufficiently close.
 */
roadEndpointCandidates.forEach(
    endpoint => {

        let best = null;

        Object.entries(
            campusRoads
        ).forEach(
            ([roadId, road]) => {

                if (
                    roadId ===
                    endpoint.roadId
                ) {
                    return;
                }

                if (
                    !Array.isArray(road) ||
                    road.length < 2
                ) {
                    return;
                }

                for (
                    let i = 1;
                    i < road.length;
                    i++
                ) {

                    const projection =
                        projectPointOntoRoadSegment(
                            endpoint.point,
                            road[i - 1],
                            road[i]
                        );

                    if (
                        !projection
                    ) {
                        continue;
                    }

                    if (
                        !best ||
                        projection.distance <
                            best.distance
                    ) {

                        best = {
                            roadId,
                            segmentIndex:
                                i - 1,
                            fraction:
                                projection.fraction,
                            point:
                                projection.point,
                            distance:
                                projection.distance
                        };
                    }
                }
            }
        );


        if (
            !best ||
            best.distance >
                ROAD_ENDPOINT_SNAP_TOLERANCE_METERS
        ) {
            return;
        }


        /*
         * Find the existing node for the endpoint.
         */
        const endpointNode =
            nodes.find(
                node =>
                    Array.isArray(
                        node.roadRefs
                    ) &&
                    node.roadRefs.some(
                        ref =>
                            ref.roadId ===
                            endpoint.roadId
                    ) &&
                    distanceBetween(
                        node.point,
                        endpoint.point
                    ) <=
                        ROAD_NODE_MERGE_TOLERANCE_METERS
            );


        if (!endpointNode) {
            return;
        }


        /*
         * Create/reuse the node on the nearby road.
         */
        const targetNode =
            addNode(
                best.point,
                best.roadId,
                best.segmentIndex,
                best.fraction
            );


        if (
            !targetNode ||
            targetNode.id ===
                endpointNode.id
        ) {
            return;
        }


        const weight =
            distanceBetween(
                endpointNode.point,
                targetNode.point
            );


        /*
         * Bidirectional pedestrian connection.
         */
        edges.push({
            from:
                endpointNode.id,
            to:
                targetNode.id,
            weight
        });

        edges.push({
            from:
                targetNode.id,
            to:
                endpointNode.id,
            weight
        });

    }
);
    /*
     * Connect consecutive points along
     * each physical road.
     */

    Object.entries(
        campusRoads
    ).forEach(
        ([roadId, road]) => {

            const roadNodes =
                nodes
                    .filter(
                        node =>
                            node.roadRefs.some(
                                ref =>
                                    ref.roadId ===
                                    roadId
                            )
                    )
                    .map(
                        node => {

                            const ref =
                                node.roadRefs.find(
                                    item =>
                                        item.roadId ===
                                        roadId
                                );

                            return {
                                node,
                                fraction:
                                    ref.fraction
                            };
                        }
                    )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            a.fraction -
                            b.fraction
                    );


            for (
                let i = 1;
                i < roadNodes.length;
                i++
            ) {

                const from =
                    roadNodes[i - 1].node;

                const to =
                    roadNodes[i].node;

                if (
                    from.id ===
                    to.id
                ) {
                    continue;
                }

                const weight =
                    distanceBetween(
                        from.point,
                        to.point
                    );

                /*
 * Every physical campus road is traversable
 * in both directions.
 *
 * This is essential for pedestrian navigation:
 * the direction in which the surveyed coordinates
 * were entered must NOT restrict routing.
 */

edges.push({
    from: from.id,
    to: to.id,
    weight
});

edges.push({
    from: to.id,
    to: from.id,
    weight
});
            }
        }
    );


    return {
        nodes,
        edges
    };
}


let campusRoadGraph =
    buildCampusRoadGraph();
/* =========================================================
   SRKR GO — ROUTE CONNECTIVITY TEST
   ---------------------------------------------------------
   Developer helper.
   Tests whether two arbitrary campus positions can actually
   reach each other through the surveyed road network.
========================================================= */

function testSRKRRoute(
    startPosition,
    destinationPosition
) {

    console.group(
        "🧭 SRKR Go — Manual Route Test"
    );

    console.log(
        "START:",
        startPosition
    );

    console.log(
        "DESTINATION:",
        destinationPosition
    );

    const route =
        findShortestRoadPath(
            startPosition,
            destinationPosition
        );

    if (!route) {

        console.error(
            "❌ NO ROUTE FOUND"
        );

        console.groupEnd();

        return null;
    }

    console.log(
        "✅ ROUTE FOUND"
    );

    console.log(
        "Distance:",
        route.distance,
        "meters"
    );

    console.log(
        "Path nodes:",
        route.path.length
    );

    console.log(
        "Start road:",
        route.startRoad
    );

    console.log(
        "Destination road:",
        route.destinationRoad
    );

    console.log(
        "Path:",
        route.path
    );

    console.groupEnd();

    return route;
}

/* =========================================================
   REFRESH ROAD GRAPH
========================================================= */

function refreshCampusRoadGraph() {

    campusRoadGraph =
        buildCampusRoadGraph();

    return campusRoadGraph;
}
/* =========================================================
   SRKR GO — ROUTE DIAGNOSTICS
   ---------------------------------------------------------
   Developer-only inspection of the surveyed road network.

   IMPORTANT:
   - Does NOT modify the road graph.
   - Does NOT add artificial roads.
   - Does NOT affect normal navigation.
========================================================= */

function getRoadGraphDiagnostics() {

    const graph =
        campusRoadGraph;

    if (
        !graph ||
        !Array.isArray(graph.nodes) ||
        !Array.isArray(graph.edges)
    ) {
        return {
            valid: false,
            message: "Road graph is unavailable."
        };
    }


    const adjacency =
        new Map();


    graph.nodes.forEach(node => {

        adjacency.set(
            node.id,
            []
        );

    });


    graph.edges.forEach(edge => {

        if (
            adjacency.has(edge.from) &&
            adjacency.has(edge.to)
        ) {

            adjacency
                .get(edge.from)
                .push(edge.to);

            adjacency
                .get(edge.to)
                .push(edge.from);

        }

    });


    /* -----------------------------------------------------
       FIND CONNECTED COMPONENTS
    ----------------------------------------------------- */

    const visited =
        new Set();

    const components = [];


    graph.nodes.forEach(node => {

        if (
            visited.has(node.id)
        ) {
            return;
        }


        const component = [];

        const queue = [
            node.id
        ];

        visited.add(
            node.id
        );


        while (
            queue.length
        ) {

            const current =
                queue.shift();

            component.push(
                current
            );


            const neighbours =
                adjacency.get(
                    current
                ) || [];


            neighbours.forEach(
                neighbour => {

                    if (
                        visited.has(
                            neighbour
                        )
                    ) {
                        return;
                    }

                    visited.add(
                        neighbour
                    );

                    queue.push(
                        neighbour
                    );

                }
            );

        }


        components.push(
            component
        );

    });


    /* -----------------------------------------------------
       FIND ISOLATED NODES
    ----------------------------------------------------- */

    const isolatedNodes =
        graph.nodes.filter(
            node =>
                (
                    adjacency.get(
                        node.id
                    ) || []
                ).length === 0
        );


    /* -----------------------------------------------------
       ROAD CONNECTIVITY
    ----------------------------------------------------- */

    const roadDiagnostics = {};


    Object.keys(
        campusRoads
    ).forEach(
        roadId => {

            const roadNodes =
                graph.nodes.filter(
                    node =>
                        node.roadRefs &&
                        node.roadRefs.some(
                            ref =>
                                ref.roadId ===
                                roadId
                        )
                );


            roadDiagnostics[roadId] = {

                nodeCount:
                    roadNodes.length,

                connectedNodeCount:
                    roadNodes.filter(
                        node =>
                            (
                                adjacency.get(
                                    node.id
                                ) || []
                            ).length > 0
                    ).length

            };

        }
    );


    /* -----------------------------------------------------
       ACCESS-POINT CONNECTIVITY
    ----------------------------------------------------- */

    const accessPointDiagnostics = {};


    Object.entries(
        hiddenAccessPoints
    ).forEach(
        ([destinationId, points]) => {

            accessPointDiagnostics[
                destinationId
            ] = points.map(
                point => {

                    const nearest =
                        findNearestRoad(
                            point
                        );

                    return {

                        point,

                        connected:
                            Boolean(
                                nearest
                            ),

                        nearestRoad:
                            nearest
                                ? nearest.roadId
                                : null,

                        distanceToRoad:
                            nearest &&
                            Number.isFinite(
                                nearest.distance
                            )
                                ? nearest.distance
                                : null

                    };

                }
            );

        }
    );


    return {

        valid: true,

        roadCount:
            Object.keys(
                campusRoads
            ).length,

        nodeCount:
            graph.nodes.length,

        edgeCount:
            graph.edges.length,

        componentCount:
            components.length,

        largestComponent:
            components.length
                ? Math.max(
                    ...components.map(
                        component =>
                            component.length
                    )
                )
                : 0,

        isolatedNodeCount:
            isolatedNodes.length,

        isolatedNodes,

        roadDiagnostics,

        accessPointDiagnostics

    };

}
/* =========================================================
   RUN ROUTE DIAGNOSTICS
========================================================= */

function runSRKRRouteDiagnostics() {

    const report =
        getRoadGraphDiagnostics();


    console.group(
        "🧭 SRKR Go — Route Diagnostics"
    );


    if (!report.valid) {

        console.error(
            report.message
        );

        console.groupEnd();

        return report;

    }


    console.log(
        "🏫 Roads:",
        report.roadCount
    );

    console.log(
        "🔵 Graph nodes:",
        report.nodeCount
    );

    console.log(
        "🔗 Graph edges:",
        report.edgeCount
    );

    console.log(
        "🧩 Connected components:",
        report.componentCount
    );

    console.log(
        "📍 Isolated nodes:",
        report.isolatedNodeCount
    );


    console.group(
        "🛣️ Road Diagnostics"
    );

    Object.entries(
        report.roadDiagnostics
    ).forEach(
        ([roadId, data]) => {

            console.log(
                `${data.nodeCount} nodes · ${data.connectedNodeCount} connected`,
                roadId
            );

        }
    );

    console.groupEnd();


    console.group(
        "📍 Access Point Diagnostics"
    );


    Object.entries(
        report.accessPointDiagnostics
    ).forEach(
        ([destinationId, points]) => {

            points.forEach(
                point => {

                    console.log(
                        destinationId,
                        {
                            connected:
                                point.connected,

                            nearestRoad:
                                point.nearestRoad,

                            distanceToRoad:
                                point.distanceToRoad
                        }
                    );

                }
            );

        }
    );


    console.groupEnd();


    console.groupEnd();


    return report;

}
/* =========================================================
   SRKR GO — ROUTE REACHABILITY DIAGNOSTICS
   Developer-only diagnostic layer
   Does NOT modify the real routing graph
========================================================= */

function getUndirectedGraphComponents(graph) {
    if (
        !graph ||
        !Array.isArray(graph.nodes) ||
        !Array.isArray(graph.edges)
    ) {
        return [];
    }

    const adjacency = new Map();

    graph.nodes.forEach(function (node) {
        adjacency.set(node.id, []);
    });

    graph.edges.forEach(function (edge) {
        if (
            adjacency.has(edge.from) &&
            adjacency.has(edge.to)
        ) {
            adjacency.get(edge.from).push(edge.to);
            adjacency.get(edge.to).push(edge.from);
        }
    });

    const visited = new Set();
    const components = [];

    graph.nodes.forEach(function (node) {
        if (visited.has(node.id)) {
            return;
        }

        const component = new Set();
        const queue = [node.id];

        visited.add(node.id);

        while (queue.length > 0) {
            const currentId = queue.shift();

            component.add(currentId);

            const neighbours =
                adjacency.get(currentId) || [];

            neighbours.forEach(function (neighbourId) {
                if (visited.has(neighbourId)) {
                    return;
                }

                visited.add(neighbourId);
                queue.push(neighbourId);
            });
        }

        components.push(component);
    });

    return components;
}


function diagnoseAccessPointReachability(
    destinationId,
    accessPoint
) {
    if (
        !campusRoadGraph ||
        !Array.isArray(campusRoadGraph.nodes) ||
        !Array.isArray(campusRoadGraph.edges)
    ) {
        return {
            destinationId,
            accessPoint,
            reachable: false,
            reason: "Campus road graph unavailable."
        };
    }

    /*
       Clone the graph so diagnostics NEVER modify
       the real campusRoadGraph.
    */
    const diagnosticGraph = {
        nodes: campusRoadGraph.nodes.map(function (node) {
            return {
                ...node,
                point: Array.isArray(node.point)
                    ? [...node.point]
                    : node.point,
                roadRefs: Array.isArray(node.roadRefs)
                    ? node.roadRefs.map(function (ref) {
                        return { ...ref };
                    })
                    : []
            };
        }),

        edges: campusRoadGraph.edges.map(function (edge) {
            return {
                ...edge
            };
        })
    };

    const components =
        getUndirectedGraphComponents(
            diagnosticGraph
        );

    if (components.length === 0) {
        return {
            destinationId,
            accessPoint,
            reachable: false,
            reason: "Road graph contains no connected components."
        };
    }

    /*
       The largest connected component is treated as
       the main campus road network.
    */
    const largestComponent =
        components.reduce(function (largest, current) {
            return current.size > largest.size
                ? current
                : largest;
        });

    let connectionResult = null;

    try {
        connectionResult =
            connectPointToRoadGraph(
                accessPoint,
                diagnosticGraph,
                `DIAGNOSTIC_${destinationId}`
            );
    } catch (error) {
        return {
            destinationId,
            accessPoint,
            reachable: false,
            reason: "Point-to-road connection failed.",
            error: error.message
        };
    }

    if (!connectionResult) {
        return {
            destinationId,
            accessPoint,
            reachable: false,
            reason: "No surveyed campus road could be connected."
        };
    }

    const temporaryNodeId =
        connectionResult.id;

    const adjacency = new Map();

    diagnosticGraph.nodes.forEach(function (node) {
        adjacency.set(node.id, []);
    });

    diagnosticGraph.edges.forEach(function (edge) {
        if (
            adjacency.has(edge.from) &&
            adjacency.has(edge.to)
        ) {
            adjacency.get(edge.from).push(edge.to);
            adjacency.get(edge.to).push(edge.from);
        }
    });

    /*
       BFS from the access point.

       If the temporary access node can reach
       the largest campus-road component, the
       destination access point is route-reachable.
    */
    const queue = [temporaryNodeId];
    const visited = new Set([temporaryNodeId]);

    while (queue.length > 0) {
        const currentId = queue.shift();

        if (largestComponent.has(currentId)) {
            return {
                destinationId,
                accessPoint,
                reachable: true,
                reason: "Access point reaches the main campus road network.",
                nearestRoad:
                    connectionResult.nearestRoad
                        ? connectionResult.nearestRoad.roadId
                        : null,
                distanceToRoad:
                    connectionResult.nearestRoad &&
                    Number.isFinite(
                        connectionResult.nearestRoad.distance
                    )
                        ? connectionResult.nearestRoad.distance
                        : null,
                componentCount:
                    components.length
            };
        }

        const neighbours =
            adjacency.get(currentId) || [];

        neighbours.forEach(function (neighbourId) {
            if (visited.has(neighbourId)) {
                return;
            }

            visited.add(neighbourId);
            queue.push(neighbourId);
        });
    }

    return {
        destinationId,
        accessPoint,
        reachable: false,
        reason: "Access point is connected only to a disconnected road component.",
        nearestRoad:
            connectionResult.nearestRoad
                ? connectionResult.nearestRoad.roadId
                : null,
        distanceToRoad:
            connectionResult.nearestRoad &&
            Number.isFinite(
                connectionResult.nearestRoad.distance
            )
                ? connectionResult.nearestRoad.distance
                : null,
        componentCount:
            components.length
    };
}


function runSRKRRouteReachabilityDiagnostics() {

    console.group(
        "🧭 SRKR Go — Route Reachability Diagnostics"
    );

    if (
        !campusRoadGraph ||
        !Array.isArray(campusRoadGraph.nodes) ||
        !Array.isArray(campusRoadGraph.edges)
    ) {
        console.error(
            "❌ Campus road graph is unavailable."
        );

        console.groupEnd();

        return {
            valid: false,
            message: "Campus road graph unavailable."
        };
    }

    const components =
        getUndirectedGraphComponents(
            campusRoadGraph
        );

    const largestComponent =
        components.length > 0
            ? components.reduce(
                function (largest, current) {
                    return current.size > largest.size
                        ? current
                        : largest;
                }
            )
            : new Set();

    console.log(
        "🛣️ Road count:",
        Object.keys(campusRoads).length
    );

    console.log(
        "🔵 Graph nodes:",
        campusRoadGraph.nodes.length
    );

    console.log(
        "🔗 Graph edges:",
        campusRoadGraph.edges.length
    );

    console.log(
        "🧩 Connected components:",
        components.length
    );

    console.log(
        "🏫 Main network nodes:",
        largestComponent.size
    );

    const results = {};

    Object.entries(hiddenAccessPoints).forEach(
        function ([destinationId, points]) {

            results[destinationId] =
                points.map(function (point) {

                    return diagnoseAccessPointReachability(
                        destinationId,
                        point
                    );

                });

        }
    );

    console.group(
        "📍 Access Point Reachability"
    );

    Object.entries(results).forEach(
        function ([destinationId, points]) {

            points.forEach(function (result) {

                const status =
                    result.reachable
                        ? "✅ REACHABLE"
                        : "❌ NOT REACHABLE";

                console.log(
                    `${status} · ${destinationId}`,
                    {
                        accessPoint:
                            result.accessPoint,

                        nearestRoad:
                            result.nearestRoad,

                        distanceToRoad:
                            result.distanceToRoad,

                        reason:
                            result.reason
                    }
                );

            });

        }
    );

    console.groupEnd();

    const unreachableDestinations =
        Object.entries(results)
            .filter(function ([, points]) {
                return points.some(function (point) {
                    return !point.reachable;
                });
            })
            .map(function ([destinationId]) {
                return destinationId;
            });

    if (unreachableDestinations.length === 0) {

        console.log(
            "🎯 ALL ACCESS POINTS CAN REACH THE MAIN ROAD NETWORK."
        );

    } else {

        console.warn(
            "⚠️ Unreachable destinations:",
            unreachableDestinations
        );

    }

    console.groupEnd();

    return {
        valid: true,
        componentCount: components.length,
        mainNetworkNodeCount:
            largestComponent.size,
        results,
        unreachableDestinations
    };
}

/* =========================================================
   CONNECT A TEMPORARY POINT TO THE
   REAL ROAD GRAPH
========================================================= */

/* =========================================================
   CONNECT A TEMPORARY POINT TO THE
   EXACT SURVEYED ROAD SEGMENT
   ---------------------------------------------------------
   The point is projected onto the nearest surveyed road.
   It is then connected only to the road nodes that
   bracket that exact projection.
   
   This prevents artificial diagonal "spurs" across
   campus areas/buildings.
========================================================= */

function connectPointToRoadGraph(
    point,
    graph,
    label
) {
    if (
        !Array.isArray(point) ||
        point.length !== 2
    ) {
        return null;
    }

    const nearest = findNearestRoad(point);

    if (!nearest) {
        return null;
    }

    const temporaryId =
        `${label}_ROAD_POINT`;

    const nodes =
        graph.nodes.map(node => ({
            ...node,
            point: [
                node.point[0],
                node.point[1]
            ],
            roadRefs:
                Array.isArray(node.roadRefs)
                    ? [...node.roadRefs]
                    : []
        }));

    const edges =
        graph.edges.map(edge => ({
            ...edge
        }));


    /*
     * Add the projected point as a temporary
     * routing node.
     */
    const temporaryNode = {
        id: temporaryId,

        point: [
            nearest.point[0],
            nearest.point[1]
        ],

        roadRefs: [
            {
                roadId: nearest.roadId,

                segmentIndex:
                    nearest.segmentIndex,

                fraction:
                    nearest.fraction
            }
        ]
    };

    nodes.push(temporaryNode);


    /*
     * Find nodes belonging to the exact same
     * surveyed road.
     */
    const sameRoadNodes =
        nodes
            .filter(node =>
                node.id !== temporaryId &&
                Array.isArray(node.roadRefs) &&
                node.roadRefs.some(
                    ref =>
                        ref.roadId ===
                        nearest.roadId
                )
            )
            .map(node => {

                const ref =
                    node.roadRefs.find(
                        item =>
                            item.roadId ===
                            nearest.roadId
                    );

                return {
                    node,
                    fraction:
                        Number.isFinite(
                            ref?.fraction
                        )
                            ? ref.fraction
                            : 0
                };
            })
            .sort(
                (a, b) =>
                    a.fraction -
                    b.fraction
            );


    /*
     * Find the two road nodes that bracket
     * the exact projected position.
     */
    let previousNode = null;
    let nextNode = null;

    for (
        let i = 0;
        i < sameRoadNodes.length;
        i++
    ) {
        const candidate =
            sameRoadNodes[i];

        if (
            candidate.fraction <=
            nearest.fraction
        ) {
            previousNode =
                candidate;
        }

        if (
            candidate.fraction >=
            nearest.fraction
        ) {
            nextNode =
                candidate;

            break;
        }
    }


    /*
     * If the projection lands exactly on an
     * existing graph node, connect directly to it.
     */
    if (
        previousNode &&
        nextNode &&
        previousNode.node.id ===
            nextNode.node.id
    ) {

        const weight =
            distanceBetween(
                temporaryNode.point,
                previousNode.node.point
            );

        edges.push({
            from:
                temporaryId,

            to:
                previousNode.node.id,

            weight
        });

        edges.push({
            from:
                previousNode.node.id,

            to:
                temporaryId,

            weight
        });

    } else {

        /*
         * Connect only to the two nodes that
         * actually surround the projection.
         */
        const bracketNodes =
            [];

        if (previousNode) {
            bracketNodes.push(
                previousNode.node
            );
        }

        if (
            nextNode &&
            (
                !previousNode ||
                nextNode.node.id !==
                    previousNode.node.id
            )
        ) {
            bracketNodes.push(
                nextNode.node
            );
        }


        bracketNodes.forEach(
            node => {

                const weight =
                    distanceBetween(
                        temporaryNode.point,
                        node.point
                    );

                edges.push({
                    from:
                        temporaryId,

                    to:
                        node.id,

                    weight
                });

                edges.push({
                    from:
                        node.id,

                    to:
                        temporaryId,

                    weight
                });
            }
        );
    }


    return {
        id:
            temporaryId,

        point:
            temporaryNode.point,

        nearestRoad:
            nearest,

        nodes,

        edges
    };
}


/* =========================================================
   REAL ROAD SHORTEST PATH
========================================================= */

function findShortestRoadPath(
    startPosition,
    destinationPosition
) {

    if (
        !startPosition ||
        !destinationPosition
    ) {
        return null;
    }

    const graph = {
        nodes:
            campusRoadGraph.nodes.map(
                node => ({
                    ...node,
                    point: [
                        node.point[0],
                        node.point[1]
                    ]
                })
            ),

        edges:
            campusRoadGraph.edges.map(
                edge => ({
                    ...edge
                })
            )
    };


    const start =
        connectPointToRoadGraph(
            startPosition,
            graph,
            "START"
        );

    if (
        !start
    ) {
        return null;
    }


    graph.nodes =
    start.nodes;

graph.edges =
    start.edges;


const destination =
    connectPointToRoadGraph(
        destinationPosition,
        graph,
        "DESTINATION"
    );

    if (
        !destination
    ) {
        return null;
    }

    graph.nodes =
        destination.nodes;

    graph.edges =
        destination.edges;


    const distances = {};
    const previous = {};
    const visited = new Set();


    graph.nodes.forEach(
        node => {

            distances[node.id] =
                Infinity;

            previous[node.id] =
                null;
        }
    );


    distances[start.id] =
        0;


    while (
        visited.size <
        graph.nodes.length
    ) {

        let currentId =
            null;

        let bestDistance =
            Infinity;


        graph.nodes.forEach(
            node => {

                if (
                    visited.has(
                        node.id
                    )
                ) {
                    return;
                }

                if (
                    distances[
                        node.id
                    ] <
                    bestDistance
                ) {

                    bestDistance =
                        distances[
                            node.id
                        ];

                    currentId =
                        node.id;
                }
            }
        );


        if (
            currentId === null
        ) {
            break;
        }


        if (
            currentId ===
            destination.id
        ) {
            break;
        }


        visited.add(
            currentId
        );


        graph.edges
            .filter(
                edge =>
                    edge.from ===
                    currentId
            )
            .forEach(
                edge => {

                    const candidate =
                        distances[
                            currentId
                        ] +
                        edge.weight;

                    if (
                        candidate <
                        distances[
                            edge.to
                        ]
                    ) {

                        distances[
                            edge.to
                        ] =
                            candidate;

                        previous[
                            edge.to
                        ] =
                            currentId;
                    }
                }
            );
    }


    if (
        !Number.isFinite(
            distances[
                destination.id
            ]
        )
    ) {
        return null;
    }


    const nodeMap =
        new Map(
            graph.nodes.map(
                node => [
                    node.id,
                    node
                ]
            )
        );


    const path = [];

    let currentId =
        destination.id;


    while (
        currentId !== null
    ) {

        const node =
            nodeMap.get(
                currentId
            );

        if (
            !node
        ) {
            break;
        }

        path.unshift(
            node.point
        );

        currentId =
            previous[
                currentId
            ];
    }


    return {
        path,

        distance:
            distances[
                destination.id
            ],

        startRoad:
            start.nearestRoad,

        destinationRoad:
            destination.nearestRoad
    };
}

/* =========================================================
   23b. TURN-BY-TURN NAVIGATION
   ---------------------------------------------------------
   Generates navigation instructions from the verified
   campus junction route.

   No new road coordinates are invented here.
========================================================= */

function calculateBearing(pointA, pointB) {

    const lat1 =
        pointA[0] * Math.PI / 180;

    const lat2 =
        pointB[0] * Math.PI / 180;

    const deltaLongitude =
        (pointB[1] - pointA[1]) *
        Math.PI / 180;

    const y =
        Math.sin(deltaLongitude) *
        Math.cos(lat2);

    const x =
        Math.cos(lat1) *
        Math.sin(lat2) -
        Math.sin(lat1) *
        Math.cos(lat2) *
        Math.cos(deltaLongitude);

    const bearing =
    Math.atan2(y, x) *
    180 / Math.PI;

return (
    bearing + 360
) % 360;
}

/* =========================================================
   STEP 17. MOVEMENT BEARING
   ---------------------------------------------------------
   Calculates the direction the user is actually moving
   based on two GPS positions.
========================================================= */

function getMovementBearing(
    previousPosition,
    currentPosition
) {

    if (
        !previousPosition ||
        !currentPosition
    ) {
        return null;
    }


    const movementDistance =
        distanceBetween(
            previousPosition,
            currentPosition
        );


    /*
     * Ignore tiny GPS movements because they can
     * create completely random bearing values.
     */
    if (
        !Number.isFinite(
            movementDistance
        ) ||
        movementDistance <
        NAV_HEADING_MIN_MOVEMENT
    ) {

        return null;
    }


    return calculateBearing(
        previousPosition,
        currentPosition
    );
}


/* =========================================================
   STEP 17. UPDATE NAVIGATION HEADING
   ---------------------------------------------------------
   Prefer the device's native GPS heading when available.
   Otherwise calculate heading from movement.
========================================================= */

function updateNavigationHeading(
    position,
    gpsHeading
) {

    if (
        !position
    ) {
        return;
    }


    /*
     * -----------------------------------------------------
     * OPTION 1: DEVICE GPS HEADING
     * -----------------------------------------------------
     *
     * Some phones provide heading through
     * position.coords.heading.
     */

    if (
        Number.isFinite(
            gpsHeading
        ) &&
        gpsHeading >= 0 &&
        gpsHeading <= 360 &&
        Number.isFinite(
            currentGpsAccuracy
        ) &&
        currentGpsAccuracy <=
        NAV_HEADING_MIN_ACCURACY
    ) {

        navigationHeading =
            gpsHeading;

        navigationHeadingSource =
            "gps";

        navigationLastHeadingPosition =
            [
                position[0],
                position[1]
            ];

        return;
    }


    /*
     * -----------------------------------------------------
     * OPTION 2: CALCULATE FROM MOVEMENT
     * -----------------------------------------------------
     */

    const movementBearing =
        getMovementBearing(
            navigationLastHeadingPosition,
            position
        );


    if (
        Number.isFinite(
            movementBearing
        )
    ) {

        navigationHeading =
            movementBearing;

        navigationHeadingSource =
            "movement";

        navigationLastHeadingPosition =
            [
                position[0],
                position[1]
            ];
    }
}
/* =========================================================
   STEP 17B. GOOGLE-MAPS STYLE MAP ROTATION
   ---------------------------------------------------------
   Rotates the Leaflet map visually so the user's current
   direction of travel points toward the top of the screen.

   IMPORTANT:
   - The actual Leaflet map remains geographically correct.
   - Campus coordinates are NOT modified.
   - Route coordinates are NOT modified.
   - Only the visual map pane is rotated.
========================================================= */

let navigationMapBearing = 0;
let navigationMapRotationWrapper = null;

const NAV_MAP_ROTATION_SMOOTHING = 0.18;
const NAV_MAP_ROTATION_MIN_CHANGE = 0.8;

/* =========================================================
   SRKR GO — NAVIGATION CAMERA FOLLOW
   ---------------------------------------------------------
   Controls whether the map automatically follows the
   user's live navigation position.

   This affects only the navigation camera.
   Routing coordinates and GPS coordinates remain unchanged.
========================================================= */

let navigationCameraFollowing = false;
let navigationCameraAnimating = false;

/*
 * =========================================================
 * SRKR GO — NAVIGATION CAMERA INTERACTION
 * =========================================================
 *
 * Google Maps-style behaviour:
 *
 * 1. Navigation starts
 * 2. Camera follows the user
 * 3. User manually moves the map
 * 4. Automatic follow pauses
 * 5. Re-center control appears
 * 6. User taps Re-center
 * 7. Camera locks back onto the user
 * ========================================================= */

let navigationCameraUserInteracted = false;
let navigationRecenterControl = null;

const NAV_CAMERA_RECENTER_DELAY = 150;

const NAV_CAMERA_FOLLOW_ZOOM = 19;
const NAV_CAMERA_ANIMATION_DURATION = 500;

function enableNavigationCameraFollow(
    animate = true
) {

    navigationCameraFollowing = true;

    if (
        currentUserPosition &&
        map
    ) {

        centerNavigationCamera(
            currentUserPosition,
            animate
        );

    }

}


function disableNavigationCameraFollow() {

    navigationCameraFollowing = false;

}
function createNavigationRecenterControl() {

    if (
        navigationRecenterControl ||
        !map
    ) {
        return;
    }

    navigationRecenterControl =
        document.createElement("button");

    navigationRecenterControl.type =
        "button";

    navigationRecenterControl.className =
        "srkr-navigation-recenter";

    navigationRecenterControl.innerHTML =
        "📍 <span>Re-center</span>";

    navigationRecenterControl.setAttribute(
        "aria-label",
        "Re-center map on my location"
    );

    navigationRecenterControl.title =
        "Re-center on my location";

    navigationRecenterControl.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (
                !currentUserPosition ||
                !map
            ) {
                return;
            }

            navigationCameraUserInteracted =
                false;

            navigationCameraFollowing =
                true;

            centerNavigationCamera(
                currentUserPosition,
                true
            );

            hideNavigationRecenterControl();
        }
    );

    map.getContainer().appendChild(
        navigationRecenterControl
    );

    hideNavigationRecenterControl();
}


function showNavigationRecenterControl() {

    if (!navigationRecenterControl) {
        createNavigationRecenterControl();
    }

    if (
        navigationRecenterControl
    ) {

        navigationRecenterControl.classList.add(
            "visible"
        );
    }
}


function hideNavigationRecenterControl() {

    if (
        navigationRecenterControl
    ) {

        navigationRecenterControl.classList.remove(
            "visible"
        );
    }
}


function centerNavigationCamera(
    position,
    animate = true
) {

    if (
        !map ||
        !Array.isArray(position) ||
        position.length < 2
    ) {
        return;
    }

    const latitude =
        Number(position[0]);

    const longitude =
        Number(position[1]);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        return;
    }

    const target =
        L.latLng(
            latitude,
            longitude
        );

    navigationCameraAnimating =
    animate;

if (animate) {

        map.flyTo(
            target,
            Math.max(
                map.getZoom(),
                NAV_CAMERA_FOLLOW_ZOOM
            ),
            {
                animate: true,
                duration:
                    NAV_CAMERA_ANIMATION_DURATION / 1000,
                easeLinearity: 0.25
            }
        );

    } else {

        map.setView(
            target,
            Math.max(
                map.getZoom(),
                NAV_CAMERA_FOLLOW_ZOOM
            ),
            {
                animate: false
            }
        );

    }

    if (animate) {

    window.setTimeout(
        () => {

            navigationCameraAnimating =
                false;

        },
        NAV_CAMERA_ANIMATION_DURATION + 50
    );

}

}


function updateNavigationCamera(
    position,
    animate = false
) {

    if (
        !navigationActive ||
        !navigationCameraFollowing ||
        !Array.isArray(position)
    ) {
        return;
    }

    if (
        navigationCameraAnimating
    ) {
        return;
    }

    centerNavigationCamera(
        position,
        animate
    );

}


/*
 * Normalize an angle into 0–359 degrees.
 */
function normalizeMapBearing(
    bearing
) {

    return (
        bearing + 360
    ) % 360;
}


/*
 * Find the shortest rotation between
 * two compass bearings.
 */
function getShortestBearingDifference(
    from,
    to
) {

    let difference =
        normalizeMapBearing(to) -
        normalizeMapBearing(from);

    if (difference > 180) {
        difference -= 360;
    }

    if (difference < -180) {
        difference += 360;
    }

    return difference;
}


/*
 * Smoothly move the map bearing toward
 * the user's actual heading.
 */
function smoothNavigationMapBearing(
    targetBearing
) {

    if (
        !Number.isFinite(
            targetBearing
        )
    ) {
        return;
    }


    targetBearing =
        normalizeMapBearing(
            targetBearing
        );


    const difference =
        getShortestBearingDifference(
            navigationMapBearing,
            targetBearing
        );


    if (
        Math.abs(difference) <
        NAV_MAP_ROTATION_MIN_CHANGE
    ) {
        return;
    }


    navigationMapBearing =
        normalizeMapBearing(
            navigationMapBearing +
            difference *
            NAV_MAP_ROTATION_SMOOTHING
        );


    applyNavigationMapRotation();
}
/*
 * Reset map rotation back to north-up.
 */
function resetNavigationMapRotation() {

    navigationMapBearing = 0;


    if (!map) {
        return;
    }


    const mapContainer =
        map.getContainer();


    const rotationWrapper =
        mapContainer.querySelector(
            ".srkr-map-rotation-wrapper"
        );


    if (rotationWrapper) {

        rotationWrapper.style.transform =
            "rotate(0deg)";
    }
}

/* =========================================================
   STEP 17. INSTRUCTION APPROACH STATE
========================================================= */

function getInstructionApproachState(
    instruction,
    currentPosition
) {

    if (
        !instruction ||
        !instruction.target ||
        !currentPosition
    ) {

        return {
            state: "unknown",
            difference: null,
            heading: navigationHeading
        };
    }


    const distance =
        getNavigationInstructionDistance(
            instruction
        );


    /*
     * Target has effectively been passed.
     */

    if (
        Number.isFinite(distance) &&
        distance <=
        NAV_PASSED_TARGET_DISTANCE
    ) {

        navigationPassedInstruction =
            true;

        return {
            state: "passed",
            difference: 0,
            heading: navigationHeading
        };
    }


    navigationPassedInstruction =
        false;


    /*
     * We cannot determine orientation without
     * a usable heading.
     */

    if (
        !Number.isFinite(
            navigationHeading
        )
    ) {

        return {
            state: "unknown",
            difference: null,
            heading: null
        };
    }


    const targetBearing =
        calculateBearing(
            currentPosition,
            instruction.target
        );


    const difference =
        Math.abs(
            normalizeBearingDifference(
                navigationHeading,
                targetBearing
            )
        );


    /*
     * User is generally moving toward the
     * instruction target.
     */

    if (
        difference <=
        NAV_APPROACH_HEADING_TOLERANCE
    ) {

        return {
            state: "approaching",
            difference: difference,
            heading: navigationHeading
        };
    }


    /*
     * User is moving substantially away from
     * the instruction target.
     */

    return {
        state: "away",
        difference: difference,
        heading: navigationHeading
    };
}


/* =========================================================
   STEP 17. ORIENTATION STATUS
========================================================= */

function getOrientationStatus(
    instruction
) {

    const approach =
        getInstructionApproachState(
            instruction,
            currentUserPosition
        );


    if (
        approach.state ===
        "passed"
    ) {

        return {
            icon: "📍",
            text:
                "Junction passed — updating guidance"
        };
    }


    if (
        approach.state ===
        "away"
    ) {

        return {
            icon: "🔄",
            text:
                "Reorient toward the route"
        };
    }


    if (
        approach.state ===
        "approaching"
    ) {

        return {
            icon: "🧭",
            text:
                "Following the route"
        };
    }


    return {
        icon: "📍",
        text:
            "Waiting for movement direction"
    };
}

function normalizeBearingDifference(
    bearingA,
    bearingB
) {

    let difference =
        bearingB - bearingA;

    while (difference > 180) {
        difference -= 360;
    }

    while (difference < -180) {
        difference += 360;
    }

    return difference;
}


function getTurnType(
    incomingBearing,
    outgoingBearing
) {

    const difference =
        normalizeBearingDifference(
            incomingBearing,
            outgoingBearing
        );

    const absoluteDifference =
        Math.abs(difference);


    if (
        absoluteDifference <=
        NAV_STRAIGHT_ANGLE
    ) {

        return {
            type: "straight",
            icon: "⬆️",
            text: "Continue straight"
        };
    }


    if (
        difference > 0 &&
        absoluteDifference <
        135
    ) {

        return {
            type: "right",
            icon: "↗️",
            text: "Turn right"
        };
    }


    if (
        difference < 0 &&
        absoluteDifference <
        135
    ) {

        return {
            type: "left",
            icon: "↖️",
            text: "Turn left"
        };
    }


    return {
        type: "turn",
        icon: "🔄",
        text: "Make the turn"
    };
}


function getJunctionIdFromPosition() {
    /*
     * Junction routing has been removed.
     *
     * Kept as a compatibility stub because older
     * navigation code may still reference this name.
     */
    return null;
}


function buildNavigationInstructions(
    routePath,
    destinationId
) {

    const instructions = [];


    if (
        !routePath ||
        routePath.length < 2
    ) {
        return instructions;
    }


    const destination =
        campusLocations[
            destinationId
        ];


    if (
        !destination
    ) {
        return instructions;
    }


    /*
     * First instruction:
     * head toward the real road.
     */

    const firstRoadPoint =
        routePath[1];


    instructions.push({
        type: "start",
        icon: "🧭",
        text: "Follow the campus road",
        target: firstRoadPoint,
        targetId: null,
        distance:
            distanceBetween(
                routePath[0],
                firstRoadPoint
            )
    });


    /*
     * Detect meaningful turns from the
     * actual road polyline.
     */

    let lastBearing =
        null;


    for (
        let i = 1;
        i <
        routePath.length - 1;
        i++
    ) {

        const previous =
            routePath[
                i - 1
            ];

        const current =
            routePath[
                i
            ];

        const next =
            routePath[
                i + 1
            ];


        const incomingBearing =
            calculateBearing(
                previous,
                current
            );


        const outgoingBearing =
            calculateBearing(
                current,
                next
            );


        /*
         * Ignore tiny bearing changes.
         * This prevents every road coordinate
         * from becoming a "turn".
         */

        let delta =
            Math.abs(
                outgoingBearing -
                incomingBearing
            );


        if (
            delta > 180
        ) {
            delta =
                360 -
                delta;
        }


        if (
            delta < 25
        ) {
            continue;
        }


        /*
         * Avoid duplicate instructions caused
         * by multiple closely spaced road points.
         */

        if (
            lastBearing !== null
        ) {

            let repeatedDelta =
                Math.abs(
                    outgoingBearing -
                    lastBearing
                );

            if (
                repeatedDelta > 180
            ) {
                repeatedDelta =
                    360 -
                    repeatedDelta;
            }

            if (
                repeatedDelta < 15
            ) {
                continue;
            }
        }


        const turn =
            getTurnType(
                incomingBearing,
                outgoingBearing
            );


        instructions.push({
            type:
                turn.type,

            icon:
                turn.icon,

            text:
                turn.text,

            target:
                current,

            targetId:
                null,

            distance:
                calculatePolylineDistance(
                    routePath.slice(
                        i,
                        routePath.length
                    )
                )
        });


        lastBearing =
            outgoingBearing;
    }


    /*
     * Final instruction.
     *
     * IMPORTANT:
     * The route itself ends at the road/access point,
     * not inside the building.
     */

    const finalTarget =
        routePath[
            routePath.length - 1
        ];


    instructions.push({
        type: "destination",
        icon: "🏁",
        text:
            `Arrive near ${destination.name}`,
        target:
            finalTarget,
        targetId:
            destinationId,
        distance: 0
    });


    return instructions;
}

/* =========================================================
   24. BLOCK FLOOR NAVIGATION SYSTEM
   ---------------------------------------------------------
   Reusable floor navigation for:
   • S Block
   • Civil Block
   • Administrative Block
   ---------------------------------------------------------
   Flow:

   Block
      ↓
   Floor selector
      ↓
   Room / facility directory
      ↓
   Back to floors
========================================================= */


/* ---------------------------------------------------------
   CURRENT FLOOR NAVIGATION STATE
--------------------------------------------------------- */

let activeBlockFloorView = null;


/* ---------------------------------------------------------
   FLOOR DATA NORMALIZER
--------------------------------------------------------- */
/* =========================================================
   N BLOCK FLOOR DATA
   ---------------------------------------------------------
   • Classrooms only
   • Stairs only
   • No elevator
   • Drinking water available
   • Back-side staircase access
========================================================= */

const nBlockData = {

    commonFacilities: [
        "🪜 Staircases available",
        "💧 Drinking water facility",
        "🚪 Back-side staircase access to classrooms",
        "🚫 No elevator"
    ],

    floors: {

        "Ground Floor": [
            { room: "101", detail: "Class Room" },
            { room: "102", detail: "Class Room" },
            { room: "103", detail: "Class Room" }
        ],

        "First Floor": [
            { room: "201", detail: "Class Room" },
            { room: "202", detail: "Class Room" },
            { room: "203", detail: "Class Room" }
        ],

        "Second Floor": [
            { room: "301", detail: "Class Room" },
            { room: "302", detail: "Class Room" },
            { room: "303", detail: "Class Room" }
        ]

    }
};
/* =========================================================
   MECHANICAL BLOCK FLOOR DATA
   ---------------------------------------------------------
   • Elevator on every floor
   • Cooling drinking water
   • Hand wash
   • First aid
   • Notice board
========================================================= */

const mechBlockData = {

    commonFacilities: [
        "🛗 Elevator available on every floor",
        "❄️ Cooling drinking water available on every floor",
        "🧼 Hand wash facility available on every floor",
        "🩹 First aid available",
        "📋 Notice board available",
        "🚻 Common toilet facilities"
    ],

    floors: {

        "Ground Floor": [

            { room: "M101", detail: "E-Class Room" },

            {
                room: "M109",
                detail: "Department of Mechanical Engineering Administrative Office"
            },

            { room: "M103", detail: "Class Room" },

            {
                room: "M108",
                detail: "Department Library"
            },

            {
                room: "M107",
                detail:
                    "Department of Multilayer Thin Film Sensors for Practical Monitoring of Weld Stress — Professor Dr. K. Bramha Raju"
            },

            {
                room: "M104",
                detail:
                    "Dr. K. Suresh Babu — Professor; V. Manikanth — Assistant Professor"
            },

            {
                room: "M106",
                detail: "Dr. K.V.M.K. Krishnam Raju — Professor"
            },

            {
                room: "M105",
                detail: "Dr. V. Durga Prasad — Professor"
            },

            {
                room: "—",
                detail: "Staff Toilet"
            },

            {
                room: "—",
                detail: "Staff Room"
            }

        ],

        "First Floor": [

            {
                room: "M206",
                detail: "CAD/CAM LAB"
            },

            {
                room: "M204",
                detail: "Programming & A.P.S.S.D.C LAB"
            },

            {
                room: "M207",
                detail: "N. Satish — Assistant Professor"
            },

            {
                room: "M210",
                detail: "Room"
            },

            {
                room: "M209",
                detail: "Room"
            },

            {
                room: "M208",
                detail:
                    "Sri N. Harsha — Assistant Professor; G.H. Tammi Raju — Assistant Professor"
            },

            {
                room: "M213",
                detail: "Ladies Waiting Hall"
            },

            {
                room: "—",
                detail: "Drinking Water"
            },

            {
                room: "—",
                detail: "First Aid Box"
            },

            {
                room: "M203",
                detail:
                    "Dr. S. Rajesh — Professor; I.P. Pavan Kumar Varma — Assistant Professor"
            },

            {
                room: "M202",
                detail:
                    "Dr. Ch. Rama Bhadri Raju — Associate Professor; Dr. G.S.V. Seshu Kumar — Assistant Professor; M. Indra Reddy — Assistant Professor"
            },

            {
                room: "M201",
                detail:
                    "S. Madhavi Rao — Assistant Professor; M. Anil Kumar — Assistant Professor; P. Ravi Varma — Assistant Professor"
            },

            {
                room: "—",
                detail: "Ladies Toilet"
            }

        ],

        "Second Floor": [

            {
                room: "M302",
                detail: "Seminar Hall"
            },

            {
                room: "M301",
                detail: "E-Class Room"
            },

            {
                room: "M304",
                detail: "E-Classroom"
            },

            {
                room: "—",
                detail: "Gents Toilet"
            }

        ],

        "Third Floor": [

            {
                room: "M405",
                detail: "PG Classroom"
            },

            {
                room: "M402",
                detail: "Classroom"
            },

            {
                room: "M401",
                detail: "Metrology Lab"
            },

            {
                room: "M406",
                detail: "Heat Transfer Lab"
            },

            {
                room: "M403",
                detail:
                    "Engineering Mechanics Lab; Industrial Engineering Lab"
            }

        ]

    }
};
/* =========================================================
   IT BLOCK FLOOR DATA
   ---------------------------------------------------------
   • Ground-floor entrance from Open Air Auditorium
   • Staff-only entrance
   • Room numbering uses V prefix
========================================================= */

const itBlockData = {

    commonFacilities: [
        "🚪 Ground-floor entrance directly from Open Air Auditorium",
        "🔒 Open-Air Auditorium entrance is staff only",
        "💧 Drinking water available",
        "🚻 Staff toilet facility",
        "🪜 Staircases"
    ],

    floors: {

        "Ground Floor": [

            {
                room: "V105",
                detail: "Programming Lab"
            },

            {
                room: "V102",
                detail: "Web Technologies Lab"
            },

            {
                room: "V101",
                detail: "Head of Information Technology"
            },

            {
                room: "—",
                detail: "Lounge for Visitors"
            },

            {
                room: "V107",
                detail: "Room"
            }

        ],

        "First Floor": [

            {
                room: "V203",
                detail: "Internet Lab & Library"
            },

            {
                room: "V202",
                detail: "Staff Room-II"
            },

            {
                room: "—",
                detail: "Hobby Club & CSI Student Chapter (AP69)"
            },

            {
                room: "V201",
                detail: "Research and Development Lab"
            },

            {
                room: "V208",
                detail:
                    "N. Rama Devi — Assistant Professor; B. Teja Sree — Assistant Professor; K. Sridevi — Assistant Professor"
            },

            {
                room: "V209",
                detail: "Dr. I. Hema Latha — Professor"
            },

            {
                room: "V206",
                detail: "Seminar Hall"
            },

            {
                room: "V204",
                detail:
                    "Dr. B.D.S. Shekar — Professor; K. Srinivas — Associate Professor; Dr. S. Venkata Ramana — Professor"
            },

            {
                room: "—",
                detail: "Drinking Water"
            },

            {
                room: "—",
                detail: "Staff Toilet"
            }

        ],

        "Second Floor": [

            {
                room: "V302",
                detail: "IT-1 Classroom"
            },

            {
                room: "V306",
                detail: "Advanced Programming"
            },

            {
                room: "V301",
                detail: "IT-2 Classroom"
            },

            {
                room: "V303",
                detail: "Staff Room-III"
            },

            {
                room: "V307",
                detail: "Microprocessor / IOT Lab"
            },

            {
                room: "V309",
                detail: "Classroom"
            },

            {
                room: "V308",
                detail:
                    "A.V. Somasundar; M. Lakshmi Narayana; M. Chilaka Rao"
            },

            {
                room: "V301",
                detail:
                    "Hardware Lab-II — Dr. D. Ratna Giri, Assistant Professor"
            }

        ],

        "Third Floor": [

            {
                room: "—",
                detail: "Ladies Toilet"
            },

            {
                room: "V403",
                detail: "M.Tech Classroom"
            },

            {
                room: "V402",
                detail: "Classroom"
            },

            {
                room: "V401",
                detail: "Classroom"
            },

            {
                room: "V406",
                detail: "Project Room"
            },

            {
                room: "V407",
                detail:
                    "Knowledge Engineering Lab; Network Programming Research Lab"
            },

            {
                room: "V409",
                detail:
                    "V.Ch. Jwala; K.S.L.S. Sruthi"
            },

            {
                room: "V408",
                detail:
                    "Bh.D.D. Priyanka; B. Manojna; K. Pavani Krishna"
            }

        ]

    }
};
/* =========================================================
   TECHNOLOGICAL CENTRE FLOOR DATA
   ---------------------------------------------------------
   CSD + CSIT
   Ground → First → Second → Third → Fourth
========================================================= */

const technologicalCentreData = {

    commonFacilities: [
        "🪜 Staircase access",
        "🏢 CSD & CSIT facilities",
        "💻 Technology and innovation facilities"
    ],

    floors: {

        "Ground Floor": [

            {
                room: "—",
                detail: "AICTE IDEAL LAB"
            },

            {
                room: "—",
                detail: "Registration Desk"
            },

            {
                room: "—",
                detail: "Project Discussion Room"
            },

            {
                room: "—",
                detail: "Makers Space Demonstration Room"
            },

            {
                room: "—",
                detail: "Design Center Room"
            },

            {
                room: "—",
                detail: "Server Room"
            },

            {
                room: "—",
                detail: "3D Tool Room"
            },

            {
                room: "—",
                detail: "AI Computing Lab — NVIDIA RTX 5090 GPU Facility"
            },

            {
                room: "—",
                detail: "PCB Machine"
            },

            {
                room: "—",
                detail: "Smart Class & Training Discussion"
            },

            {
                room: "—",
                detail: "Cafe for Coffee and Tea"
            },

            {
                room: "—",
                detail: "AICTE IDEAL LAB Coordinator"
            },

            {
                room: "—",
                detail: "Power Room"
            }

        ],

        "First Floor": [

            {
                room: "—",
                detail: "Alumni House"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — Smart Tech Solutions"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — Real Time Solutions"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — Challenging Techno Solutions"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — Global Care Solutions"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — MSR Technologies"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — Framey Technologies"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — Intelligent Technologies"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — Virtual Technologies"
            },

            {
                room: "—",
                detail:
                    "Students Start-up Room — Green Technology Solutions"
            },

            {
                room: "—",
                detail:
                    "SBI Bank (Chinna Amiram Branch)"
            }

        ],

        "Second Floor": [

            {
                room: "—",
                detail: "Technology Centre"
            },

            {
                room: "—",
                detail: "Innovation Centre"
            }

        ],

        "Third Floor": [

            {
                room: "—",
                detail: "I-HUB Digital Learning Centre"
            },

            {
                room: "—",
                detail:
                    "Third Floor and Fourth Floor are connected through I-HUB Digital Learning Centre with staircase"
            }

        ],

        "Fourth Floor": [

            {
                room: "—",
                detail:
                    "Connected to Third Floor through I-HUB Digital Learning Centre staircase"
            }

        ]

    }
};
const administrativeBlockData = {

    entrances: [
        "🚗 Front Entrance → Boys & Girls Parking",
        "🎭 Back Entrance → Open-Air Auditorium"
    ],

    groundFloor: [
        {
            room: "101",
            detail: "Management Room"
        },
        {
            room: "102",
            detail: "Board Room"
        },
        {
            room: "103",
            detail: "Vice President — Sri. S. Vittal Ranga Raju"
        },
        {
            room: "106",
            detail: "Principal Chamber — Dr. K. V. Murali Krishnam Raju"
        },
        {
            room: "112",
            detail: "Lounge"
        },
        {
            room: "—",
            detail: "Management Chamber"
        },
        {
            room: "—",
            detail: "Director Room — Dr. M. Jagapathi Raju"
        }
    ],

    firstFloor: [
        "General Administration",
        "Examination Centre"
    ],

    secondFloor: [
        "Management Office",
        "Internal Quality Assurance Cell",
        "Accounts",
        "Scholarship",
        "Rest Rooms"
    ]
};
const eceBlockData = {

    commonFacilities: [
        "🚻 Washrooms available on every floor",
        "💧 Drinking water available on every floor",
        "🧼 Hand-washing water available on every floor",
        "🪜 Steps / Stairs",
        "🛗 Elevator",
        "🔥 Fire safety facilities"
    ],

    floors: {

        "Ground Floor": [
            { room: "T102", detail: "Class Room" },
            { room: "T103", detail: "G.V.S. Padma Rao — Professor" },
            { room: "T104", detail: "Dr. B. Sanjay — Associate Professor; Sri B. Bhaya Prasad — Assistant Professor" },
            { room: "T105", detail: "Dr. G. Naga Raju — Associate Professor; Dr. K.N.V. Satyanarayan — Assistant Professor" },
            { room: "T107", detail: "Office Room" },
            { room: "T108", detail: "Communications Lab" },
            { room: "T109", detail: "Center of Excellence in Embedded Systems and IoT; Skill Development Center" },
            { room: "T110", detail: "Innovation Centre" },
            { room: "—", detail: "Dr. P. Krishna Kanth Varma — Associate Professor" },
            { room: "—", detail: "Dr. S.S. Mohan Reddy — Professor and Head of the Department" }
        ],

        "First Floor": [
            { room: "T201", detail: "Mrs. G. Prathima — Assistant Professor; Mrs. D.V.N. Bharathi — Assistant Professor" },
            { room: "T202", detail: "Dr. Y. Rama Lakshmana — Associate Professor" },
            { room: "T203", detail: "Center of Excellence in Embedded Systems; Digital ICs Lab; Microprocessors Lab" },
            { room: "T204", detail: "Dr. N. Udaya Kumar — Professor" },
            { room: "T205", detail: "Mrs. B. Revathi — Assistant Professor; Dr. T.V. Hyma Lakshmi — Associate Professor" },
            { room: "T206", detail: "Staff Room — Mrs. K. Lakshmi Devi — Assistant Professor; Dr. V. Nagavalli — Associate Professor" },
            { room: "T207", detail: "Class Room" },
            { room: "T208", detail: "Electronic Lab-1" },
            { room: "T209", detail: "AEC Lab" },
            { room: "T210", detail: "Class Room" }
        ],

        "Second Floor": [
            { room: "T301", detail: "Staff Room" },
            { room: "T302", detail: "Normal Class Room" },
            { room: "T303", detail: "Staff Room — Mrs. P.S.S.N. Mownika — Assistant Professor; Dr. S. Swathi — Assistant Professor" },
            { room: "T304", detail: "Digital Signal Processing Lab" },
            { room: "T305A", detail: "Seminar Hall" },
            { room: "T305B", detail: "Normal Room" },
            { room: "T306", detail: "Class Room" }
        ],

        "Third Floor": [
            { room: "T402", detail: "E-Classroom 1" },
            { room: "T403", detail: "Staff Room" },
            { room: "T404", detail: "ELA Lab — Experimental Learning Activities" },
            { room: "T405", detail: "Electronic Lab-3" },
            { room: "T406", detail: "VLSI & IoT Lab" },
            { room: "T407", detail: "E-Classroom 2" },
            { room: "T420", detail: "Staff Room" }
        ]
    }
};
/* =========================================================
   EEE BLOCK FLOOR DATA
   ---------------------------------------------------------
   EEE Block
      ↓
   Floor Directory
      ↓
   Ground / First / Second / Third / Top Floor
      ↓
   Room & Facility Details
========================================================= */

const eeeBlockData = {
    commonFacilities: [
        "🚻 Washrooms available on every floor",
        "💧 Drinking water available on every floor",
        "🧼 Hand-washing water available on every floor",
        "🪜 Steps / Stairs",
        "🛗 Elevator",
        "🔥 Fire safety facilities",
        "⚙️ All standard common facilities available like other blocks"
    ],

    floors: {
        "Ground Floor": [
            { room: "—", detail: "Power system laboratory" },
            { room: "D101", detail: "EEE Dept Office" },
            { room: "D102", detail: "Dr.B.R.K.Varma — Professor & Head" },
            { room: "D102(A)", detail: "Dept of Infocom Centre" },
            { room: "D103", detail: "Electrical machine laboratory" }
        ],

        "First Floor": [
            { room: "D207", detail: "POWER SYSTEM SIMULATION LABORATORY" },
            { room: "D208", detail: "ELECTRICAL SYSTEM SIMULATION LABORATORY & SMART SYSTEMS LABORATORY" },
            { room: "D209", detail: "NETWORKS LABORATORY & ELECTRICAL MEASUREMENT AND INSTRUMENTATION LABORATORY & TINKERING LABORATORY" }
        ],

        "Second Floor": [
            { room: "D301", detail: "LADIES WAITING HALL" },
            { room: "D302", detail: "DR.G.KUSUMA ASSISTANT PROFESSOR, SMT.KATARI DEEPTHJI ASSISTAMT PROFESSOR & SMT.P.UDAYA BHANU ASISTANT PROFESSOR" },
            { room: "D303", detail: "ASSISTANT PROFESSOR SMT.K.SWETHA, ASSISTANT PROFESSOR SMT.I.SWETHA MONICA, SMT.N.V.A.BHAVANI & ASSISTANT PROFESSOR SMT J.S.S.L.BHARANI" },
            { room: "D305", detail: "ASSISTANT PROFESSOR SRI.S.RAJASHEKAR REDDY, SRI.E.SURESH & SRI D.A.KOTESWARA RAO" },
            { room: "D306", detail: "ASSIATNT PROFESSOR SRI.B.S.S.SANTHOSH & SRI.M.E.C.VIDYASAGAR" },
            { room: "D308", detail: "MPMC LAB & POWER ELECTRONICS LABORATORY" },
            { room: "D308", detail: "MICROPROCESSORS AND MICROCONTROLLERS LABORATORY & POWER ELECTRONICS LAB" },
            { room: "D309", detail: "ELECTRONICS ENGINEERING WORKSHOP" },
            { room: "D310", detail: "POWER ELECTRONICS FOR RENEWABLE INTEGRATION LABORATORY & SOLAR ENERGY SYSTEMS LABORATORY" },
            { room: "D311", detail: "ASSISTANT PROFESSOR DR.G.SYAMNARESH & SRI.A.H.KUMAR RAJU ASSISTANT PROFESSOR" },
            { room: "D311", detail: "SADHAN PROJECT LABORATORY" },
            { room: "D312", detail: "RENEWABLE ENERGY RESEARCH LAB — ASSISTANT PROFESSOR DR.G.H.K.VARMA & SRI.V.SRINIVAS" }
        ],

        "Third Floor": [
            { room: "D401", detail: "CLASS ROOM" },
            { room: "D402", detail: "DEPARTMENT LIBRARY — SRI.P.SAILESH BABU & SRI.P.S.P.R.SWAMY" },
            { room: "D405", detail: "CLASS ROOM" },
            { room: "D406", detail: "ELECTRIC MOBILITY LAB — ASSISTANT PROFESSOR SRI.K.PAVAN KUMAR" },
            { room: "D407", detail: "DIGITAL DESIGN LABORATORY, ELECTRIC VEHICLES LABORATORY AND ROBOTICS & CONTROL SYSTEM LABORATORY" },
            { room: "D408", detail: "CLASS ROOM" },
            { room: "D409", detail: "CLASS ROOM" },
            { room: "D410", detail: "CLASS ROOM" },
            { room: "D411", detail: "CLASS ROOM" }
        ],

        "Top Floor": [
            { room: "—", detail: "LADIES TOILET" },
            { room: "—", detail: "GENTS TOILET" },
            { room: "—", detail: "DIGITAL LEARNING CENTRE" }
        ]
    }
};
/* =========================================================
   CSE BLOCK INFORMATION
   ---------------------------------------------------------
   CAB and C rooms are separate room-numbering systems.
   Unnamed rooms are treated as classrooms / general rooms
   as specified for SRKR Go.
========================================================= */

const cseBlockData = {

    commonFacilities: [
        "🚻 Washrooms available on specified floors",
        "💧 Drinking water facility available",
        "🪜 Staircase access"
    ],

    floors: {

        "Ground Floor": [

            { room: "Reception", detail: "Reception" },

            {
                room: "CAB-1",
                detail: "Python Programming Lab & Machine Learning Lab"
            },

            { room: "CAB-103", detail: "Room" },

            { room: "CAB-102", detail: "Server Room" },

            { room: "C 107", detail: "Staff Room" },

            { room: "C 106", detail: "Room" },

            { room: "C 105", detail: "Room" },

            {
                room: "C 105",
                detail: "Professor K. Rama Prasada Raju"
            },

            {
                room: "C 106",
                detail:
                    "Professor Dr. V. Chandra Shekar & Professor Dr. K. V. Krishnam Raju"
            },

            {
                room: "C 108",
                detail: "Data Base Management Systems Lab (DBMS)"
            },

            {
                room: "C 103",
                detail: "Research and Project Lab"
            },

            {
                room: "C 101",
                detail:
                    "Assistant Professor V. Priya Darshini, Assistant Professor K. Sravani, Assistant Professor Nehaa & Assistant Professor M. Jeevana Sujitha"
            },

            {
                room: "C 102",
                detail:
                    "Dr. G.V.G. Sirisha — Associate Professor & Assistant Professor Dr. K. Aruna Kumari"
            },

            {
                room: "C 110",
                detail:
                    "Dr. P. Bharat Siva Varma — Assistant Professor"
            },

            {
                room: "C 104",
                detail:
                    "Mobile App Development Lab & Data Mining Lab"
            }

        ],

        "First Floor": [

            {
                room: "CAB 201",
                detail: "THINQUBE"
            },

            {
                room: "CAB 201",
                detail: "Room"
            },

            {
                room: "—",
                detail: "Men's Washroom"
            },

            {
                room: "—",
                detail: "HOD Chamber"
            },

            {
                room: "C 203",
                detail: "Department Office"
            },

            {
                room: "C 202",
                detail: "Operating System Lab"
            },

            {
                room: "B 201",
                detail: "Cryptography & Networking Security"
            },

            {
                room: "—",
                detail: "Drinking Water"
            },

            {
                room: "C 206",
                detail: "Room"
            },

            {
                room: "C 201",
                detail: "Room"
            },

            {
                room: "C 205",
                detail: "Department Library"
            },

            {
                room: "C 202, C 204",
                detail: "Rooms / Classrooms"
            }

        ],

        "Second Floor": [

            {
                room: "C 306",
                detail: "Staff Room"
            },

            {
                room: "C 305",
                detail: "Seminar Hall"
            },

            {
                room: "C 301, C 302",
                detail: "Classrooms"
            },

            {
                room: "C 303",
                detail: "Seminar Hall"
            },

            {
                room: "—",
                detail: "Women's Washroom"
            },

            {
                room: "CAB 302",
                detail: "Room"
            },

            {
                room: "CAB 301",
                detail: "Room"
            },

            {
                room: "B 303",
                detail: "Room"
            },

            {
                room: "B 301",
                detail: "Room"
            },

            {
                room: "B 301 B",
                detail: "IoT Lab & Cybersecurity Lab"
            }

        ],

        "Third Floor": [

            {
                room: "C 401–C 406",
                detail: "Rooms / Classrooms"
            },

            {
                room: "—",
                detail: "Men's Washroom"
            },

            {
                room: "CAB 402",
                detail: "Room"
            },

            {
                room: "CAB 401",
                detail: "Room"
            },

            {
                room: "B 404",
                detail: "Room"
            },

            {
                room: "B 403",
                detail: "Room"
            },

            {
                room: "B 402",
                detail: "Room"
            },

            {
                room: "B 401",
                detail: "Room"
            }

        ]

    }

};
function getBlockFloorData(blockId) {

    if (blockId === "s-block") {

        return {
            title: "S Block",
            floors: sBlockData.floors,
            commonFacilities: sBlockData.commonFacilities
        };

    }

        if (blockId === "n-block") {

        return {
            title: "N Block",
            floors: nBlockData.floors,
            commonFacilities: nBlockData.commonFacilities
        };

    }


    if (blockId === "mech") {

        return {
            title: "Mechanical Block",
            floors: mechBlockData.floors,
            commonFacilities: mechBlockData.commonFacilities
        };

    }


    if (blockId === "it") {

        return {
            title: "IT Block",
            floors: itBlockData.floors,
            commonFacilities: itBlockData.commonFacilities
        };

    }

    if (blockId === "cse") {

        return {
            title: "CSE Block",
            floors: cseBlockData.floors,
            commonFacilities: cseBlockData.commonFacilities
        };

    }
    if (blockId === "technological-centre") {

        return {
            title: "Technological Centre",
            floors: technologicalCentreData.floors,
            commonFacilities: technologicalCentreData.commonFacilities
        };

    }


    if (blockId === "civil") {

        return {
            title: "Civil Block",
            floors: civilBlockData.floors,
            commonFacilities: civilBlockData.commonFacilities
        };

    }
if (blockId === "ece") {

    return {
        title: "ECE Block",
        floors: eceBlockData.floors,
        commonFacilities: eceBlockData.commonFacilities
    };

}

if (blockId === "eee") {

    return {
        title: "EEE Block",
        floors: eeeBlockData.floors,
        commonFacilities: eeeBlockData.commonFacilities
    };

}

    if (blockId === "silver-jubilee") {

        return {
            title: "Silver Jubilee",
            floors: silverJubileeBlockData.floors,
            commonFacilities:
                silverJubileeBlockData.commonFacilities
        };

    }

    if (blockId === "admin") {

        return {
            title: "Administrative Block",

            floors: {
                "Ground Floor":
                    administrativeBlockData.groundFloor.map(
                        item => {

                            if (
                                typeof item === "object" &&
                                item !== null
                            ) {
                                return item;
                            }

                            return {
                                room: "—",
                                detail: item
                            };

                        }
                    ),

                "First Floor":
                    administrativeBlockData.firstFloor.map(
                        item => {

                            if (
                                typeof item === "object" &&
                                item !== null
                            ) {
                                return item;
                            }

                            return {
                                room: "—",
                                detail: item
                            };

                        }
                    ),

                "Second Floor":
                    administrativeBlockData.secondFloor.map(
                        item => {

                            if (
                                typeof item === "object" &&
                                item !== null
                            ) {
                                return item;
                            }

                            return {
                                room: "—",
                                detail: item
                            };

                        }
                    )
            },

            commonFacilities: []
        };

    }


    return null;
}
/* ---------------------------------------------------------
   INITIALIZE INTERNAL SMART SEARCH
   --------------------------------------------------------- */

internalSmartSearchData =
    buildInternalSmartSearchData();

enhancedSmartSearchData = [
    ...smartSearchData,
    ...internalSmartSearchData
];

/* ---------------------------------------------------------
   FLOOR ICON
--------------------------------------------------------- */

function getFloorIcon(floorName) {

    const normalized =
        floorName.toLowerCase();

    if (normalized.includes("ground")) {
        return "🏛️";
    }

    if (normalized.includes("first")) {
        return "1️⃣";
    }

    if (normalized.includes("second")) {
        return "2️⃣";
    }

    if (normalized.includes("third")) {
        return "3️⃣";
    }

    if (normalized.includes("fourth")) {
        return "4️⃣";
    }

    return "🏢";
}


/* ---------------------------------------------------------
   OPEN FLOOR
--------------------------------------------------------- */

function openBlockFloor(blockId, floorName) {

    activeBlockFloorView = {
        blockId: blockId,
        floorName: floorName
    };

    renderBlockFloorDetails(
        blockId,
        floorName
    );

}


/* ---------------------------------------------------------
   BACK TO FLOOR DIRECTORY
--------------------------------------------------------- */

function backToBlockFloors(blockId) {

    activeBlockFloorView = null;

    renderBlockFloorDirectory(blockId);

}


/* ---------------------------------------------------------
   FLOOR DIRECTORY
--------------------------------------------------------- */

function renderBlockFloorDirectory(blockId) {

    const data =
        getBlockFloorData(blockId);

    if (!data || !locationInfo) return;


    const floorEntries =
        Object.entries(data.floors);


    let html = `

        <div class="info-section">

            <div class="info-section-title">
                🏫 ${data.title} — Floor Directory
            </div>

            <div class="srkr-block-floor-directory">

                <div class="srkr-floor-selector-grid">
    `;


    floorEntries.forEach(
        ([floorName, rooms]) => {

            const icon =
                getFloorIcon(floorName);


            html += `

                <button
                    type="button"
                    class="srkr-floor-selector"
                    onclick="openBlockFloor(
                        '${blockId}',
                        '${floorName.replace(/'/g, "\\'")}'
                    )"
                    aria-label="Open ${data.title} ${floorName}"
                >

                    <span class="srkr-floor-selector-main">

                        <span class="srkr-floor-selector-icon">
                            ${icon}
                        </span>

                        <span class="srkr-floor-selector-text">

                            <span class="srkr-floor-selector-title">
                                ${floorName}
                            </span>

                            <span class="srkr-floor-selector-count">
                                ${rooms.length} entries
                            </span>

                        </span>

                    </span>


                    <span
                        class="srkr-floor-selector-arrow"
                        aria-hidden="true"
                    >
                        →
                    </span>

                </button>

            `;

        }
    );


    html += `

                </div>

            </div>

        </div>

    `;


    /* -----------------------------------------------------
       COMMON FACILITIES
    ----------------------------------------------------- */

    if (
        data.commonFacilities &&
        data.commonFacilities.length
    ) {

        html += `

            <div class="info-section">

                <div class="info-section-title">
                    ✨ Common Facilities
                </div>

                <div class="srkr-facility-grid">
        `;


        data.commonFacilities.forEach(
            item => {

                const emojiMatch =
                    item.match(/^(\S+)\s+(.*)$/);


                const icon =
                    emojiMatch
                        ? emojiMatch[1]
                        : "✨";


                const text =
                    emojiMatch
                        ? emojiMatch[2]
                        : item;


                html += `

                    <div class="srkr-facility-card">

                        <div class="srkr-facility-icon">
                            ${icon}
                        </div>

                        <div class="srkr-facility-text">
                            ${text}
                        </div>

                    </div>

                `;

            }
        );


        html += `

                </div>

            </div>

        `;

    }


    /* -----------------------------------------------------
       ADMINISTRATIVE ENTRANCES
    ----------------------------------------------------- */

    if (
        blockId === "admin" &&
        administrativeBlockData.entrances
    ) {

        html += `

            <div class="srkr-block-entrance-note">

                <strong>
                    🚪 Entrance Access
                </strong>
        `;


        administrativeBlockData.entrances.forEach(
            entrance => {

                html += `
                    <div>
                        ${entrance}
                    </div>
                `;

            }
        );


        html += `

            </div>

        `;

    }


    locationInfo.innerHTML = `

        <div class="location-header">

            <div>

                <div class="location-title">
                    ${data.title}
                </div>

                <div class="location-category">
                    Academic / Administration
                </div>

            </div>

            <span class="info-badge">
                SRKR Go
            </span>

        </div>

        ${html}

    `;


    locationInfo.classList.add("visible");

}


/* ---------------------------------------------------------
   FLOOR DETAILS
--------------------------------------------------------- */

function renderBlockFloorDetails(
    blockId,
    floorName
) {

    const data =
        getBlockFloorData(blockId);

    if (!data || !locationInfo) return;


    const rooms =
        data.floors[floorName];


    if (!rooms) {

        renderBlockFloorDirectory(
            blockId
        );

        return;

    }


    let html = `

        <div class="info-section">

            <div class="srkr-floor-detail-header">

                <div>

                    <div class="srkr-floor-detail-title">
                        ${getFloorIcon(floorName)}
                        ${floorName}
                    </div>

                    <div class="srkr-floor-detail-subtitle">
                        ${data.title}
                    </div>

                </div>


                <button
                    type="button"
                    class="srkr-floor-back-button"
                    onclick="backToBlockFloors('${blockId}')"
                >
                    ← Floors
                </button>

            </div>


            <div class="srkr-room-grid">

    `;


    rooms.forEach(
        room => {

            const specialRoom =
                room.room === "—";


            html += `

                <div class="srkr-room-card">

                    <div
                        class="srkr-room-number ${
                            specialRoom
                                ? "special"
                                : ""
                        }"
                    >
                        ${
                            specialRoom
                                ? "INFO"
                                : `Room ${room.room}`
                        }
                    </div>


                    <div class="srkr-room-detail">
                        ${room.detail}
                    </div>

                </div>

            `;

        }
    );


    html += `

            </div>

        </div>

    `;


    /*
       Common facilities remain available
       below the floor information.
    */

    if (
        data.commonFacilities &&
        data.commonFacilities.length
    ) {

        html += `

            <div class="info-section">

                <div class="info-section-title">
                    ✨ Common Facilities
                </div>

                <div class="srkr-facility-grid">
        `;


        data.commonFacilities.forEach(
            item => {

                const emojiMatch =
                    item.match(/^(\S+)\s+(.*)$/);


                const icon =
                    emojiMatch
                        ? emojiMatch[1]
                        : "✨";


                const text =
                    emojiMatch
                        ? emojiMatch[2]
                        : item;


                html += `

                    <div class="srkr-facility-card">

                        <div class="srkr-facility-icon">
                            ${icon}
                        </div>

                        <div class="srkr-facility-text">
                            ${text}
                        </div>

                    </div>

                `;

            }
        );


        html += `

                </div>

            </div>

        `;

    }


    locationInfo.innerHTML = `

        <div class="location-header">

            <div>

                <div class="location-title">
                    ${data.title}
                </div>

                <div class="location-category">
                    ${floorName}
                </div>

            </div>

            <span class="info-badge">
                SRKR Go
            </span>

        </div>

        ${html}

    `;


    locationInfo.classList.add("visible");


    /*
       Keep the information panel visible.
       No popup and no map replacement.
    */

    setTimeout(() => {

        locationInfo.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }, 50);

}


/* ---------------------------------------------------------
   S BLOCK COMPATIBILITY FUNCTION
--------------------------------------------------------- */

function renderSBlockInformation() {

    return `
        <div class="srkr-block-floor-directory">
            ${buildBlockFloorDirectoryHTML("s-block")}
        </div>
    `;

}


/* ---------------------------------------------------------
   CIVIL BLOCK COMPATIBILITY FUNCTION
--------------------------------------------------------- */

function renderCivilBlockInformation() {

    return `
        <div class="srkr-block-floor-directory">
            ${buildBlockFloorDirectoryHTML("civil")}
        </div>
    `;

}


/* ---------------------------------------------------------
   ADMINISTRATIVE BLOCK COMPATIBILITY FUNCTION
--------------------------------------------------------- */

function renderAdministrativeBlockInformation() {

    return `
        <div class="srkr-block-floor-directory">
            ${buildBlockFloorDirectoryHTML("admin")}
        </div>
    `;

}


/* ---------------------------------------------------------
   INTERNAL DIRECTORY HTML BUILDER
   ---------------------------------------------------------
   Used by the compatibility functions above.
--------------------------------------------------------- */

function buildBlockFloorDirectoryHTML(blockId) {

    const data =
        getBlockFloorData(blockId);

    if (!data) return "";


    let html = `

        <div class="info-section">

            <div class="info-section-title">
                🏫 ${data.title} — Select Floor
            </div>

            <div class="srkr-floor-selector-grid">
    `;


    Object.entries(data.floors).forEach(
        ([floorName, rooms]) => {

            const icon =
                getFloorIcon(floorName);


            html += `

                <button
                    type="button"
                    class="srkr-floor-selector"
                    onclick="openBlockFloor(
                        '${blockId}',
                        '${floorName.replace(/'/g, "\\'")}'
                    )"
                >

                    <span class="srkr-floor-selector-main">

                        <span class="srkr-floor-selector-icon">
                            ${icon}
                        </span>

                        <span class="srkr-floor-selector-text">

                            <span class="srkr-floor-selector-title">
                                ${floorName}
                            </span>

                            <span class="srkr-floor-selector-count">
                                ${rooms.length} entries
                            </span>

                        </span>

                    </span>


                    <span
                        class="srkr-floor-selector-arrow"
                        aria-hidden="true"
                    >
                        →
                    </span>

                </button>

            `;

        }
    );


    html += `

            </div>

        </div>

    `;


    if (
        data.commonFacilities &&
        data.commonFacilities.length
    ) {

        html += `

            <div class="info-section">

                <div class="info-section-title">
                    ✨ Common Facilities
                </div>

                <div class="srkr-facility-grid">
        `;


        data.commonFacilities.forEach(
            item => {

                const emojiMatch =
                    item.match(/^(\S+)\s+(.*)$/);


                const icon =
                    emojiMatch
                        ? emojiMatch[1]
                        : "✨";


                const text =
                    emojiMatch
                        ? emojiMatch[2]
                        : item;


                html += `

                    <div class="srkr-facility-card">

                        <div class="srkr-facility-icon">
                            ${icon}
                        </div>

                        <div class="srkr-facility-text">
                            ${text}
                        </div>

                    </div>

                `;

            }
        );


        html += `

                </div>

            </div>

        `;

    }


    if (
        blockId === "admin" &&
        administrativeBlockData.entrances
    ) {

        html += `

            <div class="srkr-block-entrance-note">

                <strong>
                    🚪 Entrance Access
                </strong>
        `;


        administrativeBlockData.entrances.forEach(
            entrance => {

                html += `
                    <div>
                        ${entrance}
                    </div>
                `;

            }
        );


        html += `

            </div>

        `;

    }


    return html;

}

/* =========================================================
   25. CAFETERIA RENDERER  (unchanged)
========================================================= */

/* =========================================================
   25. CAFETERIA MENU SYSTEM
   ---------------------------------------------------------
   Bottom-panel category navigation.
   No popup / no modal / no page reload.
========================================================= */






/* =========================================================
   PORSCH DRINKS
========================================================= */

const porschDrinksMenu = {

    "🥤 Juices": [
        ["Pineapple Juice", 60],
        ["Water Melon Juice", 60],
        ["Muskmelon Juice", 70],
        ["Banana Juice", 70],
        ["Grape Juice", 70],
        ["Carrot Juice", 80]
    ],

    "🍹 Mocktails": [
        ["Blue Lagoon Mocktail", 70],
        ["Mint Lime Mocktail", 70],
        ["Greenapple Mocktail", 70],
        ["Bubblegum Mocktail", 80],
        ["Watermelon Mocktail", 80]
    ],

    "🥛 Milkshakes": [
        ["Vanilla Milkshake", 80],
        ["Strawberry Milkshake", 80],
        ["Chocolate Milkshake", 90],
        ["Butter Scotch Milkshake", 90],
        ["Oreo Milkshake", 100],
        ["Kitkat Milkshake", 100],
        ["Blackcurrant Milkshake", 100],
        ["Cold Coffee", 100],
        ["Green Apple Milkshake", 100]
    ]
};


/* =========================================================
   ICE CREAM
========================================================= */

const porschIceCreamMenu = {

    "🍨 Ice Cream": [
        ["Vanilla Ice Cream", 60],
        ["Strawberry Ice Cream", 60],
        ["Chocolate Ice Cream", 70],
        ["Butterscotch Ice Cream", 70],
        ["Blackcurrent Ice Cream", 80],
        ["American Nuts Ice Cream", 80]
    ],

    "🍌 Ice Cream Juices": [
        ["Ice Cream Banana", 90],
        ["Ice Cream Muskmelon", 90],
        ["Ice Cream Carrot", 100],
        ["Ice Cream Kaju Banana", 110]
    ]
};


/* =========================================================
   PORSCH EXTRAS
========================================================= */

const porschExtrasMenu = {
    "➕ Extras": [
        ["Add Egg", 10],
        ["Add Chicken", 30],
        ["Add Kaju", 30]
    ]
};


/* =========================================================
   CAFETERIA TOP-LEVEL CATEGORIES
========================================================= */

const cafeteriaMenuCategories = [

    {
        id: "tiffins",
        title: "Tiffins",
        icon: "🍽️",
        type: "regular",
        key: "🍽️ Tiffins",
        subtitle: "Breakfast & South Indian favourites"
    },

    {
        id: "meals-curry",
        title: "Meals & Curry",
        icon: "🍛",
        type: "regular",
        key: "🍛 Meals & Curry",
        subtitle: "Meals, biryani & curries"
    },

    {
        id: "fast-food",
        title: "Fast Food",
        icon: "🍜",
        type: "regular",
        key: "🍜 Fast Food",
        subtitle: "Rice & noodles"
    },

    {
        id: "tea-coffee",
        title: "Tea & Coffee",
        icon: "☕",
        type: "regular",
        key: "🫖 Tea & Coffee",
        subtitle: "Hot drinks & refreshments"
    },

    {
        id: "porsch-snacks",
        title: "Porsch Snacks",
        icon: "🍔",
        type: "porsch",
        subtitle: "Sandwiches, pizza, noodles & more"
    },

    {
        id: "porsch-drinks",
        title: "Drinks",
        icon: "🥤",
        type: "drinks",
        subtitle: "Juices, mocktails & milkshakes"
    },

    {
        id: "porsch-icecream",
        title: "Ice Cream",
        icon: "🍨",
        type: "icecream",
        subtitle: "Ice creams & ice-cream juices"
    },

    {
        id: "porsch-extras",
        title: "Extras",
        icon: "➕",
        type: "extras",
        subtitle: "Add-ons"
    }
];


/* =========================================================
   GENERIC MENU ITEM RENDERER
========================================================= */

function renderCafeItems(items) {

    let html = `
        <div class="srkr-cafe-items">
    `;

    items.forEach(([itemName, price]) => {

        html += `
            <div class="srkr-cafe-item">

                <div class="srkr-cafe-item-left">

                    <span class="srkr-cafe-dot"></span>

                    <span class="srkr-cafe-item-name">
                        ${itemName}
                    </span>

                </div>

                <span class="srkr-cafe-price">
                    ₹${price}
                </span>

            </div>
        `;
    });

    html += `
        </div>
    `;

    return html;
}


/* =========================================================
   CATEGORY CARD
========================================================= */

function renderCafeCategoryCard(category) {

    return `
        <button
            type="button"
            class="srkr-cafe-menu-card"
            onclick="openCafeteriaCategory('${category.id}')"
        >

            <div class="srkr-cafe-menu-card-icon">
                ${category.icon}
            </div>

            <div class="srkr-cafe-menu-card-content">

                <div class="srkr-cafe-menu-card-title">
                    ${category.title}
                </div>

                <div class="srkr-cafe-menu-card-subtitle">
                    ${category.subtitle}
                </div>

            </div>

            <div class="srkr-cafe-menu-card-arrow">
                ›
            </div>

        </button>
    `;
}


/* =========================================================
   CAFETERIA HOME
   ---------------------------------------------------------
   IMPORTANT:
   This shows categories only.
   The full menu is NOT displayed here.
========================================================= */

function renderCafeteriaMenu() {

    let html = `

        <div class="srkr-cafe-wrapper">

            <div class="srkr-cafe-intro">

                <div class="srkr-cafe-intro-icon">
                    🍴
                </div>

                <div>

                    <div class="srkr-cafe-intro-title">
                        Cafeteria
                    </div>

                    <div class="srkr-cafe-intro-subtitle">
                        What are you looking for?
                    </div>

                </div>

            </div>


            <div class="srkr-cafe-menu-grid">

    `;


    /* ---------------- REGULAR CAFETERIA ---------------- */

    html += `
        <div class="srkr-cafe-section-label">
            🍴 CAFETERIA MENU
        </div>
    `;

    cafeteriaMenuCategories
        .filter(category =>
            ["regular"].includes(category.type)
        )
        .forEach(category => {
            html += renderCafeCategoryCard(category);
        });


    /* ---------------- PORSCH ---------------- */

    html += `

        <div class="srkr-cafe-section-label srkr-cafe-porsch-label">
            ✨ PORSCH
        </div>

    `;

    cafeteriaMenuCategories
        .filter(category =>
            ["porsch", "drinks", "icecream", "extras"].includes(category.type)
        )
        .forEach(category => {
            html += renderCafeCategoryCard(category);
        });


    html += `
            </div>


            <div class="srkr-cafe-timing">

                <div class="srkr-cafe-timing-icon">
                    🕐
                </div>

                <div class="srkr-cafe-timing-content">

                    <div class="srkr-cafe-timing-label">
                        CAFETERIA TIMINGS
                    </div>

                    <div class="srkr-cafe-timing-value">
                        Flexible / subject to availability
                    </div>

                </div>

            </div>

        </div>
    `;

    return html;
}


/* =========================================================
   OPEN REGULAR CAFETERIA CATEGORY
========================================================= */

function openCafeteriaCategory(categoryId) {

    const category = cafeteriaMenuCategories.find(
        item => item.id === categoryId
    );

    if (!category) return;

    if (category.type !== "regular") {
        openSpecialCafeCategory(categoryId);
        return;
    }

    const items = cafeteriaMenu[category.key];

    if (!items) return;

    locationInfo.innerHTML = `

        <div class="location-header">

            <div>

                <div class="location-title">
                    ${category.icon} ${category.title}
                </div>

                <div class="location-category">
                    Cafeteria Menu
                </div>

            </div>

            <span class="info-badge">
                SRKR Go
            </span>

        </div>


        <div class="srkr-cafe-wrapper srkr-cafe-submenu">

            <button
                type="button"
                class="srkr-cafe-back-button"
                onclick="openCafeteriaHome()"
            >
                ← Back to Cafeteria
            </button>

            <div class="srkr-cafe-category">

                <div class="srkr-cafe-category-header">

                    <div class="srkr-cafe-category-title">
                        ${category.icon} ${category.title}
                    </div>

                    <div class="srkr-cafe-category-count">
                        ${items.length}
                    </div>

                </div>

                ${renderCafeItems(items)}

            </div>

        </div>
    `;

    locationInfo.classList.add("visible");
}


/* =========================================================
   OPEN PORSCH / DRINKS / ICE CREAM / EXTRAS
========================================================= */

function openSpecialCafeCategory(categoryId) {

    const category = cafeteriaMenuCategories.find(
        item => item.id === categoryId
    );

    if (!category) return;

    let menuObject = null;
    let backText = "← Back to Cafeteria";

    if (category.type === "porsch") {

        renderPorschHub();
        return;

    }

    if (category.type === "drinks") {

        menuObject = porschDrinksMenu;

    } else if (category.type === "icecream") {

        menuObject = porschIceCreamMenu;

    } else if (category.type === "extras") {

        menuObject = porschExtrasMenu;
    }

    if (!menuObject) return;

    let html = `

        <div class="location-header">

            <div>

                <div class="location-title">
                    ${category.icon} ${category.title}
                </div>

                <div class="location-category">
                    Porsch Menu
                </div>

            </div>

            <span class="info-badge">
                SRKR Go
            </span>

        </div>


        <div class="srkr-cafe-wrapper srkr-cafe-submenu">

            <button
                type="button"
                class="srkr-cafe-back-button"
                onclick="openCafeteriaHome()"
            >
                ${backText}
            </button>
    `;


    Object.entries(menuObject).forEach(
        ([subcategory, items]) => {

            html += `

                <div class="srkr-cafe-category">

                    <div class="srkr-cafe-category-header">

                        <div class="srkr-cafe-category-title">
                            ${subcategory}
                        </div>

                        <div class="srkr-cafe-category-count">
                            ${items.length}
                        </div>

                    </div>

                    ${renderCafeItems(items)}

                </div>

            `;
        }
    );


    html += `
        </div>
    `;

    locationInfo.innerHTML = html;
    locationInfo.classList.add("visible");
}


/* =========================================================
   PORSCH SUBCATEGORY HUB
========================================================= */

function renderPorschHub() {

    const categories = Object.keys(porschSnacksMenu);

    let html = `

        <div class="location-header">

            <div>

                <div class="location-title">
                    🍔 Porsch Snacks
                </div>

                <div class="location-category">
                    Porsch Snacks Counter
                </div>

            </div>

            <span class="info-badge">
                SRKR Go
            </span>

        </div>


        <div class="srkr-cafe-wrapper srkr-cafe-submenu">

            <button
                type="button"
                class="srkr-cafe-back-button"
                onclick="openCafeteriaHome()"
            >
                ← Back to Cafeteria
            </button>


            <div class="srkr-cafe-intro">

                <div class="srkr-cafe-intro-icon">
                    🍔
                </div>

                <div>

                    <div class="srkr-cafe-intro-title">
                        Porsch Snacks
                    </div>

                    <div class="srkr-cafe-intro-subtitle">
                        Choose a food category
                    </div>

                </div>

            </div>


            <div class="srkr-cafe-menu-grid">

    `;


    categories.forEach((categoryName, index) => {

        html += `

            <button
                type="button"
                class="srkr-cafe-menu-card"
                onclick="openPorschCategory(${index})"
            >

                <div class="srkr-cafe-menu-card-icon">
                    ${categoryName.split(" ")[0]}
                </div>

                <div class="srkr-cafe-menu-card-content">

                    <div class="srkr-cafe-menu-card-title">
                        ${categoryName.substring(
                            categoryName.indexOf(" ") + 1
                        )}
                    </div>

                    <div class="srkr-cafe-menu-card-subtitle">
                        ${porschSnacksMenu[categoryName].length} items
                    </div>

                </div>

                <div class="srkr-cafe-menu-card-arrow">
                    ›
                </div>

            </button>

        `;
    });


    html += `

            </div>

        </div>
    `;

    locationInfo.innerHTML = html;
    locationInfo.classList.add("visible");
}


/* =========================================================
   OPEN PORSCH FOOD CATEGORY
========================================================= */

function openPorschCategory(categoryIndex) {

    const categories = Object.keys(porschSnacksMenu);

    const categoryName = categories[categoryIndex];

    if (!categoryName) return;

    const items = porschSnacksMenu[categoryName];

    const icon = categoryName.split(" ")[0];

    const title = categoryName.substring(
        categoryName.indexOf(" ") + 1
    );


    locationInfo.innerHTML = `

        <div class="location-header">

            <div>

                <div class="location-title">
                    ${icon} ${title}
                </div>

                <div class="location-category">
                    Porsch Snacks
                </div>

            </div>

            <span class="info-badge">
                SRKR Go
            </span>

        </div>


        <div class="srkr-cafe-wrapper srkr-cafe-submenu">

            <button
                type="button"
                class="srkr-cafe-back-button"
                onclick="renderPorschHub()"
            >
                ← Back to Porsch Snacks
            </button>


            <div class="srkr-cafe-category">

                <div class="srkr-cafe-category-header">

                    <div class="srkr-cafe-category-title">
                        ${icon} ${title}
                    </div>

                    <div class="srkr-cafe-category-count">
                        ${items.length}
                    </div>

                </div>

                ${renderCafeItems(items)}

            </div>

        </div>
    `;

    locationInfo.classList.add("visible");
}


/* =========================================================
   RETURN TO CAFETERIA HOME
========================================================= */

function openCafeteriaHome() {

    locationInfo.innerHTML = `

        <div class="location-header">

            <div>

                <div class="location-title">
                    Cafeteria
                </div>

                <div class="location-category">
                    Food & Refreshments
                </div>

            </div>

            <span class="info-badge">
                SRKR Go
            </span>

        </div>

        ${renderCafeteriaMenu()}

    `;

    locationInfo.classList.add("visible");
}




/* =========================================================
   26. LOCATION INFORMATION  (unchanged)
========================================================= */
/* =========================================================
   DESTINATION NAVIGATION ACTION
   ---------------------------------------------------------
   Adds a Google-Maps-style navigation action directly
   inside the selected destination information card.
========================================================= */

function renderDestinationNavigationAction(
    destinationId
) {

    const location =
        campusLocations[destinationId];

    if (!location) {
        return "";
    }

    return `
        <div class="srkr-destination-navigation">

            <button
    type="button"
    id="srkrDestinationNavigateButton"
    class="srkr-destination-navigate"
    data-destination-id="${destinationId}"
    aria-label="Start navigation to ${location.name}"
>

                <span class="srkr-destination-navigate-icon">
                    🧭
                </span>

                <span class="srkr-destination-navigate-content">

                    <strong>
                        Start Navigation
                    </strong>

                    <small>
                        Navigate to ${location.name}
                    </small>

                </span>

                <span class="srkr-destination-navigate-arrow">
                    →
                </span>

            </button>

        </div>
    `;
}


/* =========================================================
   DESTINATION NAVIGATION ACTION HANDLER
========================================================= */

function attachDestinationNavigationAction(destinationId) {
    const destinationNavigateButton =
        document.getElementById("srkrDestinationNavigateButton");

    if (!destinationNavigateButton) return;

    destinationNavigateButton.addEventListener("click", () => {
        if (!destinationId) return;

        // Keep the main navigation system as the single source of truth.
        activeDestinationId = destinationId;

        // Close the destination information card first.
        if (locationInfo) {
            locationInfo.classList.remove("visible");
        }

        // Start the existing navigation flow.
        if (navigateButton) {
            navigateButton.click();
        }
    });
}
function showLocationInfo(destinationId) {
    if (!locationInfo) return;
    const details = campusDetails[destinationId];

    if (!details) {
        locationInfo.innerHTML = "";
        locationInfo.classList.remove("visible");
        return;
    }

    /* =========================================================
   BLOCK FLOOR NAVIGATION
   ---------------------------------------------------------
   S Block + Civil Block + Administrative Block
========================================================= */

if (
    details.customType === "s-block" ||
    details.customType === "n-block" ||
    details.customType === "mech-block" ||
    details.customType === "it-block" ||
    details.customType === "civil-block" ||
    details.customType === "admin-block" ||
    details.customType === "ece-block" ||
    details.customType === "eee-block" ||
    details.customType === "cse-block" ||
    details.customType === "silver-jubilee" ||
    details.customType === "technological-centre"
) {

    renderBlockFloorDirectory(
        destinationId
    );

    locationInfo.insertAdjacentHTML(
        "beforeend",
        renderDestinationNavigationAction(
            destinationId
        )
    );

    locationInfo.classList.add(
        "visible"
    );

    attachDestinationNavigationAction(
        destinationId
    );

    return;
}

    if (
    details.customType === "cafeteria"
) {

    locationInfo.innerHTML = `

        <div class="location-header">

            <div>

                <div class="location-title">
                    ${details.title}
                </div>

                <div class="location-category">
                    ${details.category}
                </div>

            </div>

            <span class="info-badge">
                SRKR Go
            </span>

        </div>

        ${renderCafeteriaMenu()}

        ${renderDestinationNavigationAction(
            destinationId
        )}

    `;

    locationInfo.classList.add(
        "visible"
    );

    attachDestinationNavigationAction(
        destinationId
    );

    return;
}

    let sectionsHTML = "";
    Object.entries(details.sections).forEach(([sectionName, items]) => {
        sectionsHTML += `<div class="info-section"><div class="info-section-title">${sectionName}</div><ul class="info-list">`;
        items.forEach(item => { sectionsHTML += `<li>${item}</li>`; });
        sectionsHTML += `</ul></div>`;
    });

    locationInfo.innerHTML = `
    <div class="location-header">

        <div>

            <div class="location-title">
                ${details.title}
            </div>

            <div class="location-category">
                ${details.category}
            </div>

        </div>

        <span class="info-badge">
            SRKR Go
        </span>

    </div>

    ${sectionsHTML}

    ${renderDestinationNavigationAction(
        destinationId
    )}
`;

locationInfo.classList.add(
    "visible"
);

attachDestinationNavigationAction(
    destinationId
);
}


/* =========================================================
   27. FOCUS DESTINATION  (unchanged)
========================================================= */
/* =========================================================
   SRKR GO — SMART NEARBY RECOMMENDATIONS
========================================================= */

function getSmartRecommendationIcon(
    location
) {

    const text =
        (
            location.name +
            " " +
            location.category +
            " " +
            (location.aliases || []).join(" ")
        ).toLowerCase();


    if (
        text.includes("water") ||
        text.includes("refill")
    ) {
        return "💧";
    }


    if (
        text.includes("washroom") ||
        text.includes("toilet")
    ) {
        return "🚻";
    }


    if (
        text.includes("cafe") ||
        text.includes("coffee") ||
        text.includes("snack") ||
        text.includes("canteen") ||
        text.includes("food")
    ) {
        return "🍽️";
    }


    if (
        text.includes("atm") ||
        text.includes("bank")
    ) {
        return "🏦";
    }


    if (
        text.includes("library")
    ) {
        return "📚";
    }


    if (
        text.includes("first aid")
    ) {
        return "🩹";
    }


    return "📍";
}


/* ---------------------------------------------------------
   GET LOCATION CENTER
--------------------------------------------------------- */

function getSmartRecommendationPosition(
    location
) {

    if (!location) {
        return null;
    }


    if (
        location.type === "point"
    ) {

        return [
            location.latitude,
            location.longitude
        ];

    }


    if (
        location.center
    ) {

        return location.center;

    }


    if (
        Array.isArray(
            location.corners
        ) &&
        location.corners.length
    ) {

        const bounds =
            L.latLngBounds(
                location.corners
            );


        const center =
            bounds.getCenter();


        return [
            center.lat,
            center.lng
        ];

    }


    return null;
}


/* ---------------------------------------------------------
   FIND USEFUL FACILITIES NEAR DESTINATION
--------------------------------------------------------- */

function getSmartNearbyRecommendations(
    destinationId
) {

    const destination =
        campusLocations[
            destinationId
        ];


    if (!destination) {
        return [];
    }


    const destinationPosition =
        getSmartRecommendationPosition(
            destination
        );


    if (
        !destinationPosition
    ) {

        return [];

    }


    const usefulKeywords = [
        "water",
        "refill",
        "washroom",
        "toilet",
        "cafe",
        "coffee",
        "snack",
        "canteen",
        "food",
        "atm",
        "bank",
        "library",
        "first aid"
    ];


    const candidates = [];


    Object.entries(
        campusLocations
    ).forEach(
        function ([id, location]) {

            if (
                id === destinationId
            ) {
                return;
            }


            const text =
                (
                    location.name +
                    " " +
                    location.category +
                    " " +
                    (location.aliases || []).join(" ")
                ).toLowerCase();


            const isUseful =
                usefulKeywords.some(
                    keyword =>
                        text.includes(
                            keyword
                        )
                );


            if (!isUseful) {
                return;
            }


            const position =
                getSmartRecommendationPosition(
                    location
                );


            if (!position) {
                return;
            }


            const distance =
                distanceBetween(
                    destinationPosition,
                    position
                );


            candidates.push({
                id,
                location,
                position,
                distance
            });

        }
    );


    /*
     * Sort by distance.
     */

    candidates.sort(
        function (a, b) {

            return (
                a.distance -
                b.distance
            );

        }
    );


    /*
     * Avoid showing the same category
     * repeatedly when possible.
     */

    const selected = [];
    const categoryCounts = {};


    for (
        const candidate of candidates
    ) {

        const category =
            candidate.location.category;


        categoryCounts[category] =
            (
                categoryCounts[category] ||
                0
            ) + 1;


        if (
            categoryCounts[category] > 2
        ) {
            continue;
        }


        selected.push(
            candidate
        );


        if (
            selected.length >= 4
        ) {
            break;
        }

    }


    return selected;
}


/* ---------------------------------------------------------
   RENDER SMART RECOMMENDATIONS
--------------------------------------------------------- */

function renderSmartNearbyRecommendations(
    destinationId
) {

    const recommendations =
        getSmartNearbyRecommendations(
            destinationId
        );


    if (
        recommendations.length === 0
    ) {

        return "";

    }


    let html = `

        <div
            class="srkr-smart-recommendations"
        >

            <div
                class="srkr-smart-recommendations-title"
            >
                💡 Nearby useful places
            </div>

            <div
                class="srkr-smart-recommendation-list"
            >

    `;


    recommendations.forEach(
        function (item) {

            const distance =
                Math.round(
                    item.distance
                );


            html += `

                <button
                    type="button"
                    class="srkr-smart-recommendation"
                    data-recommendation-id="${item.id}"
                >

                    <span
                        class="srkr-smart-recommendation-icon"
                    >
                        ${getSmartRecommendationIcon(
                            item.location
                        )}
                    </span>


                    <span
                        class="srkr-smart-recommendation-name"
                    >
                        ${item.location.name}
                    </span>


                    <span
                        class="srkr-smart-recommendation-distance"
                    >
                        ~${distance} m away
                    </span>

                </button>

            `;

        }
    );


    html += `

            </div>

        </div>

    `;


    return html;
}


/* ---------------------------------------------------------
   ATTACH RECOMMENDATION ACTIONS
--------------------------------------------------------- */

function attachSmartRecommendationActions() {

    const buttons =
        document.querySelectorAll(
            ".srkr-smart-recommendation"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        button.dataset
                            .recommendationId;


                    if (!id) {
                        return;
                    }


                    if (
                        destinationSelect
                    ) {

                        destinationSelect.value =
                            id;

                    }


                    focusDestination(
                        id
                    );

                }
            );

        }
    );

}
function focusDestination(destinationId) {
    const location = campusLocations[destinationId];
    if (!location || !map) return;

    showLocationInfo(destinationId);

    /* =====================================================
   SMART NEARBY RECOMMENDATIONS
===================================================== */

if (locationInfo) {

    const recommendations =
        renderSmartNearbyRecommendations(
            destinationId
        );


    if (recommendations) {

        locationInfo.insertAdjacentHTML(
            "beforeend",
            recommendations
        );


        attachSmartRecommendationActions();

    }

}

    if (location.type === "point") {
        map.flyTo([location.latitude, location.longitude], 19, { duration: 0.8 });
        if (markers[destinationId]) markers[destinationId].openPopup();
    }

    if (location.type === "area") {
        map.flyToBounds(L.latLngBounds(location.corners), { padding: [40, 40], duration: 0.8 });
        if (markers[destinationId]) markers[destinationId].openPopup();
    }

    statusMessage.textContent = `📍 ${location.name} selected.`;
}

/* =========================================================
   SRKR GO — AI-STYLE NATURAL LANGUAGE ASSISTANT
   ---------------------------------------------------------
   Understands natural campus requests such as:

   "take me to civil block"
   "where is the AICTE lab"
   "navigate to CSE"
   "I need the cafeteria"
   "show me the library"

   This uses the existing SRKR campus database.
   No external AI API is required.
========================================================= */


/* ---------------------------------------------------------
   NATURAL LANGUAGE DESTINATION RESOLVER
--------------------------------------------------------- */

function resolveNaturalLanguageDestination(
    userText
) {

    if (
        !userText ||
        typeof userText !== "string"
    ) {
        return null;
    }


    const originalText =
        userText.trim();


    if (!originalText) {
        return null;
    }


    let query =
        normalizeSearchQuery(
            originalText
        );


    /*
     * Remove common conversational phrases.
     */

    query = query
        .replace(
            /\b(hey|hello|hi|please)\b/g,
            " "
        )
        .replace(
            /\b(srkr|srkr go)\b/g,
            " "
        )
        .replace(
            /\b(take me to|take me|go to|navigate to|navigate me to|route to|show me|find|locate|where is|where's|where are|i need|i want to go to|bring me to)\b/g,
            " "
        )
        .replace(
            /\b(the|a|an|my|me)\b/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();


    if (!query) {
        return null;
    }


    /*
     * First use the existing smart search engine.
     */

    const results =
        getSmartSearchResults(
            query
        );


    if (
        results &&
        results.length > 0
    ) {

        return {
            id:
                results[0].item.targetId ||
                results[0].item.id,

            location:
                campusLocations[
                    results[0].item.targetId ||
                    results[0].item.id
                ],

            score:
                results[0].score,

            query
        };
    }


    /*
     * Second-pass fuzzy token matching.
     *
     * This helps with requests such as:
     *
     * "civil"
     * "AICTE"
     * "coffee"
     * "food"
     * "library"
     */

    const tokens =
        query
            .split(/\s+/)
            .filter(
                token =>
                    token.length >= 2
            );


    let bestMatch = null;
    let bestScore = 0;


    Object.entries(
        campusLocations
    ).forEach(
        function ([id, location]) {

            if (!location) {
                return;
            }


            const searchableText =
                [
                    location.name,
                    location.category,
                    ...(location.aliases || [])
                ]
                    .join(" ")
                    .toLowerCase();


            let score = 0;


            tokens.forEach(
                token => {

                    if (
                        searchableText
                            .includes(token)
                    ) {

                        score += 1;

                    }

                }
            );


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                bestMatch = {
                    id,
                    location,
                    score,
                    query
                };

            }

        }
    );


    if (
        bestMatch &&
        bestScore > 0
    ) {

        return bestMatch;

    }


    return null;
}


/* ---------------------------------------------------------
   NATURAL LANGUAGE REQUEST TYPE
--------------------------------------------------------- */

function getNaturalLanguageIntent(
    text
) {

    const normalized =
        normalizeSearchQuery(
            text
        );


    if (
        /\b(where|find|locate|show)\b/i
            .test(normalized)
    ) {

        return "search";

    }


    if (
        /\b(take|go|navigate|route|bring)\b/i
            .test(normalized)
    ) {

        return "navigate";

    }


    return "search";
}


/* ---------------------------------------------------------
   HANDLE NATURAL LANGUAGE SEARCH
--------------------------------------------------------- */

function handleNaturalLanguageRequest(
    text
) {

    const resolved =
        resolveNaturalLanguageDestination(
            text
        );


    if (
        !resolved ||
        !resolved.location
    ) {

        if (statusMessage) {

            statusMessage.textContent =
                "🔎 I couldn't find that place in SRKR campus.";

        }

        return false;

    }


    const destinationId =
        resolved.id;


    /*
     * Synchronize the normal destination selector.
     */

    if (
        destinationSelect
    ) {

        destinationSelect.value =
            destinationId;

    }


    /*
     * Show the destination normally.
     */

    focusDestination(
        destinationId
    );


    /*
     * Decide whether this was a
     * navigation command.
     */

    const intent =
        getNaturalLanguageIntent(
            text
        );


    if (
        intent === "navigate"
    ) {

        /*
         * Give the UI a tiny moment to
         * update before starting navigation.
         */

        setTimeout(
            function () {

                if (
                    navigateButton
                ) {

                    navigateButton.click();

                }

            },
            150
        );

    }


    return true;
}


/* =========================================================
   SRKR GO — VOICE ASSISTANT
========================================================= */

const voiceSearchButton =
    document.getElementById(
        "voiceSearchButton"
    );


let srkrSpeechRecognition = null;
let srkrVoiceListening = false;


/*
 * Browser support.
 */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (
    SpeechRecognition &&
    voiceSearchButton
) {

    srkrSpeechRecognition =
        new SpeechRecognition();


    srkrSpeechRecognition.continuous =
        false;


    srkrSpeechRecognition.interimResults =
        false;


    srkrSpeechRecognition.lang =
        "en-IN";


    srkrSpeechRecognition.maxAlternatives =
        3;


    srkrSpeechRecognition.onstart =
        function () {

            srkrVoiceListening =
                true;


            voiceSearchButton.classList.add(
                "listening"
            );


            voiceSearchButton.textContent =
                "🔴";


            if (statusMessage) {

                statusMessage.textContent =
                    "🎙️ Listening... Say a destination.";

            }

        };


    srkrSpeechRecognition.onresult =
        function (event) {

            const transcript =
                Array.from(
                    event.results
                )
                    .map(
                        result =>
                            result[0].transcript
                    )
                    .join(" ")
                    .trim();


            console.log(
                "🎙️ SRKR Go voice:",
                transcript
            );


            if (
                searchInput
            ) {

                searchInput.value =
                    transcript;

            }


            handleNaturalLanguageRequest(
                transcript
            );

        };


    srkrSpeechRecognition.onerror =
        function (event) {

            console.error(
                "SRKR Go voice error:",
                event.error
            );


            if (
                statusMessage
            ) {

                if (
                    event.error ===
                    "not-allowed"
                ) {

                    statusMessage.textContent =
                        "🎙️ Microphone permission is required.";

                } else if (
                    event.error ===
                    "no-speech"
                ) {

                    statusMessage.textContent =
                        "🎙️ I didn't hear anything.";

                } else {

                    statusMessage.textContent =
                        "🎙️ Voice search couldn't start.";

                }

            }

        };


    srkrSpeechRecognition.onend =
        function () {

            srkrVoiceListening =
                false;


            voiceSearchButton.classList.remove(
                "listening"
            );


            voiceSearchButton.textContent =
                "🎙️";

        };


    voiceSearchButton.addEventListener(
        "click",
        function () {

            if (
                srkrVoiceListening
            ) {

                srkrSpeechRecognition.stop();

                return;

            }


            try {

                srkrSpeechRecognition.start();

            } catch (error) {

                console.warn(
                    "SRKR Go voice start:",
                    error
                );

            }

        }
    );

} else if (
    voiceSearchButton
) {

    /*
     * Graceful fallback for browsers
     * without SpeechRecognition.
     */

    voiceSearchButton.title =
        "Voice search is not supported in this browser";


    voiceSearchButton.addEventListener(
        "click",
        function () {

            if (statusMessage) {

                statusMessage.textContent =
                    "🎙️ Voice search is not supported in this browser. Try Chrome or Edge.";

            }

        }
    );

}


/* =========================================================
   VOICE KEYBOARD SHORTCUT
   ---------------------------------------------------------
   Press "/" while not typing to focus search.
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "/" &&
            document.activeElement !==
                searchInput
        ) {

            event.preventDefault();

            if (searchInput) {

                searchInput.focus();

            }

        }

    }
);
/* =========================================================
   28. SMART SEARCH  (unchanged)
========================================================= */

/* =========================================================
   SMART SEARCH UI
========================================================= */

searchInput.addEventListener(
    "input",
    function () {

        const query =
            searchInput.value.trim();
            /*
 * Natural-language query detection.
 *
 * Examples:
 *
 * "where is the AICTE lab"
 * "take me to civil block"
 * "navigate to cafeteria"
 */

const naturalLanguageQuery =
    /\b(where|find|locate|take me|go to|navigate|route|show me|i need|i want)\b/i
        .test(query);


if (
    naturalLanguageQuery &&
    query.length >= 5
) {

    const naturalResult =
        resolveNaturalLanguageDestination(
            query
        );


    if (
        naturalResult &&
        naturalResult.location
    ) {

        /*
         * Don't immediately navigate while
         * the student is still typing.
         *
         * Instead, add a special suggestion
         * at the top.
         */

        const naturalId =
            naturalResult.id;


        searchSuggestions.innerHTML = `

            <div
                class="search-suggestion"
                data-natural-result="true"
            >

                <span class="suggestion-icon">
                    🤖
                </span>

                <div>

                    <span class="suggestion-name">
                        ${naturalResult.location.name}
                    </span>

                    <span class="suggestion-subtitle">
                        Smart result · tap to open
                    </span>

                </div>

            </div>

        `;


        const naturalSuggestion =
            searchSuggestions.querySelector(
                "[data-natural-result='true']"
            );


        if (
            naturalSuggestion
        ) {

            naturalSuggestion.addEventListener(
                "click",
                function () {

                    searchInput.value =
                        naturalResult.location.name;


                    searchSuggestions.style.display =
                        "none";


                    destinationSelect.value =
                        naturalId;


                    focusDestination(
                        naturalId
                    );

                }
            );

        }


        searchSuggestions.style.display =
            "block";

    }

}


        searchSuggestions.innerHTML =
            "";


        if (!query) {

            searchSuggestions.style.display =
                "none";

            return;

        }


        const results =
            getSmartSearchResults(
                query
            );


        if (
            results.length === 0
        ) {

            searchSuggestions.innerHTML = `
                <div class="no-results">
                    🔎 No SRKR location found
                </div>
            `;

            searchSuggestions.style.display =
                "block";

            return;

        }


        results.forEach(
            result => {

                const item =
                    result.item;


                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "search-suggestion";


                let icon =
                    "📍";


                switch (
                    item.type
                ) {

                    case "building":
                        icon =
                            "🏫";
                        break;

                    case "administration":
                        icon =
                            "🏢";
                        break;

                    case "entrance":
                        icon =
                            "🚪";
                        break;

                    case "landmark":
                        icon =
                            "📍";
                        break;

                    case "food":
                        icon =
                            "🍴";
                        break;

                    case "parking":
                        icon =
                            "🚗";
                        break;

                    case "sports":
                        icon =
                            "🏸";
                        break;

                    case "lab":

    if (
        item.title
            .toLowerCase()
            .includes("library")
    ) {
        icon = "📚";

    } else if (
        item.title
            .toLowerCase()
            .includes("washroom") ||
        item.title
            .toLowerCase()
            .includes("toilet")
    ) {
        icon = "🚻";

    } else if (
        item.title
            .toLowerCase()
            .includes("water")
    ) {
        icon = "💧";

    } else if (
        item.title
            .toLowerCase()
            .includes("office") ||
        item.title
            .toLowerCase()
            .includes("cell") ||
        item.title
            .toLowerCase()
            .includes("accounts") ||
        item.title
            .toLowerCase()
            .includes("scholarship")
    ) {
        icon = "🏢";

    } else if (
        item.title
            .toLowerCase()
            .includes("seminar") ||
        item.title
            .toLowerCase()
            .includes("hall") ||
        item.title
            .toLowerCase()
            .includes("auditorium")
    ) {
        icon = "🏛️";

    } else if (
        item.title
            .toLowerCase()
            .includes("innovation") ||
        item.title
            .toLowerCase()
            .includes("i-hub") ||
        item.title
            .toLowerCase()
            .includes("ihub") ||
        item.title
            .toLowerCase()
            .includes("technology")
    ) {
        icon = "💡";

    } else if (
        item.title
            .toLowerCase()
            .includes("first aid")
    ) {
        icon = "🩹";

    } else if (
        item.title
            .toLowerCase()
            .includes("bank") ||
        item.title
            .toLowerCase()
            .includes("atm")
    ) {
        icon = "🏦";

    } else {
        icon = "🧪";
    }

    break;    

                }


                element.innerHTML = `

                    <span
                        class="suggestion-icon"
                    >
                        ${icon}
                    </span>

                    <div>

                        <span
                            class="suggestion-name"
                        >
                            ${item.title}
                        </span>

                        <span
                            class="suggestion-subtitle"
                        >
                            ${item.subtitle}
                        </span>

                    </div>

                `;


                element.addEventListener(
                    "click",
                    function () {

                        searchInput.value =
                            item.title;


                        searchSuggestions.style.display =
                            "none";


                        const targetDestinationId =
    item.targetId ||
    item.id;


destinationSelect.value =
    targetDestinationId;


focusDestination(
    targetDestinationId
);

                    }
                );


                searchSuggestions.appendChild(
                    element
                );

            }
        );


        searchSuggestions.style.display =
            "block";

    }
);


/* =========================================================
   29. CLOSE SEARCH  (unchanged)
========================================================= */

document.addEventListener("click", function (event) {
    const searchArea = document.querySelector(".search-area");
    if (searchArea && !searchArea.contains(event.target)) searchSuggestions.style.display = "none";
});
/* =========================================================
   29b. SYNC DESTINATION SELECT WITH CAMPUS LOCATIONS
========================================================= */

/* =========================================================
   29b. ORGANIZED DESTINATION SELECT
========================================================= */

function populateDestinationSelect() {

    if (!destinationSelect) {
        return;
    }

    const currentValue = destinationSelect.value;

    destinationSelect.innerHTML = `
        <option value="">📍 Choose your destination</option>
    `;


    /* =====================================================
       DESTINATION CATEGORIES
    ===================================================== */

    const destinationGroups = [

        {
            label: "🏛️ Academic Blocks",
            ids: [
                "cse",
                "it",
                "ece",
                "eee",
                "civil",
                "mech",
                "s-block",
                "n-block",
                "w-block"
            ]
        },

        {
            label: "🏢 Administration & Facilities",
            ids: [
                "admin",
                "library",
                "technological-centre",
                "canteen",
                "silver-jubilee",
                "open-air-auditorium"
            ]
        },

        {
            label: "🏸 Sports & Recreation",
            ids: [
                "gym",
                "badminton",
                "volleyball-courts",
                "open-air-gym"
            ]
        }

    ];


    /* =====================================================
       CREATE ORGANIZED OPTGROUPS
    ===================================================== */

    destinationGroups.forEach(group => {

        const optgroup = document.createElement("optgroup");

        optgroup.label = group.label;


        group.ids.forEach(id => {

            const location = campusLocations[id];

            /*
             * Only add the location if it actually exists
             * in campusLocations.
             *
             * This prevents broken/empty options if a location
             * hasn't been added to the data yet.
             */

            if (!location) {
                return;
            }


            const option = document.createElement("option");

            option.value = id;

            option.textContent = location.name;

            optgroup.appendChild(option);

        });


        /*
         * Don't create an empty category.
         */

        if (optgroup.children.length > 0) {

            destinationSelect.appendChild(optgroup);

        }

    });


    /* =====================================================
       OTHER LOCATIONS
       Automatically keeps any existing destination that
       wasn't manually placed into a category.
    ===================================================== */

    const organizedIds = new Set(
        destinationGroups.flatMap(group => group.ids)
    );


    const otherLocations = Object.entries(campusLocations)
        .filter(([id]) => !organizedIds.has(id));


    if (otherLocations.length > 0) {

        const otherGroup = document.createElement("optgroup");

        otherGroup.label = "📍 Other Campus Locations";


        otherLocations.forEach(([id, location]) => {

            const option = document.createElement("option");

            option.value = id;

            option.textContent = location.name;

            otherGroup.appendChild(option);

        });


        destinationSelect.appendChild(otherGroup);

    }


    /* =====================================================
       RESTORE PREVIOUS SELECTION
    ===================================================== */

    if (
        currentValue &&
        campusLocations[currentValue]
    ) {

        destinationSelect.value = currentValue;

    }

}


/* Populate when the page loads */

populateDestinationSelect();

/* =========================================================
   30. DESTINATION SELECT  (unchanged)
========================================================= */

destinationSelect.addEventListener("change", function () {
    const destinationId = destinationSelect.value;
    if (!destinationId) {
        statusMessage.textContent = "";
        locationInfo.innerHTML = "";
        locationInfo.classList.remove("visible");
        return;
    }
    focusDestination(destinationId);
});


/* =========================================================
   31. FIND ROUTE  (unchanged trigger)
========================================================= */

navigateButton.addEventListener("click", function () {
    const destinationId = destinationSelect.value;

    if (!destinationId) {
        statusMessage.textContent = "Please choose a destination first.";
        return;
    }

    navigationCompleted = false;
    activeDestinationId = destinationId;
    navigationPending = true;

    /*
     * HARD GEOFENCE LOCK
     * Navigation cannot start until GPS confirms
     * the user is inside SRKR campus.
     */
    if (!navigationGeofenceConfirmed || !currentUserPosition) {
        navigationActive = false;

        statusMessage.innerHTML =
            "📍 <strong>Checking your location...</strong><br>" +
            "Navigation will start only when you are inside SRKR campus.";

        startLocationTracking();
        return;
    }

   navigationPending = false;

if (!navigator.geolocation) {
    navigationActive = false;

    statusMessage.textContent =
        "GPS is not supported by this browser.";

    return;
}
const routeBuilt =
    buildLiveRoute(
        destinationId,
        {
            fitMap: false,
            force: true
        }
    );
if (routeBuilt) {

    navigationCameraUserInteracted =
        false;

    enableNavigationCameraFollow(
        true
    );

    hideNavigationRecenterControl();
}
if (!routeBuilt) {
    navigationActive = false;
    resetNavigationMapRotation();

    statusMessage.innerHTML =
        "⚠️ <strong>Route could not be created.</strong><br>" +
        "Please wait for a more accurate GPS position and try again.";
}
});

   


/* =========================================================
   31b. BUILD LIVE ROUTE
   ---------------------------------------------------------
   This was called by the "Find My Route" button and by the
   Faculty Finder's "Navigate" button in the original code,
   but was never actually defined — so clicking either would
   have thrown a JS error. Implemented here using the
   existing junction graph + Dijkstra pathfinder.
========================================================= */

function calculatePolylineDistance(path) {
    if (!path || path.length < 2) return 0;

    let total = 0;

    for (let i = 1; i < path.length; i++) {
        total += distanceBetween(
            path[i - 1],
            path[i]
        );
    }

    return total;
}


function getDistanceToRoute(position, routePath) {
    if (!position || !routePath || routePath.length === 0) {
        return Infinity;
    }

    if (routePath.length === 1) {
        return distanceBetween(
            position,
            routePath[0]
        );
    }

    let nearestDistance = Infinity;

    for (let i = 1; i < routePath.length; i++) {
        const distance = distancePointToSegment(
            position,
            routePath[i - 1],
            routePath[i]
        );

        if (distance < nearestDistance) {
            nearestDistance = distance;
        }
    }

    return nearestDistance;
}
/* =========================================================
   FLAGSHIP NAVIGATION ROUTE METRICS
   ---------------------------------------------------------
   IMPORTANT:
   activeRoutePath is allowed to shrink visually as the
   user moves.

   navigationInstructionRoutePath is the permanent copy
   of the complete route.

   Therefore all important navigation measurements use
   the permanent route.
========================================================= */

function getNavigationRouteMetrics(position) {

    if (
        !position ||
        !Array.isArray(
            navigationInstructionRoutePath
        ) ||
        navigationInstructionRoutePath.length < 2
    ) {
        return {
            offRouteDistance: Infinity,
            remainingDistance: Infinity,
            progressDistance: 0
        };
    }


    /*
     * Find the user's exact position along
     * the complete navigation route.
     */
    const projection =
        getNavigationRouteProjection(
            position,
            navigationInstructionRoutePath
        );


    if (!projection) {

        return {
            offRouteDistance: Infinity,
            remainingDistance: Infinity,
            progressDistance: 0
        };
    }


    /*
     * Total distance of the complete route.
     */
    const totalRouteDistance =
        calculatePolylineDistance(
            navigationInstructionRoutePath
        );


    /*
     * Distance still remaining after the
     * user's projected position.
     */
    const remainingDistance =
    Math.max(
        0,
        Math.round(
            totalRouteDistance -
            projection.distanceFromRouteStart
        )
    );


    return {

        /*
         * True perpendicular distance from
         * the user's GPS position to the route.
         */
        offRouteDistance:
            projection.nearestDistance,

        /*
         * Distance travelled along the route.
         */
        progressDistance:
            projection.distanceFromRouteStart,

        /*
         * Actual remaining route distance.
         */
        remainingDistance:
            remainingDistance
    };
}
function getPointAtRouteDistance(
    routePath,
    targetDistance
) {

    if (
        !Array.isArray(routePath) ||
        routePath.length < 2 ||
        !Number.isFinite(targetDistance)
    ) {
        return null;
    }


    if (
        targetDistance <= 0
    ) {

        return [
            routePath[0][0],
            routePath[0][1]
        ];
    }


    let travelledDistance = 0;


    for (
        let i = 1;
        i < routePath.length;
        i++
    ) {

        const segmentStart =
            routePath[i - 1];

        const segmentEnd =
            routePath[i];


        const segmentDistance =
            distanceBetween(
                segmentStart,
                segmentEnd
            );


        if (
            segmentDistance <= 0
        ) {
            continue;
        }


        const nextDistance =
            travelledDistance +
            segmentDistance;


        if (
            targetDistance <=
            nextDistance
        ) {

            const fraction =
                (
                    targetDistance -
                    travelledDistance
                ) /
                segmentDistance;


            return [
                segmentStart[0] +
                    fraction *
                    (
                        segmentEnd[0] -
                        segmentStart[0]
                    ),

                segmentStart[1] +
                    fraction *
                    (
                        segmentEnd[1] -
                        segmentStart[1]
                    )
            ];
        }


        travelledDistance =
            nextDistance;
    }


    /*
     * If progress has reached the end,
     * return the destination.
     */
    const finalPoint =
        routePath[
            routePath.length - 1
        ];


    return [
        finalPoint[0],
        finalPoint[1]
    ];
}
function updateRouteProgress(position) {

    if (
        !position ||
        !navigationActive ||
        !Array.isArray(
            navigationInstructionRoutePath
        ) ||
        navigationInstructionRoutePath.length < 2
    ) {
        return;
    }


    const permanentRoute =
        navigationInstructionRoutePath;


    /*
     * Find exactly where the user is projected
     * onto the verified route.
     */
    const projection =
        getNavigationRouteProjection(
            position,
            permanentRoute
        );


    if (
        !projection
    ) {
        return;
    }


    /*
     * Do not visually update the route if the
     * GPS position is genuinely off the route.
     *
     * The separate rerouting system handles that.
     */
    if (
        !Number.isFinite(
            projection.nearestDistance
        ) ||
        projection.nearestDistance >
            getNavigationOffRouteThreshold()
    ) {
        return;
    }


    /*
     * =====================================================
     * NEVER MOVE BACKWARD
     * =====================================================
     *
     * GPS can fluctuate by a few metres.
     *
     * Example:
     *
     * 120 m progress
     * GPS says 118 m
     *
     * We must NOT redraw the already-covered
     * 2 metres.
     */
    navigationVisualProgressDistance =
        Math.max(
            navigationVisualProgressDistance,
            projection.distanceFromRouteStart
        );


    /*
     * Find the exact route point corresponding
     * to the accepted forward progress.
     */
    const progressPoint =
        getPointAtRouteDistance(
            permanentRoute,
            navigationVisualProgressDistance
        );


    if (
        !progressPoint
    ) {
        return;
    }


    /*
     * Determine which route segment contains
     * the current progress point.
     */
    const progressProjection =
        getNavigationRouteProjection(
            progressPoint,
            permanentRoute
        );


    if (
        !progressProjection
    ) {
        return;
    }


    const remainingPath = [];


    /*
     * IMPORTANT:
     *
     * Do NOT start the blue line from raw GPS.
     *
     * Start it from the user's projected position
     * on the actual surveyed road.
     *
     * This removes the little GPS → road
     * displacement line.
     */
    remainingPath.push([
        progressPoint[0],
        progressPoint[1]
    ]);


    /*
     * Add all road points still ahead.
     */
    for (
        let i =
            progressProjection.segmentIndex + 1;

        i < permanentRoute.length;

        i++
    ) {

        const point =
            permanentRoute[i];

        const previous =
            remainingPath[
                remainingPath.length - 1
            ];


        if (
            distanceBetween(
                previous,
                point
            ) > 0.5
        ) {

            remainingPath.push([
                point[0],
                point[1]
            ]);
        }
    }


    /*
     * Always preserve the destination endpoint.
     */
    const finalRoutePoint =
        permanentRoute[
            permanentRoute.length - 1
        ];


    const lastPoint =
        remainingPath[
            remainingPath.length - 1
        ];


    if (
        finalRoutePoint &&
        (
            !lastPoint ||
            distanceBetween(
                lastPoint,
                finalRoutePoint
            ) > 0.5
        )
    ) {

        remainingPath.push([
            finalRoutePoint[0],
            finalRoutePoint[1]
        ]);
    }


    /*
     * Update ONLY the visible route.
     */
    if (
        remainingPath.length >= 2
    ) {

        activeRoutePath =
            remainingPath;


        if (
            routeLayer
        ) {

            routeLayer.setLatLngs(
                remainingPath
            );
        }
    }
}

function completeNavigation() {

    const location =
        activeDestinationId
            ? campusLocations[activeDestinationId]
            : null;

    navigationActive = false;

resetNavigationMapRotation();

navigationCompleted = true;

    activeRoutePath = [];
    navigationInstructionRoutePath = [];
    activeRouteAccessPoint = null;
    navigationVisualProgressDistance = 0;
    navigationHeading = null;
navigationHeadingSource = "none";
navigationLastHeadingPosition = null;
navigationPassedInstruction = false;

updateNavigationHeadingArrow();

    if (location) {

        statusMessage.innerHTML =
            `🏁 <strong>You have arrived at ${location.name}</strong>`;

        showNavigationArrived(
            location.name
        );

    } else {

        statusMessage.textContent =
            "🏁 You have arrived.";

        showNavigationArrived(
            "Destination"
        );
    }
}

function updateNavigationStatus() {

    if (
        !navigationActive ||
        !activeDestinationId ||
        !currentUserPosition
    ) {
        return;
    }

    const location =
        campusLocations[
            activeDestinationId
        ];

    if (!location) return;

    const destinationPosition =
        getDestinationPosition(
            location
        );

    const navigationMetrics =
    getNavigationRouteMetrics(
        currentUserPosition
    );

const routeDistance =
    navigationMetrics.remainingDistance;

    const destinationDistance =
        destinationPosition
            ? distanceBetween(
                currentUserPosition,
                destinationPosition
            )
            : Infinity;

    const arrivalThreshold =
        Math.max(
            NAV_ARRIVAL_DISTANCE,
            currentGpsAccuracy
                ? Math.min(
                    30,
                    currentGpsAccuracy * 0.75
                )
                : NAV_ARRIVAL_DISTANCE
        );


    /* =====================================================
       ARRIVAL DETECTION
    ===================================================== */

    if (
        destinationDistance <=
        arrivalThreshold
        ||
        (
            activeRouteAccessPoint &&
            distanceBetween(
                currentUserPosition,
                activeRouteAccessPoint
            ) <= arrivalThreshold
        )
    ) {

        completeNavigation();

        return;
    }


    /* =====================================================
       OFF-ROUTE DISTANCE
    ===================================================== */

   const offRouteDistance =
    navigationMetrics.offRouteDistance;


    /* =====================================================
       LIVE NAVIGATION PANEL
    ===================================================== */

    const remainingDistance =
        Math.max(
            0,
            Math.round(routeDistance)
        );


   let displayDistance;

if (Number.isFinite(remainingDistance)) {

    if (remainingDistance >= 1000) {

        displayDistance =
            `${(
                remainingDistance / 1000
            ).toFixed(1)} km`;

    } else {

        displayDistance =
            `${remainingDistance} m`;
    }

} else {

    displayDistance =
        "Calculating...";
}

if (
    Number.isFinite(offRouteDistance) &&
    offRouteDistance >
        getNavigationOffRouteThreshold()
) {

    updateNavigationPanelWarning(
        location.name,
        `You are about ${Math.round(
            offRouteDistance
        )} m away from the route.`
    );

} else {

    const walkingETA =
        formatWalkingETA(
            remainingDistance
        );

    updateNavigationPanel(
        location.name,
        displayDistance,
        currentGpsAccuracy
    ? `${walkingETA} · ${getGPSStatusText(
        currentGpsAccuracy
    )}`
    : walkingETA,
        "🧭"
    );
}
    /* =====================================================
       EXISTING STATUS MESSAGE
    ===================================================== */

 if (
    Number.isFinite(offRouteDistance) &&
    offRouteDistance >
        getNavigationOffRouteThreshold()
) {

    statusMessage.innerHTML =
        `⚠️ <strong>Recalculating route...</strong><br>` +
        `📍 You moved ~${Math.round(
            offRouteDistance
        )} m from the route.`;

} else if (
    !Number.isFinite(offRouteDistance)
) {

    statusMessage.innerHTML =
        `🧭 <strong>${location.name}</strong><br>` +
        `📍 Calculating route position...`;

} else {

    statusMessage.innerHTML =
        `🧭 <strong>${location.name}</strong><br>` +
        `📏 ~${remainingDistance} m remaining`;
}
}


function buildLiveRoute(
    destinationId,
    options = {}
) {

    const location =
        campusLocations[
            destinationId
        ];
        /*
 * =====================================================
 * ROUTE BUILD SAFETY RESET
 * =====================================================
 *
 * Navigation becomes active ONLY after a valid route
 * has been successfully calculated.
 */
navigationActive = false;
navigationVisualProgressDistance = 0;
resetNavigationMapRotation();


/* =====================================================
   HARD GEOFENCE SAFETY LOCK
===================================================== */

    if (
        !navigationGeofenceConfirmed ||
        !currentUserPosition ||
        !isInsideSRKR(
            currentUserPosition[0],
            currentUserPosition[1]
        )
    ) {

        navigationActive =
            false;

        statusMessage.innerHTML =
            "🚫 <strong>Navigation locked</strong><br>" +
            "You must be inside SRKR campus.";

        return false;
    }


    if (
        !location
    ) {

        statusMessage.textContent =
            "Unknown destination.";

        return false;
    }


    if (
        !currentUserPosition
    ) {

        statusMessage.textContent =
            "📍 Finding your location first...";

        startLocationTracking();

        return false;
    }


    const destinationPosition =
        getDestinationPosition(
            location
        );


    if (
        !destinationPosition
    ) {

        statusMessage.textContent =
            "Unable to locate that destination yet.";

        return false;
    }


    /* =====================================================
       FIND THE BEST DESTINATION ACCESS POINT
       -----------------------------------------------------
       We first prefer a real entrance/access point.

       This prevents the route from travelling through
       the building polygon.
    ===================================================== */

    const accessPoint =
        getBestAccessPoint(
            destinationId,
            currentUserPosition
        );


    /*
     * If the destination has an access point,
     * route toward that access point.
     *
     * Otherwise route toward the nearest road point
     * to the destination itself.
     */

    const roadTarget =
        accessPoint ||
        destinationPosition;


    /* =====================================================
       REAL ROAD ROUTING
    ===================================================== */

    /*
 * Use the smoothed GPS position for ROUTING.
 *
 * The visible live-location marker still uses
 * the latest raw GPS position.
 *
 * This prevents small GPS fluctuations from
 * selecting the wrong campus road/component.
 */
const routingPosition =
    getSmoothedGPSPosition() ||
    currentUserPosition;


/* =====================================================
   PEDESTRIAN START CONNECTOR
   -----------------------------------------------------
   If the user is physically inside a surveyed campus
   area, first connect them to that area's real
   surveyed access point.

   Example:

       User inside cafeteria
              ↓
       Cafeteria access point
              ↓
       Campus road network
===================================================== */

const currentAreaConnector =
    getCurrentAreaAccessPoint(
        routingPosition,
        destinationId
    );


/*
 * If the user is inside a surveyed area, the road
 * router starts from that area's access point.
 *
 * Otherwise it starts from the normal GPS position.
 */
const roadRoutingStart =
    currentAreaConnector
        ? currentAreaConnector.accessPoint
        : routingPosition;


const routeResult =
    findShortestRoadPath(
        roadRoutingStart,
        roadTarget
    );

    if (
    !routeResult ||
    !Array.isArray(
        routeResult.path
    ) ||
    routeResult.path.length < 2
) {

    console.error(
        "🧭 SRKR Go — ROUTE BUILD FAILED",
        {
            destinationId,
            currentUserPosition,
            routingPosition,
            roadTarget,
            accessPoint,
            destinationPosition,
            routeResult,
            roadGraph: campusRoadGraph
        }
    );

    statusMessage.innerHTML =
        "⚠️ <strong>Route could not be created.</strong><br>" +
        "The campus road network could not connect your location to this destination.";

    return false;
}


/* =====================================================
   BUILD CLEAN ROAD-ONLY ROUTE
   -----------------------------------------------------
   IMPORTANT:
   Do NOT draw temporary GPS/access-point
   displacement segments.

   The blue navigation line represents only
   the surveyed campus road network.

   GPS remains visible through the live-location
   marker and navigation camera.
===================================================== */

const fullPath = [];


/*
 * START OF SURVEYED ROAD
 *
 * findShortestRoadPath() temporarily projects
 * the starting position onto the nearest surveyed
 * road.
 *
 * We use that projected road point as the visual
 * route start instead of drawing:
 *
 * GPS → road
 *
 * This removes the unwanted displacement line.
 */
const visualStartPoint =
    routeResult.startRoad &&
    Array.isArray(
        routeResult.startRoad.point
    )
        ? routeResult.startRoad.point
        : null;


/*
 * END OF SURVEYED ROAD
 *
 * Likewise, use the projected point on the
 * destination road instead of drawing:
 *
 * road → building/access point
 *
 * The destination itself remains known to the
 * navigation system separately.
 */
const visualEndPoint =
    routeResult.destinationRoad &&
    Array.isArray(
        routeResult.destinationRoad.point
    )
        ? routeResult.destinationRoad.point
        : null;


/*
 * Add the actual surveyed-road starting point.
 */
if (
    visualStartPoint
) {

    fullPath.push([
        visualStartPoint[0],
        visualStartPoint[1]
    ]);
}


/*
 * Add ONLY the internal road-network points.
 *
 * routeResult.path is:

 * START_ROAD_POINT
 *      ↓
 * road nodes / intersections
 *      ↓
 * DESTINATION_ROAD_POINT
 *
 * Therefore skip the two temporary endpoints.
 */
const roadNetworkPoints =
    routeResult.path.slice(
        1,
        -1
    );


roadNetworkPoints.forEach(
    point => {

        if (
            !Array.isArray(point) ||
            point.length < 2
        ) {
            return;
        }

        const previousPoint =
            fullPath[
                fullPath.length - 1
            ];

        if (
            !previousPoint ||
            distanceBetween(
                previousPoint,
                point
            ) > 0.5
        ) {

            fullPath.push([
                point[0],
                point[1]
            ]);
        }
    }
);


/*
 * Add the projected destination-road point.
 */
if (
    visualEndPoint
) {

    const previousPoint =
        fullPath[
            fullPath.length - 1
        ];

    if (
        !previousPoint ||
        distanceBetween(
            previousPoint,
            visualEndPoint
        ) > 0.5
    ) {

        fullPath.push([
            visualEndPoint[0],
            visualEndPoint[1]
        ]);
    }
}


/*
 * SAFETY FALLBACK
 *
 * If the temporary endpoint structure ever
 * produces an empty road path, fall back to
 * the returned path instead of breaking navigation.
 */
if (
    fullPath.length < 2 &&
    Array.isArray(routeResult.path)
) {

    routeResult.path.forEach(
        point => {

            if (
                !Array.isArray(point) ||
                point.length < 2
            ) {
                return;
            }

            const previousPoint =
                fullPath[
                    fullPath.length - 1
                ];

            if (
                !previousPoint ||
                distanceBetween(
                    previousPoint,
                    point
                ) > 0.5
            ) {

                fullPath.push([
                    point[0],
                    point[1]
                ]);
            }
        }
    );
}

if (fullPath.length < 2) {
    statusMessage.textContent =
        "Route is too short to display.";
    return false;
}


    /* =====================================================
       SAVE ROUTE
    ===================================================== */

    activeRoutePath =
        fullPath;
        navigationVisualProgressDistance = 0;


    navigationInstructionRoutePath =
        fullPath.map(
            point => [
                point[0],
                point[1]
            ]
        );


    activeRouteAccessPoint =
        accessPoint;


    activeDestinationId =
        destinationId;


    navigationInstructions =
        buildNavigationInstructions(
            fullPath,
            destinationId
        );


    currentNavigationInstruction =
        0;

    nextNavigationTarget =
        null;

    navigationHeading =
        null;

    navigationHeadingSource =
        "none";

    navigationLastHeadingPosition =
        null;

    navigationPassedInstruction =
        false;

    navigationActive =
        true;

    navigationCompleted =
        false;


    /* =====================================================
       DRAW ONLY THE ROAD ROUTE
    ===================================================== */

    if (
        routeLayer
    ) {

        routeLayer.setLatLngs(
            fullPath
        );

    } else {

        routeLayer =
            L.polyline(
                fullPath,
                {
                    color: "#4f46e5",
                    weight: 5,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round"
                }
            ).addTo(
                map
            );
    }


    /* =====================================================
       MAP FIT
    ===================================================== */

    if (
        options.fitMap
    ) {

        map.flyToBounds(
            L.latLngBounds(
                fullPath
            ),
            {
                padding: [
                    50,
                    50
                ],
                duration: 0.8
            }
        );
    }


    lastRerouteTime =
        Date.now();


    const totalDistance =
        Math.round(
            calculatePolylineDistance(
                fullPath
            )
        );


    let displayDistance;


    if (
        totalDistance >=
        1000
    ) {

        displayDistance =
            `${(
                totalDistance /
                1000
            ).toFixed(1)} km`;

    } else {

        displayDistance =
            `${totalDistance} m`;
    }


    statusMessage.innerHTML =
        `🧭 <strong>Route to ${location.name}</strong><br>` +
        `🛣️ Road route · ~${displayDistance}`;


    updateNavigationPanel(
        location.name,
        currentGpsAccuracy
            ? `GPS accuracy ±${Math.round(
                currentGpsAccuracy
            )} m`
            : "GPS navigation active",
        "🧭"
    );


    return true;
}


/* =========================================================
   32. USE MY LOCATION  (unchanged)
========================================================= */

function startLocationTracking() {

    if (!navigator.geolocation) {
    navigationActive = false;
    resetNavigationMapRotation();

    statusMessage.textContent =
        "GPS is not supported by this browser.";

    return;
}

    locationButton.disabled = true;

    locationButton.textContent =
        "📍 Finding...";

    if (gpsWatchId !== null) {

        navigator.geolocation.clearWatch(
            gpsWatchId
        );
    }

    gpsWatchId =
        navigator.geolocation.watchPosition(
            handleGPSUpdate,
            handleGPSError,
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 30000
            }
        );
}


locationButton.addEventListener("click", function () {

    if (qrStartLocation) {

        const qrLocation =
            campusLocations[qrStartLocation];

        statusMessage.innerHTML =
            `📍 QR starting point: <strong>${qrLocation.name}</strong><br>` +
            `🔳 QR navigation mode`;

        return;
    }

    statusMessage.textContent =
        "📍 Finding your location...";

    startLocationTracking();
});


/* =========================================================
   33. GPS UPDATE  (unchanged)
========================================================= */

function handleGPSUpdate(position) {

    const latitude =
        position.coords.latitude;

    const longitude =
        position.coords.longitude;

    const accuracy =
        position.coords.accuracy;

    const rawPosition = [
        latitude,
        longitude
    ];

    const timestamp =
        Number.isFinite(position.timestamp)
            ? position.timestamp
            : Date.now();

    /*
     * GPS JUMP / ACCURACY FILTER
     *
     * Bad GPS readings are ignored before they
     * reach the live navigation system.
     */
    if (
        !isValidGPSReading(
            rawPosition,
            accuracy,
            timestamp
        )
    ) {

        console.warn(
            "GPS update ignored:",
            rawPosition,
            "accuracy:",
            accuracy
        );

        return;
    }

    /*
     * Save the accepted raw GPS reading.
     */
    lastRawGpsPosition =
        rawPosition;

    lastRawGpsTimestamp =
        timestamp;

    /*
     * Keep the latest GPS readings.
     * These will be used for smoothing
     * in the next Phase 4 step.
     */
    gpsHistory.push({
        position: rawPosition,
        accuracy: accuracy,
        timestamp: timestamp
    });

    if (
        gpsHistory.length >
        GPS_HISTORY_LIMIT
    ) {
        gpsHistory.shift();
    }

    currentGpsAccuracy =
    accuracy;


    /*
     * =========================================================
     * FLAGSHIP CAMPUS GEOFENCE CHECK
     * =========================================================
     *
     * Step 1:
     * Check whether the accepted GPS position is physically
     * inside the SRKR campus geofence.
     *
     * Step 2:
     * If inside, require the configured number of valid GPS
     * confirmations before unlocking navigation.
     *
     * Step 3:
     * If outside, completely stop campus navigation.
     */

    const insideCampus =
        isInsideSRKR(
            latitude,
            longitude
        );


    /*
     * USER IS OUTSIDE SRKR
     */
    if (!insideCampus) {

        navigationGeofenceConfirmations = 0;
        navigationGeofenceConfirmed = false;

        navigationActive = false;

resetNavigationMapRotation();

currentUserPosition = null;

        if (userLocationMarker) {

            map.removeLayer(
                userLocationMarker
            );

            userLocationMarker = null;
        }

        if (userAccuracyCircle) {

            map.removeLayer(
                userAccuracyCircle
            );

            userAccuracyCircle = null;
        }

        if (routeLayer) {

            map.removeLayer(
                routeLayer
            );

            routeLayer = null;
        }

        activeRoutePath = [];
        navigationInstructionRoutePath = [];
        activeRouteAccessPoint = null;

        navigationCompleted = false;

        locationButton.disabled = false;

        locationButton.textContent =
            "📍 Update My Location";

        statusMessage.innerHTML =
            `🚫 You are outside <strong>SRKR campus</strong>.<br>` +
            `Campus navigation will activate inside the campus.`;

        return;
    }


    /*
     * =========================================================
     * USER IS INSIDE SRKR
     *
     * Now require the 2 valid GPS confirmations.
     * =========================================================
     */

    if (
        !confirmNavigationGeofence(
            latitude,
            longitude,
            accuracy
        )
    ) {

        navigationActive = false;
        resetNavigationMapRotation();
        statusMessage.innerHTML =
            "📍 <strong>Confirming campus location...</strong><br>" +
            `${navigationGeofenceConfirmations}/` +
            `${NAV_GEOFENCE_CONFIRMATIONS_REQUIRED} GPS confirmations`;

        return;
    }
/*
 * GPS POSITION
 *
 * The raw GPS position was already validated
 * and confirmed to be inside SRKR campus.
 *
 * Route calculations independently use the
 * smoothed GPS position inside buildLiveRoute().
 *
 * The visible live-location marker uses
 * the latest accepted raw GPS position
 * to avoid positional lag.
 */
    /* =========================================================
   STEP 17. UPDATE NAVIGATION HEADING

   Use the accepted raw GPS position for movement
   direction. The actual navigation position remains
   the existing smoothed position.
========================================================= */

updateNavigationHeading(
    rawPosition,
    position.coords.heading
);
/*
 * Update the rotating navigation map
 * using the latest calculated heading.
 *
 * navigationHeading may come from:
 * 1. Device/GPS heading
 * 2. GPS movement bearing fallback
 */
smoothNavigationMapBearing(
    navigationHeading
);

/*
 * =========================================================
 * LIVE LOCATION POSITION
 * =========================================================
 *
 * Use the latest accepted GPS reading for the
 * visible "You are here" marker.
 *
 * The smoothed position is intentionally NOT used
 * for the live marker because smoothing introduces
 * positional lag.
 */

currentUserPosition =
    rawPosition;
    /*
 * =========================================================
 * NAVIGATION CAMERA FOLLOW
 * =========================================================
 *
 * Keep the map centered on the user's live position
 * while turn-by-turn navigation is active.
 *
 * The raw GPS position is used so the camera follows
 * the visible live-location marker without smoothing lag.
 * ========================================================= */

updateNavigationCamera(
    rawPosition,
    false
);
    /*
     * =========================================================
     * FLAGSHIP PENDING NAVIGATION AUTO-START
     * =========================================================
     *
     * If the user pressed "Find My Route" while outside
     * the campus, navigationPending remains true.
     *
     * Once GPS confirms the user is inside SRKR and we now
     * have a usable currentUserPosition, automatically
     * build the requested route.
     */

    if (
        navigationPending &&
        navigationGeofenceConfirmed &&
        currentUserPosition &&
        activeDestinationId
    ) {

        navigationPending = false;
navigationCompleted = false;

const pendingDestinationId =
    activeDestinationId;

const pendingRouteBuilt =
    buildLiveRoute(
        pendingDestinationId,
        {
            fitMap: false,
            force: true
        }
    );

if (pendingRouteBuilt) {

    navigationActive = true;

    navigationCameraUserInteracted =
        false;

    enableNavigationCameraFollow(
        true
    );

    hideNavigationRecenterControl();
}
    }

    if (!userLocationMarker) {

        userLocationMarker =
            L.circleMarker(
                currentUserPosition,
                {
                    radius: 9,
                    color: "#2563eb",
                    fillColor: "#3b82f6",
                    fillOpacity: 1,
                    weight: 4
                }
            ).addTo(map);

        userLocationMarker.bindPopup(
            `<strong>📍 You are here</strong>`
        );

    } else {

        userLocationMarker.setLatLng(
            currentUserPosition
        );
    }


    if (!userAccuracyCircle) {

        userAccuracyCircle =
            L.circle(
                currentUserPosition,
                {
                    radius: accuracy,
                    color: "#3b82f6",
                    fillColor: "#60a5fa",
                    fillOpacity: 0.10,
                    weight: 1
                }
            ).addTo(map);

    } else {

        userAccuracyCircle.setLatLng(
            currentUserPosition
        );

        userAccuracyCircle.setRadius(
            accuracy
        );
    }


    locationButton.disabled = false;

    locationButton.textContent =
        "📍 Update My Location";


    /*
     * LIVE NAVIGATION MODE
     */
/*
 * LIVE NAVIGATION MODE
 */


/*
 * Convert a GPS point into a local metre-based
 * coordinate system.
 *
 * The SRKR campus is small enough that this
 * local projection is highly accurate for
 * route-distance calculations.
 */



/*
 * Find the nearest point on one route segment
 * to the current GPS position.
 */
function projectNavigationPointOnSegment(
    point,
    segmentStart,
    segmentEnd,
    referenceLatitude
) {

    const p =
        navigationPointToXY(
            point,
            referenceLatitude
        );

    const a =
        navigationPointToXY(
            segmentStart,
            referenceLatitude
        );

    const b =
        navigationPointToXY(
            segmentEnd,
            referenceLatitude
        );

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const segmentLengthSquared =
        dx * dx +
        dy * dy;

    if (
        segmentLengthSquared <=
        0.000001
    ) {

        const distance =
            Math.sqrt(
                (p.x - a.x) ** 2 +
                (p.y - a.y) ** 2
            );

        return {
    distance,
    fraction: 0,

    point: [
        segmentStart[0],
        segmentStart[1]
    ]
};
    }

    let fraction =
        (
            (p.x - a.x) * dx +
            (p.y - a.y) * dy
        ) /
        segmentLengthSquared;

    fraction =
        Math.max(
            0,
            Math.min(
                1,
                fraction
            )
        );

    const projectedX =
        a.x +
        fraction * dx;

    const projectedY =
        a.y +
        fraction * dy;

    const distance =
        Math.sqrt(
            (p.x - projectedX) ** 2 +
            (p.y - projectedY) ** 2
        );

   return {
    distance,
    fraction,

    point: [
        segmentStart[0] +
            fraction *
            (
                segmentEnd[0] -
                segmentStart[0]
            ),

        segmentStart[1] +
            fraction *
            (
                segmentEnd[1] -
                segmentStart[1]
            )
    ]
};
}


/*
 * Find where a GPS point lies along the
 * complete navigation route.
 *
 * Returns:
 *
 * {
 *   distanceFromRouteStart,
 *   nearestDistance,
 *   segmentIndex,
 *   fraction
 * }
 */
function getNavigationRouteProjection(
    point,
    routePath
) {

    if (
        !point ||
        !Array.isArray(routePath) ||
        routePath.length < 2
    ) {

        return null;
    }

    const referenceLatitude =
        point[0];

    let totalDistance = 0;

    let bestProjection = null;

    for (
        let i = 1;
        i < routePath.length;
        i++
    ) {

        const segmentStart =
            routePath[i - 1];

        const segmentEnd =
            routePath[i];

        const segmentDistance =
            distanceBetween(
                segmentStart,
                segmentEnd
            );

        if (
            !Number.isFinite(
                segmentDistance
            )
        ) {

            continue;
        }

        const projection =
            projectNavigationPointOnSegment(
                point,
                segmentStart,
                segmentEnd,
                referenceLatitude
            );

        if (
            projection &&
            (
                !bestProjection ||
                projection.distance <
                bestProjection.nearestDistance
            )
        ) {

            bestProjection = {

                nearestDistance:
                    projection.distance,

                distanceFromRouteStart:
                    totalDistance +
                    (
                        segmentDistance *
                        projection.fraction
                    ),

                segmentIndex:
                    i - 1,

                fraction:
                    projection.fraction
            };
        }

        totalDistance +=
            segmentDistance;
    }

    return bestProjection;
}


/*
 * Calculate the distance from the user's
 * current position to an instruction target
 * ALONG THE ACTUAL ROUTE.
 */
function getNavigationInstructionDistance(
    instruction
) {

    if (
        !instruction ||
        !instruction.target ||
        !currentUserPosition
    ) {

        return Infinity;
    }


    /*
     * Prefer the preserved complete route.
     *
     * activeRoutePath can shrink while the user
     * moves, so it must not be our primary source.
     */
    const routePath =
        (
            Array.isArray(
                navigationInstructionRoutePath
            ) &&
            navigationInstructionRoutePath.length >= 2
        )
            ? navigationInstructionRoutePath
            : activeRoutePath;


    /*
     * Safe fallback if no usable route exists.
     */
    if (
        !Array.isArray(routePath) ||
        routePath.length < 2
    ) {

        return Math.max(
            0,
            distanceBetween(
                currentUserPosition,
                instruction.target
            )
        );
    }


    /*
     * Find the user's position along
     * the preserved route.
     */
    const userProjection =
        getNavigationRouteProjection(
            currentUserPosition,
            routePath
        );


    /*
     * Find the instruction target's position
     * along the same route.
     */
    const targetProjection =
        getNavigationRouteProjection(
            instruction.target,
            routePath
        );


    /*
     * If either projection fails,
     * fall back to direct distance.
     */
    if (
        !userProjection ||
        !targetProjection
    ) {

        return Math.max(
            0,
            distanceBetween(
                currentUserPosition,
                instruction.target
            )
        );
    }


    /*
     * Target is behind the user.
     *
     * Returning 0 allows the navigation
     * instruction engine to advance.
     */
    if (
        targetProjection.distanceFromRouteStart <=
        userProjection.distanceFromRouteStart
    ) {

        return 0;
    }


    /*
     * Actual remaining distance following
     * the route geometry.
     */
    return Math.max(
        0,
        targetProjection.distanceFromRouteStart -
        userProjection.distanceFromRouteStart
    );
}
    if (
        navigationActive &&
        activeDestinationId
        
    ) {

        /*
         * Move only the first route point with
         * the user's current GPS position.
         *
         * The verified campus route itself stays
         * unchanged until an actual reroute is needed.
         */

        if (
    routeLayer &&
    activeRoutePath.length > 0
) {

    updateRouteProgress(
        currentUserPosition
    );
}


                /*
         * =====================================================
         * FLAGSHIP OFF-ROUTE METRICS
         * -----------------------------------------------------
         * NEVER use the shortened activeRoutePath for the
         * actual navigation calculation.
         *
         * Use the permanent complete route instead.
         * =====================================================
         */

        const navigationMetrics =
            getNavigationRouteMetrics(
                currentUserPosition
            );

        const offRouteDistance =
            navigationMetrics.offRouteDistance;

        const now =
            Date.now();


        /*
         * OFF-ROUTE DETECTION
         */

        if (
    offRouteDistance >
        getNavigationOffRouteThreshold() &&
    now - lastRerouteTime >=
        NAV_REROUTE_COOLDOWN
) {

            const destinationId =
                activeDestinationId;

            statusMessage.innerHTML =
                `🔄 <strong>Recalculating...</strong><br>` +
                `📍 You are ~${Math.round(offRouteDistance)} m from the route.`;

            lastRerouteTime = now;

            buildLiveRoute(
                destinationId,
                {
                    fitMap: false,
                    force: true
                }
            );
        }


        /*
         * ARRIVAL + REMAINING DISTANCE
         */

        if (navigationActive) {

    updateNavigationStatus();

    advanceNavigationInstruction();

    updateTurnInstruction();
     }


        /*
         * FOLLOW USER
         *
         * panTo() is intentionally used instead of
         * flyTo() so the map doesn't keep zooming/
         * jumping every time GPS updates.
         */

        /*
 * =========================================================
 * LIVE NAVIGATION MAP FOLLOW
 * =========================================================
 *
 * The map follows the latest accepted GPS position.
 *
 * During navigation, the Leaflet map pane is visually
 * rotated by the navigation rotation wrapper.
 *
 * Leaflet's internal geographic transforms are preserved.
 */

if (
    navigationActive &&
    map &&
    currentUserPosition &&
    now - lastNavigationMapFollow >=
    NAV_MAP_FOLLOW_INTERVAL
) {

    lastNavigationMapFollow =
        now;


    /*
     * Keep the user's position near the center
     * of the navigation viewport.
     */

    map.panTo(
        currentUserPosition,
        {
            animate: true,
            duration: 0.35
        }
    );
}

        return;
    }


    /*
     * NORMAL LOCATION MODE
     */

    statusMessage.innerHTML =
        `📍 You are inside <strong>SRKR campus</strong><br>` +
        `📡 GPS accuracy: ~${Math.round(accuracy)} m`;

    map.flyTo(
        currentUserPosition,
        19,
        {
            duration: 0.6
        }
    );
}


/* =========================================================
   34. GPS ERROR  (unchanged)
========================================================= */

function handleGPSError(error) {

    locationButton.disabled = false;

    locationButton.textContent =
        "📍 Try Again";


    if (
        error.code ===
        error.PERMISSION_DENIED
    ) {

        
        /* =========================================================
   STEP 17. RESET NAVIGATION HEADING
   ---------------------------------------------------------
   Clear all heading/orientation state so the next
   navigation session starts fresh.
========================================================= */

navigationHeading =
    null;

navigationHeadingSource =
    "none";

navigationLastHeadingPosition =
    null;

navigationPassedInstruction =
    false;

        statusMessage.textContent =
            "Location permission was denied.";

    } else if (
        error.code ===
        error.POSITION_UNAVAILABLE
    ) {

        statusMessage.textContent =
            navigationActive
                ? "📡 Your location is temporarily unavailable. Trying to continue GPS tracking..."
                : "Your location is unavailable.";

    } else if (
        error.code ===
        error.TIMEOUT
    ) {

        statusMessage.textContent =
            navigationActive
                ? "📡 GPS request timed out. Trying again..."
                : "GPS request timed out. Try again.";

    } else {

        statusMessage.textContent =
            "Unable to get your location.";
    }
}


/* =========================================================
   35. INITIALIZE MAP  (unchanged)
========================================================= */

function initializeMap() {
    try {
        const campusBounds = L.latLngBounds(campusBoundary);
        const viewBounds = campusBounds.pad(0.018);

        map = L.map("map", {
            minZoom: 16.5,
            maxZoom: 20,
            maxBounds: viewBounds,
            maxBoundsViscosity: 1
        });

        map.fitBounds(viewBounds, {
            padding: [8, 8]
        });
        /*
 * =========================================================
 * NAVIGATION MAP INTERACTION
 * =========================================================
 *
 * Any manual map movement temporarily disables automatic
 * camera following.
 *
 * GPS navigation itself continues normally.
 * Only the camera-follow behaviour pauses.
 * ========================================================= */

map.on(
    "dragstart",
    function () {

        if (!navigationActive) {
            return;
        }

        navigationCameraUserInteracted =
            true;

        disableNavigationCameraFollow();

        showNavigationRecenterControl();
    }
);


map.on(
    "zoomstart",
    function () {

        if (!navigationActive) {
            return;
        }

        /*
         * Do not treat the automatic navigation zoom
         * as a user interaction.
         */
        if (navigationCameraAnimating) {
            return;
        }

        navigationCameraUserInteracted =
            true;

        disableNavigationCameraFollow();

        showNavigationRecenterControl();
    }
);

        /*
         * Draw our own SRKR campus data first.
         * This must not prevent the loading screen
         * from being removed if the external basemap fails.
         */
        try {
            drawCampusOverlays();
        } catch (overlayError) {
            console.error(
                "SRKR Go campus overlay error:",
                overlayError
            );

            if (statusMessage) {
                statusMessage.textContent =
                    "⚠️ Campus map loaded with some overlay errors.";
            }
        }

        /*
         * Hide the loading screen once the Leaflet map
         * itself has been created.
         */
        if (mapLoading) {
            mapLoading.classList.add("hidden");
        }

        /*
         * Keep the status useful even if the external
         * basemap has a problem.
         */
        if (statusMessage) {
            statusMessage.textContent =
                "📍 SRKR campus map ready.";
        }

        /*
         * External MapLibre basemap.
         * If it fails, SRKR's own campus data still works.
         */
        try {
            if (
                typeof L.maplibreGL === "function"
            ) {
                L.maplibreGL({
                    style:
                        "https://tiles.openfreemap.org/styles/liberty"
                }).addTo(map);
            } else {
                console.error(
                    "SRKR Go: MapLibre-Leaflet bridge is unavailable."
                );

                if (statusMessage) {
                    statusMessage.textContent =
                        "📍 SRKR campus map ready — basemap unavailable.";
                }
            }
        } catch (mapLibreError) {
            console.error(
                "SRKR Go MapLibre error:",
                mapLibreError
            );

            if (statusMessage) {
                statusMessage.textContent =
                    "📍 SRKR campus map ready — basemap unavailable.";
            }
        }

    } catch (error) {

        console.error(
            "SRKR Go map initialization failed:",
            error
        );

        if (mapLoading) {
            mapLoading.classList.add("hidden");
        }

        if (statusMessage) {
            statusMessage.innerHTML =
                "⚠️ <strong>Map initialization failed.</strong><br>" +
                "Please refresh the page.";
        }
    }
}


/* =========================================================
   36. DRAW CAMPUS OVERLAYS  (unchanged)
========================================================= */

function drawCampusOverlays() {
    if (campusOverlaysDrawn) return;
    campusOverlaysDrawn = true;

    L.polygon(campusBoundary, { color: "#4f46e5", weight: 2, fillColor: "#818cf8", fillOpacity: 0.035, interactive: false }).addTo(map);

    Object.entries(campusLocations).forEach(([id, location]) => drawCampusLocation(id, location));

    
}


/* =========================================================
   37. 📍 CAMPUS PIN  (unchanged)
========================================================= */

const campusPinIcon = L.divIcon({
    className: "campus-pin",
    html: "<span>📍</span>",
    iconSize: [32, 40],
    iconAnchor: [16, 38],
    popupAnchor: [0, -35]
});


/* =========================================================
   38. DRAW CAMPUS LOCATION
   ---------------------------------------------------------
   Area shapes now drop their centre pin on your surveyed
   "center" coordinate when you gave one, instead of always
   using the bounding-box centroid.
========================================================= */

function drawCampusLocation(id, location) {

    if (location.type === "point") {
        const marker = L.marker([location.latitude, location.longitude], { icon: campusPinIcon }).addTo(map);
        marker.bindPopup(`<div style="text-align:center;min-width:150px;">
            <strong>📍 ${location.name}</strong><br><small>${location.category}</small></div>`);
        markers[id] = marker;
        return;
    }

    if (location.type === "area") {
        const polygon = L.polygon(location.corners, {
            color: "#f9a8d4",fillColor: "#fce7f3",fillOpacity: 0.55,weight: 2,opacity: 0.85
        }).addTo(map);

        let extra = "";
        if (location.temporaryParking) {
            extra = `<br><br>🚗 <small>May be used as temporary car parking when there is no event.</small>`;
        }

        polygon.bindPopup(`<div style="text-align:center;min-width:160px;">
            <strong>📍 ${location.name}</strong><br><small>${location.category}</small>${extra}</div>`);

        markers[id] = polygon;

        const centerPosition = getDestinationPosition(location);

        L.marker(centerPosition, { icon: campusPinIcon, interactive: false }).addTo(map);
    }
}


/* =========================================================
   39. VERIFIED ROAD CONNECTIONS  (unchanged)
========================================================= */

/* =========================================================
   39. DRAW NEW SURVEYED ROAD NETWORK
   ---------------------------------------------------------
   Roads remain visible but intentionally subtle.

   IMPORTANT:
   Access points are NOT drawn here.
   They appear only as part of an active navigation route.
   ========================================================= */

function drawVerifiedConnections() {

    Object.entries(
        campusRoads
    ).forEach(
        ([roadId, road]) => {

            if (
                !Array.isArray(road) ||
                road.length < 2
            ) {
                return;
            }

            L.polyline(
                road,
                {
                    color: "#64748b",
                    weight: 4,
                    opacity: 0.42,
                    lineCap: "round",
                    lineJoin: "round",
                    interactive: false
                }
            ).addTo(map);

        }
    );
}


/* =========================================================
   40. INITIALIZE
========================================================= */

initializeMap();


/* =========================================================
   41. INITIAL QR MODE  (unchanged)
========================================================= */

if (qrStartLocation) {
    const waitForOverlays = setInterval(function () {
        if (!campusOverlaysDrawn) return;
        clearInterval(waitForOverlays);

        const qrLocation = campusLocations[qrStartLocation];
        const qrPosition = getQRStartPosition();

        if (qrPosition) map.flyTo(qrPosition, 19, { duration: 0.8 });

        statusMessage.innerHTML = `📍 Starting point: <strong>${qrLocation.name}</strong><br>🔳 QR navigation mode`;
    }, 100);

    setTimeout(function () { clearInterval(waitForOverlays); }, 10000);
}


/* =========================================================
   42. 👨‍🏫 FACULTY FINDER — PROTOTYPE  (unchanged)
========================================================= */

const facultyDirectory = [

    // =========================
    // S BLOCK — CHEMISTRY / MATHS
    // =========================

    {
        id: "faculty-gnv-kishore",
        name: "Dr. G.N.V. Kishore",
        designation: "Professor & HOD",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "103",
        locationId: "s-block"
    },

    {
        id: "faculty-mn-varma",
        name: "Dr. M.N. Varma",
        designation: "Professor & Head of Department",
        department: "Engineering Mathematics & Humanities",
        block: "S Block",
        floor: "Ground Floor",
        room: "105",
        locationId: "s-block"
    },

    {
        id: "faculty-prudhvy-raju",
        name: "Sri M. Prudhvy Raju",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "105",
        locationId: "s-block"
    },

    {
        id: "faculty-udaya-bhaskara",
        name: "Sri N. Udaya Bhaskara Varma",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "105",
        locationId: "s-block"
    },

    {
        id: "faculty-kiran-kumar-varma",
        name: "Dr. K. Kiran Kumar Varma",
        designation: "Assistant Professor",
        department: "Engineering Mathematics & Humanities",
        block: "S Block",
        floor: "Ground Floor",
        room: "105",
        locationId: "s-block"
    },

    {
        id: "faculty-subba-rao",
        name: "Dr. R. Subba Rao",
        designation: "R&D Cell Coordinator & Professor",
        department: "Engineering",
        block: "S Block",
        floor: "Ground Floor",
        room: "106",
        locationId: "s-block"
    },

    {
        id: "faculty-b-srinivasu",
        name: "Sri B. Srinivasu",
        designation: "Assistant Professor",
        department: "Engineering",
        block: "S Block",
        floor: "Ground Floor",
        room: "106",
        locationId: "s-block"
    },

    {
        id: "faculty-shoban-babu",
        name: "Dr. Y. Shobhan Babu",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "107",
        locationId: "s-block"
    },

    {
        id: "faculty-g-santhi",
        name: "Smt. G. Santhi",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "107",
        locationId: "s-block"
    },

    {
        id: "faculty-d-sridevi",
        name: "D. Sridevi",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "108",
        locationId: "s-block"
    },

    {
        id: "faculty-lakshmi-hyma",
        name: "Smt. R. Lakshmi Hyma",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "108",
        locationId: "s-block"
    },

    {
        id: "faculty-pushpa-latha",
        name: "Dr. M. Pushpa Latha",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "108",
        locationId: "s-block"
    },

    {
        id: "faculty-venkatapathi-raju",
        name: "Dr. D. Venkatapathi Raju",
        designation: "Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "109",
        locationId: "s-block"
    },

    {
        id: "faculty-kv-rao",
        name: "K. V. Rao",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "109",
        locationId: "s-block"
    },

    {
        id: "faculty-a-kiran-kumar",
        name: "Sri A. Kiran Kumar",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "110",
        locationId: "s-block"
    },

    {
        id: "faculty-t-sathish",
        name: "T. Sathish",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "110",
        locationId: "s-block"
    },

    {
        id: "faculty-g-vidyasagar",
        name: "Dr. G. Vidyasagar",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "110",
        locationId: "s-block"
    },

    {
        id: "faculty-trkdv-prasad",
        name: "T.R.K.D.V. Prasad",
        designation: "Assistant Professor",
        department: "Engineering Mathematics & Humanities",
        block: "S Block",
        floor: "Ground Floor",
        room: "112",
        locationId: "s-block"
    },

    {
        id: "faculty-ramalingeswar-rao",
        name: "Dr. S. Ramalingeswar Rao",
        designation: "Assistant Professor",
        department: "Engineering Mathematics & Humanities",
        block: "S Block",
        floor: "Ground Floor",
        room: "112",
        locationId: "s-block"
    },

    {
        id: "faculty-krishna-mohan-raju",
        name: "Sri N. Krishna Mohan Raju",
        designation: "Assistant Professor",
        department: "Engineering Mathematics & Humanities",
        block: "S Block",
        floor: "Ground Floor",
        room: "112",
        locationId: "s-block"
    },

    {
        id: "faculty-p-bhavani",
        name: "Dr. P. Bhavani",
        designation: "Professor & HOD",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "116",
        locationId: "s-block"
    },

    {
        id: "faculty-u-naga-babu",
        name: "Dr. U. Naga Babu",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "117",
        locationId: "s-block"
    },

    {
        id: "faculty-j-suresh-kumar",
        name: "Mr. J. Suresh Kumar",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "117",
        locationId: "s-block"
    },

    {
        id: "faculty-d-chandra-shekar",
        name: "Dr. D. Chandra Shekar",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "118",
        locationId: "s-block"
    },

    {
        id: "faculty-bs-diwakar",
        name: "Dr. B.S. Diwakar",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "118",
        locationId: "s-block"
    },

    {
        id: "faculty-ch-lakshmi-prasanna",
        name: "Mrs. Ch. Lakshmi Prasanna",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "119",
        locationId: "s-block"
    },

    {
        id: "faculty-k-tulasi-bhavani",
        name: "Mrs. K. Tulasi Bhavani",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "119",
        locationId: "s-block"
    },

    {
        id: "faculty-k-balageetha",
        name: "Mrs. K. Balageetha",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "120",
        locationId: "s-block"
    },

    {
        id: "faculty-uv-lakshmi",
        name: "Mrs. U.V. Lakshmi",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "120",
        locationId: "s-block"
    },

    {
        id: "faculty-s-prameela-devi",
        name: "Mrs. S. Prameela Devi",
        designation: "Assistant Professor",
        department: "Engineering Chemistry",
        block: "S Block",
        floor: "Ground Floor",
        room: "120",
        locationId: "s-block"
    },


    // =========================
    // S BLOCK — PHYSICS
    // =========================

    {
        id: "faculty-rameeza-begum",
        name: "Smt. SK. Rameeza Begum",
        designation: "Assistant Professor",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "204",
        locationId: "s-block"
    },

    {
        id: "faculty-mv-someswara-rao",
        name: "Dr. M.V. Someswara Rao",
        designation: "Associate Professor & HOD",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "206",
        locationId: "s-block"
    },

    {
        id: "faculty-g-anusha",
        name: "Miss G. Anusha",
        designation: "Assistant Professor",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "208",
        locationId: "s-block"
    },

    {
        id: "faculty-pvs-lakshmi-aparna",
        name: "Dr. P.V.S. Lakshmi Aparna",
        designation: "Assistant Professor",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "208",
        locationId: "s-block"
    },

    {
        id: "faculty-pavan-kumar",
        name: "Sri Ch. J.N. Pavan Kumar",
        designation: "Assistant Professor",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "209",
        locationId: "s-block"
    },

    {
        id: "faculty-pv-prasanna-kumar",
        name: "Sri P.V. Prasanna Kumar",
        designation: "Assistant Professor",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "210",
        locationId: "s-block"
    },

    {
        id: "faculty-s-srikanth",
        name: "Dr. S. Srikanth",
        designation: "Assistant Professor",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "210",
        locationId: "s-block"
    },

    {
        id: "faculty-kv-ramana-murthy",
        name: "Dr. K.V. Ramana Murthy",
        designation: "Professor",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "211",
        locationId: "s-block"
    },

    {
        id: "faculty-nps-acharyulu",
        name: "Sri N.P.S. Acharyulu",
        designation: "Assistant Professor",
        department: "Engineering Physics",
        block: "S Block",
        floor: "First Floor",
        room: "211",
        locationId: "s-block"
    },


    // =========================
    // CIVIL BLOCK
    // =========================

    {
        id: "faculty-v-venkateswara-raju",
        name: "Sri. V. Venkateswara Raju",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Ground Floor",
        room: "107",
        locationId: "civil"
    },

    {
        id: "faculty-bh-revathi",
        name: "Smt. Bh. Revathi",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Ground Floor",
        room: "108",
        locationId: "civil"
    },

    {
        id: "faculty-g-sri-satya",
        name: "Smt. G. Sri Satya",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Ground Floor",
        room: "108",
        locationId: "civil"
    },

    {
        id: "faculty-g-sasikala",
        name: "Dr. G. Sasikala",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Ground Floor",
        room: "109",
        locationId: "civil"
    },

    {
        id: "faculty-acsv-prasad",
        name: "Dr. A.C.S.V. Prasad",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Ground Floor",
        room: "110",
        locationId: "civil"
    },

    {
        id: "faculty-g-sri-bala",
        name: "Dr. G. Sri Bala",
        designation: "Head of Department",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Ground Floor",
        room: "Room number not provided",
        locationId: "civil"
    },

    {
        id: "faculty-e-ramanjaneya-raju",
        name: "Dr. E. Ramanjaneya Raju",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "First Floor",
        room: "208",
        locationId: "civil"
    },

    {
        id: "faculty-g-sabarish",
        name: "Sri. G. Sabarish",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "First Floor",
        room: "208",
        locationId: "civil"
    },

    {
        id: "faculty-g-lakshmi-ganesh",
        name: "Sri. G. Lakshmi Ganesh",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "First Floor",
        room: "208",
        locationId: "civil"
    },

    {
        id: "faculty-pv-rambabu",
        name: "Dr. P. V. Rambabu",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "First Floor",
        room: "209",
        locationId: "civil"
    },

    {
        id: "faculty-s-srikanth-reddy",
        name: "Sri. S. Srikanth Reddy",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "First Floor",
        room: "209",
        locationId: "civil"
    },

    {
        id: "faculty-lava-kumar",
        name: "Dr. S. K. V. S. T. Lava Kumar",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "First Floor",
        room: "210",
        locationId: "civil"
    },

    {
        id: "faculty-t-edukondalu",
        name: "Sri. T. Edukondalu",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "First Floor",
        room: "210",
        locationId: "civil"
    },

    {
        id: "faculty-glv-krishna-raju",
        name: "Sri. G. L. V. Krishna Raju",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "306",
        locationId: "civil"
    },

    {
        id: "faculty-p-raju",
        name: "Sri. P. Raju",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "306",
        locationId: "civil"
    },

    {
        id: "faculty-raghu-varma",
        name: "Sri. Bh. Raghu Varma",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "307",
        locationId: "civil"
    },

    {
        id: "faculty-d-prudhvi-raju",
        name: "Sri. D. Prudhvi Raju",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "307",
        locationId: "civil"
    },

    {
        id: "faculty-karthik-phani-varma",
        name: "Sri. D. Karthik Phani Varma",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "307",
        locationId: "civil"
    },

    {
        id: "faculty-suryanarayana-raju",
        name: "Sri. J. N. S. Suryanarayana Raju",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "308",
        locationId: "civil"
    },

    {
        id: "faculty-k-jagadeep",
        name: "Sri. K. Jagadeep",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "308",
        locationId: "civil"
    },

    {
        id: "faculty-m-venkata-rao",
        name: "Sri. M. Venkata Rao",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "309",
        locationId: "civil"
    },

    {
        id: "faculty-msk-chaitanya",
        name: "Sri. M. S. K. Chaitanya",
        designation: "Faculty",
        department: "Civil Engineering",
        block: "Civil Block",
        floor: "Second Floor",
        room: "309",
        locationId: "civil"
    },


    // =========================
    // ECE BLOCK
    // =========================

    {
        id: "faculty-gvs-padma-rao",
        name: "G.V.S. Padma Rao",
        designation: "Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Ground Floor",
        room: "T103",
        locationId: "ece"
    },

    {
        id: "faculty-b-sanjay",
        name: "Dr. B. Sanjay",
        designation: "Associate Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Ground Floor",
        room: "T104",
        locationId: "ece"
    },

    {
        id: "faculty-bhaya-prasad",
        name: "Sri B. Bhaya Prasad",
        designation: "Assistant Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Ground Floor",
        room: "T104",
        locationId: "ece"
    },

    {
        id: "faculty-g-naga-raju",
        name: "Dr. G. Naga Raju",
        designation: "Associate Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Ground Floor",
        room: "T105",
        locationId: "ece"
    },

    {
        id: "faculty-knv-satyanarayan",
        name: "Dr. K.N.V. Satyanarayan",
        designation: "Assistant Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Ground Floor",
        room: "T105",
        locationId: "ece"
    },

    {
        id: "faculty-p-krishna-kanth-varma",
        name: "Dr. P. Krishna Kanth Varma",
        designation: "Associate Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Ground Floor",
        room: "Room number not provided",
        locationId: "ece"
    },

    {
        id: "faculty-ss-mohan-reddy",
        name: "Dr. S.S. Mohan Reddy",
        designation: "Professor & HOD",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Ground Floor",
        room: "Room number not provided",
        locationId: "ece"
    },

    {
        id: "faculty-g-prathima",
        name: "Mrs. G. Prathima",
        designation: "Assistant Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "First Floor",
        room: "T201",
        locationId: "ece"
    },

    {
        id: "faculty-dvn-bharathi",
        name: "Mrs. D.V.N. Bharathi",
        designation: "Assistant Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "First Floor",
        room: "T201",
        locationId: "ece"
    },

    {
        id: "faculty-y-rama-lakshmana",
        name: "Dr. Y. Rama Lakshmana",
        designation: "Associate Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "First Floor",
        room: "T202",
        locationId: "ece"
    },

    {
        id: "faculty-n-udaya-kumar",
        name: "Dr. N. Udaya Kumar",
        designation: "Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "First Floor",
        room: "T204",
        locationId: "ece"
    },

    {
        id: "faculty-b-revathi",
        name: "Mrs. B. Revathi",
        designation: "Assistant Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "First Floor",
        room: "T205",
        locationId: "ece"
    },

    {
        id: "faculty-tv-hyma-lakshmi",
        name: "Dr. T.V. Hyma Lakshmi",
        designation: "Associate Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "First Floor",
        room: "T205",
        locationId: "ece"
    },

    {
        id: "faculty-k-lakshmi-devi",
        name: "Mrs. K. Lakshmi Devi",
        designation: "Assistant Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "First Floor",
        room: "T206",
        locationId: "ece"
    },

    {
        id: "faculty-v-nagavalli",
        name: "Dr. V. Nagavalli",
        designation: "Associate Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "First Floor",
        room: "T206",
        locationId: "ece"
    },

    {
        id: "faculty-mownika",
        name: "Mrs. P.S.S.N. Mownika",
        designation: "Assistant Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Second Floor",
        room: "T303",
        locationId: "ece"
    },

    {
        id: "faculty-s-swathi",
        name: "Dr. S. Swathi",
        designation: "Assistant Professor",
        department: "Electronics & Communication Engineering",
        block: "ECE Block",
        floor: "Second Floor",
        room: "T303",
        locationId: "ece"
    },


    // =========================
    // EEE BLOCK
    // =========================

    {
        id: "faculty-brk-varma",
        name: "Dr. B.R.K. Varma",
        designation: "Professor & HOD",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Ground Floor",
        room: "D102",
        locationId: "eee"
    },

    {
        id: "faculty-g-kusuma",
        name: "Dr. G. Kusuma",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D302",
        locationId: "eee"
    },

    {
        id: "faculty-katari-deepthji",
        name: "Smt. Katari Deepthji",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D302",
        locationId: "eee"
    },

    {
        id: "faculty-p-udaya-bhanu",
        name: "Smt. P. Udaya Bhanu",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D302",
        locationId: "eee"
    },

    {
        id: "faculty-k-swetha",
        name: "Smt. K. Swetha",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D303",
        locationId: "eee"
    },

    {
        id: "faculty-swetha-monica",
        name: "Smt. I. Swetha Monica",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D303",
        locationId: "eee"
    },

    {
        id: "faculty-nva-bhavani",
        name: "Smt. N.V.A. Bhavani",
        designation: "Faculty",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D303",
        locationId: "eee"
    },

    {
        id: "faculty-jssl-bharani",
        name: "Smt. J.S.S.L. Bharani",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D303",
        locationId: "eee"
    },

    {
        id: "faculty-s-rajashekar-reddy",
        name: "Sri. S. Rajashekar Reddy",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D305",
        locationId: "eee"
    },

    {
        id: "faculty-e-suresh",
        name: "Sri. E. Suresh",
        designation: "Faculty",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D305",
        locationId: "eee"
    },

    {
        id: "faculty-da-koteswara-rao",
        name: "Sri. D.A. Koteswara Rao",
        designation: "Faculty",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D305",
        locationId: "eee"
    },

    {
        id: "faculty-bsss-santhosh",
        name: "Sri. B.S.S. Santhosh",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D306",
        locationId: "eee"
    },

    {
        id: "faculty-mec-vidyasagar",
        name: "Sri. M.E.C. Vidyasagar",
        designation: "Faculty",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D306",
        locationId: "eee"
    },

    {
        id: "faculty-g-syamnaresh",
        name: "Dr. G. Syamnaresh",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D311",
        locationId: "eee"
    },

    {
        id: "faculty-ah-kumar-raju",
        name: "Sri. A.H. Kumar Raju",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D311",
        locationId: "eee"
    },

    {
        id: "faculty-ghk-varma",
        name: "Dr. G.H.K. Varma",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D312",
        locationId: "eee"
    },

    {
        id: "faculty-v-srinivas",
        name: "Sri. V. Srinivas",
        designation: "Faculty",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Second Floor",
        room: "D312",
        locationId: "eee"
    },

    {
        id: "faculty-p-sailesh-babu",
        name: "Sri. P. Sailesh Babu",
        designation: "Faculty",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Third Floor",
        room: "D402",
        locationId: "eee"
    },

    {
        id: "faculty-pspr-swamy",
        name: "Sri. P.S.P.R. Swamy",
        designation: "Faculty",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Third Floor",
        room: "D402",
        locationId: "eee"
    },

    {
        id: "faculty-k-pavan-kumar",
        name: "Sri. K. Pavan Kumar",
        designation: "Assistant Professor",
        department: "Electrical & Electronics Engineering",
        block: "EEE Block",
        floor: "Third Floor",
        room: "D406",
        locationId: "eee"
    },


    // =========================
    // ADMINISTRATION
    // =========================

    {
        id: "faculty-vittal-ranga-raju",
        name: "Sri. S. Vittal Ranga Raju",
        designation: "Vice President",
        department: "Management",
        block: "Administrative Block",
        floor: "Ground Floor",
        room: "103",
        locationId: "admin"
    },

    {
        id: "faculty-principal-murali-krishnam-raju",
        name: "Dr. K. V. Murali Krishnam Raju",
        designation: "Principal",
        department: "Administration",
        block: "Administrative Block",
        floor: "Ground Floor",
        room: "106",
        locationId: "admin"
    },

    {
        id: "faculty-jagapathi-raju",
        name: "Dr. M. Jagapathi Raju",
        designation: "Director",
        department: "Administration",
        block: "Administrative Block",
        floor: "Ground Floor",
        room: "Room number not provided",
        locationId: "admin"
    },


    // =========================
    // SILVER JUBILEE
    // =========================

    {
        id: "faculty-krishnam-chaitanya",
        name: "Dr. R. Krishnam Chaitanya",
        designation: "Associate Professor",
        department: "Faculty",
        block: "Silver Jubilee",
        floor: "Ground Floor",
        room: "U105",
        locationId: "silver-jubilee"
    },

    {
        id: "faculty-knvs-varma",
        name: "Sri. K.N.V.S. Varma",
        designation: "Assistant Professor",
        department: "Faculty",
        block: "Silver Jubilee",
        floor: "Ground Floor",
        room: "U105",
        locationId: "silver-jubilee"
    },

    {
        id: "faculty-k-bala-sindhuri",
        name: "Dr. K. Bala Sindhuri",
        designation: "Associate Professor",
        department: "Innovation & Product Development",
        block: "Silver Jubilee",
        floor: "Ground Floor",
        room: "U104",
        locationId: "silver-jubilee"
    },

    {
        id: "faculty-bvssn-raju",
        name: "Dr. B.V.S.S.N. Raju",
        designation: "Professor",
        department: "Faculty",
        block: "Silver Jubilee",
        floor: "Ground Floor",
        room: "U103",
        locationId: "silver-jubilee"
    },

    {
        id: "faculty-t-venkata-narayana",
        name: "Sri. T. Venkata Narayana",
        designation: "Assistant Professor",
        department: "Faculty",
        block: "Silver Jubilee",
        floor: "Ground Floor",
        room: "U106",
        locationId: "silver-jubilee"
    }

];

const facultyFinderStyle = document.createElement("style");
facultyFinderStyle.textContent = `
    .faculty-finder-button { width:100%; margin-top:10px; padding:13px 16px; border:none; border-radius:12px;
        background:linear-gradient(135deg,#4f46e5,#6366f1); color:white; font-size:15px; font-weight:700; cursor:pointer;
        transition:transform 0.2s ease, box-shadow 0.2s ease; }
    .faculty-finder-button:hover { transform:translateY(-1px); box-shadow:0 8px 20px rgba(79,70,229,0.25); }
    .faculty-finder-button:active { transform:scale(0.98); }
    .faculty-overlay { position:fixed; inset:0; z-index:9999; display:none; align-items:center; justify-content:center;
        padding:18px; background:rgba(15,23,42,0.55); backdrop-filter:blur(5px); }
    .faculty-overlay.visible { display:flex; }
    .faculty-panel { width:min(520px,100%); max-height:88vh; overflow-y:auto; background:white; border-radius:20px;
        padding:20px; box-shadow:0 25px 70px rgba(0,0,0,0.25); }
    .faculty-panel-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:15px; }
    .faculty-panel-title { margin:0; font-size:21px; font-weight:800; color:#0f172a; }
    .faculty-close { width:38px; height:38px; border:none; border-radius:50%; background:#f1f5f9; font-size:20px; cursor:pointer; }
    .faculty-search { width:100%; box-sizing:border-box; padding:13px 15px; border:1px solid #cbd5e1; border-radius:12px;
        outline:none; font-size:15px; margin-bottom:14px; }
    .faculty-search:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.12); }
    .faculty-demo-notice { padding:11px 13px; margin-bottom:14px; border-radius:12px; background:#eef2ff; color:#3730a3; font-size:13px; line-height:1.45; }
    .faculty-results { display:flex; flex-direction:column; gap:10px; }
    .faculty-card { padding:15px; border:1px solid #e2e8f0; border-radius:15px; background:#ffffff; box-shadow:0 3px 12px rgba(15,23,42,0.05); }
    .faculty-card-name { font-size:16px; font-weight:800; color:#0f172a; margin-bottom:4px; }
    .faculty-card-designation { font-size:13px; color:#6366f1; font-weight:600; margin-bottom:9px; }
    .faculty-card-info { display:grid; gap:5px; font-size:13px; color:#475569; line-height:1.4; }
    .faculty-card-actions { display:flex; gap:8px; margin-top:13px; flex-wrap:wrap; }
    .faculty-action { flex:1; min-width:130px; padding:10px 12px; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; }
    .faculty-map-button { background:#eef2ff; color:#3730a3; }
    .faculty-route-button { background:#4f46e5; color:white; }
    .faculty-empty { padding:25px 10px; text-align:center; color:#64748b; font-size:14px; }
    @media (max-width:600px) {
        .faculty-overlay { padding:10px; align-items:flex-end; }
        .faculty-panel { width:100%; max-height:92vh; border-radius:20px 20px 0 0; padding:17px; }
        .faculty-panel-title { font-size:19px; }
        .faculty-action { min-width:100%; }
    }
`;
document.head.appendChild(facultyFinderStyle);

const facultyFinderButton = document.createElement("button");
facultyFinderButton.className = "faculty-finder-button";
facultyFinderButton.type = "button";
facultyFinderButton.innerHTML = "👨‍🏫 Find Faculty";

const possibleContainers = [
    document.querySelector(".controls"),
    document.querySelector(".control-panel"),
    document.querySelector(".search-area"),
    document.querySelector("#destinationSearch")?.parentElement
];

let facultyButtonInserted = false;
for (const container of possibleContainers) {
    if (container && !facultyButtonInserted) { container.appendChild(facultyFinderButton); facultyButtonInserted = true; }
}
if (!facultyButtonInserted) document.body.appendChild(facultyFinderButton);

const facultyOverlay = document.createElement("div");
facultyOverlay.className = "faculty-overlay";
facultyOverlay.innerHTML = `
    <div class="faculty-panel" role="dialog" aria-modal="true" aria-label="Faculty Finder">
        <div class="faculty-panel-header">
            <h2 class="faculty-panel-title">👨‍🏫 Faculty Finder</h2>
            <button type="button" class="faculty-close" aria-label="Close Faculty Finder">×</button>
        </div>
        <div class="faculty-demo-notice">🚧 <strong>Prototype Demo</strong><br>
            Faculty information shown here is currently static. Live faculty availability or location sharing
            will only be considered after college approval.</div>
        <input type="search" class="faculty-search" placeholder="Search faculty name..." autocomplete="off">
        <div class="faculty-results"></div>
    </div>
`;
document.body.appendChild(facultyOverlay);

const facultySearch = facultyOverlay.querySelector(".faculty-search");
const facultyResults = facultyOverlay.querySelector(".faculty-results");
const facultyClose = facultyOverlay.querySelector(".faculty-close");

function renderFacultyResults(query = "") {
    const cleanQuery = query.toLowerCase().trim();
    const matches = facultyDirectory.filter(faculty => {
        const searchableText = [faculty.name, faculty.designation, faculty.department, faculty.block, faculty.floor, faculty.room].join(" ").toLowerCase();
        return searchableText.includes(cleanQuery);
    });

    facultyResults.innerHTML = "";

    if (matches.length === 0) {
        facultyResults.innerHTML = `<div class="faculty-empty">🔍 No faculty found.<br>Try another name or department.</div>`;
        return;
    }

    matches.forEach(faculty => {
        const card = document.createElement("div");
        card.className = "faculty-card";
        card.innerHTML = `
            <div class="faculty-card-name">👨‍🏫 ${faculty.name}</div>
            <div class="faculty-card-designation">${faculty.designation}</div>
            <div class="faculty-card-info">
                <div>📚 ${faculty.department}</div>
                <div>🏢 ${faculty.block}</div>
                <div>🏬 ${faculty.floor}</div>
                <div>🚪 Room: ${faculty.room}</div>
            </div>
            <div class="faculty-card-actions">
                <button type="button" class="faculty-action faculty-map-button">📍 Show on Map</button>
                <button type="button" class="faculty-action faculty-route-button">🧭 Navigate</button>
            </div>
        `;

        card.querySelector(".faculty-map-button").addEventListener("click", function () { showFacultyOnMap(faculty); });
        card.querySelector(".faculty-route-button").addEventListener("click", function () { navigateToFaculty(faculty); });

        facultyResults.appendChild(card);
    });
}

function showFacultyOnMap(faculty) {
    const location = campusLocations[faculty.locationId];
    if (!location) { statusMessage.textContent = "Faculty location is not available."; return; }

    const position = getLocationPosition(location);
    if (!position) { statusMessage.textContent = "Unable to locate the faculty block."; return; }

    facultyOverlay.classList.remove("visible");
    map.flyTo(position, 19, { duration: 0.8 });
    if (markers[faculty.locationId]) markers[faculty.locationId].openPopup();

    statusMessage.innerHTML = `👨‍🏫 <strong>${faculty.name}</strong><br>📍 ${faculty.block} · ${faculty.floor} · Room ${faculty.room}
        <br>ℹ️ Exact room navigation will be added after campus verification.`;
}

function navigateToFaculty(faculty) {
    facultyOverlay.classList.remove("visible");
    if (destinationSelect) destinationSelect.value = faculty.locationId;
    if (typeof buildLiveRoute === "function") buildLiveRoute(faculty.locationId);

    statusMessage.innerHTML = `👨‍🏫 Navigating to <strong>${faculty.name}</strong><br>📍 ${faculty.block} · ${faculty.floor} · Room ${faculty.room}
        <br>ℹ️ Route currently ends at the ${faculty.block} location.`;
}

facultyFinderButton.addEventListener("click", function () {
    facultyOverlay.classList.add("visible");
    facultySearch.value = "";
    renderFacultyResults();
    setTimeout(function () { facultySearch.focus(); }, 100);
});

facultySearch.addEventListener("input", function () { renderFacultyResults(facultySearch.value); });
facultyClose.addEventListener("click", function () { facultyOverlay.classList.remove("visible"); });
facultyOverlay.addEventListener("click", function (event) { if (event.target === facultyOverlay) facultyOverlay.classList.remove("visible"); });
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        facultyOverlay.classList.remove("visible");
    }
});
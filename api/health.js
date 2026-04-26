/**
 * /api/health.js — API info & health check
 */

export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    name: "whatismyzodiac Astro API",
    version: "1.0.0",
    engine: "Swiss Ephemeris via sweph (Moshier)",
    endpoints: {
      "GET /api/health":     "This info",
      "GET /api/birthchart": "Full natal chart — params: year,month,day,hour,minute,lat,lng,utcOffset,houseSystem",
      "POST /api/synastry":  "Synastry between two people — body: { personA:{...}, personB:{...} }"
    },
    houseSystems: {
      "W": "Whole Sign (default)",
      "P": "Placidus",
      "K": "Koch",
      "R": "Regiomontanus",
      "B": "Alcabitius",
      "C": "Campanus",
      "E": "Equal"
    },
    precision: "Moshier semi-analytical (~0.1° — sufficient for astrology)",
    note: "utcOffset is hours from UTC (e.g. Istanbul=+3, New York=-5)"
  });
}

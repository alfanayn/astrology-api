/**
 * /api/transits.js
 * GET /api/transits
 * GET /api/transits?year=2025&month=5&day=5   (optional — defaults to UTC now)
 *
 * Returns all planet positions for a given date/time.
 * No lat/lng needed — planetary longitudes are geocentric (same for all locations).
 * Houses are NOT calculated (no birth location) — just raw planet positions + aspects.
 */

const { calcBirthChart } = require("../lib/astro-core");

const ASPECT_DEFS = [
  { name:"Conjunction", angle:0,   orb:8, nature:"neutral",    symbol:"☌" },
  { name:"Opposition",  angle:180, orb:8, nature:"tense",      symbol:"☍" },
  { name:"Trine",       angle:120, orb:8, nature:"harmonious", symbol:"△" },
  { name:"Square",      angle:90,  orb:7, nature:"tense",      symbol:"□" },
  { name:"Sextile",     angle:60,  orb:6, nature:"harmonious", symbol:"⚹" },
  { name:"Quincunx",    angle:150, orb:3, nature:"tense",      symbol:"⚻" },
];

const PERSONAL = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"];

function angleBetween(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function findAspects(planets) {
  const ps = planets.filter(p => !p.error && PERSONAL.includes(p.name));
  const results = [];

  for (let i = 0; i < ps.length; i++) {
    for (let j = i + 1; j < ps.length; j++) {
      const diff = angleBetween(ps[i].totalDeg, ps[j].totalDeg);
      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= asp.orb) {
          results.push({
            p1:       ps[i].name,
            p2:       ps[j].name,
            aspect:   { ...asp, orb: +orb.toFixed(2), exactness: +(asp.orb - orb).toFixed(2) }
          });
          break;
        }
      }
    }
  }

  return results.sort((a, b) => b.aspect.exactness - a.aspect.exactness);
}

// Moon phase: angle between Moon and Sun
function moonPhase(moonLon, sunLon) {
  const diff = ((moonLon - sunLon) % 360 + 360) % 360;
  const illumination = Math.round(50 - 50 * Math.cos(diff * Math.PI / 180));
  let phase, emoji;
  if      (diff < 22.5)  { phase = "New Moon";        emoji = "🌑" }
  else if (diff < 67.5)  { phase = "Waxing Crescent"; emoji = "🌒" }
  else if (diff < 112.5) { phase = "First Quarter";   emoji = "🌓" }
  else if (diff < 157.5) { phase = "Waxing Gibbous";  emoji = "🌔" }
  else if (diff < 202.5) { phase = "Full Moon";        emoji = "🌕" }
  else if (diff < 247.5) { phase = "Waning Gibbous";  emoji = "🌖" }
  else if (diff < 292.5) { phase = "Last Quarter";    emoji = "🌗" }
  else if (diff < 337.5) { phase = "Waning Crescent"; emoji = "🌘" }
  else                   { phase = "New Moon";        emoji = "🌑" }
  return { phase, emoji, illumination, angleDiff: +diff.toFixed(1) };
}

export default function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  // Parse optional date — default to UTC now
  const now = new Date();
  const q   = req.query;

  const year   = parseInt(q.year)   || now.getUTCFullYear();
  const month  = parseInt(q.month)  || now.getUTCMonth() + 1;
  const day    = parseInt(q.day)    || now.getUTCDate();
  const hour   = parseInt(q.hour)   ?? now.getUTCHours();
  const minute = parseInt(q.minute) ?? now.getUTCMinutes();

  // Validate
  if (month < 1 || month > 12) return res.status(400).json({ error: "month 1-12" });
  if (day   < 1 || day   > 31) return res.status(400).json({ error: "day 1-31" });

  try {
    // lat=0,lng=0,utcOffset=0 → geocentric, UTC
    // Houses will be calculated but ignored — we only want planet longitudes
    const chart = calcBirthChart({
      year, month, day, hour, minute,
      lat: 0, lng: 0, utcOffset: 0,
      houseSystem: "W"
    });

    const planets = chart.planets.filter(p => !p.error);
    const aspects = findAspects(planets);

    const moon = planets.find(p => p.name === "Moon");
    const sun  = planets.find(p => p.name === "Sun");
    const moonInfo = moon && sun ? moonPhase(moon.totalDeg, sun.totalDeg) : null;

    const retrogradeCount = planets.filter(p => p.retrograde).length;

    return res.status(200).json({
      ok: true,
      date: { year, month, day, hour, minute, utc: true },
      planets,
      aspects,
      moon: moonInfo,
      summary: {
        retrogradeCount,
        retrogradeNames: planets.filter(p => p.retrograde).map(p => p.name),
        aspectCount: aspects.length,
        harmonious: aspects.filter(a => a.aspect.nature === "harmonious").length,
        tense:      aspects.filter(a => a.aspect.nature === "tense").length,
        engine: chart.meta.engine
      }
    });

  } catch (err) {
    console.error("transits error:", err);
    return res.status(500).json({ error: "Calculation failed", details: err.message });
  }
}

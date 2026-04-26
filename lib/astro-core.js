/**
 * astro-core.js — Swiss Ephemeris wrapper (sweph npm package)
 * Uses Moshier flag — no .se1 data files required — Vercel compatible.
 *
 * Tested API:
 *   sweph.julday(y,m,d,h, SE_GREG_CAL) → float
 *   sweph.calc_ut(jd, bodyId, flags) → { flag, error, data:[lon,lat,dist,lonSpd,latSpd,distSpd] }
 *   sweph.houses(jd, lat, lng, hsys) → { flag, data:{ houses:[12 cusps], points:[asc,mc,...] } }
 */

const sweph = require("sweph");
const C = sweph.constants;

const BASE_FLAG = C.SEFLG_MOSEPH | C.SEFLG_SPEED;

const PLANETS = [
  { id: C.SE_SUN,       name: "Sun"       },
  { id: C.SE_MOON,      name: "Moon"      },
  { id: C.SE_MERCURY,   name: "Mercury"   },
  { id: C.SE_VENUS,     name: "Venus"     },
  { id: C.SE_MARS,      name: "Mars"      },
  { id: C.SE_JUPITER,   name: "Jupiter"   },
  { id: C.SE_SATURN,    name: "Saturn"    },
  { id: C.SE_URANUS,    name: "Uranus"    },
  { id: C.SE_NEPTUNE,   name: "Neptune"   },
  { id: C.SE_PLUTO,     name: "Pluto"     },
  { id: C.SE_MEAN_NODE, name: "NorthNode" },
  { id: C.SE_MEAN_APOG, name: "Lilith" },
];

const ZODIAC_SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const ZODIAC_GLYPHS = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓"
};

const HOUSE_THEMES = [
  "","Self & Identity","Money & Values","Communication","Home & Roots",
  "Creativity & Romance","Health & Service","Partnerships","Transformation",
  "Philosophy & Travel","Career & Status","Friendships & Goals","Spirituality & Hidden"
];

function norm(deg) { return ((deg % 360) + 360) % 360; }

function degToPosition(dec) {
  const d = norm(dec);
  const signIdx = Math.floor(d / 30);
  const within  = d - signIdx * 30;
  const degree  = Math.floor(within);
  const mf      = (within - degree) * 60;
  const minute  = Math.floor(mf);
  const second  = Math.floor((mf - minute) * 60);
  const sign    = ZODIAC_SIGNS[signIdx];
  return {
    sign, glyph: ZODIAC_GLYPHS[sign], signIdx, degree, minute, second,
    totalDeg: d,
    formatted: `${degree}°${String(minute).padStart(2,"0")}'${String(second).padStart(2,"0")}" ${sign}`
  };
}

function localToUTC(year, month, day, hour, minute, utcOffset) {
  let h = hour + minute / 60 - utcOffset;
  let d = day;
  if (h < 0)   { h += 24; d -= 1; }
  if (h >= 24) { h -= 24; d += 1; }
  return { year, month, day: d, hourUTC: h };
}

function calcBirthChart(params) {
  const { year, month, day, hour, minute, lat, lng, utcOffset, houseSystem = "W" } = params;

  const utc  = localToUTC(year, month, day, hour, minute, utcOffset);
  const jd   = sweph.julday(utc.year, utc.month, utc.day, utc.hourUTC, C.SE_GREG_CAL);
  const hsys = (houseSystem || "W").charAt(0).toUpperCase();

  const houseRes = sweph.houses(jd, lat, lng, hsys);
  if (houseRes.flag < 0) throw new Error("House calc failed flag=" + houseRes.flag);

  const ascDeg = houseRes.data.points[0];
  const mcDeg  = houseRes.data.points[1];
  const ascPos = degToPosition(ascDeg);
  const mcPos  = degToPosition(mcDeg);

  const houseCusps = houseRes.data.houses.map((deg, i) => ({
    house: i + 1, cusp: degToPosition(deg), theme: HOUSE_THEMES[i + 1]
  }));

  const wholeSignHouses = Array.from({ length: 12 }, (_, i) => {
    const idx = (ascPos.signIdx + i) % 12;
    return { house: i+1, sign: ZODIAC_SIGNS[idx], glyph: ZODIAC_GLYPHS[ZODIAC_SIGNS[idx]], theme: HOUSE_THEMES[i+1], startDeg: idx*30 };
  });

  const planets = [];
  for (const planet of PLANETS) {
    const res = sweph.calc_ut(jd, planet.id, BASE_FLAG);
    if (res.flag < 0 || res.error) { planets.push({ name: planet.name, error: res.error||"err" }); continue; }
    const [longitude,,,lonSpeed] = res.data;
    const pos = degToPosition(longitude);
    const retrograde = lonSpeed < 0;
    planets.push({
      name: planet.name, longitude, ...pos, retrograde,
      retrogradeSymbol: retrograde ? "℞" : "",
      houseWhole: ((pos.signIdx - ascPos.signIdx + 12) % 12) + 1,
      speed: +lonSpeed.toFixed(6)
    });
  }

  const sun  = planets.find(p => p.name === "Sun");
  const moon = planets.find(p => p.name === "Moon");

  return {
    meta: {
      julianDay: jd,
      utcDateTime: `${utc.year}-${String(utc.month).padStart(2,"0")}-${String(utc.day).padStart(2,"0")} ${String(Math.floor(utc.hourUTC)).padStart(2,"0")}:${String(minute).padStart(2,"0")} UTC`,
      houseSystem: { W:"Whole Sign", P:"Placidus", K:"Koch", R:"Regiomontanus", E:"Equal" }[hsys] || hsys,
      engine: "Swiss Ephemeris — Moshier"
    },
    bigThree: {
      sun:       sun  ? { sign:sun.sign,      glyph:sun.glyph,      formatted:sun.formatted }      : null,
      moon:      moon ? { sign:moon.sign,     glyph:moon.glyph,     formatted:moon.formatted }     : null,
      ascendant: { sign:ascPos.sign, glyph:ascPos.glyph, formatted:ascPos.formatted, totalDeg:ascDeg }
    },
    ascendant: ascPos, midheaven: mcPos, planets,
    houses: { wholeSign: wholeSignHouses, cusps: houseCusps }
  };
}

module.exports = { calcBirthChart, degToPosition, ZODIAC_SIGNS, ZODIAC_GLYPHS, HOUSE_THEMES };

/**
 * /api/synastry.js
 * POST /api/synastry
 * Body: { personA: { year,month,day,hour,minute,lat,lng,utcOffset }, personB: {...} }
 */

const { calcBirthChart } = require("../lib/astro-core");

const ASPECTS = [
  { name:"Conjunction", angle:0,   orb:8, nature:"neutral",    symbol:"☌" },
  { name:"Opposition",  angle:180, orb:8, nature:"tense",      symbol:"☍" },
  { name:"Trine",       angle:120, orb:8, nature:"harmonious", symbol:"△" },
  { name:"Square",      angle:90,  orb:7, nature:"tense",      symbol:"□" },
  { name:"Sextile",     angle:60,  orb:6, nature:"harmonious", symbol:"⚹" },
  { name:"Quincunx",    angle:150, orb:3, nature:"tense",      symbol:"⚻" },
];

// Only personal/social planets for scoring — outer planets move too slowly
// to be meaningfully "personal" in synastry scoring
const CORE    = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"];
const PERSONAL = ["Sun","Moon","Mercury","Venus","Mars"];

// Aspect weights for scoring
const ASPECT_WEIGHTS = {
  Trine:       3,   // strong harmonious
  Sextile:     2,   // mild harmonious
  Conjunction: 1,   // neutral (can go either way)
  Square:     -2,   // tense
  Opposition: -2,   // tense
  Quincunx:  -1,   // mild tense
};

// Planet importance multiplier
function planetWeight(name) {
  if (["Sun","Moon"].includes(name))              return 3;
  if (["Venus","Mars"].includes(name))            return 2;
  if (["Mercury","Jupiter","Saturn"].includes(name)) return 1;
  return 0.5; // outer planets
}

function angleBetween(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function findAspect(d1, d2) {
  const angle = angleBetween(d1, d2);
  for (const asp of ASPECTS) {
    const diff = Math.abs(angle - asp.angle);
    if (diff <= asp.orb) {
      return { ...asp, orb: +diff.toFixed(2), exactness: +(asp.orb - diff).toFixed(2) };
    }
  }
  return null;
}

/**
 * Score: weighted ratio of harmonious vs tense aspects among ALL aspects.
 * Range: 0–100. Neutral aspects (conjunctions) contribute mildly positive.
 *
 * Formula:
 *   rawScore = Σ (aspectWeight × planetWeightA × planetWeightB × exactnessBonus)
 *   Normalise into 0–100 relative to the theoretical max/min for this chart.
 */
function calcScore(aspects) {
  if (!aspects.length) return 50;

  let weighted = 0;
  let maxPossible = 0;

  for (const a of aspects) {
    const pw  = planetWeight(a.planetA) * planetWeight(a.planetB);
    const aw  = ASPECT_WEIGHTS[a.aspect.name] ?? 0;
    // exactness bonus: 0→1 (most exact = 1, barely in orb = 0)
    const ex  = a.aspect.exactness / a.aspect.orb;
    const contribution = aw * pw * (0.7 + 0.3 * ex);
    weighted += contribution;
    // track max possible magnitude (for normalisation)
    maxPossible += Math.abs(ASPECT_WEIGHTS.Trine) * pw;
  }

  // Normalise: weighted is in [-maxPossible, +maxPossible]
  // Map to [0, 100], centred at 50
  if (maxPossible === 0) return 50;
  const ratio = weighted / maxPossible;          // -1 to +1
  const score = Math.round(50 + ratio * 50);     // 0 to 100
  return Math.min(100, Math.max(0, score));
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error:"POST required" });

  const { personA, personB } = req.body || {};
  if (!personA || !personB) {
    return res.status(400).json({
      error: "Body must contain personA and personB",
      example: {
        personA: { year:1990,month:5,day:15,hour:14,minute:30,lat:41.01,lng:28.98,utcOffset:3 },
        personB: { year:1992,month:8,day:22,hour:9, minute:15,lat:41.01,lng:28.98,utcOffset:3 }
      }
    });
  }

  try {
    const chartA = calcBirthChart({ houseSystem:"W", ...personA });
    const chartB = calcBirthChart({ houseSystem:"W", ...personB });

    const aspects = [];
    for (const pA of chartA.planets.filter(p => !p.error)) {
      for (const pB of chartB.planets.filter(p => !p.error)) {
        const asp = findAspect(pA.totalDeg, pB.totalDeg);
        if (!asp) continue;
        aspects.push({
          planetA:     pA.name,
          signA:       pA.sign,
          planetB:     pB.name,
          signB:       pB.sign,
          aspect:      asp,
          isCorePlanet: CORE.includes(pA.name) && CORE.includes(pB.name),
          isPersonal:   PERSONAL.includes(pA.name) && PERSONAL.includes(pB.name),
          description: `${pA.name} ${pA.sign} ${asp.symbol} ${pB.name} ${pB.sign}`
        });
      }
    }

    // Sort: core + exact first
    aspects.sort((a, b) => {
      const coreA = a.isCorePlanet ? 1 : 0;
      const coreB = b.isCorePlanet ? 1 : 0;
      if (coreB !== coreA) return coreB - coreA;
      return b.aspect.exactness - a.aspect.exactness;
    });

    const score     = calcScore(aspects);
    const harmonious = aspects.filter(a => a.aspect.nature === "harmonious").length;
    const tense      = aspects.filter(a => a.aspect.nature === "tense").length;
    const neutral    = aspects.length - harmonious - tense;

    const verdict =
      score >= 75 ? "Strong Compatibility" :
      score >= 58 ? "Good Compatibility" :
      score >= 42 ? "Moderate Compatibility" :
      score >= 25 ? "Challenging but Transformative" :
                    "Growth-Oriented Connection";

    return res.status(200).json({
      ok: true,
      synastry: {
        personA: chartA.bigThree,
        personB: chartB.bigThree,
        aspects,
        summary: {
          total: aspects.length,
          harmonious,
          tense,
          neutral,
          compatibilityScore: score,
          verdict
        }
      }
    });

  } catch(err) {
    console.error("synastry error:", err);
    return res.status(500).json({ error:"Calculation failed", details: err.message });
  }
}

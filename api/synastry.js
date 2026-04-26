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

const CORE = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"];

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

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error:"POST required" });

  const { personA, personB } = req.body || {};
  if (!personA || !personB) {
    return res.status(400).json({
      error:"Body must contain personA and personB",
      example: {
        personA:{ year:1990,month:5,day:15,hour:14,minute:30,lat:41.01,lng:28.98,utcOffset:3 },
        personB:{ year:1992,month:8,day:22,hour:9, minute:15,lat:41.01,lng:28.98,utcOffset:3 }
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
          planetA: pA.name, signA: pA.sign,
          planetB: pB.name, signB: pB.sign,
          aspect: asp,
          isCorePlanet: CORE.includes(pA.name) && CORE.includes(pB.name),
          description: `${pA.name} ${pA.sign} ${asp.symbol} ${pB.name} ${pB.sign}`
        });
      }
    }

    aspects.sort((a,b) => b.aspect.exactness - a.aspect.exactness);

    let score = 50;
    for (const a of aspects) {
      const w = a.isCorePlanet ? 2 : 1;
      if (a.aspect.nature === "harmonious") score += 5 * w;
      if (a.aspect.nature === "tense")      score -= 3 * w;
      if (a.aspect.exactness > a.aspect.orb * 0.8) score += 2 * w;
    }
    score = Math.min(100, Math.max(0, Math.round(score)));

    const harmonious = aspects.filter(a => a.aspect.nature === "harmonious").length;
    const tense      = aspects.filter(a => a.aspect.nature === "tense").length;

    return res.status(200).json({
      ok: true,
      synastry: {
        personA: chartA.bigThree,
        personB: chartB.bigThree,
        aspects,
        summary: {
          total: aspects.length,
          harmonious, tense,
          neutral: aspects.length - harmonious - tense,
          compatibilityScore: score,
          verdict: score>=70 ? "Strong Compatibility" : score>=50 ? "Moderate Compatibility" : "Challenging but Growth-Oriented"
        }
      }
    });
  } catch(err) {
    console.error("synastry error:", err);
    return res.status(500).json({ error:"Calculation failed", details: err.message });
  }
}

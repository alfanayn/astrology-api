/**
 * /api/birthchart.js
 * GET  /api/birthchart?year=1990&month=5&day=15&hour=14&minute=30&lat=41.01&lng=28.98&utcOffset=3&houseSystem=W
 * POST /api/birthchart  { year,month,day,hour,minute,lat,lng,utcOffset,houseSystem }
 */

const { calcBirthChart } = require("../lib/astro-core");

export default function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  const raw = req.method === "POST" ? req.body : req.query;

  const required = ["year","month","day","hour","minute","lat","lng","utcOffset"];
  const missing  = required.filter(k => raw[k] === undefined || raw[k] === "");
  if (missing.length) {
    return res.status(400).json({
      error:"Missing required parameters", missing,
      example:"?year=1990&month=5&day=15&hour=14&minute=30&lat=41.01&lng=28.98&utcOffset=3"
    });
  }

  const p = {
    year:       parseInt(raw.year),
    month:      parseInt(raw.month),
    day:        parseInt(raw.day),
    hour:       parseInt(raw.hour),
    minute:     parseInt(raw.minute),
    lat:        parseFloat(raw.lat),
    lng:        parseFloat(raw.lng),
    utcOffset:  parseFloat(raw.utcOffset),
    houseSystem:(raw.houseSystem || "W").toUpperCase()
  };

  if (p.month<1||p.month>12) return res.status(400).json({error:"month 1-12"});
  if (p.day<1||p.day>31)     return res.status(400).json({error:"day 1-31"});
  if (p.hour<0||p.hour>23)   return res.status(400).json({error:"hour 0-23"});
  if (p.minute<0||p.minute>59) return res.status(400).json({error:"minute 0-59"});
  if (p.lat<-90||p.lat>90)   return res.status(400).json({error:"lat -90..90"});
  if (p.lng<-180||p.lng>180) return res.status(400).json({error:"lng -180..180"});

  try {
    const chart = calcBirthChart(p);
    return res.status(200).json({ ok:true, chart });
  } catch(err) {
    console.error("birthchart error:", err);
    return res.status(500).json({ error:"Calculation failed", details:err.message });
  }
}

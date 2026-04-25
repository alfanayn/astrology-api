const swisseph = require('swisseph');

export default function handler(req, res) {
    const { year, month, day, hour, min, lat, lng } = req.query;

    if (!year) return res.status(400).json({ error: "Eksik parametre!" });

    const time = parseFloat(hour || 12) + parseFloat(min || 0) / 60;
    
    const julianDay = swisseph.swe_julday(
        parseInt(year), parseInt(month), parseInt(day), 
        time, 
        swisseph.SE_GREG_CAL
    );

    const getPos = (id) => {
        const p = swisseph.swe_calc_ut(julianDay, id, 0);
        return { lon: p.longitude, lat: p.latitude };
    };

    const data = {
        sun: getPos(swisseph.SE_SUN),
        moon: getPos(swisseph.SE_MOON),
        venus: getPos(swisseph.SE_VENUS),
        mars: getPos(swisseph.SE_MARS),
        houses: swisseph.swe_houses(julianDay, parseFloat(lat), parseFloat(lng), 'W')
    };

    res.status(200).json(data);
}
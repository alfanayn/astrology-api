const swisseph = require('sweph');

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { year, month, day, hour, min, lat, lng } = req.query;

        if (!year || !month || !day) {
            return res.status(400).json({ error: "Eksik parametre!" });
        }

        const time = parseFloat(hour || 12) + parseFloat(min || 0) / 60;
        
        const julianDay = swisseph.swe_julday(
            parseInt(year), parseInt(month), parseInt(day), 
            time, 
            swisseph.SE_GREG_CAL
        );

        const getPos = (id) => {
            const result = swisseph.swe_calc_ut(julianDay, id, swisseph.SEFLG_SPEED);
            return { lon: result.longitude, lat: result.latitude };
        };

        const housesData = swisseph.swe_houses(julianDay, parseFloat(lat), parseFloat(lng), 'W');
        
        const data = {
            sun: getPos(swisseph.SE_SUN),
            moon: getPos(swisseph.SE_MOON),
            venus: getPos(swisseph.SE_VENUS),
            mars: getPos(swisseph.SE_MARS),
            houses: {
                house: housesData.house 
            }
        };

        return res.status(200).json(data);
    } catch (err) {
        console.error("API Hatası:", err);
        return res.status(500).json({ error: "Hesaplama sırasında hata oluştu", details: err.message });
    }
}
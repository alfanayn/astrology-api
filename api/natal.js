import swisseph from 'sweph';

export default async function handler(req, res) {
    // CORS Ayarları
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { year, month, day, hour, min, lat, lng } = req.query;

        if (!year || !month || !day || !lat || !lng) {
            return res.status(400).json({ error: "Eksik parametreler (tarih veya lokasyon)!" });
        }

        const time = parseFloat(hour || 12) + parseFloat(min || 0) / 60;
        
        // Julian Day
        const jd = swisseph.swe_julday(
            parseInt(year), parseInt(month), parseInt(day), 
            time, 
            swisseph.SE_GREG_CAL
        );

        // Evler (Whole Sign)
        const housesData = swisseph.swe_houses(jd, parseFloat(lat), parseFloat(lng), 'W');

        // Yanıt
        const data = {
            houses: {
                house: housesData.house
            },
            ascendant: housesData.ascendant
        };

        return res.status(200).json(data);
    } catch (err) {
        console.error("API Error:", err);
        return res.status(500).json({ error: "Server Error", details: err.message });
    }
}
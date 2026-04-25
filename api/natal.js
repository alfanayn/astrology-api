import { swe_julday, swe_houses, SE_GREG_CAL } from 'sweph';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { year, month, day, hour, min, lat, lng } = req.query;

        if (!year || !month || !day || !lat || !lng) {
            return res.status(400).json({ error: "Tarih veya konum eksik!" });
        }

        const time = parseFloat(hour || 12) + parseFloat(min || 0) / 60;
        
        // Parantez içindeki fonksiyon isimlerini kütüphanenin istediği formatta güncelledik
        const jd = swe_julday(
            parseInt(year), parseInt(month), parseInt(day), 
            time, 
            SE_GREG_CAL
        );

        const housesData = swe_houses(jd, parseFloat(lat), parseFloat(lng), 'W');

        return res.status(200).json({
            houses: {
                house: housesData.house
            },
            ascendant: housesData.ascendant
        });
    } catch (err) {
        console.error("API Error:", err);
        return res.status(500).json({ error: "Server Error", details: err.message });
    }
}
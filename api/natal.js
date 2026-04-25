import { swe_julday, swe_houses, swe_calc_ut, SE_GREG_CAL, SE_SUN, SE_MOON, SE_VENUS, SE_MARS, SEFLG_SPEED } from 'sweph';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { year, month, day, hour, min, lat, lng } = req.query;

        // Tarih ve saat verilerini sayıya çevir
        const y = parseInt(year);
        const m = parseInt(month);
        const d = parseInt(day);
        const h = parseFloat(hour || 12);
        const mn = parseFloat(min || 0);
        const lt = parseFloat(lat);
        const lg = parseFloat(lng);

        // 1. Julian Day Hesapla
        const decimalHour = h + (mn / 60);
        const jd = swe_julday(y, m, d, decimalHour, SE_GREG_CAL);

        // 2. Gezegenleri Hesapla (Derece cinsinden boylam: result.longitude)
        const sun = swe_calc_ut(jd, SE_SUN, SEFLG_SPEED);
        const moon = swe_calc_ut(jd, SE_MOON, SEFLG_SPEED);
        const venus = swe_calc_ut(jd, SE_VENUS, SEFLG_SPEED);
        const mars = swe_calc_ut(jd, SE_MARS, SEFLG_SPEED);

        // 3. Evleri Hesapla (Whole Sign - 'W')
        const housesData = swe_houses(jd, lt, lg, 'W');

        // Yanıtı tertemiz gönder
        return res.status(200).json({
            sun: sun.longitude,
            moon: moon.longitude,
            venus: venus.longitude,
            mars: mars.longitude,
            houses: housesData.house, // 1-12 arası dizi
            ascendant: housesData.ascendant
        });
    } catch (err) {
        return res.status(500).json({ error: "Hesaplama Hatası", details: err.message });
    }
}
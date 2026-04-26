# 🌌 astro-api — Swiss Ephemeris Backend for whatismyzodiac.com

Open-source astrology API powered by **Swiss Ephemeris** (Moshier engine), deployable to **Vercel** for free.

## Features

- ✅ Real Swiss Ephemeris calculations (not hand-rolled math)
- ✅ Full birth chart: Sun, Moon, Ascendant + 10 planets + Chiron + North Node
- ✅ Multiple house systems: Whole Sign, Placidus, Koch, Regiomontanus, Equal
- ✅ Synastry API with aspect analysis and compatibility score
- ✅ Zero cost on Vercel free tier
- ✅ CORS open — use from any frontend
- ✅ No database needed

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | API info |
| GET | `/api/birthchart` | Full natal chart |
| POST | `/api/synastry` | Synastry between two people |

### GET /api/birthchart

```
GET /api/birthchart?year=1990&month=5&day=15&hour=14&minute=30&lat=41.01&lng=28.98&utcOffset=3&houseSystem=W
```

Parameters:
- `year`, `month`, `day` — birth date
- `hour`, `minute` — local birth time
- `lat`, `lng` — birth location (decimal degrees)
- `utcOffset` — hours from UTC (e.g. Istanbul=3, London=1, New York=-5)
- `houseSystem` — `W`=Whole Sign (default), `P`=Placidus, `K`=Koch, `R`=Regiomontanus, `E`=Equal

### POST /api/synastry

```json
{
  "personA": { "year":1990, "month":5, "day":15, "hour":14, "minute":30, "lat":41.01, "lng":28.98, "utcOffset":3 },
  "personB": { "year":1992, "month":8, "day":22, "hour":9,  "minute":15, "lat":41.01, "lng":28.98, "utcOffset":3 }
}
```

## Deploy to Vercel (Free)

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/astro-api.git
cd astro-api
npm install
```

### 2. Deploy

```bash
npm install -g vercel
vercel
```

That's it. Vercel auto-detects the `/api` folder and deploys serverless functions.

### 3. Use from whatismyzodiac.com

```js
const response = await fetch('https://your-astro-api.vercel.app/api/birthchart?...');
const { chart } = await response.json();
```

## Why Moshier (no .se1 files)?

Vercel serverless functions have a ~50MB bundle size limit. Swiss Ephemeris `.se1` data files are 90MB+. The Moshier semi-analytical engine built into `sweph` requires **zero data files**, deploys instantly, and achieves ~0.1° accuracy — well within the tolerance for any astrological application.

For sub-arcsecond precision (astronomy-grade), you would need a self-hosted server with the `.se1` files.

## Architecture

```
/api/birthchart.js    — Vercel serverless function
/api/synastry.js      — Vercel serverless function  
/api/health.js        — Health check
/lib/astro-core.js    — Swiss Ephemeris wrapper
/public/index.html    — Demo UI
vercel.json           — Vercel config (CORS, routing)
package.json          — Node 20, sweph dependency
```

## Future Tools (same API, same format)

- `/api/transit` — Current planetary transits to natal chart
- `/api/solar-return` — Solar return chart for a year
- `/api/composite` — Composite chart for two people
- `/api/progressions` — Secondary progressions

All future endpoints share the same `calcBirthChart` core in `lib/astro-core.js`.

## License

GPL-3.0
Maded by alfanayn-

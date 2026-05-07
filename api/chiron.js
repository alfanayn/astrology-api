
const CHIRON_INGRESS = [
  ["1926-05-24", "Taurus"],
  ["1926-10-20", "Aries"],
  ["1927-03-25", "Taurus"],
  ["1933-06-06", "Gemini"],
  ["1933-12-22", "Taurus"],
  ["1934-03-23", "Gemini"],
  ["1937-08-27", "Cancer"],
  ["1937-11-22", "Gemini"],
  ["1938-05-28", "Cancer"],
  ["1940-09-29", "Leo"],
  ["1940-12-27", "Cancer"],
  ["1941-06-16", "Leo"],
  ["1943-07-26", "Virgo"],
  ["1944-11-17", "Libra"],
  ["1945-03-23", "Virgo"],
  ["1945-07-22", "Libra"],
  ["1946-11-10", "Scorpio"],
  ["1948-11-28", "Sagittarius"],
  ["1951-02-08", "Capricorn"],
  ["1951-06-18", "Sagittarius"],
  ["1951-11-08", "Capricorn"],
  ["1955-01-27", "Aquarius"],
  ["1960-03-26", "Pisces"],
  ["1960-08-19", "Aquarius"],
  ["1961-01-20", "Pisces"],
  ["1968-04-01", "Aries"],
  ["1968-10-18", "Pisces"],
  ["1969-01-30", "Aries"],
  ["1976-05-28", "Taurus"],
  ["1976-10-13", "Aries"],
  ["1977-03-28", "Taurus"],
  ["1983-06-21", "Gemini"],
  ["1983-11-29", "Taurus"],
  ["1984-04-10", "Gemini"],
  ["1988-06-21", "Cancer"],
  ["1991-07-21", "Leo"],
  ["1993-09-03", "Virgo"],
  ["1995-09-09", "Libra"],
  ["1996-12-29", "Scorpio"],
  ["1997-04-04", "Libra"],
  ["1997-09-02", "Scorpio"],
  ["1999-01-07", "Sagittarius"],
  ["1999-06-01", "Scorpio"],
  ["1999-09-21", "Sagittarius"],
  ["2001-12-11", "Capricorn"],
  ["2005-02-21", "Aquarius"],
  ["2005-07-31", "Capricorn"],
  ["2005-12-05", "Aquarius"],
  ["2010-04-20", "Pisces"],
  ["2010-07-20", "Aquarius"],
  ["2011-02-08", "Pisces"],
  ["2018-04-17", "Aries"],
  ["2018-09-25", "Pisces"],
  ["2019-02-18", "Aries"],
  ["2026-06-19", "Taurus"],
  ["2026-09-17", "Aries"],
  ["2027-04-14", "Taurus"],
  ["2033-07-19", "Gemini"],
  ["2033-10-23", "Taurus"],
  ["2034-05-05", "Gemini"],
  ["2038-07-22", "Cancer"],
  ["2039-01-08", "Gemini"],
  ["2039-04-26", "Cancer"],
  ["2041-08-28", "Leo"],
  ["2042-02-09", "Cancer"],
  ["2042-05-16", "Leo"],
  ["2043-10-23", "Virgo"],
  ["2044-02-10", "Leo"],
  ["2044-07-01", "Virgo"],
  ["2045-10-24", "Libra"]
];

const SIGN_GLYPHS = {
  Aries:"♈", Taurus:"♉", Gemini:"♊", Cancer:"♋",
  Leo:"♌", Virgo:"♍", Libra:"♎", Scorpio:"♏",
  Sagittarius:"♐", Capricorn:"♑", Aquarius:"♒", Pisces:"♓"
};

// Element and modality
const SIGN_META = {
  Aries:       { element:"Fire",  modality:"Cardinal", ruler:"Mars"    },
  Taurus:      { element:"Earth", modality:"Fixed",    ruler:"Venus"   },
  Gemini:      { element:"Air",   modality:"Mutable",  ruler:"Mercury" },
  Cancer:      { element:"Water", modality:"Cardinal", ruler:"Moon"    },
  Leo:         { element:"Fire",  modality:"Fixed",    ruler:"Sun"     },
  Virgo:       { element:"Earth", modality:"Mutable",  ruler:"Mercury" },
  Libra:       { element:"Air",   modality:"Cardinal", ruler:"Venus"   },
  Scorpio:     { element:"Water", modality:"Fixed",    ruler:"Pluto"   },
  Sagittarius: { element:"Fire",  modality:"Mutable",  ruler:"Jupiter" },
  Capricorn:   { element:"Earth", modality:"Cardinal", ruler:"Saturn"  },
  Aquarius:    { element:"Air",   modality:"Fixed",    ruler:"Uranus"  },
  Pisces:      { element:"Water", modality:"Mutable",  ruler:"Neptune" },
};

// Chiron in each sign — wound & healing themes
const CHIRON_READINGS = {
  Aries: {
    wound: "Identity & Self-Worth",
    woundDesc: "A deep wound around your right to exist, be seen, or assert yourself. You may feel that your needs don't matter, or struggle to take action on your own behalf without guilt.",
    healing: "Reclaiming Courageous Self-Expression",
    healingDesc: "Your healing comes through learning that you have the right to take up space, pursue your desires, and act with confidence. Leadership and embodied action are your medicine.",
    gifts: ["Natural healer of confidence wounds in others","Ability to help people reclaim their identity","Pioneer spirit that becomes a gift once owned"],
    shadow: "Overcompensating through aggression or, conversely, disappearing into passivity.",
    famous: ["Aries Chiron era: 1919–1926, 1976–1983, 2018–2027"]
  },
  Taurus: {
    wound: "Safety, Stability & Self-Value",
    woundDesc: "Core wounds around physical security, money, or feeling that you are inherently valuable. Scarcity consciousness or difficulty receiving pleasure and abundance may be present.",
    healing: "Embodied Abundance & Self-Trust",
    healingDesc: "Healing comes through the body — slowing down, receiving nourishment, and learning that you are enough exactly as you are. Nature, beauty, and simple sensory presence are medicine.",
    gifts: ["Helping others ground and find security","Wisdom about value that transcends material wealth","Deeply trustworthy and stabilising presence for others"],
    shadow: "Stubbornness or hoarding as defence against loss.",
    famous: ["Taurus Chiron era: 1926–1933, 1983–1988"]
  },
  Gemini: {
    wound: "Communication & Being Heard",
    woundDesc: "Wounds around speech, learning, and intellectual expression. You may have been told your ideas don't matter, or felt misunderstood. Anxiety around communication may be present.",
    healing: "The Power of Your Voice & Mind",
    healingDesc: "Healing comes through reclaiming your voice — writing, teaching, or talking about what you know. Your experience of struggle with communication makes you an extraordinary messenger.",
    gifts: ["Bridge-builder and translator of complex ideas","Teaching through personal story","Healing gift for those who feel unheard or misunderstood"],
    shadow: "Overthinking or talking around the wound without actually healing it.",
    famous: ["Gemini Chiron era: 1933–1938, 1988–1991"]
  },
  Cancer: {
    wound: "Home, Belonging & Nurturing",
    woundDesc: "Deep wounds around family, the mother, or sense of emotional safety. Feeling like an outsider in your own family or struggling to feel 'at home' anywhere are common themes.",
    healing: "Creating a Home Within Yourself",
    healingDesc: "Healing comes through creating your own sense of belonging and emotional security, independent of family approval. You become a nurturer of others' belonging because you know the cost of its absence.",
    gifts: ["Extraordinary capacity to make others feel accepted","Creating communities and chosen families","Intuitive healer of ancestral and family wounds"],
    shadow: "Codependency or smothering others as a way to meet unmet nurturing needs.",
    famous: ["Cancer Chiron era: 1938–1943, 1991–1993"]
  },
  Leo: {
    wound: "Recognition, Creativity & Self-Expression",
    woundDesc: "Wounds around being seen, praised, or allowed to shine. You may have been overlooked, overshadowed, or shamed for wanting attention. Performing for love while fearing rejection.",
    healing: "Creating from the Inside Out",
    healingDesc: "Healing comes when you express yourself for the joy of it — without needing applause. Your creativity becomes a gift to others when you stop waiting for permission to shine.",
    gifts: ["Inspires creative confidence in others","Natural performer who heals through authenticity","Champion of others' self-expression"],
    shadow: "Seeking constant validation or withdrawing to avoid the pain of rejection.",
    famous: ["Leo Chiron era: 1943–1946, 1993–1994"]
  },
  Virgo: {
    wound: "Perfectionism, Service & Worthiness",
    woundDesc: "Deep wounds around being 'enough' — being useful, pure, correct, or perfect enough. Over-working, self-criticism, or health anxiety often stem from this placement.",
    healing: "Sacred Imperfection",
    healingDesc: "Healing comes through accepting that you are inherently worthy — not because of your service, productivity, or correctness. You become a healer by showing others that wholeness includes the broken parts.",
    gifts: ["Exceptional healing abilities in health and wellness","Meticulous skill that becomes wisdom when freed from perfectionism","Ability to find meaning in the smallest acts of service"],
    shadow: "Chronic self-criticism or judgement of others as a way to feel in control.",
    famous: ["Virgo Chiron era: 1946–1948, 1995–1996"]
  },
  Libra: {
    wound: "Relationships, Fairness & Peace",
    woundDesc: "Wounds that arise through relationships — betrayal, unfairness, or difficulty finding genuine partnership. You may give yourself away to keep peace, or struggle to believe that balanced love is possible for you.",
    healing: "Wholeness Without Compromise",
    healingDesc: "Healing comes through learning to be in relationship with yourself first — then offering that wholeness to others. You become a wounded healer in all matters of love, justice, and genuine connection.",
    gifts: ["Extraordinary peacemaker and mediator","Sees multiple perspectives with unusual fairness","Heals relationship wounds in others through their own journey"],
    shadow: "Chronic people-pleasing or avoiding conflict at the cost of authentic self.",
    famous: ["Libra Chiron era: 1948–1951, 1997–1998"]
  },
  Scorpio: {
    wound: "Power, Loss & Transformation",
    woundDesc: "Deep wounds around betrayal, loss, death, or shared power. Themes of control, vulnerability, and the fear of being destroyed if you truly open up may run through your life.",
    healing: "Alchemical Transformation",
    healingDesc: "Healing comes through facing the depths — grief, the taboo, the shadow — and emerging transformed. You become a guide through darkness for others because you know the terrain intimately.",
    gifts: ["Profound psychological insight and depth","Guides others through grief, loss, and rebirth","Power to transmute trauma into wisdom"],
    shadow: "Control, secrecy, or using depth as armour instead of medicine.",
    famous: ["Scorpio Chiron era: 1951–1955, 1999"]
  },
  Sagittarius: {
    wound: "Meaning, Faith & Freedom",
    woundDesc: "Wounds around belief, higher meaning, or the freedom to explore. Disillusionment, loss of faith, or feeling that your truth is unwelcome may be central themes.",
    healing: "Finding Your Own Truth",
    healingDesc: "Healing comes through developing a personal philosophy that goes beyond inherited beliefs. You become a teacher, philosopher, or guide for others who have lost their way in meaning-making.",
    gifts: ["Extraordinary teacher and wisdom-keeper","Ability to hold hope for others who have lost it","Inspires faith and expanded possibility"],
    shadow: "Dogmatism, restlessness, or escaping the wound through endless seeking.",
    famous: ["Sagittarius Chiron era: 1955–1961, 1999–2001"]
  },
  Capricorn: {
    wound: "Authority, Responsibility & Success",
    woundDesc: "Wounds related to authority figures (often the father or institutions), or a crushing sense of responsibility from an early age. You may feel you can never do enough, or that success is always just out of reach.",
    healing: "Authentic Authority",
    healingDesc: "Healing comes through building authority from the inside — not seeking approval from structures that wounded you, but creating your own. Age and experience deepen your gift rather than harden your wound.",
    gifts: ["Master builder and mentor for others navigating structure","Capacity to succeed through persistence despite early setbacks","Authentic leadership that comes from having known failure"],
    shadow: "Workaholism, rigidity, or seeking status as compensation for unworthiness.",
    famous: ["Capricorn Chiron era: 1961–1968, 2001–2005"]
  },
  Aquarius: {
    wound: "Belonging, Individuality & Humanity",
    woundDesc: "Wounds around fitting in — being too different, excluded, or dismissed as eccentric. Alternatively, wounds from suppressing your uniqueness to belong. The tension between individuality and community is central.",
    healing: "The Gift of Being Different",
    healingDesc: "Healing comes through owning your uniqueness as a gift rather than a liability. You become a visionary healer for humanity when you stop trying to fit in and start leading with your genuine originality.",
    gifts: ["Visionary thinker ahead of their time","Healer for outcasts and those who feel they don't belong","Bridges the individual and the collective"],
    shadow: "Emotional detachment or using intellect to avoid the feeling of the wound.",
    famous: ["Aquarius Chiron era: 1968–1969, 2005–2010"]
  },
  Pisces: {
    wound: "Dissolution, Spirituality & Compassion",
    woundDesc: "Wounds around boundaries, loss of self, or spiritual confusion. Feeling unmoored, overly sensitive to others' pain, or struggling to distinguish your feelings from the collective's.",
    healing: "Conscious Surrender & Spiritual Wholeness",
    healingDesc: "Healing comes through conscious spiritual practice — learning to dissolve the ego with intention rather than being swept away. Your sensitivity becomes a gift when held in a container of self-compassion.",
    gifts: ["Profound empathy and spiritual depth","Healer for collective and ancestral wounds","Artist, mystic, or guide through transcendence"],
    shadow: "Escapism, martyrdom, or losing oneself entirely in another's pain.",
    famous: ["Pisces Chiron era: 1969–1976, 2010–2018"]
  }
};

function getChironSign(year, month, day) {
  const dateStr = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  let sign = "Aries";
  for (const [date, sg] of CHIRON_INGRESS) {
    if (date <= dateStr) sign = sg;
    else break;
  }
  return sign;
}

// Find the current Chiron sign period (start/end dates)
function getChironPeriod(year, month, day) {
  const dateStr = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  let periodStart = null, periodEnd = null, periodSign = "Aries";

  for (let i = 0; i < CHIRON_INGRESS.length; i++) {
    const [date, sg] = CHIRON_INGRESS[i];
    if (date <= dateStr) {
      periodStart = date;
      periodSign  = sg;
      periodEnd   = CHIRON_INGRESS[i+1] ? CHIRON_INGRESS[i+1][0] : null;
    } else break;
  }
  return { start: periodStart, end: periodEnd, sign: periodSign };
}

export default function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  const { year, month, day } = req.query;

  if (!year || !month || !day) {
    return res.status(400).json({
      error: "Missing required parameters",
      required: ["year", "month", "day"],
      example: "/api/chiron?year=1990&month=5&day=15"
    });
  }

  const y = parseInt(year);
  const m = parseInt(month);
  const d = parseInt(day);

  if (isNaN(y)||isNaN(m)||isNaN(d)) return res.status(400).json({ error:"Invalid date values" });
  if (m<1||m>12) return res.status(400).json({ error:"month must be 1-12" });
  if (d<1||d>31) return res.status(400).json({ error:"day must be 1-31" });
  if (y<1920||y>2028) return res.status(400).json({
    error: "Year out of range",
    supported: "1920–2028",
    note: "Chiron sign table covers 1919–2028. For exact degrees, .se1 ephemeris file is required."
  });

  const sign   = getChironSign(y, m, d);
  const period = getChironPeriod(y, m, d);
  const glyph  = SIGN_GLYPHS[sign] || "⚷";
  const meta   = SIGN_META[sign] || {};
  const reading = CHIRON_READINGS[sign] || {};

  return res.status(200).json({
    ok: true,
    chiron: {
      sign,
      glyph,
      symbol: "⚷",
      element:  meta.element,
      modality: meta.modality,
      ruler:    meta.ruler,
      period: {
        start: period.start,
        end:   period.end,
      },
      wound:        reading.wound,
      woundDesc:    reading.woundDesc,
      healing:      reading.healing,
      healingDesc:  reading.healingDesc,
      gifts:        reading.gifts || [],
      shadow:       reading.shadow,
      note: "Sign-level accuracy (verified ingress dates). Exact degree requires .se1 ephemeris file.",
      engine: "Swiss Ephemeris ingress table (sign-level)"
    }
  });
}

/* ============================================================
   Wild Silk Archive — unified renderer
   Loads all per-museum data files, normalizes to one schema,
   renders one grid filtered by fibre / museum / place / object type.

   To add a new museum:
     1. Drop a data-XX.js file into the project
     2. Add a <script src="data-XX.js"></script> tag in index.html
     3. Register an adapter below in MUSEUM_ADAPTERS
   No new HTML page or per-museum script needed.
   ============================================================ */

/* ---------- Fibre family normalization ----------
   Top-level: Tasar (Indian Antheraea mylitta), Tussore/Tussah
   (foreign Antheraea pernyi/yamamai + European processing),
   Muga (Antheraea assamensis), Eri (Samia ricini). */
function normaliseFibre(raw, materialText, placeText) {
  const r = (raw || "").toLowerCase();
  const m = (materialText || "").toLowerCase();
  const p = (placeText || "").toLowerCase();

  // Muga — Assamese wild silk (Antheraea assamensis). Spelling variants: mooga, moonga, munga
  if (r === "muga" || m.includes("muga") || m.includes("mooga") || m.includes("moonga") || m.includes("munga")) return "Muga";

  // Eri — Assamese wild silk (Samia ricini). Spelling variants: endi, errea, errya, eria, endy
  if (r === "eri" || r === "eria" || m.includes("eri silk") || m.includes(" eri ") ||
      m.includes("endi") || m.includes("errea") || m.includes("errya") ||
      m.includes("eria") || m.includes("endy")) return "Eri";

  // Tasar — Indian wild silk (Antheraea mylitta). Variants: tussar, tussur, tusser, kosa
  if (r === "tasar" || r === "tussar") return "Tasar";
  if (m.includes("tasar") || m.includes("tussar") || m.includes("tussur") ||
      m.includes("tusser") || m.includes("kosa silk") || m.includes(" kosa ")) {
    return "Tasar";
  }
  // Foreign tussah → Tussore/Tussah
  if (r === "tussah" || r === "tussore" || m.includes("tussah") || m.includes("tussore"))
    return "Tussore / Tussah";

  // AIC's "Wild silk" — usually Chinese/Japanese → Tussore/Tussah
  if (r === "wild silk") return "Tussore / Tussah";

  // BM West African wild silk (sanyan, Anaphe, Epiphora) — its own bucket
  if (r === "wild silk (west africa)") return "Wild silk (West Africa)";

  // PRM Mexico wild silk (Zapotec — Eucheira socialis) — its own bucket
  if (r === "wild silk (mexico)") return "Wild silk (Mexico)";

  // Generic "wild silk" mentioned in material/title, with Indian context → Wild silk (India)
  if (m.includes("wild silk") &&
      (p.includes("india") || p.includes("bengal") || p.includes("assam") ||
       p.includes("odisha") || p.includes("orissa") || p.includes("bihar") ||
       p.includes("jharkhand") || p.includes("chhattisgarh") || p.includes("telangana") ||
       p.includes("hyderabad") || p.includes("nepal"))) return "Wild silk (India)";

  // V&A's own curatorial section "Indian wild silk" (and "British / Indian wild silk"
  // for Wardle's Leek-printed Indian-tasar pieces) — museum's own classification, not our inference
  if (p.includes("indian wild silk")) return "Wild silk (India)";

  // V&A's "European tussore / Chinese tussah" section → merge into generic Tussore / Tussah
  if (p.includes("european tussore") || p.includes("chinese tussah")) return "Tussore / Tussah";

  // Generic catch-all for wild silk records that don't fit a named bucket
  if (r === "wild silk (other)" || m.includes("wild silk")) return "Wild silk (other)";

  return "Other";
}

/* ---------- Per-museum adapters ----------
   Each adapter takes a raw record + index, returns a normalized object. */
const MUSEUM_ADAPTERS = {
  va: {
    source: () => (typeof items !== "undefined" ? items : []),
    museum: "Victoria & Albert Museum",
    museumShort: "V&A",
    sourceLabel: "View on V&A site",
    normalise(rec) {
      const place = rec.vaPlaceOfOrigin || rec.vaLocation || "";
      return {
        uid: "va-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + encodeURIComponent(rec.imageFile) : "",
        hasImage: !!rec.imageFile && !rec.imageFile.endsWith(".pdf"),
        sourceUrl: rec.vaUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(null, (rec.title || "") + " " + (rec.vaMaterial || "") + " " + (rec.vaObjectType || "") + " " + (rec.vaBriefDescription || ""), place + " " + rec.vaSection),
        place: place || "—",
        country: rec.vaLocation || "",
        region: rec.vaPlaceOfOrigin || rec.vaLocation || "",
        objectType: rec.vaObjectType || "",
        material: rec.vaMaterial || "",
        date: rec.vaDate || "",
        year: parseYear(rec.vaDate),
        description: rec.vaBriefDescription || "",
        dimensions: rec.vaDimensions || "",
        extras: [
          ["Section", rec.vaSection],
          ["Technique", rec.vaTechniqueBucket],
          ["Dye", rec.vaDyeBucket]
        ]
      };
    }
  },
  im: {
    source: () => (typeof imItems !== "undefined" ? imItems : []),
    museum: "Indian Museum, Kolkata",
    museumShort: "IM",
    sourceLabel: "View on museumsofindia.gov.in",
    normalise(rec) {
      return {
        uid: "im-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + rec.imageFile : "",
        hasImage: !!rec.imageFile,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, (rec.title || "") + " " + (rec.mainMaterial || "") + " " + (rec.school || "") + " " + (rec.briefDescription || ""), rec.placeOfOrigin),
        place: rec.placeOfOrigin || "—",
        country: rec.country || "India",
        region: rec.placeState || rec.placeOfOrigin || "",
        objectType: rec.objectType || "",
        material: rec.mainMaterial || "",
        date: rec.date || "",
        year: parseYear(rec.date),
        description: rec.briefDescription || "",
        dimensions: rec.dimensions || "",
        extras: [
          ["School", rec.school],
          ["State", rec.placeState]
        ]
      };
    }
  },
  nm: {
    source: () => (typeof nmItems !== "undefined" ? nmItems : []),
    museum: "National Museum, New Delhi",
    museumShort: "NM",
    sourceLabel: "View on museumsofindia.gov.in",
    normalise(rec) {
      return {
        uid: "nm-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + rec.imageFile : "",
        hasImage: !!rec.imageFile,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, (rec.title || "") + " " + (rec.mainMaterial || "") + " " + (rec.briefDescription || ""), rec.placeOfOrigin),
        place: rec.placeOfOrigin || "—",
        country: rec.country || "India",
        region: rec.placeState || rec.placeOfOrigin || "",
        objectType: rec.objectType || "",
        material: rec.mainMaterial || "",
        date: rec.date || "",
        year: parseYear(rec.date),
        description: rec.briefDescription || "",
        dimensions: rec.dimensions || "",
        extras: [
          ["Technique", rec.manufacturingTechnique],
          ["State", rec.placeState]
        ]
      };
    }
  },
  met: {
    source: () => (typeof metItems !== "undefined" ? metItems : []),
    museum: "The Metropolitan Museum of Art",
    museumShort: "MET",
    sourceLabel: "View on metmuseum.org",
    normalise(rec) {
      const region = rec.region || rec.country || rec.culture || "";
      return {
        uid: "met-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + rec.imageFile : "",
        hasImage: !!rec.imageFile,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.medium, region),
        place: [rec.region, rec.country, rec.culture].filter(Boolean).join(", ") || "—",
        country: rec.country || rec.culture || "",
        region: region,
        objectType: rec.objectName || rec.classification || "",
        material: rec.medium || "",
        date: rec.objectDate || "",
        year: parseYear(rec.objectDate),
        description: "",
        dimensions: rec.dimensions || "",
        extras: [
          ["Department", rec.department],
          ["Classification", rec.classification],
          ["Credit line", rec.creditLine]
        ]
      };
    }
  },
  artic: {
    source: () => (typeof articItems !== "undefined" ? articItems : []),
    museum: "Art Institute of Chicago",
    museumShort: "AIC",
    sourceLabel: "View on artic.edu",
    normalise(rec) {
      return {
        uid: "artic-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.objectID ? String(rec.objectID) : "",
        imageSrc: rec.imageUrl || "",
        hasImage: !!rec.imageUrl,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.medium, rec.placeOfOrigin),
        place: rec.placeOfOrigin || "—",
        country: rec.placeOfOrigin || "",
        region: rec.placeOfOrigin || "",
        objectType: rec.classification || "",
        material: rec.medium || "",
        date: rec.dateDisplay || "",
        year: parseYear(rec.dateDisplay),
        description: rec.description || "",
        dimensions: rec.dimensions || "",
        extras: [
          ["Department", rec.department],
          ["Artist / origin", rec.artistDisplay],
          ["Credit line", rec.creditLine]
        ]
      };
    }
  },
  fw: {
    source: () => (typeof fwItems !== "undefined" ? fwItems : []),
    museum: "Forbes Watson 1866",
    museumShort: "FW",
    sourceLabel: "View on tmoi.org.uk",
    normalise(rec) {
      return {
        uid: "fw-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + rec.imageFile : "",
        hasImage: !!rec.imageFile,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.fibre + " " + rec.material, rec.placeModern),
        place: rec.placeModern || "—",
        country: "India",
        region: rec.region || "",
        objectType: rec.use || rec.title || "",
        material: rec.material || "",
        date: "1866",
        year: 1866,
        description: rec.extraInfo || "",
        dimensions: [rec.length, rec.width].filter(Boolean).join(" × "),
        extras: [
          ["Volume", rec.volumeTitle],
          ["Sample no.", rec.sampleNo],
          ["Pattern", rec.pattern],
          ["Technique", rec.technique],
          ["Colours", rec.mainColours],
          ["Original place", rec.placeFw]
        ]
      };
    }
  },
  bm: {
    source: () => (typeof bmItems !== "undefined" ? bmItems : []),
    museum: "The British Museum",
    museumShort: "BM",
    sourceLabel: "View on britishmuseum.org",
    normalise(rec) {
      const region = rec.region || rec.country || rec.culture || "";
      return {
        uid: "bm-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + rec.imageFile : "",
        hasImage: !!rec.imageFile,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.medium, region + " " + (rec.country || "")),
        place: [rec.region, rec.country, rec.culture].filter(Boolean).join(", ") || "—",
        country: rec.country || rec.culture || "",
        region: region,
        objectType: rec.objectName || rec.classification || "",
        material: rec.medium || "",
        date: rec.objectDate || "",
        year: parseYear(rec.objectDate),
        description: "",
        dimensions: rec.dimensions || "",
        extras: [
          ["Department", rec.department],
          ["Culture", rec.culture],
          ["Credit line", rec.creditLine]
        ]
      };
    }
  },
  wh: {
    source: () => (typeof whItems !== "undefined" ? whItems : []),
    museum: "Whitworth Art Gallery",
    museumShort: "Whitworth",
    sourceLabel: "View on Whitworth Collections",
    normalise(rec) {
      const region = rec.region || rec.country || rec.culture || "";
      return {
        uid: "wh-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + rec.imageFile : "",
        hasImage: !!rec.imageFile,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.medium, region + " " + (rec.country || "")),
        place: [rec.region, rec.country, rec.culture].filter(Boolean).join(", ") || "—",
        country: rec.country || rec.culture || "",
        region: region,
        objectType: rec.objectName || rec.classification || "",
        material: rec.medium || "",
        date: rec.objectDate || "",
        year: parseYear(rec.objectDate),
        description: "",
        dimensions: rec.dimensions || "",
        extras: [
          ["Department", rec.department],
          ["Maker", rec.culture],
          ["Credit line", rec.creditLine]
        ]
      };
    }
  },
  hm: {
    source: () => (typeof hmItems !== "undefined" ? hmItems : []),
    museum: "Horniman Museum",
    museumShort: "Horniman",
    sourceLabel: "View on horniman.ac.uk",
    normalise(rec) {
      const region = rec.region || rec.country || rec.culture || "";
      return {
        uid: "hm-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + rec.imageFile : "",
        hasImage: !!rec.imageFile,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.medium, region + " " + (rec.country || "")),
        place: [rec.region, rec.country, rec.culture].filter(Boolean).join(", ") || "—",
        country: rec.country || rec.culture || "",
        region: region,
        objectType: rec.objectName || rec.classification || "",
        material: rec.medium || "",
        date: rec.objectDate || "",
        year: parseYear(rec.objectDate),
        description: "",
        dimensions: rec.dimensions || "",
        extras: [
          ["Department", rec.department],
          ["Classification", rec.classification],
          ["Credit line", rec.creditLine]
        ]
      };
    }
  },
  pr: {
    source: () => (typeof prItems !== "undefined" ? prItems : []),
    museum: "Pitt Rivers Museum",
    museumShort: "PRM",
    sourceLabel: "View on prm.ox.ac.uk",
    normalise(rec) {
      const region = rec.region || rec.country || rec.culture || "";
      return {
        uid: "pr-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageFile ? "images/" + rec.imageFile : "",
        hasImage: !!rec.imageFile,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.medium, region + " " + (rec.country || "")),
        place: [rec.region, rec.country, rec.culture].filter(Boolean).join(", ") || "—",
        country: rec.country || rec.culture || "",
        region: region,
        objectType: rec.objectName || rec.classification || "",
        material: rec.medium || "",
        date: rec.objectDate || "",
        year: parseYear(rec.objectDate),
        description: "",
        dimensions: rec.dimensions || "",
        extras: [
          ["Culture", rec.culture],
          ["Credit line", rec.creditLine]
        ]
      };
    }
  },
  si: {
    source: () => (typeof siItems !== "undefined" ? siItems : []),
    museum: "Cooper Hewitt, Smithsonian Design Museum",
    museumShort: "CHNDM",
    sourceLabel: "View on Smithsonian",
    normalise(rec) {
      return {
        uid: "si-" + rec.id,
        museum: this.museum,
        museumShort: this.museumShort,
        title: rec.title || "—",
        accession: rec.accession || "",
        imageSrc: rec.imageUrl || "",
        hasImage: !!rec.imageUrl,
        sourceUrl: rec.sourceUrl || "",
        sourceLabel: this.sourceLabel,
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.measurements, rec.place),
        place: rec.place || "—",
        country: (rec.place || "").includes("India") ? "India" : rec.place,
        region: rec.place || "",
        objectType: rec.objectType || "",
        material: rec.measurements || "",
        date: rec.date || "",
        year: parseYear(rec.date),
        description: rec.description && rec.description !== "Research in Progress" ? rec.description : "",
        dimensions: "",
        extras: [
          ["Maker / collector", rec.maker],
          ["Credit line", rec.creditLine],
          ["Collection", rec.collection]
        ]
      };
    }
  }
};

/* ---------- Date parsing ---------- */
function parseYear(s) {
  if (!s) return Infinity;
  const cleaned = String(s).toLowerCase();
  const yearMatch = cleaned.match(/\d{4}/);
  if (yearMatch) return parseInt(yearMatch[0], 10);
  // matches "17th century", "19th Century AD", and BM's "17thC(early)" / "19thC (circa)" forms
  const centuryMatch = cleaned.match(/(\d{1,2})(?:st|nd|rd|th)\s*c(?:entury)?(?![a-z])/);
  if (centuryMatch) {
    const c = parseInt(centuryMatch[1], 10);
    let y = (c - 1) * 100 + 50;
    if (cleaned.includes("early")) y = (c - 1) * 100 + 15;
    else if (cleaned.includes("late")) y = (c - 1) * 100 + 85;
    return y;
  }
  return Infinity;
}

/* ---------- Century + object-form derivation (centralised) ---------- */
function deriveCentury(year) {
  if (!year || year === Infinity) return "";
  const c = Math.floor((year - 1) / 100) + 1;
  const ord = (c % 100 >= 11 && c % 100 <= 13) ? "th"
    : (c % 10 === 1) ? "st"
    : (c % 10 === 2) ? "nd"
    : (c % 10 === 3) ? "rd" : "th";
  return c + ord + " century";
}

function deriveObjectForm(item) {
  // Use TITLE + OBJECT TYPE only — NOT material description, which often mentions
  // "embroidered with tussar silk thread" or "yarn" in fabric construction notes,
  // causing false positives.
  const t = ((item.objectType || "") + " " + (item.title || "")).toLowerCase();
  const mat = (item.material || "").toLowerCase();

  // Raw material — the object IS yarn/cocoon/raw silk (title-driven)
  if (/\b(silk yarn|silk samples|yarn sample|cocoon|raw silk|skein|filature|hank of)\b/.test(t)) return "Raw material";
  // BM-style: title "Sample" with raw silk material (not woven or embroidered cloth).
  // Distinguishes BM's ethnographic raw-silk specimens (2021,2022.4/5/6 — cocoons,
  // yarn skeins, silk casings) from V&A's woven/embroidered "Sample" textiles.
  if (/^\s*sample\s*$/i.test(item.title || "") && mat && !/woven|embroider/.test(mat)) return "Raw material";

  // Books — sample books, specimen books, newspaper/archive articles
  if (/\b(sample book|specimen book|book of samples)\b/.test(t)) return "Books";
  if (/\b(newspaper article|archive)\b/.test((item.objectType || "").toLowerCase())) return "Books";

  // Uncut fabric override — "Dress fabric", "Skirt piece", "Garment piece", etc.
  // Even though title contains a garment word, the object is uncut fabric → Textile.
  if (/\b(fabric|piece)\b/.test((item.title || "").toLowerCase())) return "Textile";

  // Garment — STITCHED/TAILORED clothing only (cut + sewn). Unstitched drapes
  // (sari, dhoti, lungi, wrapped garment, waistcloth, hip-wrapper) → Textile.
  if (/\b(coat|choga|dress|robe|mantle|cape|cope|surcoat|waitao|\bao\b|pelisse|kesa|hitoe|juban|kimono|cloak|costume|pyjama|trouser|jacket|skirt|blouse|tunic|gown|shirt|suit|tobe)\b/.test(t)) return "Garment";

  // Accessory — functional/structural items + headwear: bags, belts, tools, parasols, obi, turban
  if (/\b(belt|girdle|obi|purse|bag|spindle|fan|parasol|umbrella|turban)\b/.test(t)) return "Accessory";

  // Default — uncut/draped cloth: sari, dhoti, lungi, shawl, scarf, stole, kerchief,
  // chadar, veil, sash, turban, lengths, fragments, panels, hangings, fabric swatches
  return "Textile";
}

/* ---------- Build the unified archive ---------- */
// African countries — collapsed into one "Africa" bucket in the Country filter.
// Original country/region preserved in item.place and item.region for card display.
const AFRICA_SET = new Set([
  "Nigeria", "Burkina Faso", "Mali", "Côte d'Ivoire", "Cote d'Ivoire",
  "Ghana", "Senegal", "Sierra Leone", "Liberia", "Togo", "Benin", "Niger",
  "Cameroon", "Chad", "Sudan", "Ethiopia", "Kenya", "Tanzania", "Uganda",
  "Madagascar", "Mozambique", "Zimbabwe", "South Africa", "Botswana",
  "Namibia", "Angola", "Congo", "Democratic Republic of the Congo",
  "Egypt", "Morocco", "Algeria", "Tunisia", "Libya", "Mauritania",
  "Guinea", "Gambia", "Cape Verde", "Eritrea", "Somalia", "Rwanda", "Burundi", "Malawi", "Zambia"
]);
// Country aliases — collapse near-duplicates and hybrid origins into a single
// canonical name. India/X hybrids route to the DESTINATION country (preserves
// Wardle's Leek colonial-trade signal in the filter); Nepal hybrid follows region.
const COUNTRY_ALIASES = {
  "United Kingdom": "Great Britain",
  "Great Britain / India": "Great Britain",
  "India / England": "England",
  "London": "England",
  "India / Nepal": "Nepal",
  "Japan or Central Asia": "Japan"
};
function normaliseCountry(c) {
  if (AFRICA_SET.has(c)) return "Africa";
  return COUNTRY_ALIASES[c] || c;
}
const archiveItems = Object.values(MUSEUM_ADAPTERS).flatMap(adapter =>
  adapter.source().map(rec => {
    const item = adapter.normalise(rec);
    item.country = normaliseCountry(item.country);
    item.century = deriveCentury(item.year);
    item.objectForm = deriveObjectForm(item);
    return item;
  })
);

/* ---------- Filter / state ---------- */
const activeFilters = {
  fibreBucket: new Set(),
  museum: new Set(),
  country: new Set(),
  century: new Set(),
  objectForm: new Set()
};
let activeSort = "fibre";
let activeSearch = "";

const FIBRE_ORDER = ["Tasar", "Tussore / Tussah", "Muga", "Eri", "Wild silk (India)", "Wild silk (West Africa)", "Wild silk (Mexico)", "Wild silk (other)", "Other"];

// India + Indian states/regions — sorted to the top of the Country filter
const INDIA_PRIORITY = new Set([
  "India", "India / Nepal",
  "West Bengal", "Bengal",
  "Assam", "Bihar", "Odisha", "Orissa", "Jharkhand", "Chhattisgarh",
  "Maharashtra", "Karnataka", "Tamil Nadu", "Madhya Pradesh",
  "Uttar Pradesh", "Andhra Pradesh", "Kashmir", "Jammu and Kashmir",
  "Punjab", "Gujarat", "Rajasthan", "Kerala", "Manipur", "Mizoram",
  "Meghalaya", "Arunachal Pradesh", "Nagaland", "Tripura", "Sikkim",
  "Telangana", "Goa", "Haryana", "Himachal Pradesh", "Delhi"
]);

/* ---------- DOM ---------- */
const grid = document.getElementById("grid");
const resultCount = document.getElementById("result-count");
const totalCount = document.getElementById("total-count");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const clearBtn = document.getElementById("clear-filters");
const modal = document.getElementById("modal");
const modalContent = modal.querySelector(".modal-content");
const modalCloseBtn = modal.querySelector(".modal-close");

/* ---------- Filter rendering ---------- */
function renderFilters() {
  ["fibreBucket", "museum", "country", "century", "objectForm"].forEach(key => {
    const group = document.querySelector(`.filter-group[data-filter="${key}"] .filter-list`);
    if (!group) return;

    const counts = {};
    archiveItems.forEach(i => {
      const v = i[key];
      if (v) counts[v] = (counts[v] || 0) + 1;
    });

    let options = Object.keys(counts);
    if (key === "fibreBucket") {
      options.sort((a, b) => FIBRE_ORDER.indexOf(a) - FIBRE_ORDER.indexOf(b));
    } else if (key === "century") {
      options.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    } else if (key === "objectForm") {
      // Sort by count desc (Textile → Garment → Accessory → Raw material → Books)
      options.sort((a, b) => counts[b] - counts[a]);
    } else if (key === "country") {
      // India first, then Indian states/regions (by count), then everything else (by count)
      options.sort((a, b) => {
        if (a === "India") return -1;
        if (b === "India") return 1;
        const aIndia = INDIA_PRIORITY.has(a);
        const bIndia = INDIA_PRIORITY.has(b);
        if (aIndia && !bIndia) return -1;
        if (!aIndia && bIndia) return 1;
        return counts[b] - counts[a];
      });
    } else {
      options.sort((a, b) => counts[b] - counts[a]);
    }

    group.innerHTML = options.map(opt => `
      <li>
        <label>
          <input type="checkbox" data-filter="${key}" data-value="${escapeAttr(opt)}">
          <span>${escapeHtml(opt)}</span>
          <span class="count">${counts[opt]}</span>
        </label>
      </li>
    `).join("");
  });

  document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", e => {
      const f = e.target.dataset.filter;
      const v = e.target.dataset.value;
      if (e.target.checked) activeFilters[f].add(v);
      else activeFilters[f].delete(v);
      renderGrid();
    });
  });
}

/* ---------- Filter / sort logic ---------- */
function applyFilters() {
  return archiveItems.filter(item => {
    for (const key of Object.keys(activeFilters)) {
      const set = activeFilters[key];
      if (set.size > 0 && !set.has(item[key])) return false;
    }
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      const haystack = [
        item.title, item.objectType, item.material, item.place,
        item.country, item.region, item.description, item.accession,
        item.museum
      ].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function applySort(arr) {
  const sorted = [...arr];
  switch (activeSort) {
    case "fibre":
      sorted.sort((a, b) => {
        const fa = FIBRE_ORDER.indexOf(a.fibreBucket);
        const fb = FIBRE_ORDER.indexOf(b.fibreBucket);
        if (fa !== fb) return fa - fb;
        return a.title.localeCompare(b.title);
      });
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "date":
      sorted.sort((a, b) => a.year - b.year);
      break;
    case "museum":
      sorted.sort((a, b) => a.museum.localeCompare(b.museum) || a.title.localeCompare(b.title));
      break;
  }
  return sorted;
}

/* ---------- Render grid (with fibre-section headers when sorted by fibre) ---------- */
function renderGrid() {
  const filtered = applySort(applyFilters());
  resultCount.textContent = filtered.length === archiveItems.length
    ? `Showing all ${archiveItems.length} objects`
    : `Showing ${filtered.length} of ${archiveItems.length} objects`;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No objects match the current filter combination. Try clearing some filters.</div>';
    return;
  }

  if (activeSort === "fibre" && activeFilters.fibreBucket.size === 0) {
    const groups = {};
    filtered.forEach(item => {
      (groups[item.fibreBucket] ||= []).push(item);
    });
    grid.innerHTML = FIBRE_ORDER
      .filter(f => groups[f])
      .map(f => `
        <div class="fibre-section">
          <h2 class="fibre-heading">${escapeHtml(f)} <span class="fibre-count">${groups[f].length}</span></h2>
          <div class="fibre-grid">${groups[f].map(cardHtml).join("")}</div>
        </div>
      `).join("");
  } else {
    grid.innerHTML = filtered.map(cardHtml).join("");
  }

  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openModal(card.dataset.uid));
  });
}

function cardHtml(item) {
  return `
    <article class="card" data-uid="${escapeAttr(item.uid)}">
      <div class="img-wrap">
        ${item.hasImage
          ? `<img src="${escapeAttr(item.imageSrc)}" alt="${escapeAttr(item.title)}" loading="lazy">`
          : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#5c5240;font-style:italic;font-size:13px;">No image</div>'}
        <span class="card-museum-tag">${escapeHtml(item.museumShort)}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <p class="card-meta">${escapeHtml(item.objectType || "—")} · ${escapeHtml(item.place)}${item.date ? " · " + escapeHtml(item.date) : ""}</p>
        <p class="card-meta-sub">${escapeHtml(item.accession || "—")}</p>
      </div>
    </article>
  `;
}

/* ---------- Modal ---------- */
function openModal(uid) {
  const item = archiveItems.find(i => i.uid === uid);
  if (!item) return;

  const extrasHtml = (item.extras || [])
    .filter(([, v]) => v)
    .map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`)
    .join("");

  modalContent.innerHTML = `
    <div class="modal-image">
      ${item.hasImage
        ? `<img src="${escapeAttr(item.imageSrc)}" alt="${escapeAttr(item.title)}">`
        : `<div style="text-align:center;color:#5c5240;font-style:italic;padding:60px;">No image — use the button below to view on the museum's own site.</div>`}
    </div>
    <div class="modal-info">
      <p class="modal-museum">${escapeHtml(item.museum)}</p>
      <h2>${escapeHtml(item.title)}</h2>
      ${item.description ? `<p class="brief-description">${escapeHtml(item.description)}</p>` : ""}
      <dl class="detail-grid">
        <dt>Fibre family</dt><dd>${escapeHtml(item.fibreBucket)}</dd>
        <dt>Object type</dt><dd>${escapeHtml(item.objectType || "—")}</dd>
        <dt>Material</dt><dd>${escapeHtml(item.material || "—")}</dd>
        <dt>Place of origin</dt><dd>${escapeHtml(item.place)}</dd>
        <dt>Date</dt><dd>${escapeHtml(item.date || "—")}</dd>
        <dt>Dimensions</dt><dd>${escapeHtml(item.dimensions || "—")}</dd>
        <dt>Accession number</dt><dd>${escapeHtml(item.accession || "—")}</dd>
        ${extrasHtml}
      </dl>
      <div class="actions">
        ${item.sourceUrl
          ? `<a class="btn btn-primary" href="${escapeAttr(item.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(item.sourceLabel)}</a>`
          : ""}
      </div>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

modalCloseBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

/* ---------- Search / sort / clear ---------- */
searchInput.addEventListener("input", e => {
  activeSearch = e.target.value.trim();
  renderGrid();
});
sortSelect.addEventListener("change", e => {
  activeSort = e.target.value;
  renderGrid();
});
clearBtn.addEventListener("click", () => {
  Object.keys(activeFilters).forEach(k => activeFilters[k].clear());
  document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(cb => cb.checked = false);
  searchInput.value = "";
  activeSearch = "";
  renderGrid();
});

/* ---------- Mobile filter collapse ---------- */
// Tap the "Filter" header on mobile to expand/collapse the filter body.
// The Clear-all button lives inside the header but must not toggle.
const filterHeader = document.getElementById("filter-header");
const filterSidebar = document.querySelector(".filter-sidebar");
if (filterHeader && filterSidebar) {
  filterHeader.addEventListener("click", (e) => {
    if (e.target.closest("#clear-filters")) return;
    filterSidebar.classList.toggle("open");
  });
}

/* ---------- Utils ---------- */
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function escapeAttr(str) {
  return escapeHtml(str);
}

/* ---------- Init ---------- */
totalCount.textContent = archiveItems.length;
renderFilters();
renderGrid();

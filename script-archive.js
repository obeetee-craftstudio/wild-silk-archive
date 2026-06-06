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

  if (r === "muga" || m.includes("muga")) return "Muga";
  if (r === "eri" || m.includes("eri silk") || m.includes(" eri ")) return "Eri";

  // Indian wild silk records → Tasar (default Indian bucket)
  if (r === "tasar" || r === "tussar") return "Tasar";
  if (m.includes("tasar") || m.includes("tussar")) {
    if (p.includes("india") || p.includes("bengal") || p.includes("assam") ||
        p.includes("odisha") || p.includes("orissa") || p.includes("bihar") ||
        p.includes("jharkhand") || p.includes("chhattisgarh") || p.includes("bhagal"))
      return "Tasar";
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

  // Generic catch-all for wild silk records that don't fit a named bucket
  if (r === "wild silk (other)") return "Wild silk (other)";

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
        fibreBucket: normaliseFibre(null, rec.vaMaterial, place + " " + rec.vaSection),
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
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.mainMaterial + " " + (rec.school || ""), rec.placeOfOrigin),
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
        fibreBucket: normaliseFibre(rec.fibreBucket, rec.mainMaterial, rec.placeOfOrigin),
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
  const centuryMatch = cleaned.match(/(\d{1,2})(?:st|nd|rd|th)\s*century/);
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
  const t = ((item.objectType || "") + " " + (item.title || "") + " " + (item.material || "")).toLowerCase();
  if (/\b(yarn|skein|filature|thread)\b/.test(t)) return "Yarn or skein";
  if (/\b(cocoon|raw silk|wild silk casing)\b/.test(t)) return "Cocoon or raw material";
  if (/\b(sari|coat|choga|dress|robe|mantle|shawl|scarf|stole|cape|cope|surcoat|waitao|\bao\b|obi|wrapper|pelisse|shroud|belt|kesa|hitoe|kimono|cloak|costume|garment|dhoti|lungi|kerchief|rumal|chadar|chaddar|chikankari|chikan|pyjama|trouser|jacket|skirt|blouse|purse|bag|quilt|veil|turban)\b/.test(t)) return "Garment or accessory";
  return "Textile or sample";
}

/* ---------- Build the unified archive ---------- */
const archiveItems = Object.values(MUSEUM_ADAPTERS).flatMap(adapter =>
  adapter.source().map(rec => {
    const item = adapter.normalise(rec);
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

const FIBRE_ORDER = ["Tasar", "Tussore / Tussah", "Muga", "Eri", "Wild silk (West Africa)", "Wild silk (Mexico)", "Wild silk (other)", "Other"];

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
      const FORM_ORDER = ["Cocoon or raw material", "Yarn or skein", "Textile or sample", "Garment or accessory"];
      options.sort((a, b) => FORM_ORDER.indexOf(a) - FORM_ORDER.indexOf(b));
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

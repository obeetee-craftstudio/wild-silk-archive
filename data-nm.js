/* ============================================================
   National Museum, New Delhi — wild silk objects
   Source: museumsofindia.gov.in (Ministry of Culture, Govt. of India)
   Every field below is VERBATIM from the source record.
   Do not paraphrase, normalise, or expand abbreviations.
   Fields left blank are pending entry from museum record screenshots.

   Field mapping (museum field → schema key):
     Title                  → title
     Accession Number       → accession
     Object Type            → objectType
     Main Material          → mainMaterial
     Manufacturing Technique→ manufacturingTechnique (only on some records)
     Country                → country
     Origin Place           → placeOfOrigin
     School                 → school                 (only on some records)
     Period/Year of Work    → date
     Dimensions             → dimensions
     Brief Description      → briefDescription
   ============================================================ */

const nmItems = [
  {
    id: 1,
    urlSlug: "nat_del-63-2444-18254",
    accession: "63.2444",
    title: "Sari",
    imageFile: "nm/textile1.png",
    sourceUrl: "https://museumsofindia.gov.in/repository/record/nat_del-63-2444-18254",
    objectType: "Anthropology",
    mainMaterial: "Textile",
    manufacturingTechnique: "Woven",
    country: "India",
    placeOfOrigin: "Odisha",
    placeState: "Odisha",
    date: "20th century",
    dimensions: "Lt. 502.9 cm",
    briefDescription: "A sari woven with Ikat border and ends in tussar silk.",
    fibreBucket: "Tasar"
  },
  {
    id: 2,
    urlSlug: "nat_del-63-2454-18483",
    accession: "63.2454",
    title: "Chadar",
    imageFile: "nm/textile2.png",
    sourceUrl: "https://museumsofindia.gov.in/repository/record/nat_del-63-2454-18483",
    objectType: "Anthropology",
    mainMaterial: "Textile",
    manufacturingTechnique: "Woven",
    country: "India",
    placeOfOrigin: "Sambalpur, Odisha",
    placeState: "Odisha",
    date: "20th century",
    dimensions: "Wd. 106 cm",
    briefDescription: "A tussar silk chadar with black ikat border and ends having a narrow red panel",
    fibreBucket: "Tasar"
  }
];

const nmFilterDefinitions = {
  fibreBucket: ["Tasar", "Tussore", "Eri", "Muga"],
  placeState: [],
  objectType: []
};

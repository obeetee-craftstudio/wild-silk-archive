/* ============================================================
   The Metropolitan Museum of Art — wild silk objects (4 hits)
   Source: Met Open Access API, collectionapi.metmuseum.org.
   Every field below is VERBATIM from the source record.
   Do not paraphrase, normalise, or expand abbreviations.
   ============================================================ */

const metItems = [
  {
    id: 1,
    objectID: 67880,
    accession: "08.248.10",
    title: "Rug",
    objectName: "Rug",
    imageFile: "met/4730.jpg",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/67880",
    culture: "Japan or Central Asia",
    country: "",
    region: "",
    objectDate: "19th century",
    medium: "Foundation: cotton warp, bast fiber weft;  tussah silk knotting",
    classification: "Textiles-Rugs",
    department: "Asian Art",
    creditLine: "Rogers Fund, 1908",
    dimensions: "115 x 115 in. (292.10 x 292.10 cm)",
    fibreBucket: "Tussah"
  },
  {
    id: 3,
    objectID: 445246,
    accession: "08.108.4a–e",
    title: "Panel from a Mantle or Apron",
    objectName: "Panel",
    imageFile: "met/DP229986.jpg",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/445246",
    culture: "",
    country: "India",
    region: "Bengal",
    objectDate: "early 17th century",
    medium: "Cotton, tasar silk; plain weave, embroidered",
    classification: "Textiles-Embroidered",
    department: "Islamic Art",
    creditLine: "Rogers Fund, 1908",
    dimensions: "Textile a: H. 46 3/4 in. (118.7 cm)\n                 W. 13 1/2 in. (34.3 cm)\nTextile b: H. 45 in. (114.3 cm)\n                 W. 14 1/4 in. (36.2 cm)\nTextile c-e: H. 46 in. (116.8 cm)\n                    W. 15 1/4 in. (38.7 cm)\n\nMount (Textile b:) H. 48 ½ in (123.2 cm)\n                               W. 18 in. (45.7 cm)\n                                D. 2 ¼ in. (5.7 cm)",
    fibreBucket: "Tasar"
  },
  {
    id: 4,
    objectID: 447703,
    accession: "23.203.1",
    title: "Cope",
    objectName: "Cope",
    imageFile: "met/DP266915.jpg",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/447703",
    culture: "",
    country: "India",
    region: "Bengal",
    objectDate: "early 17th century",
    medium: "Cotton; embroidered in tasar or muga silk",
    classification: "Textiles-Costumes",
    department: "Islamic Art",
    creditLine: "Gift of Lily S. Place, 1923",
    dimensions: "H. 81 in. (206.1 cm)\nW. 39 1/2 in. (100.3 cm)",
    fibreBucket: "Tasar"
  }
];

const metFilterDefinitions = {
  fibreBucket: ["Tasar", "Tussah"],
  department: ["Asian Art", "Islamic Art", "Drawings and Prints"],
  country: ["India", "China"],
  classification: ["Textiles-Rugs", "Textiles-Embroidered", "Textiles-Costumes"]
};

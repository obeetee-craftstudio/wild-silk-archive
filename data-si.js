/* ============================================================
   Smithsonian — Cooper Hewitt (3 records)
   17th-century Bengal tasar embroidery on cotton.
   Catalogued by Cooper Hewitt as "tussah" (20th-c American spelling
   for what is almost certainly Antheraea mylitta = Indian tasar).

   Originally pulled from api.si.edu/openaccess as part of a wider
   Smithsonian wild silk sweep (43 records). The other 40 were
   filtered out because (a) no images, OR (b) they were American mill
   silks / branding records that fail the archive's thesis filter
   (the 9 Indian tasar yarns).

   These 3 records survive because they are CORE Indian wild silk
   objects (Bengal, 17th c) that happen to live in an American
   museum collection. They will fold into the unified archive in
   the next refactor with museum: "Cooper Hewitt" as the tag.

   Source: Smithsonian Institution, api.si.edu/openaccess.
   Every field below is VERBATIM from the EDAN record.
   ============================================================ */

const siItems = [
  {
    id: 1,
    siId: "ld1-1643399887910-1643399922108-1",
    unit: "CHNDM",
    unitName: "Cooper Hewitt, Smithsonian Design Museum",
    title: "Cape",
    objectType: "embroidery & stitching",
    maker: "",
    date: "17th century",
    place: "India for export",
    description: "Research in Progress",
    measurements: "Medium: S-spun tussah silk embroidery, Z-spun cotton foundation Technique: embroidered in chain and back stitch with French knots on two layers of plain weave; inner layer of unspun cotton Label: cotton embroidered with tussah silk in chain and back stitch with French knots",
    creditLine: "Museum purchase through gift of Elizabeth Haynes",
    accession: "1951-41-1",
    collection: "Cooper Hewitt, Smithsonian Design Museum Collection",
    sourceUrl: "http://n2t.net/ark:/65665/kq4778f3abf-a70a-4057-b519-bffd4bb3809c",
    imageUrl: "https://ids.si.edu/ids/deliveryService?id=CHSDM-1951-41-1MattFlynn",
    fibreBucket: "Tussah"
  },
  {
    id: 2,
    siId: "ld1-1643399887910-1643399918714-0",
    unit: "CHNDM",
    unitName: "Cooper Hewitt, Smithsonian Design Museum",
    title: "Coverlet",
    objectType: "embroidery & stitching",
    maker: "",
    date: "17th century",
    place: "Bengal, India",
    description: "Research in Progress",
    measurements: "Medium: tussah silk embroidery on cotton foundation Technique: embroidered in chain stitches on plain weave foundation Label: cotton embroidered in tussah silk",
    creditLine: "Gift of Marian Hague",
    accession: "1947-50-1",
    collection: "Cooper Hewitt, Smithsonian Design Museum Collection",
    sourceUrl: "http://n2t.net/ark:/65665/kq4801c5e9a-5ab8-4437-ac52-1bc7bb52b8b9",
    imageUrl: "https://ids.si.edu/ids/deliveryService?id=CHSDM-CHP6702",
    fibreBucket: "Tussah"
  },
  {
    id: 3,
    siId: "ld1-1643399887910-1643399922069-0",
    unit: "CHNDM",
    unitName: "Cooper Hewitt, Smithsonian Design Museum",
    title: "Coverlet",
    objectType: "embroidery & stitching",
    maker: "",
    date: "17th century",
    place: "Bengal, India",
    description: "Research in Progress",
    measurements: "Medium: cotton, tussah silk Technique: chain stitch embroidery",
    creditLine: "Given by Miss Alice B. Beer",
    accession: "1951-22-1",
    collection: "Cooper Hewitt, Smithsonian Design Museum Collection",
    sourceUrl: "http://n2t.net/ark:/65665/kq49fe53b2b-9732-4e7d-afea-868bc71891a2",
    imageUrl: "https://ids.si.edu/ids/deliveryService?id=CHSDM-1951-22-1MattFlynn",
    fibreBucket: "Tussah"
  }
];

const siFilterDefinitions = {
  fibreBucket: ["Tussah"],
  unit: ["CHNDM"]
};

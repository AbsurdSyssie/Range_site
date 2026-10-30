// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

// Rebuild the non-rendered candidate inventory from private research evidence.
// Run: node bin/source-inventory.js /tmp/opencode/range-source
import fs from "node:fs";
import path from "node:path";
const root = process.argv[2];
if (!root) throw new Error("Pass the directory containing cdx-all.json");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const rows = read("cdx-all.json").slice(1);
const latest = new Map();
for (const [timestamp, original, digest] of rows) {
  const old = latest.get(original);
  if (!old || timestamp > old.timestamp) latest.set(original, { original, timestamp, digest });
}
const inspected = read("inspected-bodies.json");
const inventory = [...latest.values()].map((r) => {
  const body = inspected.find((b) => b.original === r.original && b.timestamp === r.timestamp);
  const pathname = new URL(r.original).pathname;
  let disposition = "Not body-inspected; legacy or optional content omitted pending review";
  if (/\/form\/|\/online-forms\//.test(pathname))
    disposition = "Do not migrate patient forms or handling scripts";
  else if (/\/conditions?\/|\/Library\/|\/wellbeing\//i.test(pathname))
    disposition = "Do not copy clinical advice; link to NHS information instead";
  else if (/\/news\/|covid|flu-clinics|sp_hottopic|closures/i.test(pathname))
    disposition = "Do not migrate dated notices or time-sensitive advice";
  return {
    ...r,
    bodyInspected: !!body,
    disposition: body?.disposition ?? disposition,
    ...(body ? { evidence: body.evidence } : {}),
  };
});
fs.mkdirSync("practice/sources", { recursive: true });
fs.writeFileSync(
  "practice/sources/url-inventory.json",
  JSON.stringify(
    {
      researched: "2026-10-30",
      query:
        "https://web.archive.org/cdx/search/cdx?url=therangemedicalcentre.co.uk/*&output=json&filter=statuscode:200&filter=mimetype:text/html&fl=timestamp,original,digest",
      selection:
        "Maximum timestamp per exact original URL, no collapse. Latest captures across URL variants selected for requested page bodies. A CDX row is not proof that its body was inspected.",
      captureCount: rows.length,
      candidates: inventory,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `${rows.length} captures; ${inventory.length} exact URL candidates; ${inventory.filter((r) => r.bodyInspected).length} bodies inspected.`,
);

// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

// H1/H2/H3/H5/H7/H10: real source-specific audit, not a fictional test fixture.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { load } from "js-yaml";
const root = path.resolve("_preview");
const data = load(fs.readFileSync("practice/practice.yaml", "utf8"));
const evidence = JSON.parse(fs.readFileSync("practice/sources/online-consultation.json", "utf8"));
assert.equal(data.practice.name, "The Range Medical Centre");
assert.equal(data.practice.ods_code, evidence.ods);
assert.equal(data.contact.phone, "0161 870 8099");
assert.equal(data.site.content_last_reviewed, "");
assert.equal(data.gp_earnings.financial_year, undefined);
assert.equal(data.gp_earnings.mean_earnings, 62072);
assert.equal(data.gp_earnings.locum_gps, 1);
assert.equal(data.online_services.online_consultation.url, evidence.url);
const files = fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith(".html"));
assert.equal(files.length, 19);
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.equal((html.match(/Unofficial demo/g) ?? []).length, 1, file);
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/, file);
  assert.match(html, /data-safety="urgent-help"/, file);
  assert.match(html, /href="tel:999"/, file);
  assert.match(html, /href="tel:111"/, file);
  assert.doesNotMatch(
    html,
    /<form\b|<iframe\b|<input\b|<textarea\b|<script[^>]+src="https?:/i,
    file,
  );
  assert.doesNotMatch(
    html,
    /Barlow|Handforth|Didsbury|Fernmoor|Exampleton|01632|P84678|P84034|patchs\.ai|accurx|62,072|GP earnings|Website content last reviewed|MIGRATION-|CONTENT-INVENTORY|web\.archive\.org/i,
    file,
  );
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main, file);
  const copy = main.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  assert.doesNotMatch(
    copy,
    /historical|archived|unverified|unconfirmed|not confirmed|source[- ](?:derived|based)|contact.{0,30}confirm|migration|demonstration|not practice.approved/i,
    file,
  );
  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const local = path.join(root, href.endsWith("/") ? `${href}index.html` : href);
    assert.ok(fs.existsSync(local), `${file}: broken local link ${href}`);
  }
}
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const href = evidence.url.replaceAll("&", "&amp;");
for (const f of ["index.html", "appointments/index.html", "contact/index.html"])
  assert.ok(read(f).includes(`href="${href}"`), f);
for (const file of ["index.html", "appointments/index.html"]) {
  const html = read(file);
  assert.match(html, /phone reception/);
  assert.match(html, /0161.*870.*8099/);
  assert.match(html, /If it is unavailable, phone reception/);
  assert.doesNotMatch(html, /24 hours a day|7 days a week|urgent appointments/);
}
assert.match(read("appointments/index.html"), /4pm to 7:50pm/);
assert.match(read("prescriptions/index.html"), /2 working days/);
assert.match(read("prescriptions/index.html"), /only if you are over 75/);
assert.match(read("prescriptions/index.html"), /agreed telephone arrangement/);
assert.match(read("prescriptions/index.html"), /after 10am/);
assert.doesNotMatch(read("prescriptions/index.html"), /online form|GP Triage/);
assert.match(read("test-results/index.html"), /SMS/);
assert.match(read("contact/index.html"), /121 Withington Road/);
assert.match(read("contact/index.html"), /M16 8EE/);
assert.match(read("about/index.html"), /1-581450737/);
assert.ok(read("register/index.html").includes(evidence.registrationUrl.replaceAll("&", "&amp;")));
assert.match(read("register/index.html"), /10am and 6pm/);
assert.match(read("_headers"), /X-Robots-Tag: noindex, nofollow/);
assert.match(read("_headers"), /Cache-Control: .*no-transform/);
assert.match(read("robots.txt"), /Disallow: \//);
assert.ok(!fs.existsSync(path.join(root, "CNAME")));
console.log(`Audited all ${files.length} demo pages and source-specific journeys.`);

# Migration verification

## Scope

Fresh upstream clone at `/home/oscar/Documents/Code_Projects/Range_site`, based on upstream 9f58d4a. No content, source changes, hosting or DNS changes to the other practice projects are part of this work. Reused only the isolated preview implementation pattern tested in Didsbury commit 75c46f3, not that practice's data. Urgent-help source and production validator unchanged.

This is a user-authorised personal unofficial demo in the user's account, not an authorised practice launch. No false practice sign-off or content review date. All provenance and questions remain outside rendered pages. One global unofficial banner and noindex controls are present on all 19 HTML pages, including 404 and urgent help.

## Identity and source checks

- The Range Medical Centre, P84039; 121 Withington Road, Whalley Range, Manchester, M16 8EE; 0161 870 8099. Practice archive and live NHS profile agree. Do not confuse with nearby Ashville or Whitswood practices or the M16 9EE social search snippet.
- Apex and www returned HTTP 502 on 30 October 2026. Latest inspected home capture is 14 July 2026. Other inspected pages use their own latest successful CDX timestamps, not the home date. Inventory contains 7,242 captures, 2,318 exact URL candidates and 23 inspected practice bodies.
- Exact GP Triage href copied from source appointments, contact and home. Source ODS parameter P84039 verified against NHS. Live landing is generic GP Triage and does not name the practice; no Start Conversation clicked. No invented Accurx/PATCHS route or guessed correction to `medicalcenter.uk`.
- Exact source registration href redirects to the named NHS landing for The Range Medical Centre, Manchester. No registration started or patient data submitted.
- CQC location 1-581450737 matches name and address. The demo links to reports without a “latest” claim or undated rating.
- Older Online Consult route omitted in favour of GP Triage. Generic template app booking/prescription claims replaced only in preview with source-specific pages. Prescription page does not advertise a GP Triage prescription service or unrestricted pharmacy/telephone ordering.

## Automated checks

Baseline `npm ci` and original test suite passed before edits. After implementation:

- `npm run lint`: passed after formatting.
- `PRACTICE_DIR=tests/fixtures/demo-practice npm test`: 42 tests passed, including strict preview validation, known-year/missing/negative cohort failures, phone/hours/review/embed failures, unknown-year whole-block suppression and stale-preview deletion without touching production output.
- Valid fictional fixture: `npm run check`, production `npm run build` and `npm run lint:html` passed with `PRACTICE_DIR=tests/fixtures/demo-practice`. Fixtures use Ofcom fictional phone numbers.
- Actual `npm run check` and actual production `npm run build`: both failed as expected on **gp_earnings.financial_year** and **site.content_last_reviewed** only. Demo warning is intentional. This does not imply that passing technical checks would constitute practice approval.
- Fresh `npm run build:demo`, `npm run lint:html:demo`, `npm run audit:demo`: passed for all 19 HTML pages. Audit checks exact source supplier href, appointment workflow, prescription restrictions, registration link, contact identity, local links, one banner, noindex, urgent help, absence of forms/embeds/remote scripts and absence of other-practice data/provenance prose.
- `uv tool run reuse lint`: passed. No global REUSE command was needed.

Initial demo HTML validation caught ordinary spaces in telephone links. Fixed every affected patient page with non-breaking spaces, then rebuilt and reran validation; no HTML exceptions were added.

## Content and visual review

Read all rendered main-content paragraphs from all 19 pages, including policies, team, registration, results, sick notes, 404 and unchanged urgent help. Full text retained at `/tmp/opencode/range-source/all-rendered-copy.txt`. Patient pages contain normal usable copy; no archive/unverified/confirmation essays. No copied medical advice or old notice payloads. Financial year and review date are absent, not substituted.

Browser-checked home, contact and appointments at **390×844**, **768×1024** and **1440×900**, nine combinations. Full-page screenshots inspected: typography, banner, navigation, cards, booking links, contact table, urgent panel and footer are readable without overlap or clipping. Document scroll width equals viewport width in all nine combinations. Screenshots retained privately in `/tmp/opencode/range-source/range-*.png`; generated browser artefacts are not repository content.

The accessibility statement describes the implementation; it does not claim a WCAG certification or a practice audit. Its preparation date is the actual demo creation date, not a practice content-review date.

## Hosting

Manual Cloudflare Pages upload only; no GitHub integration and no GitHub Pages enablement. Hosting URLs, domain state and update instructions are recorded in `../DEMO.md`. Production CI can remain red intentionally because the actual source lacks required approval/year facts; its validator has not been relaxed.

Cloudflare assigned `range-site-5pt.pages.dev` to the newly created `range-site` project. The custom hostname `range.oddtv.uk` was attached using the Pages API. Zone lookup succeeded but exact-host DNS record access returned 403/code 10000, so no DNS changes were attempted. Correct manual CNAME target is the allocated suffixed hostname, not `range-site.pages.dev`. Recovery API responses contain no credentials and are retained privately in `/tmp/opencode/range-recovery`.

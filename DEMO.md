# The Range Medical Centre: personal unofficial demo

This is a user-authorised personal demonstration, not an official or practice-approved website. No practice approval is claimed. Do not remove the banner or enable search indexing. The practice has not supplied an approved financial year or whole-site review date, so production checking remains blocked.

## Source and safety

- [Content inventory](practice/CONTENT-INVENTORY.md)
- [Questions before an official launch](practice/MIGRATION-QUERIES.md)
- [Verification record](practice/MIGRATION-VERIFICATION.md)
- Exact external booking and registration evidence: `practice/sources/online-consultation.json`.

Practice-specific content lives in `practice/`. Preview-only source-specific pages avoid the template's unsupported generic service claims. `build:demo` cleans and builds `_preview` only, omits unknown-year earnings entirely, validates all remaining data strictly, and defers only a missing earnings block and missing content review date. The production validator is unchanged. One compact global unofficial banner, noindex headers and metadata, disallow-all robots, unchanged urgent help and no patient forms, trackers or supplier embeds.

## Hosting record

Personal owner: AbsurdSyssie. This is not a practice-owned account.

- Public source: `https://github.com/AbsurdSyssie/Range_site`.
- Cloudflare Pages project: `range-site`, manual Direct Upload, branch `main`.
- Custom hostname requested: `range.oddtv.uk` only.
- Pages hostname: `range-site-5pt.pages.dev` (Cloudflare allocated a suffix).
- Custom domain was attached through the Pages API on 30 October 2026. DNS record access returned HTTP 403/code 10000 with the existing personal OAuth login, so **no DNS records were changed**. Initial domain verification was pending.
- Manual DNS action: in the `oddtv.uk` zone, first inspect and preserve any existing exact-host record, then set only **CNAME `range` → `range-site-5pt.pages.dev`**. Preserve apex, wildcard, mail and all other demo records. Cloudflare proxying can be enabled. Verify HTTPS and the correct Range body after validation; attaching a domain is not proof that it is live.
- Immutable deployment URL and live body verification will be recorded after upload.

No GitHub Pages launch or Cloudflare GitHub integration is configured. A source push does **not** deploy this demo. Inherited production workflows may fail the missing required facts by design.

## Manual updates

From this copy, using Node 24 and authenticated personal accounts:

```sh
npm ci
npm run lint
PRACTICE_DIR=tests/fixtures/demo-practice npm test
PRACTICE_DIR=tests/fixtures/demo-practice npm run check
PRACTICE_DIR=tests/fixtures/demo-practice npm run build
npm run lint:html
npm run build:demo
npm run lint:html:demo
npm run audit:demo
uv tool run reuse lint
npx wrangler pages deploy _preview --project-name range-site --branch main
```

Verify the uploaded body against the tested local `_preview` and verify HTTPS before calling any custom hostname live. Never upload `_site`: that folder is for fictional fixture validation only. Never manufacture an earnings year, cohort count or practice review date to bypass production checks.

## Recovery

Credentials and raw evidence remain outside Git. Private recovery evidence belongs in `/tmp/opencode/range-recovery`. Preserve any exact-host pre-existing DNS record before an authorised update. No wildcard, apex, mail or other demo records may be changed. To withdraw the demo, remove this project's deployment/domain only; retain source history. A later official service needs practice-owned hosting and the full sign-off process, not just a new deploy command.

Project creation initially hit Wrangler's new Workers delegation and failed without deploying. The documented `pages project create --force` route created this new legacy Pages project only. Subsequent uploads use normal `pages deploy`, without `--force`.

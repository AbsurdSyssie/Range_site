# Content inventory

Research date: 30 October 2026. This is a personal unofficial demo, not a practice-approved launch. No patient submissions were made. Raw source evidence is retained privately at `/tmp/opencode/range-source`.

## Availability and selection

The live apex and www home pages returned HTTP 502. Live appointments and doctors requests also failed. The current NHS profile and CQC location were accessible. Internet Archive is the fallback for unavailable practice content, not proof that the practice has approved the demo.

The complete, uncollapsed successful-HTML CDX response contains **7,242 captures**. `sources/url-inventory.json` lists **2,318 exact original URL candidates**, each with its latest timestamp and a body-inspected flag and disposition. The initial `collapse=urlkey` query was discovery only and was not used to choose capture dates. The subsequent uncollapsed response was reduced by maximum timestamp per exact original URL; for a page with several host or scheme variants, the latest matching page capture was selected. Latest inspected home: **14 July 2026, 10:18:35 UTC**.

Only **23 candidate bodies** were inspected, not the entire archive. CDX status 200 alone does not mean a body was inspected. Failed fetches, legacy pages, forms and clinical-content candidates remain explicitly distinguished. `bin/source-inventory.js` reproduces the inventory from the private CDX and inspected-body ledger.

## Inspected practice bodies

Each URL below is relative to `https://therangemedicalcentre.co.uk`. The timestamp identifies the exact Wayback capture: `https://web.archive.org/web/<timestamp>id_/https://therangemedicalcentre.co.uk<path>`. Doctors and healthcare team also required the normal replay without `id_` after raw replay connection failures. No older capture was silently substituted.

| Original path | Capture UTC | Inspected content and disposition |
| --- | --- | --- |
| `/` | 20260714101835 | Identity, GP Triage href, registration href, patient journeys. Omitted promotional 24-hour registration guarantee, dated notices and native feedback form. |
| `/appointments/` | 20251211212327 | GP Triage direct booking 24/7, NHS App, Patient Access, phone, in-person booking, 2-week routine window, Wednesday evening, extended access, home visits. Rewritten without clinical triage advice. Displayed updated 12 June 2025. |
| `/contact-us/` | 20260104102542 | 121 Withington Road, M16 8EE, 0161 870 8099, exact map href, hours and parking. No embedded map. Displayed updated 16 October 2025. |
| `/prescriptions/` | 20260113225521 | NHS account, written reception request, postal slip with stamped addressed envelope, restricted pharmacy ordering, agreed housebound telephone requests, 2 working days, pharmacist after 10am. Native prescription forms and clinical advice excluded. Displayed updated 14 October 2025. |
| `/services/new-patients/` | 20260422234300 | Exact registration href, paper forms 10am to 6pm, temporary registration. No promise of instant registration. |
| `/services/new-patients/catchment-area/` | 20260712055237 | Interactive postcode tool and phone eligibility route. Tool not copied; phone route retained. |
| `/services/test-results/` | 20260113210403 | Doctor review, NHS account, SMS on request, contact if further tests/treatment needed. Native results form excluded; reception route retained. |
| `/services/sick-notes/` | 20260207133801 | Phone/in-person 10am to 6pm; first note 2 working days, extensions 5 working days when information sufficient; hospital procedure route. Native forms and self-certification advice replaced by NHS link. |
| `/services/surgery-clinics/` | 20260113220144 | Service categories only: reviews, tests, screening, contraception, immunisation and new patient checks. Do not reproduce old clinic timetable, named session allocations or vaccination advice. |
| `/services/vaccinations/` | 20260516084547 | NHS reference links only; no copied eligibility or clinical advice. |
| `/services/managing-your-health-online/` | 20260516090511 | NHS account/Patient Access capabilities. Old Online Consult href superseded by GP Triage in home, appointments and contact; no dual supplier routes. Displayed update 20 October 2023. |
| `/surgery-information/` | 20260113225342 | Practice history, purpose-built centre, disabled access, mission and training practice context. |
| `/surgery-information/staff/` | 20260113222736 | Team category navigation; inspected linked doctors, nursing, practice and healthcare pages separately. |
| `/surgery-information/staff/doctors/` | 20260113220747 | Seven GPs and three advanced clinical practitioners. No invented partner/salaried labels. Displayed updated 11 September 2025. |
| `/surgery-information/staff/nursing-staff/` | 20260614195744 | Katherine Parker, Gaynor Smith and Jacinta Bennett with source roles. Displayed updated 21 February 2025. |
| `/surgery-information/staff/practice-team/` | 20260614191945 | Management, receptionists, secretaries and data team names and roles. Displayed updated 14 October 2025. |
| `/surgery-information/staff/healthcare-team/` | 20260423002232 | Neighbourhood and counselling teams referencing old Central Manchester CCG; omitted from demo. |
| `/surgery-information/opening-times/` | 20260712051719 | Full weekly table and separate extended-hours appointments. Displayed updated 11 June 2025; source/NHS Monday discrepancy in queries. |
| `/surgery-information/feedback-and-complaints/` | 20260614190213 | Phone, written address, 12-month period, consent on behalf of others. Native feedback forms omitted. |
| `/surgery-information/cqc-rating/` | 20260207140153 | Exact location 1-581450737; live CQC corroborated address. Link only, no undated rating or “latest” assertion. |
| `/surgery-information/patient-participation-group/` | 20260516075544 | Volunteer group purpose; no imported events/minutes or native join form. Published and updated 10 April 2026. |
| `/surgery-information/policies/` | 20260113213439 | Policy navigation inspected, not all linked policies. Followed earnings; fair processing fetch failed. |
| `/surgery-information/policies/gp-earnings/` | 20260423003638 | £62,072; 1 full-time, 6 part-time, 1 locum, over 6 months. No financial year named. Displayed updated 28 March 2024 does not establish year. Preserve source cohorts, suppress entire declaration from demo. |

## Other bodies and exclusions

- NHS live main and contact profile: `https://www.nhs.uk/services/gp-surgery/the-range-medical-centre/P84039` and its `/contact-details-and-opening-times` page. Confirms identity, phone, postcode and accepting new patients. Contact profile last confirmed 10 February 2025.
- CQC live `https://www.cqc.org.uk/location/1-581450737`: 121 Withington Road, M16 8EE; Good report published 11 April 2018, review 6 July 2023. The older 0844 number is not used.
- GP Triage exact source href and registration redirect checks are recorded in `sources/online-consultation.json`. Live initial landing pages inspected only, no form started. GP Triage does not display the practice name before starting; source href and ODS identify its intended target.
- `https://web.archive.org/web/20260712063124id_/https://therangemedicalcentre.co.uk/surgery-information/policies/fair-processing-notice/` and website privacy statement capture 20260422234158 could not be retrieved. No practice privacy policy was invented. Brief notice-on-request used under the skill's permitted route.
- Legacy `/practice-information/gp-earnings/` capture 20220813233955 was retrieved but not substantively inspected or used. The current-path earnings body above is the actual source.
- No native forms, WordPress assets, source JavaScript, supplier embeds, trackers, clinic eligibility advice, fee schedules, outdated notices or historic pandemic pages are copied. Accessibility/cookie pages describe this implementation, not the old WordPress service.

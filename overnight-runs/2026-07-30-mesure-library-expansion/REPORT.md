# MESURE Library Expansion Report

## Outcome

- Scheduled for 2026-07-30 17:00–22:00 JST.
- Starting library count: 181.
- Final library count: 189.
- Net increase: 8 searchable and renderable opportunity records.

## Changes

- Added `WMF 2027 — Call for Buskers` in Bologna as an open selection route with no published deadline or financial terms.
- Added `MAIN ST. Fort Worth Arts Festival 2027 — Entertainers Application` for variety, street and children’s entertainment, with artist-paid travel and lodging explicitly recorded.
- Added `National Folk Festival 2027 — Circus & Street Performer Applications` in Canberra as a closed 2027 cycle and future watch route; international participation, delivered-fee structure and artist costs are recorded.
- Added `CAMPUS PCS — Artistic Residencies Programme` in Porto as a future international route for circus and other performing arts; the closed cycle's three-week studio, accommodation and €1,650 grant are recorded without treating the separate Reclamar Tempo rules as equivalent.
- Added `RAMDAM — Second-Semester 2027 Residency Call` in Sainte-Foy-lès-Lyon as an upcoming creation/research route. The December 11 opening, February 7 deadline, 60-file early cap, four-week minimum, €1,500 grant and capped daily expense support are recorded.
- Added `FRINGE WORLD 2027 — Event Registration` in Perth as a current worldwide open-access route. Its October 7 deadline, required venue agreement, tiered AUD 175–335 registration fees, ticket handling fees and self-production costs are explicit.
- Added `APAP|NYC 2027 — UP NEXT! Artist Pitch Session` in New York as a current international application for U.S.-tour-ready new work. Its August 21 EDT deadline, maximum 12 selections, audience of about 200 presenters/producers, membership requirement and unsubsidized travel are explicit.
- Added `Sankofa Square — 2026–2027 Busker Program` in Toronto as a current nearby route. Its CAD 20 plus HST permit, CAD 2 million liability-insurance requirement, biweekly availability notices, on-site lottery and donation-only income model are explicit.

## Added Records

1. `WMF 2027 — Call for Buskers`
2. `MAIN ST. Fort Worth Arts Festival 2027 — Entertainers Application`
3. `National Folk Festival 2027 — Circus & Street Performer Applications`
4. `CAMPUS PCS — Artistic Residencies Programme`
5. `RAMDAM — Second-Semester 2027 Residency Call`
6. `FRINGE WORLD 2027 — Event Registration`
7. `APAP|NYC 2027 — UP NEXT! Artist Pitch Session`
8. `Sankofa Square — 2026–2027 Busker Program`

## Verification

- Baseline hashes and Git state recorded before scheduling.
- Incremental JSON/count checks at 184, 186, 188 and 189 records: passed.
- Fresh application builds and wave-level rendered/data tests: passed.
- Protected `.gitignore` and `data/funding.json` hashes remain identical to the run baseline.
- Final `jq -e 'type == "array"' data/festival-radar.json`: passed.
- Final count and unique-ID assertion for 189 records: passed.
- Final `npm test`: passed, including application build and all 25 tests.
- Final `npm run lint`: passed.
- Final `npm run typecheck`: passed.
- Final `git diff --check`: passed.

## Pre-existing State Preserved

- `.gitignore` and `data/funding.json` are already modified and are outside this run’s writable scope.
- Existing local changes in `data/festival-radar.json` and `tests/rendered-html.test.mjs` form the 181-record starting baseline and must not be rolled back.

## Unverified States

- No production deployment or public GitHub Pages state will be checked or changed by this run.
- The two Wave 1 open calls do not publish a deadline or complete hosting terms; their records preserve those facts as unknown and require written confirmation.
- RAMDAM publishes no residence or nationality restriction for its general semester call, but Quebec eligibility and remote-interview availability still require written confirmation.
- The currently open CAMPUS PCS Reclamar Tempo call was not added because the official programme rules currently indexed by the organizer require national-territory residence.
- FRINGE WORLD is directly accessible but financially exposed: venue, production, technical, insurance, travel and lodging costs are not supplied by open-access registration.
- APAP UP NEXT! accepts projects from abroad but requires a genuinely U.S.-tour-ready project and does not subsidize participation or travel.
- The 6Fest participation page describes its annual international route but currently links to an expired 2026 form with an August 1, 2025 deadline; no new 2027 record was added.
- Awaji Art Circus, Buskers Bern and Halifax Busker Festival were confirmed as already present and were not duplicated.

## Blockers

- None. An initial test rejected an unresolved participation enum; the records were correctly classified as selection routes without changing the documented eligibility uncertainty.

## Morning Decisions

- Review the local records and decide separately whether to commit, push or publish them.
- No deployment, Git push, public release, external message, purchase or secret change occurred during this run.

# MESURE Library Expansion State — Until 10:00 JST

## Status

- Status: COMPLETE
- Last updated: 2026-08-01 10:03 JST
- Current wave: 32 — final verification and handoff

## Baseline

- Git branch and commit: `main` at `bbd4609061c329db40d2460d59f6d1554c007822`
- Starting library count: 189
- Starting `data/festival-radar.json` SHA-256: `877679eab6009c2b192c4de11fd9ee64c994201827989f096e78549be77b6763`
- Starting `tests/rendered-html.test.mjs` SHA-256: `5511badf301ef81930470cde86755acd82c505c75e34c02c5b85cc5be02fea35`
- Pre-existing modified files: `.gitignore`, `data/festival-radar.json`, `data/funding.json`, `tests/rendered-html.test.mjs`
- Pre-existing untracked path: `overnight-runs/`
- Protected files: `.gitignore` SHA-256 `a0561b0ac6f8b8448a4c23c7f0d96894ceb59f392049637e48f45484d824f686`; `data/funding.json` SHA-256 `a958e7f06549b2324e9b65224de4136ed610e979748143ec89bdd1b959cb206e`

## Completed Waves

- Previous run completed at 189 records with eight verified additions and all final checks passing.
- Wave 0: Created a separate bounded ledger for continued work through 2026-08-01 10:00 JST.
- Wave 0: Confirmed Toronto Fringe and Vancouver Fringe are already present in the 189-record baseline.
- Wave 0: Created hourly thread heartbeat automation `mesure-10`; its last scheduled occurrence is 2026-08-01 10:00 JST.
- Wave 1: Added `caledonia-fair-entertainment-2026-open`, an open 2026 Ontario selection route that explicitly accepts busker and variety/novelty acts.
- Wave 1: Rejected Thunder Bay Buskers Festival because the published 2026 event dates had already passed; rejected Coquitlam Music in the Streets and Cathedral Village Arts Festival because their official 2026 deadlines had passed.
- Wave 2: Added `banff-independent-theatre-dance-2027-28-upcoming`, an international Alberta residency route for performance-based and interdisciplinary work, with circus suitability and apparatus requirements explicitly left for confirmation.
- Wave 2: Did not add Contact East 2026 because the event had passed, or Sable Island Institute because the published residency eligibility is limited to artists from the four Atlantic provinces.
- Wave 3: Confirmed that the current library already covers the principal Canadian 2027 fringe routes found in this sweep, including Winnipeg, Edmonton, Toronto, Vancouver, Halifax, Saskatoon, Ottawa, Montréal and the CAFF touring route.
- Wave 3: Did not add Fort McMurray Fringe because official sources confirm the 2026 event but do not yet publish a 2027 artist route, deadline and eligibility set sufficient for a record.
- Wave 4: Added `asheville-fringe-arts-2027-open`, a juried 2027 U.S. fringe route currently open to live work, installations and other discussed forms through September 30, 2026.
- Wave 5: Added `tucson-fringe-2027-open`, an unjuried and uncensored 2027 U.S. fringe route currently open through September 1, 2026, with live, short-form and pre-recorded options selected by lottery.
- Wave 6: Confirmed Tampa Fringe 2027 was already represented by `tampa-fringe-2027`; no duplicate record was added.
- Wave 6: Added `jolt-performing-arts-festival-2027-open`, an adjudicated contemporary performance route in Columbia, South Carolina, currently open through August 31, 2026.
- Wave 7: Confirmed Kyoto Art Center’s 2027 performing-arts residency was already represented; no duplicate record was added.
- Wave 7: Added `subscena-performance-residency-2027-open`, an international experimental performance, dance and circus route in Zagreb with separate performance and residency forms and an August 20, 2026 deadline.
- Wave 7: Changed `imaginarius-2027` from `open` to `watch` after its official July 30, 2026 deadline passed; this was detected by the date-sensitive regression test.
- Wave 8: Added `visegrad-performing-artist-residency-2027-upcoming`, a one-month new-circus and physical-theatre residency opening September 15, 2026, restricted to V4-country citizens with a host in another V4 country.
- Wave 9: Added `circo-fest-canada-2027-open`, a current Calgary aerial circus, acrobatics and dance competition with independent entry, adult divisions and detailed rigging support.
- Wave 10: Added `neffa-festival-performer-2027-upcoming`, a nearby 2027 U.S. folk-performance showcase opening September 15 for music, dance, storytelling, creative drama and participatory work; circus fit remains a written-confirmation item.
- Wave 10: Did not add ODUNDE because its current official open call is for the African & African Diasporic Art Show rather than live performance programming.
- Wave 11: Added `institut-francais-cite-arts-residency-2027-open`, an open Paris residency explicitly accepting street arts and circus from all nationalities, with housing and minimum monthly support but mandatory submission and financing by an associated cultural partner.
- Wave 11: Did not add the CCHAR 2027 public-space creation residency because its April 12, 2026 deadline had passed and eligibility was limited to Swiss artists or artists domiciled in Switzerland.
- Wave 12: Added `performnord-2027-open`, a funded Copenhagen performance-art platform accepting Nordic professional artists based abroad, including eligible Nordic artists living in Quebec, with live, studio and dialogue presentation formats.
- Wave 13: Added `cirque-du-soleil-performer-casting-open`, the official rolling Cirque du Soleil onstage casting route for adult circus performers, open to direct submission from Quebec with no published nationality restriction or deadline.
- Wave 14: Added `les-7-doigts-artist-casting-open`, the Montréal collective’s continuously updateable artist-profile route covering multidisciplinary circus and adjacent performers.
- Wave 14: Added `machine-de-cirque-artist-casting-open`, the Québec City company’s direct circus-artist submission route requiring a résumé, two distinct performance-video links and recent photos.
- Wave 15: Added `cirque-eloize-artist-profile-open`, the Montréal company’s official artist-profile registration route, kept separate from its general spontaneous job application.
- Wave 15: Added `cirque-eloize-artistic-residency-open`, a direct inquiry route for professional circus artists and companies developing, researching or preparing a tour; all price, selection and project-specific support terms remain explicit verification items.
- Wave 16: Added `lyra-bright-wild-2027-circus-commission-open`, a paid Edinburgh lead-artist commission explicitly open to circus and other live-performance practices through September 1, 2026.
- Wave 16: Added `cirkusexpo-2027-pitch-preview-upcoming`, an August 17 opening for a Nordic contemporary-circus marketplace, with the Sweden/Denmark/Finland affiliation rule kept as an unresolved eligibility gate for Quebec-based artists.
- Wave 17: Added `rosas-artist-residency-2027-28-upcoming`, a June 1, 2027 international dance/performance residency opening that previously accepted any nationality but provided studio and mentoring without artist fee, travel, lodging or production budget.
- Wave 17: Did not add Beirut Choreography Encounters 2026 because its international deadline had passed on June 20, 2026, or VERVE because its current residency is restricted to Global Majority artists based on the African continent.
- Wave 18: Added no record. Tampa, Toronto and Asheville 2027 fringe routes were already represented; Scranton offers only a notification waitlist, Theatre Crude publishes only an early-2027 opening window, and Port Fairy publishes only a 2027 notification subscription without an application period, deadline or selection/support terms.
- Wave 18: Did not add CresFest’s current artist EOI because it is limited to folk and roots music; its busking competition is only announced as a later opportunity with no current application terms.
- Wave 19: Confirmed INAF27 was already represented and avoided a duplicate record.
- Wave 19: Added `tehran-mobarak-puppet-festival-2026-open`, a current international puppetry showcase with an August 1 deadline; all unpublished support, entry, travel and citizenship-specific constraints remain explicit written-confirmation gates.
- Wave 20: Added `perform-europe-2026-28-touring-open`, a major European touring fund explicitly covering circus and outdoor arts while preserving the boundary that Quebec-based entities cannot be partners, although Quebec-created work and performers of any nationality can be included by an eligible European partnership.
- Wave 21: Added `ludwigsburg-street-music-festival-2027-upcoming`, the announced end-of-2026 application route for artists, jugglers and clowns, without carrying the 2026 benefits or missing international eligibility terms forward as facts.
- Wave 22: Added `arteventura-artist-residency-2027-open`, an open rolling 2027 Spanish residency accepting professional artists across contemporary disciplines, with its substantial participant fees and lack of stipend made explicit.
- Wave 23: Confirmed that 6Fest Plovdiv and Évora 2027 were already represented and did not add duplicates.
- Wave 23: Added `eofa-art-stories-residency-2027-open`, a direct international Geneva residency for professional artists over 28 with private accommodation and a CHF 1,400 monthly stipend.
- Wave 24: Added `swiss-circus-arts-network-residency-2027-28-open`, a multi-venue contemporary-circus residency with free accommodation, rehearsal space and weekly support, while preserving its mandatory Swiss-member or Swiss-work-base condition.
- Wave 25: Confirmed that Cirque de Demain, Pflasterspektakel Linz and Halifax Busker Festival were already represented and did not add duplicates.
- Wave 25: Added `klang-music-movement-2027-open`, a direct Copenhagen performance route aiming to cover production and performer fees for small production-ready MUSIC/MOVEMENT work.
- Wave 26: Rejected AIR Taipei 2027 because the official call is closed; confirmed IMMAGINA Rome, FMTM and FIAMS are already represented and avoided duplicates.
- Wave 26: Added `festival-animated-objects-incubator-2026-28-open`, an urgent Calgary-area puppetry and mask incubator with an August 2 deadline, first-year development fee and project budget, while preserving its local-residence restriction.
- Wave 27: Added `yaddo-performance-residency-nov-2026-jun-2027-open`, a current New York State residency open to professional and promising emerging artists from all nations in choreography, performance art and live multimedia, with room, board and studio provided and its individual-artist, degree-enrolment and auxiliary-role exclusions made explicit.
- Wave 28: Added `bogliasco-fellowships-next-cycle-upcoming`, an officially announced fall reopening for the next Bogliasco Fellowship cycle, preserving the current closed-portal state, unpublished opening/deadline, international Dance/Theater access, full room-and-board support and the need to confirm circus fit.
- Wave 29: Added `macdowell-spring-summer-2027-upcoming`, an August 17 opening and September 10 deadline for a nearby international residency route covering performance/devised/generative theatre and movement-based interdisciplinary work, with no residency fee, room, board, studio and need-based stipend and international travel support.
- Wave 30: Added `millay-arts-core-residency-april-july-open`, a current October route in New York State with a fully subsidized two-week or month-long residency, an all-disciplines two-person collaboration path and explicit room, studio and food support; the public deadline-time conflict and non-Canadian eligibility confirmation remain visible rather than inferred away.
- Wave 31: Added `ucross-fall-2027-residency-upcoming`, an explicitly international November opening for performance artists, dancers, choreographers and collaborative teams, with no residency charge, room, meals, private workspace, a USD 1,500 stipend and a published sprung-floor dance facility.
- Wave 31: The date-sensitive test exposed six July 31 calls still marked `open`; changed Circunstruction #15, Contact Ouest, Carthage Theatre Days, Kyoto Art Center, SoloStage Krakow and Smethwick Puppetry to `watch` and moved their next review to September 1 without changing their historical deadline evidence.
- Wave 32: Stopped research and additions, completed the full final verification suite at 221 records and prepared the local-only handoff. Net change from the 189-record baseline is +32 records.

## Current Wave

- Current library count: 221.
- Changed writable files: `data/festival-radar.json`, `tests/rendered-html.test.mjs`, this `STATE.md`, and `REPORT.md`.
- Wave 14 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Les 7 Doigts and Machine de Cirque casting fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 15 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Cirque Éloize casting and residency fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 16 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Lyra commission and CirkusExpo fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 17 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Rosas residency fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 18 verification: JSON count remained 208; unique IDs, unique title/city/source tuples, protected-file hashes and writable-path `git diff --check` passed. No library or regression-test change was made, so the previously passing 25-test result remains the latest application test run.
- Wave 19 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Tehran-Mobarak fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 20 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Perform Europe fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 21 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Ludwigsburg fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 22 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Arteventura fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 23 verification: JSON array/count, unique IDs, unique title/city/source tuples and required EOFA fields passed. The initial test run rejected the temporary `eligibility_check` taxonomy; after classifying the official direct international route as `international`, `npm test` passed all 25 tests. Protected-file hashes remained unchanged and `git diff --check` passed for writable paths.
- Wave 24 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Swiss Circus Arts Network fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 25 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Klang fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 26 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Festival of Animated Objects fields passed; `npm test` passed all 25 tests; protected-file hashes remained unchanged; `git diff --check` passed for writable paths.
- Wave 27 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Yaddo deadline, international-access, support and Quebec-assessment fields passed. The first regression run correctly caught the stale rendered-row count; after changing the expected count from 216 to 217, `npm test` passed all 25 tests. Protected-file hashes remained unchanged and `git diff --check` passed for writable paths.
- Wave 28 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Bogliasco upcoming-status, unpublished-deadline, international-access, support and Quebec-assessment fields passed; `npm test` passed all 25 tests. Protected-file hashes remained unchanged and `git diff --check` passed for writable paths.
- Wave 29 verification: JSON array/count, unique IDs, unique title/city/source tuples and required MacDowell opening-state, deadline, next-check date, international-access, support and Quebec-assessment fields passed; `npm test` passed all 25 tests. Protected-file hashes remained unchanged and `git diff --check` passed for writable paths.
- Wave 30 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Millay open-state, deadline, published-time-zone, support and conditional Quebec-assessment fields passed; `npm test` passed all 25 tests. Protected-file hashes remained unchanged and `git diff --check` passed for writable paths.
- Wave 31 verification: JSON array/count, unique IDs, unique title/city/source tuples and required Ucross opening-state, deadline, time-zone, international-access, stipend and Quebec-assessment fields passed. The first two date-sensitive test runs successively exposed six July 31 records still marked `open`; after moving all six to `watch`, `npm test` passed all 25 tests. Protected-file hashes remained unchanged and `git diff --check` passed for writable paths.
- Wave 32 final verification: JSON array and 221-count checks passed; ID and title/city/source tuple uniqueness passed; no dated `open` record remains before 2026-08-01; `npm test` passed all 25 tests; `npm run lint`, `npm run typecheck` and repository-wide `git diff --check` passed. Protected `.gitignore` and `data/funding.json` hashes remained exactly at their recorded baselines.

## Next Action

- No further automated action. Review the local 32-record expansion and decide separately whether to commit, push or publish.

## Blockers

- None.

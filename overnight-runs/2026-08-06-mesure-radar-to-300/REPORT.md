# Morning Report

## Outcome

- Complete. Reached and publicly verified the target of 300 official-source radar records by 08:00 JST: 92 open, 34 upcoming and 174 watch.

## Changes

- Added six official-source records, all with complete French, English and Japanese decision guides: Platform Dalí 2027 (Barcelona), Otte1 Scholarships 2027 (Eckernförde), CUSP 2027 (Reykjavík; not direct from Québec under its European residence rule), pIAR 2027 (Kumasi; self-funded), Onassis AiR next call (Athens) and DRIFT 2027 (Berlin).
- Updated the radar count assertion (245 → 251), decision-guide inventory and README count. No funding data or ignore rules were touched.

## Verification

- Active ledger validation passed at 00:35 JST. Initial title/city/source duplicate rules and primary-source-only boundaries were re-established before research.
- At 01:01 JST: JSON parsing, added-record ID/title-city/source checks, `npm test` (26/26), lint, typecheck, funding audit and `git diff --check` passed. Protected `.gitignore` and `data/funding.json` hashes remain identical to baseline.
- The validated batch was deployed to the existing production site. At 01:04 JST, both the Sites production URL and the custom-domain `/radar` route externally rendered 251 rows.
- Wave 3 added five further official-source records: PLAYFUL OBSCURA (Accra; Africa-based eligibility), Singapore Art Week 2027 (Singapore-based lead eligibility), FILE NOT FOUND global archive residencies, Tabakalera ASTS (Spain/Germany eligibility) and Creative New Zealand’s Berlin Visual Arts Residency (New Zealand eligibility). The working total is 256 (73 open, 34 upcoming, 149 watch).
- At 01:22 JST, the five additions passed individual ID/title-city/source collision checks and complete FR/EN/JA guide checks, followed by `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification.
- The Wave 3 batch was committed, pushed and deployed. At 01:29 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 256 rows.
- Wave 4 added three non-duplicate official-source records: Oolite Arts Home + Away / Bag Factory Johannesburg (regional U.S. rule), Instituto Sacatar’s Bahia Mundo African-resident route, and GROTTA AIR Spain 2027 (international, self-funded). A Rosas candidate was rejected for duplicating the existing Rosas record before commit. Working total: 259 (74 open, 34 upcoming, 151 watch).
- At 01:46 JST, added-record collision and complete FR/EN/JA guide checks, `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification passed.
- The Wave 4 batch was committed, pushed and deployed. At 01:50 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 259 rows.
- Wave 5 added three non-duplicate official-source next-watch records: ACC CREATORS 2026 (Gwangju; global applications and published project support), Khoj International Residency 2026 (New Delhi; international applicants with travel, per diem and production support), and Pivô Salvador 2026 (Brazil; published resident/age criteria but no stated territorial gate). The working total is 262 (74 open, 34 upcoming, 154 watch); Pivô therefore remains `verify` for a Québec route.
- At 02:04 JST, added-record title/city/source collision and complete FR/EN/JA guide checks, `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification passed.
- The Wave 5 batch was committed as `e1efdca`, pushed and deployed as Sites version 47. At 02:07 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 262 rows.
- Wave 6 added three non-duplicate official-source next-watch records: ARCUS Project 2026 Ibaraki (Moriya; global, fully funded), ACAC 2026 “EAT” (Aomori; outside-Japan places and published support), and Arts House The Warehouse Residency 2026–27 (Melbourne; Australian-based access only). Working total: 265 (74 open, 34 upcoming, 157 watch). The Arts House route is `not_direct` for a standalone Québec applicant rather than treated as international access.
- At 02:24 JST, added-record title/city/source collision and complete FR/EN/JA guide checks, `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification passed.
- The Wave 6 batch was committed as `7bdc937`, pushed and deployed as Sites version 48. At 02:26 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 265 rows.
- Wave 7 added three non-duplicate official-source records: Bodhi Khaya Artist Residency 2026 (Gansbaai; international next watch), Peru Bienal Integral Art Residence 2026 (Lima; open to all nationalities), and Cultural Foundation Art Residency 2026–27 (Abu Dhabi; UAE-residence documents required). Working total: 268 (75 open, 34 upcoming, 159 watch). Peru Bienal and Bodhi Khaya’s unitemized finance terms remain `verify`; the Abu Dhabi route is `not_direct` for a standalone Québec applicant.
- At 02:43 JST, added-record title/city/source collision, complete FR/EN/JA guide, and cross-language-character checks passed, followed by `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification.
- The Wave 7 batch was committed as `b5e5c03`, pushed and deployed as Sites version 49. At 02:47 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 268 rows.
- Wave 8 added three non-duplicate official-source records: Singapore Art Museum Residencies Cycle 4 (2027–28; open worldwide), Fundación Casa Wabi × ArtReview Residency Prize 2027 (Puerto Escondido; all nationalities), and 421 Arts Campus Residency 2026 (Abu Dhabi; MENASA condition). Working total: 271 (76 open, 34 upcoming, 161 watch). 421 is `not_direct` for a standalone Québec applicant; SAM and Casa Wabi have precise support/cost separation in their decision guides.
- At 03:04 JST, added-record title/city/source collision, complete FR/EN/JA guide and cross-language-character checks passed, followed by `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification.
- The Wave 8 batch was committed as `7b2957b`, pushed and deployed as Sites version 50. At 03:06 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 271 rows.
- Wave 9 added three non-duplicate official-source records: MORA Monterrey 2026 (international next watch), Bestiario Oaxaca 2026 (paid next watch), and Padimai OOPS Onchain Residency 2026 (Singapore; open remote call). Working total: 274 (77 open, 34 upcoming, 163 watch). MORA’s full finance terms and Padimai’s territorial, compensation and digital-rights conditions are explicitly `verify`; Bestiario is `self_funded`.
- At 03:23 JST, added-record title/city/source collision, complete FR/EN/JA guide and cross-language-character checks passed, followed by `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification.
- The Wave 9 batch was committed as `5579a99`, pushed and deployed as Sites version 51. At 03:26 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 274 rows.
- Wave 10 added three non-duplicate official-source records: CPR North Africa Curatorial Research 2026 (international, fully funded), NESR Luanda 2026 (listed Lusophone-African countries), and Oceania Pacific Arts Residency 2026 (Australia/New Zealand/Fiji route). Working total: 277 (77 open, 34 upcoming, 166 watch). NESR and Oceania Pacific are accurately `not_direct` for a standalone Québec applicant.
- At 03:43 JST, added-record title/city/source collision, complete FR/EN/JA guide and cross-language-character checks passed, followed by `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification.
- The Wave 10 batch was committed as `8257bf7`, pushed and deployed as Sites version 52. At 03:46 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 277 rows.
- Wave 11 added three non-duplicate official-source records: Plexus Projects Remote Artist Residency 2026–27 (global remote, open and self-funded), Tokyo Biennale 2027 SOCIAL DIVE (Tokyo; open worldwide and materially supported), and Light Work Artist-in-Residence Program 2028 (Syracuse; next watch after the 2027 cycle closed). Working total: 280 (79 open, 34 upcoming, 167 watch).
- At 04:05 JST, added-record title/city/source collision, complete FR/EN/JA guide and cross-language-character checks passed, followed by `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification.
- The Wave 11 batch was committed as `5416459`, pushed and deployed as Sites version 53. At 04:07 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 280 rows.
- Wave 12 added two non-duplicate official-source Asia records: AIAV Fellowship 2026 (Mine, Yamaguchi; closed next-watch with funding/reference-gated access) and AIR 3331 Tokyo Open Call Residency (rolling, self-funded). Existing Kyoto Art Center and Kinosaki records were excluded as duplicates before editing. Working total: 282 (80 open, 34 upcoming, 168 watch).
- At 04:24 JST, added-record title/city/source collision, complete FR/EN/JA guide and cross-language-character checks passed, followed by `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification.
- The Wave 12 batch was committed as `ec9bb3b`, pushed and deployed as Sites version 54. At 04:27 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 282 rows.
- Wave 13 added three non-duplicate official-source records: Ubuntu Art Residency 2027 Global Launch (Masindi, Uganda; next watch), AIR in Tainan 2027 at Tsung-yeh, and AIR in Tainan 2027 at Soulangh Cultural Park. The official Tainan records expose deadline and venue but no accessible detailed terms, so both guides explicitly retain Québec eligibility and finances as `verify`. Working total: 285 (82 open, 34 upcoming, 169 watch).
- At 04:44 JST, added-record title/city/source collision, complete FR/EN/JA guide and cross-language-character checks passed, followed by `npm test` (26/26), lint, typecheck, funding audit, whitespace check and protected-hash verification.
- The Wave 13 batch was committed as `bc6f73f`, pushed and deployed as Sites version 55. At 04:47 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 285 rows.
- Wave 14 added five non-duplicate official-source records: Spier Light Art 2027 next call (Stellenbosch), Casa Na Ilha Multidisciplinary Residency 2027 (Ilhabela), Art Junction Residency 2026–2027 (Udaipur), Guyan Painting Village next call (Lishui), and Green Olive Arts 2027 seasons (Tetouan). Working total: 290 (85 open, 34 upcoming, 171 watch).
- At 05:10 JST, added-record title/city/source collision and complete FR/EN/JA guide checks, including cross-language-character scan, passed alongside `npm test` (26/26), lint, typecheck, funding audit, whitespace and protected-hash verification.
- The Wave 14 batch was committed as `ee34e07`, pushed and deployed as Sites version 56. At 05:12 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 290 rows.
- Wave 15 added five non-duplicate official-source records: Nawat Fes 2027–2028 next call, Greenhills Art Centre residency (Western Australia), Proyecto´ace PIRAR 2026–2027, Salamanca Arts Centre Artists’ Cottage next call, and Casa Belgrado Collective Residency 2026. Working total: 295 (88 open, 34 upcoming, 173 watch).
- At 05:24 JST, added-record title/city/source collision and complete FR/EN/JA guide checks, including cross-language-character scan, passed alongside `npm test` (26/26), lint, typecheck, funding audit, whitespace and protected-hash verification.
- The Wave 15 batch was committed as `b3907ad`, pushed and deployed as Sites version 57. At 05:26 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 295 rows.
- Wave 16 added five non-duplicate official-source records: A4 International Residency (Chengdu), BigCi Artist Residency (Bilpin), Yasmine Laraqui Studio’s Mers Sultan residency (Casablanca), We-Che International Art Residency (Trevelin), and the next R.A.R.O. Bogotá call. Working total: 300 (92 open, 34 upcoming, 174 watch). The records separate published self-funded costs and application-language requirements from terms that still require direct confirmation.
- At 05:49 JST, added-record title/city/source collision and complete FR/EN/JA guide checks, including cross-language-character scan, passed alongside `npm test` (26/26), lint, typecheck, funding audit, whitespace and protected-hash verification.
- The Wave 16 batch was committed as `55db584`, pushed and deployed as Sites version 58. At 05:51 JST both the Sites production URL and the custom-domain `/radar` route externally rendered 300 rows.
- A thread heartbeat was created and rendered successfully; it will continue 20-minute bounded waves until the 08:00 JST cutoff.

## Pre-existing State Preserved

- The existing untracked `overnight-runs/` directory is preserved. Only this run subdirectory is created.

## Unverified States

- Future official calls, external payment, visas, detailed technical specifications, and any organizer terms not published on official pages remain unverified unless a record states otherwise.

## Blockers

- None at setup.

## Morning Decisions

- None. Continue source refresh through the records’ stated next-check dates; organizer terms that were not published remain explicitly marked for verification.

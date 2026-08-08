# Morning Report

## Outcome

Complete. The run corrected time-sensitive status and support data, revalidated high-value open routes, completed cross-dataset integrity checks, and passed the final local verification suite. Nothing was pushed, deployed, or published.

Final counts remain 6 top opportunities, 176 radar records, and 75 funding records. No records were added or removed. Compared with the baseline, 37 radar records and 2 funding records changed.

Radar status became more conservative: 43 open / 19 upcoming / 114 watch at baseline changed to 40 open / 17 upcoming / 119 watch.

## Changes

- Run ledger created.
- Houston Arts Alliance SACI 2027 and Festival Grant 2027 are marked closed after their official July 24, 2026 11:59 p.m. CDT deadlines.
- Both records retain the official deadline and eligibility sources and now schedule a next-cycle check for May 15, 2027.
- Three expired radar calls were moved from open to watch: FIFDH 2027, FETEN 2027, and JSKD Cankarjeva Residency.
- SXSW Film & TV 2027 was moved from upcoming to open after the official application page activated.
- UNIMA PASSPORT was moved to watch because every currently published place is marked awarded; the previously inferred August 4 deadline was removed.
- Imaginarius and Santiago Off were rechecked without inventing a new cycle.
- Eight near-term records were rechecked on current official organizer pages: Circusstad Circunstruction, Contact Ouest, Kyoto Art Center, SoloStage, Smethwick Puppetry, Cairo Film, CubaDupa, and Cirko w/.
- Cairo Film now exposes the precise official portal deadline of August 1 at 23:59 Cairo time and the current USD 30 late-submission fee. Travel and lodging remain unknown, and the record warns about the edition-number inconsistency on the regulations page.
- The other seven records retained their existing status, access boundary, and support assessment; only the evidence date changed after official revalidation.
- Five August 19–31 records were revalidated without changing their substantive assessment: Bergen Fringe, INAF27, UNIMA Abidjan, World Buskers Festival, and YPAM Fringe.
- FrancoFête en Acadie was corrected from an unsupported August 28 deadline to its official April 27–May 29, 2026 application period. It is now closed / `watch`, with the next cycle scheduled for an April 1, 2027 check.
- Four September 1–15 records were revalidated on current official sources: DIRECTORS IN TYA, IDFA Docs for Sale, Festival Mondial du Cirque de Demain, and IFFR.
- DIRECTORS IN TYA was materially improved: the organizer covers accommodation, catering, cultural events, and leisure activities. Travel remains normally self- or network-funded, with only a very limited support fund on request.
- DIRECTORS IN TYA’s access note now reflects the official exception allowing applicants from countries without a national ASSITEJ centre to obtain a recommendation from an ASSITEJ International member.
- RIDEAU 2027 remains an upcoming August 18–September 17 selection window. The official page confirms circus among five disciplines, but applicant eligibility, fees, and hosting terms are not yet public, so no unsupported access claim was added.
- Sundance’s current official PDF confirms the category-specific deadlines and 11:59 p.m. PST cutoff. The record now surfaces the earlier international-short and episodic late deadlines rather than showing only September 21.
- SXSW’s official pages contain a material timezone conflict: the Film submissions page says 11:59 p.m. CT, while the general deadlines and application pages say 11:59 p.m. PT. The dataset now discloses the conflict and recommends the earlier CT cutoff.
- ROSEQ’s seasonal route now includes an action-oriented eligibility and cost guide: CAD 65 per show/year in Scène Pro, up to five business days for validation, and a minimum of three interested presenters before a tour is built.
- ROSEQ’s public page states no citizenship restriction, making it a plausible local route for a Quebec-based non-Canadian resident, but the full launch conditions still need confirmation. Funding is intentionally deferred until presenter interest becomes a written tour offer.
- Adelaide Fringe 2027 and its internal Fringe Fund were revalidated from current official pages. Open worldwide access, September 8 registration, October 30 printed-guide date, February 19–March 21 festival dates, August 10 fund deadline, and international grant access remain supported.
- AOCA remains a valid indirect partner route for circus, street arts, and puppetry, but only Africa-based cultural organizations or the French cultural network can lead the application.
- Prague Fringe is now marked open based on the current official homepage. Its deadline note warns that the organizer calls October 31, 2026 “Friday” even though it is Saturday, and recommends the earlier October 30 submission date.
- Toronto BuskerFest and Waterloo Busker Carnival remain active 2026 performer routes with no published deadline. Their official pages still disclose only limited travel contributions, so fee, lodging, meals, and exact travel support remain `verify`.
- Toronto’s organizer-linked 2026 application form is now stored as a separate network source rather than leaving the application path implicit.
- Ottawa Buskerfest still invites performer inquiries, but its official 22-performer lineup is already published for August 7–9. The user-facing note now requires a quick availability check before treating the inquiry as a remaining 2026 place.
- Orford Musique’s current official page materially changed the economics of the residency: the two-week price is CAD 2,942.18 before scholarship and the scholarship range is 30%–65%. The database previously showed CAD 2,984.29 and 20%–40%; all three language versions are corrected.
- FIAMS’s 2027 call remains visible on the official organizer page. Its external Monday form could not be reopened, so the detailed July 22 audit date was preserved rather than overstated.
- The final integrity wave found no duplicate IDs, invalid primary URLs, broken funding references, broken opportunity references, future verification dates, or expired exact deadlines still marked open.
- Repeated source candidates were all explained by the data grain: distinct Seoul post IDs, two Pôle residency routes in one official PDF, and multiple funding components on official umbrella pages. `cirque-de-demain-2027` is intentionally shared between the top opportunity list and radar through an explicit link.

## Verification

- Baseline funding audit: 2 errors and 2 due reviews, isolated to the two Houston Arts Alliance annual 2027 records.
- Official HAA grants page and 2027 annual guidelines independently confirm the application period and deadline.
- Current funding audit: 0 errors and 0 due reviews.
- Radar status profile after corrections: 0 stale active records and 0 overdue review dates.
- Full build and tests: 25/25 passed.
- After the near-term review, radar count remains 176, with 0 stale active records and 0 overdue review dates.
- The initial full rerun correctly failed one evidence-date regression assertion after the new audits; the assertion was updated to the new verified set. The targeted rendered-data suite then passed 3/3, and `git diff --check` passed.
- After the FrancoFête correction, the profile is 39 open, 18 upcoming, and 119 watch records. The dataset still has 0 stale active records and 0 overdue review dates.
- The targeted rendered-data suite passed 3/3 after adding an explicit regression check for FrancoFête’s closed state and May 29 deadline; `git diff --check` also passed.
- The September 1–15 wave retained the profile at 176 records: 39 open, 18 upcoming, and 119 watch, with 0 stale active records and 0 overdue review dates.
- A targeted regression check now requires the DIRECTORS IN TYA record to disclose lodging, catering, and the no-national-centre recommendation route.
- The first targeted run caught an accidental Sundance evidence-date advance. Sundance was not researched in this wave, so its date was restored to July 22; the corrected targeted suite passed 3/3 and `git diff --check` passed.
- After the September 16–October 1 review, the radar still contains 176 records: 39 open, 18 upcoming, and 119 watch. Stale active and overdue-review counts remain 0.
- Regression checks now preserve RIDEAU’s `upcoming` state, Sundance’s category-level deadline summary, and SXSW’s official CT/PT conflict. The targeted suite passed 3/3 and `git diff --check` passed.
- Prague’s status change produces a profile of 40 open, 17 upcoming, and 119 watch records, still totaling 176. Stale active and overdue-review counts remain 0.
- Regression checks now preserve ROSEQ’s non-citizen caution, its deferred-funding state, Prague’s open state and weekday warning, and the current evidence dates for Adelaide and AOCA. The targeted suite passed 3/3 and `git diff --check` passed.
- The Canadian route wave kept the radar profile at 176 records: 40 open, 17 upcoming, and 119 watch, with 0 overdue review dates.
- Regression checks now preserve Orford’s CAD 2,942.18 price and 30%–65% scholarship, Toronto’s organizer-linked application source, and Ottawa’s already-published 22-performer warning. The targeted rendered-data suite passed 3/3 and `git diff --check` passed.
- The live link audit reached all 87 unique funding source and eligibility URLs: 82 were healthy, 5 returned access-restricted HTTP 403 responses, and none were dead, errored, or unreachable. The five restricted responses belong to current official Nunavut Commissioner and Yukon government URLs and do not justify speculative replacements.
- Final `npm run audit:funding-data`: 75 records, 50 exact deadlines, 25 without an exact deadline, 22 closed, 0 errors, and 0 reviews due.
- Final `npm run audit:funding-links`: 87 unique URLs; 82 healthy, 5 restricted, 0 dead, 0 errors, and 0 unreachable.
- Final `npm run lint`: passed.
- Final `npm run typecheck`: passed.
- Final `npm test`: production build passed and all 25 tests passed.
- Final `git diff --check`: passed.
- The build emitted a non-blocking advisory about a client chunk larger than 500 kB. It did not affect the build or tests and was not changed during this data-quality run.
- Final SHA-256: opportunities `048632ccaa851114d98d9751948b0cc070b723d7c1f7a1a8c3f149a7f3dbd9d0`; radar `fc33ba31a39f9767916191775f4ab6a8fb7ca54d2e0ef569d25ebad8a16699a0`; funding `a958e7f06549b2324e9b65224de4136ed610e979748143ec89bdd1b959cb206e`.
- Local-only smoke check: `http://localhost:3000/` and `http://localhost:3000/radar` both returned HTTP 200. No public URL was changed.

## Pre-existing State Preserved

- `.gitignore` was already modified before this run and is excluded from all staging and edits.
- The branch remains `main` at baseline commit `bbd4609`; no commit, push, deploy, or publication was performed.

## Unverified States

- No publication, deployment, browser/device visual QA, or production update is authorized in this run.
- Carthage Theatre Days remains at its July 22 official-form verification date because the official Google application form could not be reopened through the current research tools. No July 30 refresh is claimed.
- Guadalajara Film’s public official pages confirm the 2027 edition and a private submission area, but do not expose the August 18 deadline. The record remains at its July 22 verification date pending another authorized view of the private portal.
- The official Cirque de Demain page currently contains unrelated injected links after the organizer footer. The visible organizer application form still confirms the 46th-edition call and deadline, but users should avoid unrelated footer links.
- RIDEAU’s full 2027 selection rules are not yet published; only the August 18 opening, September 17 closing, event dates, and five disciplines are currently confirmed.
- SXSW has not resolved the CT/PT contradiction across its official pages. The data uses CT as the conservative operational cutoff rather than presenting either timezone as uncontested.
- ROSEQ’s official URL is serving or exposing inconsistent cycle versions. The current indexed text supports 2027–28, while some direct fetches still display the closed 2025–26 cycle.
- Prague Fringe’s detail page still contains several 2025 contractual references inside the 2027 call. Current participation fees, ticket splits, taxes, and settlement dates must be confirmed in the December 2026 contract.
- FIAMS’s official call page is current, but the external Monday application form was not readable in this wave. The detailed fee, accommodation, and international-travel assessment therefore remains explicitly dated July 22.

## Blockers

- Current source-access limitation: Carthage Theatre Days’ official Google application form is not readable through the research tools. This does not block the independent remaining waves.
- Guadalajara Film’s exact deadline is not visible on the public Eventival visitor page or FICG call index; this does not block the independent remaining waves.
- Cirque de Demain’s application content is usable, but the unrelated links after its official footer are a source-integrity warning to retain for final reporting.
- SXSW’s cutoff timezone cannot be normalized to one authoritative value while current official pages disagree. The displayed warning prevents silent deadline risk.
- ROSEQ’s cycle-display inconsistency and Prague Fringe’s stale contract copy remain source-quality warnings rather than unresolved data being silently normalized.
- FIAMS’s external Monday form remains a source-access limitation. The organizer page confirms the 2027 call, but no July 30 refresh is claimed for the form-only support terms.

## Morning Decisions

- Review the local report and dataset changes before any publication.
- Decide separately whether to publish the completed local changes.
- Revisit the source-quality warnings only when the affected official pages or private forms become readable; no immediate data rewrite is justified.

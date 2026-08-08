# Overnight Run State

## Status

- Status: COMPLETE
- Last updated: 2026-08-05 03:02 JST
- Current wave: complete — validated and closed

## Baseline

- Branch `main`, commit `bbd4609061c329db40d2460d59f6d1554c007822`.
- Pre-existing modifications: `.gitignore`, all three data JSON files, and `tests/rendered-html.test.mjs`; pre-existing untracked `overnight-runs/`.
- `data/festival-radar.json`: 221 records and 110 existing decision guides before this run.
- All 12 selected records currently lack `decisionGuide`.

## Completed Waves

- Ledger initialized and baseline captured.
- Current official pages reviewed for CINARS official programme, ROSEQ Rencontre d’automne, MICC Tour de Piste, and Festival FAR.
- Four source-bounded trilingual decision guides added; older conditions were not carried into unpublished next cycles.
- Wave 1 focused tests passed 25/25 and `git diff --check` passed.
- Heartbeat `mesure-quebec-decision-guides-until-07-30` created for 45-minute continuation through 07:30 JST.
- Four current En Piste pages and the linked Trajectoire programme terms reviewed; four trilingual guides added.
- Wave 2 focused tests passed 25/25 and `git diff --check` passed.
- Final four official pages reviewed; four trilingual guides added.
- Mentorat pancanadien deadline corrected from the stale May 29 value to the current official July 3, 2026 date.
- All 12 targets passed structural checks and the focused test suite passed 25/25 after every wave.
- Full funding audit, application tests/build, typecheck, lint, Pages static build, and diff checks passed.
- ID, title, and title-plus-city duplicates are zero. One pre-existing shared official PDF URL remains across two marionnette residency records; this run did not add it.
- Heartbeat `mesure-quebec-decision-guides-until-07-30` was deleted after completion.

## Current Wave

- None; run is complete.

## Next Action

- Hand off the local report and source ledger to the user.

## Blockers

- None.

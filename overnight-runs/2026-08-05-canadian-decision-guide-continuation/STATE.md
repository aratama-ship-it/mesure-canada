# Overnight Run State

## Status

- Status: ACTIVE
- Last updated: 2026-08-05 03:25 JST
- Current wave: monitoring checkpoint — 15 guides validated

## Baseline

- Branch `main`, commit `bbd4609061c329db40d2460d59f6d1554c007822`; existing dirty state and hashes recorded in `PLAN.md`.
- 221 radar records, 122 existing decision guides, and 99 records without decision guides before this run.
- All 12 selected targets lack `decisionGuide` at baseline.

## Completed Waves

- Ledger initialized, baseline captured, and 12 Canada-based targets selected from the missing-guide inventory.
- Four official pages reviewed and four bounded trilingual decision guides added. Unpublished 2027 rules for Calgary and Winnipeg remain explicitly unconfirmed.
- Wave 1 structure check, 25/25 focused tests, and `git diff --check` passed.
- Four additional official sources reviewed and four trilingual guides added. Contact East cadence corrected from stale biennial wording to the official annual wording; PDF guide visually rendered and text-checked.
- Four final Canada-based sources reviewed and four trilingual guides added. Manitoba's unavailable designated profile and Halifax's no-call homepage are explicitly marked verification-only; their former claims were not promoted into new-cycle conditions.
- Three further trilingual guides added from current Hamilton, Guelph, and ON THE EDGE organizer pages. Island Fringe PEI was not changed because its official page could not be inspected.
- Full checkpoint passed: funding-data audit (0 errors; 0 reviews due), `npm test` (25/25), typecheck, lint, Pages static build, duplicate/expired-open/review-due checks, and `git diff --check`. The only duplicate source URL is the pre-existing paired Pôle marionnette PDF.
- Decision-guide inventory is now 137 of 221 records (84 without a guide); this run added 15 guides. Protected baseline hashes for `.gitignore`, `data/funding.json`, and `data/opportunities.json` still match.

## Current Wave

- At the next heartbeat, first reread this state and check that no target source has materially changed. If safe official evidence exists, work one additional bounded Canada-based record; otherwise only rerun the targeted structural/diff checks. Stop expansion at 07:00 JST and finalize the ledger and automation removal by 07:30 JST.

## Next Action

- If validation passes, run full data/test/build audit and complete the run ledger.

## Blockers

- None.

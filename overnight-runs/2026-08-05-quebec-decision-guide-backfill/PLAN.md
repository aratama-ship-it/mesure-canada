# Overnight Run Plan

## Objective

Add source-bounded French, English, and Japanese decision guides to 12 Quebec- or Francophone-relevant festival-radar records by 07:30 JST on 2026-08-05.

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/web-projects/monosashi/quebec-opportunity-match`
- Writable paths: `data/festival-radar.json`, `tests/rendered-html.test.mjs`, and this run ledger.
- Baseline: branch `main`; commit `bbd4609061c329db40d2460d59f6d1554c007822`; pre-existing modified files `.gitignore`, `data/festival-radar.json`, `data/funding.json`, `data/opportunities.json`, `tests/rendered-html.test.mjs`; pre-existing untracked `overnight-runs/`.
- Baseline SHA-256: `data/festival-radar.json` = `75277dadb892c63d032eea7e208d8a45191b7a32f27ea6d632117842043cc4b7`; `tests/rendered-html.test.mjs` = `52e748ecc55353be6ed1628c6bf0eb52030e5aafb13ec1f7e8bcd0a6359999d0`.

## Definition of Done

- Exactly the 12 listed records have complete `decisionGuide` objects in `fr`, `en`, and `ja`.
- Official-source checks are recorded, including inaccessible or ambiguous states.
- Fixed test expectations are updated with the same target IDs.
- Audit, tests, typecheck, lint, Pages build, structural checks, and diff checks pass.
- No public or remote state is changed.

## Allowed Actions

- Read project files and applicable instructions.
- Read public official organizer or programme pages.
- Edit only the selected local data, matching test expectation, and run ledger.
- Run local validation and build commands.
- Create a temporary thread heartbeat after a successful manual wave, then delete it when complete.

## Prohibited Actions

- Do not push, deploy, publish, commit, stage, stash, send external messages, purchase, or change secrets.
- Do not delete user data.
- Do not infer eligibility, deadlines, fees, access, or organizer support not confirmed by the cited official source.
- Do not broaden changes beyond the 12 targets and their test expectation.

## Stop Conditions

- Record direction-changing decisions for the user.
- Stop unsafe work if the baseline changes unexpectedly.
- Stop adding a target if a current official source cannot support a safe guide and substitute another eligible record if available.
- At 07:00 JST, stop expanding scope and finalize validation and reporting; hard stop at 07:30 JST.

## Team

- Coordinator, explorer, writer, and verifier: root agent only; no subagents requested.
- Single-writer rule: only the root agent modifies the selected targets.

## Verification

- `jq` structural and target checks.
- `node --test tests/eligibility.test.mjs tests/rendered-html.test.mjs` after each wave.
- `npm run audit:funding-data -- --date 2026-08-05`
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build:pages`
- `git diff --check`
- Git HEAD, status, and protected dirty-file hash comparison.


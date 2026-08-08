# Overnight Run Plan

## Objective

By 07:30 JST on 2026-08-05, add source-bounded French, English, and Japanese decision guides to 12 additional Canada-based festival-radar records that remain without one.

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/web-projects/monosashi/quebec-opportunity-match`
- Writable paths: `data/festival-radar.json`, `tests/rendered-html.test.mjs`, and this run ledger.
- Targets: Nuit Blanche Toronto; Calgary Fringe; Yukon Fringe; Winnipeg Fringe; Festival des traditions du monde de Sherbrooke; Alberta Showcase; OSAC Showcase; Contact East; Pacific Contact; Manitoba Showcase; Halifax Fringe; Saskatoon Fringe; then, after the first 12 pass full validation, Hamilton Fringe; Guelph Fringe; ON THE EDGE Fringe; Island Fringe PEI.
- Baseline: branch `main`; commit `bbd4609061c329db40d2460d59f6d1554c007822`; pre-existing modified files `.gitignore`, `data/festival-radar.json`, `data/funding.json`, `data/opportunities.json`, `tests/rendered-html.test.mjs`; pre-existing untracked `overnight-runs/`.
- Baseline SHA-256: `.gitignore` = `a0561b0ac6f8b8448a4c23c7f0d96894ceb59f392049637e48f45484d824f686`; `data/festival-radar.json` = `986e4f83f8968c9418e456831c74079b374f8f24ff458b2efd0819cc71c445c8`; `data/funding.json` = `c36faf17c2d9e58d2b5f3e0b936f59d098cfcb63c6cfb9489fee8b7e04b37d16`; `data/opportunities.json` = `afaa18067d3ffd1264d58cb8844f370a31b09c3a5d0ec05952502c9e378dace4`; `tests/rendered-html.test.mjs` = `2190cbbd836d2d53b029126523da9bffc7ef9314dfcf3026e069c37cfb4e3709`.

## Definition of Done

- Each target that has enough current official-source evidence receives a complete `decisionGuide` in `fr`, `en`, and `ja`.
- Targets lacking sufficient current evidence remain unmodified and are recorded as blocked rather than inferred.
- Matching fixed test expectations are updated only for guides actually added.
- Official-source checks, tests, audits, build, and baseline comparison are recorded.
- No public, remote, or Git history state changes.

## Allowed Actions

- Read project files, public official organizer/municipal pages, and applicable instructions.
- Edit only selected target records, their matching test inventory, and this run ledger.
- Run local validation and local builds.
- Create a temporary thread heartbeat after a successful manual wave and delete it on completion.

## Prohibited Actions

- Do not push, deploy, publish, commit, stage, stash, send external messages, purchase, delete user data, or change secrets.
- Do not infer eligibility, citizenship, residence, deadlines, fees, organizer support, or funding.
- Do not change non-target records except a current-source correction discovered inside a selected target.

## Stop Conditions

- Stop a target when its official source is unavailable, contradictory, or insufficient for a safe guide; record it and continue independent targets.
- Stop if the baseline changes unexpectedly outside this run.
- Stop scope expansion at 07:00 JST and complete validation/reporting by 07:30 JST.

## Team

- Coordinator, explorer, writer, and verifier: root agent only; no subagents requested.
- Single-writer rule: only the root agent changes canonical project files.

## Verification

- Target JSON structure and duplicate checks via `jq`.
- `node --test tests/eligibility.test.mjs tests/rendered-html.test.mjs` after each wave.
- `npm run audit:funding-data -- --date 2026-08-05`
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build:pages`, and `git diff --check`.
- Final Git status, HEAD, and protected-hash comparison.

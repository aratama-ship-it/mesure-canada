# MESURE Library Expansion Plan — Until 10:00 JST

## Objective

2026年7月31日から2026年8月1日10:00 JSTまで、MESURE Canadaで実際に検索・表示される公募ライブラリ本体を、公式一次情報に基づいて継続拡張する。

## Scope

- Working directory: `/Users/arata/Library/Mobile Documents/com~apple~CloudDocs/claude code files/app-dev/quebec-opportunity-match`
- Writable paths:
  - `data/festival-radar.json`
  - `tests/rendered-html.test.mjs`
  - `overnight-runs/2026-07-31-mesure-library-expansion-until-10/STATE.md`
  - `overnight-runs/2026-07-31-mesure-library-expansion-until-10/REPORT.md`
- Baseline branch and commit: `main` at `bbd4609061c329db40d2460d59f6d1554c007822`
- Starting library count: 189 records
- Starting `data/festival-radar.json` SHA-256: `877679eab6009c2b192c4de11fd9ee64c994201827989f096e78549be77b6763`
- Starting `tests/rendered-html.test.mjs` SHA-256: `5511badf301ef81930470cde86755acd82c505c75e34c02c5b85cc5be02fea35`

## Definition of Done

- Add only new, non-duplicate records whose title, location, route status, deadline or unpublished state, eligible art form or applicant, official URL and verification date are confirmed by an official organizer, municipality or arts institution.
- Every added record includes French, English and Japanese display text plus a Quebec decision guide that distinguishes direct, conditional, self-funded, partner-dependent and unverified routes.
- Finish at 2026-08-01 10:00 JST with JSON integrity, build, all tests, lint, typecheck, diff checks and final ledger validation.

## Allowed Actions

- Read project files, applicable instructions and the previous completed run.
- Search and read official organizer, government, venue and arts-institution sources.
- Add bounded records to `data/festival-radar.json`.
- Add only the corresponding minimum regression coverage to `tests/rendered-html.test.mjs`.
- Update this run’s `STATE.md` and `REPORT.md` after every wave.
- Run local builds, tests, lint, typecheck, JSON and diff checks.

## Prohibited Actions

- Do not push, deploy, publish, send external messages, purchase, submit applications or change secrets.
- Do not delete user data.
- Do not modify `.gitignore`, `data/funding.json`, application UI or files outside the four writable paths.
- Do not use social posts, directories, aggregators or search snippets as the sole evidence for an added record.
- Do not infer deadlines, fees, support, nationality, residence or partner requirements.
- Do not start subagents.

## Stop Conditions

- Stop and record the issue if the 189-record baseline or protected-file hashes change unexpectedly.
- Do not add a record when title and location, official application URL, or the underlying route already exists.
- Record official but incomplete candidates as unverified rather than filling missing facts.
- After 2026-08-01 09:30 JST, stop new research and additions and begin final verification.
- At or after 2026-08-01 10:00 JST, complete the report, validate the ledger and stop the automation.

## Team

- Coordinator: scope, waves, stop decisions and final handoff.
- Explorer: official-source discovery and duplicate checks, performed sequentially.
- Writer: this single unattended agent only.
- Verifier: independent commands after each write and full final checks.

## Wave Priority

1. Current or imminent deadlines through September 2026.
2. Canadian regions not yet strongly represented, including British Columbia, Alberta, Prairies and Atlantic Canada.
3. Nearby United States routes usable from Quebec.
4. International circus, street arts, busking, fringe, residency and curated showcase opportunities.
5. Previously incomplete candidates only when the official source now resolves the missing facts.

## Verification

- `jq -e 'type == "array"' data/festival-radar.json`
- unique IDs, title/location and official source URL checks
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `git diff --check`
- `python3 /Users/arata/.codex/skills/overnight-project-runner/scripts/validate_run.py overnight-runs/2026-07-31-mesure-library-expansion-until-10 --final`
